# 2026科协暑培 · 第1讲 CS 生存指南（陈毓椿, BV1CFK26nErF）

## 定位

科协暑培 2026 的开篇讲，不讲任何技术原理，只回答三个问题：有什么工具、入口在哪里、不会的时候怎么查。适合刚进计算机系、还没建立"自己找资料"习惯的同学；对已有一定检索与 Linux 经验的读者，价值集中在 AI 问答与传统检索关系的讨论、以及网络/代理常识一节。课程主页 https://summer26.net9.org/basic/survival-guide/ ，讲者整理的学习资源入口页挂在主页下。

## 知识整理

### 信息获取的渠道地图

好的搜索源很大程度决定信息质量。CS 学生很多资料要靠国外网站，Google 较百度常用。按场景分四类：搜索引擎最直接暴力，靠关键词；技术社区里 Reddit 偏技术交流、Stack Overflow 面向开发者解决报错、Hacker News 汇集技术文章；开源仓库上 GitHub 找轮子、技术文档与参考实现；视频渠道有 YouTube 与 B站。科研场景另有 Google Scholar、知网、arXiv，投稿要查会议/期刊的 call for papers 与 DDL。

讲者特别强调一个最容易被忽视的渠道：问学长学姐。当你面临一个问题甚至不知道怎么描述它、找不到切入点的时候，一个厉害的学长学姐比任何搜索方式都高效得多。

### AI 问答与传统检索的关系

ChatGPT 出现后 AI 整合信息的能力已超过人工检索，如今配上 web search 更是如此；DeepSeek、豆包、智谱（清华系企业）、Kimi、Claude Code 都是常见工具。但讲者的观点是有了 AI 仍需要传统检索：agent 本质仍是调用搜索接口做信息整合；且问题描述不清时 AI 会瞎猜、输出大量内容，把任务从"找对渠道获取准确信息"变成"从海量的垃圾里面筛选精确信息"，阅读成本反而更高。结论不是不用 AI，而是用 AI 加速开发与学习的同时，保留自己判断信息源的能力。

### 学习资源入口

讲者整理的入口页按类划分：课程类（科协自己的技术文档 SST、MIT Missing Semester）；语言/框架官方文档（Python Docs、Rust 圣经、Docker/React/Vue/K8s 各有官方文档）；学术类（arXiv 与各领域顶会）；社区类（Stack Overflow、Reddit、Hacker News）；杂项（Linux 手册类、LeetCode、Hugging Face 的开源模型与数据集）。这一页本身就是本讲最实用的产出——知道入口比记住内容重要。

### Linux：为什么与怎么上手

讲者作为 macOS+Windows 双用户被 Windows 环境管理折磨（PowerShell 用着硌手）是转向 Linux 的触发点。除少数面向 Windows 的客户端开发外，大部分开发学习都可在 Linux 完成；进组/实习接触的服务器一般是 Ubuntu Server 或 Debian，本机用 Linux 可获得一致的工作环境。Linux 内核由 Linus Torvalds 1991 年发布，Git 也是他写的——当年因为不满一个闭源版本管理工具把老哥惹火了，他就自己手搓了一个。

操作系统常识（定义、桌面/移动/服务器/嵌入式四分类）属教材内容，可跳过。上手方式的折中方案有 WSL（纯 terminal 环境）、VirtualBox 虚拟机、Docker、SSH 连服务器；讲者喜欢在虚拟机里装 Kali 捣鼓实验性网络环境。常见发行版的定位：Ubuntu desktop 最经典；Debian 是 Ubuntu 上游、更简洁复古；Arch 以可配置性强出名；Fedora；Kali 面向网络安全人员、预装渗透工具、体积很小。

### CLI 基本功

常见 shell 有 sh/zsh/bash/fish，Ubuntu desktop 默认 bash。记不清指令用法用 man 或 tldr（更精简直观）。环境变量：export 设置、echo 查看；PATH 记录系统执行指令时默认搜寻的路径（which echo 查到 /usr/bin/echo）。一个重要习惯：把密钥/密码设为环境变量而非写进代码——"这个东西不能上库"。

### tmux 与 SSH

tmux 的两大用途：本机分屏（类比 macOS cmd+D），以及更重要的——SSH 连远程服务器时把程序挂后台。SSH 管道断裂对端程序会被杀死，用 tmux 挂起后 CTRL+B 再按 D 退出窗口，训练模型时盖上电脑也不怕。SSH 的认证原理：非对称加密认证、对称加密传输；本机生成密钥对，私钥留本机，公钥交给服务器管理员加入认证列表，认证靠"公钥加密的消息只有私钥能解开"。登录格式 user@IP，可写配置文件简写。VS Code 装 SSH 插件可直连服务器开发（对端自动下载 VS Code server）。末尾顺带提到进程、文件系统、信号（CTRL+C 是 SIGINT）、用户权限等进阶话题，点到为止。

### 常见问题排查思路

五类问题五条路：缺包/缺工具→Debian 系 apt install/apt-get，Arch 系 pacman；记不清指令→-h/--help（不如 man 详细）；权限不够→sudo 提权（需在 sudo 组内，删除类操作要慎重）；环境问题→打印环境变量复查；格式错误→靠现代编辑器语法高亮（讲者用 LazyVim）；网络问题→ping、查 DNS 缓存、配代理、curl 探测。

### Git 与 GitHub

Git 本身是完整的版本控制软件，GitHub 是公众认知里更多的那一面。存储差异、分支各自实现再合并、冲突以 conflict 形式提醒——这些基本原理与 add/commit/push 流程对做过课程作业的学生已熟练，略。值得注意的是分布式管理思想：集中式需要大家抢中心服务器（上锁增加维护成本），Git 让每人本地拥有完整仓库，名义上保留中心仓库但开发前同步、然后离线开发。

GitHub 生态五个概念：issue 是反馈问题的面板；pull request 发起合并请求、review 后合并（GitHub 现在还集成 agent 做 code review）；Action 是 CI/CD 的 pipeline（push 后自动跑测试构建=CI，自动部署=CD，需写配置脚本）；release 发布；wiki。下载开源项目区分 clone 与 fork：clone 可动态跟踪仓库（频繁 pull/fetch），fork 是把仓库整个 copy 到个人账户（变静态，同步需从远端 merge 或 rebase）。认证推荐 SSH：把公钥上传到 GitHub Settings 的 SSH keys 页面。

分支管理惯例：主分支维护稳定版、开发分支维护 beta 版，每次从开发分支切出、开发完再合并。

### 网络与代理常识

科学上网两大方式：proxy 代理（如 Clash，本质是一套转发规则——请求命中网址前缀/后缀/IP 网段等规则就转发到下一跳）与 TUN/VPN（本地网络层建虚拟网卡，让部分或全部 IP 流量走隧道到对端服务器转发）。讲者强调 proxy 和 VPN 是通用技术、并非专为翻墙存在：访问内网也常用 VPN 建加密虚拟通道，如清华校外访问 info 需要 VPN。Linux 网络工具：ip address 查看网卡和 IP，ip route 看路由转发表。

收尾观点：AI 发达的时代没必要一一细讲，知道有什么工具、入口在哪里即可——这句话也正是本讲的定位。

## 勘误对照

| 转写 | 应为 |
|---|---|
| LINUX托瓦斯 | Linus Torvalds |
| 乌曼诺 | Ubuntu |
| 灭队 | 密钥对 |
| 饲料 | 私钥 |
| 染训 | 认证 |
| 依兰/历史 | Linux |
| 一休/艺术的反馈 | issue |
| week | wiki |
| clown | clone |
| 破/破局 | pull / push |
| SHK页面 | SSH keys 页面 |
| BPN/V篇/pose | VPN / proxy |
| 吓一跳 | 下一跳 |
| 日文转发表 | 路由转发表 |
| 属培/数培/储备 | 暑培 |
| GBT5.6/GB | GPT（GPT-5.6） |
| gm m5.2 | Gemini（存疑） |
| 军用了N | ChatGLM（存疑） |
| H能力/AH呢 | AI（本集系统性音误） |
| system on trips | system on chip |
| JO | Vue |
| IHO | IETF（存疑） |
| 买绿 | ML/机器学习 |
| vs co | VS Code |
| lazy vii门 | LazyVim |
| in the hub | GitHub |
| 处分之 | 主分支 |
| web coin | Copilot（存疑） |

## 编者补充

- 编者补充（跨集联系）：本讲反复把细节指向"往年讲义"，与本合集的 Linux/Git 相关内容构成"总览→深入"结构；SSH 密钥认证一节与第 4 讲后端 JWT 的"公私钥/签名防篡改"思想同源，可对照理解非对称加密的两个用途。
- 编者补充（行动线）：①装 WSL2 或 VirtualBox + Ubuntu，跑通 man/tldr、export/echo、which、SSH 免密登录的最小流程；②注册 GitHub 并在 Settings 的 SSH keys 页上传公钥，clone 一个感兴趣的开源仓库，体会 clone 与 fork 的区别。
- 编者补充（缺口）：WSL、VirtualBox、Docker 三者都是"在 Windows 上获得 Linux 环境"的方案，但三者差别与选型本讲未讲；Git 只讲了流程没有演示 conflict 的实际解决；Clash 的规则文件长什么样也没有展示——这三处感兴趣的读者需要自行补。
