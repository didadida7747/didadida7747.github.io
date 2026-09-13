# 2025科协暑培 · Docker（于越洋, BV1eSb8zaEAf, 约 111 分钟）

## 定位

Docker 入门讲：三大概念 → run/build 命令 → 手写 Dockerfile（分层、上下文、多阶段构建）→ 数据卷与 Compose，收在一个 Django 后端容器化案例。三讲中动手收益最高的一讲，建议跟着敲、完整看。

## 内容脉络

- [0:00] 课前准备：装 Docker Desktop（不开应用 docker 命令就报错），`docker run hello-world` 验证；旧教程的"换源"已基本失效——国内镜像站大量关停，默认 Docker Hub 慢但能用。
- [2:22] 为什么用 Docker：配环境步骤多坑多；容器打包运行环境直接分发。三大优势——隔离安全（危险程序可扔容器跑）、环境一致（治"我机器上能跑"）、轻量（不含独立 OS，一台笔记本可开几十上百容器；对比虚拟机几十 GB）。
- [4:14] 典型场景：不同项目依赖同包不同版（pip/conda 之外的解法）；软工课 CI/CD 部署自动化；"无法复现他人环境"痛点（玩笑提到"你配码"整蛊项目，转写"您配马"，存疑）。
- [8:56] 三大概念：镜像 = 只含运行所需内容的特殊文件系统，构建后不变，分层存储（后述）；容器 : 镜像 ≈ 实例 : 类——容器是进程，有独立命名空间（内外看同一进程 PID 不同）；容器易失，持久化靠数据卷/挂载宿主目录（后述）；仓库（registry）≈ GitHub，按"仓库：标签"组织（ubuntu:24.04，缺省 latest），第三方镜像需加 username/ 前缀。
- [17:22] docker run：从镜像创建并启动容器（像构造函数）；启动命令执行完容器即停止（停止 ≠ 删除）；本地无镜像自动去 registry 拉取。选项：-d 后台、-e 环境变量、--rm 运行完即删、--name 命名、-p 端口映射、-it 交互+伪终端——`docker run -it --rm ubuntu` 即得即抛的 Ubuntu 环境，临时测试比虚拟机方便得多。
- [28:36] 其他命令：build 从 Dockerfile 构建镜像（-f 指定文件、-t 命名、末尾 `.` 为上下文，后述）；images 列镜像；ps 列容器（-a 全部）；exec 容器内执行命令；attach 连回后台容器；start/stop；rm/rmi（镜像被占用删不掉，先删容器）。
- [32:28] 串讲演示：后台建 Ubuntu → attach 进入 → Ctrl+P + Ctrl+Q 断开但容器不停 → stop/rm 清理 → cp 宿主机与容器间双向复制。
- [39:31] Dockerfile 语法（核心）：FROM 基础镜像；RUN 执行命令（apt install 加 -y、设环境变量禁交互防构建卡住）；WORKDIR 工作目录；COPY 宿主机→镜像（源可多个目标一个）；ENV 环境变量；EXPOSE 声明端口（仅提示，实际仍需 run 时 -p）；CMD 默认启动命令放最后，exec 数组形态更推荐。
- [48:06] 实操一：把"apt update → 装 build-essential → 写 main.cpp → g++ 编译运行"逐句翻成 Dockerfile，build 出 cpp:1.0，run 直接输出 hello world——环境从此可无限分发。
- [56:36] 实操二：代码不写死——改为 COPY 宿主机 main.cpp 再编译，通用化镜像。作业：多文件项目用 make/CMake，课下完成。
- [1:00:59] 分层存储：每条命令一层，类比继承（不完全一致）——每层完成即不可变，后层只能叠加，多镜像可共享底层；二次 build 时 update/install 层直接复用故秒完成。层多则体积大，用 `\` 换行 + `&&` 合并 RUN。容器层：镜像为只读基础，容器新建自己的可写层，生命周期与容器一致（解释易失）。
- [1:08:39] 构建上下文：build 末尾 `.` 指上下文路径而非 Dockerfile 所在（后者由 -f 指定）；客户端把上下文整体打包交引擎，COPY 源相对上下文、目标相对镜像工作目录——COPY `..` 或绝对路径会构建失败；演示了 Dockerfile 与上下文分离时的写法。
- [1:14:45] Django 实战：FROM python → 先 COPY requirements.txt 再 pip install（顺序错了构建失败，加 --no-cache-dir 减体积）→ COPY 代码 → ENV → 迁移脚本 → EXPOSE 80。run 时 -p 8000:80 实际映射，浏览器访问 localhost:8000 成功——再强调 EXPOSE 只是声明。
- [1:22:27] 多阶段构建：镜像 472MB 大在源码与工具链，编译完即无用。第一阶段 builder 编译，第二阶段 COPY --from=builder 只取可执行文件；换 alpine/scratch 再压缩——scratch 报 No such file or directory，因 g++ 产物动态链接标准库，加 -static 静态编译后成功，最终仅 2.25MB。
- [1:31:04] 数据管理：每次更新都重建容器，数据存容器必丢。数据卷：多容器共享、不影响镜像、容器删除也不消失；volume create/ls/inspect/rm 演示，run 时 --mount 挂载，inspect 查挂载关系。挂载主机目录：免建卷，源必须绝对路径，可 readonly，可只挂单文件（配置/环境变量），可叠加多项。
- [1:42:00] Compose：前端+后端+数据库三容器手敲长命令太繁琐，用一个 YAML 一键启停集群（先速通 YAML ≈ JSON 的简化写法）。要点：services 各对应一容器，build/ports/volumes 即 run 选项；restart 的作用——各服务启动顺序不定，backend 先起时数据库未就绪，就反复重启直到连上；数据库用现成 mysql 镜像挂数据卷。提醒密码别写进文件；`compose up`/`down`/`logs`。
- [1:49:30] 作业：为给定 C++ 项目写 Dockerfile，三档递进——能编译运行 → 多阶段减小体积 → scratch 作第二阶段；参考资料为官方文档与《Docker 从入门到实践》。

## 勘误对照

| 转写 | 应为 |
|---|---|
| LP/l pine/IPAD/ao pi | alpine（系统性） |
| UBU/U班图/有班图/U弯出 | Ubuntu（系统性） |
| 换元 | 换源 |
| 您配马 | （存疑）"你配码"整蛊项目 |
| 康纳的虚拟环境 | conda 的虚拟环境 |
| dog file/dr.f | Dockerfile |
| pp store | pip install |
| jungle/JGGO | Django |
| YAO/Y6 | YAML / value |
| 勾肩镜像 | 构建镜像 |
| 一湿 | 易失 |
| 二字/伪字耳字 | alias（别名） |
| cheat box | （存疑）讲师自建 Django 项目名 |
| MEXICO | MySQL |

## 编者补充

- 编者补充（跨集联系）：本讲的 Linux 依赖直接对应 07 讲（-it 终端、端口、挂载与"一切皆文件"、Docker Desktop 底层即 WSL）；MySQL 容器+数据卷案例为 09 数据库讲的 PostgreSQL 服务化给出容器化版本；Django 案例与 03 爬虫讲的 Django 呼应，指向软工部署链路。
- 编者补充（行动线）：亲手复刻 [56:36] 通用化 Dockerfile 与 [1:22:27] 多阶段构建（作业即三档递进）；EXPOSE 与 -p 的区别（[1:18:37]）和"上下文决定 COPY 可见范围"（[1:08:39]）是自学最常踩的坑。
- 编者补充（缺口）：未讲网络模式（bridge/host 仅 -p 带过）与镜像加速（明说超纲）；compose 未提 depends_on/healthcheck，用 restart 轮询替代，生产有更规范写法。
