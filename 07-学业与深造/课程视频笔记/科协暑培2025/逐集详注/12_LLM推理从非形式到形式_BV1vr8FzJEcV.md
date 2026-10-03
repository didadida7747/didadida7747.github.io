# 2025科协暑培 · LLM Reasoning: From Informal to Formal（科协学术部讲者, BV1vr8FzJEcV）

> 讲者姓名 frontmatter 未载，开场仅称"刚从温哥华开会回来、大三升大四"；该讲者所在组即文中 2 月发布 90.4 SOTA formal prover 的团队。

## 定位

AI 部分的收束与前沿讲：前半系统讲 LLM reasoning（短 CoT→长 CoT→RL 训练技术→推理时技术），后半深入讲者本行——形式化数学证明（Lean/AlphaGeometry/DeepSeek-Prover 及其组内工作），是三讲中科研浓度最高的一讲。强推给想做 RL/推理方向的同学；RL 推导段对已学 2026 合集 GRPO 的同学是极好的中文推导补课。

## 知识整理

### 从短 CoT 到长 CoT：一条历史线

2021 年模型只做摘要/翻译，答数学题"一问一数"；22-23 年进入短 CoT 时代（few-shot 例子 + "Let's think step by step"）；2024-09 OpenAI o1 惊现上万 token 长 CoT；2025-01 DeepSeek-R1 用 RL 揭示长 CoT 来源，展示"wait wait wait"式 aha moment。R1 的成功有两个归因：一是 RL 基于 base model 而非 instruct/SFT model——base（预训练+退火）探索多样性更强，instruct（再加问答式 SFT）已被收窄；二是 base model 自带 reflection 模式——斯坦福工作指出 Qwen 有 verification/backtracking 等 answer pattern 而 Llama 3B 没有，故 Llama 复现不出，给 Llama 短微调注入该 pattern 后也能长出来。而讲者强调"最重要的一点"是 R1-Zero 实验：同套框架下，671B 大模型蒸馏到 32B 远胜直接在 32B 做 RL——小模型上同样算法得不到好结果。字节的 DAPO 文章好是因为卡多：算力与模型规模决定学术界位置，这是本讲核心信息。

### 两条训练路线：SFT 与 RL

SFT 路线："data time is the key"，无 loss 可改、数据是唯一变量。外源数据靠人工标注（Kimi/Numina 花几百万标 proof 数据，一周内被 DeepSeek 671B 超过）或强模型蒸馏；self-evolve=rejection sampling 微调——把 RL 思想搬进 SFT。

RL 路线的要素：数据按难度过滤（全错或全对的丢弃，DAPO 指此最重要），可做课程学习；奖励从 RLHF（四模型）演进到 RLVR（规则奖励，省 value model），奖励模型分 PRM（超长 CoT 下太难做）与 ORM；算法有 PPO/GRPO/Reinforce++。筛选有个陷阱：MATH 答案空间小，训练集答案在测试集随机试 pass@128 能到 50%——数值校验会"碰对"，改进有语义聚类、置信度、reward model 打分。

DPO 值得单独一提：只要"一问题+一好一坏答案"，无需 reward model——显式解出最优 policy、经 Bradley-Terry 消掉配分函数 Z 直接优化；凡能造出好坏答案对的场景（含 diffusion model）都可用。

### RL 速成推导：从 MDP 到 GRPO

从 MDP 五要素入手，用考试蒙题比喻理解 exploration vs exploitation；return、policy（大模型本身就是 policy）、V(s)/Q(s,a)/A=Q−V。（2026 合集啃过 policy gradient 推导者可当复习。）

推导链条三步：①时序差分——Q 展开为 R+γV(s′)，得 TD advantage = R + γV(s′) − V(s)；②policy difference theorem——新旧 policy 的 J 差代入 TD advantage 化简，得"期望优势=J 差"，再经重要性采样得通用 objective：TRPO 用 KL 硬限制，PPO 用 clip；③GRPO 即 PPO-clip 把 advantage 换成组平均（采样多次减均值，八对一错那次才值得奖励），KL 项加在 loss 而非 reward。（讲者吐槽某论文把 PPO target 当 GRPO target 写。）

落到大模型场景：已生成前缀是 state、下一 token 是 action；KL 逐 token 算，reward 常放序列末位——建议读 OpenRLHF 源码。工程挑战在 verl/deepspeed/vLLM 多框架组合、多卡多节点。科研切入点：SFT 在数据（rejection sampling 变体可发文章）、RL 在数据过滤/算法/框架，"不建议做算法，算法都已对"。

### 推理时技术

agent 调工具、memory-based few-shot、agentic system search；讲者对 test-time 持保留态度——多智能体写软件已被更强单模型超过。经典技法：ToT（思维树+剪枝，贵）、Self-Consistency（采样多次聚类投票，非常好用）、RAP（reasoning is planning with world model，DFS/BFS 拓展到 MCTS）。

### 形式化数学：为什么需要 Lean

自然语言推理是业界卖点，形式语言推理是学界热点。AlphaGeometry（IMO 几何）=LLM 提辅助线+symbolic engine 验证，迭代解题；AlphaProof+AlphaGeometry2 达 IMO 银牌（仅 AG 开源）；其间穿插 2025 年 OpenAI/DeepMind 的 IMO 风波（组合题反 AI、不出过程被陶哲轩等喷）。Lean 约 2013 年微软创建，Mathlib 是其"标准库"，今年获 ACM SIGPLAN 大奖；tactic（rw [h₁,h₂] 等）逐步 rewrite。形式语言更严谨之例：x 的 1/3 次方的 3 次方是否等于 x，取决于实数域还是复数域。核心价值：informal 答案对但过程无法 scale 检验，formal proof 全部可编译器自动验证——陶哲轩已用 Lean 翻译课本；"5 年内 AI 证明人类未证猜想"之赌若实现，必经形式语言。

### 开源 prover 竞赛与讲者组方法

竞赛成绩线：DeepSeek-Prover v1.5（7B，minif2f pass@32 达 50%，只开源模型）→讲者组 2025-02 达 60.5→Kimi+Numina 的 Kimina-Prover 72B 达 68.8→五一 DeepSeek 671B Prover 达 82.4→7 月 Kimina 新模型 84→7-15 讲者组 32B 模型达 90.4，另有 8B 模型与 671B 相当，PutnamBench 以小算力远超前人。

方法四件套：①expert iteration——编译器验证的 rejection sampling+SFT，再加"用编译器 feedback 构造问题+首轮错误+报错前缀数据"学改错，单次采样即训改错；②数据增强——太简单加 perturb 变难、太难用 extract 拆解、可 disprove 则取 negation；训首个 32B CoT formalizer；③改错能力——DeepSeek 系改错不自洽、Qwen3 推理强，先予 formal 能力后改错自 emerged，再用 RL 扩大；④model average——RL 后 pass@1 升但 pass@32/1000 降（overtrain 多样性下降），base 与训后模型逐参数加权平均，涨点极猛，"直接能发文章"。

### 学术界困境与开放问题

训小模型最好先有大模型再蒸馏；不同 size 上结论不同（RL 在 32B 提升远超 8B），小模型得出"RL 不 work"可能是错的；大模型时代做研究"看组的卡"。价值观：做 RL 与做 agent 对智商要求差别不大，PPO 是 2017 年的东西，别有技术优越感；理论组学生实习也都在大厂做 agent——简单但好用的东西就是方向。Open challenges 七条：①DeepSeek 系"先自然语言证再翻译"的 style 改错要全文重输出、context 极长，而形式化本可模块化（lemma 拆分、编译器定位错误、逐条改），且逐 lemma 验证能把稀疏 0/1 奖励变稠密——讲者认为最有未来（Kimi 系 prover 即此 style）；②自动补充 Mathlib 库；③Lean 做几何；④informal→formal 转换障碍（组合题场景难形式化）；⑤超越竞赛、与数学家合作证真猜想；⑥true understanding（可解释性）；⑦编译器可靠性（自相矛盾的 statement 仍可能"证出"）。

## 勘误对照

- 该集未发现新勘误。

## 编者补充

- 编者补充（跨集联系）：本讲 RL 推导（MDP→TD→policy difference→PPO-clip→GRPO）是 2026 合集 GRPO 内容的完整证明版——先看 22:48–34:49 再回笔记会豁然开朗；第 10 讲 RLHF 只到"打分器"，本讲补齐后续；架构配置承接第 11 讲。
- 编者补充（行动线）：读 OpenRLHF 与 verl 源码（讲者两处点名）；盯 DeepSeek-Prover 与 Kimina-Prover 的 HuggingFace 仓库；model averaging 与难度过滤 rejection sampling 都是讲者明说可复现发文章的低成本题目。
- 编者补充（缺口）：rollout 并发、off-policy 等工程细节只指了源码路；RLVR 对非数学任务的奖励设计未展开；formal 部分默认听众知道 IMO/minif2f 是什么。
