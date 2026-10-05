---
title: "01b · Gemini CLI 主循环：真实代码逐段批注"
---

# 01b · Gemini CLI 主循环：真实代码逐段批注

> 素材：本库 clone 的 `gemini-cli`（main 分支，`packages/core/src/core/client.ts`，1313 行）。
> 这是"读真实源码"的示范篇：每段代码都是从本地文件**原样摘出**的，行号即 clone 版本实际行号，你随时可以打开对照。
> 前置阅读：[01-GeminiCLI源码精读](#/doc/d438)（路线图），本篇是正式的代码精读。

## 0. 结构定位：主循环是"生成器套生成器"

```
sendMessageStream (client.ts:924)      ← 对外入口：一次用户输入
    └── processTurn    (client.ts:625) ← 每一轮：调模型→收流→执行工具
            └── Turn 类 (core/turn.ts) ← 单轮内的事件流（工具调度在这里）
```

用一个 `async *` 生成器链：每个环节都是"边产生事件边等下一步"。**把整个 Agent 的执行过程建模成事件流**——这个结构决定了很多行为（比如流式渲染、中途打断、事件遥测都是免费的）。

## 1. 硬边界护栏（processTurn 开头，节选自 625-644 行）

```typescript
let turn = new Turn(this.getChat(), prompt_id);

this.sessionTurnCount++;
if (
  this.config.getMaxSessionTurns() > 0 &&
  this.sessionTurnCount > this.config.getMaxSessionTurns()
) {
  yield { type: GeminiEventType.MaxSessionTurns };
  return turn;
}
```

【批注】对照 01章01篇的 `MAX_TURNS`。三个细节：
1. `> 0` 才启用——**0 表示"不限"**，护栏做成可配置而不是写死；
2. 触发时不抛异常，而是 `yield` 一个**事件**——调用方（UI）能优雅地展示"到轮次上限了"，而不是崩溃；
3. 每轮 `new Turn(...)` 重建状态——轮与轮之间除历史外无残留状态，**幂等性是循环健壮性的根基**。

## 2. 上下文管理：新系统与旧系统并存（节选自 650-708 行）

```typescript
if (this.config.getContextManagementConfig().enabled) {
  if (this.contextManager) {
    const { history: newHistory, apiHistory, ... } =
      await this.contextManager.renderHistory(pendingRequest, undefined, signal);
    // ...
    apiHistoryOverride = [...apiHistory, finalPendingContent];
    this.getChat().setHistory(newHistory);
  }
} else {
  const compressed = await this.tryCompressChat(prompt_id, false, signal);
  if (compressed.compressionStatus === CompressionStatus.COMPRESSED) {
    yield { type: GeminiEventType.ChatCompressed, value: compressed };
  }
}
```

【批注】一段 if-else 里藏着两代上下文管理：
- **旧路**：`tryCompressChat`——就是我们 01章04篇讲的 auto-compact（超阈值→总结→替换历史）；
- **新路**：`contextManager.renderHistory`——把历史渲染成"API 历史"和"展示历史"**两条线**：`displayContent` 用原始请求（UI 展示完整），API 调用用蒸馏后的（省 token）。注释原话："Use the original request for display/recording, but the processed one for the API and durable history."

【这就是 04篇"微压缩"的工业实现】**给模型看的和给用户看的历史可以是两份**。很多团队卡在"压缩后用户看不到自己说过啥"的矛盾上，答案是分离两条历史线。

## 3. 工具输出掩码（698 行附近，一行顶一千字）

```typescript
await this.tryMaskToolOutputs(this.getHistory());
```

【批注】函数名直译"尝试掩码工具输出"：把老轮次的工具结果替换成掩码（类似占位符），效果等同 01章04篇讲的"老工具结果优先丢弃"。注意它**每轮都跑**（写在 processTurn 主路径上），而不是等到快爆了才跑——**上下文卫生是例行维护，不是紧急抢救**。这个时机选择比压缩算法本身更值得抄。

## 4. 溢出预判：在爆掉之前刹车（709-728 行）

```typescript
const remainingTokenCount =
  tokenLimit(modelForLimitCheck) - this.getChat().getLastPromptTokenCount();
// ...
const estimatedRequestTokenCount = await calculateRequestTokenCount(...);
// （若估算的请求 token 超过剩余空间）
yield { type: GeminiEventType.ContextWindowWillOverflow, ... };
```

【批注】两层设计值得看：
1. 用 `getLastPromptTokenCount()`（上一次 API 返回的真实用量）做基准，而不是自己估算历史——**能用 API 的 ground truth 就不自己算**；
2. 事件名是 `ContextWindowWillOverflow`（"将要"溢出）——**预判而非事后报错**，给 UI 机会在爆炸前提示用户 /compact。护栏的最高形态是让事故根本不发生。

## 5. API 协议约束的注释（733-743 行，一段教科书级注释）

```typescript
// Prevent context updates from being sent while a tool call is
// waiting for a response. The Gemini API requires that a functionResponse
// part from the user immediately follows a functionCall part from the model
// in the conversation history...
const hasPendingToolCall =
  !!lastMessage &&
  lastMessage.role === 'model' &&
  (lastMessage.parts?.some((p) => 'functionCall' in p) || false);
```

【批注】IDE 模式下，编辑器想不断把"你光标处的代码"喂进上下文。但注释解释了为什么不行：**functionResponse 必须紧跟 functionCall**（API 协议要求），工具等待期间插入内容会破坏消息序列。解决办法：挂起期间缓存，下一条常规消息再带上（"The IDE context is not discarded; it will be included in the next regular message"）。

【你能学到】好注释的范本：不说"做什么"（代码自解释），说的是**协议层面的 why** 和"被丢弃的信息去哪了"。你写自己的 harness 时，这类"数据进出的时序约束"注释是保命符。

## 6. 循环检测器：三层递进的护栏（services/loopDetectionService.ts）

这是 Gemini CLI 相对少被讲、但最值得学的模块。常量先亮出来（文件头部实测）：

```typescript
const TOOL_CALL_LOOP_THRESHOLD = 5;
const CONTENT_LOOP_THRESHOLD = 10;
const CONTENT_CHUNK_SIZE = 50;
const MAX_HISTORY_LENGTH = 5000;
// ... LLM_LOOP_CHECK 相关：每 N 轮让 LLM 自己检查最近 20 轮是否在绕圈
```

三层检测，从便宜到贵：

| 层 | 机制 | 成本 |
|---|---|---|
| ① 工具调用指纹 | 同名工具+同参数连续/累计 5 次 → 判定循环 | 零（字符串比较） |
| ② 内容重复统计 | 输出流按 50 字符分块统计重复度，阈值 10 → 判定 | 零（内存统计） |
| ③ LLM 自查 | 每隔 N 轮把最近 20 轮喂给模型："我在绕圈吗？" | 贵（一次推理） |

主循环里的接线（client.ts:759-770 实测）：

```typescript
const loopResult = await this.loopDetector.turnStarted(signal);
if (loopResult.count > 1) {
  yield { type: GeminiEventType.LoopDetected };
  return turn;
} else if (loopResult.count === 1) {
  // ...
  return yield* this._recoverFromLoop(...);   // 不直接停，先尝试"绕坑恢复"
}
```

【批注】三处精彩：
1. **检测器常驻主循环**（`turnStarted` 每轮调用），与 01章08篇模式 8"行为问题用机制解决"完全同构——04章03篇的 C7 卡点升级模板是人肉版，这里是代码版；
2. **检测到循环不直接终止**，而是走 `_recoverFromLoop`（注入"你在绕圈"类恢复提示再试）——先止损自救，再上报用户；
3. 阈值梯度（5 次/10 次/每 15 轮）体现"**便宜的检测高频跑，昂贵的检测低频跑**"——系统设计的通则。

## 7. 收束：这段源码改变了哪些文档结论？

| 之前（01章/04章）的表述 | 真实代码确认/修正 |
|---|---|
| "auto-compact = 总结替换历史" | 确认，且新系统正演进为"API/展示双历史线" |
| "工具结果裁剪是被动兜底" | 修正：掩码是**每轮例行维护**（tryMaskToolOutputs 在主路径上） |
| "循环靠提示词约束（失败 3 次换方向）" | 补全：代码级三层循环检测器 + 恢复流程，提示词只是最外层 |
| "MAX_TURNS 触发即终止" | 细化：终止以事件（而非异常）发出，UI 可优雅处理 |

**读真实源码的回报就在这张表里**：每一条修正都是"只看二手资料学不到"的细节。

## 思考题

1. 双历史线（display vs api）会引入什么新问题？（提示：UI 显示成功 ≠ API 实际收到；两者不一致时调试体验如何）
2. 循环检测器的①层为什么用"工具名+参数指纹"而不是"工具名+文件名"？如果你来设计，指纹该包含什么、不该包含什么（比如时间戳）？
3. `tryMaskToolOutputs` 每轮都跑，会不会把"其实马上要用"的信息也掩掉？猜猜它会保留哪些轮次不掩，然后去源码里验证。

---

下一篇：[02b-Aider替换算法真实代码批注](#/doc/d441)
