---
title: "01 · Agent 主循环：整个系统的心脏"
---

# 01 · Agent 主循环：整个系统的心脏

> 剥掉所有花活，Claude Code 的内核是一个不超过 100 行就能写完的循环。
> 本篇把这个循环逐块拆开。读完后你应该能自己手写出它（06 章代码实验室会让你真的写出来）。

## 一、伪代码还原

根据逆向工程仓库（Yuyz0112/claude-code-reverse、ShareAI-Lab 的源码深读）与开源同构实现的比对，主循环还原如下：

```python
# 伪代码：Agent 主循环（还原自 Claude Code 的行为结构）
messages = [system_prompt + 环境信息 + CLAUDE.md]   # ① 初始上下文
turn_count = 0

while True:
    turn_count += 1
    if turn_count > MAX_TURNS:                      # ② 硬边界
        break

    response = llm.stream(messages, tools=TOOLS)    # ③ 请求模型（流式）

    # ④ 流式期间：把文本实时打印到终端
    #    把 thinking 块折叠显示（可展开）

    tool_uses = [b for b in response if b.type == "tool_use"]

    if not tool_uses:                               # ⑤ 模型不再要工具
        break                                       #    = 认为任务完成

    if thinking_enabled:                            # ⑥ 上下文经济学：
        清除旧轮次的 thinking 块                     #    thinking 只服务当下决策

    results = []
    for tu in tool_uses:                            # ⑦ 逐个执行工具
        decision = permission_gate(tu)              #    ⑦-1 权限门
        if decision == "deny":
            results.append(deny_msg(tu)); continue
        if decision == "ask":
            show_preview(tu)                        #    ⑦-2 展示diff/命令
            if not user_confirms(): 
                results.append(deny_msg(tu)); continue
        out = execute(tu)                           #    ⑦-3 真正执行
        out = truncate(out, TOKEN_LIMIT)            #    ⑦-4 结果裁剪
        results.append(out)

    messages.append(assistant_msg(response))        # ⑧ 回填：模型说的话
    messages.append(user_msg(results))              #    + 工具结果（伪装成 user）
```

【为什么这样设计】逐块批注：

**① 初始上下文不是一句话，是一个"信息包"**。系统提示词 + 环境信息（cwd/平台/日期）+ git 状态 + CLAUDE.md + 工具定义。注意工具定义在**第一次请求就全部给出去**（skill 的按需加载是例外），这样模型从一开始就知道自己有哪些能力——能力认知必须先于任务规划。

**② MAX_TURNS 是必要之恶**。没有它，模型陷入死循环（反复尝试同一个失败操作）会烧光你的钱。Anthropic 选了"够大但不无限"的值 + 让用户能随时打断。开源实现里普遍是显式参数（如某些框架的 `max_steps=25`）。

**③ 流式（streaming）不只是体验优化**。模型生成 tool_use 时用户能实时看到要执行什么命令，这给了用户一个"软否决窗口"（Esc 打断）。安全性和体验在这里是同一件事。

**⑤ 终止条件的哲学**：循环结束的唯一信号是"模型不再要求调用工具"。没有显式的 `task_done` 标志。这是 Agentic 系统的通用设计——**让停止信号和数据流同源**，避免两套状态打架。（Stop Hook 会在⑤触发时再问一次"你真的做完了吗"，见 06 篇。）

**⑥ thinking 块用完即弃**。思考内容只在"生成它之后的第一次工具执行"有效，之后就从上下文里清掉。因为它的价值已经被"行动"兑现了，留着只烧 token。——这是上下文经济学的典型操作：**保留决策，丢弃草稿**。

**⑧ tool_result 伪装成 user 消息回填**。这是 API 层面的现实（工具结果必须以 user 角色回传），但注意 harness 会在结果里包一层 `<system-reminder>` 之类的标记，让模型能区分"用户说的话"和"系统产生的信息"。信息来源的区分度直接影响模型行为质量。

## 二、三个容易被忽略的循环细节

### 1. 并行工具调用的处理

模型可以一次吐出多个 tool_use（比如同时读三个文件）。harness 的选择是：**顺序执行、结果按原顺序回填**（部分版本/工具支持并行执行）。

【为什么】并行的收益（省时间）小于乱序的代价（文件读写有依赖、执行输出交错难读、出错难定位）。Agent 的"并行"更多靠子代理（05 篇）实现——那是真并行，且天然隔离。

### 2. 出错不中断，把错误还给模型

工具执行失败（命令报错、文件不存在）时，harness 不会终止循环，而是把**错误信息作为 tool_result 回给模型**，让它自己决定重试、换路还是放弃。

【为什么】这是 Agent 和传统软件最大的区别之一：**错误是信息，不是异常**。模型看到 `file not found: /x/y.py` 后会自己修正路径再试——这就是"自愈能力"的来源。你在提示词模板里常看到的"遇到错误先读错误信息再修"，本质是在配合这个机制。

### 3. 用户打断的处理

用户按 Esc 打断后，harness 会把"用户中断了这个操作"作为一条消息写进历史，而不是悄悄丢掉。

【为什么】如果模型不知道自己被打断，它会继续基于错误的世界观行动（以为自己刚才的命令成功了）。**打断也要作为信息进入上下文**——这是很多自研 Agent 框架踩过的坑。

## 三、从循环看 Agent 的三种"进化方向"

理解了主循环，你就有了给所有 Agent 产品分类的坐标系：

| 变体 | 代表 | 改了循环的哪一块 |
|---|---|---|
| 多智能体 | Claude Code 子代理、Manus | 把单循环变成"循环树"（05篇） |
| 工作流编排 | LangGraph、Dify | 把 while 改成 DAG，节点=LLM调用 |
| 长时任务 | Devin、后台 agent | 循环放进沙箱/容器里跑数小时，加检查点 |

【我的批注】2025-2026 年的行业共识：**简单循环 + 好工具 + 好上下文管理 > 复杂编排**。Anthropic 自己在《Building effective agents》里明确反对过早引入框架——能一个循环解决的就别上 DAG。这个判断直接影响你选型。

## 四、动手验证（强烈建议）

打开 [06_代码实验室/toy_agent_harness.py]，这个 200 多行的文件就是上面伪代码的真实实现（含 Mock 模式，无需 API key）：

```bash
python toy_agent_harness.py          # Mock 模式，观察完整 trace
python toy_agent_harness.py --trace  # 输出每一轮的消息结构
```

对照着看：`main_loop()` 函数 ↔ 本篇伪代码；`TOOL_REGISTRY` ↔ 02 篇的工具系统；`permission_gate()` ↔ 03 篇的权限系统。

## 思考题

1. 如果把 `truncate(out, TOKEN_LIMIT)`（⑦-4 结果裁剪）去掉，会发生什么连锁反应？
2. 为什么"模型不再要求工具"可以作为终止信号，而不需要一个明确的"任务完成"协议？
3. 06 章实验室的循环里缺了 Claude Code 的哪些循环特性？（答案线索：checkpoint、打断处理、thinking 清理）

---

下一篇：[02-工具系统](#/doc/d427)
