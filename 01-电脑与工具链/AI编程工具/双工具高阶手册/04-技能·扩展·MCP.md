---
title: "04 · 技能 · 扩展 · MCP：把流程固化成资产，把外部世界接进来"
---

# 04 · 技能 · 扩展 · MCP：把流程固化成资产，把外部世界接进来

> 本域命令约 18 条。七段式：①概念 → ②CC 详解 → ③Codex 详解 → ④MCP 双向篇（章重心）→ ⑤联动迁移 → ⑥学生视角 → ⑦验收

---

## 4.1 本域解决什么问题（工具无关）

- **重复流程不该每次重教**："拉取数据→清洗→出图→写进报告"这种多步流程，教过一遍就该固化下来，一条命令唤起——这就是**技能（Skills）**。自定义命令（斜杠命令）与技能在两个框架里都已收敛为同一个东西：**一个带 frontmatter 的 Markdown 文件**。
- **Agent 不该是孤岛**：查 GitHub、连数据库、控浏览器——**MCP（Model Context Protocol）**是 AI 的 USB-C 总线：一次接入，处处可用。
- **生态可分装**：skills + agents + hooks + MCP 服务器可以打包成**插件（plugins）**一键分发。

## 4.2 Claude Code 详解

### 4.2.1 技能（Skills）语法全解

**位置与优先级**：企业 managed > `~/.claude/skills/`（个人）> `.claude/skills/`（项目）> 插件自带。**`.claude/commands/deploy.md` 与 `.claude/skills/deploy/SKILL.md` 等价**——旧式单文件命令继续有效，都生成 `/deploy`。

#### `/skills` — 技能管理
- **作用**：列出全部技能；按 token 排序（按 `t`）、切换可见性。技能会占用上下文，定期来这"瘦身"。
- **坑**：每个启用的技能都吃上下文——§02 的 `/context` 体检时重点看它。

#### `/reload-skills` — 不重启热重载
- **作用**：改完 SKILL.md 立即生效（v2.1.152+）。

**SKILL.md 核心语法**（一个例子覆盖 90% 要素）：

```markdown
---
name: lab-report
description: 把实验数据目录变成图表齐全的实验报告初稿
argument-hint: "[数据目录]"
allowed-tools: Bash(python *), Bash(matlab *), Read, Write
context: fork            # 在隔离子代理里执行，不污染主对话
---
把 $ARGUMENTS 下的数据用 matplotlib 出图（先 !`ls $ARGUMENTS` 看文件清单），
按学校报告模板生成 markdown，图表存 reports/figs/。
```

| frontmatter 字段 | 作用 | 典型用法 |
|---|---|---|
| `name` / `description` | 命令名 / 触发依据 | description 写清"何时用"，Claude 靠它自动委派 |
| `argument-hint` | 参数提示 | `"[issue-number]"` |
| `$ARGUMENTS` / `$1` `$0` | 全量参数 / 位置参数 | 正文里占位 |
| `` !`command` `` | **动态注入** shell 输出到提示词 | `` !`git diff HEAD` ``；` ```! ` 围栏可多行；失败则中止整个调用 |
| `allowed-tools` | 本次调用预授权 | 免得每步弹窗 |
| `context: fork` | 隔离子代理执行 | 调研类/长输出类技能必备 |
| `agent: Explore` | 配合 fork 指定子代理 | |
| `disable-model-invocation: true` | 只许人 `/` 调用，模型不能自作主张 | 部署/删除类危险操作 |
| `user-invocable: false` | 只许模型自动触发 | 纯背景技能 |
| `paths` | glob 限定自动触发范围 | 只在改 `*.v` 时触发的 Verilog 技能 |
| `model` / `effort` | 本次调用指定模型/力度 | 重活给 opus，杂活 haiku |

**官方示例模式**（pr-summary 技能）：`context: fork` + `agent: Explore` + `allowed-tools: Bash(gh *)` + `` !`gh pr diff` `` 注入 → 一条 `/pr-summary 123` 拉取 PR 差异出报告。

### 4.2.2 插件与市场

#### `/plugin [子命令]` — 插件管理
- **作用**：list / install / enable / disable。安装：`claude plugin install <名>@<市场>`；官方市场 `claude-plugins-official` 自动添加。
- **是什么**：一个目录打包 skills + agents + hooks + MCP 服务器（v2.1.287 起还能带 **Claude Mods**——JS 函数式钩子模块）；清单 `.claude-plugin/plugin.json`，市场=含 `marketplace.json` 的仓库。
- **坑**：启用的插件每轮消耗上下文 token——安装前官方市场会显示预估，按需开关；`/reload-plugins` 免重启；开发期 `--plugin-dir ./my-plugin` 免市场直载。

### 4.2.3 Output Styles（输出风格）

#### `/output-style [风格]` — 切换会话级角色
- **内置**：Default、Proactive（少问快干）、Concise（结果先行，v2.1.237）、Explanatory（附设计解释）、Learning（**留 `TODO(human)` 让你动手**——学习模式下自用极好）。
- **自定义**：Markdown + frontmatter 放 `~/.claude/output-styles/`；改后需重启。
- **与记忆文件的区别**：CLAUDE.md 是知识、skill 是任务流程、output style 是整个会话的人格基调；三者可叠加。

### 4.2.4 长尾速览

| 命令 | 一句话 |
|---|---|
| `/reload-plugins` | 热重载插件（`--force` 强制） |
| `/install-github-app` / `/install-slack-app` | 接入 Claude 的 GitHub/Slack 应用 |
| `/web-setup` | 用本地 gh 凭据为云会话连 GitHub |
| 内置技能：`/deep-research` `/dataviz` `/update-config` `/workflow-authoring` `/plugin-authoring` `/powerup` `/skill-doctor` `/fewer-permission-prompts` | 官方自带的高价值技能；`/update-config` 可用自然语言改 settings.json |

## 4.3 Codex 详解

### 4.3.1 技能

- **位置**：个人 `~/.agents/skills/`（0.95.0 起，兼容旧 `~/.codex/skills`）；项目 `.agents/skills/`（0.94.0 起）。**热加载**（0.97.0）；可从 Cursor 导入（0.147.0）；可被插件打包。
- **注意**：旧式自定义 prompts（`~/.codex/prompts/*.md`，支持 `$1`-`$9`、`$ARGUMENTS`）**官方已标记弃用**——新写的直接用 skills。

#### `/skills` — 技能开关
- **作用**：启用/禁用单个技能。

#### `/presets` — 预设槽位（0.164.0 新增）
- **作用**：10 个编号槽位保存可复用的 prompt / 斜杠命令组合，一键唤起。
- **场景**：把"每周实验汇报"的固定指令存成槽位。

### 4.3.2 插件与应用

#### `/plugins` — 插件市场
- **作用**：浏览与安装插件（0.117.0 一等公民化）；0.142.0 起分区：OpenAI Curated / Workspace / Shared with me；CLI 侧 `codex plugin list/install/remove`（0.153.0）。

#### `/apps` — 连接器（connectors）
- **作用**：浏览已连接的应用，用 `$` 引用应用 prompt（0.93.0）。

#### `/experimental` — 实验开关面板
- **作用**：开关实验功能（如语音、js_repl 等）。

#### `/personality` — 回答性格
- **作用**：切换助手性格（默认 friendly）；对应 CC 的 output styles（但 CC 有 Learning 这种教学模式，更丰富）。

### 4.3.3 长尾速览

| 命令 | 一句话 |
|---|---|
| `codex marketplace add` | 添加第三方市场（0.121.0） |
| `/mcp login <名>` | 会话内完成 MCP OAuth 登录（0.161.0） |
| `codex plugin` | 插件 CLI 管理组 |

## 4.4 MCP 双向篇（本章重心）

### 4.4.1 两边都是 MCP client

| 操作 | Claude Code | Codex |
|---|---|---|
| 加远程 HTTP server | `claude mcp add --transport http github https://api.githubcopilot.com/mcp/ --header "Authorization: Bearer <PAT>"` | `[mcp_servers.github]` + HTTP 配置（0.77.0 起支持 OAuth） |
| 加本地 stdio server | `claude mcp add <名> -- <命令> [参数]`（`--` 后是 server 自己的参数；env 用 `--env K=V`） | `codex mcp add` 或 `[mcp_servers.<名>]` + `command/args/env` |
| 作用域 | `local`（默认，私有）> `project`（`.mcp.json` 入 git 团队共享，需批准）> `user` | 用户级 / 项目级 `.codex/config.toml` 分层合并（0.78.0） |
| 会话内管理 | `/mcp [reconnect\|enable\|disable]` | `/mcp`（`verbose` 全量诊断 0.123.0；`login` OAuth 0.161.0） |
| 产物示例 | GitHub、Notion、Sentry、Stripe、DBHub(PostgreSQL 只读)、Playwright、Context7、DeepWiki、Serena | 同一生态（MCP 跨框架通用） |

**选型提示**：MCP server 是跨工具资产——一次配置思路两边都能用；注意 tool output 上限（CC 默认 25k token，`MAX_MCP_OUTPUT_TOKENS` 可调）。

### 4.4.2 Codex 作为 MCP server 被 Claude Code 调用（联动王牌）

Codex 0.128+ 可用 `codex mcp-server` 把**自己**暴露成 MCP server（提供 `codex` 启动线程、`codex-reply` 同线程续问两个工具）。于是可以：

```text
# 1) 在 Claude Code 里把 Codex 注册为一个 MCP server
claude mcp add codex -- codex mcp-server

# 2) 之后在 Claude Code 会话里即可：
#    "让 codex 工具以 xhigh 力度 review 当前 diff，把发现带回来"
#    CC 当总编排（上下文管理、文件改动），Codex 当第二意见/执行器
```

**适用场景**：想要第二模型的意见时；把耗时的独立调研丢给 Codex 线程、CC 继续手头活；团队里有人只用 Codex 时统一编排。

## 4.5 联动与迁移小结

- skills 文件**几乎可以直接互拷**（都是 Markdown+frontmatter），字段差异（CC 的 `context: fork`、`allowed-tools` 等 Codex 不识别会忽略）——建一个"技能仓"目录，两边软链/复制；
- MCP 配置可人工互抄（§4.4.1 表）；Codex `/import` 也能自动迁入 CC 的 MCP/插件（0.145.0+）；
- ZCF 一键给两边装同一套工作流（§11）——这正是"扩展层趋同"的产物。

## 4.6 学生何时用得上

- **把课设流程写成技能**：`/实验出图`（读 data/ → matplotlib → 存 reports/figs/ → 附说明），期末周一键复用；写成"双平台技能"（去掉 CC 专有 frontmatter）Codex 也能用；
- **高频组合**：Context7（查库文档，治"编造 API"）+ Playwright（浏览器验证网页作业）+ GitHub MCP（把课设推上 GitHub 做作品集）；
- **Learning output style 自学模式**：让它讲思路、留 `TODO(human)` 给你写——防"拐杖化"的官方工具；
- **作品集思维**：自己写的 skill/插件就是可展示的开源作品（§09.5 时间线里的"第一个开源 PR"可以是给 awesome-claude-code 提一个中文技能）。

## 4.7 本章验收清单

- [ ] 手写一个带 `$ARGUMENTS` 和 `allowed-tools` 的 skill，两边工具都能唤起
- [ ] 能解释 `` !`command` `` 动态注入和 `context: fork` 各解决什么问题
- [ ] 给两边各配一个 MCP server（建议 Context7 或 Playwright）并完成一次真实调用
- [ ] 完成"CC 调用 codex mcp-server"联动并让 Codex 对 CC 的改动提了 1 条意见
- [ ] 知道 Codex 的 `~/.codex/prompts` 已弃用，新流程一律 skills

---

**来源**：code.claude.com/docs（skills / plugins / mcp / output-styles）、developers.openai.com/codex（build-skills / custom-prompts / mcp / plugins 相关页）、openai/codex releases（0.94.0 / 0.95.0 / 0.117.0 / 0.128.0 / 0.145.0 / 0.164.0）。详见 reference-来源索引.md。
