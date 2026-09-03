# BV1HauP6gET8_P1 [SI 100+] Lec.00 环境介绍与配置——环境配置（微课部分）

## 定位
SI100+第零课的录播微课（时长41分钟），手把手带新生完成编程环境安装与自检全流程：检查Windows用户名→安装VS Code及插件→安装UV→给UV配置PyPI镜像源→用uv sync初始化课程notebook并跑通第一个程序。

## 内容脉络

### Part 0 配置开始之前的说明（0:00–2:19）
- [0:00] 第零课之所以叫"零"是因为最基础也最重要；以录播形式提供，方便反复暂停、看清操作细节，为之后使用编程环境打基础。
- [0:45] Windows用户先检查用户名是否为英文：开始菜单处右键→打开终端→输入 whoami 回车；纯英文或纯数字是安全的，含中文字符的用户名有隐患——部分程序可能无法正确识别中文用户名或含中文字符的路径 [1:31]。
- [1:31] 应对：最简单是新建一个英文名称的用户；PIAZA上会发帖详细说明；遇到任何问题去PIAZA或Office Hour求助，助教都很乐意帮忙。
- [2:19] 本节课以Windows 11为演示环境；其他系统大部分已有文档覆盖，小部分问题欢迎求助。

### 本节课配置什么（2:19–3:05）
- [2:19] 目标：只配一套可用于SI100B/SI100+课程的环境，组合为 UV + Jupyter Notebook + VS Code。UV：非常快速的Python版本和环境管理器；Jupyter Notebook：交互式笔记本，融合代码、文本等多种元素，课程还准备了交互式的.ipynb（PIAZA可下载lecture0的）；VS Code：目前最好用的代码编辑器，插件生态丰富、支持多语言。什么是"环境""环境管理""Python版本"留到正课讲。

### Part 1 安装环节（3:05–11:36）
- [3:05] 安装VS Code：官网下载页或"download for windows"；安装包格式——Windows为.exe、macOS为.dmg、Linux可用.deb〔原文"DBM"，疑为deb〕或.rpm。
- [3:54] macOS下载dmg后打开、拖拽到Application文件夹即可；不熟悉安装程序也可用系统自带包管理器——更纯净、更少遇到"诈骗软件"风险，但操作难度更高；注意网络环境问题：很多工具要从GitHub下载binary或源代码，可能遇到网络问题，欢迎求助 [4:39]。
- [4:39] Windows安装演示：我同意此协议→安装位置（不确定就默认）→开始菜单文件夹默认→创建快捷方式时"推荐把所有的选项都打开"→安装完成。
- [6:13] 安装插件：首次打开的欢迎页可用GitHub账户登录或直接关掉；侧边栏四个正方形拼图图标=extensions；搜索Python与Jupyter〔原文"JB"〕两个插件，"认准publisher是Microsoft官方"再install。
- [7:00] Python插件是插件集合：会连带安装Python Environments（管理环境）、Python Debugger（调试）、Pylance语法插件〔原文"ALEX"，疑为Pylance〕等；Jupyter也会装一系列渲染器；弹窗提示安装UV时暂时取消，"之后可能会遇到一些别的问题"。
- [7:47] 安装UV：可通过官方脚本安装但并不推荐——没有校园网加速可能访问不了GitHub；课程提供镜像安装命令：Windows复制后右键开始菜单→打开终端→粘贴（有警告选"仍要粘贴"〔原文"人文粘贴"〕）→回车；显示download uv 0.12.3，很快装完（"Everything is inside"）。
- [8:32] 关键一步：装完直接输uv很可能没反应，需要新开一个标签页/重新打开PowerShell终端，再输入 uv --version，能返回版本号（如0.12.2〔注：与前面0.12.3不一致，原文如此〕）即安装成功 [9:18]。
- [9:18] 其他安装方式：pip（不推荐——UV是独立于Python环境的）；系统自带包管理器（Windows上〔原文"windows r"，疑为winget〕）。判断标准：uv --version 能返回正常版本号。
- [10:03] 换源〔原文"换元"〕：UV装依赖要从官方PyPI服务器下载，官方PyPI是国外服务器、国内下载很慢；镜像源=国内对各种库和包的（全量）备份，相当于直接与国内服务器通讯、起到加速作用；推荐校园网联合镜像站〔原文"校园网流和镜像站"〕提供的PyPI服务，里面还有别的仓库可以逛。
- [10:48] 配置方法：最基础的是镜像站帮助文档给出的方法（直接填写内容）；课程提供了更简约的一键镜像配置脚本——Windows复制一行、macOS〔原文"map s"〕/Linux复制另一行，粘贴到终端回车即完成换源。

### Part 4 用VS Code跑通Jupyter Notebook（11:36–16:16）
- [11:36] Part 2、Part 3留到正课；先新建一个文件夹（如SI100+，原文亦写作"sf class"），把从PIAZA下载的压缩包全部解压进该文件夹；"千万不要单独对Jupyter文件点开，这是一个错误的操作" [12:21]。
- [13:08] VS Code→打开文件夹→选择刚解压的课程目录；提示没找到Python时点cancel；terminal→New terminal→输入 uv sync：UV解析依赖并自动安装，"UV并行地帮我们获取了非常多的依赖，这是一个非常快的速度"——这正是选UV而不是pip或其他包管理器的原因。
- [13:57] 安装完成后目录里多出 .venv 文件夹=创建出来的虚拟环境（virtual environment）；打开课程的.ipynb文件——之后几乎大部分课程都会配这种文件，可课前下载自行探索游玩。
- [14:43] 选kernel：右上角Select Kernel→Python Environments→查看是否已有环境；没有就点Create Python Environment→选择Enter interpreter path→打开.venv下的scripts文件夹（Linux用户对应选bin文件夹）→选python。
- [15:29] 正确识别后显示项目名（lecture0 environment〔原文"phero environment"〕）；鼠标悬浮在代码块上、点左上角运行按钮：输出 Hello SI100+；再运行pyjokes〔原文"拍jokes"〕——一个输出程序员笑话的简单工具库，正常输出一段"晦涩难懂的程序员笑话"，看到hello和正常输出即代表环境配置与依赖同步成功 [16:16]。

## 具体细节
- 命令：whoami、uv --version、uv sync；操作路径：开始菜单右键→打开终端（PowerShell）、terminal→New terminal
- 工具：UV（Python版本+环境管理器、装包极快）、Jupyter Notebook、VS Code、Microsoft官方Python与Jupyter插件、Python Environments、Python Debugger、Pylance〔疑为〕、pyjokes
- 文件/目录：.exe/.dmg/.deb/.rpm 安装包、.venv（虚拟环境目录）、scripts（Windows）/bin（Linux）、lecture0的.ipynb
- 版本：download uv 0.12.3 / uv --version 显示0.12.2（原文两处不一致）
- 平台：PIAZA（发帖求助+下载课程压缩包）、Office Hour；演示系统Windows 11；镜像源：校园网联合镜像站的PyPI服务
- 两个坑：中文用户名/中文路径可能导致程序异常；无校园网加速时访问GitHub受限

## 讲者的观点与建议
- [0:45] 装环境前先自查用户名：含中文字符的用户名"可能就会包含一些潜在未来的危险"，最省事是新建英文用户。
- [3:54] 包管理器安装更纯净但门槛更高，新手量力而行；遇到网络问题（GitHub下载）别硬扛，来找助教。
- [7:47] 不推荐官方脚本装UV，优先用课程提供的镜像命令，避开GitHub访问问题。
- [12:21] 强调解压与打开方式：必须整包解压后用VS Code"打开文件夹"，"千万不要单独对Jupyter文件点开"。
