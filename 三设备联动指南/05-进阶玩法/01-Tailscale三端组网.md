---
title: "Tailscale 三端组网:联动的\"地基\" ★"
---

# Tailscale 三端组网:联动的"地基" ★

> 为什么先组网:一旦 iPad、一加、拯救者进了同一个虚拟局域网(Tailscale 分配 100.x.x.x 网段),你在任何地方都能——外网远程桌面办公、外网 Moonlight 串流打游戏、访问家里文件、给电脑远程开机。这是所有"出门也能用"玩法的基座。

## 基本信息

- 定位:基于 WireGuard 的零配置组网,客户端开源、控制面闭源托管。
- 免费额度:**Personal 版 6 个用户、设备数不限**(2025 年扩容后,官网 [tailscale.com/pricing](https://tailscale.com/pricing))。
- 三端全支持:Windows / iPadOS / Android。

## 三端安装要点

| 设备 | 安装 | 注意 |
|---|---|---|
| 拯救者 | 官网下载 Windows 客户端 | 装完登录后即是常开节点 |
| iPad | App Store 装 Tailscale | **iPad 只允许一个 VPN 配置**:Tailscale 和代理/梯子互斥,切换即可,不能同开 |
| 一加 | **国行无 GMS → 官网 APK / F-Droid 安装**(不依赖 Google 服务);国际版商店直装 | 国行系统需允许其后台运行(自启动白名单) |

- 登录:需要一个身份账号(Google/Microsoft/Apple/GitHub)。国内注册/首次登录可能需要科学上网一次,登录成功后日常连接控制面一般可直连。
- 三端登录同一账号,自动进入同一虚拟网。

## 组网后能解锁什么

| 能力 | 用法 | 详见 |
|---|---|---|
| 外网远程桌面 | Windows App/RustDesk 里连拯救者的 100.x IP | [01-3](/三设备联动指南/01-iPad×拯救者/03-远程桌面) / [05-2](/三设备联动指南/05-进阶玩法/02-远程开机与远程桌面) |
| 外网游戏串流 | Moonlight 手动添加 100.x 主机 | [04-1](/三设备联动指南/04-游戏与媒体/01-Sunshine与Moonlight游戏串流) |
| 外网访问文件 | SMB/Jellyfin/qBittorrent WebUI 全部用 100.x IP 直达 | [05-3](/三设备联动指南/05-进阶玩法/03-拯救者变家庭服务器) |
| 子网路由(进阶) | 拯救者开着 Tailscale 的 subnet router,把路由器管理页、打印机等整个家里网段带进虚拟网 | 官方文档 |

## 国内网络表现与优化

- **打洞直连**:同一家庭 Wi-Fi 内三设备几乎必直连(延迟=裸网络+3~10ms);异地时多数家宽也能 P2P 打洞成功。
- **打洞失败**:回落境外 DERP 中继,延迟 200ms+,串流/办公体验崩坏。判断方法:命令行 `tailscale status`,连接显示 non-direct 即中继。
- 优化路线(按折腾度递增):
  1. 路由器开启 UPnP / NAT 类型调宽松;
  2. 自建国内 DERP 中继(需一台云服务器,官方文档 [Custom DERP Servers](https://tailscale.com/kb/1118/custom-derp-servers),目前 alpha 阶段);
  3. 彻底自托管控制面:[Headscale](https://github.com/juanfont/headscale)(开源,可配国内中继)。

## 备选方案对比

| 方案 | 免费额度 | 国内体验 | 备注 |
|---|---|---|---|
| **Tailscale** | 6 用户/设备不限 | 直连好;中继慢;登录依赖境外身份账号 | 首选,零配置 |
| ZeroTier | 免费设备数有限 | 官方根服务器在境外,常需自建 Moon 加速 | 备选 |
| frp | 需自备云服务器 | 最稳最轻(只转发固定端口) | 懂网络者的极简路线,[GitHub](https://github.com/fatedier/frp) |

## 验证清单

装完后逐条确认:
- [ ] 三端 `tailscale status` 能互相 ping 通(设备 IP 100.x.x.x)
- [ ] iPad 关掉其他 VPN 后 Tailscale 正常连接
- [ ] 异地(手机热点)下 `tailscale status` 显示 direct 还是 relay
- [ ] Moonlight/Windows App 用 100.x IP 添加主机成功
