---
title: "02 Anthropic Claude 家族（官方核实版）"
---

# 02 Anthropic Claude 家族（官方核实版）

查证日期：2026-10-09
来源：
- 模型总览 https://platform.claude.com/docs/en/about-claude/models/overview
- 定价页 https://platform.claude.com/docs/en/about-claude/pricing
- 说明：以上均为我用浏览器直接读取官方页面所得，**已核实**。能力评价、基准、社区口碑部分未做一手核实，已逐项标注。

---

## 一、当前主力模型（Claude 5 家族）

| 模型 | API ID | 定位 | 延迟 | 上下文 | 最大输出 | 思考 | 默认 effort | 最早退役时间 |
|---|---|---|---|---|---|---|---|---|
| Claude Fable 5.1 | `claude-fable-5-1` | 最复杂的推理与长程 Agent 任务 | 最慢 | 1M | 128K | 自适应，始终开启 | high | 不早于 2027-09-01 |
| Claude Opus 5.5 | `claude-opus-5-5` | 长时间 Agent 编程与知识工作 | 中等 | 1M | 128K | 自适应，始终开启 | medium | 不早于 2027-09-22 |
| Claude Sonnet 5.5 | `claude-sonnet-5-5` | 速度与智能的最佳平衡 | 快 | 1M | 128K | 自适应 | high | 不早于 2027-09-28 |
| Claude Haiku 5.5 | `claude-haiku-5-5` | 高并发低延迟：分类、抽取、路由 | 最快 | 1M | 128K | 自适应 | medium | 不早于 2027-10-07 |

- 知识截止日期：四个模型均为 2026-06。
- 云平台 ID：Bedrock 加 `anthropic.` 前缀（如 `anthropic.claude-opus-5-5`）；Google Cloud、Microsoft Foundry、Claude Platform on AWS 使用与第一方相同的 ID。
- 仍在服务的旧型号：Opus 5、Opus 4.8/4.7/4.6/4.5、Sonnet 5、Sonnet 4.6/4.5、Haiku 4.5 等；Mythos 系列（Project Glasswing 限定）与 Fable 5 也在价目表内。

## 二、价格（美元 / 百万 token，MTok）

### 2.1 标准价与缓存

| 模型 | 输入 | 输出 | 5 分钟缓存写入 | 1 小时缓存写入 | 缓存命中读取 |
|---|---|---|---|---|---|
| Fable 5.1 | 10 | 50 | 12.50 | 20 | 0.25 |
| Opus 5.5 | 4 | 20 | 5 | 8 | 0.20 |
| Sonnet 5.5 | 2 | 10 | 2.50 | 4 | 0.10 |
| Haiku 5.5（提示 ≤100K） | 0.10 | 0.50 | 0.125 | 0.20 | 0.01 |
| Haiku 5.5（提示 >100K） | 0.50 | 2.50 | 0.625 | 1 | 0.05 |

关键规则：
- 缓存写入倍率：5 分钟 1.25 倍，1 小时 2 倍。
- 缓存读取倍率**因模型而异**：通用 0.1 倍；Fable 5.1 为 0.025 倍；Opus 5.5 与 Sonnet 5.5 为 0.05 倍。（所以表中 Opus 5.5 命中价 0.20 是 4 的 0.05 倍，Fable 5.1 命中价 0.25 是 10 的 0.025 倍。）
- 缓存 TTL 与写入时长一致。
- 1M 上下文：Claude 4.6 及之后的模型（Haiku 5.5 除外）**按标准价全程计费，无长上下文溢价**。Haiku 5.5 例外：提示超过 100K token 时整个请求按高价档计费，缓存读写计入提示长度，命中缓存也不豁免。

### 2.2 其他计费杠杆

| 项目 | 规则 |
|---|---|
| Batch API | 输入输出均 5 折。Fable 5.1 批量价 5/25；Opus 5.5 为 2/10；Sonnet 5.5 为 1/5；Haiku 5.5 为 0.05/0.25（≤100K）、0.25/1.25（>100K） |
| Batch 与缓存叠加 | 可以叠加，折扣倍率相乘 |
| 快速模式（研究预览） | 仅 Claude API 第一方可用；Opus 5.5 为 8/40，Opus 5 与 Opus 4.8 为 10/50；不能与 Batch 同用；全上下文窗口都按快速价 |
| 数据驻留 | `inference_geo: "us"` 全部计费项乘 1.1；默认全球路由为标准价。Azure 的 US Data Zone Standard 同为 1.1 倍。区域端点相对全球端点溢价 10% |
| Web search | 每千次搜索 $10，另加搜索内容的 token 费；出错不计费 |
| Web fetch | 无额外费用，只按 token 计费 |
| Code execution | 与 web search / web fetch（`_20260209` 及之后）配合使用时免费；单独使用按执行时长计费（具体价格本次未抓取，**未核实**） |
| Managed Agents | token 按标准价；另加会话运行时长 $0.08 / 会话小时；不适用 Batch 折扣，也不在合作云平台提供 |
| 工具调用系统提示 | Opus 5.5 / Sonnet 5.5 / Haiku 5.5 约 286 token（`auto`/`none`），强制选择约 406 token（Haiku 5.5 页面所列）。工具定义本身另算 |

### 2.3 云平台

- Microsoft Foundry：按 Microsoft Marketplace 以标准 API 价计费。
- Claude Platform on AWS：Anthropic 运营，按 CCU 计价，1 CCU = $0.01，按标准价折算，次月 AWS Marketplace 后付费。
- Amazon Bedrock、Google Vertex AI：由合作方运营，有独立价格，**本次未抓取具体数字，未核实**。

## 三、API 能力与特性（官方文档已知部分）

| 特性 | 说明 | 核实状态 |
|---|---|---|
| 自适应思考 | `thinking: {type: "adaptive"}`；不能再用 `budget_tokens`（Fable 5.1 / Opus 5.5 / Sonnet 5.5 / Haiku 5.5 上返回 400） | 官方参考文档，已核实 |
| effort 控制 | `output_config.effort`：low / medium / high / xhigh / max；Opus 5.5 与 Haiku 5.5 默认 medium，其余 high | 官方参考文档，已核实 |
| 强制工具调用 | Fable 5.1、Opus 5.5、Sonnet 5.5 上 `tool_choice` 为 `any`/`tool` 返回 400，需改用 `auto` + `strict: true` 或结构化输出 | 官方参考文档，已核实 |
| 预填充 | 5 系列均不支持助手预填充（400） | 官方参考文档，已核实 |
| 数据保留 | Fable 5.1 要求 30 天保留，不支持零数据保留，除非 Anthropic 明确授权 | 官方参考文档，已核实 |
| 拒答与降级 | 安全分类器可能返回 `stop_reason: "refusal"`；建议启用服务器端 `fallbacks` | 官方参考文档，已核实 |
| 提示缓存 | 见上；前缀匹配，任何前缀字节变化都会使其后缓存失效；渲染顺序 tools → system → messages | 已核实 |
| Batch API | 异步，5 折，结果顺序不保证，按 `custom_id` 对应 | 已核实 |
| 其他 | Files API、Citations、PDF 输入、MCP connector、Memory 工具、Computer use、Compaction、Context editing、Managed Agents | 官方参考列出，未逐项核对细节 |
| Rate limit 分级 | 本次未抓取 | **未核实** |
| 优先级层（Priority Tier） | Opus 5.5、Sonnet 5.5、Fable 5.1 不支持 | 官方参考文档，已核实 |

## 四、能力边界与短板

以下来自官方文档的明确限制，**可以在面试中直接引用**：
1. 思考无法关闭（Fable 5.1 / Opus 5.5），只能降低 effort；Sonnet 5.5 只能用 `between_tools` 近似关闭。
2. 禁用强制工具调用，意味着“必须调用某工具”的流程要靠提示词和 `strict` 约束。
3. 不支持预填充，输出格式控制改用结构化输出。
4. Haiku 5.5 的 100K 以上提示价格跃升 5 倍，长文档场景要估算。
5. Fable 5.1 慢且贵，且需 30 天数据保留，对合规敏感的场景是限制。
6. 单次长任务可能运行数分钟，需要设计流式与超时。

以下**本次未做一手核实**：
- 官方基准（SWE-bench、Terminal-Bench、OSWorld）：06 号文件里有 SWE-bench Pro 的 Opus 5.5 为 89.9%（厂商自报，来自聚合站），**不能直接引用，需要看 Anthropic 发布页确认**。
- 幻觉率、长上下文衰减、延迟实测：**未核实**。
- 社区口碑（GitHub / YouTube / B站 / 知乎 / Reddit）：**未检索**。

## 五、待补清单

- Anthropic 官方发布页（各型号发布日期与官方基准）
- Rate limit 分级与 Tier 门槛
- Bedrock / Vertex 的价格差异
- Code execution 单独计费价格
- 社区口碑与第三方横评
- Claude 新分词器与旧版的 token 数量差异（官方参考给出：Opus 4.7 分词器相对旧版约 1–1.35 倍，**需要在官方迁移页确认后再引用**）
