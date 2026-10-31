---
title: "DeepSeek / 阿里通义千问 Qwen / 月之暗面 Kimi 调研（2026-10-09）"
---

# DeepSeek / 阿里通义千问 Qwen / 月之暗面 Kimi 调研（2026-10-09）

> 查证日期：2026-10-09。来源标记说明：【官方】= 官方文档/定价页直接抓取；【二手】= 第三方博客、新闻或聚合站（需以官方为准）；【未核实】= 未找到可靠来源或来源互相矛盾，**不可直接引用数字**。
> 本次未覆盖：LMArena / Artificial Analysis 独立榜单具体分数、SWE-bench / LiveCodeBench 独立复测、B站/知乎/掘金/CSDN/linux.do/GitHub 社区实测、与 GPT/Claude/Gemini 的系统性性价比对比、私有化部署显存数据。以上均在第 7 节列为待补项。

---

## 0. 总览（5 行）

1. **DeepSeek** 当前最新为 DeepSeek-V4.1-Flash（2026-09-10 发布），API 模型名 `deepseek-flash`；旗舰 V4-Pro（模型名 `deepseek-v4-pro`）仍在售。价格最低，支持峰谷价（谷时半价）。
2. **阿里 Qwen** 当前最新旗舰为 Qwen3.8-Max（2026-08-03 发布，Max-0902 为 9 月升级版），另有 Qwen3.8-Flash、Qwen3.7-Plus 等在售；Qwen4 仅官方宣布"训练中"，未发布。
3. **Kimi** 当前旗舰为 Kimi K3（2026-07-16 发布，2.8T 参数，1M 上下文），官方价格 K3 输出 ¥100/M 为三家中最贵；K2 系列中 K2.8 Preview（2026-09-11，二手来源）未见于官方定价页。
4. 三家都提供 OpenAI 兼容接口；DeepSeek 官方提供 Anthropic 兼容接口（`https://api.deepseek.com/anthropic`，官方页明示）；Kimi 与百炼的 Anthropic 兼容接口信息来自二手资料，地址存在多版本说法，需到官方页核对。
5. 最大风险点：**Qwen3.8-Max 与 Kimi K3 的参数量、开源协议、权重发布状态存在多源冲突**，已在第 7 节列为未核实；DeepSeek 的价格与上下文数据最可靠（官方页直取）。

---

## 1. DeepSeek

### 1.1 在售模型

| 项目 | DeepSeek-V4.1-Flash（API: `deepseek-flash`） | DeepSeek-V4-Pro（API: `deepseek-v4-pro`，版本 V4-Pro-0813） |
|---|---|---|
| 发布时间 | 2026-09-10【官方 更新日志】 | 预览 2026-04-24；GA 2026-08-13【官方 更新日志】 |
| 架构 | 官方称"新架构家族中最小的模型，原生多模态视觉"【官方】。总参数 552B（SiliconANGLE 报道，据称 V4-Flash 为 284B）【二手】；激活参数【未核实】 | MoE，总参数 1.6T、激活 49B【二手：April 预览报道，来源 platform.teamai.com / 搜索摘要】；GA 版参数【未核实】 |
| 开源协议 | MIT【二手：llm-stats.com 摘要】 | 权重开源【二手】；具体协议【未核实】 |
| 上下文窗口 | 1M【官方 价格页】 | 1M【官方 价格页】 |
| 最大输出 | 384K（官方标注 MAXIMUM 384K）【官方 价格页】 | 384K【官方 价格页】 |
| 思考模式 | 思考/非思考双模式，默认思考；思考强度 low/high/max【官方 更新日志 2026-08-13】 | 同左 |
| 多模态 | 支持视觉输入【官方 价格页】 | 不支持视觉【官方 价格页】 |
| 功能 | JSON Output、Tool Calls、Responses API、Anthropic API、Chat Prefix Completion(Beta)、FIM(Beta，仅非思考)【官方】 | 同左（FIM 仅非思考） |

来源：
- 价格页：https://api-docs.deepseek.com/quick_start/pricing/ （查证 2026-10-09）
- 更新日志：https://api-docs.deepseek.com/updates/ （查证 2026-10-09）
- 快速入门：https://api-docs.deepseek.com/news/news （查证 2026-10-09）

**V4-Pro 调用注意**：官方更新日志称，2026-09-14 后继续提供 V4-Pro API 服务，计费不变，并将在有变动时另行通知【官方】。

**旧模型名下线**：`deepseek-v4-flash`、`deepseek-v4-flash-vision-exp` 已退役，请求被路由到 V4.1-Flash 并按 Flash 价格计费【官方】。`deepseek-chat` / `deepseek-reasoner` 的下线日期为 2026-07-24（官方 2026-04-24 公告），**已过期，请勿再用**【官方 更新日志】。

### 1.2 API 价格（官方价格页，单位：美元 / 百万 tokens）

官方价格页只给美元价格，**未列人民币价格，人民币未核实**。

| 模型 | 缓存命中（谷时 / 峰时） | 缓存未命中（谷时 / 峰时） | 输出（谷时 / 峰时） |
|---|---|---|---|
| deepseek-flash（V4.1-Flash） | $0.003 / $0.006 | $0.15 / $0.30 | $0.60 / $1.20 |
| deepseek-v4-pro | $0.022 / $0.044 | $0.66 / $1.32 | $1.98 / $3.96 |

- **峰谷规则（官方）**：峰时 UTC 01:00–04:00 与 06:00–10:00，周一至周五，中国法定节假日除外；其余时段（含周末、节假日）为谷时，谷价为峰价的一半。
- **阶梯计价**：官方价格页未显示阶梯，**无阶梯**（以官方页为准）。
- **并发上限**（官方）：deepseek-flash 2500，deepseek-v4-pro 500。
- **免费额度**：官方价格页未列；注册赠送额度【未核实】。
- **Batch 接口**：官方价格页未提及【未核实，视为无】。
- **OpenAI 兼容**：是。`base_url = https://api.deepseek.com`【官方】。
- **Anthropic 兼容**：是。`base_url = https://api.deepseek.com/anthropic`【官方】。
- **Responses API**：是，并对 Codex 做了适配【官方 更新日志 2026-08-13】。
- 价格调整：V4.1-Flash 发布时 API 价格再次下调（官方表述"prices have been reduced accordingly"，未给出旧价对比）【官方】。

### 1.3 能力与基准（官方公布，未经独立复测）

**V4.1-Flash（官方 2026-09-10 公布，DeepSeek 自测）**：GPQA Diamond 90.9；HLE 36.8（纯文本子集 39.1）；Codeforces Rating 3471；MathArena Apex 65.6；Terminal-Bench 2.1 90.6；Terminal-Bench 3.0 30.0；Terminal-Bench 4.0 31.2；DeepSWE v1.1 74.2；ProgramBench 20.3；NL2Repo-Bench 65.4；CyberGym 88.1；HLE（带工具）63.9；Agents' Last Exam 31.8。来源：https://api-docs.deepseek.com/updates/ （官方，2026-10-09 查证）

**V4-Pro GA（官方 2026-08-13）**：HLE 42.7 / 带工具 60.0；Terminal-Bench 2.1 87.9；NL2Repo 61.5；CyberGym 83.3；DeepSWE 62.7；Toolathlon-Verified 74.1；Agents' Last Exam 25.7；AutomationBench 31.8【官方】。

**二手对比（未核实）**：某二手报道称 V4.1-Flash 在 Terminal-Bench 2.1 上略高于 Opus 5（89.1）和 GPT-5.6 Sol（88.8）。这些对手分数来自 DeepSeek 自己的表格或转引，**独立性未核实，不可直接引用**。

**工具调用 / Agent**：官方称 Agent 能力为重点升级方向，并支持 Claude Code、GitHub Copilot、OpenCode 等工具直接以 DeepSeek 为后端【官方 快速入门页】。

**独立榜单（LMArena / Artificial Analysis / LiveCodeBench）**：本次未查到可直接引用的具体分数【未核实】。

### 1.4 能力边界与短板（来自搜索摘要，未逐条验证）

- 有二手资料指出 "R2" 未正式发布，所有 R2 说法视为传闻【二手，未核实】。
- 官方历史公告中多次出现 "reduced Chinese-English mixing and occasional abnormal characters"（2025-09-22 Terminus 更新提到的语言一致性问题）；**当前版本是否仍存在，未核实**。
- 限流：并发上限见 1.2；具体 RPM/TPM 限制【未核实】。
- 海外访问、数据出境与合规：官方文档未在本次抓取页中展开【未核实】。

---

## 2. 阿里通义千问 Qwen

### 2.1 在售模型（官方模型列表页 + 二手资料）

官方模型列表页（阿里云百炼"选择模型"）显示当前文本生成类在售模型包括：`qwen3.8-max`、`qwen3.7-plus`、`qwen3.8-flash`，以及第三方的 `deepseek-v4-pro-0813`、`deepseek-v4.1-flash`、`kimi/kimi-k3`、`glm-5.2`、`MiniMax-M3`、`mimo-v2.5-pro` 等【官方 百炼模型列表页】。
来源：https://help.aliyun.com/zh/model-studio/models （查证 2026-10-09）

| 系列 | 模型 ID | 发布 / 状态 | 备注 |
|---|---|---|---|
| 千问 Max | qwen3.8-max | 2026-08-03 发布【二手：DataCamp/SCMP 摘要】 | 旗舰；官方价格页在售【官方】 |
| 千问 Max | qwen3.8-max-0902 | 2026-09-02 发布【二手】 | 编程与 Agent 后训练升级【二手】 |
| 千问 Max | qwen3.8-max-prime | 在售【官方 价格页】 | "优速模式（Prime）"，价格更高 |
| 千问 Plus | qwen3.7-plus | 在售【官方 百炼模型列表 / 价格页】 | 支持思考与非思考 |
| 千问 Flash | qwen3.8-flash | 在售【官方 价格页】 | 低价快速档 |
| 千问 Flash | qwen3.7-flash | 在售【官方 价格页】 | 当前能力等同 2026-07-15 版 |
| 千问 Coder | qwen3-coder-plus / qwen3-coder-flash | 在售【官方 价格页】 | 旧一代编程模型，仍在价格表中 |
| 千问 Omni | qwen3.8-omni-flash / -realtime | 在售【官方】 | 全模态 |
| 千问 VL | qwen3-vl-plus / qwen3-vl-flash | 在售【官方】 | 视觉理解 |
| 千问 OCR | qwen3.5-ocr 等 | 在售【官方】 | |
| 向量/重排序 | qwen3.7-text-embedding(-flash)、qwen3.7-text-rerank | 在售【官方】 | |

**Qwen3.8 开源权重（未核实）**：二手资料称 Qwen3.8-27B（27.8B 稠密，Apache 2.0，2026-08-14 发布，带视觉编码器，262K 原生上下文）【二手】；同时称 Max 级权重以 `Qwen3.8-2.4T-A95B` 形式发布，协议为自定义许可【二手，互相矛盾，未核实】。**Qwen3.8-Max 是否开源、参数是否为 2.4T，均未核实。**
- 二手来源：https://www.datacamp.com/blog/qwen3-8-max 、https://simonwillison.net/2026/Aug/16/qwen-38-27b/ 、https://www.scmp.com/tech/article/3362738/alibabas-ai-model-qwen38-max-made-widely-accessible-ahead-open-weights-release
- 官方 GitHub 仓库搜索结果：https://github.com/QwenLM/Qwen3.8 （该页直接抓取失败，未核实内容）

**Qwen3.5 / 3.6（二手）**：Qwen3.5 于 2026-02-16 发布，首发 397B-A17B MoE【二手】；Qwen3.6-35B-A3B 于 2026-04-16 上线 HF/ModelScope【二手】。

**Qwen4**：阿里 2026-09-22 Apsara 大会宣布"Qwen 4 训练中"，规划 Qwen 4.5 / Qwen 5，参数规模路线 5–10T【二手】。**无发布日期、价格、权重**。Qwen4 的分档（Max/Flash/Plus/27B）仅来自大会报道，未在官方新闻稿中列出【二手，未核实】。**不得将 Qwen4 视为在售模型。**

### 2.2 API 价格（官方价格页，人民币元 / 百万 tokens）

来源：https://help.aliyun.com/zh/model-studio/model-pricing （查证 2026-10-09；页面超长，本次截取到"千问 Coder"部分，**Qwen3.8 系列价格已读取**，其余模型以官网为准）

| 模型 | 输入（非思考/思考） | 输出 | 阶梯 / 备注 |
|---|---|---|---|
| qwen3.8-max（华北2 / 全球） | 12 元 | 36 元 | 0<Token≤1M 单档；支持 Batch 半价；支持上下文缓存折扣 |
| qwen3.8-max（新加坡 国际） | 14.988 元 | 44.965 元 | 同上 |
| qwen3.8-max（美国） | 14.988 元 | 44.965 元 | 同上 |
| qwen3.8-max-prime | 24 元 | 72 元 | 优速模式，无免费额度 |
| qwen3.7-plus（华北2，≤256K） | 原价 2 元（限时 8 折） | 原价 8 元（限时 8 折）思考模式 | 256K<Token≤1M：6 元 / 24 元（同为限时 8 折） |
| qwen3.8-flash（华北2） | 0.8 元 | 2.7 元 | 0<Token≤1M 单档；有免费额度 |
| qwen3.7-flash（华北2，≤32K） | 0.2 元 | 0.8 元 | 32K–256K：0.6 / 2.4；256K–1M：1.2 / 4.8；支持 Batch 半价 |
| qwen3-coder-plus（≤32K） | 4 元 | 16 元 | 32K–128K：6 / 24；128K–256K：10 / 40；256K–1M：20 / 200 |
| qwen3-coder-flash（≤32K） | 1 元 | 4 元 | 阶梯同上结构 |

- **阶梯计价**：有。规则为"单次请求输入 Token 总量决定整次请求单价"【官方】。
- **Batch 调用**：多数文本模型标注"Batch 调用半价"【官方】。
- **上下文缓存**：标注"上下文缓存享有折扣"；显式缓存创建为标准输入单价的 125%，命中为 10%【官方 价格页说明】。
- **免费额度**：仅华北2（北京）地域提供，有效期 90 天（自开通/模型发布/申请通过之日起，以较晚者为准）；其他地域无免费额度【官方】。
- **美元价格**：官方价格页仅列人民币。美元价格【未核实】（不做换算以避免汇率误差）。
- **错峰折扣**：官方页面未见"错峰"字样，仅见 Batch 半价【官方】。
- **OpenAI 兼容**：百炼 OpenAI 兼容模式【官方页面未直接核实，视为有，需确认】。
- **Anthropic 兼容**：百炼提供 Anthropic 协议兼容端点，二手资料给出 `https://dashscope.aliyuncs.com/apps/anthropic`，Coding Plan 与 Token Plan 另有专属地址【二手，来源：https://developer.aliyun.com/article/1761075 、https://help.aliyun.com/zh/model-studio/claude-code（该页未直接抓取，未核实）】。

### 2.3 能力与基准

- **Qwen3.8-Max 基准**：二手资料称其在 Terminal-Bench/SWE 类任务上有成绩，但具体数字来自转引，**未核实**。
- **Qwen3.8-27B 社区反馈（二手）**：Simon Willison 称该模型"很出色，但默认过度思考"【二手：https://simonwillison.net/2026/Aug/16/qwen-38-27b/】。
- **多模态**：官方列表显示 Qwen3.8 系列具备图像、视频、语音、全模态能力【官方 模型列表页】。
- **工具调用 / Agent / 思考模式**：Qwen3.7-Plus、Qwen3.8-Max 等标注支持"思考模式"与"非思考模式"切换【官方 价格页】。
- **独立榜单分数（LMArena / AA / LiveCodeBench）**：未查到可引用数字【未核实】。

### 2.4 能力边界与短板

- Qwen3.8-27B 的"过度思考"问题（二手，见上）。
- 免费额度仅华北2地域，海外用户需注意地域与价格差异（官方）。
- 区域价格差异显著：同一模型在美国、新加坡、德国的价格高于中国大陆区（官方价格页，如 qwen3.8-max 美国/新加坡 14.988/44.965 元 vs 全球 12/36 元）。
- 数据出境与合规：【未核实】。

---

## 3. 月之暗面 Kimi

### 3.1 在售模型

| 模型 | 发布时间 | 架构 | 上下文 | 状态 |
|---|---|---|---|---|
| **kimi-k3**（旗舰） | 2026-07-16【二手：Fortune 报道标题日期 https://fortune.com/2026/07/16/moonshots-kimi-k3-pushes-chinese-ai-into-fable-level-territory/】；完整权重 2026-07-27【二手】 | 官方：总参数 2.8T；KDA 混合线性注意力 + Attention Residuals；MoE，896 专家激活 16 个（+2 共享专家【二手】）；原生视觉 | **1,048,576 tokens（官方）** | 在售【官方 K3 页】 |
| kimi-k2.7-code | 2026-06-12【二手】 | 【未核实】 | 262,144【官方 价格页】 | 在售【官方】 |
| kimi-k2.7-code-highspeed | 【未核实】 | 【未核实】 | 262,144【官方】 | 在售【官方】 |
| kimi-k2.6 | 2026-04-20【二手】 | 1T MoE 开源权重【二手】 | 262,144【官方】 | 在售【官方】 |
| kimi-k2.8-preview | 2026-09-11【二手，未在官方定价页出现】 | 多模态，定位在 K2.7 Code 与 K3 之间【二手】 | 1M【二手】 | **状态未核实，不建议引用** |

**K3 参数的冲突（重要）**：
- 官方 K3 页称 **2.8 万亿参数**，并称"全球首个开源的 3 万亿级别模型"【官方】。
- 二手资料给出激活参数约 **104B**（Artificial Analysis 页面等）；其他二手称约 50B（HF 社区帖）或 50–60B（Substack）【二手，互相矛盾，**激活参数未核实**】。
- 来源：https://platform.kimi.com/docs/guide/kimi-k3-quickstart.md （官方，2026-10-09 查证）；https://artificialanalysis.ai/models/kimi-k3 （未抓取，未核实）

**K3 开源协议**：二手资料称为"Kimi K3 License"（修改版 MIT）【二手，未核实】。**商用前必须核对 Hugging Face 上 `moonshotai/Kimi-K3` 的 LICENSE 文件**（该 HF 页本次抓取失败，见第 7 节）。

**K2 系列开源协议**：【未核实】。

### 3.2 API 价格（官方价格页，人民币元 / 百万 tokens）

来源：https://platform.kimi.com/docs/pricing/chat.md （原页面 chat-k3，查证 2026-10-09，官方文档）

| 模型 | 缓存写入 TTL 5min | 缓存写入 TTL 1h | 输入·缓存命中 | 输入·缓存未命中 | 输出 | 上下文 |
|---|---|---|---|---|---|---|
| **kimi-k3** | ¥20.00 | ¥40.00 | ¥2.00 | ¥20.00 | **¥100.00** | 1,048,576 |
| kimi-k2.7-code | — | — | ¥1.30 | ¥6.50 | ¥27.00 | 262,144 |
| kimi-k2.7-code-highspeed | — | — | ¥2.60 | ¥13.00 | ¥54.00 | 262,144 |
| kimi-k2.6 | — | — | ¥1.10 | ¥6.50 | ¥27.00 | 262,144 |

- **阶梯计价**：官方 K3 说明"计费不按上下文长度分段"【官方 K3 FAQ】。
- **美元价格**：官方页仅列人民币。二手资料称 K3 为 $3/M 输入、$15/M 输出，但 OpenRouter 另有 $0.45 输入、$13 输出的说法，**二者冲突，美元价格未核实**。
- **免费额度**：新用户注册认证赠 ¥15 代金券，**不可用于 K3**（官方 K3 FAQ）；K3 需充值至少 ¥10 才能解锁【官方】。
- **缓存**：自动前缀缓存，TTL 5m（默认）/ 1h，缓存按块存储（官方）。
- **Batch / 错峰折扣**：官方定价页未见，【未核实】。
- **文件接口**：文件内容抽取与文件存储限时免费（官方）。
- **OpenAI 兼容**：是。`base_url = https://api.moonshot.cn/v1`【官方 K3 快速入门】。
- **Anthropic 兼容**：有 Anthropic 协议端点，但**官方地址存在冲突**：二手资料提到 `https://api.moonshot.ai/anthropic`（国际）、`https://api.kimi.ai/coding/`（Kimi Code 订阅）、`https://api.kimi.com/coding/`（订阅变体）等，且 `platform.kimi.ai` 与 `platform.kimi.com` 两个域名并存【二手，未核实】。使用前请到 Kimi 官方"Claude Code 接入"页核对。

**K3 推理强度与参数（官方）**：
- 始终开启思考；`reasoning_effort` 支持 `low / high / max`，默认 `max`【官方】。
- `max_completion_tokens` 默认 131,072，最大 1,048,576【官方】。
- `temperature=1.0`、`top_p=0.95` 等为固定值，不建议显式传入【官方】。
- 视觉输入不支持公网图片 URL，需 base64 或 `ms://<file-id>`【官方】。
- 联网搜索工具"正在更新，近期不建议用于生产"【官方】。
- 支持结构化输出（JSON Schema strict）、Partial Mode、工具调用、动态加载工具【官方】。

### 3.3 能力与基准

**官方公布（K3）**：长程编程、知识工作、视觉推理能力强；具体基准分数以技术博客为准（https://www.kimi.com/blog/kimi-k3，本次未抓取【未核实】）。

**二手转引（未核实）**：BrowseComp 90.4（完整上下文）/ 91.2（300K 时压缩）；FrontierSWE 81.2；Terminal-Bench 2.1 88.3；AA-LCR v1.1 74.7【二手，独立复测未核实】。
- 长上下文：一篇分析称其 NIAH / RULER / LongBench 结果未公开，精确事实检索能力未核实【二手】。

**独立榜单**：Artificial Analysis、LMArena、SWE-bench 具体分数【未核实】。

### 3.4 能力边界与短板

- 思考无法关闭（K3 始终思考），简单任务成本与延迟偏高【官方 FAQ】。
- 价格偏高：K3 输出 ¥100/M，为本次调研中三家最高档之一（与 DeepSeek 对比见第 5 节）。
- 充值门槛与限速：累计充值决定账户等级与 RPM/TPM/TPD；官方公告称 8 月将调整"充值等级与限速"规则，因高频异常请求影响稳定性【官方 K3 快速入门页的公告】。
- Kimi Code 订阅与开放平台按量计费是两套产品，官方明确"不提供订阅制方案于开放平台"【官方 价格页】。

---

## 4. 价格横向速览（人民币，仅官方可核实项）

| 模型 | 输入·未命中（元/M） | 输入·命中（元/M） | 输出（元/M） | 来源 |
|---|---|---|---|---|
| Kimi K3 | 20 | 2 | 100 | 官方 |
| Kimi K2.6 | 6.5 | 1.1 | 27 | 官方 |
| Qwen3.8-Max（全球/华北） | 12 | 【未核实】 | 36 | 官方 |
| Qwen3.7-Plus（≤256K，限时8折前） | 2 | 【未核实】 | 8（思考） | 官方 |
| Qwen3.8-Flash | 0.8 | 【未核实】 | 2.7 | 官方 |
| DeepSeek V4.1-Flash（美元） | $0.15 谷 / $0.30 峰 | $0.003 谷 / $0.006 峰 | $0.60 谷 / $1.20 峰 | 官方 |
| DeepSeek V4-Pro（美元） | $0.66 谷 / $1.32 峰 | $0.022 谷 / $0.044 峰 | $1.98 谷 / $3.96 峰 | 官方 |

> 注意：DeepSeek 为美元定价，国产两家为人民币定价，**不能直接比较数值**，需按当日汇率换算，本次未换算以免引入误差。

---

## 5. 与 GPT / Claude / Gemini 对比与社区口碑

- **本次未完成**：未对 OpenAI、Anthropic、Google 的当前价格与基准做官方页抓取，因此无法给出可靠的性价比结论【未核实】。
- 仅有的二手对比：V4.1-Flash 的 Terminal-Bench 数字被媒体拿来与 Opus 5、GPT-5.6 Sol 比较（来源为 DeepSeek 自测转引，见 1.3）。
- 社区口碑：Simon Willison 对 Qwen3.8-27B 给出"能力好、过度思考"的评价（二手）。B站、知乎、掘金、CSDN、linux.do、YouTube、GitHub Issue 的实测均未完成抓取（见第 7 节）。

---

## 6. 私有化 / 本地部署可行性

- **DeepSeek V4**：权重公开（HF，二手报道称 V4-Flash-0731 约 166.9 GB、48 分片）【二手】；vLLM/SGLang 支持、显存需求【未核实】。
- **Qwen3.8-27B**：27.8B 稠密，二手称可单卡部署【二手，未核实】；官方部署文档未抓取。
- **Kimi K3**：二手资料提到 Unsloth 有本地运行指南（https://unsloth.ai/docs/models/kimi-k3）、有 MXFP4 量化版本【二手】；2.8T 体量的显存需求【未核实】，**对个人或小团队私有化基本不可行，除非使用量化与多机方案，需实测**。
- 推理框架（vLLM / SGLang）对三家新模型的官方支持状态【未核实】。

---

## 7. 未核实 / 待补清单

**需要用户或后续调研优先处理：**

1. **Kimi K3 激活参数**：官方 2.8T；二手 104B / 50B / 50–60B 三种说法冲突。
2. **Kimi K3 开源协议**：二手称修改版 MIT（"Kimi K3 License"）；需读取 HF `LICENSE` 文件（HF 页面本次抓取失败）。
3. **Kimi K3 美元价格**：$3/$15 与 $0.45/$13 两种说法冲突；官方仅 ¥ 价格。
4. **Kimi Anthropic 兼容端点地址**：多个域名（.ai / .com）与路径（`/anthropic`、`/coding/`）并存，需以 Kimi 官方 Claude Code 接入页为准。
5. **Kimi K2.8 Preview**：二手称 2026-09-11 发布，但**未出现在官方价格页**，状态与价格未核实。
6. **Qwen3.8-Max 参数与开源**：二手称 2.4T-A95B 且为自定义许可开源；另一说法为未开源，**互相矛盾**。
7. **Qwen3.8-Max 基准分数**：未查到可靠独立数字。
8. **Qwen 百炼 Anthropic 端点**：`https://dashscope.aliyuncs.com/apps/anthropic` 来自二手教程，官方 Claude Code 页未直接抓取。
9. **百炼美元价格、Batch 与错峰细节**：官方页仅列人民币；价格页因长度被截断，Qwen3.5/3.6 部分价格未逐条核对。
10. **Qwen4**：仅大会宣布，无发布日期与价格。
11. **DeepSeek 人民币价格**：官方仅美元价格。
12. **DeepSeek V4-Pro 激活参数与 V4.1-Flash 激活参数**：仅 V4-Pro 一个二手来源（1.6T / 49B），V4.1-Flash 激活参数未核实。
13. **DeepSeek 与 Qwen、Kimi 的 Batch 接口**：DeepSeek 未见；Kimi 未见。
14. **全部独立榜单（LMArena、Artificial Analysis、SWE-bench、LiveCodeBench）**：未抓取。
15. **社区实测（B站、知乎、掘金、CSDN、linux.do、YouTube、GitHub）**：未抓取。抖音未尝试。
16. **GPT / Claude / Gemini 同价位对比**：未抓取。
17. **私有化部署显存数据、vLLM/SGLang 支持状态**：未核实。
18. **数据出境与合规条款**：三家的隐私政策与数据存储地未核实。
19. **HF 与 GitHub 页面**：`huggingface.co/moonshotai/Kimi-K3`、`huggingface.co/deepseek-ai/DeepSeek-V4-Pro`、`huggingface.co/Qwen/Qwen3.8-27B`、`github.com/QwenLM/Qwen3.8` 抓取失败（DNS 私有 IP 限制或内容提取失败）。

---

## 附：本次主要来源清单

**官方（已直接抓取）**
- https://api-docs.deepseek.com/quick_start/pricing/ （DeepSeek 价格，2026-10-09）
- https://api-docs.deepseek.com/updates/ （DeepSeek 更新日志，2026-10-09）
- https://api-docs.deepseek.com/news/news （DeepSeek 快速入门，2026-10-09）
- https://help.aliyun.com/zh/model-studio/models （百炼模型列表，2026-10-09）
- https://help.aliyun.com/zh/model-studio/model-pricing （百炼价格，2026-10-09，截断）
- https://platform.kimi.com/docs/pricing/chat.md （Kimi 价格，2026-10-09）
- https://platform.kimi.com/docs/guide/kimi-k3-quickstart.md （Kimi K3 快速入门，2026-10-09）

**二手（需以官方为准）**
- https://fortune.com/2026/07/16/moonshots-kimi-k3-pushes-chinese-ai-into-fable-level-territory/
- https://llm-stats.com/models/deepseek-v4.1-flash
- https://siliconangle.com/2026/09/10/deepseek-releases-v4-1-flash-says-it-outperforms-flagship-v4-pro/
- https://platform.teamai.com/blog/large-language-models-llms/understanding-the-different-deepseek-models/
- https://www.datacamp.com/blog/qwen3-8-max
- https://www.scmp.com/tech/article/3362738/alibabas-ai-model-qwen38-max-made-widely-accessible-ahead-open-weights-release
- https://simonwillison.net/2026/Aug/16/qwen-38-27b/
- https://pasqualepillitteri.it/en/news/17552/qwen-4-alibaba-apsara-en
- https://developer.aliyun.com/article/1761075
- https://www.morphllm.com/kimi-k3
- https://artificialanalysis.ai/models/kimi-k3
- https://unsloth.ai/docs/models/kimi-k3
- https://kingy.ai/blog/kimi-k3-benchmarks-specs-price-fable-5-gpt-5-6-sol/
- https://gaige-dorsey.medium.com/how-to-use-kimi-k3-in-claude-code-complete-setup-guide-with-moonshot-api-d0ba444618f9
