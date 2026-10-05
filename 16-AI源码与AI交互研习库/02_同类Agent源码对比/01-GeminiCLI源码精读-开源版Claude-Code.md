---
title: "01 · Gemini CLI 源码精读：开源版 Claude Code"
---

# 01 · Gemini CLI 源码精读：开源版 Claude Code

> 仓库：`google-gemini/gemini-cli`（Apache-2.0，TypeScript，monorepo）。
> 它的价值：把 Claude Code 式的架构用**可读的代码**实现了一遍。本篇给出"该读哪些文件、每处看什么"，配合 clone（07 章 clone 脚本）食用。
> 注：文件行号/细节随版本漂移，本篇讲的是稳定存在的结构。

## 一、先看目录骨架（packages/core = 大脑）

```
packages/core/src/
├── core/
│   ├── client.ts           ← 主循环：发消息、收流、分发 functionCall
│   ├── geminiChat.ts       ← 会话状态：历史管理、压缩触发
│   ├── prompts.ts          ← 系统提示词（明文！直接读）
│   ├── logger.ts           │
│   ├── turn.ts             └─ 一轮交互的生命周期抽象
├── tools/                  ← 每个工具一个文件，统一接口
│   ├── read-file.ts  edit.ts  shell.ts
│   ├── web-search.ts  memoryTool.ts  grep/glob/ls...
├── services/               ← 压缩服务、shell 执行服务等
├── config/config.ts        ← 配置（类似 CC 的 settings）
└── utils/
```

对比 Claude Code：结构几乎同构，只是 TS 的类组织方式让边界更明显。**这就是读它的意义：CC 的黑盒在它这全是白盒。**

## 二、精读点 1：主循环（client.ts）

读的时候带着 01 章 01 篇的伪代码对照。要点：

1. **`sendMessageStream` 是入口**：组装 `contents`（历史+新消息）+ `config`（系统提示词+工具声明），发起流式请求。
2. **响应里分块处理**：文本块直接透传给 UI 渲染；`functionCall` 块收集起来。
3. **工具调度**：收集到的 functionCall 逐个走 `toolRegistry.get(fnCall.name).execute(...)`，结果包装成 functionResponse 回填进 `contents`，然后**再次发起请求**——这就是循环的"再转一圈"。
4. **终止**：本轮响应没有 functionCall → 循环结束，把最终文本交给用户。

【批注：和 CC 的一个微妙差异】Gemini 的 functionCalling 是"模型显式调用函数"协议；CC 用的 Anthropic API 的 tool_use 块本质相同。**协议不同，循环同构**——这再次验证了主循环的普适性。

【批注：值得注意的细节】它的工具结果回填时对出错工具也有结构化的错误包装（不是抛异常断循环），和 CC 的"错误是信息"一致。

## 三、精读点 2：压缩（services 里找 compression）

`geminiChat.ts` 会追踪历史 token 估算值，超过总窗口一定比例（阈值可配）时触发压缩服务：
- 拿一个压缩提示词，让模型把历史总结成结构化摘要；
- 用摘要**替换**旧历史，保留最近若干轮原样。

【批注】读这里的压缩提示词原文，和 04 章（上下文工程）讲的"摘要必须保留什么"对照——你会发现工业实现保的都是那几样：任务目标、已做决定、关键文件、当前状态、下一步。

【批注】它还有一个 `memoryTool`（save_memory 工具）：用户说"记住 xxx"时写进 `GEMINI.md`。这就是"跨会话记忆 = 项目说明文件"的活例子，与 CC 的 `#` 快捷记忆同一思路。

## 四、精读点 3：系统提示词（prompts/promptProvider.ts + snippets.ts）

**直接读原文**（已对照本库 clone 的 main 分版核实：`packages/core/src/prompts/` 下的 `promptProvider.ts` 负责编排、`snippets.ts` 放全部文本；`core/prompts.ts` 现在只是转发壳）。观察四件事：

0. **编排方式本身值得学**：promptProvider 把提示词拆成带开关的 section（按模式/模型/环境条件裁剪拼接），而不是一个大字符串——**提示词也模块化了**。

1. **它怎么教模型做 Agent**：一整节 "How to approach your task"——先理解、再规划、再动手、结果验证。和 CC 系统提示词的"行动纪律"同源。
2. **它怎么引导工具偏好**：明文写着优先用专用工具而不是 shell 里凑合、编辑前必须读文件等。对照 02 章工具系统篇的"原则 2"。
3. **动态信息的注入位**：环境信息（cwd、git 状态、目录树）由代码拼接进提示词——上下文的"动态部分"和"静态人设"是两段拼起来的，CC 的 `system-reminder` 机制同理。

【你能学到】写好系统提示词的模板就藏在开源实现里：**身份 → 任务哲学 → 环境信息 → 工具纪律 → 输出风格 → 红线**，六段式。

## 五、精读点 4：工具类（tools/ 目录）

挑 3 个对照着读：

- `read-file.ts`：看它怎么处理"文件不存在/太大"（返回结构化错误还是截断），对照 02 篇"返回值裁剪"。
- `edit.ts`：看它的编辑协议（旧文→新文？还是别的），和 Aider 的 edit format、CC 的 Edit 工具三方对比。
- `shell.ts`：看它怎么防止危险命令、怎么收集输出（有没有输出上限）。

【批注】注意工具基类接口（`Tool`）的字段：name/description/schema/validate/execute。**工具=声明+校验+执行**的三件套，和你写 REST API 的 controller 一个套路。06 章实验室的 `TOOL_REGISTRY` 就是这个结构的极简版。

## 六、读完后自测

1. 不看资料，画出 Gemini CLI 一轮交互的数据流（消息→模型→工具→回填）。
2. 它的压缩触发条件是什么？为什么用"比例"而不是"绝对值"做阈值？（提示：不同模型窗口不同）
3. 找出它和 CC 的三个行为差异，并各写一句"如果让我选，我选哪家、为什么"。

---

下一篇：[02-Aider源码精读](#/doc/d440)
