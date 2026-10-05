---
title: "Sunshine + Moonlight:把拯救者变成 iPad/一加的\"游戏主机\" ★"
---

# Sunshine + Moonlight:把拯救者变成 iPad/一加的"游戏主机" ★

> 这是本套联动里性价比最高的玩法:免费开源、延迟最低、支持 4K120/HDR/手柄。iPad 接上手柄就是"PC 掌机",一加秒变云端游戏机。
> 背景:NVIDIA 官方 GameStream 已于 2023 年终止(GeForce Experience 也被 NVIDIA App 取代且不含串流主机功能),社区继任者就是 **Sunshine**(开源主机端)+ **Moonlight**(开源客户端)。

## 原理

```
拯救者(Win11 + Sunshine + 独显NVENC硬编码)
        │  局域网 Wi-Fi 5GHz / 有线(延迟 5-15ms)
        ▼
Moonlight 客户端:iPad(MFi手柄)/ 一加 / 其他电脑(硬解码)
```

- Sunshine:[GitHub ≈41.8k★](https://github.com/LizardByte/Sunshine),GPL-3.0,更新活跃(2026-09 仍在发版),支持 Windows/macOS/Linux。
- Moonlight 客户端:[iOS](https://github.com/moonlight-stream/moonlight-ios) / [Android](https://github.com/moonlight-stream/moonlight-android) 全平台,APK 直装免 Google 服务。

## 上手步骤(Windows 端)

1. 拯救者下载安装 Sunshine([官网](https://lizardbyte.dev) 或 GitHub Releases);
2. 浏览器打开 `https://localhost:47990`,设置用户名密码(管理界面);
3. Applications 里添加要串流的目标:`Steam 大屏幕模式`(推荐,一进就是手柄界面)或任意 exe;
4. 按管理界面 Troubleshooting 提示安装**虚拟手柄驱动**(ViGEmBus / 新版输入后端),否则手柄没反应;
5. 放行防火墙(安装时一般自动配好:TCP 47989 等 + UDP 47998-48000)。

## 上手步骤(客户端)

1. iPad/一加装 Moonlight → 同一 Wi-Fi 下自动发现主机 → 点主机输入管理界面显示的 **PIN** 配对;
2. iPad 接 MFi 手柄(Backbone、盖世小鸡等拉伸/蓝牙手柄都行)→ 点"Steam Big Picture"→ 即进入手柄化 PC 游戏大厅;
3. 码率/分辨率在 Moonlight 设置里调(见下表),先 1080p60/20Mbps 起步,流畅再往上加。

## 码率与网络建议

| 场景 | 分辨率/帧率 | 建议码率 | 网络要求 |
|---|---|---|---|
| 办公/轻游戏 | 1080p60 | 20-40 Mbps | 5GHz Wi-Fi 或有线,<5ms |
| 高刷游戏 | 1080p120 | ~50 Mbps | 有线回程 Mesh / 千兆局域网 |
| 极致画质 | 4K60 | 80-100 Mbps | 全有线 + 好网卡 |

- 社区实测:1080p90 + HEVC 硬编硬解,局域网网络延迟可低至约 2ms(来源:掘金实测、B站"Moonlight 120hz"教程)。
- 拯救者务必**网线接入路由器/交换机**,客户端用 5GHz;2.4G 和无线 Mesh 回程会明显抖动。

## 外网串流(出门在外玩家里的拯救者)

1. 三端装 [Tailscale](https://tailscale.com) 组网(见 [05-1](/三设备联动指南/05-进阶玩法/01-Tailscale三端组网));
2. Moonlight 手动添加主机:输入拯救者的 Tailscale IP(100.x.x.x),配对方式同上;
3. **先 `tailscale status` 确认显示 direct(直连)** 再谈高码率;回落 DERP 中继时延迟 100ms+,只适合回合制游戏;
4. 码率:外网 20-30 Mbps 起步,稳定后逐步升;1080p60 用 15-20 Mbps 通常已流畅(留 1Mbps 以上余量)。

## 替代方案对比

| 方案 | 定位 | 与 Sunshine/Moonlight 比 |
|---|---|---|
| **Steam Link**(Valve 官方 App) | 零配置串流 Steam 库 | 免费、5 分钟上手;上限低(一般 4K60,参数少)。**先装 Moonlight,嫌折腾再装它** |
| Parsec | 商业串流/远程桌面 | 解码极优、4:4:4 适合办公;❌ **无 iOS/iPadOS 客户端**,仅一加能用 |
| Moonlight 当"副屏" | 配合虚拟屏驱动 | 见 [01-1 iPad当副屏](/三设备联动指南/01-iPad×拯救者/01-iPad当副屏),一套软件两个用途 |

## 避坑

- 手柄不识别 = 没装 Sunshine 的虚拟手柄驱动,回管理界面点 Troubleshooting。
- 新版 Sunshine(2026.9+)输入后端有迁移,手柄异常可回退旧版或按官方文档重装驱动。
- 找不到主机:检查两端是否同一网段、路由器"AP 隔离"是否关闭、防火墙是否放行(详见 [06/常见问题](/三设备联动指南/06-速查表/常见问题与排错))。
- 独显直连/混合模式不影响串流,但驱动保持更新,NVENC 才最稳。

## 参考

- 官方文档:[docs.lizardbyte.dev](https://docs.lizardbyte.dev) / [moonlight-stream.org](https://moonlight-stream.org)
- 中文教程:B站搜"sunshine 教程""moonlight 串流"(大量近期视频);掘金《Sunshine/Moonlight 局域网串流》实测
