---
title: "科技信息聚合 / 每日雷达 / 热榜追踪 —— 开源项目设计调研报告"
---

# 科技信息聚合 / 每日雷达 / 热榜追踪 —— 开源项目设计调研报告

> **调研目的**：为一个已有的「零第三方依赖、纯标准库 Python 本地自动化脚本」（每日多源采集 → 热度归一化 → 跨源聚类 → 生成 HTML/MD/JSON 简报）寻找可借鉴的设计经验。
>
> **已调研过、不重复展开**：sansan0/TrendRadar、ourongxing/newsnow、n8n、RSSNext/Folo、RSSHub。
>
> **抓取时间**：2026-09-28（周一，UTC+8）。Stars 数来自 GitHub API / GitHub 仓库页直读，部分来自第三方追踪站交叉验证，已标注来源。
>
> **技术约束（贯穿全文的采纳判断依据）**：本项目是零第三方依赖、纯标准库 Python 本地脚本。重框架 / 数据库 / 服务端 / 重型 LLM 依赖的方案，一律标注为「需做成可选增强」或「标准库可实现的部分」。

---

## 一、项目总览对比表

| # | 项目 (owner/repo) | Stars | 语言 | 定位 | 与本项目相关度 | 采纳建议 |
|---|---|---|---|---|---|---|
| 1 | [imsyy/DailyHotApi](https://github.com/imsyy/DailyHotApi) | **4,063**（GitHub API 直读，2026-09-28） | TypeScript/Node | 热榜聚合 API，50+ 站点统一路由 | 高（数据源层） | 借鉴适配器模式，不引入 Node 运行时 |
| 2 | [dgtlmoon/changedetection.io](https://github.com/dgtlmoon/changedetection.io) | **~34,600**（仓库页直读，2026-09-28） | Python/Flask | 网页变更监控 + 通知 | 高（过滤/抽取/通知层） | 借鉴过滤表达式与条件触发；本体过重，不直接采用 |
| 3 | [Thysrael/Horizon](https://github.com/Thysrael/Horizon) | **~9,500**（HelloGitHub 9.5k / repositorystats 9,498，2026-09-27） | Python | AI 驱动新闻雷达，中英双语日报 | 极高（整体流水线范式） | 借鉴 profile 路由 + 平衡配额；其 LLM 依赖做可选增强 |
| 4 | [glanceapp/glance](https://github.com/glanceapp/glance) | **~37,000**（gstars.dev 37,220 / ossean 37,160，2026-09-22~26） | Go | 自托管聚合 dashboard（RSS/Reddit/HN/…） | 中高（缓存与部件化） | 借鉴 per-widget 缓存 TTL 与 pull-on-load 模型 |
| 5 | [jackwener/kabi-digest](https://github.com/jackwener/kabi-digest) | 小型个人项目（17 commits，star 数 <100） | TypeScript/Bun | V2EX+HN 聚合日报生成器 | **极高（评分/去重/两阶段流水线）** | **最值得逐行借鉴**——其评分公式与去重机制纯算法，可直接移植到 stdlib Python |
| 6 | [binwiederhier/ntfy](https://github.com/binwiederhier/ntfy) | **25,390**（GitHub API 直读，2026-09-28） | Go | HTTP 推送 pub-sub 服务 | 高（推送通道） | 推送端只需 `urllib.request` 一行 POST，零依赖可实现 |
| 7 | [caronc/apprise](https://github.com/caronc/apprise) | **~17,400**（仓库页直读，2026-09-28） | Python | 统一通知库（90+ 通道 URL-scheme） | 中高（通知抽象思想） | 不引入库；借鉴其 URL-scheme 配置 + tag 路由思想，用 stdlib 重写薄封装 |
| 8 | [tophubs/TopList](https://github.com/tophubs/TopList) | **~4,700**（HelloGitHub 收录页，2026-09） | Go | 多协程热榜聚合站 + API | 中（两级 API 契约） | 借鉴其「类型列表 → 类型详情」两级接口划分；本体 Go+DB 不采用 |

---

## 二、逐项目详解

### 1. imsyy/DailyHotApi —— 热榜聚合 API 的适配器范本

- **Stars**：4,063（GitHub API `stargazers_count` 直读，2026-09-28）
- **地址**：https://github.com/imsyy/DailyHotApi
- **协议**：MIT；语言 TypeScript/Node；可 Vercel/Docker/pm2 部署。

**核心设计**
- **统一路由 = 一个数据源 = 一个独立 scraper 模块**：`/bilibili`、`/weibo`、`/zhihu`、`/36kr`、`/v2ex`……50+ 站点各自一个路由文件，路由目录即数据源注册表。README 里就是一张「站点 / 类别 / 调用名称 / 状态」表。
- **双输出模式**：同一数据源既可吐 JSON，也可吐 RSS（`?rss=1` 之类）。
- **缓存层**：默认 60 分钟全量缓存，避免频繁请求官方数据；配置可改。
- **分级抓取**：大部分源走 HTTP 接口/HTML 解析；少数 JS 渲染页需 Puppeteer（显式标注哪些接口依赖它）。
- **极简部署**：支持 Vercel/Railway/Zeabur 一键 serverless，也可 npm 包内嵌。

**可借鉴点**
- **「一个源一个适配器」的目录约定**：你的脚本可以按 `sources/weibo.py`、`sources/zhihu.py`、`sources/hackernews.py` 组织，每个适配器暴露统一接口 `fetch() -> list[dict]`，新增源 = 新增一个文件 + 在注册表加一行。这对零依赖脚本尤其友好——不需要插件框架，一张源清单表就够。
- **RSS/JSON 双输出**：简报生成时同一份归一化数据可同时输出 `.json`（机器读）和 `.rss`（可被任何 RSS 阅读器订阅），stdlib 的 `xml.etree.ElementTree` 即可生成 RSS。
- **缓存层**：在 stdlib 里用本地 JSON 文件 + mtime 判断做 60 分钟缓存，避免每次跑都打源。
- **状态表自描述**：README 维护一张「源 / 类别 / 调用名 / 状态」表——你的脚本可以在生成 HTML 简报时顺手渲染一张「本次各源是否成功」的状态面板。

**是否采纳**：✅ 借鉴架构思想。**不引入 Node 运行时**。其 50+ 源的真实接口路径（`/zhihu`、`/36kr`、`/v2ex` 等）是很好的「源清单」参考，但每个源的具体抓取逻辑需自行用 stdlib `urllib` 重写。

---

### 2. dgtlmoon/changedetection.io —— 网页变更监控的过滤器/通知设计

- **Stars**：~34,600（仓库页直读 "Star 34.6k"，2026-09-28）；Fork 2.1k
- **地址**：https://github.com/dgtlmoon/changedetection.io
- **协议**：Apache-2.0；Python/Flask。

**核心设计**
- **「监控项（watch）」为一等公民**：每个被监控 URL 独立配置：抓取方式（纯 HTTP vs Playwright 渲染）、过滤器、调度、通知。
- **抽取层是核心抽象**：支持 CSS Selector、XPath 1.0、JSONPath、`jq` 表达式、正则（`re:test/match/replace`）。即「先定位再抽取」，而不是整页 diff。
- **Diff 引擎**：按 word/line/char 级对比，只报差异。
- **条件触发**：只有当页面包含/不包含某关键词、或某数值越过阈值（如价格 < $50）才告警。
- **AI 规则与 AI 摘要**（2026 年新增）：用自然语言写过滤意图，LLM 判定每次 diff 是否相关；并把 diff 翻译成「价格从 $89.99 降到 $67.00」这种人话。
- **调度**：按时区、工作日/周末、业务小时窗口限制检查频率。
- **通知层**：基于 apprise 库，一封通知可走 Discord/Email/Slack/Telegram/Webhook 等 90+ 通道；通知内容用 Jinja2 模板。

**可借鉴点**
- **「抽取表达式」而非整页抓**：你的脚本在抓一个列表页时，与其抓整页 HTML 再正则乱切，不如为每个源写一个「CSS/XPath 式」的定位规则（哪怕在 stdlib 里用正则 + `html.parser` 实现）。这正是你「跨源聚类」前数据归一化的关键一步。
- **条件触发 / 关键词白名单黑名单**：归一化后，用「必须包含 X / 必须不包含 Y」做硬过滤，能显著降低聚类噪声。
- **AI 摘要作为可选增强**：changedetection.io 的做法是「先 diff 再让 LLM 判相关 + 写人话」，且强调 LLM 可本地（Ollama/vLLM）。你的脚本可以把「调 LLM 摘要」做成一个 `--ai` 开关，默认纯规则运行。
- **通知模板化**：通知标题/正文用模板渲染，而不是硬编码字符串。

**是否采纳**：⚠️ **选择性借鉴**。本体是 Flask+Playwright+DB 的重型服务，不适合你的零依赖脚本。但「抽取表达式 → 条件过滤 → diff → 模板通知」这条管道是教科书级的，可逐环节用 stdlib 实现。

---

### 3. Thysrael/Horizon —— 与你目标最同构的 AI 新闻雷达

- **Stars**：~9,500（HelloGitHub 收录页 9.5k；repositorystats 9,498，2026-09-27）；Fork ~1k
- **地址**：https://github.com/Thysrael/Horizon
- **协议**：MIT；Python 3.10+（用 uv 管理依赖，含 trafilatura 全文抽取）。

**核心设计**
- **多源接入**：Hacker News、RSS/Atom、Reddit、Telegram、Twitter/X（Apify）、GitHub releases/events、OpenBB 金融新闻、OSS Insight、GDELT、Google News。
- **Profile（编辑画像）驱动的流水线**——这是它最有特色的设计：
  - 一个 profile = 一套可复用的编辑规则：**哪些内容算合格、保留阈值、输出格式（摘要 / 背景 / 方案 / 结论）**。
  - 内置 `tech-news`（要事件+影响+社区讨论）、`tech-blog`（要背景+方案+实操 takeaway）、`ai-creator`（要摘要+可蹭的角度）。
  - 每条 item 路由到一个 profile（显式指定，或让 AI 自动匹配）；**分析、过滤、去重发生在 enrich 之前**，选中后再按 profile 分组生成简报。
- **平衡配额（balanced digest）**：`digest.max_items=20` + `category_groups` 每组上限（如 ai 组最多 5 条、finance 组最多 5 条），防止一个热点话题霸屏整份简报。组配额在 profile 过滤之后、enrich 之前施加。
- **配置即 JSON，支持 `${ENV_VAR}` 插值**；有交互式 wizard 生成 `config.json`。
- **交付通道**：GitHub Pages（把 MD 塞进 `docs/`）、邮件（SMTP/IMAP 处理订阅）、Webhook（飞书/钉钉/Slack/Discord/自定义）、微信（iLink Bot）。
- **MCP Server**：可让 AI agent 分阶段调用流水线。

**可借鉴点**
- **Profile 思想直接可用**：你可以在 stdlib 里用一个 `profiles/` 目录（每个 profile 一个 JSON/YAML-ish 配置：关键词权重、阈值、要哪些字段），而不是把所有评分逻辑写死在代码里。新增一类内容 = 新增一个 profile 文件。
- **平衡配额算法**：`max_items` + 每组 `limit`，在聚类后、渲染前执行——这是解决「一个热搜霸屏」的标准做法，纯 stdlib 几行代码即可。
- **「先过滤去重，再 enrich」的顺序**：不要对所有抓回来的 item 都做全文抽取/AI 摘要（贵且慢），先用便宜的规则（分数阈值 + 跨源去重）砍到 top N，再只对这 N 条做重活。
- **`${ENV_VAR}` 配置插值**：stdlib 里用一个简单正则替换就能实现，API key 不落地。
- **人机双输出**：`data/summaries/` 存人读简报，同时保留结构化上下文。

**是否采纳**：✅ **强烈借鉴整体流水线范式**。但它依赖 LLM API、trafilatura、Playwright、uv——在你的零依赖脚本里，**把「AI 评分/摘要」做成可选 `--ai` 开关，默认走规则评分**。profile 路由、平衡配额、env 插值、Pages 发布这几件事 stdlib 完全能做。

---

### 4. glanceapp/glance —— 拉取式 dashboard 的缓存模型

- **Stars**：~37,000（gstars.dev 37,220 on 2026-09-26；ossean 37,160 on 2026-09-22；repositorystats 36,917）；Fork ~1.3k
- **地址**：https://github.com/glanceapp/glance
- **协议**：AGPL-3.0；Go，单文件 <20MB 二进制。

**核心设计**
- **Pull-on-load，无后台轮询**：页面打开时才拉数据，然后按 widget 配置的 `cache: 12h` 缓存；不主动后台刷。
- **Widget = 数据源部件**：rss / hacker-news / reddit / releases（GitHub repo 列表）/ markets / weather / youtube / twitch / docker stats。每个 widget 独立配 `limit`、`cache`、`collapse-after`。
- **YAML 布局**：`pages → columns(small/medium/full) → widgets`，多 tab 多页。
- **自定义 widget**：`iframe` / `html`（静态）/ `extension`（抓一个 URL 的 HTML 片段）/ `custom-api`（抓 JSON + 自定义 HTML 渲染）。

**可借鉴点**
- **per-source 缓存 TTL**：不同源更新频率不同（GitHub releases 一天一次够了，HN 可以 30 分钟）。在源配置里加一个 `cache_ttl` 字段，stdlib 用 `os.path.getmtime` 判断是否过期。
- **「打开即拉、过期再拉」模型** vs 你现在的「定时跑一次」：你是离线简报脚本，定时跑正合适；但缓存 TTL 的思想可以用来避免同一次运行里重复打同一个源。
- **widget/部件抽象**：你的 HTML 简报可以按「板块」渲染（HN 板块、微博板块、arXiv 板块），每个板块独立配条数上限和折叠阈值（`collapse-after: 3`）。

**是否采纳**：⚠️ 借鉴缓存与板块化思想。本体是 Go 服务端，不采用；但其 YAML 式 widget 配置结构很适合作为你脚本「源 + 板块」配置文件的模板。

---

### 5. jackwener/kabi-digest —— 小而美，评分/去重/两阶段流水线的教科书

- **Stars**：小型个人项目（17 commits，star 数很低），但设计密度极高。
- **地址**：https://github.com/jackwener/kabi-digest
- **协议**：MIT；TypeScript/Bun。

**核心设计（重点）**
- **时间衰减评分公式**（直接照搬 HN 排名）：
  ```
  score = (engagement - 1) / (hours + 2) ^ 1.8
  ```
  - HN：`engagement` = points（投票数）；V2EX：`engagement` = replies（回复数）；`hours` = 距发布小时数。
  - 新且热的得分高，老内容自然衰减——**这正是你「热度归一化」环节可以直接用的公式**。
- **Collect / Generate 两阶段**：
  - 白天多次 `collect`：只 fetch + 累积原始数据，不调 AI。
  - 晚上一次 `generate`：评分、去重、补全文、出简报。
  - 这样把「采集频率」和「出报时机」解耦。
- **数据累积 upsert，不覆盖**：每次 generate 把新抓的数据与当天已有数据**按 ID 合并**，item 的 replies/points 自动更新为最新值——候选池越滚越大。
- **发布去重**：`skip_hours=72` + `data/published/index.json`（记录 source+id）。过去 N 小时已发过的 item，下次直接跳过。
- **双输出模式**：
  - `ai_digest`：人读 MD（含 YAML frontmatter：title/date/profile/summary），可直接喂 Hugo/Astro。
  - `openclaw`：无 AI，直接吐 top_n JSON（含 rank/score/content）给下游 LLM。
- **正文补全策略**：HN 外链用 Jina AI Reader（免费、无需 key）抓全文；V2EX 补全 replies + supplements。采集阶段只抓 topic 元信息，generate 阶段才补 top-N 全文——**省请求**。
- **并发 + 超时 graceful fallback**：HN 8 并发、8s 超时；正文抓取 3 并发，失败就 fallback 不崩。

**可借鉴点（几乎每条都能零依赖移植）**
- ✅ **时间衰减评分公式**：直接写进你的「热度归一化」模块。不同源的 engagement 指标不同（HN=points、微博=热搜值、arXiv=comments），但统一套 `(eng-1)/(age+2)^1.8` 就能跨源归一化到同一量纲。
- ✅ **collect/generate 两阶段**：你的脚本可以拆成「采集器」（可多次跑，往 JSON 池追加）和「生成器」（读池 → 评分聚类 → 出报）。
- ✅ **upsert 累积 + published/index.json 去重**：stdlib 读写 JSON 完全够。解决「昨天报过的今天又冒头」的重复问题。
- ✅ **先便宜筛选、后昂贵 enrich**：只对 top-N 做全文/AI，不对全量做。
- ✅ **人读 MD + 机读 JSON 双输出**：正好对应你已有的 HTML/MD/JSON 三输出思路。
- ✅ **YAML frontmatter**：MD 报告头加 frontmatter，便于后续静态站消费。

**是否采纳**：✅✅ **本报告最值得逐行借鉴的项目**。它小、纯算法、无数据库、无重依赖，与你的零依赖脚本定位几乎一致。建议把它的 `scorer.ts`、`storage.ts`、`published/index.json` 三个机制直接翻译成 Python stdlib。

---

### 6. binwiederhier/ntfy —— 一行 HTTP POST 推送到手机

- **Stars**：25,390（GitHub API `stargazers_count` 直读，2026-09-28）；Fork 997
- **地址**：https://github.com/binwiederhier/ntfy
- **协议**：Apache-2.0 / GPLv2；Go。

**核心设计**
- **Topic-based pub-sub**：`curl -d "每日简报已生成" ntfy.sh/your-topic`，手机装 ntfy app 订阅 `your-topic` 即收到。
- **无需注册、无需 SDK、无需 API key**（用公共 ntfy.sh）；也可自托管。
- **消息支持标题、优先级、标签、附件、Action 按钮**。

**可借鉴点**
- **推送通道的最简实现**：在你的零依赖 Python 脚本里，推送 ntfy 就是一行：
  ```python
  urllib.request.urlopen("https://ntfy.sh/mytopic", data=b"今日简报已生成")
  ```
  零第三方库。比 Server酱/PushPlus 更省心（不需要注册拿 SendKey，topic 名自己取）。
- **同理可一行 POST 到 Bark**（`https://api.day.app/<key>/<title>/<body>`）、**飞书/钉钉/Slack webhook**（一个 JSON POST）。

**是否采纳**：✅ **强烈采纳为默认推送通道**。ntfy / Bark / 各类 webhook 都是「一个 HTTP POST」，stdlib `urllib.request` + `json` 即可，不引入 requests。建议在脚本里做一个极简的 `notify(channel, title, body)` 分发函数，channel 配置在 JSON 里。

---

### 7. caronc/apprise —— 通知抽象的思想（不引库，借设计）

- **Stars**：~17,400（仓库页直读 "Star 17.4k"，2026-09-28）
- **地址**：https://github.com/caronc/apprise
- **协议**：BSD；Python。

**核心设计**
- **一个库支持 90+ 通知通道，通道用 URL-scheme 配置**：`tgram://bot_token/chat_id`、`mailto://user:pass@host`、`slack://x/y/z/#channel`、`ntfy://topic`、`wechat://...`、`serverchan://...`。
- **Tag 路由**：配置里给每个通道打 tag（如 `family`、`devops`），发送时用 `-g devops` 选择；支持 OR（多 `-g`）/ AND（逗号）逻辑。
- **优先级升级链**：`1:alerts` 前缀 = 优先级 1，先试高优先级通道，全失败才降级到下一级；失败可重试 N 次。

**可借鉴点**
- **「通道即配置字符串」而非硬编码**：你的脚本可以在 `config.json` 里写 `"notify": ["ntfy://mytopic", "bark://abc123/标题/正文", "webhook://https://..."]`，运行时解析 scheme 分发。比 if-else 串一堆推送函数优雅。
- **失败降级链**：主通道推送失败 → 自动 fallback 到备用通道（如 ntfy 挂了就发邮件）。stdlib 里 try/except 即可。

**是否采纳**：⚠️ **只借思想，不引库**。apprise 本身是个不小的 Python 包，违背零依赖原则。但其「URL-scheme 通道 + tag 路由 + 优先级降级」三层设计，可以用 ~100 行 stdlib 代码实现一个迷你版。

---

### 8. tophubs/TopList —— 两级 API 契约参考

- **Stars**：~4,700（HelloGitHub 收录页标注，2026-09）；Go。
- **地址**：https://github.com/tophubs/TopList

**核心设计**
- Cron 定时跑爬虫 `GetHot.go` 抓数据入库，`Server.go` 读库提供网页 + API。
- API 分两级：`GetAllType`（返回所有热榜类型列表：id + 名称）→ `GetAllInfoGzip?id=N&page=0`（取某类型详情）。

**可借鉴点**：其两级接口划分（「有哪些榜」→「某榜内容」）对源注册表设计有参考价值，但本体 Go+DB 架构与你无关。**可借鉴程度低**，列此作为 tophub 类聚合站的代表，证明这类项目的成熟度。

**是否采纳**：❌ 不采纳。仅作背景参考。

---

## 三、已调研项目的针对性补充（不重复展开）

| 项目 | 对你这个零依赖脚本的补充启示 |
|---|---|
| **sansan0/TrendRadar**（~47k stars） | 它是「关键词订阅 + 多平台爬虫 + 多通道推送」的成熟产品。你可对标的是它的**推送通道列表**（企业微信/飞书/钉钉/TG/邮件），但它依赖 Python 生态重依赖。你应只取「通道清单」，用 stdlib 各自实现 HTTP POST。 |
| **ourongxing/newsnow** | 其前端展示层（多 tab 热榜并排）可作为你 HTML 简报的布局参考；后端 Bun/TS 服务端架构不适合你。 |
| **RSSNext/Folo** | 产品形态（个人 feed 聚合阅读器）比你重得多。可借鉴的是「源 = RSS/网页/Twitter 等统一 item 模型」的数据归一化思路。 |
| **RSSHub** | 已是事实标准的「任何网站 → RSS」路由库。你的脚本若想扩源，不必自己写爬虫，可以**直接消费 RSSHub 实例吐出的 RSS**，stdlib `xml.etree.ElementTree` 解析。这是扩源性价比最高的路径。 |
| **n8n** | 工作流编排过重，不适合本地零依赖脚本。但「采集 → 转换 → 过滤 → 输出」的节点化思维，与 collect/generate 两阶段一致。 |

---

## 四、最值得吸收的 Top 5 设计点（按优先级）

### 🥇 Top 1：时间衰减归一化评分公式（来自 kabi-digest）
```
score = (engagement - 1) / (hours_since_publish + 2) ^ 1.8
```
**为什么排第一**：这正是你「热度归一化」环节的核心痛点——不同源的 engagement 量纲天差地别（HN 是 upvotes、微博是热搜位次、arXiv 是 comments）。用同一个时间衰减公式归一化后，才能公平地跨源排序和聚类。纯数学，stdlib 一行 `math` 搞定。

### 🥈 Top 2：Collect / Generate 两阶段 + upsert 累积 + published 去重（来自 kabi-digest）
- 采集器可一天跑多次，往本地 JSON 池 upsert 累积；生成器定时跑一次，读池评分出报。
- `data/published/index.json` 记录已发 item（source+id），`skip_hours=72` 内不重复报。
- **解决**：重复推送、当天多次跑覆盖数据、新旧热度混在一起。全 stdlib JSON 文件可实现。

### 🥉 Top 3：Profile 驱动 + 平衡配额（来自 Horizon）
- 用配置文件（而非代码）定义「这类内容要什么、阈值多少、输出哪些字段」。
- 聚类后、渲染前施加 `max_items` + 每类 `limit`，防止一个热点霸屏整份简报。
- **零依赖可做**：一个 `profiles/*.json` + 几行配额裁剪逻辑。

### 4️⃣ Top 4：「先便宜筛选，后昂贵 enrich」的流水线顺序（来自 Horizon + changedetection.io + kabi-digest 共识）
- 先全量抓 → 规则评分 + 跨源聚类去重 → 砍到 top N → **只对 top N** 做全文抽取 / AI 摘要 / 背景补充。
- **理由**：全文抽取和 LLM 调用是最贵最慢的环节；对全量做会让脚本又慢又贵。这一顺序调整用 stdlib 就能落地，不需要任何新依赖。

### 5️⃣ Top 5：推送通道的「URL-scheme 配置 + 一行 HTTP POST」抽象（来自 ntfy + apprise 思想）
- 在 config 里写 `"notify": ["ntfy://mytopic", "bark://key/标题", "webhook://https://..."]`。
- 运行时按 scheme 分发，每个通道就是 `urllib.request` 一个 POST。
- 主通道失败 fallback 到备用。
- **理由**：ntfy/Bark/飞书webhook/Server酱 本质都是一个 HTTP 请求，stdlib 完全够，不需要 apprise 这种重库。这是零依赖脚本最优雅的推送方案。

---

## 五、落地建议（针对你的零依赖 Python 脚本）

| 模块 | 借鉴来源 | 实现方式（stdlib） |
|---|---|---|
| 数据源适配器 | DailyHotApi | `sources/` 目录，每个源一个 `fetch() -> list[dict]`，统一 item schema（title/url/source/engagement/published_at） |
| 扩源捷径 | RSSHub | 直接消费 RSSHub 路由吐的 RSS，用 `xml.etree.ElementTree` 解析 |
| 热度归一化 | kabi-digest | `(eng-1)/(age+2)^1.8`，`math` 模块 |
| 采集/出报解耦 | kabi-digest | `collect.py`（upsert 到 `data/pool.json`）+ `generate.py`（读池出报） |
| 跨次去重 | kabi-digest | `data/published/index.json` + `skip_hours` |
| 内容分类/配额 | Horizon | `profiles/*.json` + 聚类后按类裁剪 |
| 全文 enrich | kabi-digest / Horizon | 只对 top-N 做；可选 Jina Reader（免费无 key，一个 HTTP GET） |
| AI 摘要 | Horizon / changedetection.io | `--ai` 可选开关，默认关闭；走 OpenAI 兼容 HTTP API |
| 推送 | ntfy / apprise 思想 | `notify()` 按 URL-scheme 分发，urllib POST，失败降级 |
| 缓存 | DailyHotApi / glance | 每源 `cache_ttl`，文件 mtime 判断 |
| 输出 | kabi-digest / Horizon | MD（带 frontmatter）+ JSON + HTML 三轨 |

---

## 六、数据来源与抓取说明

- **Stars 直读**：`imsyy/DailyHotApi`（GitHub API `stargazers_count=4063`）、`binwiederhier/ntfy`（`stargazers_count=25390`）、`dgtlmoon/changedetection.io`（仓库页 "Star 34.6k"）、`caronc/apprise`（仓库页 "Star 17.4k"）。
- **Stars 交叉验证**：`Thysrael/Horizon`（HelloGitHub 9.5k / repositorystats 9,498 / mcpskills 9.3k，取 ~9.5k）；`glanceapp/glance`（gstars.dev 37,220 / ossean 37,160 / repositorystats 36,917，取 ~37k）；`tophubs/TopList`（HelloGitHub 收录页 ~4.7k）。
- **kabi-digest** 为小型个人项目，star 数低但设计密度高，入选理由是其评分/去重机制可零依赖移植。
- 所有 README 关键机制均通过 `web.fetch` 精读 GitHub 仓库页获取，未编造功能或数据。
- 抓取时间：2026-09-28（UTC+8）。
