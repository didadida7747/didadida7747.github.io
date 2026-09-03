# Windows 与安全排错

## `codex.exe` Access is denied

本机检查发现：

- `Get-Command codex` 指向 Microsoft Store / WindowsApps 路径。
- 从普通 PowerShell 直接运行 `codex --version` 可能返回 `Access is denied`。

处理顺序：

1. 先从 Codex App 使用，不影响 App 内任务。
2. 如果要用 CLI，优先使用官方 Windows 独立安装脚本重新安装。
3. 新开 PowerShell，重新检查 `Get-Command codex`。
4. 如果仍指向 WindowsApps，可检查 PATH 顺序，确保独立安装目录在前。

## 中文路径

你的项目路径包含中文：`D:\ai资料\软件使用\grok使用`。

大多数 Codex 文档整理任务没问题，但某些 Node、Python、老旧 CLI 或第三方工具可能对中文路径兼容差。遇到奇怪报错时，先判断是不是路径问题。

稳妥做法：

- 学习资料可以放中文路径。
- 真实开发项目尽量用英文路径，例如 `D:\projects\codex-demo`。
- 报错时复制完整命令、工作目录和错误信息给 Codex。

## 沙盒与审批

几个概念：

| 概念 | 简单理解 |
|---|---|
| sandbox | 限制 Codex 能读写哪里、能不能联网 |
| approval | 敏感操作是否需要你确认 |
| workspace-write | 通常允许改当前项目 |
| danger-full-access | 权限很大，适合你明确知道风险时使用 |
| never approval | 不再询问，风险更高 |

你的当前全局配置里 `sandbox_mode = "danger-full-access"`。这不代表每个任务都应该放任执行；更应该在提示词里明确边界。

## 不要做的事

- 不要把 API Key、token、密码写进任务描述或文档。
- 不要让 Codex 自动操作生产数据库。
- 不要在没有 Git 或备份的目录里做大改。
- 不要让它一次性“重构整个项目”。
- 不要接受没证据的“已验证”。

## 出问题的最短自救流程

```powershell
git status
git diff
```

然后让 Codex：

```text
请只分析当前 diff，不要修改文件。

请告诉我：
1. 哪些改动可能有风险
2. 是否有无关修改
3. 如果要回退，建议回退哪些文件
4. 哪些改动可以保留
```

如果项目没有 Git：先不要继续扩大修改，手动复制备份关键文件，再让 Codex 帮你分析。

