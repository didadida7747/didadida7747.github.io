---
title: "03 · 开源模型群像：Kimi K2 / Qwen3 / GLM / MiniMax（2025-2026）"
---

# 03 · 开源模型群像：Kimi K2 / Qwen3 / GLM / MiniMax（2025-2026）

> 素材：各官方仓库 README（已验证）。本篇不追新，只梳理每家**最有辨识度的设计选择**——读群像的价值是看清"同一个问题，不同团队的最优解不同"。

## 一、快览表

| 模型 | 团队 | 规模 | 招牌设计 | 一句话人设 |
|---|---|---|---|---|
| Kimi K2 | 月之暗面 | 1T 总 / 32B 激活 | MuonClip 优化器、384 专家 | 为 Agent 时代生的模型 |
| Qwen3 | 阿里 | 0.6B→235B 全家桶 | hybrid thinking、119 语种 | 开源生态的"水电煤" |
| GLM-4.5/4.6 | 智谱 | 355B 总 / 32B 激活 | slime RL 框架、Agent 三合一 | 全栈自研（模型+RL+推理） |
| MiniMax-M1 | MiniMax | 456B 总 / 45.9B 激活 | 线性注意力混合、1M 上下文 | 长上下文性价比之王 |

## 二、Kimi K2：把"不稳"驯服成"零抖动"

README 原文（已验证）：

> "32 billion activated parameters and 1 trillion total parameters"
> "MuonClip Optimizer: We apply the Muon optimizer to an unprecedented scale, and develop novel techniques to resolve instabilities"
> "Pre-trained a 1T parameter MoE model on 15.5T tokens with zero training instability."

【批注】三个信息点连起来读：
1. **Muon 优化器**：比 AdamW 更省参数更新量（正交化权重更新），小模型上早被验证，但放大到 1T 规模会训练不稳。K2 的贡献是 MuonClip（Muon + QK-clip，钳制注意力 logits 的增长）让 Muon 首次跑到 1T——**优化器层面的创新，是"别人都堆数据/参数时，从另一个轴抢效率"**。
2. "zero training instability" 是训练团队最硬的 brag：大模型训练最怕 loss 尖峰（一发就要回滚 checkpoint），零抖动 = 省下大量废掉的算力。
3. 定位 "Agentic Intelligence: specifically designed for tool use"（已验证），SWE-bench Verified 65.8——**它是"为 harness 时代训练模型"的代表**：训练数据里大量合成工具调用轨迹（论文里的 Agentic Data Synthesis），让模型天生爱用工具。

【对你 mean什么】选模型跑 Agent 时，"agentic 数据训练"是比榜单分更重要的指标。K2/CC 配合的工作流就是这条路线的代表组合。

## 三、Qwen3：生态位的胜利

README 要点（已验证）：

> 尺寸序列 "0.6B, 1.7B, 4B, 8B, 14B, 32B and 30B-A3B, 235B-A22B"
> "Seamless switching between thinking mode"（初版用 /think /no_think 指令切换）
> 预训练约 36T tokens、119 种语言（2507 版 256K 上下文，可扩 1M）

【批注】Qwen3 的护城河不是单点最强，而是**全尺寸序列**：从能跑在手机上的 0.6B 到机房里的 235B，同一套 tokenizer/接口/许可证（Apache 2.0）。这让它成为二次开发界的默认底座——**做生态的核心是"覆盖所有生态位"，让每个细分场景都有理由用你。**

hybrid thinking 的设计（一个模型两种模式）后来成了行业标配（V3.1、GLM-4.5 同款思路）：简单问题直接答（省时间），复杂问题开思考（多花 token）。**"思考深度"从模型属性变成了请求参数**——这是推理模型产品化最重要的抽象。

## 四、GLM：全栈自研 + 把 RL 框架开源

README 要点（已验证）：

> "355 billion total parameters with 32 billion active parameters"（Air 版 106B/12B）
> "hybrid reasoning models... thinking mode for complex reasoning and tool usage, and non-thinking mode for immediate responses"
> slime：GLM-4.5 / GLM-5.3 背后的 RL 框架，"Megatron 训练 + SGLang rollout + Data Buffer"

【批注】GLM 系列最值得学的是**架构完整性**：模型（GLM）、RL 框架（slime，开源）、推理服务一起自研。slime 的设计选择值得记：rollout（采样生成）用 SGLang 而不是训练框架自带——**训练和采样用两套各擅长的系统，靠数据总线连接**。这个"训采分离"模式是 2025 年后开源 RL 训练的主流架构（的好处：训练框架专注梯度、推理框架专注吞吐，互不拖累）。

（GLM-4.6 把上下文提到 200K、强化 agentic；本库写作时点的最新版本以官方发布为准。）

## 五、MiniMax-M1：线性注意力的答案

README 要点（已验证）：

> "456 billion parameters with 45.9 billion activated per token"
> "the world's first open-weight, large-scale hybrid-attention reasoning model"（MoE + lightning attention 混合）
> "natively supports a context length of 1 million tokens, 8x the context size of DeepSeek R1"
> "M1 consumes 25% of the FLOPs at a generation length of 100K tokens"（对比 R1）
> 自研 CISPO RL 算法（"clips importance sampling weights instead of token updates"）

【批注】DeepSeek 用 MLA（压缩 KV），MiniMax 用 lightning attention（线性注意力：把 softmax 注意力改造成核函数形式，复杂度从 O(n²) 降到 O(n)）。两者是"长上下文算力账"的两条解法：
- MLA：保留精确注意力，压缩缓存 → 质量-成本曲线漂亮；
- 线性注意力：数学上重写注意力 → 长文本成本断崖式下降，但精确回忆类任务有损；
- **M1 的"混合"是第三条路**：部分层线性（省）、部分层全注意力（准），各取所长。

【群像总结】四家+DeepSeek，五个团队，五种性价比哲学：Moonshot 卷优化器、Qwen 卷生态、智谱卷全栈、MiniMax 卷注意力数学、DeepSeek 卷全链路成本。**共同点：没有人靠"把参数堆大"赢。** 这个观察放在 2026 年，比任何单篇论文都值钱。

## 六、怎么把这个群像用起来

1. **跑 Agent 选模型**：优先看 agentic 工具调用榜（SWE-bench Verified / TAU-bench 类）+ 你的语言场景 + 成本，别看综合聊天榜。
2. **自己部署选模型**：MLA 系（DeepSeek/K2）有 FlashMLA/开源 kernel 生态加持；线性注意力系（M1）长文本吞吐占优。
3. **跟进渠道**：各仓库 README 的 News 区 + HF 模型卡的 changelog，比自媒体快且准（05 章资源地图有完整清单）。

## 思考题

1. "思考深度成为请求参数"对 harness 设计提出什么新要求？（提示：01 章 04 篇的上下文预算怎么给 thinking 留份？）
2. 为什么 Qwen 全尺寸策略对开源生态的统治力，比单点最强模型更强？（想想"切换成本"）
3. 训采分离（slime 模式）里，为什么 rollout 用 SGLang 而不用训练框架自己采样？

---

下一篇：[04-Karpathy入门三件套](/16-AI源码与AI交互研习库/03_模型源码_DeepSeek与朋友们/04-Karpathy入门三件套-模型源码的第一课)
