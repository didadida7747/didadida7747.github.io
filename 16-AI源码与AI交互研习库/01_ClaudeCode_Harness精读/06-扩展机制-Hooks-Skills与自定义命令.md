---
title: "06 · 扩展机制：Hooks、Skills 与自定义命令"
---

# 06 · 扩展机制：Hooks、Skills 与自定义命令

> 好工具的共同点：核心稳定，边缘可编程。Claude Code 给用户的三个扩展面——Hooks（代码级拦截）、Skills（知识注入）、自定义命令（快捷指令）——分别对应三种扩展需求。本篇逐个拆设计。

## 一、Hooks：用户写代码拦截 Agent 行为

Hooks 是用户配置的 shell 命令，挂在这类生命周期事件上：

| 事件 | 触发点 | 典型用法 |
|---|---|---|
| PreToolUse | 工具执行**前**（可拦截/否决/改参） | 禁止编辑某文件、危险命令告警 |
| PostToolUse | 工具执行**后** | 自动 format、自动 lint |
| UserPromptSubmit | 用户提交输入时（可注入上下文） | 自动附加工单信息 |
| Stop | 主循环要结束时（可以让它"不许停"） | 强制检查测试是否跑过 |
| SubagentStop | 子代理结束时 | 校验子代理产出格式 |
| PreCompact | 压缩前 | 往摘要里塞必须保留的信息 |
| SessionStart / SessionEnd | 会话起止 | 环境准备/收尾清理 |

PreToolUse 的拦截机制：Hook 读到 JSON（含工具名+参数），可以输出 JSON 决定 `approve/deny`，deny 时还能给出 reason——这段话会作为 tool_result 喂给模型，模型会据此换路。

【为什么 Hooks 的设计如此"低级"（就是跑 shell）】这是刻意的：shell = 用户的母语，不发明新 DSL、不搞插件 SDK，**任何语言任何工具都能当钩子**（Python 脚本、curl、jq 都行）。Unix 哲学：每个程序做好一件事，组合起来。

【Stop Hook 的妙处】Agent 想收工时，Hook 可以说"测试没跑过，不许停"——于是循环继续。这是**把质量门禁从"提醒"升级成"物理拦截"**，很多团队拿它实现"没过 CI 就不许交差"。

```json
// .claude/settings.json 示例：改完 Python 文件自动格式化
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{ "type": "command", "command": "bash -c '[[ \"$FILE\" == *.py ]] && ruff format \"$FILE\" || true'" }]
    }]
  }
}
```

## 二、Skills：给模型发"操作手册"

Skill = 一个文件夹 + 一个 `SKILL.md`（YAML frontmatter 写 name/description，正文写操作指南），放在 `~/.claude/skills/` 或 `.claude/skills/`。

核心机制是**渐进式披露（progressive disclosure）**：

```
第 1 层（永远在上下文）：技能名 + 一句 description    ← 只有几十 token
第 2 层（触发时加载）：SKILL.md 正文                 ← 模型判断相关才读
第 3 层（正文里引用的）：附带脚本/模板/参考文件        ← 需要才打开
```

【为什么这是天才设计】假设你有 50 个技能，全部预加载 = 每次会话白烧几万 token。渐进式披露把"目录"常驻、"正文"按需——**像书的目录页 vs 整本书**。模型的 description 写得好不好，直接决定技能会不会被触发（所以 Anthropic 官方指南强调 description 里要写清"什么时候用"）。

【真实范本】官方技能库 `anthropics/skills`（本库已 clone）里 `docx` 的 description 是这样写的（实测原文节选）：

> "Use this skill whenever the user wants to create, read, edit, or manipulate Word documents... **Triggers include:** any mention of 'Word doc'... **Also use when** extracting or reorganizing content from .docx... **Do NOT use for** PDFs, spreadsheets, or general coding tasks..."

一段 description 里齐了：正向触发词（Triggers include）、泛化场景（Also use when）、负向排除（Do NOT use for）——**07b 篇工具描述的"正反例夹逼"公式，在技能 description 上原样适用**。写自己的 SKILL.md 时照着这个骨架填。

【Skills vs CLAUDE.md 的边界】CLAUDE.md 是"常驻背景"（每次都要），Skill 是"条件知识"（遇到了才要）。把所有东西都塞 CLAUDE.md 是新手最常见的 token 浪费。

【另一个妙用】Anthropic 自己发布了文档技能包（docx/pdf/pptx/xlsx 的生成手册+脚本），等于用 Skills 实现了"办公套件"——能力本体是 Markdown + 脚本，模型读了就会用。

## 三、自定义命令（Slash Commands）：高频动作的一键化

`.claude/commands/fix-issue.md` 这样一个文件，就是一个 `/fix-issue` 命令：

```markdown
---
description: 修复一个 GitHub issue
allowed-tools: Bash(gh issue view:*), Bash(gh issue comment:*)
---
请分析并修复 issue：$ARGUMENTS
步骤：1) gh issue view 拿详情 2) 定位代码 3) 修复 4) 写测试 5) 提交并评论进展
```

`$ARGUMENTS` 传参、`allowed-tools` 预授权（该命令内不再弹权限窗）、正文就是提示词模板。

【为什么三套机制并存】注意它们的本质区别：
- **命令** = 预填的提示词（human 发起）
- **技能** = 按需的知识包（model 按需取用）
- **Hook** = 确定性的代码拦截（非模型，永不失手）

三种扩展对应三种信任级别：命令信任模型执行、技能信任模型判断时机、Hook 干脆不信模型（代码说了算）。**扩展系统设计的第一性问题就是：这件事该给模型做还是给代码做？**

## 四、还有两个"扩展面"别忘了

1. **MCP**（02 篇讲过）：扩展的是"工具"本身，跨客户端通用。
2. **Claude Agent SDK**（2025.9 从 Claude Code SDK 更名）：把整个 harness（循环+工具+权限+压缩）开放成库，你用几十行代码就能获得"Claude Code 内核"来搭自己的 Agent。想深学的路径：官方 SDK 文档 + 06 章实验室自己写一遍，两边对照。

## 思考题

1. "改完代码自动跑 lint"该用 Hook 还是写在 CLAUDE.md 里让模型记得做？（提示：从可靠性 100% vs 90% 想起）
2. 如果一个技能有 3000 字正文，description 该怎么写才能保证"该触发时触发、不该触发时不打扰"？
3. 你的日常里哪个重复动作最值得做成 slash command？现在就写一个。

---

下一篇：[07-系统提示词全文批注](/16-AI源码与AI交互研习库/01_ClaudeCode_Harness精读/07-系统提示词全文批注)——直接看它的"出厂设置"（配合调研到的原文）。
