---
title: "iPad 当拯救者的副屏"
---

# iPad 当拯救者的副屏

> 结论:免费先用 **spacedesk**;要低延迟、日用稳定就上 **Duet Display**(USB 有线);愿意折腾且追求最好效果,用 **Sunshine + Moonlight + 虚拟屏驱动**(全免费、可高刷);不差钱买 **Luna Display** 硬件狗。

## 方案对比总表

| 方案 | 连接方式 | 价格 | 开源 | 延迟/画质口碑 | 适合 |
|---|---|---|---|---|---|
| spacedesk | WiFi(无线) | 免费 | 否 | 一般,适合文档/静态内容 | 零成本尝鲜 |
| Duet Display | **USB 有线为主** | 基础版买断约 $10-20;无线/压感需订阅 | 否 | 有线模式可日用(PCMag 认可) | 主力日用副屏 |
| Sunshine+Moonlight+虚拟屏 | WiFi(5GHz 局域网) | **免费开源** | 是 | 游戏级低延迟,可 90/120Hz | 进阶玩家,最佳免费效果 |
| Luna Display | WiFi/USB(硬件狗) | 约 $129 硬件 | 否 | 好,接近原生 | 不差钱、怕折腾 |
| Deskreen | WiFi(浏览器镜像) | 免费 | [是](https://github.com/pavlobu/deskreen) | 镜像为主 | 偶尔投屏镜像 |
| Weylus | WiFi(浏览器) | 免费 | [是](https://github.com/H-M-H/Weylus) | 开发者向,Windows 支持一般 | 顺手当触摸输入板 |

## 各方案上手要点

### 1. spacedesk(免费首选)
1. 电脑端去官网 [spacedesk.net](https://www.spacedesk.net) 下载 **DRIVER(服务端)** 并安装;
2. iPad 在 App Store 装 **spacedesk Viewer**;
3. 两端连同一 Wi-Fi,Viewer 会自动发现电脑,点击连接;
4. Windows「设置 → 系统 → 屏幕」里把 iPad 设为**扩展这些显示器**。

- 优点:完全免费、装完即用。
- 短板:无线延迟偏大,适合文档、聊天、监控窗口这类静态内容;Apple Pencil 跟手性一般;社区反馈 iOS 端 USB 连接不稳定。

### 2. Duet Display(付费,USB 有线最稳)
1. 电脑端 [duetdisplay.com](https://www.duetdisplay.com) 装服务端,iPad 装 Duet App,数据线连接即出画面;
2. 基础买断版就有有线扩展屏;**无线扩展和压感数位板功能要订阅**(Duet Air / Duet Pro,约 $6-10/月)。
- 口碑:App Store 4.5 分,有线延迟公认可日用;Trustpilot 有稳定性吐槽,先试免费退款期。

### 3. Sunshine + Moonlight + 虚拟屏(免费方案里的天花板)★
思路:不把它当"副屏软件",而是把拯救者的画面**串流**到一个虚拟显示器上——延迟远低于传统副屏方案,还能跑满高刷。
1. 拯救者装 [Sunshine](https://github.com/LizardByte/Sunshine)(约 41.8k★,持续更新),装好后浏览器打开 `https://localhost:47990` 设好账号;
2. 加装**虚拟显示器驱动**(社区常用 IddSampleDriver 或 Parsec 虚拟屏驱动),让 Windows 多出一块"不存在的显示器";
3. iPad 装 [Moonlight](https://github.com/moonlight-stream/moonlight-ios)(约 1.7k★),自动发现主机,输入 PIN 配对;
4. Moonlight 里选择虚拟屏输出 → iPad 就成了一块低延迟无线副屏,配合手柄还能直接玩电脑游戏(见 [04-1 游戏串流](/三设备联动指南/04-游戏与媒体/01-Sunshine与Moonlight游戏串流))。

- 拯救者优势:独显 NVENC 硬编码,串流开销极小。
- 代价:步骤比前两个多,虚拟屏驱动需与显卡驱动配合,个别机型要折腾。

### 4. Luna Display(硬件方案)
- Astropad 家唯一支持 Windows 的产品(加密狗插电脑 USB-C/HDMI),iPad 端装 App 即可,体验接近 Mac 版 Sidecar。
- 缺点:$129 左右的硬件成本;不支持部分迷你主机/Surface。官网 [astropad.com](https://astropad.com)。

## 避坑清单

- **Sidecar(随航)只能 iPad↔Mac**,Windows 永远用不了,别再找"Windows 开启随航"的教程。
- **SuperDisplay 仅支持安卓平板**,iPad 用不了,网上文章常混写。
- Splashtop Wired XDisplay 近乎停更、驱动问题多,不建议新入坑。
- Parsec **没有 iOS 客户端**,所谓"iPad 用 Parsec 当副屏"的教程是谬传(安卓平板才成立)。
- spacedesk 的 USB 有线连接在 iOS 端稳定性两极分化,先无线试,不满意再考虑付费方案。

## 场景建议

- 出差/咖啡厅,iPad+拯救者双屏写代码写文档 → Duet(USB,不依赖网络质量)或 spacedesk(免费)。
- 家里固定工位 → Sunshine+Moonlight+虚拟屏,顺带解决游戏串流,一套方案两个用途。
- 只是想偶尔在 iPad 上看一眼电脑画面 → Deskreen(浏览器打开就完事)。
