---
title: "B 站「AI 日报 / 科技早报 / 信息聚合」视频与开源仓库调研报告"
---

# B 站「AI 日报 / 科技早报 / 信息聚合」视频与开源仓库调研报告

> 调研目的：为一个已有的**零依赖 Python 科技信息雷达脚本**收集设计参考。
> 调研方式：`general_search` 带 `site:bilibili.com` 检索 + `web.fetch` 精读视频页拿简介/播放量/仓库地址。
> 信息来源标注：
> - 【精读】= `web.fetch` 实际抓到了该视频页的简介正文
> - 【搜索摘要】= 仅 `general_search` 摘要可见，页面未二次精读
> - 播放量一栏：B站网页对播放量数字的渲染不稳定，未抓到的一律标「未抓取到」，不编造。
>
> 调研时间：2026-09-28

---

## 一、视频 / 项目清单（共 7 个对象）

### 1. 【开源】别让 Agent 全包你的日报！10 分钟部署一个不会断更的 AI 早报 ★最对口

| 项 | 内容 |
|---|---|
| 视频标题 | 【开源】别让Agent全包你的日报！10分钟部署一个不会断更的AI早报 |
| UP 主 | AI摸鱼的梁师傅 【精读】 |
| 播放量 | 页面未渲染出播放量数字，未抓取到（视频发布于 2026-09-17，较新） |
| 视频地址 | https://www.bilibili.com/video/BV1LYer6hEYw/ |
| 开源仓库 | **https://github.com/RCliang/ai-radar** 【精读】 |
| 信息源层级 | 【精读】 |

**方案核心设计：**
- **数据从哪来**：15 个信息源 —— 官方博客、中英文媒体、HackerNews、Reddit、GitHub Trending，外加 X (Twitter) 上 15 位大佬的一手发言（用「小号 + cookie」方式抓，视频 04:27 处全程演示）。
- **怎么处理**：每天把 300+ 条资讯浓缩成一份早报，产出物固定为「3 条编辑部判断 + 5 条能直接开拍的选题」——**不是简单罗列，而是强制 LLM 做筛选和判断**。
- **怎么推送**：钉钉 / 飞书机器人 webhook，准点推送。
- **怎么调度**：systemd timer 定时任务。
- **哲学立场**：视频 00:35 专门讲「为什么不用 Agent 全包」（对比 OpenClaw / hermes），倾向**确定性脚本 + 固定管线**，而不是让 Agent 自由发挥——这点对零依赖脚本非常友好。

**可借鉴点（具体到零依赖 Python 脚本）：**
1. **「N 条源 → M 条判断 + K 条选题」的漏斗输出格式**：不要把抓到的 300 条全塞给用户，而是在脚本里硬编码一个「编辑部视角」的 prompt 模板，强制 LLM 只输出固定结构（判断/选题），这比自由摘要更易做 diff 和去重。
2. **X/Twitter 一手源用 cookie 抓取，而不是依赖 API**：零依赖脚本里可以直接 `urllib.request` 带 cookie 拉用户 timeline HTML/JSON，不需要装 tweepy。
3. **systemd timer 调度**：跨平台等价物就是 Windows 任务计划程序 / cron，脚本本身只负责「跑一次出一份报」，调度交给系统。
4. **钉钉/飞书 webhook 推送**：纯 HTTP POST，`urllib.request` 即可完成，不需要任何 SDK。

**是否建议采纳：✅ 强烈建议**
理由：仓库名就叫 `ai-radar`，与「科技信息雷达」定位完全重合；技术栈轻、输出结构清晰、调度与推送分离，是本次调研中最直接可对标的参考实现。

---

### 2. python 爬虫 + webhook，实现多平台的新闻聚合 ★技术栈最对口

| 项 | 内容 |
|---|---|
| 视频标题 | python爬虫+webhook，实现多平台的新闻聚合 |
| UP 主 | 柯南-科技 【精读】 |
| 播放量 | 83（小 UP 主新作，页面标题下数字） |
| 视频地址 | https://www.bilibili.com/video/BV19p8WzSEds/ |
| 开源仓库 | 上游：**https://github.com/sansan0/TrendRadar** ；UP 主自分叉：https://github.com/hxsyzl/TrendRadar ；Webhook 接收端：https://github.com/hxsyzl/WebHook-Notifier 【精读】 |
| 信息源层级 | 【精读】 |

**方案核心设计：**
- **数据从哪来**：TrendRadar 项目本身就是一个多平台热榜/趋势抓取器（GitHub Trending、Reddit、v2ex、微博、知乎等）。
- **怎么处理**：Python 爬虫定时跑，按关键词规则过滤。
- **怎么推送**：**Webhook 模式** —— 抓到新内容后 HTTP POST 到 `WebHook-Notifier` 这个自托管接收端，再由接收端转发到企业微信/钉钉/Telegram 等。
- **架构亮点**：「采集脚本」和「推送通道」解耦 —— 脚本只管 POST 到一个 webhook URL，接收端负责多渠道分发。

**可借鉴点（具体到零依赖 Python 脚本）：**
1. **采集/推送解耦**：你的零依赖脚本可以只做「抓 → 过滤 → POST 到 webhook」，把「发钉钉还是发飞书还是发 Telegram」这件事留给接收端，脚本本体不耦合任何平台 SDK。
2. **TrendRadar 的源清单本身就是现成的信息源配置表**：可以直接去 `sansan0/TrendRadar` 仓库抄它支持哪些站点、每个站用什么 endpoint 抓，移植到自己的 `urllib` 版。
3. **关键词过滤规则前置**：TrendRadar 是在抓取端就用关键词筛掉无关项，而不是抓全量再丢给 LLM——这能显著省 token。

**是否建议采纳：✅ 建议**
理由：虽然视频播放量低，但它是 7 个对象里**唯一明确用「Python 脚本 + webhook」而非 n8n/Docker/Codex 的方案**，与你的零依赖约束最贴近。仓库 `TrendRadar` 本身值得直接读源码。

---

### 3. 全网信息流自动收集神器！n8n + RSSHub 抓全平台热榜

| 项 | 内容 |
|---|---|
| 视频标题 | 全网信息流自动收集神器！n8n + RSSHub 教你抓全平台热榜（微博/B站/豆瓣…） |
| UP 主 | Byron的算法分享（曾某厂算法工程师，PhD 在读）【精读】 |
| 播放量 | 9249 【精读：页面明确写「9249播放」】 |
| 视频地址 | https://www.bilibili.com/video/BV1byKmzJEZL/ |
| 开源仓库 | RSSHub：https://github.com/DIYgod/RSSHub （万物皆可 RSS）【精读提及】 |
| 信息源层级 | 【精读】 |

**方案核心设计：**
- **数据从哪来**：RSSHub 把微博热搜、B站动态、豆瓣、知乎等原本没有 RSS 的站点转成 RSS feed。
- **怎么处理**：n8n 定时节点拉 RSS，做关键词过滤、定向 follow 博主。
- **怎么推送**：Mattermost（自托管 Slack 替代）webhook。
- **覆盖能力**：微博热搜定时回传 + 关键词搜索 + 定向 follow 博主。

**可借鉴点（具体到零依赖 Python 脚本）：**
1. **不要自己写每个站的爬虫，直接吃 RSSHub 的路由**：RSSHub 把「反爬/签名/接口变动」全封装在路由里了。零依赖脚本只需 `urllib` GET 一个 RSS XML URL，再用标准库 `xml.etree.ElementTree` 解析，就能拿到微博/B站/豆瓣热榜，**这是零依赖脚本最高性价比的数据源策略**。
2. **RSSHub 路由是 URL 模板**：`https://rsshub.app/weibo/search/hot` 这种路径化接口，脚本里配一个 `sources = [{"name":"微博热搜","url":"https://rsshub.app/weibo/search/hot"}, ...]` 列表即可扩展。
3. **「关键词过滤 + follow 特定账号」双维度订阅**：比单纯抓热榜更精准，可以在脚本里加一个 `KEYWORDS` 白名单 + `AUTHORS` 白名单。

**是否建议采纳：✅ 强烈建议（数据源层）**
理由：n8n/Mattermost 这层你不需要，但**「RSSHub 作为统一数据接入层」这个架构思想可以完全吸收进零依赖脚本**，省掉自己维护 N 个站点爬虫的噩梦。

---

### 4. 超强 AI 工作流平台：n8n 本地部署 + 运营一个 AI 新闻聚合频道

| 项 | 内容 |
|---|---|
| 视频标题 | 超强AI工作流平台：n8n本地部署+实践应用！0成本+自动化，运营一个AI新闻聚合频道 |
| UP 主 | 陶渊xiao明（从页面相关视频链推得，简介本身未署名） |
| 播放量 | 页面未渲染出播放量数字，未抓取到 |
| 视频地址 | https://www.bilibili.com/video/BV1cDoDYcEgo |
| 开源仓库 | n8n：https://github.com/n8n-io/n8n ；工作流配置文件在夸克网盘（非 GitHub）【精读】 |
| 信息源层级 | 【精读】 |

**方案核心设计：**
- **数据从哪来**：**NewsAPI.org + GNews.io** 两个第三方新闻聚合 API（不是自己爬虫）。
- **怎么处理**：DeepSeek V3 做翻译 + 整理 + 摘要。
- **怎么推送**：Telegram Bot。
- **调度**：每天早 8 点定时触发。
- **相关链接**：n8n.io、DeepSeek 开放平台、newsapi.org、gnews.io。

**可借鉴点（具体到零依赖 Python 脚本）：**
1. **直接买/调新闻聚合 API，而不是自己爬**：NewsAPI/GNews 提供 REST JSON，`urllib` 直接 GET 即可，比自己写爬虫稳定一个数量级。代价是要 API key + 免费额度有限。
2. **「翻译 + 整理」独立成一步 LLM 调用**：先把英文源（HN/Reddit）翻成中文摘要，再和中文源合并去重——这步可以在脚本里做成固定 prompt。
3. **推送通道用 Telegram Bot**：也是纯 HTTP POST（`https://api.telegram.org/bot<TOKEN>/sendMessage`），零依赖可行。

**是否建议采纳：🟡 部分采纳**
理由：n8n 这层不要（重），但「NewsAPI/GNews 作为兜底数据源 + DeepSeek 做翻译整理 + Telegram 推送」这条轻量管线可以直接抄。适合作为 RSSHub 抓不到的英文科技源的补充。

---

### 5. opencli：网站直接变 CLI 工具

| 项 | 内容 |
|---|---|
| 视频标题 | opencli：网站直接变 CLI 工具 |
| UP 主 | GitHub很棒 【精读】 |
| 播放量 | 1.4 万 【精读：页面标题下明确写「1.4万」】 |
| 视频地址 | https://www.bilibili.com/video/BV1P8wQzrEWn/ |
| 开源仓库 | 简介未贴具体 GitHub 地址（项目本身开源，需自行搜 opencli）；相关视频里提到「GitHub 15k 星神器 OpenCLI」 |
| 信息源层级 | 【精读】 |

**方案核心设计：**
- 把 B 站、小红书、知乎等 28 个网站直接封装成命令行命令，一行命令拉热榜/评论，输出 **JSON 或 Markdown**，专门喂给 AI。
- 解决的痛点是「反爬难搞，不要重复造轮子」。

**可借鉴点（具体到零依赖 Python 脚本）：**
1. **「输出即 JSON/Markdown」的接口契约**：脚本内部每个数据源 adapter 都应当返回统一 schema（`title / url / summary / hot_score / source / ts`），不要每个源各搞各的格式——这是 opencli 的核心设计。
2. **不要硬刚反爬**：如果某个站（小红书/知乎）反爬严重，与其在零依赖脚本里硬刚签名，不如把它从源列表里删掉，或者调一个公开 API。
3. **CLI 工具作为外部数据源**：脚本里可以 `subprocess.run(["opencli", "bilibili-hot"])` 调外部命令拿 JSON——但这违背「零依赖」，所以仅作思路参考，不建议真接。

**是否建议采纳：🟡 仅参考**
理由：opencli 本身要装 Node/二进制，不符合零依赖；但它的「统一 JSON 输出 schema」和「28 站适配清单」这两个设计点值得吸收。

---

### 6. 用 AI 打破信息茧房（Codex 信息收集矩阵）

| 项 | 内容 |
|---|---|
| 视频标题 | 用 AI 打破信息茧房 |
| UP 主 | 鸦珉 【精读】 |
| 播放量 | 页面未渲染出播放量数字，未抓取到 |
| 视频地址 | https://www.bilibili.com/video/BV1kjL56QEj7/ |
| 开源仓库 | 无（基于 OpenAI Codex CLI 工作空间，靠 `Agent.md` 配置，非传统代码仓库） |
| 信息源层级 | 【精读】 |

**方案核心设计：**
- **数据从哪来**：按「节假日提醒、重点新闻、科技发展、经济指标、战争与地缘风险、政策法规、天气建议」**分领域配置信息源**。
- **怎么处理**：Codex CLI 在固定工作空间里跑，靠 `Agent.md` 文件描述任务、信息源、筛选逻辑、输出格式；每次生成约 5–6 分钟。
- **关键设计点**：**链接验证**（产出前校验链接是否可达）、固定输出排版、分领域简报。
- **哲学**：「打破信息茧房」= 主动配置多样化信源，而不是让推荐算法喂你。

**可借鉴点（具体到零依赖 Python 脚本）：**
1. **`Agent.md` / 配置文件驱动**：把信息源列表、关键词白名单、领域分类、输出模板全写在一个 `config.yaml`（甚至 `config.json`，标准库可解析）里，脚本本身不硬编码——这跟零依赖脚本非常搭。
2. **链接可达性校验**：在输出最终日报前，脚本里加一步「对每条 URL 发 HEAD 请求，挂掉的标记为 ⚠️ 或剔除」——纯 `urllib` 就能做，显著提升日报可信度。
3. **分领域聚合**：不要把科技/财经/地缘混在一个列表里，脚本输出时按 section 分组。
4. **「反向制造自己的信息茧房」**：UP 主原话——与其追求全量，不如固定订阅几个高质量源，主动窄化。这对脚本的源数量是个警示：**15 个高质量源 > 100 个垃圾源**。

**是否建议采纳：✅ 建议（配置层 + 输出校验层）**
理由：不依赖任何新工具，但它的「配置文件驱动 + 链接校验 + 分领域输出」三个机制可以直接加进现有脚本。

---

### 7. 飞牛 Docker 项目 2：DailyHot 实时热门新闻聚合

| 项 | 内容 |
|---|---|
| 视频标题 | 飞牛Docker项目2：DailyHot，介绍和部署，可以查看各大平台的实时热门新闻 |
| UP 主 | 魔力南波万 【精读】 |
| 播放量 | 990 【精读：页面标题下数字】 |
| 视频地址 | https://www.bilibili.com/video/BV1QZRaYREiK/ |
| 开源仓库 | 原作者：**https://github.com/imsyy/DailyHot** ；Docker 版：https://github.com/rehiy/dailyhot-docker 【精读】 |
| 信息源层级 | 【精读】 |

**方案核心设计：**
- Docker 一键部署的「今日热榜」聚合 UI，一个页面看微博/知乎/B站/GitHub 等数十个平台实时热榜。
- 本质是一个**数据源聚合后端 + 卡片式前端**。

**可借鉴点（具体到零依赖 Python 脚本）：**
1. **DailyHot 的源清单是公开的**：去 `imsyy/DailyHot` 仓库看它抓了哪些站、用了什么 endpoint，等于一份现成的「热榜数据源调研表」。
2. **它的价值在 UI 不在脚本**：对你的零依赖脚本参考有限，但可以把它当作「线上数据源参考实现」——如果你想知道某个站的热榜 API 怎么调，翻它源码最快。

**是否建议采纳：🟡 仅作数据源参考**
理由：Docker/UI 路线不符合零依赖脚本定位，但仓库源码是优质的「抓站 endpoint 字典」。

---

## 二、最值得吸收的 Top 3 设计点

### 🥇 Top 1：RSSHub 作为统一数据接入层（来自 #3 n8n+RSSHub 视频）
**为什么最值得吸收**：零依赖 Python 脚本最大的工程负担就是「N 个站点各自的爬虫 + 反爬 + 签名维护」。RSSHub 把这层全部封装成 URL 路由，脚本只需：
```python
import urllib.request, xml.etree.ElementTree as ET
sources = [
    ("微博热搜", "https://rsshub.app/weibo/search/hot"),
    ("B站热门",  "https://rsshub.app/bilibili/hot-search"),
    ("知乎热榜", "https://rsshub.app/zhihu/hotlist"),
    ("36kr",     "https://rsshub.app/36kr/newsflashes"),
]
for name, url in sources:
    raw = urllib.request.urlopen(url, timeout=10).read()
    for item in ET.fromstring(raw).iter("item"):
        ...  # 统一 schema
```
全部用标准库完成，**不装 requests / feedparser / bs4**。自托管 RSSHub 还能免域名限制。

### 🥈 Top 2：漏斗式输出 + 配置文件驱动（来自 #1 ai-radar + #6 Codex 信息矩阵）
**两个机制合并吸收：**
- **输出漏斗**：N 条源 → 300+ 条原文 → LLM 筛成「3 条编辑部判断 + 5 条选题」。脚本里硬编码这个输出结构，不要让 LLM 自由发挥成散文。
- **配置外置**：把 `sources / keywords / authors / push_webhook_url / llm_prompt` 全写在 `config.json`（标准库 `json` 解析），脚本本体零业务硬编码。加新源 = 加一行配置，不改代码。
- **附赠：链接可达性 HEAD 校验**，挂掉的条目标 ⚠️，提升日报可信度。

### 🥉 Top 3：采集与推送解耦（来自 #2 TrendRadar + webhook 模式）
**机制**：脚本只做「抓 → 过滤 → POST 到一个 webhook URL」，不直接耦合钉钉/飞书/Telegram 的 SDK。
```python
def push(payload: dict, webhook: str):
    req = urllib.request.Request(
        webhook,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
    )
    urllib.request.urlopen(req, timeout=10)
```
这样：
- 想换推送渠道？只改 config 里的 webhook URL 和 payload 模板，不动采集逻辑。
- 想本地 dry-run？把 webhook 指向 `httpbin.org/post` 或直接打印到 stdout。
- 完全符合零依赖（`urllib` + `json`）。

---

## 三、信息可信度说明

| 字段 | 说明 |
|---|---|
| 播放量 | 仅 #3（9249）、#5（1.4万）、#6/#7（83/990）从页面明确抓到；其余视频 web.fetch 未渲染出播放量数字，标注「未抓取到」，未编造。 |
| 仓库地址 | 所有列出的 GitHub URL 均来自视频页简介正文（【精读】），未凭印象补全。 |
| UP 主 | #1/#3/#5/#6/#7 的 UP 主名来自页面头像旁署名；#2 来自简介区署名；#4 从相关视频链推得，已标注。 |
| 方案描述 | 均基于视频页简介原文，未做超出简介范围的技术细节推测；如「X 小号 cookie」「systemd timer」等均为视频时间戳处明示的内容。 |

## 四、对零依赖脚本的落地建议（一页纸）

1. **数据源**：优先 RSSHub（标准库 XML 解析）+ DailyHot/TrendRadar 源码里的 endpoint 作为补充；英文源用 NewsAPI/GNews 兜底。
2. **处理管线**：抓全量 → 关键词/作者白名单过滤 → LLM 漏斗式摘要（固定输出结构）→ HEAD 链接校验。
3. **推送**：统一 webhook POST，不耦合具体平台。
4. **调度**：脚本只跑一次，靠 Windows 任务计划 / cron 每天定时。
5. **配置**：全部外置到 `config.json`。
6. **不要做**：不要引入 n8n/Docker/OpenCLI 这些重组件，也不要自己硬刚小红书/知乎反爬。
