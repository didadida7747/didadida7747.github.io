---
title: "03 Gemini 与 Grok"
---

# 03 Gemini 与 Grok

> **重要更正（2026-10-09 主会话核实）**：本文件下方“第三方来源”部分提到的 Gemini 2.5 / 3.5 Flash 价格来自聚合站，**已过时且未核实，不得引用**。官方定价页显示 Gemini 当前在售的最新型号是 **Gemini 3.8 Flash**，旗舰 Pro 档为 **Gemini 3.1 Pro 预览版**，2.5 系列已属旧代。Grok 部分仍全部未核实。

## 〇、官方核实：Gemini 开发者 API（我用浏览器直接读取 https://ai.google.dev/gemini-api/docs/pricing，日期 2026-10-09）

### 0.1 页面列出的型号（原文名称）
- 文本主力：Gemini 3.8 Flash、3.7 Flash、3.6 Flash、3.5 Flash、3.5 Flash-Lite、3.1 Flash-Lite、3.1 Pro 预览版（`gemini-3.1-pro-preview`）、3 Flash 预览版
- 实时 / 语音：Gemini 3.8 Live（含扩展思考）、3.1 Flash Live 预览版、3.5 实时翻译、3.5 Transcribe(Live)、3.8 Flash TTS 等
- 图像：Nano Banana 2.1、Nano Banana 2（3.1 Flash Image）、Nano Banana Pro（3 Pro Image）
- 其他：Gemini Omni Flash、Veo 3.1（视频）、Lyria 3.5 / 3（音乐）、Gemini Embedding 2、Gemini Robotics ER 2、Gemma 4（开源）
- 旧代仍在页面：Gemini 2.5 Pro / Flash / Flash-Lite 等

### 0.2 Gemini 3.8 Flash 价格（美元 / 百万 token，付费层级）
| 档位 | 输入 | 输出（含思考 token） | 上下文缓存 | 缓存存储 |
|---|---|---|---|---|
| 标准 | 2026-12-31 前 0.75；2027-01-01 起 1.50 | 3.75；2027 起 7.50 | 0.075；2027 起 0.15 | 0.50 /百万token/小时；2027 起 1.00 |
| 批量 | 0.375；2027 起 0.75 | 1.875；2027 起 3.75 | 0.0375；2027 起 0.075 | 同上 |
| Flex | 与批量相同（0.375 / 1.875） | | | |
| 优先级 | 1.35；2027 起 2.70 | 6.75；2027 起 13.50 | 0.135；2027 起 0.27 | 同上 |

要点：
- **当前价格是促销价，2027-01-01 起整体翻倍**。做成本预估时必须按 2027 年价格算。
- 批量、Flex 为标准价的 5 折；优先级约为标准价的 1.8 倍。
- 标准档有免费层级（数据会用于改进 Google 产品）；付费层级不用于改进。
- 页面说明本表是“标准 / 批量 / Flex / 优先级”四个标签页，我按标签顺序与表格顺序对应（表格顺序与标签顺序一致，未单独逐个点击验证）。

### 0.3 工具价格（所有 Gemini 模型通用说明）
- Google 搜索接地：Gemini 3 系列每月 5,000 次免费（所有 3.x 共享），超出每千次 $14；Gemini 2.5 系列超出每千条接地提示 $35。
- Google 地图接地：Gemini 3 每月 5,000 条免费，超出每千次 $14；2.5 系列超出每千条 $25。
- 代码执行：免费，只按所选模型的 token 计费。
- 网址上下文：免费，按输入 token 计费。
- 文件搜索：嵌入 $0.15 / 百万 token；检索到的文档 token 按模型价计费。
- 计算机使用：按常规 token 计费。

### 0.4 仍未核实
- 各 Gemini 模型的上下文窗口、最大输出、thinking 配置（需看 /models 页，本次未读）
- Gemini 3.1 Pro 预览版、3.5/3.6/3.7 Flash、Flash-Lite 的各自价格（本次读取时选择器抓到了同一页面容器，**无法区分**，不采信）
- Veo、Nano Banana、Embedding、Gemma 4 的价格与规格
- 长上下文是否分段计价
- 能力评价、基准、社区口碑（未做）

---

# 以下为子调研员原稿（第三方聚合站来源，全部未核实，Gemini 价格已过时）

# Google Gemini 与 xAI Grok 模型调研（原始资料）

- 查证日期：2026-10-09
- 状态：**不完整**。官方文档站点在本次调研环境中无法访问，以下数据均来自第三方聚合网站，全部标注为"未核实"，**不可直接用于预算或对外引用**。

## 0. 访问记录（为什么官方数据缺失）

| 目标页面 | 尝试方式 | 结果 |
|---|---|---|
| https://ai.google.dev/gemini-api/docs/pricing | WebFetch（2 次）、open-websearch fetchWebContent | 失败，无内容返回 |
| https://ai.google.dev/gemini-api/docs/models | WebFetch | 失败 |
| https://docs.x.ai/docs/models | WebFetch、open-websearch fetchWebContent | 失败 |
| https://docs.x.ai/developers/models | curl 直连 | HTTP 000（连接失败） |
| https://ai.google.dev/gemini-api/docs/pricing | curl 直连 | HTTP 000（连接失败） |

建议：在可访问官方站点的网络环境下重新抓取，或由用户手动打开上述页面后把定价表粘贴给调研员。

## A. Google Gemini（未核实，仅来自第三方）

### A1. 价格线索（美元 / 百万 token，未核实）

| 模型 | 输入 | 输出 | 备注 | 来源（第三方） |
|---|---|---|---|---|
| Gemini 2.5 Pro | $1.25（≤200k）/ $2.50（>200k） | $10.00（≤200k）/ $15.00（>200k） | 分段计价 | https://developer.puter.com/tutorials/gemini-api-pricing/ 等聚合页 |
| Gemini 2.5 Flash | $0.30 | $2.50 | 有聚合站称 Google 已示意弃用，未核实 | 同上 |
| Gemini 2.5 Flash-Lite | $0.10 | $0.40 | Batch 约 $0.05 / $0.20；缓存输入约 $0.01 | https://www.metacto.com/blogs/the-true-cost-of-google-gemini-a-guide-to-api-pricing-and-integration |
| Gemini 3.1 Pro | $2.00（≤200k） | $12.00（≤200k） | 未核实 | https://www.metacto.com/blogs/the-true-cost-of-google-gemini-a-guide-to-api-pricing-and-integration |
| Gemini 3.5 Flash | $1.50 | $9.00 | 称 2026-05-19 I/O 发布，1M 上下文，未核实 | 同上 |
| Gemini 3.1 Flash-Lite | $0.25 | $1.50 | 未核实 | https://www.morphllm.com/gemini-api-pricing |
| Gemini 3.8 Flash（促销） | $0.75 | $3.75 | 称至 2026-12-31 促销，之后翻倍，未核实；来源之间型号说法冲突（3.6/3.7/3.8） | https://www.aifreeapi.com/en/posts/gemini-api-pricing-2026 |
| Vertex AI priority 价格 | 2.5 Flash-Lite priority 输入约 $0.18 | — | 未核实 | https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing |

### A2. 免费额度
- 线索：一个来源称自 2026-04-01 起 Pro 模型不再提供免费层，仅 Flash / Flash-Lite 保留免费访问；另一来源仍称 2.5 Pro 有免费额度且有速率限制。**两者冲突，未核实。**

### A3. 未查证的字段（全部未核实）
以下字段在本次调研中**没有拿到官方数据**，需补查：
- 各模型的上下文窗口（含 1M / 2M）与最大输出 token
- 发布日期（除 3.5 Flash 的 I/O 日期线索外）
- thinking budget 规则
- 音频 / 图片 / 视频输入的分项价格
- Grounding with Google Search 计费规则与免费额度
- Batch 折扣的完整规则
- Context caching 的存储费与 TTL 规则
- Nano Banana 图像系列、Veo 视频、Imagen、Embedding、Live API、Gemma 开源模型的全部型号与价格
- AI Studio 与 Vertex AI 的功能差异（仅见 Vertex 有 priority 等不同定价档位，其余未核实）

## B. xAI Grok（未核实，仅来自第三方）

| 模型 | 上下文 | 输入 | 输出 | 缓存输入 | 来源（第三方） |
|---|---|---|---|---|---|
| Grok 4.6（旗舰线索） | 500K（一说） | $2（≤200k）/ $4（>200k，全部 token 按高档） | $6 / $12 | 未核实 | https://kingy.ai/blog/grok-4-6-price-benchmarks-api-cursor-context-window/ |
| Grok 4.3 / 4.20 | 1M | $1.25 | $2.50 | $0.20 | https://www.grizzlypeaksoftware.com/articles/p/grok-api-pricing-explained-every-model-every-cost-and-how-it-compares-2026-f1p7dvdu （见来源冲突） |
| Grok 4.1 Fast | 2M（一说） | $0.20 | $0.50 | 未核实 | https://pricepertoken.com/pricing-page/model/xai-grok-4-fast |
| Grok Build 0.1（编程向） | 256K | $1 | $2 | 未核实 | https://www.requesty.ai/models/xai/grok-build-0.1 |

- 来源冲突：有来源称 Grok 4.7 / 4.6 / 4.5 为 500K 上下文，Grok 4.7 在其他来源中未出现，**未核实**；Grok 4.5 缓存输入价有 $0.20 与 $0.30 两种说法。
- 旧文章称 Grok 4 为 $3 / $15，早于当前线索，可能已过时。
- 实时 X 数据、内置搜索工具的计费方式、Batch / 缓存规则：**未核实，未查到。**

## C. 能力边界、社区口碑、横向对比
- **本次未完成。** 未检索到 GitHub / YouTube / B站 / 知乎 / Reddit 的实测评价，也未做与 GPT / Claude / 国产模型的对比。
- 需补查的维度：编程与长上下文实测、多模态（视频 / 音频原生输入）稳定性、速率限制与稳定性、价格性价比对比表。

## 未核实项清单（汇总）
1. 全部 Gemini 与 Grok 价格数据（仅第三方聚合，官方页面未能访问）
2. Gemini 当前在售模型的完整列表与"最新 Flash"具体型号（3.5 / 3.6 / 3.7 / 3.8 说法冲突）
3. Gemini 2.5 Pro 免费层是否已于 2026-04-01 取消（来源冲突）
4. Gemini 2.5 Flash 是否已被弃用及时间
5. 所有模型的上下文窗口、最大输出、thinking budget
6. 音频 / 图片 / 视频分项价格、Grounding 计费、Batch 与 Context caching 完整规则
7. Nano Banana、Veo、Imagen、Embedding、Live API、Gemma 的型号与价格
8. Grok 当前主力模型（4.6 / 4.7 说法冲突）及其上下文、缓存价
9. Grok 实时 X 数据与搜索工具的计费
10. 社区口碑与横向对比（完全未做）

---

# 补充：Gemini 4 Argon（主会话核实，2026-10-09）
- 2026-09-30 宣布的新前沿模型；**暂未对公众开放 API**（先给受信任网络防御者与 Google AI Ultra 订阅用户，Ultra 起价 $99.99/月）。
- 价格：推广价 输入 $2 / 缓存 $0.10 / 输出 $10；结束后 $4 / $0.20 / $20；推广结束日期未公布。
- 输入上下文窗口、模型 ID、批量价均未公布。
- 以上来自搜索摘要（9to5google.com/2026/09/30/gemini-4-argon-announcement/ 等），我未能打开 Google 官方博客，标为“仅摘要”。
- 因此 Gemini 官方开发者定价页（ai.google.dev）当前尚未收录它，页面最新型号为 Gemini 3.8 Flash。

---

# 补充：xAI Grok 官方核实（主会话用浏览器读取 https://docs.x.ai/developers/models ，页面标注更新于 2026-09-21，查证日期 2026-10-09）

**以本节为准，覆盖上文第三方来源中关于 Grok 的全部说法（4.6/4.3/4.20 价格、1M 上下文等均不采信）。**

| 项目 | 内容 |
|---|---|
| 主力模型 | **grok-4.7**（标记 New，“代码及其他一切任务的旗舰”：Agent 工具调用、低幻觉、可配置推理）。官方建议代码、聊天都用它 |
| 上下文 | **500K token**（不是 1M） |
| 价格 | 输入 **$2.00** / 输出 **$6.00**（每百万 token）；本页未给缓存输入价与批量价 |
| 推理 | 可配置（Configurable） |
| 知识截止 | 2026 年 5 月 |
| 实时数据 | 模型本身**没有**实时事件知识；需开启服务器端搜索工具（Web Search / X Search）才能获取，工具计费本页未列（未核实） |
| 接口 | Responses API 上 grok-4.7 总是返回加密推理内容 `reasoning.encrypted_content`；聊天不限制 system/user/assistant 顺序；grok-4.20 及更新模型**不支持** logprobs |
| Batch API | 并非所有模型支持，需看各模型页（grok-4.7 是否支持：未核实） |
| 图像输入 | 单图最大 20MiB，数量不限，仅 jpg/jpeg/png |
| 语音 API | 语音对话 $0.08/分钟；TTS $15/百万字符；语音转文字 批量 $0.10/小时、流式 $0.20/小时 |
| Imagine API（图像/视频） | 图像 1K/2K 起价 $0.02/张；视频 480p/720p/1080p 起价 $0.02/秒；型号 Grok Imagine Image 2.0 / Video 1.5 |
| 别名 | `<model>` 指向最新稳定版；`<model>-latest` 指向最新版；`<model>-<date>` 固定版本 |

仍未核实：Grok 缓存价、Web/X Search 计费、rate limit、官方基准、社区口碑（均未做）。

---

# 补充：Gemini 官方规格（主会话用浏览器读取各模型官方页，查证日期 2026-10-09）

来源：https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash （页面更新 2026-09-02）、https://ai.google.dev/gemini-api/docs/models/gemini-3.1-pro-preview （页面更新 2026-08-19）、https://ai.google.dev/gemini-api/docs/models

| 项目 | Gemini 3.8 Flash（稳定版） | Gemini 3.1 Pro（预览） |
|---|---|---|
| 模型代码 | `gemini-3.8-flash` | `gemini-3.1-pro-preview`（另有 `-customtools` 端点，偏好使用 bash 与自定义工具的 Agent） |
| 输入类型 | 文本、图片、视频、音频、PDF | 同左 |
| 输出类型 | 仅文本 | 仅文本 |
| 输入 token 上限 | 1,048,576（约 1M） | 1,048,576 |
| 输出 token 上限 | 65,536 | 65,536 |
| 思考 | 支持 low / medium / high；**不支持 minimal（会报错）** | 支持（档位未列） |
| 缓存 / 代码执行 / 函数调用 / 结构化输出 / 搜索接地 / Maps 接地 / URL 上下文 | 均支持 | 均支持 |
| Computer use | 支持（预览） | 页面未列 |
| 文件搜索 | 支持 | 仅限 AI Studio |
| Batch / Flex / 优先级 | 均支持 | 均支持 |
| 不支持 | 音频生成、图像生成、Live API | 同左 |

模型阵容要点（官方总览页）：
- 官方定位：3.8 Flash 是“最智能的 Flash，面向长程软件工程、自主 Agent 和复杂企业工作流”；3.7 / 3.6 / 3.5 Flash 为上一代 / 旧版；3.5 Flash-Lite 是“最快、最具成本效益”。
- **Pro 档目前仍是 3.1 Pro 预览版**，没有稳定的 Pro。
- **2.5 系列（Pro / Flash / Flash-Lite）只对过去用过的用户开放**，官方说明“不会被弃用”，但新项目请用 3.5 Flash-Lite 或 3.8 Flash。（这与上文第三方称“2.5 Pro 是旗舰”的说法不符，应以本节为准。）
- Live API 默认模型：Gemini 3.8 Live（低延迟，无推理延迟）；另有 3.8 Live 扩展思考。
- 图像：Nano Banana 2.1 / 2 / 2 Lite / Pro；视频：Gemini Omni Flash、Veo 3.1；开源：Gemma 4；嵌入：Gemini Embedding 2。

仍未核实：3.1 Pro 预览版的价格（定价页抓取时无法按型号区分）；是否有 >200K 分段计价；各 Flash-Lite、Veo、Nano Banana、Embedding、Gemma 4 的价格与规格；能力基准与社区口碑。
