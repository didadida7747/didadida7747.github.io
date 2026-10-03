# Codex CLI 命令速查

注意：CLI 命令变化很快。下面以 2026-07-31 核验的 `openai/codex` 仓库和当前官方资料为准；如果你的本机 `codex.exe` 因 WindowsApps 权限无法直接从 PowerShell 运行，以 Codex App 内部入口和官方安装脚本为准。

## 安装与启动

```powershell
# Windows 官方独立安装脚本
powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 | iex"

# 启动交互式 TUI
codex

# 从指定目录启动
codex -C D:\path\to\project
```

不要在这些位置直接开大权限任务：

- `C:\`
- 桌面和下载目录
- 系统目录
- 没有 Git 或备份的重要资料目录

## 常用顶层命令

| 命令 | 作用 | 什么时候用 |
|---|---|---|
| `codex` | 启动交互式 Codex | 日常终端任务 |
| `codex exec` / `codex e` | 非交互执行一次任务 | 脚本、CI、批处理 |
| `codex review` | 非交互代码审查 | 提交前检查 |
| `codex login` | 登录 | 首次使用或换账号 |
| `codex login status` | 查看登录状态 | 不确定是否登录 |
| `codex logout` | 删除本机登录凭据 | 换账号、公共电脑 |
| `codex app` | 打开桌面 App | 从终端切到 App |
| `codex update` | 更新 Codex | 想升级 CLI |
| `codex doctor` | 诊断安装、配置、认证、运行环境 | 出问题先跑 |
| `codex resume` | 继续历史会话 | 回到之前任务 |
| `codex fork` | 从历史会话复制出新分支任务 | 多方案尝试 |
| `codex archive` | 归档会话 | 完成后收纳 |
| `codex delete` | 删除会话 | 谨慎使用 |
| `codex apply` | 应用 Codex agent 生成的最新 diff | Cloud/patch 流程 |
| `codex cloud` | 浏览或处理 Codex Cloud 任务 | 进阶 |
| `codex mcp` | 管理 MCP server | 进阶 |
| `codex plugin` | 管理插件 | 进阶 |
| `codex sandbox` | 在 Codex 沙盒规则下运行命令 | 权限调试 |
| `codex completion` | 生成 shell completion | 终端优化 |
| `codex features` | 查看 feature flags | 调试配置 |

## 登录

```powershell
codex login
codex login --device-auth
$env:OPENAI_API_KEY | codex login --with-api-key
codex login status
codex logout
```

建议：日常学习优先用 ChatGPT 登录；API Key 登录更适合自动化、CI 或服务器场景。

## 交互式 Slash commands

| 命令 | 作用 |
|---|---|
| `/init` | 生成 `AGENTS.md` 项目规则 |
| `/status` | 查看当前会话配置和 token 使用 |
| `/permissions` | 调整允许 Codex 做什么 |
| `/model` | 选择模型和推理强度 |
| `/diff` | 查看当前 git diff，包括未跟踪文件 |
| `/review` | 审查当前改动并找问题 |
| `/compact` | 压缩长对话，避免上下文爆掉 |
| `/mention` | 明确提到某个文件 |
| `/mcp` | 查看当前 MCP 工具 |
| `/plugins` | 浏览插件 |
| `/skills` | 使用或管理 skills |
| `/memories` | 配置记忆 |
| `/hooks` | 查看和管理 hooks |
| `/ps` | 查看后台终端 |
| `/stop` | 停止后台终端 |
| `/resume` | 恢复保存的聊天 |
| `/fork` | 分叉当前聊天 |
| `/archive` | 归档当前会话并退出 |
| `/quit` / `/exit` | 退出 Codex |

## 新手安全默认值

优先：

```powershell
codex --sandbox workspace-write --ask-for-approval on-request
```

谨慎：

```powershell
codex --sandbox danger-full-access
codex --ask-for-approval never
codex --dangerously-bypass-approvals-and-sandbox
```

你的当前全局配置里已经有较高权限设置，因此更要在每个任务提示词里明确范围和验证要求。
