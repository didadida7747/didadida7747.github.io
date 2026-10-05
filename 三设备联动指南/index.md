---
title: "iPad · 一加 · 拯救者 三设备联动指南"
---

# iPad · 一加 · 拯救者 三设备联动指南

> 调研整理于 2026-10-03,信息来自官网、GitHub、微软/苹果/OPPO 官方文档、知乎、B 站等公开资料。
> 三份设备假设:① 联想拯救者游戏本(Windows 11,独显支持 NVENC 硬编码,主要插电家用);② iPad(iPadOS);③ 一加手机(Android,国行 ColorOS 或国际版 OxygenOS,文中已区分)。

## 先建立一个关键认知

**苹果的 Sidecar(随航)、通用控制、AirDrop、隔空投送、连续互通相机全部只支持苹果设备之间,对 Windows 一律无效**;一加和拯救者之间也不存在华为"多屏协同"那种开箱即用的官方组合。好消息是:第三方生态(大量免费开源)已经能把这三端连得七七八八,本指南就是把这些方案按场景整理好。

## 联动全景图

| 你想要 | 首选方案 | 免费开源替代 | 详见 |
|---|---|---|---|
| iPad 当电脑扩展副屏 | spacedesk(免费)/ Duet Display(付费更稳) | Sunshine+Moonlight+虚拟屏 | [01-1 副屏](/三设备联动指南/01-iPad×拯救者/01-iPad当副屏) |
| iPad 当数位板(压感手绘) | EasyCanvas | Weylus | [01-2 手绘](/三设备联动指南/01-iPad×拯救者/02-手绘板与摄像头) |
| iPad 远程控制电脑 | Windows App(RDP) | RustDesk / Chrome RD | [01-3 远程桌面](/三设备联动指南/01-iPad×拯救者/03-远程桌面) |
| iPad 当电脑摄像头 | Camo(免费版可用) | — | [01-2 手绘](/三设备联动指南/01-iPad×拯救者/02-手绘板与摄像头) |
| 电脑大屏反控手机 | scrcpy | Phone Link / O+互联 | [02-1 互联](/三设备联动指南/02-一加×拯救者/01-互联方案) |
| 电脑收发短信/通知/接打电话 | Phone Link(一加官方支持) | KDE Connect | [02-1 互联](/三设备联动指南/02-一加×拯救者/01-互联方案) |
| 手机当电脑摄像头 | DroidCam / Iriun | Camo | [02-2 实用玩法](/三设备联动指南/02-一加×拯救者/02-文件与实用玩法) |
| 三端文件互传 | LocalSend | PairDrop(网页) | [03-1 文件](/三设备联动指南/03-三端协同/01-文件互传与同步) |
| 三端持续同步/照片备份 | Syncthing + iCloud for Windows | OneDrive / 坚果云 | [03-1 文件](/三设备联动指南/03-三端协同/01-文件互传与同步) |
| 剪贴板三端同步 | KDE Connect(一加↔电脑) | SyncClipboard(iPad 参与) | [03-2 接力](/三设备联动指南/03-三端协同/02-剪贴板-通知-浏览器接力) |
| 通知/短信接力到电脑 | Phone Link | KDE Connect / Bark(推 iPad) | [03-2 接力](/三设备联动指南/03-三端协同/02-剪贴板-通知-浏览器接力) |
| 浏览器标签接力 | Edge"发送到设备" | Vivaldi | [03-2 接力](/三设备联动指南/03-三端协同/02-剪贴板-通知-浏览器接力) |
| 笔记 / 密码三端 | Obsidian / Bitwarden | Vaultwarden(自建) | [03-3 笔记密码](/三设备联动指南/03-三端协同/03-笔记与密码) |
| 拯救者游戏串流到 iPad/一加 | **Sunshine + Moonlight** | Steam Link | [04-1 串流](/三设备联动指南/04-游戏与媒体/01-Sunshine与Moonlight游戏串流) |
| 影音媒体库 | Jellyfin + Infuse(iPad) | Plex / Emby | [04-2 媒体与投屏](/三设备联动指南/04-游戏与媒体/02-媒体库与反向投屏) |
| 手机/iPad 反向投到电脑 | scrcpy(一加)/ AirPlay 接收端(iPad) | AirDroid Cast | [04-2 媒体与投屏](/三设备联动指南/04-游戏与媒体/02-媒体库与反向投屏) |
| 出门在外用家里的拯救者 | Tailscale 三端组网 | ZeroTier / frp | [05-1 组网](/三设备联动指南/05-进阶玩法/01-Tailscale三端组网) |
| 远程开机 | WoL + UpSnap 常驻面板 | 智能插座+BIOS 来电开机 | [05-2 开机与远程](/三设备联动指南/05-进阶玩法/02-远程开机与远程桌面) |
| 拯救者变家庭服务器 | Jellyfin+Syncthing+qBittorrent | WSL2 / Docker | [05-3 服务器](/三设备联动指南/05-进阶玩法/03-拯救者变家庭服务器) |
| 自动化联动 | 快捷指令 + Tasker + 任务计划 | MacroDroid / Power Automate | [05-4 自动化](/三设备联动指南/05-进阶玩法/04-自动化与NFC玩法) |
| 一套键鼠/耳机控制三设备 | 罗技 MX 系列 Easy-Switch | KVM 显示器 | [05-5 外设](/三设备联动指南/05-进阶玩法/05-外设与桌面组合) |

## 30 分钟"最小可用组合"(先跑通这三件事)

1. **(10 分钟)三端装 [LocalSend](https://github.com/localsend/localsend)** — 同一 Wi-Fi 下即装即用,免费开源,解决 80% 的传文件需求。
2. **(15 分钟)拯救者装 Sunshine,iPad/一加装 Moonlight** — 局域网内低延迟把电脑游戏串到 iPad(接手柄=掌机)或一加,还能当高刷无线副屏。见 [04-1](/三设备联动指南/04-游戏与媒体/01-Sunshine与Moonlight游戏串流)。
3. **(5 分钟)拯救者打开"手机连接(Phone Link)"绑定一加** — 电脑上直接收发短信、看通知、传照片,一加是官方支持屏幕镜像的品牌。见 [02-1](/三设备联动指南/02-一加×拯救者/01-互联方案)。

跑通之后再按需求逐个解锁:手绘(EasyCanvas)、组网出门也能用(Tailscale)、家庭服务器(Jellyfin)、自动化(快捷指令+Tasker)。

## 快速避坑十条(重要)

1. Sidecar / 通用控制 / AirDrop / 连续互通相机:**仅限苹果设备间**,Windows 无解。
2. **Parsec 没有 iOS/iPadOS 客户端**,网上"iPad+Parsec 当副屏"教程均为谬传;它只适合一加连电脑。
3. **SuperDisplay 只支持安卓平板**,iPad 用不了(大量文章混写)。
4. Astropad Studio 是 Mac 专属;EpocCam 已停售停更,别再买。
5. Intel Unison 已于 2025 年停服,卸载即可。
6. **Windows 家庭版无法被 RDP 远程控制**(需专业版),否则改用 RustDesk / ToDesk / 向日葵。
7. **多数拯救者的 USB-C 口不支持 PD 充电输入**,"一线通扩展坞"大概率落空(个别 2023 后新机型支持 140W PD,查你自己的型号规格)。
8. WoL 魔术包**不能穿过 Tailscale 隧道**,远程开机需局域网内有常驻设备转发(方案见 05-2)。
9. **国行一加没有 Google 服务**:Chrome 跨端接力、Quick Share、Pushbullet/Join 这类依赖 GMS 的方案直接放弃,用 Edge / LocalSend / KDE Connect 替代。
10. 官方 Syncthing 安卓 App 已于 2024 年底停更,安卓端请用社区版 **Syncthing-Fork**。

## 文档目录

```
三设备联动指南/
├── README.md                 ← 本文件:全景图 + 最小组合 + 避坑
├── 01-iPad×拯救者/
│   ├── 01-iPad当副屏.md          spacedesk / Duet / Luna / Sunshine虚拟屏
│   ├── 02-手绘板与摄像头.md      EasyCanvas / Weylus / Camo
│   └── 03-远程桌面.md            Windows App / RustDesk / ToDesk / 向日葵
├── 02-一加×拯救者/
│   ├── 01-互联方案.md            Phone Link / O+互联 / scrcpy
│   └── 02-文件与实用玩法.md      传输通道 / 手机当摄像头 / 热点共享
├── 03-三端协同/
│   ├── 01-文件互传与同步.md      LocalSend / Syncthing / iCloud / 云盘
│   ├── 02-剪贴板-通知-浏览器接力.md  KDE Connect / Bark / Edge接力
│   └── 03-笔记与密码.md          Obsidian / Notion / Bitwarden
├── 04-游戏与媒体/
│   ├── 01-Sunshine与Moonlight游戏串流.md  ★ 本套联动性价比之王
│   └── 02-媒体库与反向投屏.md    Jellyfin / Infuse / AirPlay / scrcpy
├── 05-进阶玩法/
│   ├── 01-Tailscale三端组网.md   外网回家基座
│   ├── 02-远程开机与远程桌面.md  WoL / UpSnap / 远程方案对比
│   ├── 03-拯救者变家庭服务器.md  常开设置 / 服务清单 / 路线对比
│   ├── 04-自动化与NFC玩法.md     快捷指令 / Tasker / NFC标签
│   └── 05-外设与桌面组合.md      C口避坑 / KVM / 罗技MX / 网络基础
└── 06-速查表/
    ├── 方案对比总表.md           所有场景一张表
    ├── 常见问题与排错.md
    └── 来源索引与待验证清单.md
```

## 使用建议

- 每份文档开头都有"结论表",赶时间只看表格即可;动手时再看"上手步骤"。
- 带"★"的方案是调研中社区公认体验最好的,带"避坑"标注的请务必先读再装。
- 价格、免费额度会变动,安装前以官网/App Store 当期页面为准;不确定的点集中在 [06/来源索引与待验证清单.md](/三设备联动指南/06-速查表/来源索引与待验证清单)。
