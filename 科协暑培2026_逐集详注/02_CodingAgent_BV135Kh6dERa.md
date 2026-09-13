# 2026科协暑培 · 第2讲 Coding Agent（王浩然, BV135Kh6dERa）

## 定位

科协暑培 2026 基础 Track 第二讲，主题是 vibe coding 背后的 agent 原理与工作流。讲师第三年参加暑培，提到今年课程大幅压缩、以 AI 内容为主。本讲回答三个问题：chat 与 agent 差在哪、agent 为什么能完成项目、学生怎么用起来。适合已在用 AI 写代码、想搞懂"它到底为什么能用"的读者；与第 8 讲（手撕 Claude Code 源码）构成"用法→实现"的先后链。课程主页 https://summer26.net9.org/basic/coding-agent/ 。

## 知识整理

### AI coding 简史：从补全到 agent

发展线：2020 年代码补全只能做 demo → 2021 年 GitHub Copilot、OpenAI Codex 做续写 → 2023 年 Cursor（基于 reasoning model，每次只给几行 edit）→ 2024 年 Claude 3.5 初具 coding agent 能力 → 2025 年 Claude Sonnet/Opus 主打 agent 操作代码库 → 2026 年 Claude 4.0 Opus 后，国内智谱、Kimi、DeepSeek 均以 coding 为主打。例证：Claude Code 团队 10 人、52 天内几乎每天发布新功能。讲者引用的判断是 "at the dawn of the software agent"——软件功能基本可以全部由 agent 完成，人类更多是给需求。

### agent loop 与 ReAct：agent 与 chat 的唯一区别

agent 和 chat 不一样的地方，仅仅在于 agent 能多轮循环，每轮拿到一个新的 observation；chat 时代你手动把结果拼回 prompt，模型大概率也能做，只是 token 拼不准会出各种 bug。核心引擎是 ReAct：reasoning → acting → observation，循环至模型认为任务结束；讲义附 Python 简易实现。两种范式：plan and execute（先详细分析再写）vs 直接梭哈再改。Claude Code 的长任务功能（"许一个愿一直做"，可长达十小时或两天）依赖多次 compact 压缩上下文。

### context engineering：两大解法

DeepSeek-R1 之后模型有了较强的思考能力，但"自己 loop 起来 + 长上下文"仍缺——单轮喂给模型什么成了核心问题（RAG、memory 等范式由此引入）。背景约束是 context rot：早期模型训在 64K 上下文，越长越"呆"。harness 层两大解法：

1. **sub-agent**：只有 128/256K context 时派 100 个 agent 并行探索仓库，每个只回约 500 字符总结（自己读会膨胀到 5 万）。
2. **compact**：构造 template 让另一个模型按指定方面压缩对话；Claude Code/Codex 会先丢掉很长的 observation、只留 reasoning，再喂给 compact model 更新。

memory 系统基本是 file-based：内容写进 markdown 文件，下轮把文件目录给模型按需读。

### document first：PRD、CLAUDE.md 与进度文件

写代码前先写 PRD（描述各场景下产品长什么样）与 App Flow（每个功能从哪流到哪），避免模型对草率需求（如"帮我写个 PDF viewer"）随机试一通。CLAUDE.md 放仓库根目录，Claude Code 启动自动读取，免去每次重复探索（账号密码存哪、功能怎么调用）。进度文件让模型迭代中时刻维护，新 agent 或 context rot 后重读即可续接。LESSONS.md 记录过程踩坑，减少重复试错成本。skill 即把流程 12345 列成文本，agent 照做。

讲者的掌控力观点值得单独记："模型写的一坨，能跑起来但不是你写的、你啥也不懂，这和你去网上 copy 别人的代码没有任何区别——agent 时代大家对代码的掌控能力应该是要上升的。"

### harness engineering 与 MCP、多 agent 协作

harness 就是 agent 框架，其工程本质是设计 tool、workflow、skill 三件事；有 benchmark 表明只改 harness（让工具返回更精确）分数能涨十几个点。MCP 是把真实世界工具变成 API 接口（例：把 AutoCAD 封装成模型可调用工具，curl 一个 URL 画一条线），本讲一句带过、第 8 讲展开。协作模式：Claude 写代码 + Codex 做 review 互补；或人工设计 loop 中间做验收。多 agent 并行会有工作区冲突，用 git worktree 开多个并行工作树、最后 merge。

### 现场代码：最小 agent loop

讲者用 OpenAI SDK（`from openai import OpenAI`），model/base URL 指向内部中转站，加载 DeepSeek V4 Flash。构造小 bug 工作区：test 断言期望 greet 输出带逗号，代码却只有叹号。只声明 read/write/test 三个工具；`execute_tool` 解析模型生成的参数，映射到真实操作（read/write 走 Python 文件接口，test 用 subprocess 跑 test_app.py）。运行 "fix the greet formatting bug and run the test"，三轮循环：read → write（在 Hello 后加逗号）→ 跑 test → "bug fixed" 结束。结论：Claude Code、Codex 同理，只是做得更细——这就是 agentic coding 最重要的部分。

## 勘误对照

| 转写 | 应为 |
|---|---|
| 弹琴蛇/弹射射 | 贪吃蛇 |
| deep sv4pro/迪普斯的V4flash | DeepSeek V4 Pro / V4 Flash |
| manor mode | plan mode |
| prom 一件利润 | prompt engineering |
| context引擎运营/connect引的泥人 | context engineering |
| code bird | code 补全 |
| 制服 | 智谱 |
| cloud4.0office | Claude 4.0 Opus |
| software A j | software agent |
| 路虎/A城路虎/1entity coding/agentity loop | loop / agentic loop / agentic coding |
| 长沙爱文 | 长 context |
| hello cover | Claude Code |
| LICEN点MD | LESSONS.md |
| progress的ITST | progress.txt |
| 爱丽丝/excat is on/普兰/洗然 | edits / accept edits on / plan / execution（权限模式） |
| gate | git |
| 哈里斯 | harness |
| 楼盘格式 | OpenAI 格式 |
| chat combition | chat completions |
| catch/singer print | cache / fingerprint |
| great/come/rafa | greet / comma / verify |

## 编者补充

- 编者补充（跨集联系）：git worktree 处明说"之前玉川应该给大家讲过了 git"，与第 1 讲 Git 内容衔接；slides 主要致谢微信博主"小石潭记memo"的 Python 课材料。第 8 讲把本讲的 agent loop/compact/sub-agent 全部落到源码层面，两讲连读效果最好。
- 编者补充（行动线）：最佳上手作业是照讲义用 OpenAI SDK 复现最小 agent loop（read/write/test 三工具 + execute_tool + subprocess）；其次在自己仓库实践 CLAUDE.md、/rewind、/compact 与 plan mode。
- 编者补充（缺口）：MCP 仅一句带过，协议细节与配置示例要等第 8 讲或自行补；Claude Code 的安装配置讲者明说"网上搜一下"，本讲未覆盖。
