---
title: "00 · GitHub 仓库清单：按学习价值排序"
---

# 00 · GitHub 仓库清单：按学习价值排序

> 标注规则：[已验证]=抓取过页面；[搜索所见]=搜索结果所见（点开前复核）。
> 加粗的仓库已 clone 到 `07_源码仓库/`（跑一次 clone_repos.sh 可全部就位）。

## 第一梯队：直接拆着学的源码（本库精读对象）

| 仓库 | 一句话 | 配套文档 |
|---|---|---|
| **anthropics/claude-code** [已验证] | CC 官方仓库：文档、issues（真实的"问题+官方回应"记录库）、changelog | 01章全程 |
| **shareAI-lab/analysis_claude_code** [已验证] | 中文最深的 CC 逆向分析：多 Agent 分层、Task 分发、实时 steering | 01章总览/05篇 |
| **Yuyz0112/claude-code-reverse** [已验证] | 逆向出的 CC 提示词与工具定义 | 01章07篇 |
| **x1xhlol/system-prompts-and-models-of-ai-tools** [已验证] | 各家系统提示词大全（CC/OpenCode/Gemini/Codex/Cursor/Devin…） | 01章07篇 |
| **google-gemini/gemini-cli** [已验证] | 开源版 CC：主循环/压缩服务/提示词全部可读 | 02章01篇 |
| **Aider-AI/aider** [已验证] | edit format 与 repo map 的教科书 | 02章02篇 |
| **sst/opencode** [已验证] | client/server 架构、provider 无关的终端 Agent | 02章03篇 |
| **openai/codex** [已验证] | OS 级沙箱（Seatbelt/Landlock）参考实现、AGENTS.md 标准推手 | 02章03篇 |
| **deepseek-ai/DeepSeek-V3** [已验证] | V3 推理代码（model.py 808 行：MLA/MoE/FP8 全在里面） | 03章00篇 |
| **karpathy/minbpe** [已验证] | 300 行 BPE，tokenizer 第一课 | 03章04篇 |
| **karpathy/nanoGPT** [已验证] | 两个 300 行文件训练 GPT（README 标注已 deprecated，后继 nanochat） | 03章04篇 |
| **karpathy/llm.c** [已验证] | 纯 C/CUDA 的 GPT-2，模型的物理课 | 03章04篇 |

## 第二梯队：DeepSeek 基建（读懂"成本护城河"的零件）

| 仓库 | 一句话 | 配套文档 |
|---|---|---|
| **deepseek-ai/open-infra-index** [已验证] | 开源周索引仓库 + 推理系统概览 | 03章02篇 |
| **deepseek-ai/FlashMLA** [已验证] | MLA kernel（H800 3000GB/s / 580 TFLOPS 起家，现已迭代到 B200/昇腾） | 03章02篇 |
| **deepseek-ai/DeepEP** [已验证] | MoE 通信库（NVLink+RDMA，FP8 dispatch） | 03章02篇 |
| **deepseek-ai/DeepGEMM** [已验证] | FP8 GEMM，DeepJIT 运行时编译（1350→1550 TFLOPS） | 03章02篇 |
| **deepseek-ai/DualPipe** [已验证] | 双向流水线并行算法 | 03章02篇 |
| **deepseek-ai/3FS** [已验证] | 分布式文件系统（180 节点 6.6 TiB/s 聚合读） | 03章02篇 |

## 第三梯队：开源模型本体

- **MoonshotAI/Kimi-K2** [已验证]：MuonClip 优化器、1T/32B、agentic 数据合成（03章03篇）
- **QwenLM/Qwen3** [已验证]：全尺寸序列 + hybrid thinking（03章03篇）
- **zai-org/GLM-4.5** [已验证]：355B/32B + slime RL 框架（03章03篇）
- **MiniMax-AI/MiniMax-M1** [搜索所见]：线性注意力混合、1M 上下文（03章03篇）
- **THUDM/slime** [已验证]：GLM 背后的 RL 框架（Megatron 训练 + SGLang rollout，"训采分离"的示范）

## 第四梯队：生态与追更

- **anthropics/skills** [已验证，已 clone]：官方技能仓库——学 SKILL.md 写法的标准答案（对照 01章06篇）
- **hesreallyhim/awesome-claude-code** [已验证（curl 200）]：CC 工具/技能/插件总目录，追生态第一入口
- **anthropics/claude-code** 的 Issues 区：真实故障模式 + 官方回应，是最好的"反面案例库"
- 泄露源码归档镜像：GitHub 搜 "claude code source map leak"（2026.3 事件，约 51 万行 TS），多个镜像自行甄别

## 另外两个值得知道的仓库

- **instructkr/claude-code**：实为社区开源 Python 克隆 "Claw Code"（不是泄露源码，已放 07_源码仓库并附说明）——Python 写的 CC 同构实现，想看 Python 版骨架可以翻翻。
- **用 HN 搜仓库口碑**：https://hn.algolia.com 输入仓库名按热度排序，评论区的实战反馈比 README 诚实。

## 使用心法

1. **同时只精读一个**（00章02篇的教训），其他先 star 收着。
2. 每个 repo 先读 README 动机段 → 找数据流落点文件 → 写三条【为什么这样设计】。
3. 追更渠道：Watch Releases only（别 Watch All，会淹死）。
