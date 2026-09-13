# 2025科协暑培 · Docker（于越洋, BV1eSb8zaEAf）

## 定位

Docker 入门讲：三大概念 → run/build 命令 → 手写 Dockerfile（分层、上下文、多阶段构建）→ 数据卷与 Compose，收在一个 Django 后端容器化案例。三讲中动手收益最高的一讲，建议跟着敲、完整看。

## 知识整理

### 上手准备

装 Docker Desktop（不开应用则 docker 命令就报错），用 `docker run hello-world` 验证。旧教程里的"换源"已基本失效——国内镜像站大量关停，默认 Docker Hub 慢但能用。

### 为什么要用 Docker

手工配环境步骤多、坑多，Docker 的思路是把运行环境整个打包成容器直接分发。三大优势：隔离安全（危险程序可以扔进容器里跑）、环境一致（治好"在我机器上能跑"）、轻量（容器不含独立操作系统，一台笔记本能开几十上百个；虚拟机则动辄几十 GB）。典型场景：不同项目依赖同一个包的不同版本（pip/conda 之外的解法）、软工课 CI/CD 部署自动化、复现他人的环境。

### 三大概念：镜像、容器、仓库

镜像（image）是只包含运行所需内容的特殊文件系统，构建后不再改变，采用分层存储（见后）。容器（container）与镜像的关系如同实例与类：容器本质是进程，拥有独立命名空间（内外看到同一进程但 PID 不同）；容器是易失的，数据持久化要靠数据卷或挂载宿主目录（见后）。仓库（registry）类似 GitHub，镜像按"仓库：标签"组织（如 ubuntu:24.04，缺省 latest；第三方镜像要加 username/ 前缀）。

### run 与日常命令

`docker run` 从镜像创建并启动容器，像调用构造函数；启动命令执行完容器即停止（停止不等于删除）；本地没有镜像会自动去 registry 拉取。常用选项：-d 后台、-e 环境变量、--rm 运行完即删、--name 命名、-p 端口映射、-it 交互加伪终端——`docker run -it --rm ubuntu` 就是一个即抛型 Ubuntu 环境，临时测试比虚拟机方便得多。其余高频命令：build（从 Dockerfile 构建镜像，-f 指定文件、-t 命名、末尾 `.` 是上下文）、images 列镜像、ps 列容器（-a 含已停止）、exec 容器内执行命令、attach 连回后台容器、start/stop、rm/rmi（镜像被容器占用时删不掉，先删容器）。组合操作：后台建 Ubuntu → attach 进入 → Ctrl+P + Ctrl+Q 断开但容器不停 → stop/rm 清理；cp 可在宿主机与容器间双向复制。

### Dockerfile：把环境写成代码

指令速览：FROM 指定基础镜像；RUN 执行命令（apt install 记得加 -y、设环境变量禁交互，防止构建卡住）；WORKDIR 设工作目录；COPY 把文件从宿主机复制进镜像（源可多个、目标一个）；ENV 环境变量；EXPOSE 声明端口——注意仅是提示，实际映射仍要 run 时 -p；CMD 默认启动命令放最后，推荐 exec 数组形态。第一个实操是把"apt update → 装 build-essential → 写 main.cpp → g++ 编译运行"逐句翻译成 Dockerfile，build 出 cpp:1.0 后 run 直接输出 hello world——这个 C++ 环境从此可以无限分发；第二个实操把写死的代码改成 COPY 宿主机文件再编译，即成通用化镜像。

### 分层与构建上下文：两个必懂机制

分层存储：每条指令生成一层，类似继承（不完全一致）——每层完成即不可变、后层只能叠加、多镜像可共享底层；二次 build 时 update/install 层直接复用缓存故秒完成。层越多体积越大，可用 `\` 换行加 `&&` 合并 RUN。镜像只读，容器在其上新建自己的可写层、生命周期与容器一致——这正是容器易失的原因。构建上下文：build 命令末尾的 `.` 指的是上下文路径而非 Dockerfile 位置（后者用 -f 指定）；客户端把整个上下文打包交给引擎，COPY 的源相对上下文、目标相对镜像工作目录，因此 COPY `..` 或绝对路径会直接构建失败。

### 多阶段构建：从 472MB 到 2.25MB

镜像 472MB 大在源码与工具链，而它们编译完就没用了。多阶段构建分两段：第一阶段 builder 负责编译，第二阶段 `COPY --from=builder` 只取可执行文件；再换 alpine 或 scratch 做基础。换 scratch 报 No such file or directory，因为 g++ 产物动态链接标准库，加 `-static` 静态编译后成功，最终仅 2.25MB。

### 数据持久化：数据卷与挂载

每次更新都要重建容器，数据存在容器里必丢。数据卷由 Docker 管理：多容器可共享、不影响镜像、容器删除也不消失，用 volume create/ls/inspect/rm 管理，run 时 --mount 挂载、inspect 查挂载关系。也可以直接挂载宿主机目录：免建卷，源必须是绝对路径，可加 readonly，可只挂单个文件（适合配置/环境变量），还可叠加多项。

### Compose：一个 YAML 编排多容器

前端+后端+数据库三个容器手敲长命令太繁琐，Compose 用一个 YAML（≈JSON 的简化写法）一键启停集群。要点：services 下每项对应一个容器，build/ports/volumes 就是 run 的选项；restart 很关键——各服务启动顺序不定，backend 先起而数据库未就绪时会反复重启直到连上；数据库直接用现成 mysql 镜像挂数据卷。密码别写进文件。日常就是 `compose up` / `down` / `logs`。

### 作业

为给定的 C++ 项目写 Dockerfile，三档递进：能编译运行 → 多阶段减小体积 → scratch 作第二阶段。参考资料为官方文档与《Docker 从入门到实践》。

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
