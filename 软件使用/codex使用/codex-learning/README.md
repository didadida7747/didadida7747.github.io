# Codex 学习资料库

更新时间：2026-07-31

本目录基于 `C:\Users\fjbsllc\Desktop\Codex橙皮书.pdf`、OpenAI 官方在线资料、`openai/codex` 官方仓库和本机 Codex 配置整理。目标不是复刻橙皮书，而是把它压缩成适合你快速上手的操作型资料，同时保留后续进阶路线。

## 先读哪几份

1. `01-quick-start/00-30min-onboarding.md`：30 分钟能开始用 Codex 做真实小任务。
2. `02-daily-workflow/01-task-operating-system.md`：日常每个任务都按这个流程跑。
3. `03-cli/01-command-cheatsheet.md`：App 熟悉后再补 CLI 和终端命令。
4. `04-advanced/01-advanced-map.md`：进阶能力总览，先知道有什么，不急着全学。
5. `05-practice/01-practice-ladder.md`：按练习梯度把 Codex 用熟。

## 分类结构

| 目录 | 用途 |
|---|---|
| `01-quick-start/`     | 快速上手、第一周路线、入口选择 |
| `02-daily-workflow/`  | 标准任务流程、提示词模板、验收清单 |
| `03-cli/`             | CLI 安装、命令、Slash commands、终端习惯 |
| `04-advanced/`        | Skills、Plugins、MCP、自动化、GitHub/Cloud、subagents、hooks |
| `05-practice/`        | 从静态网页到真实仓库修 bug 的练习阶梯 |
| `06-troubleshooting/` | Windows、权限、沙盒、编码、网络和回滚问题 |
| `reference/`          | 来源索引、本机环境快照、橙皮书提取笔记 |

## 给你的使用判断

你已经有 Grok Build 和本地 agent 工具使用基础，也习惯让工具真正读文件、改文件、验证结果。因此 Codex 上手不应该从“解释概念”开始，而应该从三个习惯开始：

- 每次任务先让 Codex 读项目和约束，不要直接大改。
- 每次修改前建立可回退点，修改后看 diff 和测试结果。
- 把重复流程沉淀成 `AGENTS.md`、Skill 或模板，而不是每次重新口述。

## 核心原则

- Codex 更适合“推进一个明确工程任务”，不是一次性吞掉一个大项目。
- App 适合你现在快速上手；CLI 适合终端、脚本和自动化；IDE 扩展适合边看代码边改；Cloud/GitHub 适合有仓库、分支和 PR 意识后再用。
- 当前很多界面、额度、模型名、入口位置会快速变化，凡是涉及安装、价格、额度、账号权限、命令参数，都以当前官方页面和本机版本为准。

