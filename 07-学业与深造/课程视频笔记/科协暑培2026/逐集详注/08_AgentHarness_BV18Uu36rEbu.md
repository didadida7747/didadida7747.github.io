# 2026科协暑培 · 第8讲 手撕 Claude Code 源码：Agent Harness（张维轩, BV18Uu36rEbu）

## 定位

AI Track 第四讲，本合集导览标注的**精看**讲次。以 Claude Code 泄露版源码为材料，把第 2 讲的 agent loop、compact、sub-agent 全部落到实现层面：五层架构、query loop、工具系统、权限、上下文构建与 skill 按需加载。适合想理解"agent 框架内部到底在跑什么"的读者；也是本合集里最接近"读工程代码"的一讲。约 49 分钟。讲义 https://summer26.net9.org/ai/harness/ 。

## 知识整理

### Harness 是什么：职责与四种控制流

Harness 要解决"如何控制 LLM 处理需要多轮工具调用的复杂任务"，职责包括：管理 LLM 请求（流式响应、重试、超时等异常处理）、构建上下文、工具的注册/校验/执行、权限管理、记录轨迹与 token 用量。按控制流分四种形态：简易问答式（无工具）、workflow（预定义 DAG/固定流水线）、**ReAct agent loop**（每轮根据观察决定下一步，Claude Code 这类编程 agent 的核心）、multi-agent（按角色分工，适合边界清晰可并行的任务，但有通信成本、重复劳动、冲突修改问题）。目前最主流的 harness 是 Codex 和 Claude Code。

### 预备知识：一次 API 调用的真实结构

在 CC 里输入一个 prompt（如让它 read README.md），harness 会构建出结构化 JSON（system prompt + prompt + available tools）发给模型后端，经 tokenizer 的 chat template 序列化成训练格式，模型做 next token prediction 生成 token 流，解析成 JSON 后即可调用工具。**三种 API 格式互不兼容**：Responses API（Codex 使用，`input` 字段）、chat completions API（`messages` 字段）、Anthropic API（Claude Code 使用）。Codex 直连只提供 chat completions 的厂商（如智谱 GLM）用不了，需要中转/代理做 JSON 格式转换——这是接国产模型时的实际坑。

### 抓取运行轨迹：system reminder 与 CLAUDE.md

讲师自己写了收集 Claude Code 轨迹的工具（仓库公开，trace viewer 部署在 GitHub Pages），演示"随机串行调用三个工具"任务的完整请求/响应。虽然用户只输入一个 problem，harness 会自动注入 system reminder，其中加载 CLAUDE.md（每次新开对话都载入，用于跨会话记忆：可复用的 prompt、跨会话约束、项目结构与核心原则），此外还注入当前时间。响应格式为 thinking + 文本 + tool use；下一轮请求把上一轮 response 拼入历史、执行 tool 并把 tool result 一并打包发出，循环直到返回不含工具调用的消息即停止。

### 源码五层架构

分析对象是泄露版源码（非最新版）。自上而下：

1. **入口与界面层**：main.tsx、commander CLI（进程入口）、REPL（交互式 CLI）、print/SDK（非交互入口）、bridge/remote/server（连接 IDE 与远程会话）。
2. **应用编排层**：setup/configure（启动配置与认证）、command registry（斜杠命令如 /clear）、plugins/skills（功能扩展）、tasks/agents/coordinator（任务拆分与多 agent 协作）。
3. **核心 agent 运行时**：query engine/query loop、context/prompt/compact、model API client（流式请求、重试、fallback）、tool、hooks、permission（把模型意图变成受控执行的命令）。
4. **状态与横切服务**：transcript/session（保存恢复会话）、memory/file history（长期结构化状态）、观测。
5. **外部系统与宿主环境**：model provider、shell、MCP server。

整体链路：发送 prompt 后收集 prompt、检索到的 skill/agent 配置、历史 messages，构建 query params 传给 query loop；循环前先看是否需要 auto compact（上下文达 90% 阈值自动压缩），再发请求、执行工具、迭代至无 tool use。

### 启动流程：main → run → 模式分发

main 函数做进程级准备（记录启动状态、设置安全环境、注册退出/中断处理器、解析命令行参数）后调用 run；run 负责"准备 agent 能使用的环境"——读取用户/项目配置、环境变量、CLI 参数覆盖，建立认证、API client 和 session，加载项目上下文（CWD、CLAUDE.md、是否 git 仓库/分支/recent commit），建立权限上下文（沙箱配置、工具调用 context、特定规则），加载 skill，连接 MCP 并把 MCP tool 转成内部 tool、构建工具池。之后按运行模式（`claude` 或 `claude --print`）进入 REPL 交互模式或 print mode。职责边界：**main 和 run 只准备环境，query loop 才是实际执行者**。

### REPL 与 async generator：为什么是生成器

REPL（read-eval-print loop）是长期运行的外层循环：读用户输入，斜杠开头执行对应命令，否则构建 query params。query params 是本次 agent loop 开始时的全部依赖（已有消息、系统提示、用户上下文、工具环境、权限回调、模型、最大轮数、预算等）；query event 是模型新生成文本、工具启动等实时事件。

为什么用 `async function*`：agent 任务可能运行数分钟且持续产生中间事件，普通 async function 只能在结束时返回结果，会让 UI 像卡死；异步生成器多次 yield 事件，REPL 用 `for await` 持续接收并渲染 UI。"query event 不只是一个 UI 的细节，它其实建立了核心循环和不同交互界面（REPL/print mode/SDK）之间的边界。"

### query loop：while true 状态机

"query loop 的本质其实就是一个 while true 的状态机，每次迭代代表一个 agent turn"：检查上下文容量（超阈值 auto compact）→ 准备 system prompt 并把 CLAUDE.md、skill 等归一化为 Anthropic API 的 JSON → 流式接收响应 → 无 tool use 则结束，有则按 name 查工具、校验 input schema、检查权限，全部通过才执行并收集 tool result，转成下一轮 user message 追加。代码中创建 streaming tool executor 支持工具并发执行；流式消息 yield 给上层 UI；有些工具并行不安全（如同时写一个文件）。注意区分：**query loop state（随循环不断更新）≠ query params（loop 启动时的静态配置）**。

### 工具系统与权限

工具对模型暴露 name、description、input schema（以 edit 工具为例：file_path/old_string 必须 string、replace_all 为布尔、required 指定必填）；对 harness 则有是否启用、is concurrency safe、是否只读、是否有破坏性、checkPermissions 流程、call（具体执行并输出 tool result）。tool use context 还包含斜杠/技能命令定义、当前可用工具全集、已连接的 MCP server 客户端、可供主 agent 委派的子 agent 定义。Bash 工具示例：schema 校验参数 → 静态分析判断命令是否只读，只有明确安全的命令才按只读处理，无法可靠解析的复合命令采取保守策略尽量不执行。

### MCP 与上下文构建、skill 按需加载

MCP 解决"外部工具如何被统一发现、描述和调用"：MCP server 提供固定端点（tools/list 展示可用工具、另一端点实际调用）。Claude Code 本地配置 server URL 与认证 key，每次启动自动连接并拉取工具列表，把远程工具映射为内部工具合并进 tool use。

上下文构建：system 字段含 CC version、系统提示，以及自动收集的 CWD、是否 git 仓库、平台、shell、OS 版本、git status（分支、最近提交）——已知信息无需让模型再查一遍；messages 字段含用户 prompt 与 system reminder（自动加载 CLAUDE.md、日期、附加文件夹、available agent types、可用 skill 列表）。

skill 是一个 markdown 文件（name、description、正文为约束/工作流/新知识，目录可放 scripts、reference）。agent 只把 name+简介放进上下文，模型判断某 skill 匹配任务时用 skill tool 按需加载其 markdown——"因为大模型的 context 是有限的……skill 太多了……我通过这种路由的形式给你一个简介，你视情况选择性地去加载，从而完成 context engineering"（甚至知道你在 IDE 里打开了哪个文件）。

### sub-agent 协作与 compact 压缩

multi-agent 通过工具实现：agent tool 的简介是"能启动一个新的 agent"，参数含 description（任务精简描述）、prompt、subagent type、model。演示"让启动三个 agent 依次报数"：主 agent 调三次 agent tool（subagent type 选 general-purpose），子 agent 默认在后台启动、同样加载 CLAUDE.md 的 system reminder；子 agent 完成后由 task 机制 trigger 主模型继续，最终完成报数。

compact：演示手动 `/compact`，harness 在最后一条 tool result 后追加一大段要求 summarize 的 prompt，模型产出 analysis + 九步 summary；之后发送新消息时旧轨迹全部被替换成该 summary，开头注明 "This session is being continued from a previous conversation that run out of context"，并提示需要细节可去对应文件夹查 JSON 文件；compact 前最后一次 assistant 输出未被压缩（可能为保证连续性）。

结尾列出的未讲内容：hooks、MCP 接入细节、缓存利用、Codex 新功能、Claude Code 的 DSL-based workflow、harness 进化与多智能体编排。

## 勘误对照

| 转写 | 应为 |
|---|---|
| LOM/LMB | LLM |
| deep sick/质谱/质朴 | DeepSeek / 智谱 |
| gm | GLM |
| check completion/check conditions | chat completions |
| token anizer | tokenizer |
| GITHUB配置 | GitHub Pages |
| 要用三个错 | 调用三个工具（存疑） |
| 诡计 | 轨迹 |
| How permission | hooks、permission（连读误转） |
| 一步的 | 异步地 |
| read evil print loop | read-eval-print loop |
| AC function/azing function star | async function / async function* |
| yd | yield |
| querable state | query state |
| tool youth | tool use |
| SC | skill |
| PRONT/PRT | prompt |
| come back | compact |
| 颜值很较低 | 延迟也较低（存疑） |

## 编者补充

- 编者补充（跨集联系）：开场明确衔接第 2 讲的 coding agent 主题；本讲的 compact/sub-agent/skill 正是第 2 讲"两大解法 + document first"的源码落点；结尾把 hooks、MCP 接入、缓存、多智能体编排列为自学内容，与第 11 讲"2025 年安全 agent 的 multi-agent 架构"叙述可交叉印证。
- 编者补充（行动线）：用讲师开源的轨迹收集工具与 trace viewer（GitHub Pages 可访问），本地跑一个自己的任务（如"串行调用三个工具"），对照轨迹观察"请求 → tool use → tool result 回传 → 再请求"的完整循环，再回到源码定位五层架构中 query loop/tool/permission 的位置。
- 编者补充（缺口）：本讲分析的是当年泄露版源码，与最新版实现可能有出入；compact 只演示了手动 `/compact`，auto compact 仅提及 90% 阈值（讲者自承"应该不止这一种 compact 机制"）；转写中 14:03 处"彭于晏"一段语义完全不明，需回看原视频。
