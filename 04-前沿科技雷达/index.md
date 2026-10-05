---
title: "前沿科技雷达 · Tech Radar v3"
---

# 前沿科技雷达 · Tech Radar v3

一套跑在你自己电脑上（或 GitHub 云端）的"科技情报系统"：每天自动从
**8 个板块、10+ 个信息源**抓取前沿科技动态，经热度归一化和跨源聚类后，
生成一份置顶"今日 TOP 榜"、可搜索、可离线打开的 HTML 简报，同时输出
Markdown、JSON 数据快照和 RSS 订阅源。**Python 3 标准库即可运行，无需安装任何依赖。**

v3 在 v2 基础上，**广泛调研了 GitHub 8 个项目 + B 站 7 个对象（共 15 个新对象）**，
吸收了 kabi-digest / Horizon / ntfy / DailyHotApi / ai-radar 等成熟项目的设计经验后迭代：

| 成熟项目（GitHub Stars） | 吸收的设计经验 | v3 中的对应实现 |
|---|---|---|
| **jackwener/kabi-digest** | 时间衰减评分公式 `(eng-1)/(age+2)^1.8`；collect/generate 两阶段；published 去重 | `apply_time_decay()`：有发布时间的条目叠加新鲜度因子（当天=1.0，1天≈0.80，7天≈0.36） |
| **Thysrael/Horizon**（~9.5k★） | Profile 驱动 + 平衡配额（防单话题霸屏）；先便宜筛选后昂贵 enrich | `build_top()` 中 `top_balance_per_source`：同一原始板块最多占 TOP 榜 N 条 |
| **binwiederhier/ntfy**（25.4k★） | 一行 HTTP POST 推送到手机，无需注册/SDK/API key | `notify()`：支持 `ntfy://` `bark://` `webhook://` 三种 URL-scheme，每个通道一个 urllib POST |
| **caronc/apprise**（~17.4k★） | URL-scheme 通道配置 + 失败降级思想 | 同上：不引库，用 ~60 行 stdlib 实现迷你版通知抽象 |
| **imsyy/DailyHotApi**（4,063★） | 一源一适配器；RSS/JSON 双输出；60min 缓存；状态表自描述 | `render_rss()` 生成 RSS 2.0 feed；HTML 新增各源状态面板（成功显示条数/失败标✗） |
| **RCliang/ai-radar**（B站） | 漏斗式输出；采集与推送解耦；钉钉/飞书 webhook | 推送模块与采集逻辑完全解耦，脚本只 POST 到配置的 webhook |
| **B站 Codex 信息矩阵视频** | 链接可达性 HEAD 校验；配置文件驱动 | `check_top_links()`：可选开关，对 TOP 榜 URL 并发 HEAD，挂掉标⚠️ |

> v2 已吸收的项目（TrendRadar / NewsNow / n8n / RSSHub / Folo）全部保留，
> 详见下方"v2 吸收的成熟项目经验"。没有直接部署任何一个项目——它们解决的是
> "通用聚合平台"，而这套脚本是为你（本校学生、中文环境、想聚焦科技）定制的，
> 且你能看懂、改得动每一行。

### v2 吸收的成熟项目经验（全部保留）

| 成熟项目 | 吸收的设计经验 | 对应实现 |
|---|---|---|
| **TrendRadar**（62.5k★） | 排名+热度权重打分；新鲜度过滤；daily/current/incremental；AI 情报分析 prompt；多形态部署 | 热度归一化、板块内排序；与历史快照对比标 NEW；可选 AI 今日解读；本地/云端双形态 |
| **NewsNow** | 一个 API 聚合各平台热榜，配置驱动 | IT之家全量快讯 + 知乎/B站/百度热搜科技信号；`config.json` 外置配置 |
| **n8n**（40k+★） | 定时→抓取→过滤→LLM摘要→推送 工作流 | 定时任务 + 可选 LLM 解读（OpenAI 兼容接口） |
| **RSSHub** | 万物皆可 RSS；公共实例兜底 | RSS 板块单源失败自动跳过，可自行加任意 RSS |
| **Folo**（22k★） | AI RSS 阅读器的"聚合+AI摘要"形态 | 聚合简报 + AI 解读的整体形态参考 |

---

## 一、每天它都抓什么

| 板块 | 来源 | 内容 |
|---|---|---|
| **今日 TOP 榜**（置顶） | 全部板块跨源聚类 | 跨源热度排序；同一事件被多个平台报道时加权，3+ 源标"N源共振·破圈"，2 源标"2源关注" |
| IT之家 · 科技快讯 | NewsNow API | 当天 15 条科技快讯，含日期 |
| 全网热搜 · 科技信号 | NewsNow（知乎/B站/百度） | 从娱乐化的全网热搜里**只捞科技相关**条目 |
| Hacker News 热榜 | 官方 API | 全球科技圈最有影响力的新闻/讨论 |
| 最新论文 · arXiv/S2 | arXiv 官方 API（限流时自动切 Semantic Scholar） | cs.AI/LG/CL/CV/RO + stat.ML 最新论文，含摘要、作者 |
| Hugging Face 每日论文 | HF API（不通自动走 hf-mirror.com 镜像） | 社区投票选出的热门论文 |
| GitHub 今日趋势 | GitHub Trending | 当天涨星最快的开源项目 |
| 掘金 · 开发者热帖 | 掘金 API | 国内开发者社区在聊什么 |
| 中文科技媒体 · RSS | 量子位 / Solidot / 开源中国 / InfoQ / 少数派 / 阮一峰周刊 | AI 报道、极客新闻、技术架构、效率工具 |
| AI 今日解读（可选） | 你配置的任意 OpenAI 兼容接口 | 今日主线 / 弱信号 / 给你的行动建议，三段式 |

特性：

- **热度归一化 + 热度条**：排名型、分数型（HN 分/HF 赞/GitHub 星/掘金赞）
  统一折算成 0~1 热度，板块内按热度排序，卡片底部有可视化热度条
- **时间衰减**（v3，kabi-digest）：有发布时间的条目叠加新鲜度因子，
  当天内容权重最高，旧内容自然衰减，避免老新闻霸榜
- **跨源聚类**：标题分词（英文单词 + 中文 2/3-gram）后贪心聚类，
  阈值刻意保守（Jaccard 0.40，宁缺毋滥）——共振标记只在真正的全网大事件出现
- **平衡配额**（v3，Horizon）：TOP 榜中同一原始板块最多占 N 条，防止单一来源霸屏
- **NEW 标记**：与最近一期历史快照对比，新出现的条目标 NEW（首次运行无历史，
  从第二天起生效）
- **关键词过滤 + HOT 标记**：顶部搜索框即时筛选；命中关键词自动标 HOT
- **各源状态面板**（v3，DailyHotApi）：HTML 顶部一目了然显示每个源的成功状态和条数
- **链接可达性校验**（v3，可选）：对 TOP 榜 URL 并发 HEAD 请求，挂掉的标⚠️
- **容错**：单源失败自动跳过并在顶部标注；arXiv 限流自动退避重试并降级 S2
- **四种输出**：HTML（自包含可离线）、Markdown（方便做笔记/转发）、
  JSON（数据快照）、**RSS 2.0**（v3，可用任意 RSS 阅读器订阅）
- **推送通知**（v3，ntfy/apprise）：生成简报后自动推送到手机，支持 ntfy/Bark/webhook

---

## 二、目录结构（文件已分类归整）

```
前沿科技雷达/
├── tech_radar.py              # 主程序（唯一需要运行的文件）
├── config.json                # 配置（首次运行自动生成，可自行编辑）
├── README.md                  # 本说明
├── output/                    # 每日产物，按日期归档
│   ├── tech-radar-YYYY-MM-DD.html   # 每日简报（主产物，可离线）
│   ├── tech-radar-YYYY-MM-DD.md     # Markdown 版
│   ├── tech-radar-YYYY-MM-DD.json   # 数据快照（NEW 标记的对比依据）
│   ├── tech-radar-YYYY-MM-DD.xml    # RSS 2.0 订阅源
│   ├── latest.html                  # 最新一期（建议加到浏览器书签）
│   └── radar.log                    # 运行日志
├── docs/                      # 调研与设计文档（想了解演进过程再看）
│   ├── V3-调研与优化说明.md          # v3：调研了什么 → 改了什么
│   ├── 调研-GitHub开源项目.md
│   └── 调研-B站视频与仓库.md
└── .github/workflows/         # GitHub Actions 云端定时模板（可选）
    └── tech-radar.yml              # .github 位置是 GitHub 硬性要求，勿移动
```

日常你只需要两样东西：**运行 `tech_radar.py`，看 `output/latest.html`**；
其余文件各归其位，不会散乱。

---

## 三、怎么用

### 手动运行

```powershell
# 在本目录下
python tech_radar.py --open     # 生成今天的简报并自动打开
python tech_radar.py --force    # 强制重新抓取（默认当天已生成会跳过）
```

首次运行会在本目录自动生成 **`config.json`**（默认配置）。

生成的文件在 `output\` 目录：

- `tech-radar-YYYY-MM-DD.html` —— 每日简报（按日期归档）
- `tech-radar-YYYY-MM-DD.md`   —— Markdown 版
- `tech-radar-YYYY-MM-DD.json` —— 数据快照（NEW 标记就靠和它对比）
- `tech-radar-YYYY-MM-DD.xml`  —— RSS 2.0 订阅源（v3，可用 Feedly/Inoreader/浏览器订阅）
- `latest.html` —— 最新一期，建议加到浏览器书签/桌面快捷方式
- `radar.log` —— 运行日志，没出简报时先看它

### 已配置的自动化（无需手动）

1. **每天 07:30** 由 ZCode 定时自动化运行（与每日视野简报同批）：先执行
   `python tech_radar.py` 生成本日雷达，随后做每日视野简报
   （详见 [`每日视野简报/`](#/doc/d088)）
2. ZCode 应用处于运行状态时自动触发；电脑没开机错过时点的话，开机后在
   ZCode 自动化页面手动触发一次，或在本目录直接运行 `python tech_radar.py`
   补跑（当天已生成则秒退，不会重复）

---

## 四、自定义：编辑 config.json

不用改代码，用记事本打开本目录的 `config.json`：

- `hot_keywords`：HOT 标记和热搜过滤用的关键词，随意增删
  （如加上 `"低空经济"`、"`具身智能`"）
- `hot_search_platforms`：热搜平台，可加 `"douyin"`（抖音）等
- `rss_sources`：RSS 源，格式 `["来源名", "URL", 条数]`，
  任意网站的 RSS 都能加（想找 RSS 地址可用 RSSHub Radar 浏览器扩展）
- `limits`：各板块条数
- `notify`（v3）：推送通道，URL-scheme 格式，留空=不推送。支持：
  - `"ntfy://你的topic名"` → 手机装 ntfy app 订阅即可，**无需注册**
  - `"bark://你的设备key"` → iOS Bark 推送
  - `"webhook://https://oapi.dingtalk.com/robot/send?access_token=xxx"` → 飞书/钉钉/Slack 等任意 JSON webhook
- `check_links`（v3）：`true`=对 TOP 榜每条 URL 发 HEAD 校验，挂掉标⚠️（增加约 5-10 秒）；`false`=跳过（默认）
- `top_balance_per_source`（v3）：TOP 榜中同一原始板块最多占多少条，默认 5，防止单一来源霸屏

改坏了/想恢复默认：删掉 `config.json`，下次运行自动重建。

---

## 五、开启 AI 今日解读（可选）

脚本支持任意 **OpenAI 兼容接口**。不配 key 就自动跳过，简报照常生成。

### 方案 A：DeepSeek（便宜，推荐；一次解读约 1~2 分钱）

1. 注册 https://platform.deepseek.com ，充值 5 元够用几个月，创建 API Key
2. 设置环境变量（PowerShell 运行一次，永久生效）：

```powershell
[Environment]::SetEnvironmentVariable("RADAR_AI_KEY", "sk-你的key", "User")
# 下面两个可省略（默认就是 DeepSeek）：
# [Environment]::SetEnvironmentVariable("RADAR_AI_BASE", "https://api.deepseek.com", "User")
# [Environment]::SetEnvironmentVariable("RADAR_AI_MODEL", "deepseek-chat", "User")
```

### 方案 B：本地 Ollama（免费、离线、隐私，但要显卡够好）

安装 Ollama 后 `ollama pull qwen2.5:7b`，然后：

```powershell
[Environment]::SetEnvironmentVariable("RADAR_AI_BASE", "http://localhost:11434/v1", "User")
[Environment]::SetEnvironmentVariable("RADAR_AI_MODEL", "qwen2.5:7b", "User")
[Environment]::SetEnvironmentVariable("RADAR_AI_KEY", "ollama", "User")
```

其他服务商（硅基流动、通义、Kimi、OpenRouter 等）只要给 OpenAI 兼容地址，
同理替换三个变量即可。设置后**重开终端/重启电脑**让环境变量生效。

---

## 六、开启推送通知（可选，v3 新增）

简报生成后自动推送到手机，不用主动打开电脑看。三种通道任选，**全部零第三方依赖**：

### 方案 A：ntfy（推荐，无需注册，30 秒搞定）

1. 手机应用商店搜 **ntfy** 安装（iOS / Android 都有）
2. 打开 app，订阅一个自己取的 topic 名（比如 `my-tech-radar-2026`，越独特越好）
3. 在 `config.json` 里加：
   ```json
   "notify": ["ntfy://my-tech-radar-2026"]
   ```
4. 下次生成简报时手机就会收到通知，点通知可直接看详情

### 方案 B：Bark（iOS 专属，更轻量）

1. App Store 搜 **Bark** 安装，打开后复制你的设备 key
2. `config.json`：`"notify": ["bark://你的设备key"]`

### 方案 C：Webhook（飞书/钉钉/Slack/企业微信等）

1. 在群里添加自定义机器人，拿到 webhook URL
2. `config.json`：`"notify": ["webhook://https://oapi.dingtalk.com/robot/send?access_token=xxx"]`
3. 脚本会 POST 一个 JSON：`{"title": "...", "body": "...", "date": "..."}`

> 可同时配置多个通道，逐个推送；某个通道失败自动跳过不影响其他。
> 推送内容是简报摘要（条数 + TOP 数），不是全文——全文还是打开 HTML 看。

---

## 七、云端运行（可选）：不依赖电脑开机

`.github\workflows\tech-radar.yml` 已备好 GitHub Actions 模板：
GitHub 的服务器每天北京 07:00 自动抓取，产物提交回你的私有仓库，
手机随时能看。配置方法见该文件顶部注释（建私有仓库 → 推送 → 可选加
AI key 的 Secret，约 10 分钟）。云端跑还顺带解决了 arXiv/HF 在国内访问受限
的问题（GitHub 服务器在海外）。

---

## 八、定时任务的调整 / 卸载

**改时间**（比如改成中午 12:15）：

```powershell
$t = New-ScheduledTaskTrigger -Daily -At "12:15"
Set-ScheduledTask -TaskName "TechRadar-Daily" -Trigger $t
```

**暂停 / 恢复 / 卸载**：

```powershell
Disable-ScheduledTask  -TaskName "TechRadar-Daily"     # 暂停
Enable-ScheduledTask   -TaskName "TechRadar-Daily"     # 恢复
Unregister-ScheduledTask -TaskName "TechRadar-Daily" -Confirm:$false   # 删除任务
# 登录补跑：删除启动文件夹里的 TechRadar.lnk
# （资源管理器地址栏输入 shell:startup 可快速打开启动文件夹）
```

---

## 九、脚本之外：完整的前沿科技渠道地图

自动简报解决"每天 10 分钟扫动态"，但真正的前沿在这些地方，按场景挑用：

### 1. 论文与研究（想知道科学家在做什么）

- **arXiv**（脚本已覆盖）：AI/物理/数学预印本，比正式发表早半年到两年
- **Hugging Face Papers / Papers with Code**：论文 + 代码 + 社区讨论，论文复现第一站
- **Semantic Scholar**（脚本已作备用源）：AI 驱动文献检索，能看"引用网络"
- **Connected Papers**：输入一篇论文，可视化它的来龙去脉和整个方向
- **Google Scholar 邮件提醒**：订阅关键词或作者，新论文自动发邮件
- **各实验室主页 / 博客**：DeepMind、OpenAI、Anthropic、Meta FAIR、
  微软研究院、清华 KEG、智源研究院、上海 AI Lab、面壁、月之暗面等

### 2. 社区与讨论（想知道从业者在想什么）

- **Hacker News**（脚本已覆盖）：英文世界质量最高的科技讨论
- **X / Twitter**：研究者本人最活跃的地方，重大成果往往先发自这里
  （可先关注：Andrej Karpathy、Andrew Ng、Jim Fan、swyx、Sebastian Raschka、
  宝玉 XP、歸藏、林亦等；用列表 List 分组管理）
- **Reddit**：r/MachineLearning（学术向）、r/LocalLLaMA（本地部署/实战向）、
  r/singularity、r/programming（有代理可把脚本掘金换回 Reddit，
  代码里保留了 `fetch_reddit()`）
- **中文**：知乎话题（深度学习/人工智能/计算机科学）、机器之心、量子位、
  新智元、PaperWeekly、Datawhale（开源学习社区，强烈推荐学生加入）
- **Discord / Slack**：Hugging Face、LangChain 等开源社区官方群，能直接向作者提问
- **GitHub**（脚本已覆盖 Trending）：看项目的 Issues / Discussions，
  比任何教程都贴近真实问题

### 3. 系统学习（把"看热闹"变成"看得懂"）

- **CS 自学指南**：https://csdiy.wiki （北大学生整理，全球名校公开课导航）
- **跟李沐学 AI**（B 站）：论文逐段精读，AI 学生几乎人人看过
- **Andrej Karpathy**：nanoGPT / makemore / micrograd，从零手搓，看完对底层不再恐惧
- **fast.ai**：实战派深度学习课程
- **MIT OCW / Stanford Online**：MIT 6.001、CS231n（视觉经典）、
  CS224n（NLP 经典）全部免费
- **3Blue1Brown**：用动画讲透线性代数/微积分/神经网络，建立直觉

### 4. 动手实战（这是从"知道"到"会"的唯一通道）

- **Kaggle / 天池 / DataFountain**：真实数据竞赛，有完整高手方案可学
- **Hugging Face**：跑通一个模型 → 微调 → 部署 Demo → 写进简历
- **给开源项目提 PR**：从改文档、修 good first issue 开始，是进入全球协作网络的门票
- **搭一个自己的小产品**：脚本、机器人、网站，上线给真人用
- **LeetCode / 八股之外**：多做完整项目，大二开始积累，大三实习面试时降维打击

### 5. 播客与长内容（通勤、吃饭时听）

- **Latent Space**（英文，AI 工程一线访谈）
- **Lex Fridman**（英文，科学家/创始人长谈）
- **The TWIML AI Podcast**、**Acquired**（商业与科技史）
- **中文**：科技乱炖、枫言枫语、十字路口、泡腾 VC

### 6. 走出校园（本校 + 西安本地 + 寒暑假）

- **本校实验室（近水楼台，优先）**：本校的 AI、雷达、密码、电子信息方向在国内
  第一梯队，智能感知与图像理解教育部重点实验室、雷达信号处理全国重点实验室、
  综合业务网理论及关键技术国家重点实验室等都有本科生开放课题——大胆给老师
  发邮件说"我想免费干活学东西"，大二正是最好的时间
- **竞赛（本校传统强项）**：大创 / 互联网+ / 挑战杯 / 数学建模 / 电子设计竞赛 /
  信息安全竞赛，拿项目、找队友、混圈子
- **西安本地产业**：华为西安研究所、中兴、三星半导体、紫光国芯（存储芯片）、
  航天五院/六院相关院所——留意参观日、宣讲会、日常实习
- **寒暑假去北上广深杭**：日常实习、开源之夏（OSPP，带薪给开源社区干活）、
  各公司夏令营/黑客松；AI 公司的远程实习/远程贡献也完全可行
- **学术会议当志愿者**：WAIC 世界人工智能大会、中关村论坛、各 CCF 会议
  招募学生志愿者，能免费进场听报告、认识人

---

## 十、建议的节奏

- **每天 10 分钟**：打开 `latest.html` 扫一遍，只点感兴趣的
- **每周 1 篇论文**：精读 + 复现核心结果，一年 50 篇，超过绝大多数同龄人
- **每月 1 个小作品**：哪怕只是一个脚本、一次 PR、一篇笔记
- **每学期 1 次"出圈"**：进一个实验室 / 打一次比赛 / 参加一次线下活动 /
  申请一次实习

信息焦虑的解药不是看更多，而是**动手做**——前沿不是"刷"到的，是在做的过程中
被你撞上的。
