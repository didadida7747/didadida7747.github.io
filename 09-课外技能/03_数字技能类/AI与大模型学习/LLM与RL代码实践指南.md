# 代码实践与源码阅读指南

这一份是把“看概念”变成“能跑代码、能读主干”的桥梁。  
你后面只要记住：源码阅读不求全读，只求先把主线抓出来。

## 你现在最适合跑的代码

### 大模型部分

优先：

- Hugging Face LLM Course 第一章
- PyTorch `torch.nn.Transformer` API 文档

链接：

- https://huggingface.co/learn/llm-course/chapter1/1
- https://docs.pytorch.org/docs/stable/generated/torch.nn.Transformer.html

扩展参考：

- PyTorch Transformer Building Blocks Tutorial  
  https://docs.pytorch.org/tutorials/intermediate/transformer_building_blocks.html

你现在不是为了训练自己的大模型，而是为了把模块和代码对应起来。  
所以这里不要再把旧的 `transformer_tutorial.html` 当主线，它已经过时了。

### 强化学习部分

优先：

- PyTorch DQN Tutorial on `CartPole-v1`

链接：

- https://docs.pytorch.org/tutorials/intermediate/reinforcement_q_learning.html

如果还有余力，再看：

- TorchRL PPO Tutorial

链接：

- https://docs.pytorch.org/rl/stable/tutorials/coding_ppo.html

### 多智能体部分

优先：

- PettingZoo Basic Usage

链接：

- https://pettingzoo.farama.org/content/basic_usage/

## 代码阅读统一方法

不管是 Transformer、DQN 还是多智能体 demo，都先按这个顺序看：

1. 入口文件
2. 模型定义
3. 环境或数据输入
4. 主训练循环
5. loss 和参数更新

你只要先把这五处定位出来，就已经进入“能看代码”的阶段了。

## 看 Transformer 代码时怎么读

只盯下面这些问题：

1. 文本或 token 是在哪里进入模型的
2. embedding 是在哪里做的
3. attention 是在哪里发生的
4. forward 里先做什么、后做什么
5. 最后的输出是怎么拿到的

不要一开始就陷入每个张量 shape 的所有细节。  
先抓执行顺序，后补细节。

## Transformer 这部分现在的更稳妥方案

如果你问“旧教程不能用，那我该怎么学”，答案就是：

1. 用本地速读材料和 Day 1 视频先建立框架
2. 用 Hugging Face 课程补 Transformer 概念
3. 用 `torch.nn.Transformer` API 文档认识模块接口
4. 用 PyTorch Building Blocks Tutorial 了解实现和现代写法

这样比直接啃一个已经过时的 PyTorch 入门教程更稳。

## 看 DQN 代码时怎么读

只盯下面这些问题：

1. 环境是怎么创建的
2. 当前状态是怎么拿到的
3. 动作是怎么选出来的
4. reward 是怎么进入训练的
5. 网络参数在哪一步更新

PyTorch 官方 DQN 教程的任务说明很直观：  
它是在 `CartPole-v1` 环境上训练 agent，动作只有左右两种，奖励是每多撑住一个 timestep 就加一分。  
来源：PyTorch DQN Tutorial。  
链接：https://docs.pytorch.org/tutorials/intermediate/reinforcement_q_learning.html

所以你读代码的时候，脑子里要一直对应这个任务画面。

## 看 PPO 代码时怎么读

不要一上来试图全懂。  
你先只盯：

1. 一批数据是怎么收集的
2. 用什么对象保存 rollout
3. loss 在哪里算
4. update 是怎么做的

TorchRL 官方教程把 PPO 说得很明白：  
它先收集一批数据，再用这些数据训练策略，同时控制更新幅度。  
来源：TorchRL PPO Tutorial。  
链接：https://docs.pytorch.org/rl/stable/tutorials/coding_ppo.html

## 看 PettingZoo 多智能体代码时怎么读

你只盯这些问题：

1. `env.reset()` 在哪里
2. `for agent in env.agent_iter()` 在哪里
3. 当前 agent 的观测和奖励是怎么拿到的
4. 动作是怎么送进 `env.step(action)` 的
5. 哪些信息是“当前 agent 的”，哪些是“环境全局的”

PettingZoo 文档明确展示了 `agent_iter()`、`last()`、`step(action)` 这几个核心接口。  
来源：PettingZoo Basic Usage。  
链接：https://pettingzoo.farama.org/content/basic_usage/

## 你做代码实践时一定要留下的记录

每次跑代码，都至少留下这些：

1. 项目或教程名称
2. 运行命令
3. 是否跑通
4. 关键输出或截图
5. 你看懂了哪一段
6. 你没看懂哪一段

这会直接决定你第 8 天能不能顺利写出阶段总结。

## 最小完成标准

到与任课老师交流前，代码实践部分至少做到：

- 跑通过 `1个Transformer相关示例`
- 跑通过 `1个RL入门代码`
- 看过 `1个多智能体环境或demo`

不要求你全部深入，但要求你能说清楚自己做了什么、看懂了什么。

## 一句话收尾

源码阅读不是“从头到尾全懂”，而是“先抓主干，再逐步补洞”。
