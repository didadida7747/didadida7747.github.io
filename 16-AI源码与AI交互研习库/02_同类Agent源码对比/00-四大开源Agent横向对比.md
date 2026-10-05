---
title: "00 · 四大开源 Agent 横向对比：同一道题的四种答案"
---

# 00 · 四大开源 Agent 横向对比：同一道题的四种答案

> Claude Code 闭源，但它身后有一群开源"同构实现"。对比它们在同一问题上的不同解法，是学 harness 设计最高效的方式——你会看到：**架构没有标准答案，只有 tradeoff**。
> 本文所有仓库都可以 `git clone --depth 1` 后对照阅读（07_源码仓库/clone_repos.sh 一键拉取）。

## 一、总览表

| | **Gemini CLI** | **OpenCode** | **Codex CLI** | **Aider** |
|---|---|---|---|---|
| 出品方 | Google | SST 团队 | OpenAI | Paul Gauthier(个人→公司) |
| 语言 | TypeScript | TypeScript | Rust | Python |
| 开源协议 | Apache-2.0 | MIT | Apache-2.0 | Apache-2.0 |
| 定位 | 开源版"CC"，绑定 Gemini | 供应商中立的终端 Agent | 轻量+强沙箱 | 精益的结对编程工具 |
| 上下文记忆 | GEMINI.md | AGENTS.md 规则体系 | AGENTS.md | 仓库地图+git 历史 |
| 特色 | 1M 窗口、免费额度 | client/server 架构、LSP 集成 | OS 级沙箱（Seatbelt/Landlock） | edit format 精雕、repo map、基准测试文化 |

【先说共性】四家的骨架和 Claude Code 同构：**主循环 + 工具集 + 上下文文件 + 权限/确认机制**。这个"趋同进化"本身就说明：这一层架构的解空间收敛了，值得当作标准范式学。

## 二、逐家的"最值得偷的三个设计"

### Gemini CLI —— 看开源代码怎么实现 CC 的思想

1. **核心循环 openly 在 `packages/core/src/core/client.ts`**：消息发送 → 流式接收 → functionCall 分发 → 工具执行 → 结果回填。读它等于看"没有混淆版的 Claude Code"。
2. **压缩服务（chatCompressionService）**：历史超过阈值比例时触发压缩，和 CC 的 auto-compact 同思路，但**代码可读**——压缩提示词怎么写、怎么判断该压了，全在明面上。
3. **工具即类**：每个工具一个类（read-file、edit、shell、web-search、memoryTool…），实现统一接口，包括 `description` 生成器（描述是函数，可以动态生成）——比 JSON 静态描述更灵活的做法。

【适合谁精读】会 TypeScript 的人，首选。文件结构清晰、注释规范，是四家里最容易读穿主循环的。

### OpenCode —— 看架构分层

1. **client/server 分离**：核心 Agent 跑成 server（无头），TUI/IDE 只是客户端。→ 同一内核能同时服务终端和编辑器，这是 Claude Code 后来也走的方向（VS Code 扩展+CLI 共享内核）。
2. **provider 无关**：模型接入层抽象掉厂商差异（多 provider 路由、故障切换）。
3. **LSP 集成**：把语言服务器（跳转定义/找引用）暴露给模型当工具——模型获得了 IDE 级的代码理解力。这是 Claude Code 没有明说的增强方向。

【适合谁精读】想搭"自己的 Agent 平台"的人。

### Codex CLI —— 看安全沙箱

1. **沙箱下到 OS 层**：macOS 用 Seatbelt（sandbox-exec）、Linux 用 Landlock+seccomp，文件写白名单 + 网络隔离，不是靠提示词求模型别乱来。
2. **Rust 单二进制**：分发零依赖、启动快。
3. **AGENTS.md 标准的推手**：和多家一起把"项目说明文件"做成了跨工具事实标准。

【适合谁精读】关心"Agent 怎么安全地在生产环境跑"的人。

### Aider —— 看细节打磨与测量文化

1. **Edit Format 学**：不迷信单一格式，实现了 whole / diff（搜索替换块）/ udiff / editor 等多种"代码编辑语言"，按模型能力选择；每种的 prompt 都在 `aider/coders/*.py` 里可读。这是对"模式 4：用协议防幻觉"最深入的一次公开实践。
2. **Repo Map**：用 tree-sitter 抽符号 + 图排序（PageRank 思路）挑出"最值得放进上下文的代码骨架"，控制在预算内。小上下文办大事的典范。
3. **Benchmark 驱动**：自建 polyglot 基准，每次改动跑分。**把 prompt 当代码一样测量**，这个文化比任何单点技巧都值钱。

【适合谁精读】Python 用户 + 所有想深挖"模型怎么改代码才不翻车"的人。

## 三、把四家放进一张设计空间图

```
                    自由度/自主性
                        ▲
              Aider ●   │        ● Claude Code
        （人驱动、结对）  │   （任务驱动、可托管）
                        │
      Codex CLI ●       │        ● OpenCode
       （沙箱内自主）     │    （可编排、平台化）
                        └──────────────────► 平台化/工程化程度
```

【我的批注】这个光谱上没有赢家，只有场景：
- 手头改 bug、渐进重构 → Aider 式"人为主导"效率最高；
- 从零做项目、跨文件大改 → CC/OpenCode 式"任务驱动"；
- 公司内部规模化 → 沙箱和分层配置（Codex/CC 企业策略）是硬需求。

## 四、动手路线（按性价比排序）

1. **半天**：clone Gemini CLI，只读 `packages/core/src/core/client.ts` + `prompts.ts`，对照 01 章 01 篇的伪代码画流程图。
2. **半天**：clone Aider，读 `aider/coders/editblock_coder.py` 的替换算法和 `repomap.py` 的骨架逻辑（不求全懂，抓主干）。
3. **可选**：OpenCode 的 session 目录（prompt 怎么组装）和 Codex 的 sandbox 模块。

## 思考题

1. 四家都搞了"项目说明文件"（CLAUDE.md/GEMINI.md/AGENTS.md），为什么这个点会趋同？它解决了什么公共问题？
2. OpenCode 的 client/server 分离付出了什么代价？（提示：进程间状态同步、启动速度）
3. 如果你要给 Aider 的 repo map 挑毛病，你会从哪里下手？（提示：什么类型的代码结构会让"PageRank 挑符号"失灵？）

---

下一篇：[01-GeminiCLI源码精读](/16-AI源码与AI交互研习库/02_同类Agent源码对比/01-GeminiCLI源码精读-开源版Claude-Code)
