---
title: "Hermes Agent 使用指南（学生 / 个人开发者向）"
---

# Hermes Agent 使用指南（学生 / 个人开发者向）

> **调研截止 2026-10-20，项目演进快，命令与版本以官方文档为准。**
> 本指南面向本校（及同类）学生 / 个人开发者：有 Windows 笔记本（可装 WSL2）、可能有便宜云服务器，关心学习辅助、课程项目自动化、自托管机器人、API 成本与隐私。
> 信息标注约定：【官方】= 官方文档 / 仓库原文；【社区】= 用户观点（再分【个人体验】/【二手转述】/【软文】）；【编者推断】= 写作方综合判断。

---

## 一页纸总览

### 这是什么

Hermes Agent 是 Nous Research（开源模型团队，9.5k followers 的 GitHub 组织）于 **2026-02-25** 发布的**开源自主 AI 智能体**，MIT 许可，命令行（CLI）+ 文本界面（TUI）双形态。核心能力：跨会话持久记忆、从经验中自创/自改进技能（skills）、cron 定时任务、付费工具网关（搜索/画图/TTS/浏览器）、以及一个进程接入 20+ 聊天平台的消息网关。【官方】来源：\<https://github.com/NousResearch/hermes-agent>、\<https://hermes-agent.nousresearch.com/docs/zh-Hans/>

### 当前成熟度（数字为 2026-10-20 抓取，官方核验；Star/Fork 于 2026-10-25 复核）

| 指标 | 数值 | 来源 |
|---|---|---|
| GitHub Star | **256.9k**（精确值 256,881，2026-10-25 GitHub API） | 仓库 / 组织页 |
| Fork | 56.2k（56,218，2026-10-25 GitHub API） | 仓库页 |
| 最新 release | **v0.22.2**，发布于 2026-10-15 | releases 页 |
| Open / Closed issues | 16,267 / 19,767 | issues 页 |
| 累计 commits | 56,818 | 仓库页 |
| License | MIT | 仓库 LICENSE |

【编者推断】这是 2026 年增速最快的开源 agent 项目之一，处于**快速迭代但不稳定**的阶段：单日 issue 新增数百、main 分支每日合入大量未发布改动；open issues 长期数万个，v0.x 期间约每两周有 breaking change。

### 值不值得用（结论先行）

- **值得试用**的场景：个人 AI 助手、课程/科研信息自动摘要（cron + Telegram）、多平台消息机器人、想体验"会自己攒技能的 agent"、重视本地数据与隐私、愿意折腾。
- **不值得**的场景：要求生产级稳定的工程团队、主要诉求就是写代码（Claude Code / Codex / Cursor 仍是更合适的专用 coding agent，社区多方互证）。【社区·个人体验】腾讯云"专业造轮子"3 个月弃用文：\<https://cloud.tencent.com/developer/article/2702804>

### 快速上手三步走（命令级别）

```powershell
# 第 1 步：安装（Windows 先开 WSL2，见 02-安装与配置.md；Windows 原生亦可，见该文件口径说明）
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
```

```bash
# 第 2 步：一次 OAuth 配好模型 + 工具网关（最快路径）
hermes setup --portal
# 或交互式自选 provider / 模型（支持 DeepSeek、Kimi、GLM、Ollama 本地模型等）
hermes model
```

```bash
# 第 3 步：跑通一次完整对话，再叠加功能
hermes            # 进入 CLI；hermes --tui 为现代 TUI
# 可选：接 Telegram bot，手机远程派任务
hermes gateway setup
hermes gateway start
```

> **手机连通一句话指引**：让手机能用 agent 的主路径是消息网关（`hermes gateway setup` 选平台 → 拿 token/扫码 → 配白名单），全程无需公网 IP；国内学生首选飞书（WebSocket 直连），国际选 Telegram。详见 [07-手机连通与远程进阶.md](/22-Hermes-Agent指南/07-手机连通与远程进阶)。

【官方】三步来源：快速入门页 \<https://hermes-agent.nousresearch.com/docs/zh-Hans/quickstart/>。官方"经验法则"：先让一次完整对话跑通（有横幅显示模型、能多轮、工具可用），再叠加 gateway / cron / skills / 语音 / 路由。

### 风险提示（必读）

1. **账号风控**：接微信 / WhatsApp 等走第三方桥接扫码的通道有封号风险（有真实用户叙事）。优先用 Telegram / Discord / 飞书，用小号 / bot token，遵守平台条款。【社区】\<https://www.iesdouyin.com/share/video/7695121437635513650>（注：该分享页 2026-10-20 抽查返回 404，视频可能已下架，观点来自调研原始记录）
2. **自进化会固化错误**：agent 几乎总认为自己做对了，会把错误经验沉淀成 skill，你改好的 bug 下次可能被它按旧 skill 改回去（三方互证的最大设计缺陷）。应对：定期审查并手动修剪 `~/.hermes/skills/`，或关闭后台自动 review。【社区】\<https://www.cnblogs.com/haibindev/p/19881562>
3. **API 成本**：框架本身免费，但对话按你选的模型 provider 计费；工具定义本身可占约 50% 输入 token，长会话后记忆库会膨胀。用 `/usage`、`/compress`、`/insights` 管控。【社区】\<https://www.dplooy.com/blog/hermes-agent-nous-researchs-self-learning-ai-runtime>
4. **更新通道刚理顺**：`hermes update` 曾默认拉 main 分支（每日未发布改动），有生产用户因此从 release tag 被静默切到开发通道。生产环境建议钉 release tag。【官方 issue #58746】\<https://github.com/NousResearch/hermes-agent/issues/58746>
5. **治理争议**：2026-04 issue #10232 抄袭质疑后官方删评论、封人、把标题改为"."，被 HN 批评为掩盖；叠加 Web3 / 代币化背景，社区对 star 水分有合理怀疑。详见 01 文件，本指南不站队。\<https://github.com/NousResearch/hermes-agent/issues/10232>

---

## 文档地图

| 文件 | 内容 |
|---|---|
| [01-项目概览与定位.md](/22-Hermes-Agent指南/01-项目概览与定位) | 项目身份、组织背景、能力边界、与 OpenClaw / Claude Code / Aider 等的关系、许可证、成熟度与争议 |
| [02-安装与配置.md](/22-Hermes-Agent指南/02-安装与配置) | Linux/macOS、WSL2（学生重点）、Windows 原生口径矛盾、模型 provider 与 API key、本地 Ollama、更新通道、卸载 |
| [03-核心功能与合理使用方法.md](/22-Hermes-Agent指南/03-核心功能与合理使用方法) | 记忆 / 技能 / cron / 工具网关 / 消息网关逐项用法 + 学生场景示例 + 已知坑 |
| [04-各平台评价与实战案例.md](/22-Hermes-Agent指南/04-各平台评价与实战案例) | GitHub / B站 / YouTube / 抖音 / 中文社区 / Reddit·HN 分节，精选条目 + 真实成本案例 + 软文甄别 |
| [05-常见问题与坑.md](/22-Hermes-Agent指南/05-常见问题与坑) | 安装 / 配置 / 成本 / WSL2 / Windows / 风控 / 记忆技能 / 安全 / 工程化债：症状→原因→解法→来源 |
| [06-学习路径与资源汇总.md](/22-Hermes-Agent指南/06-学习路径与资源汇总) | 官方学习路径、学生上手顺序（Day1/Week1/进阶）、资源清单、术语表、成本说明 |
| [07-手机连通与远程进阶.md](/22-Hermes-Agent指南/07-手机连通与远程进阶) | 消息网关各平台建 bot 手把手、微信 iLink 桥接、WSL2 常驻保活、SSH/Tailscale/frp 内网穿透、Dashboard 远程访问、学生两套省事组合 |

---

## 覆盖情况与信息缺口

**已覆盖**：官方一手文档（仓库、releases、installation、quickstart、security、memory、skills、cron、messaging 及 Telegram/Discord/Slack/WhatsApp/Signal/飞书/微信各平台子页、WSL2 常驻、web dashboard、tool-gateway、learning-path、tips）；B站约 30 条相关视频 + 手机/网关/云部署专题约 24 条；YouTube 约 17 条（含官方工程师 Arize 演讲）；抖音 21 + 25 条真实命中；中文社区（掘金/CSDN/腾讯云/51CTO/博客园/PANews 等 14 篇）；英文社区（andrew.ooo、dplooy、BetterClaw、HN Algolia、mrkeyoor、issue #10232/#58746）；Reddit 经官方 user-stories 页与中文转述间接覆盖；通用工具官方文档（Tailscale WSL2、Cloudflare Tunnel、frp、Microsoft WSL 网络、Telegram Bot API）。

**未覆盖 / 信息缺口**：
1. Reddit / r/LocalLLaMA / r/selfhosted 原帖被 robots.txt 拦截，未能直接打开；只能经官方 user-stories 页（官方挑选、天然偏好评）和博客园转述间接获取，**缺差评与反对票观点**。
2. Nous Portal 订阅具体价格档位未抓取（官方只写"paid-subscription feature"），本指南不给编造单价。
3. V2EX / 知乎独立长帖 / 少数派 / 即刻 / 小红书 / 知识星球未检索到真实独立用户帖，结果多为官网文档或 AI 分发软文。
4. 绝大多数 B站/YouTube/抖音视频仅读标题与简介，未看正片；正文已逐处标注【未看，仅据标题/简介】。
5. issue #10232 的具体抄袭指控内容已被官方删除，"到底抄了谁"无法核实。
6. 官方中文文档子页（security/memory 等）以英文官方页为准；`/docs/llms.txt` 被安全策略拦截。
7. Telegram / Discord 官方社区需登录，未访问。
8. 【第二轮新增缺口】QQ 平台官方页（/messaging/qq）为死链，QQ 接入步骤未拿到官方原文；Dashboard 官方无内置 HTTPS/TLS；微信 iLink 桥接无"被封号"一手亲历帖（风险程度暂未核实）；Termux 与 ngrok 部分步骤未精读官方文档；Hermes × Tailscale 无直接结合的演示视频。

## 信息来源

- 官方仓库：\<https://github.com/NousResearch/hermes-agent>
- 官方 releases：\<https://github.com/NousResearch/hermes-agent/releases>
- 官方中文文档首页：\<https://hermes-agent.nousresearch.com/docs/zh-Hans/>
- 官方快速入门：\<https://hermes-agent.nousresearch.com/docs/zh-Hans/quickstart/>
- 官方 issue #58746（update 通道）：\<https://github.com/NousResearch/hermes-agent/issues/58746>
- 争议 issue #10232：\<https://github.com/NousResearch/hermes-agent/issues/10232>
- 社区弃用文：\<https://cloud.tencent.com/developer/article/2702804>
- 社区深度评测：\<https://www.dplooy.com/blog/hermes-agent-nous-researchs-self-learning-ai-runtime>
- 社区转述 Reddit（固化错误经验）：\<https://www.cnblogs.com/haibindev/p/19881562>
- 官方消息网关总览：\<https://hermes-agent.nousresearch.com/docs/user-guide/messaging>
- 官方飞书接入：\<https://hermes-agent.nousresearch.com/docs/user-guide/messaging/feishu>
- 官方微信（iLink）接入：\<https://hermes-agent.nousresearch.com/docs/user-guide/messaging/weixin>
- 官方 WSL2 常驻指南：\<https://hermes-agent.nousresearch.com/docs/user-guide/windows-wsl-quickstart>
- 官方 Web Dashboard：\<https://hermes-agent.nousresearch.com/docs/user-guide/features/web-dashboard>
- Tailscale WSL2 官方文档：\<https://tailscale.com/docs/install/windows/wsl2>
- Microsoft WSL 网络文档：\<https://learn.microsoft.com/en-us/windows/wsl/networking>
