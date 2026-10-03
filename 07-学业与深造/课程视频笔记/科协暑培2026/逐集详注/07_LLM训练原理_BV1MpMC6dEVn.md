# 2026科协暑培 · 第7讲 大语言模型（上）：训练原理（景亿, BV1MpMC6dEVn）

## 定位

AI Track 第三讲，本合集导览标注的**精看**讲次。全讲把现代 LLM 工业训练整理为预训练 → 中训练（mid-training）→ 后训练三阶段，覆盖数据工程、scaling law、SFT/PPO/GRPO/Agentic RL/OPD 五种后训练算法。讲者多次默认听众有注意力机制基础（"听过之前暑培课程"），与第 5、6 讲连读效果最好。约 36 分钟。课程主页 https://summer26.net9.org/ai/LLM/ 。

## 知识整理

### 训练三阶段总览

- **预训练**：约 1T–20T+ tokens 的网页、书籍、论文、代码及多语言/多模态数据做"通识教育"，建立语言、知识与基础代码推理能力。
- **中训练（mid-training）**：又名 continue pre-training；用约 100B–300B tokens 高质量定向数据重塑能力分布，并做学习率退火与长上下文拓展（frontier 模型已支持 1M 上下文窗口）。
- **后训练**：数据量再低几个数量级，但需要标签、示范、可验证任务等高成本监督，把知识变成可用行为。

佐证框架的稳定性：2024 年的训练总结博客（数据集→处理→pretrain→post-train）与 2026 年 Kimi K3 开源技术报告（架构→预训练→后训练→infra→评测）结构基本一致。"很多时候算法已经不是约束模型能力提高上限的因素，而是如何在既有算法上做稳定的、可拓展的训练。"

### 预训练数据工程

Common Crawl 收录比预训练所需高几个数量级的原始网页，但质量极低（中文大量来自小网站），需参照 FineWeb 等经典数据集做多步清洗：信息密度、可靠性、推理链完整性、模板化与 AI 生成垃圾内容（会拖累下一代模型）。数据配比决定能力分布——"模型能力分布继承数据分布"，想做 agentic/代码强的模型就要在预训练阶段就加大相应配比。还需处理重复（浪费算力）、测试集污染（评测虚高）与过度记忆（隐私、版权）。讲者称之为"看起来 dirty 但非常重要"的工作。"大家可以把预训练理解成一个规模极大的压缩过程。"

### Next token prediction 与 Transformer：为什么是它们

预训练算法要解决"大规模、稳定、无监督地从文本产生训练信号"。next token prediction "经常被诟病但又无比有效"：文本自身即答案，而要长期预测准确，模型必须学会语法、事实知识（"法国的首都是巴黎"）、代码结构甚至隐藏推理模式。Transformer 成主流是因为每个 token 可直接参考上下文、可并行处理整个序列（对比 RNN 逐次计算），适合大规模并发 GPU 训练；Mamba 等新架构虽有长序列效率优势，但 Transformer 在复杂上下文建模与成熟训练生态上仍不可替代——不是效率高就该换。

### Scaling law：数字与思维方式

借 OpenAI 当年提出 scaling law 的三张图：计算量、数据量、参数量越大，测试集 loss 越低。典型例证是 Kimi K3（2.4T 参数量 + 大规模数据）显著强于前代。更本质的是思维方式改变：以前解决医疗/金融问题靠规则或领域小模型，现在默认"scale 基座模型"让泛化能力直接解决问题。架构改进以 DeepSeek 的 sparse attention 为例：只保留局部/动态连接以显著降低计算与显存、支持更长上下文，但带来更多 infra 与训练难度——架构设计是在能力、效率与工程可实现性之间找平衡。

### 中训练：预训练与后训练之间的冷启动

用质量更高、目标更明确的数学/代码/科学/长文本/专业领域/特定语言数据（可比预训练小两个数量级）缩小预训练与后训练任务的分布差异。算法仍是 next token prediction，loss 不变，但大幅调整数据配比与训练顺序，并配合学习率退火和更长的上下文。Kimi K3 等报告不单列此阶段、归入 continue pre-training。

### 后训练之一：SFT、PPO、GRPO

- **SFT**：给指令+专家回答逐 token 模仿（loss 只算回答/动作部分）。用途：有明确示范的任务、行为与格式塑造（markdown 输出、自我认知"我是 A 厂商的 A1 模型"）、RL 前的 cold start（难题先示范让模型"会算"）。
- **PPO**：用 reward model 判断每步相对预期的好坏，以 clipping 和 KL 约束更新幅度。最经典用途是 RLHF（InstructGPT 先用人类偏好训 RM，再优化 helpfulness/truthfulness/safety）。因要同时维护奖励模型与价值模型、成本高，长期被 GRPO 取代，但近期 GLM 等报告显示 PPO 复兴。
- **GRPO**：DeepSeek 提出（源自 DeepSeekMath 论文，后成 DeepSeek-R1 推理训练主要方法）。保留保守更新思想，用同一问题的一组回答估计奖励基线，免去 value model；适合能自动评分、低成本多次尝试的任务。

### 后训练之二：Agentic RL

多轮 agent 任务中，RL 对象从一段文本扩展为完整环境交互轨迹：观察状态（搜索状态/代码库）→ 选行动或调工具 → 环境改变 → 继续规划，形成完整 trace 后对结果、过程与成本做奖励，再用 PPO/GRPO 更新。与 RLVR 相比：上下文从纯文本变为复杂环境、每步行动改变后续状态、奖励要评价完整任务结果甚至过程。难点不在更新参数，而在构建稳定可扩展的环境、credit assignment（把奖励分配到长轨迹中的每个操作）、成本与可靠性评价及 rubrics 设计——该方向尚未成熟。

### 后训练之三：OPD（在线策略蒸馏）

解决 RL 反馈太稀疏（agent 跑一天一夜只得一个成败信号）的问题：学生模型按当前 policy 生成轨迹，教师模型在学生实际到达的每个状态上提供逐 token 密集监督。比 SFT 更贴近模型真实运行分布，比 RL 反馈更密集。教师常是自己的专有专家模型：如用特化 coding 模型监督主模型，把专有能力蒸馏回去且不损伤其他能力；适合推理蒸馏、行为恢复与多领域专家模型整合（GLM5 报告即在 reasoning/agentic/general RL 之后用 OPD 合并）。

### 横向对比：一张表看懂五种后训练

| 算法 | 数据来源（offline/online） | 在谁的分布上训练 | 学习信号 |
|---|---|---|---|
| SFT | 专家示范（offline） | 专家示范分布 | 密集 token 级 |
| PPO | 在线 | 当前/近期策略分布 | value model |
| GRPO/RLVR | 在线多次尝试 | 当前模型 | 组内相对奖励 |
| Agentic RL | 环境交互 | 交互轨迹 | 完整结果/过程反馈（需 rubrics、防 hack） |
| OPD | 在线 | 学生当前分布 | 教师 token 级密集监督 |

训练三要素收束：数据决定学什么、算法把经验转化为参数更新、infra 决定能否稳定高效扩展。"堆数据 + infra 的 scaling 能否持续"是讲者留给"大模型下半场"的开放问题。

## 勘误对照

| 转写 | 应为 |
|---|---|
| TIMIK3/K1K3 | Kimi K3 |
| deep stick/deep stick max/deep sc r1/desk | DeepSeek / DeepSeekMath / DeepSeek-R1 |
| chi g b t/Instruct g b t | ChatGPT / InstructGPT |
| GM5.2 | GLM 系列报告（版本号存疑） |
| MANA/RN | Mamba / RNN |
| find web | FineWeb |
| modears architecture | model architecture |
| 异性恋 | 预训练 |
| miss token prediction/EXOCOMPREDICTION | next token prediction |
| SFTRRL/RIHF | SFT 与 RL / RLHF |
| CPU/一六/DRPO | PPO（存疑）/ GRPO |
| revalue model/remove model/bad model | reward model / value model |
| 奖励的极限/阻力 | 奖励的基线 / 组内 |
| code start | cold start |
| 吸收注意力/full tention | 稀疏注意力 / full attention |
| B训练/scale0落/skin落 | 预训练 / scaling law |
| 机构模型/学习力 | 基座模型 / 学习率 |
| 剩下文/上大文 | 上下文 |
| 测试及污染/测试以上 | 测试集污染 / 测试集上 |
| 天天好队 | 偏好对 |
| 合板 | 合并 |
| 韩进/哈雷斯 | 环境 / harness（存疑） |
| stage/dance | state / dense |
| 教室主token/长城 | 教师逐 token / 长程 |
| agent l i m/INFRAUS | agent LLM / infra |
| retrain a train posttrain | pretrain / mid-train / post-train |
| 强迫性标注 | 强模型标注（存疑） |
| 数培/鼠言鼠培/量子枕头 | 暑培 / 量级 token（存疑） |
| 代理模型 | 大语言模型（存疑） |

## 编者补充

- 编者补充（跨集联系）：①本讲两次默认听众有注意力机制基础，与第 5 讲（架构层）、第 6 讲（infra 层）连读效果最好；②结尾把"堆数据与 infra 做 scaling 能否持续"明示为留给下半场的开放问题——读第 8 讲（agent harness 的工程实现）时可带着这条主线；③OPD 与第 2 讲 compact 的"另一个模型来压缩/监督"思想同构。
- 编者补充（行动线）：①到课程主页拿讲义与附加材料（约 33:49 讲者明确说算法深入靠附加材料）；②按讲中点名顺序补原始文献：InstructGPT（RLHF+PPO）→ DeepSeekMath（GRPO 起点）→ DeepSeek-R1 → Kimi K3 / GLM 技术报告（三阶段全流程实例）。
- 编者补充（缺口）：OPD 全篇未给全称，按上下文应为 On-Policy Distillation（讲义需确认）；mid-training 只讲"做什么"（退火、长上下文、配比），"怎么做"（具体数据调度与超参）留白，需对照讲义或技术报告。
