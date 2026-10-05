---
title: "自动化与 NFC:让三台设备自己动起来"
---

# 自动化与 NFC:让三台设备自己动起来

## 一、三端自动化工具

| 设备 | 工具 | 触发器举例 |
|---|---|---|
| iPad / iPhone | **快捷指令 → 自动化(Automations)** | 到达某位置 / 连上某 Wi-Fi / 特定时间 / 打开某 App;iOS 15+ 可关"运行前询问"实现全自动 |
| 一加 | **Tasker** 或 **MacroDroid**(均有 APK,免 Google 服务) | 连上家里 Wi-Fi / 到达位置 / NFC 标签 / 时间 / 通知内容 |
| 拯救者 | **任务计划程序** + Power Automate Desktop(Win11 内置免费) | 开机 / 登录 / 定时 / 事件日志触发跑脚本 |

- ColorOS 后台激进:给 Tasker/MacroDroid 开**自启动白名单 + 关电池优化 + 最近任务锁定**,仍被杀可上 [Shizuku](https://github.com/RikkaApps/Shizuku) 授权。
- 国行一加自带"自动化"入口(原 Breeno 指令)可做轻量联动,重活交给 Tasker。

## 二、可直接抄的联动实例

1. **"到家自动唤醒电脑"**:一加连上家里 Wi-Fi(Tasker 触发)→ 发 WoL 魔术包(任务)→ 延时 30 秒 → 打开 Moonlight,坐下就能玩。
2. **"一键出门模式"**:iPad 快捷指令(桌面图标)→ 一键开 Tailscale → 打开 Windows App/Moonlight → 直连家里拯救者。
3. **"下载完成推送到 iPad"**:qBittorrent/脚本完成 → 任务计划触发 PowerShell 调 Bark API → iPad 弹通知(命令见 [03-2](#/doc/d372))。
4. **"电脑网页/文件随手给手机"**:Edge"发送到设备"推链接;LocalSend 三端互发;均可做进快捷指令。
5. **"NFC 碰一下进游戏"**(见下节):一加碰桌贴 → 开 Tailscale → 启动 Moonlight → 连家里主机。

## 三、NFC 碰一碰玩法(一加专属)

- 硬件事实:**一加可读写 NFC 标签;iPad 没有可编程 NFC 触发能力**(只能被动读,不能当自动化触发器)。
- 玩法:
  1. 买几枚 NTAG213/215 NFC 贴纸(几毛钱一枚),手机装 **NXP TagWriter** 写入;
  2. Tasker 建 "Event → NFC Tag" 任务(触发动作:开 Tailscale、开 Moonlight、开热点、开传送……);
  3. 贴在桌面/门口/车载支架:碰一下=一个动作。
- 坑:国行系统的"钱包/NFC 默认应用"可能拦截标签,在设置里放行或改默认应用;写入前把标签设为只读防误触。
- 参考:[Tasker NFC 文档](https://tasker.joaoapps.com/userguide/en/help/eh_nfc_tag.html)

## 四、进阶:Home Assistant 统一调度(选做)

- 若日后上了 NAS/家庭服务器,可部署 Home Assistant,把"设备在线状态、WoL、通知、传感器"统一成规则引擎,三端自动化从"各自为战"升级为"一个大脑";入口可以做成 iPad/一加的 PWA 图标。
- 没有常开设备前不必上,任务计划+快捷指令+Tasker 已够用。
