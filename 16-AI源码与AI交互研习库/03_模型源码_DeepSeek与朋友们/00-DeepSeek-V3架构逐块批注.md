---
title: "00 · DeepSeek-V3 架构逐块批注：671B 参数怎么省着用"
---

# 00 · DeepSeek-V3 架构逐块批注：671B 参数怎么省着用

> 素材来源（全部已验证）：官方仓库 `deepseek-ai/DeepSeek-V3` 的 `inference/model.py`（808 行，MIT 协议，只有推理代码不含权重）+ 技术报告 arXiv 2412.19437。
> 本篇的读法：每段贴一小段官方代码原文 → 批注它在干什么 → 【为什么这样设计】。你不需要会 PyTorch，看得懂数学直觉就行。

## 0. 一张图看懂 V3 的省字诀

```
传统稠密大模型（如 Llama 70B 级）：
  每个 token 都过全部 700 亿参数 → 显存/算力双爆炸

DeepSeek-V3（671B 总参 / 37B 激活）：
  ① MoE：每 token 只激活 37B 参数（省算力）
  ② MLA：KV 缓存压缩到 1/10 量级（省显存）
  ③ FP8 训练：数字精度砍半（省带宽）
  ④ MTP：一次预测多个 token（省时间）
  → 效果：API 价格能打到同行 1/10，还开源了
```

【总批注】V3 的所有创新都指向同一个目标：**把"智能/成本"这个比值往死里卷**。这不是学术炫技，是商业护城河。看懂这一点，后面每个设计都有了主线。

## 1. MLA：把 KV 缓存压缩 10 倍的魔法

### 先补课：KV Cache 是什么、为什么疼

LLM 生成第 N 个 token 时要"回看"前 N-1 个 token，每个历史位置的 K（键）、V（值）都得缓存着。传统多头注意力（MHA）下，这份缓存的体积 ∝ 层数 × 头数 × 头维度 × 序列长度。序列一长，显存先爆。

### 官方代码（model.py 的 MLA 类，已验证摘录）

```python
# 超参（config_671B 实际值）
kv_lora_rank: int = 512        # 压缩后的"潜空间"维度
qk_nope_head_dim: int = 128    # 每头的"内容"维度
qk_rope_head_dim: int = 64     # 每头的"位置"维度（RoPE）
v_head_dim: int = 128

# ---- __init__ 里的关键结构 ----
self.wkv_a = Linear(self.dim, self.kv_lora_rank + self.qk_rope_head_dim)
#            ↑ 把整个隐向量压成 512+64 维！
self.kv_norm = RMSNorm(self.kv_lora_rank)
self.wkv_b = ColumnParallelLinear(self.kv_lora_rank,
                    self.n_heads * (self.qk_nope_head_dim + self.v_head_dim))
#            ↑ 需要时再用大矩阵从 512 维"还原"出所有头的 K/V

# ---- forward 里缓存的只有压缩向量 ----
else:  # 吸收(absorb)实现模式
    self.kv_cache[:bsz, start_pos:end_pos] = self.kv_norm(kv)   # 只存 512 维
    self.pe_cache[:bsz, start_pos:end_pos] = k_pe.squeeze(2)    # 只存 64 维位置
```

### 逐行批注

- `wkv_a`：**压缩的源头**。不管模型有 128 个头、每个头 128 维，统统先压成一个 512 维的共享潜向量（`c_KV`）+ 一段 64 维的位置编码（k_pe）。缓存里只放这两样。
- `wkv_b`：**按需展开**。算注意力时再用这个大矩阵把 512 维还原成每个头的 K 和 V。因为 W^KV_B 对每个 token 都一样，它不需要被缓存。
- `kv_cache`/`pe_cache` 两个 buffer：对比 `naive` 模式（直接缓存全部头的 K/V）就能看出省了多少——**从 (128头 × (128+128) 维) 压到 (512 + 64) 维**，约为 MHA 的 1/10 到 1/20。

【为什么这样设计】数学上这叫低秩压缩：作者观察到 K、V 矩阵高度冗余（很多头的信息重复），于是不存原始值、存"生成它们所需的最少信息"。**KV 缓存小 10 倍 = 同样显卡能服务 10 倍并发或 10 倍长上下文 = 成本优势的根基。**

【代价与教训】MLA 的计算图和标准 attention 不同，主流 GPU kernel（FlashAttention 等）都不支持 → DeepSeek 被逼着自己写 kernel（于是有了后面开源的 FlashMLA）。**架构创新会制造工程债，而他们选择把债转成护城河再开源。**

## 2. MoE 门控：37B 是怎么从 671B 里挑出来的

### 官方代码（Gate 类，已验证摘录）

```python
def forward(self, x):
    scores = linear(x, self.weight)
    if self.score_func == "softmax":
        scores = scores.softmax(dim=-1, dtype=torch.float32)
    original_scores = scores
    if self.bias is not None:          # ← ① 负载均衡的 bias
        scores = scores + self.bias
    if self.n_groups > 1:              # ← ② 分组限制路由（V3.1 之后启用）
        ...组内选前几组，其他组 -inf 屏蔽...
    indices = torch.topk(scores, self.topk, dim=-1)[1]   # ← ③ 挑出 top-k 专家
    weights = original_scores.gather(1, indices)          # ← ④ 注意：用不带 bias 的原始分
    if self.score_func == "sigmoid":
        weights /= weights.sum(dim=-1, keepdim=True)
    weights *= self.route_scale
    return weights.type_as(x), indices
```

### 逐行批注

- **③ topk**：256 个路由专家里每个 token 只选 8 个（`top-8`），外加 1 个"共享专家"（每个 token 必过，负责通用知识）。671B → 37B 的魔法就是这一行。
- **① bias 的用法是全文最妙的一笔**：`scores + bias` 影响选谁（topk 之前加上），但 **④ 加权求和时用的是 original_scores（不带 bias）**。为什么？
  - 如果 bias 参与加权，bias 就有了梯度，训练会被"人为分数"扭曲；
  - bias 只用来"选人"：哪个专家太挤就压低它的选分，哪个专家闲置就抬高它——**它是调度员，不是评委**。这就是论文里"辅助无损负载均衡（auxiliary-loss-free）"的代码形态：不用额外的 loss 项（那会伤模型质量），靠一个不进梯度的 bias 调节。
- **② 组限制路由**：先把 256 个专家分组，每组内先选组再选专家。V3 预训练时组数=1（等于没开），后训练/部署阶段用于**节点限制**（每 token 最多跨 4 台机器，见下）。一个代码开关服务两个阶段的两种需求。

【为什么这样设计】MoE 的死穴是"赢家通吃"（几个专家被过度使用，其余闲置），传统解法是加辅助 loss 惩扎偏科，但辅助 loss 会干扰主任务。DeepSeek 的解法把"调控"和"学习"彻底分离——**bias 只改路由决策、不进梯度**，兼顾负载均衡和模型质量。

【工程暗线】每 token 的 8 个专家可能分布在不同机器上 → 跨机通信成为训练瓶颈 → 这条暗线引出 DeepEP（02 篇）。

## 3. FP8 训练：8 bit 数字练 671B 模型

技术报告（已验证）核心做法：

- 激活值按 **1×128 tile** 缩放，权重按 **128×128 block** 缩放（E4M3 格式）；
- 在 CUDA Core 上做 **128 路累加**保精度（而不是用 Tensor Core 的默认累加）。

【为什么这样设计】FP8 的动态范围极小，直接量化会把小数值挤成 0。DeepSeek 的思路是"化整为零"：把大矩阵切成小块，每块独立算自己的缩放因子——块内数值接近，量化损失就小。**细粒度缩放 = 用分组的方式骗过物理极限。** 这套做法后来成了业界 FP8 训练的事实标准（Kimi K2 也用 block-FP8）。

【你能学到】"精度换成本"是模型工程的大方向（FP32→BF16→FP8→FP4）。每一步都需要有人解决数值稳定性，而解决方案的套路惊人一致：**更细粒度的缩放 + 关键路径保精度**。

## 4. MTP：一次训练，两个用法

Multi-Token Prediction：模型除了预测下一个 token，还额外挂一个浅层模块同时预测下下个。

- **训练时**：多一个预测任务 = 更稠密的训练信号，逼模型学更长程的规划（报告：损失权重 λ 前期 0.3、后期 0.1）；
- **推理时**：这个模块可以拿来当"草稿模型"做投机解码——小模块先猜 2 个 token，主模型一次验证，报告结论是可复用该模块换吞吐（社区实测常引 ~1.8x 提速，依部署而异，官方报告未给具体数字——**引用时注意这个区别**）。

【为什么这样设计】一份参数、两份收益，且推理时不想用可以整个扔掉（685B 权重里 14B 是 MTP 模块）。这种"训练期埋钩子、推理期可拆卸"的设计思路在后续开源模型里被广泛效仿。

## 5. 训练成本：为什么总被引用

报告 Table 1（已验证）：预训练 2.664M + 上下文扩展 119K + 后训练 5K ≈ **278.8 万 H800 GPU 小时，按 $2/小时 ≈ $557.6 万**；预训练数据 **14.8T tokens**。

【批注】这个数字是"高效架构+高效基建+高效训练法"的乘积，也是 2025 年初英伟达股价那次著名暴跌的导火索。**它证明的命题很朴素：智能的边际成本可以被工程压到很低。** 后面 02 篇的四大基建件就是这句话的零件清单。

## 6. 版本时间线（2026.10 视角，均已验证）

| 版本 | 时间 | 关键词 |
|---|---|---|
| V3 | 2024.12 | 671B/37B、MLA、FP8、MTP |
| R1 | 2025.1 | 纯 RL 推理（01 篇） |
| V3.1 | 2025.8 | 混合思考模式（thinking/non-thinking 一个模型） |
| V3.2-Exp | 2025.9 | **DSA 稀疏注意力**（lightning indexer 选 top-k token），API 降价 50%+ |
| V4 线 | 2026 | 官方 API 已切换 deepseek-flash / deepseek-v4-pro |

【批注】V3.2 的 DSA 值得单独记一笔：在 MLA 之上再加一层"token 级检索"——轻量 indexer 给全上下文打分，注意力只算 top-k（k=2048）个 token。**这是"注意力也稀疏化"路线的工业落地，方向上和 MoE 稀疏激活一致：都是"不要平均用力"。** FlashMLA/DeepGEMM 的当前版本已在配套 DSA kernel。

## 7. 读代码实操路线

```bash
git clone --depth 1 https://github.com/deepseek-ai/DeepSeek-V3
# 或直接看 07_源码仓库/DeepSeek-V3（已 clone）
# 只有一个值得读的文件：
# inference/model.py（808 行，行号以本库 clone 的 main 分支为准）
#   第 76 行起    ModelArgs 超参（MLA/MoE 默认值）
#   第 396-499 行 MLA 类（本篇第 1 节；wkv_a 在 430，kv_cache 在 443）
#   第 535-600 行 Gate 类（本篇第 2 节；bias 只用于选专家的关键行在 forward 内）
#   第 636-695 行 MoE 类（共享专家求和 + bincount 统计，对照 02 篇 DeepEP 的动机）
```

读完的验收：你能对朋友讲清楚"为什么 DeepSeek 的 API 便宜"——答案不在商业模式，在这四行代码：`wkv_a`（MLA 压缩）、`topk`（稀疏激活）、`bias`（均衡不伤模型）、`tile`（FP8 细粒度）。

---

下一篇：[01-DeepSeek-R1](#/doc/d445)
