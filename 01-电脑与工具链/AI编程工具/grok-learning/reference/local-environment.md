# 本机 Grok 环境快照

记录日期：2026-07-31

## 安装

```text
Executable: E:\grok\bin\grok.exe
Version: grok 0.2.114 (0c78503879)
```

## 用户配置

配置文件：

```text
C:\Users\fjbsllc\.grok\config.toml
```

已核对字段：

```toml
[models]
default = "grok-4.5"

[model."grok-4.5"]
model = "grok-4.5"
base_url = "https://e-flowcode.cc/v1"
name = "E-FlowCode"
api_backend = "responses"
context_window = 500000
api_key = "[REDACTED]"

[cli]
installer = "internal"

[ui]
permission_mode = "always-approve"
```

注意：API key 已脱敏，不要把真实密钥写入项目文件或聊天记录。

## doctor 结果摘要

命令：

```powershell
E:\grok\bin\grok.exe doctor --json
```

结果：

- 退出码：0。
- 终端：Windows Terminal。
- 颜色：truecolor 可用。
- 剪贴板：native route 可用，delivery confirmed。
- 语音输入：可用，设备为 Realtek 麦克风阵列。
- 建议：当前终端缺少 Kitty keyboard protocol，Shift+Enter 可能不能换行；使用 Alt+Enter。

## 已知版本信息

- 0.2.114（2026-07-29）：新增 `/delete`；修复无空闲线程时启动崩溃。
- 0.2.115（2026-07-29）：修复历史损坏、Windows external auth provider、语言服务器诊断等；改进长会话 prompt caching。
- 0.2.116（2026-07-30）：streaming-json 增加工具调用、结果与用量；新增 `/undo`；修复睡眠/网络波动后的重复登录。

当前本机是 0.2.114；需要新功能时可运行 `grok update --check --json` 或 `grok update`。

