---
title: "01 - 快速上手 Grok Build"
---

# 01 - 快速上手 Grok Build

## 1. 启动方式

交互式 TUI：

```powershell
cd <你的项目目录>
grok
```

带首轮提示启动：

```powershell
grok "先读 README 和项目结构，告诉我怎么运行测试"
```

单轮 headless：

```powershell
grok -p "解释这个项目的目录结构"
```

指定目录：

```powershell
grok --cwd D:\path\to\project "检查这个项目的入口和测试命令"
```

## 2. 第一轮提示模板

用于陌生仓库：

```text
先只读不要改。请读取 README、目录结构、包管理/构建文件、测试说明和关键配置，输出：
1. 项目是什么；
2. 怎么运行；
3. 主要模块在哪里；
4. 最小验证命令；
5. 你下一步建议读哪些文件。
```

用于小修复：

```text
请定位并修复这个问题：<问题描述>。
要求：先说明你定位到的文件和原因；改动保持最小；修复后运行相关测试或给出未运行原因。
```

用于中大型实现：

```text
先不要写代码。请先做复杂度判定、列影响文件、检查可复用实现，并输出实现前设计；等我确认后再实现。
```

如果要使用本项目沉淀的 skill：

```text
Use $ai-governance before implementation.
```

## 3. TUI 基础操作

| 操作 | 用法 |
|---|---|
| 发送消息 | Enter |
| 换行 | Alt+Enter；本机 doctor 提示 Shift+Enter 可能不可用 |
| 打开命令面板 | Ctrl+P 或 `?` |
| 切模型 | Ctrl+M 或 `/model <name>` |
| 取消运行中回合 | Ctrl+C |
| 新会话 | Ctrl+N 或 `/new` |
| 退出 | Ctrl+Q，或 `/quit` |
| 文件引用 | 在提示中使用 `@path/to/file` |

## 4. 常用 slash commands

```text
/model <name>          切换模型
/compact               压缩上下文
/context               查看上下文情况
/session-info          查看当前会话信息
/resume                恢复会话
/rewind 或 /undo        回退文件和对话到早前回合
/export                导出会话
/doctor                诊断终端能力
/mcps                  查看/切换 MCP
/skills                查看技能
/plugins               查看插件
/plan                  进入计划模式
/dashboard             打开 agent dashboard
/usage                 查看用量
/privacy               隐私设置
```

## 5. 权限建议

日常交互先用默认权限。只在可信仓库、明确任务、可回滚且你愿意承担批量命令风险时使用：

```powershell
grok --always-approve
```

更稳的方式是配合 deny 规则：

```powershell
grok -p "运行测试并修复失败" --always-approve --deny "Bash(rm -rf *)"
```

## 6. 一次高质量任务的闭环

1. 说明目标和不做什么。
2. 要求它先读相关文件并给证据。
3. 让它小步实现。
4. 要求它运行最小验证命令。
5. 让它总结改了哪些文件、验证结果、剩余风险。
