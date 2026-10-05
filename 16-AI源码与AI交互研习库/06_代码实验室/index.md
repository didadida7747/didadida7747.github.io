---
title: "06 · 代码实验室：亲手摸一遍 Agent 的每一个器官"
---

# 06 · 代码实验室：亲手摸一遍 Agent 的每一个器官

> 读了 01/02 章的概念，这里把它们变成你能 `python` 一下就看到的现实。
> 核心文件：**toy_agent_harness.py**（约 380 行，零依赖，Windows/Linux/macOS 通用）。

## 一、三种跑法

```bash
# ① Mock 模式（推荐第一次）：不需要 API key
#    内置一个"手写策略"假装是 LLM，完整走一遍：探索→读取→被权限门拦截→调整→写报告→收工
python toy_agent_harness.py

# ② 观察内部消息结构：每一轮模型说了什么、工具结果怎么以 tool 角色回填
python toy_agent_harness.py --trace

# ③ 接真实模型（任何 OpenAI 兼容 API：DeepSeek/GLM/Kimi/豆包...）
python toy_agent_harness.py --api \
  --base-url https://api.deepseek.com/v1 \
  --key sk-你的key --model deepseek-chat \
  --task "巡检 playground 目录，把所有 .md 文件的标题提取出来写进 report.md"
```

安全说明：所有文件操作被限制在 `playground/` 沙箱目录里（看 `_sandbox_path()`）；`run_bash` 默认被权限门拒绝（这正是教学点）。

## 二、代码地图（对着 01 章读）

| 代码位置 | 对应精读篇 | 看什么 |
|---|---|---|
| `TOOLS` + `TOOL_PARAMS` | 01章02篇 工具系统 | 工具 = 声明(schema+描述) + 执行函数 三件套 |
| `tool_read_file` | 02篇 原则1/3 | 行号、分页裁剪、读前写后护栏 |
| `tool_write_file` | 02篇 原则3 | "没读过就拒绝写"的幻觉防线 |
| `_sandbox_path` | 03篇 权限系统 | 微缩版沙箱：路径先过安检 |
| `permission_gate` | 03篇 权限门 | 规则匹配的是"工具名+参数"，deny 理由回填给模型 |
| `MockLLM` | 00篇 世界观1 | 模型只"提议"（文本+tool_calls），执行权在 harness |
| `Harness.run` | 01章01篇 主循环 | ①组装 ②调用 ③无工具则停 ④执行 ⑤回填 |
| `_truncate` | 02篇 原则1 | 工具结果裁剪到预算内 |
| `_maybe_compact` | 01章04篇 微压缩 | 老工具结果 → 占位符，可再生信息先丢 |
| `build_system_prompt` | 01章07篇 | 人设 + `<env>` 动态注入的极简版 |
| `MockLLM` 的报错分支 | 01章01篇 细节2 | "错误是信息"：模型读到拒绝原因后换方案 |

## 三、实验清单（做完才算来过）

1. [ ] 跑 Mock 模式，数一数一共几轮、每轮发生了什么
2. [ ] 跑 `--trace`，找到：哪条消息的 role 是 `tool`？`[权限拒绝]` 出现在哪轮、模型第 2 轮怎么反应的？
3. [ ] 跑 `--compact-demo`，观察"微压缩"什么时候触发、压的是谁（为什么先压最老的工具结果？）
4. [ ] 把 `MAX_TURNS` 改成 2 再跑——观察"硬边界"护栏如何兜底
5. [ ] 把 `TOOL_RESULT_CHAR_LIMIT` 改成 20 再跑——观察裁剪对模型行为的破坏（体会"裁剪"的两面性）
6. [ ] 删掉 `tool_write_file` 里的"读前写后"检查，跑一遍——想想什么情况下模型会因此翻车
7. [ ] （选做）`--api` 接真实模型，把 `--task` 换成你真实的小需求

每次实验前如果 playground 被改乱：删掉 `playground/report.md` 即可复跑。

## 四、做完实验去哪

- [练习题.md](/16-AI源码与AI交互研习库/06_代码实验室/练习题)：4 道进阶改造题（加工具/加权限规则/实现真压缩/写 MCP）
- 想看更工业的实现：去 clone Gemini CLI 对照（07_源码仓库/clone_repos.sh）
