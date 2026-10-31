---
title: "OpenAI 最新模型家族调研（原始资料）"
---

# OpenAI 最新模型家族调研（原始资料）

- 查证日期：2026-10-09
- 主要来源（官方）：
  - 定价页：https://developers.openai.com/api/docs/pricing （即 platform.openai.com/docs/pricing 的跳转目标；platform.openai.com 直接抓取返回 403，故以浏览器渲染结果为准）
  - 模型索引：https://developers.openai.com/api/docs/models
  - 全部模型：https://developers.openai.com/api/docs/models/all
  - 单模型页：https://developers.openai.com/api/docs/models/gpt-5.5 ； https://developers.openai.com/api/docs/models/gpt-5.4-mini ； https://developers.openai.com/api/docs/models/gpt-oss-120b
- 说明：本次抓取未能访问 openai.com/api/pricing（403）及 .md 版本文档（403），也未能访问社区评价来源（本次工具受限，未完成）。下文标注“未核实”的内容均未从可靠来源确认。

---

## 一、当前在售主力模型

### 1. 旗舰（官方定价页 "Flagship models" 表，短上下文 / 长上下文）

| 模型 ID | 定位 | 上下文 | 最大输出 | 知识截止 | 来源 |
|---|---|---|---|---|---|
| gpt-6-astra | 最强，复杂推理与编程 | 1.05M | 128K | Apr 30, 2026 | models 索引页 |
| gpt-6.1-sol | 接近 Astra 的性能，成本更低 | 1.05M | 128K | Apr 30, 2026 | models 索引页 |
| gpt-6-luna | 高吞吐、低成本 | 1.05M | 128K | May 18, 2026 | models 索引页 |

发布时间：页面未直接给出发布日期，**未核实**（仅有知识截止日期）。

**价格（美元 / 百万 token，标准档，短上下文 ≤272K）**，来源：定价页 Flagship 表

| 模型 | 输入 | 缓存命中输入 | 缓存写入 | 输出 |
|---|---|---|---|---|
| gpt-6-astra | $10.00 | $1.00 | $12.50 | $50.00 |
| gpt-6.1-sol | $2.00 | $0.10 | $2.50 | $10.00 |
| gpt-6-luna | $0.10 | $0.01 | $0.125 | $0.50 |

**长上下文（>272K）价格**（同一定价页）：
- gpt-6-astra：输入 $20.00 / 缓存 $2.00 / 缓存写入 $25.00 / 输出 $75.00
- gpt-6.1-sol：输入 $4.00 / 缓存 $0.20 / 缓存写入 $5.00 / 输出 $15.00
- gpt-6-luna：输入 $0.20 / 缓存 $0.02 / 缓存写入 $0.25 / 输出 $0.75

**定价页中另外两组数值（约为标准价一半、同样为短/长两档）**：
- 第二组 短上下文：astra 输入 $5.00 / 输出 $25.00；sol 输入 $1.00 / 输出 $5.00；luna 输入 $0.05 / 输出 $0.25
- 第三组（与第二组相同）：同上
- 这两组很可能分别对应 Batch 与 Flex 档位，但**页面表头标签在 DOM 中未能确认，未核实**。

**定价页声明**：
- 区域数据驻留（Regional processing）端点加收 10%；FedRAMP 端点加收 10%。
- "Priority processing" 已于 2026-07-30 更名为 **Fast mode**；定价页另有 Fast / Ultrafast 列，具体数值**未核实**（页面文本未完整展示）。
- GPT-5.6 Sol 促销价至少持续到 2026-11-21。

**能力（模型索引页）**：支持文本与图片输入、文本输出；工具包括 Functions、Web search、File search、Computer use。

### 2. GPT-5.6 系列（"More models" 列表）

| 模型 | 说明 | 价格 |
|---|---|---|
| gpt-5.6-sol | GPT-5.6 旗舰（专业复杂工作） | 标准价：输入 $4.00 / 缓存 $0.40 / 输出 $20.00；长上下文：输入 $8.00 / 缓存 $0.80 / 输出 $30.00（页面文本："GPT-5.6 Sol" 表，上下文阈值以定价页为准） |
| gpt-5.6-terra | 智能与成本平衡 | **未核实**（未打开单模型页） |
| gpt-5.6-luna | 成本敏感型 | **未核实** |
| gpt-5.6-cyber | 网络安全（Daybreak，需授权） | 输入 $12.50 / 缓存 $1.25 / 缓存写入 $15.625 / 输出 $75.00；长上下文不适用 |

注：gpt-5.6-sol 的价格列为定价页 "Our latest models" 之后的 Cyber 表格中的值（"Cyber models" 表）。

### 3. GPT-5.5 系列

**gpt-5.5**（页面标注 Default 之一）
- 定位：复杂专业工作与编程的旗舰
- 推理：reasoning.effort 支持 none / low / medium（默认）/ high / xhigh
- 上下文：1,050,000；最大输出：128,000；知识截止：Dec 01, 2025
- 价格（标准，美元/百万 token）：输入 $5.00，缓存输入 $0.50，输出 $30.00
- 超过 272K 输入的请求：输入 2 倍、输出 1.5 倍（整个会话，适用于标准、Batch、Flex）
- 多模态：输入文本+图片，输出文本；不支持音频/视频
- 端点：Chat Completions、Responses、Realtime、Batch、Fine-tuning（页面标注 Fine-tuning "Not supported"）、Embeddings 等
- 工具（Responses API）：Web search、File search、Image generation、Code interpreter、Hosted shell、Apply patch、Skills、Computer use、MCP、Tool search
- 流式、函数调用、结构化输出：支持
- 快照：gpt-5.5-2026-04-23
- 速率限制（Long Context 表）：Build 层 5,000 RPM / 1,000,000 TPM；Launch 层 10,000 RPM / 4,000,000 TPM；Grow 层 15,000 RPM / 40,000,000 TPM（另有 Batch 队列上限）
- 来源：https://developers.openai.com/api/docs/models/gpt-5.5

**gpt-5.5-pro**：在列表中存在；价格与上下文**未核实**（未打开单模型页）。

### 4. GPT-5.4 系列

**gpt-5.4-mini**
- 定位：编程、computer use、subagents 的强力 mini 模型
- 推理：reasoning.effort 支持 none（默认）/ low / medium / high / xhigh
- 上下文：400,000；最大输出：128,000；知识截止：Aug 31, 2025
- 价格（标准，美元/百万 token）：输入 $0.75，缓存输入 $0.075，输出 $4.50
- 模态：输入文本+图片，输出文本
- 工具：Web search、File search 等；支持结构化输出、函数调用、流式；不支持微调
- 区域数据驻留加收 10%
- 来源：https://developers.openai.com/api/docs/models/gpt-5.4-mini

**gpt-5.4**：价格见 GPT-5.5 页面"Quick comparison"：输入 $2.50；**缓存、输出、上下文未核实**（未打开单模型页）。

**gpt-5.4 nano**：页面"Quick comparison"显示输入 $0.20；已在目录中标为 **Deprecated**。

**gpt-5.4-pro**：在列表中存在；**价格未核实**。

### 5. 其他仍在目录中的文本模型（列表中未标 Deprecated）

- gpt-5.2、gpt-5.2-pro：列为"previous flagship"；价格与上下文**未核实**
- gpt-5 / gpt-5-mini / gpt-5-nano / gpt-5-pro：列表中存在；**价格与上下文未核实**（列表页未给出数值）
- gpt-4.1 / gpt-4.1-mini：列表中存在；**未核实**
- gpt-4o / gpt-4o-mini：列表中存在；**未核实**
- o3、o3-pro：列表中 o3 标注"succeeded by GPT-5"，o3-pro 状态与价格**未核实**
- omni-moderation：审核模型，价格**未核实**

### 6. 已标注 Deprecated（不建议新项目使用）

GPT-5.4 nano、GPT-5.3-Codex、GPT-5.1、GPT-5.1-Codex 系列、GPT-5.2-Codex、GPT-5.3 Chat、GPT-5.2 Chat、GPT-5 Chat、o1 系列、o3-mini、o4-mini、o4-mini-deep-research、o3-deep-research、GPT-4.1 nano、GPT-4.5 Preview、GPT-4 Turbo、GPT-4 Turbo Preview、GPT-4、GPT-3.5 Turbo、GPT-Realtime（原版）与 GPT-Realtime Mini、GPT-Audio 与 GPT-Audio Mini、GPT-Image-1 / 1 Mini / 1.5、computer-use-preview、TTS-1 / TTS-1 HD、text-moderation 系列、codex-mini-latest 等。
- 来源：https://developers.openai.com/api/docs/models/all

### 7. 开源模型 gpt-oss

- **gpt-oss-120b**：117B 总参数、5.1B 激活参数，可单卡 H100 运行；Apache 2.0；上下文 131,072；最大输出 131,072；知识截止 Jun 01, 2024；输入输出均为文本；支持可调推理强度（low/medium/high）、完整思维链、函数调用、结构化输出、微调；**API 价格未在页面中给出，未核实**。来源：https://developers.openai.com/api/docs/models/gpt-oss-120b
- **gpt-oss-20b**：中型开源，低延迟；参数与价格**未核实**（未打开单模型页）。

### 8. 图像模型（"Image" 分类）

| 模型 | 定位 | 价格（每百万 token，标准） | 来源 |
|---|---|---|---|
| gpt-image-2.5-sunburst | 最强图像生成与编辑 | 图像输入 $8.00 / 缓存 $2.00 / 输出 $30.00；文本输入 $5.00 / 缓存 $1.25 | 定价页 Image 表 |
| gpt-image-2.5-flare | 快速日常图像生成 | 与 sunburst 相同 | 定价页 Image 表 |
| gpt-image-2 | 图像生成（SOTA） | **未核实** | 模型列表 |
| gpt-image-1.5 / gpt-image-1 / gpt-image-1-mini | 已 Deprecated | — | 模型列表 |

注：定价页说明图像生成成本估算请使用官方计算器（按图像尺寸/质量计费），**未核实单张图像价格**。

### 9. 语音 / 实时 / 转写 / TTS 模型

**Realtime 与音频生成（定价页，每百万 token，除非注明）**

| 模型 | 模态 | 输入 | 缓存输入 | 输出 |
|---|---|---|---|---|
| gpt-realtime-2.1 | 音频 | $32.00 | $0.40 | $64.00 |
| gpt-realtime-2.1 | 文本 | $4.00 | $0.40 | $24.00 |
| gpt-realtime-2.1 | 图像 | $5.00 | $0.50 | — |
| gpt-realtime-2.1-mini | 音频 | $10.00 | $0.30 | $20.00 |
| gpt-realtime-2.1-mini | 文本 | $0.60 | $0.06 | $2.40 |
| gpt-realtime-2.1-mini | 图像 | $0.80 | $0.08 | — |

来源：https://developers.openai.com/api/docs/pricing

**GPT-Live**
- gpt-live-1（"premier voice model"，支持自然语音交互与平滑打断）：按秒计费，**$0.05 / 分钟**；按秒计费不取整到分钟；后端模型与工具用量另计。
- 来源：定价页 "GPT-Live sessions" 表

**转写与翻译**（定价页）

| 模型 | 用途 | 价格 |
|---|---|---|
| gpt-realtime-translate | 实时翻译 | $0.034 / 分钟 |
| gpt-live-transcribe | 实时转写 | $0.017 / 分钟 |
| gpt-realtime-whisper | 实时转写 | $0.017 / 分钟 |
| gpt-transcribe | 转写 | $0.0045 / 分钟 |
| gpt-4o-transcribe | 转写 | 输入 $2.50 / 输出 $10.00 / 约 $0.006 / 分钟 |
| gpt-4o-mini-transcribe | 转写 | 输入 $1.25 / 输出 $5.00 / 约 $0.003 / 分钟 |

- gpt-4o-transcribe-diarize（说话人区分）、whisper 与 gpt-4o-mini-tts：在列表中存在，价格**未核实**。
- GPT-Realtime-1.5、GPT-Audio-1.5：列表中存在；价格**未核实**。

### 10. Embedding 模型

- text-embedding-3-large：最强 Embedding；价格与维度**未核实**
- text-embedding-3-small：小型；价格与维度**未核实**
- text-embedding-ada-002：旧版
- 注：本次未打开单模型页，价格**未核实**。

### 11. 视频模型
- 端点 `v1/videos` 在列表中出现（如 gpt-live 等端点说明），但**具体视频模型名称与价格未核实**。

### 12. 专用模型（需审批）
- **GPT-5.6 Cyber**（Daybreak，网络安全，授权使用）：见上表
- **GPT-Rosalind**（生命科学推理，仅限获批机构）：定价页显示 输入 $5.00 / 缓存 $0.50 / 输出 $25.00；2026-10-05 起开始计费；不支持缓存写入。来源：定价页 Specialized models
- **gpt-5.3-codex**（Codex，标准 / Fast 档）：输入 $1.75 / 缓存 $0.175 / 输出 $14.00。来源：定价页 Specialized models
- **chat-latest**（ChatGPT 同款）：输入 $5.00 / 缓存 $0.50 / 输出 $30.00。来源：定价页 Specialized models

---

## 二、API 特性与计费

### 1. Responses API / Chat Completions / Batch / Realtime 计费
- 定价页原文："Responses API, Chat Completions API, Realtime API, Batch API, and Assistants API are not priced separately. Tokens are billed at the chosen model's input and output rates."
- 即：这些接口本身不另外收费，按模型 token 单价计费。来源：定价页底部说明。

### 2. Batch（折扣）
- 模型页价格区块标题为 "Batch API price"，但其下数值（例：gpt-5.4-mini 为 $0.75 / $0.075 / $4.50）与定价页标准价一致，无法区分是否为 Batch 价，**Batch 折扣比例未核实**。定价页中约为标准价一半的两组数值（见第一节）可能为 Batch/Flex，同样未核实。

### 3. Prompt Caching（提示缓存）
- 定价页提供"缓存输入（Cached input）"与"缓存写入（Cache writes）"两列。
- gpt-6-astra 标准价：缓存输入 $1.00（约为输入的 1/10），缓存写入 $12.50（约为输入的 1.25 倍）。
- gpt-6.1-sol：缓存输入 $0.10（约为输入的 1/20），缓存写入 $2.50（约为输入的 1.25 倍）。
- gpt-6-luna：缓存输入 $0.01，缓存写入 $0.125。
- gpt-5.5：缓存输入 $0.50（输入的 1/10）。
- gpt-5.4-mini：缓存输入 $0.075（输入的 1/10）。
- 缓存过期时间、最小前缀长度等规则：**未核实**（本次未抓取 Prompt Caching 文档）。

### 4. Flex / Fast（原 Priority）档位
- Priority 已于 2026-07-30 更名为 Fast mode（定价页声明）。
- 定价页 "Fast" 与 "Ultrafast" 列存在，但**具体数值未核实**（页面文本中未完整展示，且 gpt-6 系列的 Fast 价格与 Ultrafast 价格的对应关系未核实）。
- Flex 档位：页面标题含 Flex 列，具体折扣**未核实**。

### 5. Rate limit 分级
- gpt-5.5 页面：Build / Launch / Grow 三档（Free 不支持长上下文）；数值见上文 GPT-5.5 小节。
- 完整层级（Tier 1-5）与其他模型的限额：**未核实**。

### 6. Realtime API
- 端点：`v1/realtime`；模型包括 gpt-realtime-2.1 / 2.1-mini / 2 / translate / 1.5 等（见第九节）。
- 价格见第九节。

### 7. Agents SDK
- 本次未抓取 Agents SDK 文档，相关信息**未核实**。

### 8. 内置工具计费（定价页 "Tools" 表）

| 工具 | 价格 |
|---|---|
| Web search（所有模型） | $10.00 / 1,000 次调用；另加搜索内容 token 按模型单价计费 |
| Image web search（所有模型） | $10.00 / 1,000 次调用 |
| Web search preview（推理模型，含 gpt-5、o 系列） | $10.00 / 1,000 次调用 |
| Web search preview（非推理模型） | $25.00 / 1,000 次调用；搜索内容 token 免费 |
| Containers（Hosted Shell 与 Code Interpreter） | 1GB $0.03 / 4GB $0.12 / 16GB $0.48 / 64GB $1.92，每个容器 20 分钟会话 |
| File search 存储 | $0.10 / GB / 天（1GB 免费） |
| File search 调用 | $2.50 / 1,000 次调用（仅 Responses API） |
| ChatKit 文件与图片存储 | $0.10 / GB-天（每账号每月 1GB 免费） |

- 容器按分钟计费，每次会话最低 5 分钟（定价页说明）。
- gpt-4o-mini 与 gpt-4.1-mini 使用非 preview 的 Web search 时，搜索内容按固定 8,000 输入 token 计费。
- Computer use 计费：定价页未单列；模型页说明"For tool-specific models, like search and computer use, there's a fee per tool call"，**具体单价未核实**。
- 来源：https://developers.openai.com/api/docs/pricing

### 9. 其他区域与价格规则
- 区域数据驻留端点加收 10%（2026-03-05 及之后发布的模型）；FedRAMP 端点加收 10%。
- gpt-5.5：>272K 输入 token 的请求整体按 输入 2 倍 / 输出 1.5 倍计费。

### 10. 微调（Fine-tuning）
- 定价页说明：OpenAI 正在关闭 fine-tuning 平台，新用户不可访问，现有用户可在未来数月内创建训练任务；已微调模型在其基座模型下线前可继续推理。
- 旧的 o4-mini-2025-04-16 微调价格：训练 $100 / 小时；输入 $4.00 / 缓存 $1.00 / 输出 $16.00（数据共享可半价）。

---

## 三、能力边界与已知短板

> 本次未抓取官方 "Reasoning models"、"Model guidance" 与安全/限制说明页面，**以下大部分未核实**，仅保留可从官方页面直接读取的信息。

- 知识截止：gpt-6-astra / gpt-6.1-sol 为 Apr 30, 2026；gpt-6-luna 为 May 18, 2026；gpt-5.5 为 Dec 01, 2025；gpt-5.4-mini 为 Aug 31, 2025；gpt-oss-120b 为 Jun 01, 2024。（来源：模型页）
- 幻觉、长上下文衰减、延迟、拒答等：**未核实**（需补充官方 Model guidance 与社区实测）。
- gpt-5.5 的 Fine-tuning 不支持（模型页）。

---

## 四、社区评价

**未核实**。本次工具调用受限（官方页面部分返回 403，浏览器渲染工具不可用于其他站点），未能抓取 GitHub / Reddit / Hacker News / 知乎 / B站 / YouTube 的评价内容，也未做与 Claude、Gemini、国产模型的对比。

---

## 五、未能核实项目清单

1. Batch、Flex、Fast（原 Priority）、Ultrafast 各档的具体折扣与价格（定价页表头标签未确认）。
2. gpt-6-astra / gpt-6.1-sol / gpt-6-luna 的发布日期（仅有知识截止日期）。
3. gpt-5.6-terra、gpt-5.6-luna 的价格与上下文。
4. gpt-5.5-pro、gpt-5.4、gpt-5.4-pro、gpt-5.2、gpt-5、gpt-5-mini、gpt-5-nano、gpt-5-pro、gpt-4.1、gpt-4.1-mini、gpt-4o、gpt-4o-mini、o3-pro、omni-moderation 的价格与上下文。
5. gpt-5.4 的缓存输入与输出价格、上下文窗口。
6. gpt-oss-120b 与 gpt-oss-20b 的 API 价格（gpt-oss-20b 参数）。
7. gpt-image-2 的价格；图像生成的单张价格。
8. gpt-4o-transcribe-diarize、gpt-4o-mini-tts、gpt-realtime-1.5、gpt-audio-1.5 的价格。
9. text-embedding-3-large / -small 的价格与维度。
10. 视频模型的具体名称与价格。
11. Computer use 工具的每次调用价格。
12. Prompt Caching 的过期时间、最小前缀与命中规则。
13. Agents SDK 相关信息。
14. rate limit 完整层级（Tier 1-5）及各模型限额。
15. 幻觉、长上下文衰减、延迟、拒答等能力短板（需官方 Model guidance 与社区实测）。
16. 社区评价与对比（Claude / Gemini / 国产模型）。
17. platform.openai.com/docs/pricing 与 openai.com/api/pricing 的直接抓取（均返回 403，本次以 developers.openai.com 页面为准）。

---

# 补查章节（2026-10-09）

> 本节为补查追加，不覆盖上文。与上文冲突之处以本节为准：上文"未核实"的 gpt-5.4 缓存/输出/上下文、gpt-5.5-pro、gpt-oss-20b、Batch/Flex/Fast 折扣、gpt-6 发布日期、rate limit 分级，本节已补查。

## A. 定价页逐表核对（developers.openai.com/api/docs/pricing，2026-10-09）

核对方法：读取页面全部 table，并依次点击页面内容切换按钮（Batch / Flex / Fast / Ultrafast；标准档为默认）读取可见表格，确认标签与数字的对应关系。

### A1. 标准档（Standard，默认），美元 / 百万 token

| 模型 | 上下文 | 输入 | 缓存输入 | 缓存写入 | 输出 |
|---|---|---|---|---|---|
| gpt-6-astra | 短（≤272K） | 10.00 | 1.00 | 12.50 | 50.00 |
| gpt-6-astra | 长（>272K） | 20.00 | 2.00 | 25.00 | 75.00 |
| gpt-6.1-sol | 短 | 2.00 | 0.10 | 2.50 | 10.00 |
| gpt-6.1-sol | 长 | 4.00 | 0.20 | 5.00 | 15.00 |
| gpt-6-luna | 短 | 0.10 | 0.01 | 0.125 | 0.50 |
| gpt-6-luna | 长 | 0.20 | 0.02 | 0.25 | 0.75 |
| gpt-5.6-sol | 短 | 4.00 | 0.40 | 5.00 | 20.00 |
| gpt-5.6-sol | 长 | 8.00 | 0.80 | 10.00 | 30.00 |
| gpt-5.6-cyber | 不分档 | 12.50 | 1.25 | 15.625 | 75.00 |

与上文核对：上文 gpt-6 三款标准价、长上下文价、gpt-5.6-sol 与 gpt-5.6-cyber 数字均与页面一致，无串行。

### A2. 其余档位（同一页面，按切换按钮 Batch → Flex → Fast → Ultrafast 读取）

| 档位 | 模型（短上下文） | 输入 | 缓存输入 | 缓存写入 | 输出 |
|---|---|---|---|---|---|
| Batch | gpt-6-astra | 5.00 | 0.50 | 6.25 | 25.00 |
| Batch | gpt-6.1-sol | 1.00 | 0.05 | 1.25 | 5.00 |
| Batch | gpt-6-luna | 0.05 | 0.005 | 0.0625 | 0.25 |
| Flex | 与 Batch 完全相同（三款模型数字一致） | | | | |
| Fast | gpt-6-astra | 20.00 | 2.00 | 25.00 | 100.00 |
| Fast | gpt-6.1-sol | 4.00 | 0.20 | 5.00 | 20.00 |
| Fast | gpt-6-luna | 0.20 | 0.02 | 0.25 | 1.00 |
| Ultrafast | gpt-6-astra | 60.00 | 6.00 | 75.00 | 300.00 |
| Ultrafast | gpt-6.1-sol | 12.00 | 0.60 | 15.00 | 60.00 |

标签确认依据：
- 点击 Batch / Flex / Fast / Ultrafast 按钮后，可见表格分别显示上表数字（来源：定价页，2026-10-09 浏览器读取）。
- 官方模型页 gpt-6-astra（https://developers.openai.com/api/docs/models/gpt-6-astra，2026-10-09）原文："Batch and Flex are priced at 50% of Standard rates. Fast mode is priced at 2x the applicable rates."
- Ultrafast 的 6 倍为表格数字推算（60 / 10），页面未以文字写明倍数，标注"由表格推算"。
- Ultrafast 官方说明见 changelog（Sep 29 与 Oct 8，2026）："reduce the time between generated output tokens"，适用 gpt-6-astra 与 gpt-6.1-sol。

### A3. 页面声明（2026-10-09 读取）
- 数据驻留（Regional processing）端点对 2026-03-05 及之后发布的模型加收 10%；FedRAMP 端点加收 10%。
- Priority processing 于 2026-07-30 更名为 Fast mode。
- GPT-5.6 Sol 促销价至少持续到 2026-11-21。
- gpt-6-astra 模型页："Prompts with more than 272K input tokens are priced at 2x input and cache rates and 1.5x output for the full request."
- gpt-5.5 / gpt-5.4 模型页："prompts with >272K input tokens are priced at 2x input and 1.5x output for the full session for standard, batch, and flex."

## B. 补查的其他模型（模型页，2026-10-09）

| 模型 | 上下文 | 最大输出 | 知识截止 | 价格（美元 / 百万 token） | 来源 |
|---|---|---|---|---|---|
| gpt-5.5-pro | 1,050,000 | 128,000 | Dec 01, 2025 | 输入 30.00 / 输出 180.00；无缓存价 | https://developers.openai.com/api/docs/models/gpt-5.5-pro |
| gpt-5.4 | 1,050,000 | 128,000 | Aug 31, 2025 | 输入 2.50 / 缓存输入 0.25 / 输出 15.00 | https://developers.openai.com/api/docs/models/gpt-5.4 |
| gpt-5.4-mini | 400,000 | 128,000 | Aug 31, 2025 | 输入 0.75 / 缓存 0.075 / 输出 4.50 | https://developers.openai.com/api/docs/models/gpt-5.4-mini |
| gpt-oss-120b | 131,072 | 131,072 | Jun 01, 2024 | 模型页未标注 API 价格（未核实） | https://developers.openai.com/api/docs/models/gpt-oss-120b |
| gpt-oss-20b | 未在本页读出（未核实） | 未核实 | 未核实 | 未核实；页面说明为 21B 参数、3.6B 激活，Apache 2.0，可调推理强度 | https://developers.openai.com/api/docs/models/gpt-oss-20b |

注：gpt-5.5-pro 推理档位为 medium / high（默认）/ xhigh；gpt-6-astra 推理档位为 low / medium / high / xhigh / max。gpt-5.5 页面声明 Fine-tuning 不支持。

## C. Prompt Caching 规则（官方文档，2026-10-09）

来源：https://developers.openai.com/api/docs/guides/prompt-caching

- 默认开启：支持的模型默认启用，无需显式参数。
- 折扣：页面称缓存输入最多可省 95%。GPT-5.6 及之后：缓存读取为未缓存输入价的 0.1 倍（GPT-6.1 Sol 为 0.05 倍，与 A1 表核对一致：astra 10 → 1.00，sol 2 → 0.10）。
- 缓存写入：GPT-5.6 及之后按未缓存输入价的 1.25 倍计费（与 A1 表核对一致：astra 10 → 12.50）。缓存写入不是额外附加费，输入 token 只按未缓存、缓存读取或缓存写入三者之一计费。
- 最小可缓存长度：GPT-5.6 及之后为 1,024 个可见输入 token（OpenAI 隐藏系统内容不计入）。更早的模型"随请求设置（工具、图片、输出 schema、推理强度、详细程度）而变化"，具体数值未核实。
- 缓存生命周期（TTL）：
  - GPT-5.6 及之后：通过 prompt_cache_options.ttl 设置，支持值 "30m"；至少 30 分钟，自上次写入或命中起算，命中会刷新寿命且不再收写入费。
  - 更早的模型：通过 prompt_cache_retention 设置，"in_memory"（约 5–10 分钟不活跃）或 "24h"（最长 24 小时）。"24h" 支持的模型包括 gpt-5.5、gpt-5.5-pro、gpt-5.4、gpt-5.2、gpt-5.1 系列、gpt-5 系列、gpt-4.1 等（页面脚注列表）。
- 断点与匹配：需要整段前缀完全一致才能命中；内容或相关设置变化后，之后的前缀无法命中。GPT-5.6+ 支持显式断点（prompt_cache_breakpoint）与隐式断点（prompt_cache_options.mode）。
- 缓存位置：缓存保存在单台机器上，同一组织与处理区域内路由；不在组织之间共享，不跨区域处理边界复用；单机流量超过约 15 RPM 时可能溢出路由，降低命中率。
- prompt_cache_key：可选，用于区分缓存计费或优化路由（早期模型建议使用稳定值）。

## D. Batch / Flex / Fast 档位规则

- Batch 与 Flex：标准价的 50%（模型页原文）。Batch 的完成窗口与队列限额本次未核实。
- Fast（原 Priority）：标准价的 2 倍（gpt-6-astra 模型页原文）。
- Ultrafast：表格推算约为标准价 6 倍（见 A2，页面未以文字写明倍数）。通过 service_tier: "ultrafast" 启用，目标是降低输出 token 之间的时间间隔；适用 gpt-6-astra 与 gpt-6.1-sol（changelog Sep 29 与 Oct 8，2026）。
- Flex 请求参数值、可用模型清单：本次 Flex 专页未能读取，未核实。

## E. Rate limit 分级（官方页面，2026-10-09）

来源：https://developers.openai.com/api/docs/guides/rate-limits ；changelog 显示 2026-10-06 起由五档简化为三档。

| 档位 | 达到条件（累计充值） | 月度用量上限 |
|---|---|---|
| Free | 仅允许的地区 | $100 / 月 |
| Build | $5 | $500 / 月 |
| Launch | $100 | $5,000 / 月 |
| Grow | $500 | $200,000 / 月 |

标准限额（Standard，RPM / TPM）：

| 档位 | Astra / Sol / Terra | Luna |
|---|---|---|
| Build | 5,000 / 1,000,000 | 5,000 / 2,000,000 |
| Launch | 10,000 / 4,000,000 | 10,000 / 10,000,000 |
| Grow | 15,000 / 40,000,000 | 30,000 / 180,000,000 |

- 页面说明 Ultrafast 限额与标准限额不同（未展开数字，未核实）。
- 上文 gpt-5.5 页面表（Build 5,000 / 1,000,000，Launch 10,000 / 4,000,000，Grow 15,000 / 40,000,000）与本表 Astra/Sol/Terra 列一致。
- 旧版 Tier 1–5 门槛已被本页替换，不再适用。

## F. Agents SDK、Agents API、Computer use

- Agents API：changelog 记录 "Released the Agents API in public beta. Build agents with a managed Codex harness while OpenAI handles session orchestration, context compaction, and recovery"（公测发布日期未核实）。
- Computer use 进入 Agents API：2026-09-29（changelog）："Agents can complete tasks in an OpenAI-hosted browser, with website access approvals and sign-in handled by your application."
- Agents SDK：changelog 记录其发布（具体日期未核实）；本次未能打开官方 Agents SDK 指南（链接 developers.openai.com/api/docs/guides/agents 重定向到了 Claude 文档站，不采信）。
- Computer use 计费：定价页声明 "tool-specific models, like search and computer use, there's a fee per tool call"，但未给出单价，计费数字未核实。

## G. 发布日期（changelog，2026-10-09）

来源：https://developers.openai.com/api/docs/changelog

| 模型 | 日期 | changelog 原文要点 |
|---|---|---|
| gpt-5.2 | 2025-12-11（年份依据段落标题推断，未直接核实） | "Released GPT-5.2, the newest flagship model" |
| gpt-5.4 / gpt-5.4 mini / nano | 2026-03-05 | "Released GPT-5.4, our newest frontier model" |
| gpt-5.5 / gpt-5.5-pro | 2026-04-24 | "Released GPT-5.5, a new frontier model ..." |
| gpt-6-astra | 2026-09-03 | "Released GPT-6 Astra, our most capable model" |
| gpt-6-sol / gpt-6-luna | 2026-09-22 | "Released GPT-6 Sol (gpt-6-sol) and GPT-6 Luna (gpt-6-luna)" |
| gpt-6.1-sol | 2026-09-29 | "Released GPT-6.1 Sol ... at a lower cost than GPT-6 Astra" |
| gpt-5.6-sol / terra / luna | 2026-07-09 | "Released the GPT-5.6 model family ..." |
| gpt-6-luna Decisions API（beta） | 2026-10-06 | "Released the Decisions API in beta with gpt-6-luna" |
| chat-latest（ChatGPT 同款） | 2026-10-07 更新 | 指向 ChatGPT 最新版；官方建议生产用 GPT-6 系列 |

注：日期年份依据 changelog 段落标题（如 "September, 2026"）推断。

## H. 能力边界与社区评价

- 官方能力说明：gpt-6 系列为"文本与图片输入、文本输出"（模型索引页）。gpt-6-astra 适用于复杂推理、编程、computer use、研究与文档创作。
- 幻觉、长上下文衰减、延迟、拒答：官方无系统性说明（本次未找到 Model guidance 的对应段落），未核实。
- 社区实测：
  - Reddit：未获取（搜索与公开 JSON 接口未返回结果），未核实。
  - Hacker News：未获取（Algolia 公开接口未返回结果），未核实。
  - GitHub：未获取（搜索未返回相关结果），未核实。
  - 知乎 / B站 / YouTube：仅获得搜索摘要，无实测内容，未核实。
  - 仅摘要可引用的条目：
    - 腾讯新闻，2026-10-08，"OpenAI 全面上线 GPT-6：GPT-5.6 系列正式退场……"，摘要称 GPT-6 面向全部 ChatGPT 免费与付费用户上线，逐步取代 GPT-5.6 Sol 与 GPT-5.6 Luna。https://news.qq.com/rain/a/20261008A039BL00（仅摘要）
    - chatgpt-guides.com（第三方指南站，非官方）：摘要称站内新增"GPT-6 Astra 官方信息"，不构成实测。https://chatgpt-guides.com/（仅摘要）
- 与 Claude / Gemini / 国产模型对比：仅能确认 Anthropic 官方模型页当前列出 Claude Opus 5.5（官方推荐用于多数工作负载）、Claude Fable 5.1、Claude Sonnet 5.5、Claude Haiku 5.5（https://platform.claude.com/docs/en/models/overview，2026-10-09 浏览器读取，仅官方型号列表）。性能、价格对比与开发者口碑：未核实。

## I. 补查后仍未核实清单

1. gpt-oss-120b / gpt-oss-20b 的 API 价格；gpt-oss-20b 的上下文窗口与最大输出。
2. Ultrafast 的倍数（页面未写明，本文按表格推算为 6 倍）；Ultrafast 限额数字。
3. Flex 的请求参数值与可用模型清单；Batch 的完成窗口与队列限额。
4. Prompt Caching 中早期模型（gpt-5.5 之前）的最小可缓存长度。
5. Agents API 公测发布日期；Agents SDK 当前官方文档与版本。
6. Computer use 每次调用价格。
7. gpt-5.6-terra、gpt-5.6-luna 的单模型价格与上下文（定价页未单列）。
8. gpt-5、gpt-5-mini、gpt-5-nano、gpt-5.2、gpt-4.1、gpt-4o、o3-pro 等的价格与上下文（本次未逐页打开）。
9. gpt-image-2 的上下文与参数（定价页 Image 表有 输入 $4.00 / 缓存 $1.00 / 输出 $15.00，但其余参数未核实）；text-embedding-3 系列、gpt-realtime-1.5、gpt-audio-1.5 的单模型价格与上下文。
10. 视频模型名称与价格。
11. 幻觉、长上下文衰减、延迟、拒答等能力短板的官方与实测数据。
12. Reddit / Hacker News / GitHub / 知乎 / B站 / YouTube 的带链接开发者实测（本次均未获取）。
13. 与 Claude / Gemini / 国产模型的性能与价格对比（本次仅有 Anthropic 型号列表）。
14. platform.openai.com 与 openai.com/api/pricing 的直接抓取（均返回 403）；OpenAI 官方 .md 文档（返回 403）。
15. WebFetch 工具在本次补查中因分类器暂时不可用而失败，相关页面改用浏览器读取。
