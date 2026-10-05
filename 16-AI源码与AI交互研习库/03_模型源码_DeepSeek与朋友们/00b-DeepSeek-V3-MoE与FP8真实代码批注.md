---
title: "00b · DeepSeek-V3 真实代码批注：MoE 分发与 FP8 分块量化"
---

# 00b · DeepSeek-V3 真实代码批注：MoE 分发与 FP8 分块量化

> 素材：本库 clone 的 `DeepSeek-V3/inference/model.py`（808 行，行号为实测）。前置：[00 篇（MLA 与 Gate）](#/doc/d443)。
> 00 篇讲了"数学思想"，本篇讲"代码现实"——两段代码会颠覆你对"模型代码"的想象：**模型文件里写满了集群假设**。

## 1. MoE 类（636-695 行）：一段"写着写着就变成分布式系统"的模型代码

### 1.1 `__init__`：专家在出生时就分好了家

```python
assert args.n_routed_experts % world_size == 0, ...
self.n_local_experts = args.n_routed_experts // world_size
self.experts_start_idx = rank * self.n_local_experts
self.experts_end_idx = self.experts_start_idx + self.n_local_experts
self.gate = Gate(args)
self.experts = nn.ModuleList([Expert(args.dim, args.moe_inter_dim)
                              if self.experts_start_idx <= i < self.experts_end_idx
                              else None
                              for i in range(self.n_routed_experts)])
self.shared_experts = MLP(args.dim, args.n_shared_experts * args.moe_inter_dim)
```

【批注】这是整个文件最有教育意义的几行：
- **"专家表"里装着一堆 `None`**：256 个专家（实际配置），本卡只持有 `n_local_experts` 个，其余位置用 `None` 占位。专家的"所有权"按 `rank`（GPU 编号）切好——这就是**专家并行（EP）**：不是训练脚本的外围安排，而是**模型定义本身**。
- 对照 00 篇 Gate 的"组限制路由"：路由的分组约束就是为了让一个 token 的 8 个专家尽量少跨机器。**模型结构和通信结构是同一张图的两面。**
- 共享专家 `shared_experts` 单独建、不进列表——它每个 token 都要算，没有路由问题，也就没有跨机问题。

【你能学到】读模型代码遇到 `world_size / rank / None 占位`不要跳过——那正是"论文里的架构"和"跑得起来的系统"之间的差距所在，也是面试和工程里最值钱的部分。

### 1.2 `forward`：一次最朴素的 MoE 分发

```python
weights, indices = self.gate(x)                # Gate 打分选专家（00 篇第 2 节）
y = torch.zeros_like(x)
counts = torch.bincount(indices.flatten(), minlength=self.n_routed_experts).tolist()
for i in range(self.experts_start_idx, self.experts_end_idx):
    if counts[i] == 0:
        continue                               # 本卡上的这个专家：没人来 → 跳过
    expert = self.experts[i]
    idx, top = torch.where(indices == i)       # 找出路由到专家 i 的所有 token
    y[idx] += expert(x[idx]) * weights[idx, top, None]
z = self.shared_experts(x)                     # 共享专家：全员都要过
if world_size > 1:
    dist.all_reduce(y)                         # 跨卡汇总结果
return (y + z).view(shape)
```

【逐行批注】

**`bincount` 那一行是全段的题眼**：统计每个专家收到了多少 token。demo 里它只用来跳过空转专家（`counts[i] == 0`），但想一层生产环境：这个 counts **就是负载曲线**——某些专家 heat 到爆、某些空转，正是 00 篇 Gate bias（辅助无损负载均衡）要压平的对象，也是 **DeepEP**（02 篇）要优化的通信模式出现的原因。**demo 代码的每一行朴素实现，都精确对应一个生产级组件要解决的问题。** 这就是为什么值得读"玩具版"官方实现。

**`y[idx] += expert(x[idx]) * weights[idx, top, None]`**：加权累加写成了"scatter 加法"。注意 `+=`：多个专家的贡献累加到同一个 token 上——MoE 输出 = 各被选中专家的加权和。

**`dist.all_reduce(y)`**：每个 GPU 只算了"自己那部分专家"的输出，最后把各卡的部分和相加。一行代码，就是训练/推理时**通信成本**的来源之一——生产里它演化成 all-to-all（DeepEP 的主战场），demo 里它就老老实实 all_reduce。

**`(y + z)`**：路由专家（个性化加工）+ 共享专家（通用加工）最后相加。共享专家为什么存在？给每个 token 提供"人人相同的公共知识"，让 256 个路由专家可以放心地只学差异化知识——**用冗余换路由效率**。

## 2. FP8：分块量化在代码里的样子

00 篇讲过论文的"细粒度量化"（激活 1×128 tile、权重 128×128 block）。看代码（`model.py` 头部与 Linear 类）：

```python
block_size = 128                                   # 第 15 行

# Linear.forward 里（激活值）
x, scale = act_quant(x, block_size, scale_fmt)     # 每 128 个元素一组，算自己的 scale

# 权重侧：scale 张量的形状
scale_out_features = (out_features + block_size - 1) // block_size
scale_in_features  = (in_features + block_size - 1) // block_size
# → 一个 7168×7168 的权重矩阵，scale 是 56×56 的"缩放因子网格"

# MLA forward 里（481 行），wkv_b 权重按需反量化
wkv_b = self.wkv_b.weight if self.wkv_b.scale is None \
        else weight_dequant(self.wkv_b.weight, self.wkv_b.scale, block_size)
```

【批注】

1. **`(out + 127) // 128` 这两行就是"128×128 block"的代码形态**：每 128×128 的小块配一个独立 scale（缩放因子），存在一张小网格里。量化时块内数值除以自己的 scale，反量化时乘回来——**"细粒度"三个字，落地就是这张 scale 网格**。
2. **权重存 FP8 + scale，用到时才 `weight_dequant`**：注意 481 行的反量化只在"吸收模式"需要 wkv_b 矩阵时发生——存的是压缩态，算的时候临时展开。**存储格式和计算格式是两套，中间的转换点就是性能优化的战场**（FlashMLA/DeepGEMM 优化的正是这些转换与乘算）。
3. `act_quant` 每次前向都跑——激活值的量化是**运行时开销**，这就是论文为什么要在 CUDA Core 上做 128 路累加保精度：省下来的带宽要大于量化+累加的额外计算，这笔账 FP8 才划算。
4. 【面试/工程视角】"FP8 训练难在哪"的完整答案现在可以三段式给出：数值范围小 → 细粒度分块缩放解决 → 分块带来运行时开销 → 用硬件友好的累加与 kernel 化解决。每一环都有代码对应物。

## 3. 收束：三段代码，一条主线

| 代码 | 表面在干什么 | 实际暴露的问题 | 生产组件 |
|---|---|---|---|
| `experts` 列表 + None 占位 | 专家分布在不同卡上 | 专家间通信不可避免 | DeepEP |
| `bincount` 统计 | 跳过空转专家 | 负载不均 → 某些卡空转 | Gate bias 负载均衡 |
| `block_size=128` + scale 网格 | FP8 存储与计算 | 精度 vs 带宽的账 | DeepGEMM kernel |

【总批注】读模型源码的诀窍在这张表里：**每一段朴素实现都是某个生产级基础设施的"问题陈述"**。DeepSeek 开源周的四大件（02 篇）不是凭空发明的库，而是这段模型代码里每个 `all_reduce`、每个 `counts`、每个 `scale` 的工业级答案。先读模型代码发现疼点，再读基建代码看答案——这个阅读顺序比反着来效率高十倍。

## 思考题

1. `counts[i] == 0: continue` 在 demo 里是优化，在生产环境里同样的条件意味着什么？（提示：一张卡上的专家全员空转 = 什么成本？）
2. 为什么共享专家不需要路由、也不参与 all_reduce 前的分布式计算？如果让它也 EP 化会怎样？
3. 权重的 scale 网格是 56×56——反过来算，主模型隐层宽度 dim 是多少？（提示：7168，这也是 Gate 里 `bias` 只在 `dim == 7168` 时创建的原因——它只服务 671B 那一档）

---

回 [00 篇](#/doc/d443) ｜ 下一篇可读 [01-R1](#/doc/d445)
