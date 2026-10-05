---
title: "01 · DeepSeek-R1：纯强化学习如何炼成推理能力"
---

# 01 · DeepSeek-R1：纯强化学习如何炼成推理能力

> 素材：R1 论文 arXiv 2501.12948（已验证，引用句均为原文）。R1 是 2025 年"推理模型"浪潮的起点（OpenAI o1 的开源对位物），也是"RL 能逼出智能"这个命题最有名的公开证据。

## 一、先建立问题感：R1 到底证明了什么

在 R1 之前，行业共识是：让模型学会复杂推理，需要一条"监督学习流水线"——人工整理几十万道带详细解题步骤的题，先模仿（SFT），再强化。

R1-Zero 做了个思想实验：**跳过模仿，直接对基座模型做强化学习，只告诉它"答案对不对"**，模型能自己学会思考吗？

答案：能。而且过程出现了论文里最著名的场景（下一节）。

【为什么这个证明重要】它把"教模型推理"从"人工密集型"变成了"算力密集型"——不再需要人工标注思维链，只需要**可自动判分的题目**（数学、代码）。这直接改写了 2025 年所有模型的训练配方。

## 二、Aha Moment：论文里最动人的段落

R1-Zero 训练中途，模型在解一道数学题时输出了这段话（论文原文，已验证）：

> "Wait, wait. Wait. That's an aha moment I can flag here."
> "Let's reevaluate this step-by-step to identify if the correct sum can be..."

论文自己的评论：

> "The model learns to rethink using an anthropomorphic tone. This is also an aha moment for us"

【批注，逐层看】
1. **没人教模型说 "Wait"**。奖励函数里只有答案正确性和格式分，"中途自我怀疑"不是奖励项——它是为了答对而**自发涌现**的策略。模型发现"先冲一个答案再回头检查"的期望得分更高，于是"反思"作为一种行为被选择出来了。
2. 论文作者说 "This is also an aha moment for us"——研究者的震动是双重的：模型学会了反思，而且**反思的出现方式暗示智能行为可以从极简奖励中生长出来**。这是 2025 年 AI 领域最具哲学冲击力的公开观察。
3. 【实用迁移】你现在用推理模型时看到的"思考中……等等，我重新算一下"，源头就是这次训练。**你在 harness 里看到的模型行为，都是训练奖励塑造的化石。**

## 三、GRPO：没有批评家的强化学习

论文原文（已验证）：

> "we adopt Group Relative Policy Optimization (GRPO)... which foregoes the critic model... and estimates the baseline from group scores instead."

### 直白解释

传统 RL（PPO）需要一个"critic 模型"来估计"这个做法比平均水平好多少"——critic 和策略模型一样大，显存翻倍。GRPO 的做法：

```
同一道题，让模型采样一整组答案（比如 16 个）
→ 每个答案打分（对了 1 分，错了 0 分）
→ 组内平均分就是"baseline"
→ 高于组均分的答案：强化它；低于：抑制它
```

【为什么这样设计】用"同一题多次采样"代替"训练一个价值网络"。省掉一整个大模型的显存和训练，代价是每道题要多生成几个答案（算力换显存，对训练系统来说通常划算）。**这个"组内相对比较"的思路简单到可以画在餐巾纸上，但它是 2025 年开源 RL 训练的事实标准**（后来的很多 RL 框架都以 GRPO 为基础变体）。

【你能学到】当你看到"某某模型用强化学习变强了"的新闻，先问三个问题：奖励是什么？谁判分？baseline 怎么估？——这三个答案基本决定了训练质量。

## 四、R1-Zero 的代价与 R1 的配方

R1-Zero（纯 RL）有两个毛病：**可读性差、语言混杂**（一道中文题答到一半切英文，因为英文解题得分高）。模型关心分数，不管你读不读得懂。

R1 的最终配方是四段流水线（论文原话 "two RL stages... as well as two SFT stages"）：

```
① 冷启动 SFT：用"数千条"精挑的长思维链样本打底
        （解决可读性和语言混杂——先教会"好好说话"）
② 推理 RL：GRPO + 规则奖励（答案正确性 + 格式）+ 语言一致性奖励
③ 拒绝采样 SFT：用 RL 模型自己产出的优质答案再教一遍自己
④ 全场景 RL：不只是数学代码，对话/写作/工具使用一起对齐
```

【批注 1】注意冷启动数据的量级：**数千条**，不是几十万条。它的作用不是教知识，是"定调子"（格式、语言、风格）——知识由 RL 去逼出来。

【批注 2】"语言一致性奖励会略微降低性能"是论文自己承认的 tradeoff——为了人能用，牺牲了一点分。**工程上到处是这种"分数 vs 体验"的取舍。**

## 五、蒸馏：小模型的捷径

论文结论（原文，已验证）：

> "direct distillation from DeepSeek-R1 outperforms applying RL on it. This demonstrates that the reasoning patterns discovered by larger base models are crucial..."
> "smaller models relying on the large-scale RL... require enormous computational power and may not even achieve the performance of distillation."

做法：用 R1 生成 80 万条样本（推理 60 万 + 通用 20 万），直接 SFT 给 Qwen/Llama 小模型。小模型不跑 RL，成绩就吊打"自己跑大算力 RL 的小模型"。

【为什么值得记住】这是一个反直觉但通用的结论：**"能力"可以跨模型规模传递，但"发现能力"的过程很贵**。对个人开发者的实操含义：想给自己的垂直场景做推理小模型，最优路径几乎总是"拿大模型蒸馏"，而不是自己从零 RL。

## 六、和 Agent harness 的连接（本库的立库之本）

R1 式推理模型对 Agent 设计产生了实质影响：

1. **thinking 块成为一等公民** → harness 必须管理它（Claude Code 的"thinking 用完即弃"、V3.1/Qwen3/GLM 的 thinking/non-thinking 双模式都是这个背景下的产物）；
2. **推理预算成为新参数**（MiniMax-M1 的 40K/80K thinking budget、各家 API 的 reasoning effort）→ harness 多了一维要调的东西：想多久 vs 等多久；
3. **可判分任务的价值暴涨** → 04 章交互记录里的"先写测试再让 Agent 干"之所以有效，本质是给模型提供了 GRPO 式的判分器。

## 思考题

1. 如果奖励函数只有"最终答案对错"，模型可能学会哪些"作弊策略"？（想想刷分 vs 真会）R1 为什么没有大面积翻车？（提示：任务领域是数学和代码，判分器很难糊弄）
2. GRPO 的"组内采样"类比到你的学习里是什么？（提示：一道题先自己写 3 种解法再对答案，比直接看答案强在哪）
3. 为什么"数千条冷启动数据"就够定调子，而 RL 需要海量题目？

---

下一篇：[02-开源基建四大件](/16-AI源码与AI交互研习库/03_模型源码_DeepSeek与朋友们/02-开源基建四大件-FlashMLA-DeepEP-DeepGEMM-DualPipe)
