---
title: "精华卡 · hermes-agent-guide"
---

# 精华卡 · hermes-agent-guide

> Hermes Agent（Nous Research 开源自主智能体）安装、排坑、手机连通的唯一维护版指南 ｜ 提炼：2026-10-25 ｜ 底稿：8 篇（README+7 分册）

## 30 秒用法
- 判断值不值得用：只读 README"一页纸总览"（是什么 / 成熟度数据 / 值不值得 / 三步上手 / 风险提示）。
- 要装：README 三步走 → 02 安装与配置（WSL2 是学生重点）→ 卡壳查 05 常见坑。
- 要手机远程指挥：直接看 07 手机连通与远程进阶。

## 核心结论
1. Hermes Agent 是 Nous Research 2026-02-25 发布的开源自主智能体（MIT，CLI+TUI 双形态），核心能力＝跨会话持久记忆+自创/自改进技能（skills）+cron 定时+付费工具网关+单进程接 20+ 聊天平台（README.md）。
2. 热度与版本：Star 256,881、Fork 56,218（2026-10-25 GitHub API 复核）；最新 release v0.22.2（2026-10-15）；open issues 16,267——处于快速迭代但不稳定阶段，v0.x 期间约每两周一次 breaking change（README.md）。
3. 适用判断：值得用于个人 AI 助手、cron+Telegram 信息摘要、多平台机器人、隐私自托管；主诉求是写代码则 Claude Code/Codex/Cursor 更合适，要求生产级稳定的团队别用（README.md）。
4. 上手三步：Windows 先开 WSL2 → `curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash` → `hermes setup --portal`（或 `hermes model` 选 DeepSeek/GLM/Kimi/Ollama）→ 先跑通一次完整对话，再叠加 gateway/cron/skills（README.md、02-安装与配置.md）。
5. 手机连通主路径是消息网关（`hermes gateway setup`，长轮询/WebSocket，全程无需公网 IP）：国内首选飞书（WebSocket 直连）、国际选 Telegram；07 篇给三条路径全景＝网关 bot / SSH / Dashboard（README.md、07-手机连通与远程进阶.md）。
6. 五大风险必读：微信/WhatsApp 等第三方桥接扫码有封号风险（优先 Telegram/Discord/飞书+小号）；自进化会把错误经验固化成 skill（定期修剪 ~/.hermes/skills/ 或关后台自动 review）；工具定义约占 50% 输入 token（用 /usage、/compress、/insights 管控）；hermes update 曾默认拉 main 未发布分支（生产钉 release tag）；治理争议 issue #10232 本指南不站队（README.md）。
7. 05 篇把坑按 8 类组织（安装/配置/模型成本/WSL2/网关风控/记忆技能/安全/工程化债），每坑"症状→原因→解法→来源"；02 篇注明当前一等安装运行在 Python 3.14（05-常见问题与坑.md、02-安装与配置.md）。
8. 信息缺口如实列出：Reddit 原帖被 robots 拦截、Nous Portal 订阅价格未抓到、多数视频仅读标题简介未看正片——引用相关结论时注意这些标注（README.md）。

## 立即可做的 3 件事
1. 按 [README 三步走](/22-Hermes-Agent指南/) 装通：WSL2 → install.sh → `hermes setup --portal`，先跑通一次完整对话再叠加功能。
2. 打开 [07-手机连通与远程进阶](/22-Hermes-Agent指南/07-手机连通与远程进阶)，`hermes gateway setup` 接飞书或 Telegram，实现手机派任务、cron 结果推回。
3. 通读 README"风险提示"五条：钉 release tag、用小号接 bot、定期修剪 skills 目录。

## 精选文档 TOP5
1. [README.md](/22-Hermes-Agent指南/) —— 一页纸总览：定位/成熟度数据/三步上手/五大风险，先读这篇。
2. [02-安装与配置.md](/22-Hermes-Agent指南/02-安装与配置) —— WSL2 学生重点、Windows 口径矛盾、模型 provider 与更新通道。
3. [07-手机连通与远程进阶.md](/22-Hermes-Agent指南/07-手机连通与远程进阶) —— 各平台建 bot 手把手+WSL2 常驻保活+SSH/Tailscale/frp 内网穿透。
4. [05-常见问题与坑.md](/22-Hermes-Agent指南/05-常见问题与坑) —— 8 类坑的"症状→原因→解法→来源"，排障第一入口。
5. [03-核心功能与合理使用方法.md](/22-Hermes-Agent指南/03-核心功能与合理使用方法) —— 记忆/技能/cron/工具网关/消息网关逐项用法+学生场景示例。

## 时效与注意
- 信息基准 2026-10-20（Star/Fork 已于 2026-10-25 经 GitHub API 复核为 256,881 / 56,218）；命令与版本以官方文档为准，v0.x 迭代快。
- 分工边界：本指南是 Hermes Agent 安装/排坑/手机连通的唯一维护版；[个人智能体指南 04 章](/23-个人智能体指南/04-开源自建方案) 只是速览（其内有 2026-10-25 分工注，两处冲突以本指南为准）。
- 安全红线：bot token、登录二维码、dashboard 凭据就是这台 agent 的"钥匙"，不截图外发；不在终端 bot 上开 GATEWAY_ALLOW_ALL_USERS=true（07）。
