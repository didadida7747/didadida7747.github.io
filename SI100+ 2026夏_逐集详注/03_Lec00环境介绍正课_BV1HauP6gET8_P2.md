# BV1HauP6gET8_P2 [SI 100+] Lec.00 环境介绍与配置——环境介绍（正课部分）

## 定位
第零课的正课部分：先用十分钟集中排雷微课中最高发的"打开了上级目录"错误，随后用类比+现场演示讲透环境变量与PATH、为什么需要虚拟环境与UV、"文件夹思维"，并演示 uv python/uv sync/uv run/activate 等核心命令。

## 内容脉络

### 排雷：上节课的常见错误（0:00–4:35）
- [0:00] 原定由"38"学长〔原文"三八/382"，疑为昵称"38"〕授课，但他被席卷而来的新冠打败、正在发烧；他昨晚顶着高烧帮大家录完并发出了配置微课，本节由另一位讲者代上。
- [0:48] 错误示范：新建SI100plus文件夹→把解压出的lecture00environment放进去→用VS Code打开的是上级目录SI100plus→在terminal里 uv sync 会报"没有pyproject.toml这个文件"〔原文"py project"〕。
- [2:19] 解决方案：File→Open Folder→点进lecture00environment再打开；判别标准：左侧最外层直接是lecture00environment的内容（而不是外面套一层SI100plus、里面套一层子文件夹）。
- [2:19] 在正确目录下 uv sync 能正常安装依赖； uv run main.py〔原文"uv wrong嫩联PY"，疑为uv run main.py〕输出问候语〔原文"I love from lecturer in an environment"，疑为"hello from lecture00 environment"〕。
- [3:04] 打开lecture00environment的.ipynb文件：右上角Select Kernel选kernel（具体含义正课会讲）→Python Environments→选择lecture00environment环境。
- [3:50] 提醒：运行要点左上角的运行按钮，"大家一定不要去点这个红点"（有同学来问红点是什么，后面会讲）；点击后输出hello SI100+、再运行下面的程序员笑话即配置完毕——问题核心就是文件夹层级。

### 什么是环境变量与PATH（4:35–10:04）
- [4:35] 类比铺垫（衔接"计算机基本知识"一课的快捷方式）：快捷方式类似指路牌/一张写着真东西在哪的小纸条，双击时系统帮我们查纸条、找到路径并打开真正的文件。
- [5:25] 环境变量=操作系统层面的便签纸：电脑里的程序运行时可随时"抬头"查看公共信息（你是谁、临时文件放哪、常用软件在哪找等），而不必在代码中把这些信息写死——每个人安装UV等软件的路径都不一样，程序需要一个通用的方式去查找彼此的信息。
- [6:59] PATH是特殊的环境变量：不是一张纸条指一个文件，而是桌上放着一份很长的名单、按顺序写着十几个文件夹的地址；在终端敲一个词（如python），系统查这份名单、一个文件夹一个文件夹找，"谁先命中就用谁，后面不再找"。
- [7:45] 查看与定位：macOS/Linux用 echo $PATH〔原文"echo path"〕查看PATH内容；Windows PowerShell用 echo $env:PATH〔原文"echo dollar符号in v冒号path"〕；which python3（Windows用where.exe〔原文"where点EXE"〕）可定位实际执行的是哪个python。
- [8:31] 演示：which python3 命中的是homebrew的python3.14（/opt/homebrew/opt/python3@3.14〔按原文拼合〕）；which uv 命中 /Users/名字/.local/bin——两者都能在PATH名单里对上号。
- [10:04] "不要安装多个Python"这张图的真正含义：不是不能有多个Python（kernel/核心），而是不靠UV这类工具管理、直接装在系统里时，系统只会在PATH里依次找、永远只命中第一个；讲者电脑上装了很多Python（可用 uv python list 查看），但无论怎么执行命令行都只用homebrew那一个。

### 为什么要虚拟环境与UV（10:50–16:16）
- [11:40] 漫画寓意：不同项目可能需要不同Python版本，不同Python版本又可能需要不同版本的库；全挤在顶层、杂乱无章地互相引用就乱成一团。
- [12:26] 场景：项目A按旧版本库写、项目B用新版本（新版本改了用法）；整台电脑只装一份这个库，装新的旧项目报错、装旧的新项目用不上新功能。其实"装很多Python是很正常的"，真正在意的是良好管理不同Python让它们不打架、一个项目内锁定同一个Python→由此引入虚拟环境（virtual environment）：给每个项目一份独立的互不干扰的Python副本+一个库的安装目录。
- [13:11] 工具沿革：历史上有很多工具（venv〔原文"VVVVNV"〕、pip等），前几年课程还让大家用conda〔原文"康达"〕；现在越来越多人转UV——速度快、专门为Python而生、整合了这些功能，目标是"用一个工具代替所有"，装包速度比pip快10~100倍。
- [13:57] 两种思维：旧思维——Python是装在电脑里的东西，.py文件放桌面、双击或命令行直接跑，缺什么包就全局装（pip install〔原文"pipping store"〕），整台电脑只有一个Python、文件东丢西放互不隔离（举例：第一课notebook里import pyjokes就是生成笑话的库）；新"文件夹思维"——一份工作=一个文件夹：文件夹里装着代码本身+一份"需要什么"的清单+专属于这个文件夹的Python环境，"永远不单独运行Python，只在某个项目里面跑Python，项目以文件夹为单位" [14:43]。
- [14:43] 好处：不同项目依赖不打架；不会有多个版本Python挤在PATH里、永远索引不到后面；且非常有利于团队协作——大家通过pyproject.toml〔原文"p y project tml"〕文件下载相同的Python版本与依赖版本，在不同电脑上都能正确运行。
- [16:16] VS Code本身是编辑器、并不会执行Python代码，真正执行代码的是电脑上装的Python解释器（下一节课介绍）；VS Code两种打开方式——打开单个文件 vs 打开一个文件夹（后者可叫workspace工作区），课程总用后者。
- [17:04] 演示：打开文件夹lecture00environment后，最外层就是一个工作区；File→Save Workspace As〔原文"see workspace as"〕可把工作区保存起来——较简单项目用不到，可玩一玩体会概念 [17:50]。工作区里包含：代码文件+精确到具体版本的依赖+专属于该文件夹的Python环境。

### 用UV管理你的环境（18:38–24:02）
- [18:38] uv python install 3.12：一条命令安装指定版本的Python；uv python list：查看系统中已安装的Python（标绿=已装、download available=可安装）。
- [19:23] 本课程用法：每课发zip压缩包，解压后只需执行 uv sync〔原文"uv think"〕即可按清单装好依赖、创建虚拟环境，再到kernel里选择这个环境。
- [20:10] uv.lock〔原文"UV点lock"〕锁文件：里面每个包都有精确版本（如0.x.3）、source来源和一串"看起来像乱码"的哈希，靠它可以在不同电脑上精确复现所有依赖；具体字段含义鼓励课下搜索，并把搜索结果上传PIAZA展示、助教会点赞反馈。
- [20:56] uv add加依赖、uv run运行代码（如 uv run main.py）；细节等讲Python时再展开。
- [21:44] UV如何让环境生效（呼应PATH）：激活虚拟环境——source .venv/bin/activate〔原文"source点v e even being active activate"〕；Windows下执行activate.ps1〔原文"activate点PSE文件"〕。
- [22:31] macOS演示：激活后终端提示符显示当前已在lecture00environment虚拟环境下；再 which python3，路径变成 lecture00environment/.venv/bin/python3〔原文"lecture零零点v e n v being python3"〕。
- [23:16] echo $PATH 看发生了什么：source命令把这个目录放到了PATH环境变量的最前面——查找从前往后、先命中先执行，因此一定最先用上虚拟环境里的python3；本质是通过修改环境变量来切换运行的Python，还有其他变化不赘述，感兴趣自行探索并到PIAZA发帖展示，助教团队会及时反馈。
- [24:02] Part 4微课已讲过，环境配置部分正式结束；开放提问，10分钟后接着讲编程语言与Python简介。

## 具体细节
- 命令：uv sync、uv run main.py、uv python install 3.12、uv python list、uv add、uv run；echo $PATH（Windows PowerShell：echo $env:PATH）、which python3 / where.exe python、source .venv/bin/activate、Windows激活文件activate.ps1
- 文件：pyproject.toml（项目与依赖清单）、uv.lock（锁版本：版本号+source+哈希串）、.venv（虚拟环境目录）、.ipynb（Jupyter notebook）
- 工具沿革：venv、pip、conda、UV（比pip快10~100倍）；VS Code workspace（Save Workspace As）；Select Kernel→Python Environments→Create Python Environment→Enter interpreter path
- 演示环境：macOS（homebrew的python3.14、/Users/.../.local/bin下的uv）；每个Windows对应命令均已给出
- 平台：PIAZA（上传探索结果，助教团队点赞反馈）

## 讲者的观点与建议
- [2:19] 新手第一大坑是"打开了上级目录"：判别标准是左侧最外层直接就是lecture00environment的内容；"一定不要去点那个红点，一定是左上角的这个运行的按钮" [3:50]。
- [10:50] 不是禁止装多个Python，而是别让它们裸装在系统里互相打架——用UV这类工具管理、在项目内锁定唯一版本。
- [14:43] 推崇"文件夹思维"："永远不单独运行Python，只在某个项目里面跑Python，项目以文件夹为单位"——既避免依赖打架，也让团队协作能精确复现环境。
- [20:10] 鼓励自学探索：把uv.lock等自己搜索弄懂的结果发到PIAZA展示，助教团队会及时给予反馈。
