---
title: "Grok 使用知识库"
---

# Grok 使用知识库

本项目用于沉淀 Grok Build 的本机配置、快速上手路线、进阶功能资料，以及从本地模板蒸馏出的实现前治理 skill。

## 目录

- `grok-learning/`：Grok Build 学习资料、命令速查、练习路线和来源索引。
- `skills/ai-governance/`：从 `D:\其他\templates` 与 `zwisgod/ai-governance` 蒸馏出的可复用 skill。
- `.spec-workflow/`：项目原有规格化工作流模板，未改动。

## 推荐阅读顺序

1. `grok-learning/00-start-here.md`
2. `grok-learning/01-quickstart.md`
3. `grok-learning/02-command-cheatsheet.md`
4. `grok-learning/03-advanced-map.md`
5. `grok-learning/04-practice-plan.md`

## 本机状态快照

- 已验证 Grok Build CLI：`E:\grok\bin\grok.exe`，版本 `grok 0.2.114 (0c78503879)`。
- 当前用户配置：`C:\Users\fjbsllc\.grok\config.toml`，默认模型为 `grok-4.5`，走自定义 relay，`api_backend = "responses"`。
- Windows Terminal 诊断：`grok doctor --json` 退出码 0；只有一条建议，Shift+Enter 可能无法换行，使用 Alt+Enter。
