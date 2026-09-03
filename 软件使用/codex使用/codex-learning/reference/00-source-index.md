# 来源索引

更新时间：2026-07-31

## 本地文件

| 来源 | 用途 | 状态 |
|---|---|---|
| `C:\Users\fjbsllc\Desktop\Codex橙皮书.pdf` | 主教材骨架：概念、入口、核心功能、工作流、案例 | 已提取文本，共 206 页 |
| `tmp/pdfs/codex-orange-book.txt` | PDF 文本提取缓存 | 已生成，UTF-8 |
| `tmp/pdfs/*.png` | PDF 抽页渲染检查 | 已抽查封面、目录、CLI 命令页 |

## 官方在线资料

| 来源 | 用途 |
|---|---|
| `https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan` | Codex 定位、ChatGPT 计划、CLI、IDE、App、Web 入口、`/init` |
| `https://help.openai.com/en/articles/20001275-chatgpt-work-and-codex` | Chat、Work、Codex 的区别；桌面、本地文件、移动端 Remote 边界 |
| `https://help.openai.com/en/articles/20001256-plugins-in-codex` | 插件、skills、apps、app templates、权限和工作区限制 |
| `https://learn.chatgpt.com/codex/use-cases` | Codex/ChatGPT 工作流索引、命令、Slash commands、AGENTS.md、MCP、hooks 等导航 |
| `https://marketplace.visualstudio.com/items?itemName=OpenAI.chatgpt` | 官方 VS Code Codex 扩展页面，扩展 ID 为 `openai.chatgpt` |
| `https://openai.com/index/introducing-the-codex-app/` | Codex App、skills、automations、sandbox、订阅入口的产品说明 |
| `https://openai.com/index/codex-for-every-role-tool-workflow/` | 插件、角色工作流、知识工作扩展方向 |

说明：本机 PowerShell 直接访问部分 `developers.openai.com/codex` 页面返回 403，因此最终整理以 OpenAI Help / Learn 页面、官方 GitHub 仓库和当前本机能力为核验来源。

## 官方 GitHub 仓库

| 来源 | 用途 | 本次核验 |
|---|---|---|
| `https://github.com/openai/codex` | CLI 安装、命令、配置、源码级命令枚举 | 克隆到 `tmp/repos/openai-codex` |
| `openai/codex README.md` | Windows 安装脚本、入口说明、ChatGPT 登录建议 | 已读 |
| `openai/codex docs` | config、sandbox、skills、slash commands 等官方文档入口 | 已读 |
| `codex-rs/cli/src/main.rs` | 顶层 CLI 子命令枚举 | 已抽取 |
| `codex-rs/tui/src/slash_command.rs` | 交互式 Slash commands 枚举 | 已抽取 |

本次仓库快照：

```text
HEAD: f0c30e528a54bdf0fa9a4d52ff74b34383434811
commit time: 2026-07-31T06:02:15Z
latest release from GitHub API: rust-v0.146.0
published: 2026-07-29T01:42:51Z
```

## 橙皮书与官方资料的差异处理

- 橙皮书提供学习路线、工作流和大量截图，适合形成直觉。
- 官方资料用于核对当前入口、命令、权限和计划支持情况。
- 涉及安装、价格、额度、模型名、界面位置、Cloud 权限、插件可用性时，优先相信官方资料和当前客户端显示。
- 橙皮书中的第三方模型接入、CC Switch、DeepSeek 路由属于非官方扩展，不作为新手 Codex 主线。
