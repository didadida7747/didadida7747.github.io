---
title: "11 · ZCF 与本机配置：你装的那套命令到底是什么"
---

# 11 · ZCF 与本机配置：你装的那套命令到底是什么

> 定位：ZCF 是你本机 Claude Code / Codex 的"预装操作系统"。本章把它拆开讲清，再给你本机资产的体检结论和 5 条优化建议。

---

## 11.1 ZCF 是什么

**ZCF（Zero-Config Code Flow，GitHub: UfoMiao/zcf）**是一个开源的一键配置框架，**同时支持 Claude Code 和 Codex**（这正是 §01 说的"扩展层趋同"的产物）。它解决的是国内上手两大框架的麻烦：网络接入、MCP 选型、工作流模板——一条命令全配好。

```text
npx zcf      # 交互菜单
npx zcf i    # 完整初始化
npx zcf u    # 仅更新工作流
```

## 11.2 它往你机器上装了什么（逐项拆解）

| 模块 | 内容 | 对应本手册 |
|---|---|---|
| **API 接入** | 官方 / 自定义 Key / CCR 代理；预置 302.AI、GLM、Kimi、MiniMax | §09.6 成本策略 |
| **MCP 预置** | Context7（库文档）、Open Web Search、Spec Workflow、DeepWiki（仓库解读）、Playwright（浏览器）、Serena（语义代码检索） | §04 |
| **工作流技能** | `/workflow` 六阶段、`/feat`、`/git-commit` 等 Git 命令组、spec 规格驱动、bmad 敏捷流程 | §04 |
| **记忆模板** | 写入 CLAUDE.md / AGENTS.md 初稿 | §02 |
| **环境** | 输出风格、语言配置、权限模板、CCometixLine 状态栏、ccusage 用量统计 | §03/§09 |

### zcf 工作流命令逐条讲

- **`/workflow`——六阶段结构化开发**（社区俗称"六阶段"，不是四阶段）：需求分析 → 方案设计（plan）→ 任务拆解 → 逐步实现（每步验证）→ 测试验收 → 总结沉淀。本质是把 §08 场景 3/7/10 的"plan 先行 + 验证闭环"做成了固定管道。**适合**：多天的大课设、结构清晰的功能开发。**不适合**：三行代码的小改动（仪式感过重，直接说话更快）。
- **`/feat <功能>`**：单功能开发管道——理解上下文 → 方案 → 实现 → 自测，是 /workflow 的轻量版。
- **`/git-commit` 等 Git 组**：读 diff → 规范化提交信息 → 分步提交。配合 §03 的 allow 规则 `Bash(git add *)` 免弹窗。
- **spec 规格驱动 / bmad**：更重的文档先行方法论，团队项目/大创有用，个人课设可选。

## 11.3 已知坑与对策

| 坑 | 对策 |
|---|---|
| **ZCF 更新可能覆盖手写的 CLAUDE.md**（官方已修复部分场景，但仍需防） | 记忆文件纳入 git；`npx zcf u` 前备份；更新后 `git diff` 检查 |
| 预装 MCP 全开吃上下文 | `/context` 体检 → `/mcp` 摘掉不常用的（Serena/DeepWiki 按需开） |
| 权限模板较宽松 | 用 §03 的三档配置覆盖：deny 危险命令 + `bypassPermissions` 不落地真实目录 |
| 技能/命令日积月累变乱 | `/skills` 按 token 排序瘦身；不用的 zcf 命令直接删文件 |

## 11.4 你本机资产盘点（2026-10 探查）

| 位置 | 现状 | 评价 |
|---|---|---|
| `~/.claude` | 148 个会话；zcf 的 commands/agents（planner、ui-ux-designer 等）；6 套 output-styles；grill-me、tabbit 等 skills | 定制丰富，但**层与层有冗余**（zcf 工作流与手写 skill 职责重叠） |
| `~/.codex` | 241 个会话；config.toml 在用（2026-10-23 仍活跃）；**AGENTS.md 为空** | 使用最频，但**记忆层没建**——每次都在重教 |

## 11.5 五条优化建议（按优先级）

1. **把 `~/.codex/AGENTS.md` 填上**（最划算的一件事）：你 241 个会话积累的纠正，每次都在从头教。写你的通用偏好：中文回复、注释风格、常用库、禁区。半小时投入，从此每个 Codex 会话都带着记忆开工（§2.4 AGENTS.md 模板直接抄）。
2. **记忆文件全部入 git**：`~/.claude/CLAUDE.md`、项目 CLAUDE.md/AGENTS.md 建一个 dotfiles 仓库管理——ZCF 更新覆盖时可一键恢复。
3. **给 zcf 的 MCP 做减法**：`/context` 跑一次，把 6 个预置 MCP 里月用不到 2 次的禁用——上下文省出来的都是钱和质量。
4. **统一双工具的会话命名规范**：`课设-课程-子任务` 三段式（§02/§08），两边一致，/resume 和 /title 才有意义。
5. **output-styles 做减法**：6 套留 3 套（Default / Concise / Learning），剩下的删——每个都是启动加载项。

## 11.6 排障速查

| 症状 | 动作 |
|---|---|
| Claude Code 行为异常/不听配置 | `claude doctor`（加 `prompt-audit` 查记忆文件过时写法）→ 仍异常 `claude --safe-mode`（禁用全部定制复现）→ 定位到插件/hook 再逐个排除 |
| Codex 配置改了没生效 | `/debug-config` 看实际生效值（层级合并结果）→ `codex doctor` 环境报告 |
| MCP 连不上 | CC `/mcp reconnect all`；Codex `/mcp verbose` 全量诊断、`/mcp login <名>` 补 OAuth |
| 账号/用量异常 | `/usage` 两边各查一次；CC `claude doctor` 看登录态 |
| ZCF 更新后配置乱了 | git 恢复（见 11.5-2）；必要时 `npx zcf i` 重配再 diff |

## 11.7 本章验收清单

- [ ] 能说出 `/workflow` 六阶段是什么、什么时候不用它
- [ ] `~/.codex/AGENTS.md` 不再是空文件
- [ ] 记忆文件进了 git，并演练过一次"被覆盖→恢复"
- [ ] 用 `/context` 砍掉了至少 1 个低频 MCP
- [ ] 跑通过一次 `claude --safe-mode` 或 `/debug-config` 排障

---

**来源**：ZCF 官方仓库与文档（github.com/UfoMiao/zcf、zcf.ufomiao.com）、CSDN 详评与知乎分析（见 reference）；本机盘点来自 2026-10-24 只读探查。
