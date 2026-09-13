# SI100+ 2026夏 · Lec.00 环境介绍正课（BV1HauP6gET8_P2）

## 定位
第零课的正课部分：先用十分钟集中排雷微课中最高发的"打开了上级目录"错误，随后用类比+现场演示讲透环境变量与 PATH、为什么需要虚拟环境与 UV、"文件夹思维"，并演示 `uv python` / `uv sync` / `uv run` / activate 等核心命令。原定由"38"学长〔ASR原文"三八/382"〕授课，但他被席卷而来的新冠打败、正在发烧（昨晚仍顶着高烧帮大家录完并发出了配置微课），本节由另一位讲者代上。

## 知识整理

### 先排雷：微课最常见的"打开了上级目录"错误
新手第一大坑不在安装，而在打开方式：

- **错误示范**：新建 SI100plus 文件夹 → 把解压出的 lecture00environment 放进去 → 用 VS Code 打开的却是上级目录 SI100plus → 在 terminal 里 `uv sync` 会报"没有 pyproject.toml 这个文件"〔ASR原文"py project"〕。
- **解决方案**：File → Open Folder → 点进 lecture00environment 再打开。**判别标准**：左侧最外层直接是 lecture00environment 的内容（而不是外面套一层 SI100plus、里面再套一层子文件夹）。
- **验证配置成功**：在正确目录下 `uv sync` 能正常安装依赖；`uv run main.py` 输出问候语。打开 lecture00environment 的 `.ipynb` 文件，右上角 Select Kernel → Python Environments → 选择 lecture00environment 环境。
- **一个运行细节**：要点左上角的运行按钮，"大家一定不要去点这个红点"（有同学来问红点是什么，后面会讲）。输出 hello SI100+、再运行下面的程序员笑话即配置完毕——问题的核心就是文件夹层级。

### 环境变量与 PATH：操作系统的"便签纸"和"名单"
（类比衔接"计算机基本知识"一课的快捷方式：快捷方式类似指路牌/一张写着真东西在哪的小纸条，双击时系统帮我们查纸条、找到路径并打开真正的文件。）

- **环境变量 = 操作系统层面的便签纸**：电脑里的程序运行时可随时"抬头"查看公共信息（你是谁、临时文件放哪、常用软件在哪找等），而不必在代码中把这些信息写死——每个人安装 UV 等软件的路径都不一样，程序需要一个通用的方式去查找彼此的信息。
- **PATH 是特殊的环境变量**：不是一张纸条指一个文件，而是桌上放着一份很长的名单、按顺序写着十几个文件夹的地址。在终端敲一个词（如 python），系统查这份名单、一个文件夹一个文件夹找——**谁先命中就用谁，后面不再找**。
- **查看与定位命令**：

| 目的 | macOS/Linux | Windows PowerShell |
| --- | --- | --- |
| 查看 PATH | `echo $PATH` | `echo $env:PATH` |
| 定位实际执行的程序 | `which python3` | `where.exe python` |

- **演示**：`which python3` 命中的是 homebrew 的 python3.14（`/opt/homebrew/opt/python3@3.14`）；`which uv` 命中 `/Users/名字/.local/bin`——两者都能在 PATH 名单里对上号。
- **"不要安装多个 Python"这张图的真正含义**：不是不能有多个 Python，而是不靠 UV 这类工具管理、直接装在系统里时，系统只会在 PATH 里依次找、永远只命中第一个。讲者电脑上装了很多 Python（可用 `uv python list` 查看），但无论怎么执行命令行都只用 homebrew 那一个。结论：别让多个 Python 裸装在系统里互相打架，要用工具管理、在项目内锁定唯一版本。

### 为什么需要虚拟环境：版本冲突问题
- 漫画寓意：不同项目可能需要不同 Python 版本，不同 Python 版本又可能需要不同版本的库；全挤在顶层、杂乱无章地互相引用就乱成一团。
- 典型场景：项目 A 按旧版本库写、项目 B 用新版本（新版本改了用法）；整台电脑只装一份这个库，装新的旧项目报错、装旧的新项目用不上新功能。
- 其实"装很多 Python 是很正常的"，真正在意的是良好管理不同 Python 让它们不打架、一个项目内锁定同一个 Python。由此引入**虚拟环境（virtual environment）**：给每个项目一份独立的互不干扰的 Python 副本 + 一个库的安装目录。
- **工具沿革**：历史上有很多工具（venv、pip 等），前几年课程还让大家用 conda〔ASR原文"康达"〕；现在越来越多人转 UV——速度快、专门为 Python 而生、整合了这些功能，目标是"用一个工具代替所有"，装包速度比 pip 快 10~100 倍。

### 文件夹思维：现代 Python 项目的组织方式
- **旧思维**：Python 是装在电脑里的东西，`.py` 文件放桌面、双击或命令行直接跑，缺什么包就全局装（`pip install`），整台电脑只有一个 Python、文件东丢西放互不隔离（例：第一课 notebook 里 `import pyjokes` 就是生成笑话的库）。
- **新"文件夹思维"**：一份工作 = 一个文件夹。文件夹里装着代码本身 + 一份"需要什么"的清单 + 专属于这个文件夹的 Python 环境。口诀："**永远不单独运行 Python，只在某个项目里面跑 Python，项目以文件夹为单位**。"
- **好处**：不同项目依赖不打架；不会有多个版本 Python 挤在 PATH 里、永远索引不到后面；且非常有利于团队协作——大家通过 `pyproject.toml` 文件下载相同的 Python 版本与依赖版本，在不同电脑上都能正确运行。
- **VS Code 的角色**：VS Code 本身是编辑器、并不会执行 Python 代码，真正执行代码的是电脑上装的 Python 解释器（下一节课介绍）。VS Code 两种打开方式——打开单个文件 vs 打开一个文件夹（后者可叫 workspace 工作区），课程总用后者。打开文件夹 lecture00environment 后，最外层就是一个工作区；File → Save Workspace As 可把工作区保存起来——较简单项目用不到，可玩一玩体会概念。工作区里包含：代码文件 + 精确到具体版本的依赖 + 专属于该文件夹的 Python 环境。

### UV 核心命令速查
| 命令 | 作用 |
| --- | --- |
| `uv python install 3.12` | 一条命令安装指定版本的 Python |
| `uv python list` | 查看系统中已安装的 Python（标绿=已装、download available=可安装） |
| `uv sync` | 每课发 zip 压缩包，解压后执行即可按清单装好依赖、创建虚拟环境，再到 kernel 里选择这个环境 |
| `uv add` | 给项目加依赖 |
| `uv run main.py` | 在项目环境内运行代码 |

- **`uv.lock` 锁文件**：里面每个包都有精确版本（如 0.x.3）、source 来源和一串"看起来像乱码"的哈希，靠它可以在不同电脑上精确复现所有依赖。具体字段含义鼓励课下搜索，并把搜索结果上传 PIAZA 展示、助教会点赞反馈。
- UV 还有更多细节（`uv run` 等），等讲 Python 时再展开。

### 虚拟环境如何生效：激活与 PATH 的关系
这是本节把"环境变量"和"虚拟环境"两条线收拢的地方：

1. **激活虚拟环境**：macOS/Linux 执行 `source .venv/bin/activate`〔ASR原文"source点v e even being active activate"〕；Windows 下执行 activate.ps1〔ASR原文"activate点PSE文件"〕。
2. **激活后发生了什么**（macOS 演示）：终端提示符显示当前已在 lecture00environment 虚拟环境下；再 `which python3`，路径变成 `lecture00environment/.venv/bin/python3`。
3. **原理**：`echo $PATH` 看得到——`source` 命令把这个目录放到了 PATH 环境变量的**最前面**。因为查找从前往后、先命中先执行，所以一定最先用上虚拟环境里的 python3。本质就是**通过修改环境变量来切换运行的 Python**；还有其他变化不赘述，感兴趣自行探索并到 PIAZA 发帖展示，助教团队会及时反馈。

## 编者补充
- 新手三大自查点：①文件夹层级（判别标准：左侧最外层直接就是 lecture00environment 的内容）；②运行按钮位置（"一定不要去点那个红点，一定是左上角的这个运行的按钮"）；③kernel 选择（Select Kernel → Python Environments → 选当前项目环境）。
- 本课最重要的一句口诀："永远不单独运行 Python，只在某个项目里面跑 Python，项目以文件夹为单位"——既避免依赖打架，也让团队协作能精确复现环境。
- 常用命令与文件对照：环境管理——`uv sync` / `uv add` / `uv run` / `uv python install 3.12` / `uv python list`；查看 PATH——`echo $PATH`（Windows：`echo $env:PATH`）、`which python3` / `where.exe`；激活——`source .venv/bin/activate`（Windows：activate.ps1）。关键文件——`pyproject.toml`（项目与依赖清单）、`uv.lock`（锁版本：版本号+source+哈希串）、`.venv`（虚拟环境目录）、`.ipynb`（Jupyter notebook）。
- 工具沿革线索：venv → pip → conda → UV（比 pip 快 10~100 倍）；本课程材料一律以 UV 为准。
- 跨集联系：微课（P1）负责"装好"，本节（P2）负责"讲懂"；VS Code 与 Python 解释器的关系（编辑器 vs 执行者）在下一节课展开。
