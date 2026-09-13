# 2025科协暑培 · Linux & Git（陈毓椿, BV1Hh81z9EM5, 约 63 分钟）

## 定位

基础技能培训的 Linux 入门讲（标题含 Git 但本集只讲到 Linux 收尾，Git 应在后一集）：从"Linux 是什么、在哪用、怎么装"讲到 shell/文件系统/常用命令，收尾于 SSH、作业管理与权限。零基础向、演示多；已会用 WSL 和常见命令的可只看 SSH 与权限段。

## 内容脉络

- [0:05] 开场：本讲为"基础 check 第一部分"，讲义在课程主页无额外课件，纠错留言渠道在视频下与主页；Linux 与 Git 系列分次讲。
- [1:33] Linux 是什么：开源类 Unix 操作系统，内核 1991 年由 Linus Torvalds（转写"NAS TOBZ"）发布；遵循 GNU 规范可自由使用与二次开发，故社区生态庞大。"Linux"严格指内核，日常指基于内核的完整系统。
- [2:57] 用在哪：个人 PC 主流是 Windows/macOS，Linux 主战场在服务器、超算、嵌入式（树莓派、路由器、机顶盒）——不装桌面只留命令行即可运行，轻量是核心优势。
- [4:53] 四种使用方式：单装、双系统、虚拟机、WSL（微软官方子系统，安装最方便，本课用它演示）；另可 SSH/RDP 远程连服务器，举计算机系统概论作业全程在服务器完成的例子。
- [8:11] 发行版：内核之上加装工具/桌面/软件的完整版本，DistroWatch 有排名。主流速览——Ubuntu（用户最多、Desktop/Server 之分）、Debian（Ubuntu 上游、服务器友好）、Arch（转写"R1个arch linux"）、Manjaro、Fedora、NixOS、Kali（渗透测试专用）。⏭️可跳过（选型时再回看的科普罗列）。
- [13:23] 安装流程：WSL 在"程序与功能"开选项后 `wsl --install`（默认 Ubuntu），`wsl --list --online` 查可选；双系统/单系统需刻录 ISO 到 U 盘、预留磁盘空间、进 Boot Menu 启动；Mac 用户不必装，终端本身即类 Unix，差别只是包管理器。⏭️可跳过（装环境时再看）。
- [18:45] CLI 与 shell：用户到内核的中介称 shell（图形界面也算 shell）；Linux 推荐用 CLI。常见 shell 有 sh/bash/zsh/fish，可经环境变量查看与切换。
- [26:02] 设计哲学"一切皆文件"：目录、设备、管道、socket 都按文件处理；`cd` 这类指令本身也是 /bin 下的二进制，系统靠遍历环境变量路径找到程序。
- [27:59] 文件层级：Windows 分 C/D 盘，Linux 一切挂载在根 `/` 树上，`~` = /home/username；走了一遍 /bin、/boot、/etc（配置）、/root、/mnt（WSL 下映射本机盘符，可做文件共享）。
- [31:50] 常用命令：cd（`.`/`..`/`~`）、ls -a（看 .git 隐藏文件）、mkdir、cp、clear；rm -r 递归、-f 强制——强调 rm 不可逆无垃圾桶，有管理员权限时要三思；密码输入不回显是安全设计。
- [33:45] man 与 tldr 查文档：`man touch` 全量官方文档；tldr 简短带示例，另有中文文档。
- [35:35] 重定向：`echo hello > main.c` 覆盖、`>>` 追加；更常见于 `./a.out < in.txt > output.txt`。讲师认为编辑文件应直接用 VS Code（WSL 插件可直连）；无 IDE 时用 vi/vim——几乎所有 Linux 自带，`i` 插入、`:wq` 保存退出。
- [46:19] SSH：加密的远程登录/传输协议；`ssh user@host`（IP 或域名），`-p` 指定端口；scp 传文件——注意其 `-P` 必须大写且只能放前面（与 ssh 不同）。
- [50:15] 密钥认证：不推荐密码登录（防爆破），`ssh-keygen` 生成公钥私钥存 ~/.ssh；私钥永远不要暴露；proxy/jump 等进阶自行了解。
- [51:43] 作业管理：`&` 放后台、`fg`/`bg` 调度、Ctrl+C 停止、Ctrl+Z 挂起、`jobs` 查看。tmux：SSH 断开后会话仍在、可多窗口，Ctrl+B 为前缀键；Mac 终端自带分屏可达类似效果。
- [56:25] 用户与提权：`sudo` 以 root 身份跑命令（需密码），`id` 看用户信息；`su` 直接切用户——Ubuntu 等禁止 root 密码登录（转写"snication failure"），只允许 sudo 提权。
- [59:21] 用户组与文件权限：`ls -l` 看十位权限字段——首字符标类型，r/w/x 分所有者/组/其他三组；`chmod`（符号或三位八进制）、`chown` 改所有者；用户组详解见扩展链接的中科大教程。
- [1:01:43] 收尾：推荐课后读科协文档理解命令如何被接受运行；Git 内容预告（本转写未含）。

## 勘误对照

| 转写 | 应为 |
|---|---|
| 速度/速指令 | sudo（系统性） |
| TEAMES/team | tmux |
| 特米隆 | terminal |
| 二维端口 | 22 端口 |
| F聚/B句 | fg / bg |
| 乌棒图/dean/man jo/federal/carry linux | Ubuntu / Debian / Manjaro / Fedora / Kali Linux |
| 尼斯命 | （存疑）某基于 Ubuntu、界面更现代的衍生发行版 |
| SN开到snication failure | authentication failure |
| STG | （存疑）ssh-keygen |
| KATE | cat |
| 拳击指令 | 前缀指令（prefix） |
| BMX | （存疑）VMware 虚拟机配置格式 |

## 编者补充

- 编者补充（跨集联系）：本讲"一切皆文件"与挂载是 08 Docker 讲"镜像即 root 文件系统"的铺垫；SSH/密钥与 03 爬虫讲的远程服务器场景呼应；用户/权限概念在 Docker 挂载（只读等）处再现。
- 编者补充（行动线）：按 [13:23] 装好 WSL，用 tldr 学命令（[33:45]）；SSH 密钥配置（[50:15]）建议立刻做掉——连课程服务器与 GitHub 都要用。
- 编者补充（缺口）：标题称含 Git 但本集未讲；无 umask、符号链接、.bashrc 等日常配置内容，需按讲师推荐看 23 年讲义补。
