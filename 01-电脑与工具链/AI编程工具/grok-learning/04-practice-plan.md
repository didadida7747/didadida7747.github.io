# 04 - 7 天练习路线

## Day 1：启动、诊断、读仓库

- 运行 `grok --version`、`grok doctor --json`、`grok inspect`。
- 在一个真实项目目录启动 `grok`。
- 让它只读项目并输出运行方式、测试命令、核心模块。
- 产出：一份项目理解笔记。

## Day 2：小修复闭环

- 选择一个低风险小问题。
- 要求 Grok 定位、最小改动、运行相关验证。
- 产出：改动文件清单、验证命令和结果。

## Day 3：会话和上下文管理

- 练习 `/new`、`/resume`、`/compact`、`/context`、`/session-info`、`/export`。
- 练习 `grok sessions list/search`。
- 产出：导出一份会话 Markdown。

## Day 4：规则与治理

- 给一个项目写 `AGENTS.md`。
- 用 `skills/ai-governance` 的流程写一个需求和任务拆分。
- 产出：需求文档、任务文档、复杂度判定。

## Day 5：headless 自动化

- 用 `grok -p` 做只读代码解释。
- 用 `--output-format json` 提取结果。
- 写一个 prompt 文件，用 `--prompt-file` 运行。
- 产出：一个可重复运行的本地命令。

## Day 6：MCP / skill / plugin 认知

- 查看 `grok mcp list` 和 `grok plugin list`。
- 只接一个低风险、本地、只读或窄范围 MCP。
- 运行 `grok mcp doctor` 验证。
- 产出：MCP 配置笔记和风险边界。

## Day 7：进阶试验

任选其一：

- 用 worktree 做隔离实现。
- 用 Plan Mode 做中型任务设计。
- 用 streaming-json 做脚本消费。
- 用 xAI Responses API 写最小 demo。

产出：一份“可复用流程卡片”，写清命令、输入、输出、验证和适用场景。

## 每天固定复盘

- 今天 Grok 做对了什么？证据是什么？
- 它哪里猜错或做过头？如何通过规则/提示避免？
- 下次能沉淀成 `AGENTS.md`、skill、hook 还是脚本？

