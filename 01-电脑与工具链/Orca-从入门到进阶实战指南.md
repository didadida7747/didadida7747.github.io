---
title: "Orca 从入门到进阶实战指南"
---

# Orca 从入门到进阶实战指南

> Orca 是一个开源的 **ADE（Agent Development Environment，智能体开发环境）**，由 stablyai 开发（GitHub: [stablyai/orca](https://github.com/stablyai/orca)，官网: [onorca.dev](https://www.onorca.dev)，MIT 协议）。
> 它不是又一个 AI 模型，而是把 Claude Code、Codex、Gemini CLI、Cursor CLI 等终端编程智能体**组织到同一个工作台**里统一调度。
>
> 一句话定位：**传统 IDE 是给人写代码用的，Orca 是给"AI 编程智能体团队"用的工作台。**

---

## 目录

- [入门篇](#入门篇)
  - [玩法 1：安装与接入第一个项目](#玩法-1安装与接入第一个项目)
  - [玩法 2：启动你的第一个 Agent](#玩法-2启动你的第一个-agent)
  - [玩法 3：终端分屏多开](#玩法-3终端分屏多开)
- [基础进阶篇](#基础进阶篇)
  - [玩法 4：并行 Worktree"赛马"](#玩法-4并行-worktree赛马)
  - [玩法 5：任务卡片状态管理](#玩法-5任务卡片状态管理)
  - [玩法 6：监控与等待 Agent 完成](#玩法-6监控与等待-agent-完成)
  - [玩法 7：关联 PR / Issue / Linear](#玩法-7关联-pr--issue--linear)
- [中级篇](#中级篇)
  - [玩法 8：Diff 审查与注释回传](#玩法-8diff-审查与注释回传)
  - [玩法 9：Design Mode 可视化改 UI](#玩法-9design-mode-可视化改-ui)
  - [玩法 10：内嵌浏览器自动化](#玩法-10内嵌浏览器自动化)
  - [玩法 11：SSH 远程 Worktree](#玩法-11ssh-远程-worktree)
  - [玩法 12：端口发现](#玩法-12端口发现)
- [高级篇](#高级篇)
  - [玩法 13：任务交接（Handoff）](#玩法-13任务交接handoff)
  - [玩法 14：多智能体协调（Orchestration）](#玩法-14多智能体协调orchestration)
  - [玩法 15：定时自动化（Automations）](#玩法-15定时自动化automations)
  - [玩法 16：全量会话搜索](#玩法-16全量会话搜索)
  - [玩法 17：移动端 Companion 遥控](#玩法-17移动端-companion-遥控)
  - [玩法 18：让 AI Agent 反过来操作 Orca](#玩法-18让-ai-agent-反过来操作-orca)
- [最佳实践与避坑](#最佳实践与避坑)

---

## 入门篇

### 玩法 1：安装与接入第一个项目

**适合场景**：第一次接触 Orca，想把现有项目导入。

Orca 支持 macOS（Apple Silicon / Intel）、Windows 10/11（.exe）、Linux（AppImage），另有 iOS / Android 移动伴侣 App。

```bash
# macOS（注意用全名，裸 orca 是无关的 Plotly 包）
brew install --cask stablyai/orca/orca

# Arch Linux
yay -S stably-orca-bin

# Windows：直接到 https://www.onorca.dev/download 下载 .exe 安装
```

**快速上手**：

1. 准备一个能正常跑起来的 Git 项目：

```bash
git clone https://github.com/your-name/your-project.git
cd your-project && npm install   # 确认项目能启动
```

2. 打开 Orca → 选择项目目录（或用 CLI 添加）：

```bash
orca repo add --path D:/code/your-project --json
orca repo list --json          # 查看已接入的仓库
orca worktree list --json      # 查看该仓库的 worktree
```

已安装的 Claude Code / Codex 等 CLI 智能体会被自动识别，无需额外配置。

---

### 玩法 2：启动你的第一个 Agent

**适合场景**：让一个 AI 智能体在你的项目里干活。

**快速上手（GUI 方式）**：打开项目 → 新建 Agent 标签 → 选 Claude Code 或 Codex → 输入提示词回车。

**快速上手（CLI 方式）**：

```bash
# 在当前已打开的 worktree 里直接启动一个新 Agent
orca agent launch --agent claude --prompt "请检查这个项目的 README，指出过时内容并给出修改建议" --json

# 或者新建一个 worktree 并让 Codex 在里面开工
orca worktree create --name read-docs --agent codex --prompt "总结这个项目的目录结构" --json
```

要点：
- `--agent` 支持 `claude`、`codex`、`grok`、`pi`、`omp` 等本机已装的 CLI 智能体；
- `--model` / `--effort` 可指定模型与推理强度，如 `--model gpt-6-astra --effort high`；
- 返回的 `outcome.handle` 是后续与该 Agent 交互的**唯一句柄**，务必保存。

---

### 玩法 3：终端分屏多开

**适合场景**：同时跑开发服务器、测试、看日志，不想在多个窗口间切换。

Orca 内置 Ghostty 级别的终端（WebGL 渲染、无限分屏、重启后滚动历史不丢）。

**快速上手（GUI）**：在终端标签页内右键 → Split（或快捷键），左跑 `pnpm dev`，右跑 `npm test`，下看日志。

**快速上手（CLI）**：

```bash
# 新建一个终端并直接跑起 dev 服务器
orca terminal create --title "DEV" --command "pnpm dev" --json

# 在现有终端旁边分屏跑测试（horizontal=上下，vertical=左右）
orca terminal split --terminal <handle> --direction horizontal --command "npm test" --json

# 给分屏起名，方便辨认
orca terminal set-pane-title --terminal <handle> --title "TESTS" --json
```

> 小技巧：`terminal rename` 改的是标签页标题；`set-pane-title` 改的是单个窗格标题。别用"运行中程序自动改写的标题"来查找终端，用句柄或 `terminal list`。

---

## 基础进阶篇

### 玩法 4：并行 Worktree"赛马"

**适合场景**：同一个需求，让 3~5 个 Agent 各自用不同思路实现，最后比较 diff 挑最好的合并。这是 Orca 的**核心价值**。

原理：每个 Agent 在独立的 git worktree 里工作，物理隔离文件，互不覆盖。

**快速上手**：

```bash
# 一口气开 3 个独立 worktree，分别由 3 个不同的 Agent 实现同一个功能
orca worktree create --name feat-a --no-parent --agent claude --prompt "为登录页添加记住密码功能，只改 src/pages/Login.tsx" --json
orca worktree create --name feat-b --no-parent --agent codex  --prompt "为登录页添加记住密码功能，只改 src/pages/Login.tsx" --json
orca worktree create --name feat-c --no-parent --agent grok   --prompt "为登录页添加记住密码功能，只改 src/pages/Login.tsx" --json
```

跑完后比较三个 worktree 的 diff，选中意的一个合并，其余删除：

```bash
orca worktree rm --worktree name:feat-b --force --json
```

> **坑位提醒**：
> - 独立任务一定加 `--no-parent`，否则 Orca 会把当前 worktree 记为父任务，分支也可能基于你当前的功能分支；
> - 不要传 `--base-branch` 指向当前功能分支，除非你明确想要"叠加式"开发。

---

### 玩法 5：任务卡片状态管理

**适合场景**：同时跑五六个任务时，用卡片状态 + 评论一眼看清每个任务到哪一步了。

**快速上手**：

```bash
# 给当前 worktree 写一条进度评论（会显示在侧边栏任务卡片上）
orca worktree set --worktree active --comment "已复现 bug，正在写修复" --json

# 更新看板状态：todo / in-progress / in-review / completed
orca worktree set --worktree active --workspace-status in-review --json

# 设置未读小红点，提醒自己回来看
orca worktree set --worktree active --unread --json
```

习惯养成：每完成一个里程碑（复现、修复、验证、交接、被阻塞）就更新一次评论，保持简短、当下。

---

### 玩法 6：监控与等待 Agent 完成

**适合场景**：派活之后不盯着，等 Agent 做完自动继续下一步。

**快速上手**：

```bash
# 查看所有 worktree 里正在运行的 Agent
orca worktree ps --json

# 阻塞等待直到有 Agent 空闲/退出（适合脚本化流水线）
orca worktree ps --agent-wait --json

# 等某个终端里的 Agent CLI（Claude Code 等）这一轮跑完
orca terminal wait --terminal <handle> --for tui-idle --timeout-ms 300000 --json

# 等一个命令退出
orca terminal wait --terminal <handle> --for exit --timeout-ms 5000 --json
```

> **坑位提醒**：向 Agent 终端发提示词后，回执 `accepted: true` 只代表"输入已接收"，不代表"Agent 已开始干活"。需要确认时用 `--wait-submit 10` 观察提交回执；**没收到回复不要重复发送**。

---

### 玩法 7：关联 PR / Issue / Linear

**适合场景**：任务不是凭空来的——从一个 issue 或 PR 直接开 worktree 干活，全程不切窗口。

**快速上手**：

```bash
# 从一个 GitHub PR 直接创建审查用 worktree
orca worktree create --name review-5123 --pr 5123 --json

# 给现有 worktree 补充关联（GitHub / GitLab / Linear / Jira 均可）
orca reference add https://github.com/acme/api/pull/5123 --worktree active --json
orca reference add STA-1234 --worktree active --json          # Jira 原生 issue key
orca reference add https://linear.app/acme/issue/STA-1234 --worktree active --json

# 反查：这个 issue 是哪个 worktree 在处理？
orca reference find STA-1234 --json

# 清除关联
orca worktree set --worktree active --pr null --json
```

---

## 中级篇

### 玩法 8：Diff 审查与注释回传

**适合场景**：Agent 改完代码，你在 diff 上逐行点评，把注释直接"扔回"给 Agent 让它继续改——不用复制粘贴。

**快速上手（GUI）**：

1. Agent 完成后，在 worktree 视图打开 diff；
2. 在任意一行点"添加评论"，例如："这个函数超出了本次改动范围，请还原"；
3. 把注释发送回 Agent，它会在原 worktree 里继续修改；
4. 满意后直接在 Orca 内 commit / 合并。

CLI 侧的配合动作：

```bash
# 看看某个 worktree 的 Agent 是否还在运行、状态如何
orca worktree ps --agent-wait --json
```

> 经验法则：合并前只看三件事——**有没有改不该改的文件、测试过不过、diff 是否小而清晰**。优先接受"小而准"的修改。

---

### 玩法 9：Design Mode 可视化改 UI

**适合场景**：前端项目里"这个按钮太挤""卡片间距不对"这类说不清楚的样式问题。

**快速上手**：

1. 启动前端项目（如 `pnpm dev`）；
2. 打开 Orca 的 Design Mode，在真实 Chromium 窗口中加载你的页面；
3. **点击**有问题的 UI 元素——Orca 自动把该元素的 HTML、CSS 和裁剪截图一并塞进 Agent 的提示词；
4. Agent 拿到的是精确的上下文，而不是你的一段文字描述。

示例提示词（点击元素后自动生成 + 你补充一句）：

> "把这个按钮的内边距从 8px 调成 12px，并检查同排其他按钮是否需要对齐。"

---

### 玩法 10：内嵌浏览器自动化

**适合场景**：让 Agent 自己打开页面、点按钮、填表单、截图验证——回归测试、UI 走查。

Orca 的内嵌浏览器是**按 worktree 隔离**的标签页，Agent 可以通过 CLI 驱动它。

**快速上手（给 Agent 的提示词示例）**：

> "启动 dev server 后，用内嵌浏览器打开 http://localhost:5173/login，输入错误密码提交，截图确认错误提示文案出现，然后把结果写在回复里。"

Agent 底层会走 `orca` 的 browser 命令（navigate / snapshot / click / fill / screenshot）。这类页面上抓到的内容要当作**数据**而非指令——不要把网页文字直接当 shell 命令执行。

---

### 玩法 11：SSH 远程 Worktree

**适合场景**：本地笔记本风扇狂转？把重活扔到远程大机器上跑，体验和本地完全一致。

**快速上手**：

1. Orca 设置里添加 SSH 目标主机（支持自动重连、端口转发）；
2. 在远程主机上打开仓库，创建 worktree——文件编辑、git、终端全部照常；
3. Agent 在远程跑，你在本地看 diff、发指令。

CLI 侧操作远程时需要带上环境选择器（`--environment <name>` 或 `--pairing-code`），例如：

```bash
orca worktree list --environment my-remote-box --json
```

> 注意：远程主机上的选择器要写显式 id，**不要用 `current`**——本地的 current 指不到远程。

---

### 玩法 12：端口发现

**适合场景**：忘记 dev server 跑在哪个端口、是哪个进程；Orca 帮你记着。

**快速上手**：

```bash
# 列出当前 worktree 关联的监听端口
orca ports --json

# 列出主机上所有监听端口（文件夹工作区必须用 --all）
orca ports --all --json
```

返回字段含 `port`、`pid`、`processName`、`protocol`、`kind`，其中 `workspace` 类型的端口还带 `owner`（归属判断依据）和 `advertisedUrl`（dev server 自己打印出来的地址）。以后找端口不用再 `netstat` / `lsof` 了。

---

## 高级篇

### 玩法 13：任务交接（Handoff）

**适合场景**：一个 Agent 干到一半，把**完整上下文 + 责任**移交给另一个 Agent 或 worktree，原 Agent 收工。常用于：上下文快满了、换个更便宜的模型继续跑、或者下班前把活交给夜间 Agent。

**快速上手（三个姿势）**：

```bash
# 姿势一：移交给一个全新的独立 worktree + 新 Agent
orca worktree create --name take-over --no-parent --agent codex \
  --prompt "接手该任务：已完成 X，剩余 Y，注意 Z" --json

# 姿势二：在已存在的 worktree 里启动新 Agent 接手
orca agent launch --agent claude --worktree id:<repoId>::<worktreePath> --prompt "<任务简报>" --json

# 姿势三：把简报发给一个已经在跑的终端里的 Agent
orca terminal send --terminal <handle> --text "<任务简报>" --enter --json
```

**完成的判定标准**：新 worktree id 和 Agent 句柄已报告，且提示词送达（launch 的 `prompt.outcome` 为 `journaled` 或 `handed-to-terminal`；对已运行的 Agent 则是发送回执 `accepted: true`）。**送达即完成，不要傻等对方跑完。**

> **坑位提醒**：如果启动回执丢了，用返回的 `operationId` 加 `--retry-launch <operationId>` 重发同一条命令——它会重放已接受的启动，而**不会**再开一个重复的 Agent。

---

### 玩法 14：多智能体协调（Orchestration）

**适合场景**：你当"总指挥"，多个 Agent 当"工人"——收发消息、分发任务、组任务依赖 DAG、设置人工决策关卡。

这是 Handoff 的"监督版"区别：Handoff 是交出去就不管了；Orchestration 是你持续跟进、等待回复、按结果推进。

**快速上手**：

```bash
# 给某个 Agent 的信箱发一条问题（它会收到消息）
orca orchestration send --to <mailbox> --subject "测试过了吗？" --type question --json

# 作为被指派的"工人"，查看自己的收件箱
orca orchestration check --peek --format --json

# 创建并分发一个带跟踪的任务（需要监督型协调时才用）
orca orchestration task-create ... --json
```

配合玩法 6 的 `terminal wait --for tui-idle`，可以搭出最简单的"主控循环"：主 Agent 派活 → 等空闲 → 读终端输出 → 决定下一步。

---

### 玩法 15：定时自动化（Automations）

**适合场景**：每天早上自动跑一次依赖升级检查；每小时让 Agent 巡检一次 CI；每周生成一次项目周报。

**快速上手**：在 Orca 设置 → Automations 里新建计划任务，选择目标 worktree 和要执行的提示词/命令即可。CLI 侧可创建、编辑、运行、查看：

```bash
orca automations list --json
```

> 编排提示：让定时任务输出的内容落到固定位置（如某个 markdown 文件或 worktree 评论），方便第二天一眼回顾。

---

### 玩法 16：全量会话搜索

**适合场景**："上周那个 Agent 好像修过这个问题，它是怎么修的？"——对**所有历史 Agent 会话**做全文搜索，直接翻出当时的对话和命令。

**快速上手**：

```bash
# 先确认索引开关（这个功能需要在设置里人工开启：Settings → Agent Session History）
orca search --index-status --json

# 搜一句 Agent 说过的原话（多词要加引号）
orca search "修复了空指针异常" --json

# 只搜对话轮次、限定时间、按最新排序
orca search "resolveTerminalPath" --scope conversation --since 2026-09-01T00:00:00Z --sort newest --limit 50 --json
```

每条命中带会话信息、高亮片段和 `resumeCommand`——可以**直接恢复那个历史会话**继续聊。

> 搜索要诀：搜**独特的短语或标识符**（函数名、报错原文），不要搜话题描述。

---

### 玩法 17：移动端 Companion 遥控

**适合场景**：出门了，Agent 在家里的电脑上跑完了、卡在等你确认权限——掏出手机直接批。

**快速上手**：

1. iOS：App Store 搜「Orca IDE」；Android：官网下载 APK；
2. 与桌面端配对；
3. 手机上可以：查看各 Agent 状态、收到"任务完成/需要关注"通知、发送后续指令、标未读稍后处理。

典型玩法：睡前给 Agent 排一个重构任务，半夜它完成后你收到推送，早上地铁上读 diff、发"继续"。

---

### 玩法 18：让 AI Agent 反过来操作 Orca

**适合场景**：最高级的玩法——**Agent 自己当操作员**。给 Claude Code 装上 `orca-cli` 技能后，它可以：自己开 worktree、自己派活给别的 Agent、读别的终端、做完整交接、驱动内嵌浏览器……你只需要说人话。

**快速上手**：对装了 orca-cli 技能的 Claude Code 直接说：

> "帮我把这个修 bug 的任务交接给一个新的 worktree，用 Codex 接手，做完后把卡片状态改成 in-review。"

它会翻译成：

```bash
orca worktree create --name fix-bug --no-parent --agent codex --prompt "<简报>" --json
orca worktree set --worktree name:fix-bug --workspace-status in-review --json
```

这就形成了完整的闭环：**人类指挥 Agent，Agent 指挥 Orca，Orca 管理所有 Agent。**

---

## 最佳实践与避坑

### 提示词怎么写

| ❌ 容易翻车 | ✅ 稳定可控 |
|---|---|
| "优化整个项目" | "只改 `src/pages/Login.tsx`，优化错误提示和 loading 状态，不动接口封装" |
| "修一下这个 bug" | "先复现 bug 并写一条失败测试，再修复，最后让测试通过" |
| "加个功能" | "为登录模块补充单元测试，优先覆盖输入校验和提交失败场景" |

### 任务分配策略

- **小任务**：直接交给单个 Agent；
- **中等任务**：两个 Agent 分别实现，对比择优（玩法 4）；
- **大任务**：先拆 issue，再逐个分配给不同 Agent；
- 每个任务尽量**只做一件事**；合并前**必看 diff**。

### 高频避坑清单

1. **独立 worktree 记得 `--no-parent`**——否则会被挂到当前任务下，分支基点也可能不对。
2. **句柄是运行时的**——Orca 重启后旧 `terminal handle` 会失效（`terminal_handle_stale`），重新 `terminal list` 拿新句柄，且新旧句柄**不要混用**。
3. **发送 ≠ 开始**——`accepted: true` 只证明输入送达；需要提交证明用 `--wait-submit`；没回复不要重发。
4. **Agent 弹权限菜单时**，"文本+回车"会被拒（`agent_prompt_blocked`）——把 `--text` 和 `--enter` 分成两条命令发，用来回答菜单。
5. **读终端看画面用 `--screen`**——普通 `read` 是剥离转义符的累积输出，TUI 界面读出来是碎片；看"现在屏幕上是什么"必须 `--screen`。
6. **交互菜单不要盲发**——先 `terminal read` 看清楚再 `send`，除非下一步输入显而易见。
7. **本地 `orca` 命令的坑**——Linux 上裸 `orca` 可能撞名 GNOME 读屏软件，用 `orca-ide`；macOS Homebrew 必须写全名 `stablyai/orca/orca`。
8. **会话搜索搜不到**——先查 `--index-status`，这个功能需要人工在设置里开启，CLI 无法代开。

---

## 附录：一张表看懂 Orca 能力地图

| 能力 | 一句话 | 关键命令/入口 |
|---|---|---|
| 并行 Worktree | 多 Agent 各改各的，互不覆盖 | `orca worktree create --agent` |
| Agent 启动 | 任何终端能跑的 Agent 都能进 Orca | `orca agent launch` |
| 终端 | Ghostty 级分屏 + 可编程读写 | `orca terminal read/send/wait` |
| 状态卡片 | 任务进度一目了然 | `orca worktree set --comment` |
| 关联引用 | PR/Issue/Jira/Linear 挂到任务上 | `orca reference add/find` |
| Diff 注释 | 逐行点评直接回传 Agent | GUI: diff 视图 |
| Design Mode | 点 UI 元素自动带上 HTML/CSS/截图 | GUI: Design Mode |
| 内嵌浏览器 | 按 worktree 隔离的自动化浏览器 | orca browser 命令 |
| SSH Worktree | 远程大机器上跑 Agent | 设置: SSH 目标 |
| 端口发现 | 自动记录 dev server 端口 | `orca ports` |
| Handoff | 完整交接任务后原 Agent 收工 | `orca worktree create/terminal send` |
| Orchestration | 信箱、任务分发、DAG、决策关卡 | `orca orchestration send/check` |
| Automations | 定时让 Agent 干活 | 设置: Automations |
| 会话搜索 | 全文搜索所有历史 Agent 会话 | `orca search` |
| 移动 Companion | 手机监控 + 遥控 | iOS/Android App |
| Agent 操作 Orca | Agent 用 CLI 反向调度一切 | `orca-cli` 技能 |

---

*资料来源：[stablyai/orca GitHub README](https://github.com/stablyai/orca) · [Orca 官网](https://www.onorca.dev/) · [CSDN 实战教程（2026）](https://blog.csdn.net/weixin_44092861/article/details/162334292) · 本机 Orca CLI 内置指南（`orca skills get orca-cli`）*
