# 2025科协暑培 · Linux & Git（陈毓椿, BV1Hh81z9EM5）

## 定位

基础技能培训的 Linux 入门讲（标题含 Git 但本集只讲到 Linux 收尾，Git 应在后一集）：从"Linux 是什么、在哪用、怎么装"讲到 shell/文件系统/常用命令，收尾于 SSH、作业管理与权限。零基础向、演示多；已会用 WSL 和常见命令的可只看 SSH 与权限段。

## 知识整理

### Linux 是什么、用在哪

Linux 是开源的类 Unix 操作系统，内核 1991 年由 Linus Torvalds（转写"NAS TOBZ"）发布，遵循 GNU 规范可自由使用与二次开发，因此社区生态庞大。"Linux"严格说只指内核，日常说的则是基于内核的完整系统。个人 PC 主流仍是 Windows/macOS，Linux 的主战场在服务器、超算与嵌入式（树莓派、路由器、机顶盒）——不装桌面、只留命令行即可运行，轻量是核心优势。

### 四种用法、发行版与安装

用上 Linux 有四条路：单装、双系统、虚拟机、WSL（微软官方子系统，安装最方便，本课用它演示）——此外还可 SSH/RDP 远程连服务器，讲师举例计算机系统概论作业全程在服务器完成。WSL 装法：在"程序与功能"开选项后执行 `wsl --install`（默认 Ubuntu），`wsl --list --online` 查可选；双系统/单装则需刻录 ISO 到 U 盘、预留磁盘空间、进 Boot Menu 启动。Mac 用户不必装——终端本身就是类 Unix，差别只在包管理器。发行版是内核之上加装工具/桌面/软件的完整版本（DistroWatch 有排名）：Ubuntu 用户最多（分 Desktop/Server）、Debian 是其上游且服务器友好、Arch/Manjaro、Fedora、NixOS、Kali 专攻渗透测试。本节与安装流程都是"装环境时再回看"的内容，若你已装好 WSL 可跳过。

### shell 与"一切皆文件"

用户与内核之间的中介称 shell（图形界面也算一种 shell），Linux 推荐用命令行 CLI，常见 shell 有 sh/bash/zsh/fish，可经环境变量查看与切换。Linux 的设计哲学是"一切皆文件"：目录、设备、管道、socket 都按文件处理；`cd` 这类命令本身也是 /bin 下的二进制程序，系统靠遍历环境变量路径找到它们。文件系统组织上，Windows 分 C/D 盘，Linux 则一切挂载在根 `/` 构成的一棵树上，`~` 即 /home/username；常见目录：/bin（程序）、/boot、/etc（配置）、/root，/mnt 在 WSL 下映射本机盘符，可做文件共享。

### 日常命令、查文档与编辑

高频命令：cd（`.` 当前、`..` 上级、`~` 家目录）、`ls -a` 看隐藏文件（如 .git）、mkdir、cp、clear。rm 必须牢记：`-r` 递归、`-f` 强制，删除不可逆、没有垃圾桶，有管理员权限时务必三思；输密码不回显是安全设计而非故障。忘了用法就查文档：`man touch` 给全量官方手册，tldr 给简短带示例的速查（另有中文版）。输出可重定向：`echo hello > main.c` 覆盖写入、`>>` 追加，更常见于 `./a.out < in.txt > output.txt` 这样的组合。编辑文件优先用 VS Code（WSL 插件可直连）；无 IDE 时用 vi/vim——几乎所有 Linux 自带，`i` 进插入模式、`:wq` 保存退出。

### SSH：远程登录与密钥认证

`ssh user@host`（host 为 IP 或域名）登录远程机器，`-p` 指定端口（默认 22）；`scp` 传文件——注意其端口参数是大写 `-P` 且只能放前面，与 ssh 不同。生产环境不推荐密码登录（防爆破），标准做法是 `ssh-keygen` 生成公钥私钥存于 ~/.ssh，私钥永远不要暴露；proxy/jump 等进阶用法自行了解。

### 作业管理与用户权限

长任务管理：`&` 放后台、`jobs` 查看、`fg`/`bg` 调度、Ctrl+C 终止、Ctrl+Z 挂起。tmux 更进一步：SSH 断开后会话仍在、可开多窗口，Ctrl+B 是前缀键；Mac 终端自带分屏可达类似效果。权限方面：`sudo` 以 root 身份执行命令（需密码），`id` 看用户信息，`su` 直接切换用户——Ubuntu 等发行版禁止 root 密码登录（转写"snication failure"），只允许 sudo 提权。`ls -l` 输出的十位权限字段：首字符标类型，其后 r/w/x 按所有者/组/其他分三组；`chmod`（符号式或三位八进制）改权限、`chown` 改所有者；用户组详解见讲义链接的中科大教程。

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
