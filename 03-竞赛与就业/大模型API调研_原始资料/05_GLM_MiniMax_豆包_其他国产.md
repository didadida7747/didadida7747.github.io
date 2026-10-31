---
title: "国产大模型调研：GLM / MiniMax / 豆包（火山方舟）/ 文心 / 混元 / 阶跃"
---

# 国产大模型调研：GLM / MiniMax / 豆包（火山方舟）/ 文心 / 混元 / 阶跃

- 查证日期：2026-10-09（除特别注明外，所有数据均于此日抓取）
- 证据等级说明：【官方】= 官方文档/定价页直接抓取；【官方博客】= 厂商发布页；【未核实】= 未能从官方来源确认，不可直接引用
- 价格单位：智谱 Z.ai 国际站以美元（USD）标价；MiniMax、豆包、混元、阶跃以人民币（元/百万 tokens）标价，除特别注明外均为「按量后付费」标准价

---

## 一、结论速览（5 行内）

1. 智谱 GLM 当前旗舰为 GLM-5.3（文本输入、1M 上下文、128K 输出），按量价 $1.4 入 / $4.4 出（每百万 tokens）；另有 GLM Coding Plan 包月积分套餐，官方公开 Lite/Pro/Max 三档，Pro 起价约 $18/月（见第四节）。
2. MiniMax 当前语言旗舰为 M3（2026-06-01 发布，1M 上下文、保证至少 512K），按量价 ¥2.10 入 / ¥8.40 出（≤512K 输入，已"永久五折"）；订阅 Token Plan 为 Plus ¥49 / Max ¥119 / Ultra ¥469 每月。
3. 豆包（火山方舟）当前主力为 doubao-seed-2.1 系列（pro / lite / turbo）及 2.0 系列；Seed 2.1-pro 常规价 ¥6 入 / ¥30 出（输入 ≤1K 档），2.1-lite ¥0.8 入 / ¥2.4 出，价格页同时列出 GLM-5.2、GLM-5.3-Flash、DeepSeek V4 的托管价格。
4. 三家中已确认提供 Anthropic 兼容端点的是智谱（`https://api.z.ai/api/anthropic`，官方 Claude Code 配置文档可见）；MiniMax、豆包的 Anthropic 兼容端点本次未核实。
5. 文心、混元、阶跃本次只拿到部分官方定价：阶跃定价页已抓取（step-3.7-flash ¥1.35 入 / ¥8.1 出）；混元价格页已抓取但页面注明已迁移至 TokenHub，且不再支持新购；文心千帆定价页因跳转后未能抓到具体价格，标为未核实。

---

## 二、智谱 GLM（Z.ai / BigModel）

### 2.1 主力模型

| 模型 | 发布/状态 | 上下文 | 最大输出 | 输入模态 | 开源 | 来源 |
|---|---|---|---|---|---|---|
| GLM-5.3 | 官方称"最新旗舰"，与 GLM-5.2 同一基座，提升全部来自后训练 | 1M tokens | 128K | 仅文本 | 未核实 | 【官方】https://docs.z.ai/guides/llm/glm-5.3 （2026-10-09） |
| GLM-5.3-Flash | 轻量版，编程套餐默认模型 | 未核实 | 未核实 | 未核实 | 未核实 | 【官方】https://docs.z.ai/devpack/overview |
| GLM-5 | 2026 年 2 月前后发布（配图日期 20260212）；744B 总参 / 40B 激活，MoE，DeepSeek Sparse Attention | 200K | 128K | 文本 | 未核实 | 【官方】https://docs.z.ai/guides/llm/glm-5 |
| GLM-4.6 | 2025 年发布 | 200K（由 128K 扩展） | 128K | 文本 | 未核实 | 【官方】https://docs.z.ai/guides/llm/glm-4.6 |

**GLM-5.3 关键变更（官方）**
- 始终开启推理（reasoning），**不支持关闭**；`reasoning_effort` 取值 `low` / `high` / `max`，默认 `max`。
- 迁移注意：原来用 `thinking.type: "disabled"` 的代码，改用 GLM-5.3 前必须改为 `enabled` + `reasoning_effort: low`，否则请求失败。
- 官方自报（厂商数据，未第三方复现）：Z.ai Code Bench 相比 GLM-5.2 提升约 50%；Terminal-Bench 3.0 从 4.6 提升到 28.3；DeepSWE v1.1 从 46.2 到 66.9；CyberGym 84.5%。
- 官方称 GLM-5.3 在 Claude Code 类场景 Max 档 34.5%（约 75K 输出 tokens），并对比 Claude Opus 4.8（High 档 29.5%）、Claude Fable 5（Max 档 39.5%）。注意：这些是厂商自测，属于"官方自报"。

**开源与协议**：GLM-5 / GLM-4.6 的 Hugging Face 权重与许可证（MIT 或其他）**本次未核实**，需自行到 huggingface.co/zai-org 核对。

### 2.2 API 价格（官方，USD / 每百万 tokens）

来源：【官方】https://docs.z.ai/guides/overview/pricing （2026-10-09）

| 模型 | 输入 | 缓存命中输入 | 输出 |
|---|---|---|---|
| GLM-5.3-Flash | $0.15 | $0.03 | $0.50 |
| GLM-5.3-FlashX | $0.37 | $0.075 | $1.25 |
| GLM-5.3 | $1.4 | $0.26 | $4.4 |
| GLM-5.2 | $1.4 | $0.26 | $4.4 |
| GLM-5.1 | $1.4 | $0.26 | $4.4 |
| GLM-5 | $1 | $0.2 | $3.2 |
| GLM-4.7 | $0.6 | $0.11 | $2.2 |
| GLM-4.7-FlashX | $0.07 | $0.01 | $0.4 |
| GLM-4.6 | $0.6 | $0.11 | $2.2 |
| GLM-4.5-Air | $0.2 | $0.03 | $1.1 |
| GLM-4.7-Flash / GLM-4.5-Flash | 免费 | 免费 | 免费 |

- 缓存存储费：官方标注 "Limited-time Free"（限时免费）。
- 其他：Web Search 工具 $0.01/次；GLM-Image $0.015/张；CogVideoX-3 $0.2/条；GLM-ASR-2512 $0.03/MTok。
- **阶梯计价 / Batch 折扣 / 免费额度细则**：本次未在定价页中看到阶梯或 Batch 专门条款，**未核实**。
- 注意：上述为 Z.ai 国际站美元价。国内 BigModel 平台（bigmodel.cn）人民币价本次**未核实**。

### 2.3 GLM Coding Plan（包月编程套餐）

来源：【官方】https://docs.z.ai/devpack/overview （2026-10-09）

| 档位 | 5 小时额度（积分） | 每周额度（积分） |
|---|---|---|
| Lite | 2,000 | 10,000 |
| Pro | 12,000 | 60,000 |
| Max | 28,000 | 140,000 |

- 起价：官方写"Starting at just 18 USD per month"（最低档约 $18/月）；**各档具体月价未在页面中单独列出，未核实**。
- 积分计算：模型积分 = (输入 tokens × 输入倍率 + 缓存输入 × 缓存倍率 + 输出 × 输出倍率) / 10,000。GLM-5.3 倍率为输入 6.9 / 缓存 1.7 / 输出 24；GLM-5.3-Flash 为 2.3 / 0.56 / 8。
- 错峰优惠：非高峰时段（周一至周五 14:00–18:00 北京时间为高峰；周末全天为非高峰）按 50% 积分计费。官方公告 2026-09-25 至 10-07 全天按非高峰费率计算。
- 官方估算：Pro 档每周约 290–580M tokens（GLM-5.3，95% 缓存命中）；Max 档约 676–1,352M tokens。
- 所有套餐含 Vision、Web Search MCP、Web Reader MCP、Zread MCP。
- 支持工具：Claude Code、Cline、OpenCode 等（官方列表）。

### 2.4 接口兼容性（官方）

来源：【官方】https://docs.z.ai/guides/llm/glm-5.3 、https://docs.z.ai/devpack/tool/claude （2026-10-09）

| 协议 | Base URL |
|---|---|
| OpenAI Chat Completions（编程套餐） | `https://api.z.ai/api/coding/paas/v4` |
| OpenAI Chat Completions（通用） | `https://api.z.ai/api/paas/v4` |
| OpenAI Responses | `https://api.z.ai/api/v1` |
| **Anthropic Messages** | `https://api.z.ai/api/anthropic` |

- 注意：曾订阅过编程套餐（含已过期）的用户，目前只能通过 OpenAI Chat Completion 协议调用模型 API（官方注意事项）。

### 2.5 接入 Claude Code（官方文档）

来源：【官方】https://docs.z.ai/devpack/tool/claude （2026-10-09）

- 官方给出 `~/.claude/settings.json` 的 env 配置：`ANTHROPIC_BASE_URL=https://api.z.ai/api/anthropic`，`ANTHROPIC_AUTH_TOKEN=<智谱 Key>`，`API_TIMEOUT_MS=3000000`。
- 模型映射示例：`ANTHROPIC_DEFAULT_SONNET_MODEL=glm-5.3[1m]`，`ANTHROPIC_DEFAULT_OPUS_MODEL=glm-5.3[1m]`，`ANTHROPIC_DEFAULT_HAIKU_MODEL=glm-5.3-flash[1m]`，并设 `CLAUDE_CODE_AUTO_COMPACT_WINDOW=1000000`。
- 官方文档中验证过的 Claude Code 版本：2.0.14。
- 也可用官方"Coding Tool Helper"（`npx @z_ai/coding-helper`）一键配置。

---

## 三、MiniMax（海螺 / 开放平台）

### 3.1 主力模型与发布时间

来源：【官方】https://platform.minimax.cn/docs/release-notes/models （2026-10-09）；【官方】https://www.minimax.io/models/text/m3 ；【官方博客】https://www.minimax.io/blog/minimax-h3

| 模型 | 发布时间 | 类型 | 关键参数（官方） |
|---|---|---|---|
| MiniMax-M3 | 2026-06-01 | 语言，原生多模态 | 1M 上下文（保证至少 512K）；采用 MiniMax Sparse Attention（MSA）架构；Web 搜索 BrowseComp 83.5（官方称超过 Opus 4.7 的 79.3） |
| MiniMax-M3.1-Flash-Preview | 未核实（OpenClaw 接入文档中出现） | 语言，始终开启思考 | 未核实 |
| MiniMax-M2.7 / M2.7-highspeed | 2026-03-18 | 语言 | 未核实 |
| MiniMax-M2.5 / M2.5-highspeed | 2026-02 | 语言，编程/工具调用/办公 | 未核实 |
| MiniMax-M2.1 | 2025-12-22 | 语言，多语言编程 | 未核实 |
| MiniMax-M2 | 2025-10-27 | 语言，面向编码与 Agent | 未核实 |
| MiniMax-M1 | 2025-06-16 | 推理模型，80K 思维链 × 1M 输入 | 未核实 |
| MiniMax H3 | 2026-07-31 | 视频/全模态生成（海螺 Hailuo 系列的新一代） | 最长 15 秒，2K 分辨率，原生立体声；官方称"计划在未来几天开放权重"（**截至查证日未确认已开源**） |

**MiniMax M3 的开源状态**：官方页面称"M3 will soon be fully open-sourced on HuggingFace and GitHub"（即"即将开源"）。截至 2026-10-09 **未核实已开源**，协议也未核实。

**海螺/语音/音乐等其他模态（官方发布日志）**：Hailuo-2.3（2025-10-28）、Speech-2.8（2026-01-23）、Music-2.6（2026-04）、Music-3.0（2026-07-16）。注意：音乐 API 公告称"自 2026-08-20 起付费音乐接口不再面向新用户提供服务"（来源：https://platform.minimax.cn/docs/guides/pricing-paygo）。

### 3.2 API 价格（官方，人民币）

来源：【官方】https://platform.minimax.cn/docs/guides/pricing-paygo （2026-10-09）

| 模型 | 输入（元/百万 tokens） | 输出 | 缓存读取 | 缓存写入 |
|---|---|---|---|---|
| MiniMax-M3（≤512K 输入） | ~~4.20~~ **2.10**（永久五折） | ~~16.80~~ **8.40** | ~~0.84~~ **0.42** | 未核实 |
| MiniMax-M3（>512K 输入） | ~~8.40~~ **4.20**（永久五折） | ~~33.60~~ **16.80** | ~~1.68~~ **0.84** | 未核实 |
| MiniMax-M3 优先服务（priority，1.5 倍标准价，折后） | 3.15 / 6.30 | 12.60 / 25.20 | 0.63 / 1.26 | 未核实 |
| MiniMax-M2.7 | 2.1 | 8.4 | 0.42 | 2.625 |
| MiniMax-M2.7-highspeed | 4.2 | 16.8 | 0.42 | 2.625 |

- **阶梯计价**：M3 按 512K 输入分界两档。
- **Batch 价格 / 免费额度**：未核实。
- 语音 TTS：speech-2.8-hd ¥3.5/万字符，speech-2.8-turbo ¥2.0/万字符；ASR ¥2.5/小时。
- 图像 image-01 ¥0.025/张；视频 H3 768P ¥0.50/秒、2K ¥0.80/秒。
- 服务端 web_search ¥0.03/次（Beta）。

### 3.3 包月订阅：Token Plan（官方）

来源：【官方】https://platform.minimax.cn/docs/guides/pricing-token-plan （2026-10-09）

| 档位 | 月价 | 适合 | 额度窗口 | 约可支持 Agent 数 |
|---|---|---|---|---|
| Plus | ¥49 / 月 | 轻量个人开发 | 5 小时 + 周 | 3–4 |
| Max | ¥119 / 月 | 高频编程 Agent | 5 小时 + 周 | 4–5 |
| Ultra | ¥469 / 月 | 重度 Agent 工作流 | 5 小时 + 周 | 6–7 |

- 积分包（365 天有效）：¥30 得 4,489 积分；¥150 得 22,460 积分；¥500 得 74,900 积分。
- 可用模型：M3 / M2.7 / 图像 / 语音；MiniMax H3、音色设计、快速复刻等暂不支持。
- 官方 M Plan 页面另有"M Plan"概念（与 Token Plan 并存），两者的具体关系**未核实**。

### 3.4 接口兼容性与 Claude Code 接入

- OpenAI 兼容：官方 M3 调用示例为 `https://api.minimax.io/v1/text/chatcompletion_v2`（来源：https://www.minimax.io/models/text/m3）。
- Anthropic 兼容端点：**未核实**（本次未抓到官方 Anthropic 端点说明）。
- 本次可确认的客户端接入：OpenClaw（官方文档 https://platform.minimax.cn/docs/m-plan/openclaw.md ，支持 OAuth 或订阅 Key）。Claude Code 接入：**未核实**。

---

## 四、字节豆包 / 火山方舟（Seed 系列）

### 4.1 主力模型（官方价格页列出的模型名）

来源：【官方】https://docs.volcengine.com/docs/ark/model-pricing?redirect=1&lang=zh （2026-10-09；原链接 volcengine.com/docs/82379/1099320 跳转至此）

- 语言模型（按价格页）：doubao-seed-2.1-pro、doubao-seed-2.1-lite、doubao-seed-2.1-turbo、doubao-seed-2.0-pro、doubao-seed-2.0-lite、doubao-seed-2.0-mini、doubao-seed-2.0-code、doubao-seed-character、doubao-seed-translation、doubao-seed-evolving。
- 同页托管的第三方模型：glm-5.2、glm-5.3-flash、deepseek-v4 系列（pro / flash，含预览版）。
- 视频：doubao-seedance-2.5、doubao-seedance-2.0 / 2.0-fast / 2.0-mini、doubao-seedance-1.0-pro / pro-fast。
- 图像：doubao-seedream 5.0 pro / flash（具体价格**未核实**）。
- 发布时间、架构、上下文窗口、最大输出：**未核实**（价格页未列出，需查模型列表页）。

### 4.2 API 价格（官方，人民币 / 百万 tokens，在线推理·常规，输入 ≤32K/1K档）

| 模型 | 输入（非音频） | 缓存命中 | 输出 | 备注 |
|---|---|---|---|---|
| doubao-seed-2.1-pro | 6.00 | 0.017/百万/小时 存储 + 1.20（命中） | 30.00 | 输入长度 [0,1024]K |
| doubao-seed-2.1-lite | 0.80 | 0.16 | 2.40 | 另列 12.00 音频输入 |
| doubao-seed-2.1-turbo | 3.00 | 0.60 | 15.00 | 输入长度 [0,256]K |
| doubao-seed-2.0-pro | 3.2 / 4.8 / 9.6（分段） | 0.64 / 0.96 / 1.92 | 16 / 24 / 48 | 按 32K/128K/256K 分段 |
| doubao-seed-2.0-lite | 0.6 / 0.9 / 1.8（分段） | 0.12 / 0.18 / 0.36 | 3.6 / 5.4 / 10.8 | 分段 |
| doubao-seed-2.0-mini | 0.2 / 0.4 / 0.8（分段） | 0.04 / 0.08 / 0.16 | 2.0 / 4.0 / 8.0 | 分段 |
| doubao-seed-2.0-code | 3.2 / 4.8 / 9.6（分段） | 0.64 / 0.96 / 1.92 | 16 / 24 / 48 | 编程专用 |

- **Batch（批量推理）**：doubao-seed-2.1-pro 输入 3.00 / 输出 15.00（约常规价的一半）；2.1-lite 0.40 / 1.35。
- **低优（低成本、非实时）**：约为常规价 50%，缓存命中价格与常规相同，仅支持隐式缓存。
- **低延迟**：2.1-lite 1.60 入 / 5.40 出，比常规更贵。
- 分段计费规则：按单次请求的输入长度选档，整次请求所有 token 统一按该档计价（官方举例：输入 200K、输出 14K，按 (128,256] 档计价）。
- 免费额度 / 包月套餐：本次未在价格页看到具体条款，**未核实**。

### 4.3 接口兼容性

- 方舟支持 OpenAI Responses API（官方目录含"迁移至 Responses API"）。
- Anthropic 兼容端点：**未核实**。
- Claude Code 接入：**未核实**。

---

## 五、百度文心 ERNIE（千帆）

- 千帆官网定价页已抓到平台介绍，但**具体模型价格页未能抓取**，本次模型名、价格、上下文窗口均**未核实**。
- 官方可确认的信息：千帆提供 Token Plan 个人版 / 企业版、Coding Plan 文档（来源：https://cloud.baidu.com/doc/qianfan/index.html ，2026-10-09）。新用户实名后送 ¥20 代金券，有效期一个月（同源）。
- 文心一言 Web 版已升级为"文心"（2026-07-23 公告）。
- 文心 5.0、ERNIE 4.5/5 的参数与开源情况：**未核实**，不作结论。

---

## 六、腾讯混元（Hunyuan）

来源：【官方】https://cloud.tencent.com/document/product/1729/97731 （页面更新 2026-06-26，2026-10-09 抓取）

- **重要提示**：页面称"混元大模型相关功能将逐步迁移至 TokenHub；迁移后原平台不再新增模型能力，并停止支持新购模型服务。已购买的可继续使用。"即**新用户应改用 TokenHub**，本次未对 TokenHub 做调研。

| 模型 | 输入（元/百万） | 输出（元/百万） |
|---|---|---|
| Hunyuan-a13b | 0.5 | 2 |
| Hunyuan-role-latest | 2.4 | 9.6 |
| Hunyuan-translation | 1.2 | 3.6 |
| Hunyuan-translation-lite | 1 | 3 |
| Tencent HY Vision 1.5 Instruct | 3 | 9 |
| Hunyuan-turbos-vision | 3 | 9 |
| Hunyuan-t1-vision | 3 | 9 |
| Hunyuan-embedding | 0.7 | 0.7 |

- 免费额度：Hunyuan-a13b 等模型共 100 万 tokens，有效期 1 年。
- 结算顺序：免费资源包 > 付费资源包 > 后付费；后付费需在控制台主动开通。
- 混元 Hunyuan-T1、Hunyuan-TurboS 等的上下文/输出/开源情况：**未核实**。

---

## 七、阶跃星辰（StepFun）

来源：【官方】https://platform.stepfun.com/docs/zh/guides/pricing/details.md （2026-10-09）

| 模型 | 输入·未命中（元/百万） | 输入·命中 | 输出 | 类型 |
|---|---|---|---|---|
| step-5-preview | 7 | 0.35 | 20 | 多模态推理 |
| step-3.7-flash | 1.35 | 0.27 | 8.1 | 多模态推理 |
| step-3.5-flash / step-3.5-flash-2603 | 0.7 | 0.14 | 2.1 | 推理 |
| step-1o-turbo-vision | 2.5 | 0.5 | 8 | 视觉 |

- 语音：stepaudio-2.5-realtime 输入 10 / 输出 70 元；stepaudio-3-realtime-preview 限时免费。
- 语音合成：stepaudio-3-tts 2.5 元/万字符；step-tts-mini 0.9 元/万字符。
- 语音识别：step-asr 0.9 元/小时；stepaudio-2.5-asr 0.15 元/小时。
- **下线公告**：step-2x-large（文生图）与 step-image-edit-2 将于 **2026-10-10** 下线（即明天），业务需提前迁移。
- 阶梯限速（非计价）：个人账户按累计充值分 V0–V4 档（V0 不足 ¥100，RPM 100；V4 ≥ ¥10,000，RPM 2,600）。
- Step Plan（订阅）：官方页面提到存在，价格**未核实**。
- Anthropic 兼容端点：**未核实**。

---

## 八、能力边界、合规与稳定性

| 维度 | 结论 | 来源/状态 |
|---|---|---|
| 数据出境 | 未核实。需查阅各家隐私政策与数据处理条款，本次未抓取 | 未核实 |
| 稳定性/限流 | 阶跃有明确分档限速表；智谱编程套餐有 5 小时 + 周双窗口限额；MiniMax Token Plan 同样为 5 小时 + 周；混元提示免费额度过期作废，欠费会停服 | 官方（见各节） |
| GLM-5.3 能力边界 | 官方明确：仅文本输入；推理不可关闭 | 官方 |
| GLM-5.2/5.1 路由 | 编程套餐中 GLM-5.2/5.1 请求自动路由至 GLM-5.3；GLM-4.7 路由至 GLM-5.3-Flash | 官方 |
| 历史模型弃用 | 阶跃 step-2x-large 2026-10-10 下线；混元迁移至 TokenHub；MiniMax 部分音乐接口停服 | 官方 |

---

## 九、社区评价与性价比（本次未完成）

- 本次**未能完成**社区实测抓取：B 站、知乎、掘金、CSDN、linux.do、GitHub 社区评测、YouTube、抖音均未检索到可用的 2026 年实测内容（搜索结果以官网和百科为主）。
- 因此"社区评价"部分**全部未核实**，不能给出可靠结论。
- 可参考的仅有厂商自测数据（见第二、三节），需标注为"厂商自报"。
- 性价比的粗略计算（基于官方价格，未经实测）：
  - 按量输入：MiniMax M3 ¥2.10/百万（≤512K）、GLM-5.3 $1.4/百万、豆包 2.1-lite ¥0.80/百万、阶跃 step-3.7-flash ¥1.35/百万。
  - 按量输出：豆包 2.1-lite ¥2.40、阶跃 3.7-flash ¥8.1、MiniMax M3 ¥8.40、GLM-5.3 $4.4、豆包 2.1-pro ¥30。
- 注意：不同厂商币种不同（美元 vs 人民币），跨厂商比较前需统一汇率，本次未核实当日汇率。

---

## 十、来源清单（均于 2026-10-09 查证）

1. https://docs.z.ai/guides/llm/glm-5.3 （官方）
2. https://docs.z.ai/guides/llm/glm-5 （官方）
3. https://docs.z.ai/guides/llm/glm-4.6 （官方）
4. https://docs.z.ai/guides/overview/pricing （官方，美元）
5. https://docs.z.ai/devpack/overview （官方，编程套餐）
6. https://docs.z.ai/devpack/tool/claude （官方，Claude Code 配置）
7. https://platform.minimax.cn/docs/release-notes/models （官方，发布日志）
8. https://www.minimax.io/models/text/m3 （官方）
9. https://www.minimax.io/blog/minimax-h3 （官方博客）
10. https://platform.minimax.cn/docs/guides/pricing-paygo （官方，按量）
11. https://platform.minimax.cn/docs/guides/pricing-token-plan （官方，订阅）
12. https://platform.minimax.cn/docs/m-plan/openclaw.md （官方）
13. https://docs.volcengine.com/docs/ark/model-pricing?redirect=1&lang=zh （官方，方舟价格）
14. https://cloud.baidu.com/doc/qianfan/index.html （官方，千帆入口）
15. https://cloud.tencent.com/document/product/1729/97731 （官方，混元计费）
16. https://platform.stepfun.com/docs/zh/guides/pricing/details.md （官方，阶跃价格）

---

## 十一、未核实项清单（汇总）

1. 智谱：GLM-5 / GLM-4.6 的开源权重与许可证；GLM-5.3-Flash 的上下文与输出上限；Coding Plan 各档月价具体数字（仅知 Pro 约 $18 起）；国内 BigModel 人民币价；阶梯计价与 Batch 条款；GLM-5.3 发布的确切日期。
2. MiniMax：M3 是否已开源及协议；M3 缓存写入价；M3.1-Flash-Preview、M2.7 等的上下文与参数；H3 权重是否已开放；Anthropic 兼容端点；Claude Code 接入方式；Token Plan 与 M Plan 的关系；免费额度细则。
3. 豆包/方舟：各 Seed 模型的发布时间、架构、上下文窗口、最大输出、开源情况；Seedream 5.0 图像价格；包月套餐与免费额度；Anthropic 兼容端点；Claude Code 接入。
4. 文心：全部模型名、价格、上下文窗口、开源情况（千帆价格页未能抓取）。
5. 混元：Hunyuan-T1/TurboS 等的参数与开源情况；TokenHub 的价格与能力（本次未调研）。
6. 阶跃：Step Plan 订阅价格；上下文窗口；Anthropic 兼容端点。
7. 全部厂商：数据出境与隐私合规条款；稳定性实测；B 站/知乎/掘金/CSDN/linux.do/GitHub/YouTube 社区评价（均未完成）；抖音（未尝试，抓取困难）。
8. 第三方基准：本次仅有厂商自报数据，未检索到独立第三方评测（如 Artificial Analysis、LMArena 等）的数值，需另行补充。
9. 汇率：跨币种比价未核实当日汇率。
