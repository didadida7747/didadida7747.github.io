# 2026科协暑培 · 第6讲 MLSys：从反向传播到并行计算（徐汝一, BV1KwMQ6GEcp）

## 定位

AI Track 第二讲，方向介绍 + 一次完整的"公式推瓶颈"示范。讲者徐汝一（2026 届本科毕业）一句话定义 MLSys：有一个模型运行在显卡上，怎么把它跑得更快、或用的显卡更少更省。本讲价值有二：一是 Roofline 推导本身（能推出"显卡与模型严重不匹配"这个结论）；二是讲者对"本科生为什么值得做系统方向"的三点论证——对纠结科研方向的读者，这比公式更值钱。约 26 分钟。课程主页 https://summer26.net9.org/ai/ML/ 。

## 知识整理

### 领域地图：System for ML 与 ML for System

MLSys 分两支：System for ML（用系统技术帮 ML：训练更快、推理更便宜、部署更稳）与 ML for System（用 ML 帮传统系统：预测任务运行时间以自动选编译优化策略、资源调度、芯片设计）。本讲聚焦前者，也是本科生最常见的入口。

一个有说服力的例证：DeepSeek、Kimi K3 等国内模型与 ChatGPT/Claude 能力仍有代差，但 AI Infra 做得好——同型号显卡"功率拉到最满"、全部性能用于生成 token，所以 DeepSeek 的 token 能卖得比 ChatGPT 便宜。

### 为什么值得本科生长期投入

讲者给三点：其一，科研要持续做有挑战的事——很多同学去 AI 大厂预训练/后训练团队做的是数据质检、对接标注员，与大一微积分线代关系很小，而 agent loop 会进一步压缩这类任务的挑战性，不如做更硬件、更系统、更底层的事。其二，AI Infra 未来有保障——即使训练算法收敛，AI 应用渗透远不充分，应用市场 → 更多 token 需求 → 需要"等量显卡跑出更多 token"。其三，科研流程两段式可预知——先做性能 profile、基于性能漏洞用公式推理出优化方法，再做工程实现；预期提速/省显存完全可预知，"不像 ML 算法像抽奖、炼丹"。

### Roofline 模型与 decode 场景

Roofline model：一步（decode）时间 = max(T_mem, T_compute)。T_mem = 需要读取的显存量/显存带宽；T_compute = 该步浮点操作量/显卡峰值算力。谁大谁是瓶颈（memory bound / compute bound）。

decode 场景的特殊性：自回归 decode 每步要把全部模型参数读一遍而实际 attention 计算量不大；序列变长后每步要读整个 KV cache；KV cache 占满 HBM（高带宽显存）后溢出到更慢的存储，速度进一步下降。背景趋势：agent 发展迅速，未来上下文可能从 1M token 到 1000 万甚至 1 亿（100M）。

### 推导：模型与显卡严重不匹配

公式：T_mem = (N_T + B×K)/BW_memory，N_T 为模型总参数量（如 DeepSeek 671B）、B 为 batch size、K 为 KV cache 大小；T_compute = B×N_A/peak FLOPS，N_A 为激活参数量（MoE 只读被激活的专家）。令 T_mem = T_compute（Roofline 最优）解出 B ≥ (N_T/N_A)×(FLOPS/BW)。dense 模型 N_T/N_A = 1，稀疏 MoE 可达几十；英伟达最好的 Blackwell 显卡 FLOPS/BW ≈ 300 且相对固定——因此 batch size 至少要几百到几千。

核心结论：当 KV cache 远大于 N_T 时，硬件的 FLOPS/带宽（约 300）应匹配模型的"激活参数量/KV cache 总量"之比；现实两者差约 1000 倍量级。即便 sparse attention 把 K 缩小 10 倍/100 倍/1000 倍，右边才勉强到 1，左边仍是 300。三条出路：带宽提升约 300 倍；把 KV cache 做得更稀疏/latent、memory 压到约 1/30000；或增大激活参数——预示 Scaling Law 还没停，可能还要往上几百倍。讲者声明这是他"一家的猜想"，并跑了简单实验放 PPT 里论证。

### 入门路径与方向选择

三步：①不要先囤很多课等自己"够 qualified"——先找老师表明想做该方向，在学长/老师指导下读约 10 篇论文就已足够，learning by doing、Get your hands dirty；②在做项目中学必备工具：PyTorch、服务器使用、nvidia-smi、PyTorch Profiler、Nsight，并理解科研项目如何 0→1 构建；③跟学长发出一篇 paper 后，再独立立项。

方向选择：起步推荐 kernel 或推理系统——训练系统要被大家信任需要大量算力与实验验证（只有像 DeepSeek 那种提出 RL 算法的东西才会被信），清华实验室资源未必够；推理系统需要很少显卡、kernel 几乎不需要显卡，反而要静心学 CUDA/Triton 一两个月即可掌握很多。相关课程清单在讲义/PPT。

## 勘误对照

| 转写 | 应为 |
|---|---|
| M m c4/MCX/arm cs/MRCS/r is | MLSys |
| deep sick/desk/DEPC/DESIFT/deep shift/DC | DeepSeek |
| KV开始/KVT/kv catch/KV cash/ka cash/"开源了" | KV cache |
| computer bd/computer档/TCONTRO | compute bound / T_compute |
| not to regressive | autoregressive |
| tension | attention |
| BKB/BNAB | B×K / B·N_A |
| FORWOR | forward |
| dance | dense |
| "这个数就是E" | 这个数就是 1 |
| MOL | model |
| SPA city/SPA c t | sparsity |
| skin law/往上 SK | Scaling Law |
| 非神似 | efficient |
| 复联操作/出点数 | 浮点操作/浮点数 |
| A证 | Agent |
| 克隆 | kernel |
| SCE | scale |
| one size | MLSys（存疑） |
| VP | B站（存疑） |

## 编者补充

- 编者补充（跨集联系）：开场问题"loss.backward() 和 optimizer.step() 背后发生了什么"正与第 5 讲的四层框架衔接——本讲管的是"架构跑在什么硬件上"这层；结论"Scaling Law 可能还要往上几百倍"又呼应第 5 讲结尾"大模型下半场"。
- 编者补充（行动线）：按讲者三步入门执行——先找做系统方向的老师/学长表明意向 → 按其书单读约 10 篇论文 → 直接上手做；起步选 kernel/推理系统，抽 1–2 个月学 CUDA/Triton；工具先装 nvidia-smi、PyTorch Profiler、Nsight，对一个小模型跑一次 profile。
- 编者补充（缺口）：转写 18:10–20:08 一段损毁严重（如"11年的KK开始他的1K1K"），关键推导中间量与验证实验需对照讲义补全；结尾课程清单只在 PPT 中，转写未含具体课名。
