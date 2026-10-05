---
title: "来源索引"
---

# 来源索引

## 本地与上游仓库

| 来源 | 用途 | 本次核对 |
|---|---|---|
| `D:\其他\templates\requirement.md` | 本地需求模板 | 读取并与上游对比 |
| `D:\其他\templates\task.md` | 本地 R/D/C 任务模板 | 读取并与上游对比 |
| `D:\其他\templates\pre-implementation-design.md` | 本地实现前设计模板 | 读取并与上游对比 |
| `https://github.com/zwisgod/ai-governance` | 已蒸馏的治理 skill 参照 | 浅克隆；HEAD `f1b5c62f6ab181f4983d2359c398e225db2d5733`，2026-07-27 |
| `https://github.com/xai-org/grok-build` | Grok Build CLI 官方/上游源码与 docs | 浅克隆；HEAD `dd04f397b1d02f2272b092555669dfba1f01bc85`，2026-07-30 |

## Grok Build 官方文档路径

本次主要使用克隆仓库内文档：

```text
crates/codegen/xai-grok-pager/docs/user-guide/
01-getting-started.md
03-keyboard-shortcuts.md
04-slash-commands.md
05-configuration.md
07-mcp-servers.md
08-skills.md
09-plugins.md
10-hooks.md
11-custom-models.md
12-project-rules.md
13-memory.md
14-headless-mode.md
15-agent-mode.md
16-subagents.md
17-sessions.md
18-sandbox.md
19-plan-mode.md
20-background-tasks.md
22-permissions-and-safety.md
23-dashboard.md
24-monitoring-usage.md
```

教程路径：

```text
crates/codegen/xai-grok-pager/docs/tutorial/
01-coming-from-another-tool.md
02-first-prompt.md
05-slash-commands.md
06-worktrees.md
07-plan-and-permissions.md
09-where-next.md
```

## xAI Docs Web

| URL | 用途 |
|---|---|
| `https://docs.x.ai/build/overview` | Grok Build 总览、安装、TUI/headless/ACP、自定义模型、API 示例 |
| `https://docs.x.ai/llms.txt` | xAI 文档索引；用于确认 API 功能分类 |

## 本机命令证据

| 命令 | 结论 |
|---|---|
| `E:\grok\bin\grok.exe --version` | `grok 0.2.114 (0c78503879)` |
| `E:\grok\bin\grok.exe --help` | 确认 TUI、headless、worktree、resume、dashboard、mcp、memory、plugin、agent、sandbox 等命令 |
| `E:\grok\bin\grok.exe doctor --json` | 退出码 0；Windows Terminal 基本可用，Alt+Enter 换行建议 |
| 读取 `C:\Users\fjbsllc\.grok\config.toml` | 默认模型、relay、responses backend 已核对，密钥已脱敏 |
