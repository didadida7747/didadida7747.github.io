# 本机 Codex 环境快照

采集时间：2026-07-31

## 项目目录

```text
D:\ai资料\软件使用\grok使用
```

当前目录不是 Git 仓库。做真实代码练习前，建议先选择一个低风险项目并建立 Git checkpoint。

## Codex App

```text
Package: OpenAI.Codex
Version: 26.721.11231.0
Architecture: X64
InstallLocation: C:\Program Files\WindowsApps\OpenAI.Codex_26.721.11231.0_x64__2p2nqsd0c76g0
```

## CLI 状态

```text
Get-Command codex -> C:\Program Files\WindowsApps\OpenAI.Codex_26.721.11231.0_x64__2p2nqsd0c76g0\app\resources\codex.exe
codex --version -> Access is denied
```

判断：App 已安装，但 PowerShell 直接调用 Store/WindowsApps 内的 `codex.exe` 受权限影响。CLI 学习时建议优先走官方独立安装脚本，或从 App 入口使用。

## 全局配置摘要

已脱敏，仅保留键和值中不含密钥的部分：

```text
model = "gpt-5.6-sol"
model_provider = "custom"
model_reasoning_effort = "high"
sandbox_mode = "danger-full-access"
personality = "pragmatic"

[features]
default_mode_request_user_input = true
memories = true

[desktop]
followUpQueueMode = "queue"
conversationDetailMode = "STEPS_COMMANDS"
localeOverride = "zh-CN"
show-context-window-usage = true

[memories]
generate_memories = true
use_memories = true
```

## 对学习路线的影响

- 你可以直接从 Codex App 上手，不必先解决 CLI。
- 由于推理强度较高，复杂任务质量会更好，但小任务可能消耗更多；小改动可以在会话里降低推理强度。
- 由于全局沙盒权限较大，学习阶段每个任务都要写清楚范围和禁止事项。
- 记忆已启用，适合把长期偏好沉淀进可复用规则，但不要让记忆替代项目内 `AGENTS.md`。

