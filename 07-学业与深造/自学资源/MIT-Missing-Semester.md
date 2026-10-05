---
title: "MIT Missing Semester · 计算机教育中缺失的一课"
---

# MIT Missing Semester · 计算机教育中缺失的一课

> 官方站点：\<https://missing.csail.mit.edu/> ｜ 中文翻译版：\<https://missing-semester-cn.github.io/>
> 主讲：Anish Athalye、Jon Gjengset、Jose Javier Gonzalez Ortiz（MIT CSAIL），课程源码在 GitHub `missing-semester/missing-semester`，内容以 CC BY-NC-SA 授权。

## 这门课是什么

MIT 在每年一月 IAP（独立活动期）开的短期课。官方定位一句话：**传统计算机课程教你"伟大的课题"——操作系统、数据库、机器学习……却默认你已经会用自己的工具**；没人教命令行、编辑器、版本控制、调试，这些恰恰是每天都要用的东西，工具不熟 = 一切研究学习都被拖慢。课程把这一课补上，目标是让你对工具足够熟练，从而把时间花在更有意思、更有价值的问题上。

**2026 年新版的一个重要变化**：不再单独设 AI 讲座，而是**把最新的 AI 工具和技术直接融入每一讲**——例如 shell 讲座里就有让 AI 解释命令、智能体编程（Agentic Coding）成为独立一讲。

## 课程内容（2026 年 IAP 版，共九讲）

| # | 讲次 | 主题 |
|---|---|---|
| 1 | Course Overview + Introduction to the Shell | 课程总览 + Shell 入门 |
| 2 | Command-line Environment | 命令行环境（任务控制、tmux、点文件） |
| 3 | Development Environment and Tools | 开发环境与工具（编辑器、终端） |
| 4 | Debugging and Profiling | 调试与性能分析 |
| 5 | Version Control and Git | 版本控制与 Git |
| 6 | Packaging and Shipping Code | 代码打包与发布 |
| 7 | Agentic Coding | 智能体编程（2026 新增） |
| 8 | Beyond the Code | 代码之外（2026 新增） |
| 9 | Code Quality | 代码质量（2026 新增） |

历年特别主题（部分年份出现，讲义仍可读）：数据整理、安全与密码学、大杂烩、备份与同步、自动化、系统定制、Web 与浏览器等。

## 怎么获取材料

- **讲义**：官网每讲均有完整文字笔记，**英文原版免费在线阅读**；社区翻译约 19 种语言，简体中文版在 missing-semester-cn.github.io（官方注明"未经验证"，个别术语翻译可能不准）；
- **视频**：YouTube 播放列表（2019 / 2020 / 2026 三季都有），国内可直接看 B 站搬运（搜索 "MIT Missing Semester" 有多个中文字幕版）；
- **讨论**：OSSU Discord 有课程频道；中文社区另有配套**习题解答**站点。

## 为什么值得大二马上用

1. **正好接上你现在的课**：SI100+ Lec00 刚用 uv 建了第一个虚拟环境，Missing Semester 第 1–2 讲就是把 shell、环境变量、任务控制讲透——你在 Lec00 遇到的"工作目录 ≠ 你以为的目录"问题，在课程里有系统性答案。
2. **它是你第一份科研/实习工具底座**：Git 分支、调试器（`gdb`/`pdb`）、性能分析（`perf`/`profiler`）这三样，是大二下进实验室、暑期实习第一周就会被默认会的东西。
3. **2026 版把 AI 用法编进了每一讲**，正好和 SI100+ 老师说的「自学多问 + GPT」呼应——工具和 AI 是一套工作流，不是两个话题。

## 建议用法（两周节奏）

| 天 | 做什么 |
|---|---|
| 第 1–2 天 | 第 1 讲 Shell 入门：`pwd`/`ls`/`pipe`/`>` 重定向，把自己每天手动点开的操作命令行化 |
| 第 3–4 天 | 第 2 讲命令行环境：tmux、`~/.zshrc` 点文件，把常用别名固化下来 |
| 第 5 天 | 第 5 讲 Git（可先跳读）：`clone/commit/branch/merge/log`，配合本站 [STM32 工作流](#/doc/d285) 里的项目练 |
| 第 6 天 | 第 4 讲调试与性能分析：学 `pdb` 单步 + `time`/`memory_profiler`，下个 debug 时用上 |
| 第 7+ 天 | 第 3/6/7 讲按需看：编辑器配置、打包发布、智能体编程 |

练习比视频重要：每讲讲义末尾有 exercises，**务必动手做完**再进下一讲。

## 相关链接

- 英文官网：\<https://missing.csail.mit.edu/>
- 中文翻译：\<https://missing-semester-cn.github.io/>
- 课程源码（GitHub）：\<https://github.com/missing-semester/missing-semester>
- 中文习题解答：社区维护，可从中文站页脚进入

---
建档：2026-09-04。信息源：英文官网、中文翻译站官方说明页。
