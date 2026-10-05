---
title: "02 - 命令速查"
---

# 02 - 命令速查

## 安装、诊断和升级

```powershell
grok --version
grok doctor
grok doctor --json
grok update --check --json
grok update
grok inspect
grok inspect --json
```

## 启动与会话

```powershell
grok                                      # 打开 TUI
grok "修复登录测试失败"                    # TUI + 首轮提示
grok -p "解释项目结构"                     # 单轮输出后退出
grok --cwd D:\repo "读取项目规则"          # 指定工作目录
grok -c                                   # 继续当前目录最近会话
grok --resume <session-id-or-title>        # 恢复指定会话
grok sessions list
grok sessions search <keyword>
grok export <session-id> output.md
```

## 模型与输出

```powershell
grok models
grok -m grok-4.5
grok -p "给我 JSON" --output-format json
grok -p "边运行边输出" --output-format streaming-json
grok -p "按 schema 输出" --json-schema '{"type":"object","properties":{"summary":{"type":"string"}}}'
```

## worktree

```powershell
grok --worktree=feat-login "实现登录重构"
grok -w --ref main "从 main 创建隔离工作树做实验"
grok worktree list
grok worktree show <name-or-id>
grok worktree rm <name-or-id>
grok worktree gc
```

注意：带名字的 worktree 用 `--worktree=名称`，否则首个字符串可能被当作 worktree 名称而不是 prompt。

## MCP

```powershell
grok mcp list
grok mcp list --json
grok mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem D:\path\to\dir
grok mcp add --transport http sentry https://mcp.sentry.dev/mcp
grok mcp add --transport sse linear https://mcp.linear.app/sse
grok mcp doctor
grok mcp doctor <server-name>
grok mcp enable <server-name>
grok mcp disable <server-name>
grok mcp remove <server-name>
```

## headless 自动化

```powershell
grok -p "Review staged changes for obvious bugs. Reply OK if fine, or list issues." --output-format json
grok --prompt-file .\prompt.txt
grok -p "Explain this codebase" --tools "read_file,grep,list_dir"
grok -p "Review this code" --disallowed-tools "web_search,web_fetch,search_replace"
grok -p "Build the project" --allow "Bash"
grok -p "Clean up" --deny "Bash(rm*)"
grok -p "Fix tests" --max-turns 8 --always-approve
```

## agent / ACP

```powershell
grok agent stdio
grok agent serve
grok agent headless
grok agent --always-approve stdio
```

## 插件、技能、记忆

```powershell
grok plugin list
grok plugin install <git-url-or-local-path>
grok plugin details <plugin-name>
grok plugin update
grok memory clear
```

TUI 内常用：`/skills`、`/plugins`、`/marketplace`、`/memory`、`/remember`、`/flush`、`/dream`。
