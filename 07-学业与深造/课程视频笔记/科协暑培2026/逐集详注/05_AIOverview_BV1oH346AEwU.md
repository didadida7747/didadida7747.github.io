# 2026科协暑培 · 第5讲 AI Overview（杨凯森, BV1oH346AEwU）

## 定位

AI Track 第一讲，给出贯穿后续所有 AI 讲次的四层分析框架：数学建模、模型架构、Data、Benchmark。这是本合集 AI 线的"地图"讲——遇到任何新术语，先问"它在改哪一层"。适合作为第 6–10 讲的前置；已有的 8 月蒸馏笔记《现代 AI 的四层分析框架》可替代大部分重看。约 41 分钟。课程主页 https://summer26.net9.org/ai/overview/ 。

## 知识整理

### 四层分析框架

学/研 AI 可分四层：①**数学建模**——用数学公式定义学习对象，如 next token prediction 还是扩散建模；②**模型架构**——用可训练的计算结构（残差连接、attention）把公式实现成矩阵运算；③**Data**——在 dataset 上做梯度下降，决定数以百亿计待定参数的取值；④**Benchmark**——研究者心中的指标，决定"在什么上刷高分"与下一轮研究选择。

### 判别式 vs 生成式

判别式完成确定性映射：分类（输出类别分布但过程确定）、回归（房价预测）、单目深度估计（有损问题，靠网络学到的先验补全）、语义分割。生成式学习数据分布本身，答案不唯一，核心动作是"采样"；生成式模型也可以完成判别式任务。

### 生成式建模范式细览

按"离散/连续 × 自回归/扩散"展开：**离散自回归**即 LLM（词表约 15 万 token，逐位置采样）；**连续自回归**预测连续条件密度（如机器人控制）；**离散扩散**即掩码扩散语言模型（状态由正常 token 与 mask 组成，逐步决定 keep/replace，从全 mask 序列还原）；**连续扩散**用于生图，可学噪声/score/velocity/x-prediction 之一，flow matching 对应 ODE、score matching 对应 SDE。隐变量路线：VAE（数据分布映射到已知概率密度的高斯先验故可直接采样，是扩散模型的前身，如今主要用于把图像 encode 进隐空间加速训练）、GAN（generator 与判别器对抗协同变强）、EBM（讲者称现在少用、未展开）、normalizing flow（数据分布与先验间完全可逆的变换，VAE 变体）。

**训推一致性**是个关键概念：训练需覆盖推理时实际访问的所有状态。AR 在真实前缀上训练、推理时自己 roll out，会错误累积；扩散训练学局部去噪，推理靠多步迭代。设计不好即"训推不一致"。

### 架构层：解耦观点

架构层两个考虑点——输入表示（语言的 embedding；扩散先切 4×4 像素 patch 映射成 latent）和信息交互的结构假设（CNN 局部交互、RNN 时间递归、Transformer 假设最少：QKV 投影、内积定 attention 比例；full attention 未必最优，已有新架构在拓其上限）。

核心观点：**建模与架构完全解耦**——同一 Transformer 加因果掩码做 GPT 式 next token prediction，去掉掩码即做图像扩散的 v-prediction；同一扩散建模可用 UNet（卷积 + U 型跳跃连接保细节）或 DiT。细节选择含 dense FFN vs 稀疏专家（MoE）、FP32/FP16/BF16/INT8。"扩散模型其实可以理解成一个多步的 VAE。"

### Data 层：学习算法统一视角

训练即反向传播，loss 可写为 Σ αᵢ·L(xᵢ, yᵢ)：xᵢ 定"看见什么"，yᵢ 定 label，**αᵢ 的设计就是学习算法**（SFT/RL/DPO 皆可放入此框架）。现代 LLM 流程：预训练 → instruction following 的 SFT → RLHF 偏好对齐 → 合成数据 → RL 交互 feedback → DPO，已是团队作战。讲者强调：建模和架构都有备选项，唯独 Data 人人都要用，"数据的选择定义模型有多强"，是最 fundamental 的一环。

### Benchmark 层

"Benchmark 就是通过报分，让研究者脑中形成一个反向传播……benchmark 之于人类类似于 dataset 之于模型。"在 fake data 上训练会 out of distribution；能被 hack 的 benchmark 造出的 AI 同样无用。需关注任务、数据、协议、指标与测试不确定性；benchmark 会饱和（大模型时代两三个月被刷爆，刷到 99.5x 后浮动无意义），好的 benchmark 应给现有模型"明确的梯度"。

### 案例一：图像生成——瓶颈在 benchmark

MNIST/ImageNet 上建模范式最齐全（pixel 自回归按 0–255 共 256 个 token、连续扩散如 Stable Diffusion、经 VQ-VAE tokenizer 的 4096-token 离散方案），是理解生成式模型的最佳实验场。但领域目前停滞——瓶颈在 benchmark：FID 2017 年提出、需采样 5000 张图、已被刷到 0.9/1.x 无梯度；Inception Score 同样古老失效，大厂只能请标注员人肉对比。

### 案例二：LLM——建模大一统、数据与评测百花齐放

与图像相反：LLM 建模与架构高度大一统（离散自回归 + MoE Transformer；attention 上分线性注意力一派如 Kimi、稀疏注意力一派如 GLM/DeepSeek），Data 与 benchmark 百花齐放（互联网文本是天然温床；GPT 曾在肯尼亚招募劳工做 RLHF，后有 RLVR 类变体；benchmark 从 MMLU/perplexity 到 MATH-500/GSM8K/AIME）。讲者观点：离散 AR 是"智能的前沿"，"离散 AR 在前面拓宽边界，其他架构要更高效地吃下它拓宽出来的这块版图"；蚂蚁等正在做离散扩散语言模型；agentic coding 任务 token 还不够用，所以其他架构若能更高效生成 token 序列就有用武之地。"大模型的下半场是 benchmark"——逐渐淘汰的厂商正是输在自己 hack 自己的评测集。

## 勘误对照

| 转写 | 应为 |
|---|---|
| 深层次模型/深层式建模 | 生成式模型/生成式建模 |
| 鲜艳 | 先验 |
| 扩散自有规/自由亏 | 扩散、自回归 |
| 传送默认 | Transformer |
| 一个Python映射成一个latent | 一个 patch 映射成一个 latent |
| EMANDING | embedding |
| CN的架构九联合解、33卷集合、5×5基本集合 | CNN 的卷积核、3×3/5×5 卷积核 |
| 不像是我在一个电台上面训练好 | dataset（存疑） |
| OPD | DPO（本讲后训练环节处） |
| master的一个序列/有些地方是bug | 全 mask / mask |
| 浅分布/浅空间/引扣 | 隐分布/隐空间/encode |
| MINNEX/C8ten | MNIST / CIFAR-10 |
| VQ和NEZER/TOGNIZER | VQ tokenizer |
| flow Mac/flow maine | flow matching |
| FITSFID/FD | FID |
| email 现上 | arXiv 上 |
| JSON 8K/max500 | GSM8K / MATH-500 |
| LLHF/LOVR/强化学习fans | RLHF / RLVR / RL 变体 |
| 离散值回归/离散测轨/离散ER | 离散自回归/离散 AR |
| 投稿序列/authentic的coding | token 序列 / agentic coding |
| 系数注意力/一拍 | 稀疏注意力 / 一派 |
| 大厂的模拟团队大概率其实是干DA的活 | 模型团队……干 Data 的活 |
| micro的这么一个结构/去照的速度/真实前队 | Markov 结构 / 去噪的速度 / 真实前缀 |
| unit和di it | UNet 和 DiT |
| GB t/大V模型/o de e | GPT / 大（语言）模型 / ODE |
| EXPREDICTION/XXXPREDIC | x-prediction |
| f tension/four or test | full attention |
| PZ1中采用一个Z/设计器 | P(Z) 中采样一个 Z / generator |

## 编者补充

- 编者补充（跨集联系）：四层框架是第 6–10 讲的统一坐标——第 6 讲 MLSys 管"架构跑在什么硬件上"、第 7 讲管"Data 与训练算法"、第 9 讲管"扩散建模与架构"、第 10 讲把四层同时搬到机器人上。αᵢ 视角（SFT/RL/DPO 都是 loss 加权的设计）是第 7 讲后训练部分的最好预告。
- 编者补充（行动线）：讲者明确建议（约 32:46）借助 Codex 等编程助手，把图像生成的各范式（pixel 自回归、扩散、VQ-VAE）亲手各实现一遍；配合讲义 PDF https://summer26.net9.org/ai/overview/ai-overview-handout.pdf 使用。
- 编者补充（缺口）：EBM 讲者明说不展开；RLHF/DPO/RLVR 只点名未讲机制（第 7 讲回填）；线性注意力与稀疏注意力的具体差异未展开。
