# SI100+ 2026夏 · Lec.00 环境配置微课（BV1HauP6gET8_P1）

## 定位
SI100+ 第零课的录播微课（时长 41 分钟），手把手带新生完成编程环境安装与自检全流程：检查 Windows 用户名 → 安装 VS Code 及插件 → 安装 UV → 给 UV 配置 PyPI 镜像源 → 用 `uv sync` 初始化课程 notebook 并跑通第一个程序。以录播形式提供，方便反复暂停、看清操作细节，为之后使用编程环境打基础。

## 知识整理

### 为什么第零课是"零"
第零课之所以叫"零"，是因为它最基础也最重要。之后的正课都以这套编程环境为地基，环境配不顺，后面的课都无法跟上，所以单独做成微课把安装流程走通。

### 配置前的自查：Windows 用户名必须是英文
装任何东西之前，Windows 用户先检查用户名是否为英文：

```
开始菜单右键 → 打开终端 → 输入 whoami → 回车
```

- 纯英文或纯数字的用户名是安全的。
- 含中文字符的用户名有隐患：部分程序可能无法正确识别中文用户名或含中文字符的路径，"可能就会包含一些潜在未来的危险"。
- 应对：最简单是新建一个英文名称的用户；PIAZA 上会发帖详细说明。遇到任何问题去 PIAZA 或 Office Hour 求助，助教都很乐意帮忙。

本节课以 Windows 11 为演示环境；其他系统大部分已有文档覆盖，小部分问题欢迎求助。

### 目标环境：UV + Jupyter Notebook + VS Code
本课只配一套可用于 SI100B/SI100+ 课程的环境，三件套分工：

| 工具 | 作用 |
| --- | --- |
| UV | 非常快速的 Python 版本和环境管理器 |
| Jupyter Notebook | 交互式笔记本，融合代码、文本等多种元素；课程还准备了交互式的 `.ipynb`（PIAZA 可下载 lecture0 的） |
| VS Code | 目前最好用的代码编辑器，插件生态丰富、支持多语言 |

什么是"环境""环境管理""Python 版本"，留到正课（P2）讲。

### 安装 VS Code 与两个官方插件
1. **下载安装**：官网下载页点 "download for windows"。安装包格式按系统区分——Windows 为 `.exe`、macOS 为 `.dmg`、Linux 可用 `.deb`〔ASR原文"DBM"，疑为 deb〕或 `.rpm`。macOS 下载 dmg 后打开、拖拽到 Application 文件夹即可。
2. Windows 安装向导：同意协议 → 安装位置（不确定就默认）→ 开始菜单文件夹默认 → 创建快捷方式时"推荐把所有的选项都打开"→ 完成。
3. macOS 备选方案：不熟悉安装程序也可用系统自带包管理器——更纯净、更少遇到"诈骗软件"风险，但操作难度更高，量力而行。
4. **网络提醒**：很多工具要从 GitHub 下载 binary 或源代码，没有网络加速可能遇到问题，别硬扛，欢迎求助。
5. **装插件**：首次打开的欢迎页可用 GitHub 账户登录或直接关掉；点侧边栏四个正方形拼图图标（extensions），搜索 Python 与 Jupyter 两个插件——"认准 publisher 是 Microsoft 官方"再 install。
   - Python 插件其实是个插件集合：会连带安装 Python Environments（管理环境）、Python Debugger（调试）、Pylance 语法插件〔ASR原文"ALEX"，疑为 Pylance〕等；Jupyter 也会装一系列渲染器。
   - 弹窗提示安装 UV 时暂时取消，"之后可能会遇到一些别的问题"。

### 安装 UV：用课程镜像命令，不用官方脚本
- UV 可通过官方脚本安装但并不推荐——没有校园网加速可能访问不了 GitHub。
- 课程提供镜像安装命令：Windows 复制后右键开始菜单 → 打开终端（PowerShell）→ 粘贴（有警告选"仍要粘贴"〔ASR原文"人文粘贴"〕）→ 回车；显示 `download uv 0.12.3`，很快装完。
- **关键一步（常见坑）**：装完直接输 `uv` 很可能没反应，需要新开一个标签页/重新打开 PowerShell 终端，再输入：

```
uv --version
```

能返回版本号即安装成功。
- 其他安装方式：pip（不推荐——UV 是独立于 Python 环境的）；系统自带包管理器（Windows 上为 winget〔ASR原文"windows r"〕）。判断标准统一：`uv --version` 能返回正常版本号。

### 换 PyPI 镜像源：为什么要换、怎么换
- **为什么要换**：UV 装依赖要从官方 PyPI 服务器下载，官方 PyPI 是国外服务器、国内下载很慢。镜像源是国内对各种库和包的全量备份，相当于直接与国内服务器通讯、起到加速作用。推荐校园网联合镜像站〔ASR原文"校园网流和镜像站"〕提供的 PyPI 服务，里面还有别的仓库可以逛。
- **怎么换**：最基础的是镜像站帮助文档给出的方法（直接填写内容）；课程提供了更简约的一键镜像配置脚本——Windows 复制一行、macOS〔ASR原文"map s"〕/Linux 复制另一行，粘贴到终端回车即完成换源〔ASR原文"换元"〕。

### 用 VS Code 跑通第一个 Notebook
微课只走到这里，Part 2、Part 3 留到正课。流程五步：

1. **整包解压**：新建一个文件夹（如 SI100+），把从 PIAZA 下载的压缩包全部解压进该文件夹。"千万不要单独对 Jupyter 文件点开，这是一个错误的操作。"
2. **打开文件夹**：VS Code → File → Open Folder → 选择刚解压的课程目录；提示没找到 Python 时点 cancel。
3. **`uv sync`**：terminal → New terminal → 输入 `uv sync`。UV 解析依赖并并行自动安装，速度非常快——这正是选 UV 而不是 pip 或其他包管理器的原因。安装完成后目录里多出 `.venv` 文件夹 = 创建出来的虚拟环境（virtual environment）。
4. **选 kernel**：打开课程的 `.ipynb` 文件（之后几乎大部分课程都会配这种文件，可课前下载自行探索游玩）→ 右上角 Select Kernel → Python Environments → 查看是否已有环境；没有就点 Create Python Environment → Enter interpreter path → 打开 `.venv` 下的 scripts 文件夹（Linux 用户对应选 bin 文件夹）→ 选 python。正确识别后会显示项目名（lecture0 environment〔ASR原文"phero environment"〕）。
5. **运行验证**：鼠标悬浮在代码块上、点左上角运行按钮——输出 Hello SI100+；再运行 pyjokes〔ASR原文"拍jokes"〕（一个输出程序员笑话的简单工具库），正常输出一段"晦涩难懂的程序员笑话"。看到 hello 和正常输出即代表环境配置与依赖同步成功。

## 编者补充
- 全课两个大坑，装环境前后各检查一遍：①中文用户名/中文路径可能导致程序异常（装前自查 `whoami`）；②无校园网加速时访问 GitHub 受限（所以装 VS Code/UV 都优先用课程镜像渠道）。
- 讲者的取舍逻辑值得记住：包管理器安装（系统自带）更纯净但门槛更高，新手量力而行；装 UV 不用官方脚本、优先课程镜像命令；一切求助走 PIAZA 或 Office Hour。
- 常用命令速查：`whoami`（查用户名）、`uv --version`（验证 UV 安装）、`uv sync`（按清单装依赖建虚拟环境）；操作路径速查：开始菜单右键→打开终端；VS Code 内 terminal→New terminal。
- 版本备注：演示中下载显示 0.12.3、`uv --version` 显示 0.12.2，原文两处不一致，以实际返回为准。
