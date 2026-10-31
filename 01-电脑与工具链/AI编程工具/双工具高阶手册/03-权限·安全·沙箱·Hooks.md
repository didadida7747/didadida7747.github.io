---
title: "03 · 权限 · 安全 · 沙箱 · Hooks：自主权的刻度盘"
---

# 03 · 权限 · 安全 · 沙箱 · Hooks：自主权的刻度盘

> 本域命令约 15 条。七段式：①概念 → ②CC 详解 → ③Codex 详解 → ④对照 → ⑤联动 → ⑥学生视角 → ⑦验收

---

## 3.1 本域解决什么问题（工具无关）

- **自主权刻度盘**：Agent 能自己跑命令、改文件、联网。给多少自主权，决定了效率（全自动最快）与风险（全自动最险）的平衡点。两个工具都把这个刻度做成了显式配置。
- **硬保证 vs 软约束**：CLAUDE.md / AGENTS.md 写"别删库"是**软约束**（模型可能忘、可能忽略）；hooks、沙箱、权限规则是**框架级硬保证**（物理上拦住）。社区共识一句话：**CLAUDE.md 管建议，Hooks 管纪律**。
- **最小权限原则**：按任务给权限——读代码给只读，改文件给写权限，跑测试给工作区，绝不默认全开。

## 3.2 Claude Code 详解

### 3.2.1 七种权限模式

| 模式 | 行为 | 典型场景 |
|---|---|---|
| `default`（别名 `manual`） | 每个工具首次使用询问 | 陌生仓库、谨慎模式 |
| `acceptEdits` | 自动接受文件编辑（及 mkdir/mv/cp 等） | 自己的课设仓库日常开发 |
| `plan` | 只读规划，不改任何东西 | 先看方案再动手（Plan mode） |
| `auto` | 后台分类器审核 shell/网络请求，常规操作免询问 | 无人值守但保留底线 |
| `dontAsk` | 会弹窗的一律自动**拒绝** | CI/脚本：干不了就明说，别挂着等 |
| `bypassPermissions` | 全跳过 | **仅限容器/VM**；重要目录禁用 |

切换方式：会话内 `Shift+Tab` 循环；启动时 `--permission-mode`；写死在 settings 的 `permissions.defaultMode`（注意：`auto`/`bypassPermissions` 从项目级设置不生效，须用户级或 CLI 指定）。

#### `/permissions` — 权限规则管理（别名 `/allowed-tools`）
- **作用**：管理 allow / ask / deny 三类规则、工作目录、auto mode 规则。
- **规则语法**（背下这几条就能写 90% 的规则）：
```text
Bash(npm run *)            # 前缀匹配；尾 * 也匹配裸命令 npm run
Bash(git diff:*)           # :* 与尾缀 * 等价
Edit(//E:/课程资料/**)      # gitignore 风格路径（// 开头为绝对路径）
WebFetch(domain:github.com) # 域名白名单
mcp__github__*             # MCP 工具通配
Agent(model:opus)          # 参数级规则（仅 deny/ask 可用）
```
- **求值顺序**：deny → ask → allow，先命中先用。**deny 永远最优先，把"绝对不许"写进 deny。**
- **坑**：复合命令（`a && b`）逐段匹配，任一段命中 deny 即拒绝；`timeout`/`nohup` 包装和环境变量前缀会被剥掉再匹配——别指望用包装绕过（也不能依赖包装做防护）。

### 3.2.2 沙箱（sandboxing）

- **是什么**：OS 级 shell 隔离。macOS 用 Seatbelt；Linux/WSL2 用 bubblewrap+socat（+可选 seccomp）。**原生 Windows 不支持**——你在 Windows 上想要沙箱，走 WSL2。
- **能力**：文件系统只开放工作目录/临时目录/`--add-dir` 目录可写；`.claude` 配置、hooks、shell 启动文件等保护路径禁写；网络默认无直连，走本机代理按 `network.allowedDomains` 白名单放行。
- **用法**：会话内 `/sandbox` 打开面板，或 settings `sandbox.enabled: true`；`excludedCommands` 可把个别命令（如 `docker compose *`）放行到沙箱外；企业可强制 `allowUnsandboxedCommands: false`。
- **典型组合**：沙箱 + auto mode = "npm install && npm test 免弹窗，但恶意包也写不出沙箱"。

### 3.2.3 Hooks：33 个生命周期事件的硬保证

- **机制**：在确定的生命周期点执行 shell/HTTP 命令。exit 0 = 放行；**exit 2 = 阻断**（PreToolUse 可拦下工具调用）；stdout 输出 JSON 可做精细决策（`permissionDecision: allow/deny/ask`、`additionalContext` 注入上下文）。
- **配置位置**：settings（用户/项目/本地）、插件、甚至单个 skill 的 frontmatter。结构：事件 → matcher 组 → handler 数组。

#### `/hooks` — 查看已配置的钩子
- **作用**：列出当前生效的全部 hooks，排查"为什么我的命令被拦了"。

**实例 1：防误删（PreToolUse 拦截 rm -rf）**
```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "if": "Bash(rm *)",
      "hooks": [{
        "type": "command",
        "command": "jq -r '.tool_input.command' | grep -qE 'rm +(-[a-z]+ +)*-[rf]{1,2}' && echo '{\"permissionDecision\":\"deny\",\"reason\":\"禁止递归/强制删除，请手动确认\"}' || exit 0"
      }]
    }]
  }
}
```
**实例 2：保存即格式化（PostToolUse）**
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{ "type": "command", "command": "black . 2>/dev/null || true" }]
    }]
  }
}
```

**33 个事件速查**（按用途分组）：

| 组 | 事件 |
|---|---|
| 会话 | SessionStart、SessionEnd、Setup、InstructionsLoaded |
| 输入 | UserPromptSubmit、UserPromptExpansion |
| 工具 | PreToolUse、PermissionRequest、PermissionDenied、PostToolUse、PostToolUseFailure、PostToolBatch |
| 子代理 | SubagentStart、SubagentStop、TaskCreated、TaskCompleted、TeammateIdle |
| 输出 | Notification、MessageDisplay、Stop、StopFailure |
| 环境 | CwdChanged、DirectoryAdded、FileChanged、ConfigChange |
| 工作树 | WorktreeCreate、WorktreeRemove |
| 上下文 | PreCompact、PostCompact |
| 模型 | PreModelSwitch、PostModelSwitch |
| 交互 | Elicitation、ElicitationResult |

### 3.2.4 本域其余命令卡片

#### `/add-dir <路径>` — 会话中追加工作目录
- **作用**：不重启会话把另一个目录纳入可访问范围（触发 DirectoryAdded hook）。
- **场景**：课设代码在 A 目录、数据集在 B 盘——一次会话同时操作两处。

#### `/cd <路径>` — 会话内切换工作目录
- **作用**：保留对话切换目录。适合"顺着做下一小问"。

#### `/doctor [prompt-audit]` — 环境体检（别名 `/checkup`）
- **作用**：诊断安装/设置/扩展/CLAUDE.md 问题；`prompt-audit` 审计记忆文件里的过时提示写法。
- **场景**：感觉"它不听话"时第一步先体检。

### 3.2.5 长尾速览

| 命令/配置 | 一句话 |
|---|---|
| `/debug [描述]` | 开 debug 日志排查问题（内置技能） |
| `--dangerously-skip-permissions` | 等价 bypassPermissions；**只在容器/VM 里用** |
| `--allowedTools` / `--disallowedTools` | 启动时直接给规则，如 `"Bash(git *),Edit"` |
| `--add-dir` | 启动时追加目录 |
| `--safe-mode` | 全定制禁用排障模式（怀疑是 hooks/插件搞鬼时用） |

## 3.3 Codex 详解

### 3.3.1 审批 × 沙箱档位矩阵（核心心智模型）

两个正交旋钮：**approval_policy**（何时要人批）× **sandbox_mode**（能碰什么）。

| sandbox_mode \ approval_policy | untrusted（默认，逐个批） | on-request | on-failure（失败才批） | never（全自动） |
|---|---|---|---|---|
| `read-only`（默认） | 最保守：只读+多问 | 只读+少问 | 只读+几乎不问 | 只读但自动 |
| `workspace-write` | 工作区可写+多问 | 工作区可写 | **--full-auto** | 自动跑工作区 |
| `danger-full-access` | 全权限+多问 | 全权限 | 全权限 | **裸奔（=旧 --yolo）** |

- TUI 内用 `/permissions`（0.89.0 起取代 `/approvals`，旧名兼容保留）调整档位。
- CLI 直给：`-s workspace-write -a on-failure` = `--full-auto`；`--dangerously-bypass-approvals-and-sandbox` = 全开（仅限容器）。
- 0.147.0 新增 `--approve-for-me`：自动批准"对我来说安全"的操作（介于 full-auto 和裸奔之间的中间档）。

#### `/permissions` — 权限档案（profiles）
- **作用**：0.133.0 起权限档案可**跨会话保存、往返切换、继承**，企业可用 requirements.toml 托管。
- **场景**：给"作业模式"（read-only+untrusted）、"课设模式"（workspace-write+on-failure）、"脚本模式"（workspace-write+never）各存一个档案，一条命令切换。

### 3.3.2 config.toml 关键安全键位

```toml
approval_policy = "on-failure"
sandbox_mode = "workspace-write"

[sandbox_workspace_write]
network_access = false        # 默认禁止外联，需要联网装包时再开

[projects."E:/课程/信号系统课设"]
trust_level = "trusted"       # 信任的仓库少弹窗
```

- **坑**：`network_access` 默认 false 是刻意的——装包、下数据集时再按需开；Windows 侧 0.118.0 起有 OS 级 egress 代理规则支持。

### 3.3.3 本域其余命令卡片

#### `/plans` — Plan 模式开关
- **作用**：0.93.0 引入 `/plan`，0.94.0 默认启用：先出计划再执行；0.122.0 支持在新上下文中落地实现（计划→执行上下文隔离，防计划被污染）。
- **对应物**：CC 的 plan permission mode + `/plan` 命令。

#### `/debug-config` — 调试当前生效配置
- **作用**：打印实际生效的配置（含层级合并结果），排查"我改了 config 怎么没生效"。

#### `/pwd` `/cd` `/cwd` — 工作目录组
- **作用**：TUI 内查看/切换目录；**注意不会削弱沙箱约束**（0.151.0 修复了相关保持行为）。

### 3.3.4 长尾速览

| 命令/配置 | 一句话 |
|---|---|
| `/approvals` | 已被 `/permissions` 取代（兼容保留），旧资料常见 |
| `--full-auto` | workspace-write + on-failure 的快捷方式 |
| `--dangerously-bypass-approvals-and-sandbox` | 全开（旧称 --yolo）；容器内才用 |
| `[features]` | 实验开关（如 web search 相关） |
| hooks（实验） | 0.114.0 起会话级钩子引擎（SessionStart/Stop、userpromptsubmit），能力远少于 CC |

## 3.4 对照表：同一个安全目标，两边怎么配

| 安全目标 | Claude Code | Codex |
|---|---|---|
| 只让它读代码出方案 | `--permission-mode plan` | 默认 read-only + untrusted，或 `/plans` |
| 日常写自己的项目 | acceptEdits + deny 危险命令 | `--full-auto` + `[projects]` trust |
| 跑测试免弹窗 | sandbox enabled + auto mode | workspace-write + on-failure |
| 无人值守跑批 | `--permission-mode auto --permission-prompts none` | `-s workspace-write -a never`（配网络白名单） |
| 禁止联网 | 沙箱 allowedDomains 留空 + `WebFetch(domain:*)` deny | `[sandbox_workspace_write] network_access=false` |
| 防 rm -rf | PreToolUse hook（见 §3.2.3） | deny 规则 + read-only 档位；hooks 实验性 |
| 换个任务换权限 | Shift+Tab 循环 | `/permissions` 切 profiles |

**各自强项**：CC 的 hooks + 参数级规则能表达极细的纪律（"允许 git add，禁止 git push"）；Codex 的档位矩阵 + profiles 切换最快（"一拨就全自动"）。

## 3.5 联动与迁移

- 把 CC 的 allow/deny 规则核心条目抄写进 Codex 的 `[projects]` trust + 档位组合，人工对齐（暂无自动互转，`/import` 迁移的是设置/MCP/记忆，权限语义需人工核对）。
- 共同的底线配置建议做成你知识库里的一个模板文件，两个工具新项目都复制一份。

## 3.6 学生何时用得上

- **三档日常配置**（推荐照抄）：
  1. 陌生仓库/别人的代码 → CC `plan` / Codex read-only——先看懂再动手；
  2. 自己课设仓库 → CC `acceptEdits` + 防误删 hook / Codex `--full-auto`；
  3. 批量脚本/仿真 → CC `auto` + 沙箱（WSL2）/ Codex workspace-write + network_access=false。
- **保护性红线**：放成绩单、个人资料的目录永远不设为工作目录；`bypassPermissions`/`danger-full-access` 不用在有备份价值的真实目录。
- **防误删 hook 是你的第一课**：§10 练习 P4 手把手做。

## 3.7 本章验收清单

- [ ] 能默写 CC 权限规则求值顺序（deny → ask → allow）并解释为什么 deny 优先
- [ ] 能画出 Codex approval × sandbox 3×3 矩阵并标出 --full-auto 的位置
- [ ] 本机配置成功一个 PreToolUse 防误删 hook 并实测拦截
- [ ] 知道 Windows 上 CC 沙箱不可用，需要走 WSL2
- [ ] 给自己的常用项目建了 Codex profiles（作业/课设/脚本三档）

---

**来源**：code.claude.com/docs（permissions / hooks / sandboxing）、developers.openai.com/codex/config-reference 与 /permissions、openai/codex releases（0.89.0 / 0.114.0 / 0.118.0 / 0.133.0 / 0.147.0）、社区"Prompt 管建议 Hook 管纪律"（掘金）。详见 reference-来源索引.md。
