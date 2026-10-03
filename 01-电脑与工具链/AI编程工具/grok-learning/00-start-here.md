# 00 - 从这里开始

目标：快速上手 Grok Build 的日常开发操作，同时保留通往自动化、MCP、插件、subagents、headless 和 API 的路线。

## 先区分三个东西

| 名称 | 主要用途 | 你现在该怎么用 |
|---|---|---|
| Grok Build CLI | 终端里的 agentic coding 工具，能读仓库、改文件、运行命令、管理会话 | 主线学习对象；在项目目录运行 `grok` |
| Grok 网页/App | 面向聊天、搜索、图像/视频等交互 | 可作为补充，不等同于 Grok Build |
| xAI API | 用模型能力构建自己的应用或 agent loop | 进阶路线；先学会 CLI，再学 Responses API 和工具调用 |

## 本机可直接运行

```powershell
cd "E:\ai资料(豆包)\01_电脑使用与工具链\AI编程工具\grok使用"
E:\grok\bin\grok.exe --version
E:\grok\bin\grok.exe doctor --json
E:\grok\bin\grok.exe inspect
E:\grok\bin\grok.exe
```

如果新开 PowerShell 后 PATH 已生效，也可以直接使用：

```powershell
grok --version
grok
```

## 最小可用心法

1. 在具体项目目录启动，不要在无关目录里让它猜。
2. 第一轮让它先读 README、目录、测试命令和关键文件。
3. 小改动可以直接让它实现；中大型改动先让它出计划或配合 `skills/ai-governance`。
4. 涉及删除、批量改动、数据库、权限、部署时，不开无脑自动批准。
5. 每次让它改完都要求验证：运行测试、检查产物、读回关键文件。

## 资料分类

- 快速上手：`01-quickstart.md`
- 命令速查：`02-command-cheatsheet.md`
- 进阶地图：`03-advanced-map.md`
- 练习路线：`04-practice-plan.md`
- 本机配置：`reference/local-environment.md`
- 官方来源索引：`reference/source-index.md`

