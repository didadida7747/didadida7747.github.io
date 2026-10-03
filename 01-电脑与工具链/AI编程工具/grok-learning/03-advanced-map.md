# 03 - 进阶功能地图

## A. 配置与自定义模型

配置文件位置：

```text
Windows: %USERPROFILE%\.grok\config.toml
类 Unix: ~/.grok/config.toml
项目级: <repo>\.grok\config.toml
```

Grok 自定义模型支持三类后端：`chat_completions`、`responses`、`messages`。你的当前 relay 配置使用 `responses`，因此需要 relay 支持 `/v1/responses`。

示例：

```toml
[models]
default = "my-model"

[model."my-model"]
model = "model-id"
base_url = "https://api.example.com/v1"
name = "Display Name"
api_backend = "responses"
env_key = "API_KEY"
context_window = 200000
```

排查顺序：

```powershell
grok inspect
grok models
grok -p "hello" -m my-model --debug --debug-file .\grok-debug.log
```

## B. 项目规则

Grok 会读取项目规则文件，例如 `AGENTS.md`，并按目录层级覆盖。适合写：

- 构建和测试命令。
- 代码风格和架构边界。
- 禁止改动的目录。
- PR/提交规范。
- 本项目要优先阅读的文档。

建议每个长期项目至少有一个根目录 `AGENTS.md`。

## C. MCP 服务器

MCP 用来把外部工具、数据库、文件系统或 SaaS 能力接入 Grok。

适用场景：

- 让 Grok 安全访问特定目录、数据库或内部服务。
- 接入 Sentry、Linear、GitHub 等工具。
- 把自己写的脚本包装成可被 agent 调用的工具。

先用本地小范围文件系统 MCP 练手，再接远程服务。每次新增 MCP 后运行：

```powershell
grok mcp doctor
grok inspect
```

## D. Skills 与 Plugins

Skills 是给 agent 的可复用工作说明；Plugins 可以捆绑 skills、MCP、hooks 和应用元数据。

本项目已创建：

```text
skills/ai-governance/
```

如果要让 Grok 自动发现，通常需要把 skill 放到用户级技能目录或通过插件/配置引入。当前这里先作为项目沉淀与迁移源。

## E. Hooks

Hooks 用于在工具调用、会话结束等事件上运行脚本，可以做安全拦截、日志、自动验证。

典型用法：

- 阻止危险 shell 命令。
- 每次停止前强制运行验证脚本。
- 记录工具调用审计日志。

上手建议：先读官方 safe-shell 和 stop-verify 示例，不要一开始写复杂 hook。

## F. Plan Mode 与权限模式

Plan Mode 适合高风险或中大型任务：先产出计划/设计，确认后再写代码。

常用入口：

```powershell
grok --permission-mode plan
```

TUI 内：

```text
/plan
/view-plan
```

权限模式从稳到快：默认确认 -> auto -> always-approve。越往后越适合自动化，越不适合不熟悉项目或高风险任务。

## G. Subagents、Personas 与 Dashboard

Subagents 用于并行调查、代码审查、测试修复等分工；Personas 定义角色、说明和输出契约；Dashboard 用来管理多个 agent。

适用：

- 大仓库多线索调查。
- 一个 agent 实现，另一个做审查或测试。
- 长任务拆成互不冲突的子任务。

不要把强耦合的同一文件改动拆给多个 agent，以免互相覆盖。

## H. Headless、Agent Mode 与 ACP

Headless 适合脚本化：CI 审查、批量文档生成、定期报告。

Agent Mode / ACP 适合把 Grok 嵌入 IDE、自己的桌面工具或服务。

优先掌握：

```powershell
grok -p "..." --output-format json
grok -p "..." --output-format streaming-json
grok agent stdio
```

## I. Memory、Sessions 与长期任务

会话可以恢复、搜索和导出；Memory 用于跨会话保留偏好和项目知识。

常用：

```text
/remember <事实>
/flush
/dream
/memory
```

对容易过期的事实，例如依赖版本、API 行为、线上状态，要让 Grok 重新验证，不要只依赖记忆。

## J. 监控与企业部署

Grok 支持外部 OpenTelemetry，默认关闭，需要双重开启。适合团队统计会话、token、工具使用、权限决策和错误。

入门阶段不需要配置。团队化以后再看 `Monitoring Usage`、managed config、requirements pinning 和插件 marketplace。

## K. xAI API 与多模态能力

xAI API 文档显示 Grok 相关能力覆盖文本、代码、图像、视频、语音、Files/Collections、函数调用、Web/X Search、代码执行、RAG、Remote MCP、Batch、Deferred Completions、Prompt Caching、Context Compaction、Priority Processing、mTLS、Async Requests 和 WebSocket。

学习顺序建议：

1. Responses API + structured output。
2. Function calling / tools。
3. Files & Collections / RAG。
4. Web Search / X Search。
5. Batch、async、prompt caching、context compaction。
6. 多模态图像、视频、语音。

