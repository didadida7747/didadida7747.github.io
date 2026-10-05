---
title: "Gemini Pro 高效利用攻略"
---

# Gemini Pro 高效利用攻略

> 更新日期：2026-10-02
> 覆盖范围：本文件是「怎么用」手册——针对本校（本校）电子信息 / 计算机方向学生，把已订阅的 **Google AI Pro（Gemini Pro，$19.99/月 ≈ HK$158/月，自带 5TB）** 从开通第一天到日常学习 / 编程 / 口语练习全部用透。
> **权益清单、档位价格、额度数字全部以 `11-谷歌生态与Gemini权益.md` 为准**（本文件不重复罗列权益表，只在涉及处交叉引用 11.x）；银行卡 / 信用卡侧的免转换费、3DS、还款规则见 `12-*.md`（本文件 13.7 只写 Google 侧操作）。
> 图例：🟢 全体 AI Pro 订阅者 ｜ 🟡 部分地区 / 部分功能（注明） ｜ 🔵 本校电子信息 / 计算机方向学生特别有用

---

## 13.1 上手顺序清单：开通后第一天该做的事

> 目标：订阅成功当天，按下面 10 步把账号、语言、各功能开关一次配好，后面几个月直接用。

### 步骤 1：确认订阅真的生效（先查这一处）
1. 浏览器打开 **one.google.com**，用你订阅 AI Pro 的那个谷歌账号登录。
2. 右上角头像下方应显示「Google AI Pro」与「5 TB」。若仍显示 15 GB 免费档：
   - 等最多 **24 小时**（官方写明存储升级最长 24 小时生效）；
   - 确认自己登录的是**订阅付款的那个账号**（多账号党最常见坑——钱扣在 A 号、你却登 B 号）；
   - 仍不对就去 payments.google.com 看扣款流水。
- **来源**：[Clean up & fix issues with your Google storage](https://support.google.com/googleone/answer/9776477?hl=en)
- **状态**：✅已查证
- **实时核对**：✅ 2026-10-02 实时核对有效（官方页原文 "It may take up to 24 hours for your new storage to become available"）

### 步骤 2：装 Gemini App 并登录（手机端主力）
1. Android：Play Store 搜「**Gemini**」（Google LLC 出品）安装；iOS：App Store 同名。
2. 打开后用**同一个**订阅账号登录。
3. 底部模型切换器应能选到 **Gemini 3 Pro**（免费号只能用基础模型）；选不到 = 订阅没生效或登错号。
- **来源**：[Get started with the Gemini mobile app](https://support.google.com/gemini/answer/14554984?hl=en)
- **状态**：✅已查证
- **实时核对**：✅ 2026-10-02（与 11.3「Expanded access to Gemini 3.1 Pro」交叉一致）

### 步骤 3：网页端 gemini.google.com 登录 + 设语言
1. 电脑浏览器开 **gemini.google.com**，同账号登录。
2. 左下角 **Settings（设置）→ General（通用）→ Language**，把界面语言设为中文（或你习惯的语言）；聊天输出语言可以在对话框里直接说「以后都用中文回答我」。
3. 网页端与手机端聊天记录、Gems、设置**自动同步**。

### 步骤 4：Google One 设置里核对地区与家庭开关
1. 打开 **one.google.com** → 右上角 **Settings（设置）**。
2. 核对「Membership plan（会员计划）」显示 AI Pro、5 TB。
3. 先别急着开家庭共享——读完 13.2 第 5 步再开。

### 步骤 5：Google Photos 备份档位设置（手机）
1. 打开 **Google Photos App** → 右上角头像 → **Photos settings（相册设置）→ Backup（备份）→ Backup quality（备份质量）**。
2. 选档建议见 13.2 第 2 步；订阅 5TB 后可放心选「原画质 / Original quality」。
- **来源**：[Back up photos & videos – Google Photos 帮助](https://support.google.com/photos/answer/6193313?hl=en)
- **状态**：⚠️ 入口路径为通用路径，具体菜单项随 App 版本微调
- **实时核对**：✅ 2026-10-02（2021-06 起原画质计入配额，见 11.11；5TB 额度见 11.3）

### 步骤 6：把各 AI 功能开关在各自 App 里点一遍
| 功能 | 在哪打开 | 第一天要做的动作 |
|---|---|---|
| Gemini 聊天 | gemini.google.com / Gemini App | 发一句「你好，用中文介绍你自己能帮我做什么」 |
| Gemini Notebook（NotebookLM） | **notebook.google** | 登录后建第一个 Notebook，见 13.3 |
| Deep Research | gemini.google.com 对话框左侧/输入框下方选「Deep Research」 | 见 13.4 提示词 |
| Gemini Live 语音 | Gemini App 底部 **Live** 按钮 | 见 13.4 口语练习 |
| Gems（自定义专家） | gemini.google.com 左侧栏 **Gems → New Gem** | 见 13.4 |
| Google Flow（视频） | **flow.google** | 见 13.5 |
| Gmail / Docs / Sheets 里的 Gemini | 各 App 右侧边栏「Gemini」图标 | 见 13.4 末 |
- **来源**：[Use Google AI Pro benefits](https://support.google.com/googleone/answer/14534406?hl=en)
- **状态**：✅已查证
- **实时核对**：✅ 2026-10-02 实时核对有效（官方 answer/14534406 列出 AI Pro 全部功能入口）

### 步骤 7：设一个常用设备的本地备份盘（别把鸡蛋放 Google 一个篮子）
- 5TB 虽大，但 Google 账号在大陆的网络环境不稳定，**毕设 / 代码 / 重要论文务必双备份**（本地移动硬盘 + Google Drive）。本校学生尤其注意：GitHub 私有仓库免费无限个，代码默认推 GitHub，Drive 只做镜像。

### 步骤 8：把 YouTube Premium Lite 用上（不单独激活）
- AI Pro 自带的 **YouTube Premium Lite 不需要任何激活动作**——用订阅账号登录 youtube.com 自动生效：少广告、可后台播放、可离线缓存。
- **注意三条坑**（官方原文）：① 音乐内容、Shorts、搜索浏览页仍可能有广告；② **不含 YouTube Music Premium**；③ 离线/后台播放对 Shorts 和音乐内容不可用。想要真·去广告 + YouTube Music 得单独买 Premium（或上 Ultra）。
- **来源**：[Use Google AI Pro benefits → YouTube Premium Lite](https://support.google.com/googleone/answer/14534406?hl=en)
- **状态**：✅已查证
- **实时核对**：✅ 2026-10-02 实时核对有效（官方页原文 "This benefit doesn't need activation"；"doesn't include YouTube Music Premium"；"only for the plan manager and cannot be shared across family members"）

### 步骤 9：存好两个「查额度 / 查账单」的固定网址
- 存储用量：**one.google.com/storage**
- 订阅与扣费：**payments.google.com → Subscriptions & services**
- AI credits（Flow/Antigravity 超额加购）：**one.google.com/ai/credits**
- Google Flow credits 余额：Flow 站内右上角头像 / 设置
- **来源**：[Manage recurring payments & subscriptions](https://support.google.com/paymentscenter/answer/9003237?hl=en)
- **状态**：✅已查证

### 步骤 10：网络环境自检
- Gemini / Drive / Photos / YouTube 全系在大陆**默认不可直连**，需自行解决网络环境（本指南不展开）。第一天务必：在你日常要用的网络下，把上面 8 个网站/App 各打开一次，确认能登进去，别等到期末才发现 NotebookLM 打不开。

---

## 13.2 5TB 存储最大化（Gmail / Drive / Photos 共用一个池子）

> 关键认知（交叉引用 11.2「5TB 到底是什么」）：这 5 TB 是 AI Pro 订阅自带的，Gmail、Drive、Photos **三者共用一个池子**，不是各 5TB。Docs/Sheets/Slides 在线文档本身不占配额。

### 第 1 步：先看清楚谁在吃空间
1. 手机：Google One App → 底部 **Storage（存储）**；或 Drive/Photos/Gmail 任意一个 App → 右上角头像 → **Manage storage（管理存储）**。
2. 网页：**one.google.com/storage** → **Usage details（用量明细）**，能看到 Gmail / Drive / Photos 各占多少。
3. 官方 Storage Manager 会按服务列出「该删什么」：大附件邮件、模糊截图、废弃 WhatsApp 备份等，左右滑动选删/留。
- **来源**：[Clean up & fix issues with your Google storage](https://support.google.com/googleone/answer/9776477?hl=en)
- **状态**：✅已查证
- **实时核对**：✅ 2026-10-02 实时核对有效（官方 Storage Manager 步骤：头像 → Manage storage → Clean up by service → 右滑删/左滑留 → Review → Delete）

### 第 2 步：Google Photos 备份策略（本校学生版）
- **iPhone / 安卓拍照**：5TB 管够，直接选 **原画质（Original quality）**，省得压缩损失画质。路径：Photos App → 头像 → Photos settings → Backup → Backup quality → Original quality。
- **上课拍 PPT / 板书**：原画质备份，期末可以直接在 Photos 里按时间线找拍的课件，配合 13.3 的 NotebookLM 喂给 AI 复习。
- **老手机 / 旧照片想省空间**：可选「存储空间节省（Storage saver）」，但反正你有 5TB，建议一律原画质。
- **视频**：4K 录像很占空间，大段实验录像建议存本地硬盘 + 按需传 Drive，不必全塞 Photos。
- **注意**：删除的照片进回收站保留 **60 天**后永久删除。
- **来源**：[Back up your photos – Google Photos](https://support.google.com/photos/answer/6193313?hl=en)
- **状态**：⚠️ 备份质量菜单位置随版本微调
- **实时核对**：✅ 2026-10-02（2021-06-01 后新上传照片全部计入配额，见 11.11；5TB 额度见 11.3）

### 第 3 步：Google Drive 怎么用最值
1. 课程资料、PDF 论文、实验代码打包文件夹 → 上传到 Drive（drive.google.com）。
2. **直接从 Drive 把 Docs/Slides/PDF 喂给 NotebookLM**（见 13.3），这是 5TB + NotebookLM 联动的核心玩法——Drive 里建一个「大三上专业课」文件夹，NotebookLM 直接引用，改原文件会自动同步。
3. 电脑装 **Google Drive 桌面版**（Drive for Desktop），把它当第二块云盘用，代码 / 课件自动同步。
4. 注意：Docs/Sheets/Slides 在线新建文档**不占配额**，但上传的 .pdf/.zip/.exe/视频等二进制文件占。

### 第 4 步：Gmail 清理（常被忽略的大户）
1. Gmail 里搜索框输入 `larger:10M` 可找出大于 10MB 的邮件（课程群里老师发的课件附件往往几个 G）。
2. 删掉大附件邮件后，还要去 **Gmail → 垃圾箱（Trash）** 手动彻底删除，否则仍占空间。
3. Google One App → Storage → **Free up account storage** → Clean up other items → **WhatsApp**：安卓 WhatsApp 聊天备份是隐形大户，不要的旧备份点 **Delete backup**。
4. 网页直达：**one.google.com/backup/management/whatsapp** 删 WhatsApp 备份。
- **来源**：[Clean up & fix issues with your Google storage](https://support.google.com/googleone/answer/9776477?hl=en)
- **状态**：✅已查证
- **实时核对**：✅ 2026-10-02 实时核对有效（官方页原文 WhatsApp 备份清理路径 + one.google.com/backup/management/whatsapp 直达链接）

### 第 5 步：家庭共享（最多 5 人，共 6 人）——开通与拼车分摊
> 权益交叉引用 11.3「家庭共享」。**存储和大部分 AI 权益可共享，但 YouTube Premium Lite 只归户主一人、不能分给家人**（官方原文）。

**开通步骤（户主操作）：**
1. 手机打开 **Google One App** → 顶部 **Menu（菜单）→ Settings（设置）→ Manage family settings（管理家庭设置）**。
2. 点 **Start sharing membership → Invite family（开始共享 → 邀请家人）→ Confirm**。
3. 填对方 Gmail 邮箱发邀请；对方在自己邮箱点接受。
4. 回到 Manage family settings，打开 **Share Google One with your family** 开关。
5. 重复邀请最多 **5 人**（连户主共 6 人）。
- **网页版**：one.google.com → Settings → Manage family。

**加入家庭组的硬性条件（官方原文，踩坑前必看）：**
- 必须是**个人 Gmail 账号**（学校 / 公司 Workspace 账号不能加入）；
- 必须与户主**同一个国家**（港区户主只能加港区账号，美区户主只能加美区账号）；
- 过去 **12 个月内没加入过别的家庭组**；
- 同时只能在一个家庭组里。
- **存储怎么分**：每人先用自己免费的 15GB，满了才动用户主的共享 5TB；**家人之间互相看不到对方文件**，户主只看得到每人占了多少空间。
- **来源**：[Start or stop sharing with your family](https://support.google.com/googleone/answer/9004015?hl=en)
- **状态**：✅已查证
- **实时核对**：✅ 2026-10-02 实时核对有效（官方页：up to 5 family members；same country as manager；no other family group in past 12 months；files not shared）

**本校学生「拼车」分摊建议：**
- 4–6 个同学组一个家庭组，$19.99/月（HK$158）摊到每人约 **$3–4/月**，每人都能用到 Gemini 3.1 Pro、NotebookLM Plus、Deep Research、200 CCUs Colab、$10 云额度等。
- 户主选**最稳定、长期用这个号**的人当；**YouTube Premium Lite 只有户主享受**，想一起看油管免广告的同学要知道这个差异。
- 退组冷知识：退组后 12 个月内不能再进别的家庭组，所以组车前把人定好。

### 第 6 步：和其他网盘配合
- 5TB Google：课件 / 论文 / 照片 / 代码镜像，主力学习云盘。
- 百度网盘 / 阿里云盘：国内传同学、传学校群更快的场景用它；Google 账号在大陆访问不稳，别把 Google Drive 当成唯一分享渠道。
- GitHub：代码仓库（私有免费无限），见 11.8。
- 本地移动硬盘：重要毕设 / 照片的第三份备份（3-2-1 原则）。

---

## 13.3 NotebookLM Plus（Gemini Notebook）学生实战 ★重点

> 入口：**notebook.google**（旧称 NotebookLM / notebooklm.google.com）。AI Pro 额度交叉引用 11.3「NotebookLM Plus」：Pro 版**每个笔记本最多 300 个来源**（免费号仅 50 个），Audio Overview / Flashcards / Infographics / Q&A / Quizzes / Reports / Slides / Video Overviews 全部更高额度。

### 3.3.0 关键额度（官方 answer/14534406 + answer/16215270 实时核对）
- 每个来源：最多 **50 万词** 或 **200MB**（本地上传）。
- 支持的来源类型：PDF、PPT/PPTX、Word/docx、TXT、Markdown、CSV、ePub、MP3/WAV 等音频、图片、**网页 URL**、**公开 YouTube 链接**、Google Drive 里的 Docs/Slides/Sheets（Slides 限 100 页、Sheets 限 10 万 token）、Gemini 聊天记录。
- 付费墙网页抓不到；YouTube 只导入**带字幕的公开视频**（上传不满 72 小时的可能导不进）。
- **状态**：✅已查证
- **实时核对**：✅ 2026-10-02 实时核对（https://support.google.com/notebooklm/answer/16215270?hl=en ；Pro=300 sources/notebook 来自 https://support.google.com/googleone/answer/14534406?hl=en）

### 3.3.1 场景 A：期末复习（一门课一个 Notebook）
1. 浏览器开 **notebook.google** → 右上 **+ New notebook（新建笔记本）**，命名如「信号与系统-期末」。
2. **加来源**：点 **Add +** → 选上传方式：
   - 拍的课件 PDF / PPT：Upload（本地拖进去）；
   - 老师发在 Google Drive 的讲义：选 Google Drive，自动同步（改原文件几分钟后 Notebook 里也更新）；
   - 这门课的 YouTube 慕课链接：贴 YouTube URL，自动导入字幕转写文本。
3. 加完 5+ 个来源后，左侧 Source 面板可让 AI 自动**打标签分类**。
4. **一键生成复习材料**（右侧 **Studio（工作室）面板**）：
   - **Flashcards（闪卡）**：自动生成问答卡，刷知识点；
   - **Quiz（测验）**：出选择题考自己；
   - **Mind Map（思维导图）**：右侧 Studio 选 Mind Map，把整章结构画出来；
   - **Report（报告）**：自动生成多页复习提纲。
5. **文档问答**：底部对话框直接问，例如：
   - 「把傅里叶变换和拉普拉斯变换的区别列成表格，只引用我上传的课件」
   - 「课件里第三章所有定理，按考试可能考的题型归类」
   - 「我哪几页 PPT 之间是矛盾的？分别引用页码」
   - AI 回答会**带行内引用**（点引用跳回原文位置），避免它瞎编。
- **来源**：[Add or discover new sources](https://support.google.com/notebooklm/answer/16215270?hl=en)；[Create a notebook](https://support.google.com/notebooklm/answer/16206563?hl=en)
- **状态**：✅已查证

### 3.3.2 场景 B：文献调研 / 读英文 paper（本校读研 / 毕设刚需）🔵
1. 一个研究主题建一个 Notebook，如「RFID 定位-文献综述」。
2. **批量喂论文**：把 IEEE Xplore / arXiv 上下载的 PDF 全部拖进去（每篇 ≤200MB / 50 万词，正常论文都够）。
3. **网页来源**：贴 arXiv 摘要页、课题组主页、维基百科链接（注意付费墙期刊抓不到，只能自己下 PDF 再传）。
4. **用 Deep Research 自动找文献**：Source 面板搜索框输入研究问题 → 打开 **Web + Deep Research 开关** → 等几分钟，它会自动浏览数百个网站生成多页报告，你再勾选哪些来源导入笔记本。
5. **典型提问示例（直接抄）：**
   - 「总结这 8 篇 paper 的核心方法、数据集、指标，对比成一张表，指出各自的创新点和局限」
   - 「这几篇论文里提到的公开数据集有哪些？分别给链接和下载量」
   - 「基于我上传的这些文献，这个方向还有哪些 open problem？帮我列 3 个可做的毕设题目」
   - 「把这篇英文 paper 的 Introduction 逐段用中文讲清楚，并标出专业术语」
6. **生成中文 Audio Overview（播客）当复习音频**：右侧 Studio → **Audio Overview → Customize（铅笔图标）** → 输出语言选 **中文 / Chinese**，长度按需，加一句 steering prompt（≤500 字符）如「请用两个中文主持人对话的形式，重点讲方法对比」→ 生成。走路 / 吃饭时听。
- **来源**：[Generate Audio Overview](https://support.google.com/notebooklm/answer/16212820?hl=en)；[Fast Research / Deep Research in NotebookLM](https://support.google.com/notebooklm/answer/16215270?hl=en)
- **状态**：✅已查证
- **实时核对**：✅ 2026-10-02 实时核对（Audio Overview 在 Studio 面板生成、可选语言/长度/steering prompt 均为官方原文）

### 3.3.3 场景 C：听课 / 会议录音转文字再喂进去
1. 上课录的音（手机录音笔导出 MP3/M4A）→ NotebookLM 加来源时选 Audio File 上传，自动转写为文本。
2. 支持中文转写（官方音频导入语言列表含 Traditional Chinese / Cantonese）。
3. 转写后就能对上课录音做问答：「老师这周讲的三个公式推导再讲一遍」「作业布置了什么？引用录音时间点」。
- **来源**：[Add sources → local audio file](https://support.google.com/notebooklm/answer/16215270?hl=en)
- **状态**：✅已查证

### 3.3.4 移动端
- 手机装 **NotebookLM App**（Android/iOS），添加来源选 PDF / Website / YouTube / Audio / Copied Text；在浏览器看 YouTube 时点分享按钮 → 选 NotebookLM 可直接把该视频加为来源。
- **来源**：[Get started with the NotebookLM mobile app](https://support.google.com/notebooklm/answer/16296687?hl=en)
- **状态**：✅已查证

---

## 13.4 AI 能力用法（Deep Research / Gems / Live / 全家桶）

### 13.4.1 Deep Research / Deep Search 做调研（提示词示例）
- **入口**：gemini.google.com 对话框下方切到 **Deep Research**（18+，桌面/手机均可，交叉引用 11.3）。
- 它会自动开几十个标签页读网页，几分钟出一份带引用的长报告。
- **学生提示词模板（直接改）：**
  1. 调研类：「调研 2024–2026 年 STM32 上 PID 自整定算法的主流开源实现，列出 GitHub 仓库地址、star 数、license、最后更新时间，对比优缺点，给本校电子信息本科生一个入门选型建议。」
  2. 文献类：「总结大语言模型在边缘端部署（LLM on-device / quantization）的最新进展，重点列量化方法（GPTQ/AWQ/bitnet）的论文和代码。」
  3. 决策类：「对比 2026 年国内大学生可免费使用的 AI 编程工具（GitHub Copilot / Codeium / Gemini Code Assist / Cursor）的学生政策、价格、支持语言，给计算机大二学生推荐一个。」
- **来源**：[Use Deep Research](https://support.google.com/googleone/answer/14534406?hl=en)
- **状态**：✅已查证

### 13.4.2 Gems（Custom AI Experts）建你的专属助手 🔵
> 注：官方 2026-09-29 起正把 Gems 逐步迁移到新的「Skills」体系（answer/18560919），但当前 Gems 创建入口仍可用。

**建一个「编程 debug 助手」步骤：**
1. 电脑开 **gemini.google.com** → 左侧栏 **Gems → + New Gem**。
2. **Name**：「STM32 Debug 助手」。
3. **Instructions（指令）**写人设，套 PTCF 框架：
   - Persona：你是一个有 10 年嵌入式经验的工程师，精通 STM32 HAL 库和 C 语言。
   - Task：我贴报错日志 / 代码片段给你，你帮我定位 bug，先给最可能的 3 个原因，再给修复代码。
   - Context：本校本科生水平，解释要通俗，关键寄存器注明手册页码；不要只给答案，要教我怎么排查。
4. 右侧预览框试几句，满意后点 **Save**（预览不会自动保存，必须点 Save）。
5. **Knowledge（知识）**可上传文件：把你的 datasheet、课程规范 PDF 传上去，它回答时会引用。
- **再建两个：**
  - 「论文润色 Gem」：Instructions = 你是 SCI 期刊母语级编辑，帮我把中式英语改成学术表达，给出修改理由；
  - 「刷题 Gem」：上传历年真题 PDF 作 Knowledge，让它按考试难度出题。
- Gems 在网页建完自动同步到手机 App 和 Gmail/Docs 侧边栏。
- **来源**：[Use Gems in Gemini Apps](https://support.google.com/gemini/answer/15146780?hl=en-GB)；[Tips for creating custom Gems](https://support.google.com/gemini/answer/15235603?hl=en)
- **状态**：✅已查证
- **实时核对**：✅ 2026-10-02（官方原文：左侧 Gems → New Gem → Name + Instructions → Knowledge 加文件 → 右侧预览 → Save）

### 13.4.3 Gemini Live 练英语口语 🎤（结合你的口语提升需求）
> 交叉引用 11.3「Gemini Live」——AI Pro 用户可用的实时语音对话。

**怎么开：**
1. Android 打开 **Gemini App**；或直接说「Hey Google, let's talk Live」。
2. 底部点 **Live**（或左滑）；首次用选一个你喜欢的声音（Ursa / Nova / Vega 等约 10 个）。
3. 直接开口说就行，不用按键；要静音点 **Hold / End**。
- **来源**：[Talk naturally with Gemini Live](https://support.google.com/gemini/answer/15274899?hl=en)
- **状态**：✅已查证
- **实时核对**：✅ 2026-10-02 实时核对有效（官方页：App 底部 Live / swipe left；首次 follow on-screen instructions 选声音）

**给本校学生的口语练习场景（适配你「跟读模仿 + 英汉混杂 + 即时纠错」的偏好）：**
1. **开场设定**：点 Live 后先说一句（打字或语音）：「Let's do English speaking practice. Correct my grammar and pronunciation softly, and when I'm stuck, give me the Chinese word I'm looking for. Keep the conversation going naturally.」（我们练口语，你温和纠错，我说卡壳时给我中文提示）
2. **场景 1——课堂提问模拟**：「Pretend you're my professor. I'm a freshman presenting my STM32 lab report. Ask me questions and then correct my English.」
3. **场景 2——技术英语**：聊你熟悉的东西（PID、模电、操作系统），逼自己用英文讲专业，最容易进步；卡壳就说「how do I say X in English?」
4. **场景 3——跟读模仿**：让它读一段你听不清的英文句子，你复述，让它打分。
5. 每天 10–15 分钟，比背单词有效。

### 13.4.4 Gmail / Docs / Sheets / Meet 里的 Gemini 怎么开
- **Gmail**：打开任意邮件 → 右侧边栏点 **Gemini 图标** → 可让它「帮我总结这封邮件 / 润色我的回信 / 列待办」。
- **Docs**：新建 Google Docs → 右侧 Gemini 图标 → 「Help me write（帮我写）」起草论文大纲 / 邮件；写完选中段落让它改写、缩短、扩写。
- **Sheets**：打开 Google Sheets → 右侧 Gemini 图标 → 选中数据让它生成公式、做图表、补全一列（实验数据处理极快）。
- **Meet**：AI Pro 用户在 Meet 里有更高档功能（自动字幕、录制、会议纪要，交叉引用 11.3）。
- **Vids**：Google Vids（视频生成演示）里让 Gemini 帮你生成毕设 demo 视频脚本。
- **来源**：[Get Gemini in Gmail, Docs, Vids, & more](https://support.google.com/googleone/answer/14534406?hl=en)
- **状态**：✅已查证
- **实时核对**：✅ 2026-10-02（官方页 "Gemini in Gmail, Docs, Vids, and more"、"Help me generate video in Vids"）
- **注意**：Gmail 内 AI Overview（问收件箱）、Chrome auto browse、Gemini Spark、Google Earth Gemini 等部分功能**限美国区**，港区账号可能灰掉，见 13.8。

---

## 13.5 创作额度（Google Flow 视频 / Lyria 音乐 / 4K 放大）

> 额度数字交叉引用 11.3「Veo / 视频与音乐生成」：**Pro = 1,000 Flow credits/月**（Ultra 5x=10,000、Ultra 20x=25,000）；视频模型 **Gemini Omni Flash**；音乐 **Lyria 3.5**；支持 4K 图像放大。

### 13.5.1 Google Flow 做视频（毕设演示 / 自媒体）
1. 浏览器开 **flow.google**（或 Gemini App 内生成），用订阅账号登录。
2. 支持模式：**Text to video（文生视频）、Image to video、Frames to video、Text to image、Image to image**。
3. 写提示词直接生成；**credits 余额在 Flow 站内头像/设置里查**。
4. 当月 1,000 credits 用完后，可去 **one.google.com/ai/credits** 加购 AI credits（全产品通用）。
- **来源**：[Use Google Flow](https://support.google.com/googleone/answer/14534406?hl=en)；[Google Flow Credits](https://support.google.com/googleone/answer/14534406?hl=en)
- **状态**：✅已查证
- **实时核对**：✅ 2026-10-02（Pro=1,000 credits/mo 见 11.3 对比表；超额在 one.google.com/ai/credits 加购为官方原文）

### 13.5.2 Lyria / Flow Music 做音乐
1. 音乐站独立：**flowmusic.app** → 左上 **Login → Continue with Google** → 选账号 → 同意条款。
2. **AI Pro 直接享 Flow Music 的 Plus 档：每月 10,000 credits（约可做 2,000 首歌）、每日补额、12 条并发生成、含商用权**。
3. **注意：Flow Music 的 credits 和 Google Flow 视频的 credits 是两套独立额度**，不互相扣。
- **来源**：[Use Google Flow Music](https://support.google.com/googleone/answer/14534406?hl=en)
- **状态**：✅已查证
- **实时核对**：✅ 2026-10-02 实时核对有效（官方原文："Members of Google AI Pro get the benefits of Google Flow Music's Plus plan: 10,000 monthly credits (~2,000 songs)…separate from your Google AI credits"）

### 13.5.3 4K 放大 / Photos AI 编辑
- Google Photos 里的 **Remix、Photo to video（Veo 图生视频）** 更高次数；官方标注部分功能 **US only**（Photos Remix / Veo photo-to-video 以美区最完整，交叉引用 11.3）。港区账号如看不到入口属正常，见 13.8。

---

## 13.6 省钱 / 避免重复付费

### 13.6.1 YouTube Premium Lite 怎么用（已含，别再单独买）
- 见 13.1 步骤 8：用订阅账号登录 YouTube 自动生效，**不要再花 $13.99/月单独买 YouTube Premium**——Pro 只给 Lite，要完整 Premium 得升级 Ultra（见 11.4）。
- Lite **不能分给家人**（只有户主），想全家免广告的同学另算。

### 13.6.2 Google Store 10% 返利
- 买 Pixel / Nest / Chromebook 等时，用订阅账号登录 **store.google.com** 结账，自动返 **10% Google Store 信用额度**（AI Pro 属 5TB 档 = 10%；200GB 档只有 3%），发货后 30 天到账。
- 交叉引用 11.3「Google Store 返利」。
- **来源**：[Google One Store cash back](https://support.google.com/googleone/answer/9003266)
- **状态**：✅已查证

### 13.6.3 每月 $10 Google Cloud credits 在哪领
- **入口**：你是 AI Pro 订阅者即自动成为 **Google Developer Program premium** 会员，每月 **$10 Google Cloud credits** 自动发放（交叉引用 11.3「开发者额度」）。
- **怎么用**：去 **console.cloud.google.com** 创建项目、启用计费账号时，系统会把 $10 credits 自动抵扣；可在 billing 页看余额。
- 另含：Colab **200 CCUs**、30 个 Firebase Studio workspace、Android Studio 内 Gemini 更高额度、**Jules**（接 GitHub 仓库自动提 PR 的代码代理）、**Google Antigravity**（Gemini 3 Pro 驱动的多代理编程桌面端，支持 Claude 4.5 Sonnet / gpt-oss-120b，仅英文）。
- **来源**：[Google Developer Program premium benefits](https://support.google.com/googleone/answer/14534406?hl=en)
- **状态**：✅已查证
- **实时核对**：✅ 2026-10-02 实时核对有效（官方原文："$10 Google Cloud credits each month"、"200 CCUs" Colab、"30 Firebase Studio workspaces"）

### 13.6.4 家庭拼车分摊
- 见 13.2 第 5 步：5 人拼，$19.99/月摊到 ~$4/人。

### 13.6.5 年付 vs 月付
- 官方年付比月付**省约 16%**（"Save up to 16%"，交叉引用 11.6）。长期用（你已订阅）就换年付：one.google.com → Settings → Change membership plan → 选 Annual。
- **注意**：在 iOS/iPhone 上通过 **Apple 应用内购买**订阅的，只能在 iPhone 上改方案；网页订阅的在网页改。两条路不要混。
- **来源**：[Update your Google One plan](https://support.google.com/googleone/answer/9003633?hl=en)
- **状态**：✅已查证

---

## 13.7 支付落地（只写 Google 侧 · 2026-10 港区/美区实操）

> 本节只讲 Google Play / Google One 这边怎么绑卡、切区、续费取消。**银行卡本身的规则（免转换费、3DS 验证、还款日、汇率入账）详见 `12-*.md` 文件，本节不展开。**

### 13.7.1 把万事达卡绑到港区 / 美区 Google Play
1. 安卓手机打开 **Google Play Store** → 右上角头像 → **Payments & subscriptions（付款和订阅）→ Payment methods（付款方式）→ Add credit or debit card（添加信用卡/借记卡）**。
2. 输入万事达卡号、有效期、CVV；账单地址（Billing address）填你 Play 账号地区对应的地址：
   - **港区账号**：账单地址填香港地址（常用香港转运仓地址即可，城市选 Hong Kong，邮编可填 000000 或留空）；
   - **美区账号**：填美国地址（转运仓地址，州/邮编要匹配，如加州 90001 之类）。
3. Google 可能做 $0–$1 临时授权验证，过几分钟自动撤销。
- **来源**：[Add & manage payment methods](https://support.google.com/googleplay/answer/4646404?hl=en)
- **状态**：⚠️ 账单地址填转运仓地址属常见做法，成功率与风控因卡而异
- **实时核对**：⚠️ 2026-10-02（绑卡入口路径官方页一致；具体地址技巧为社区通行做法，未在官方页明文）

### 13.7.2 切换 Play 账号地区（一年只能改一次）
1. 先确保你的网络 IP 在目标区（港区就挂香港节点，美区就挂美国节点）。
2. Play Store → 头像 → **Settings → General → Account and device preferences → Country and profiles（国家和资料）**。
3. 选目标国家（香港 / 美国）→ 按提示添加该区的付款方式（就是上面那张万事达卡）→ 填该区地址。
4. 提交后最长 **48 小时生效**。
- **硬性规则（官方原文，踩前必读）：**
  - 一年只能改一次地区，改完 12 个月内不能再改；
  - 新创建付款资料后要等 12 个月才能再改；
  - **旧区的 Google Play 余额不会带到新区**；
  - 你在家庭组里时不能改地区；
  - 可能丢失旧区部分图书/电影/App 访问权。
- **来源**：[Change your Google Play country](https://support.google.com/googleplay/answer/7424?hl=en)
- **状态**：✅已查证
- **实时核对**：✅ 2026-10-02 实时核对（官方社区答复一致：once per year、must be physically in new country via IP、local payment method required、family group blocks change、up to 48h to update）

### 13.7.3 订阅 AI Pro 的入口
- 网页：**one.google.com** → 选 Google AI Pro → 用刚绑的卡付款。
- 或安卓 Play Store 里搜「Google One」App → Membership plans → AI Pro。
- **iOS 用户注意**：在 iPhone 上走 Apple 内购会贵（苹果抽成），且只能在 iPhone 管理——**建议用安卓或网页订阅**。

### 13.7.4 查看订阅 / 续费 / 取消
- **查订阅**：payments.google.com → **Subscriptions & services**，能看到所有在扣的订阅和下次扣款日。
- **取消（网页）**：one.google.com → 右上 **Settings → Cancel membership → Cancel**。
- **取消（Play）**：Play Store → 头像 → Payments & subscriptions → Subscriptions → 找到 Google One → **Manage → Cancel subscription**。
- **退款**：取消后已扣费用**不退**，但你可以用到当期结束。
- **来源**：[Cancel your Google One membership](https://support.google.com/googleone/answer/9003633?hl=en)；[Manage recurring payments](https://support.google.com/paymentscenter/answer/9003237?hl=en)
- **状态**：✅已查证
- **实时核对**：✅ 2026-10-02 实时核对有效

### 13.7.5 避免重复扣费 / 超额
1. **一个号只订一次**：别在网页和 Play 各订一遍。怀疑重复扣费 = 去 payments.google.com → Activity 看流水，哪条多扣了就在那个号上取消另一个。
2. **AI credits 超额**：Flow/Antigravity 默认用完即止，不会偷偷扣钱；要自动超额得手动开 toggle（Antigravity → Settings → overage toggle 选 Never/Always）。学生建议设 **Never**，用完不心疼。
3. **手机是 iPhone 的同学**：如果你在 iPhone 上用 App Store 订阅过，又在网页订了一份——去 iPhone 的 设置 → Apple ID → 订阅 里把 App Store 那份取消，两边只留一边。

---

## 13.8 地区坑与替代方案

### 13.8.1 大陆 / 港区不可用或残缺的功能清单
| 功能 | 中国大陆 | 港区账号 | 说明 |
|---|---|---|---|
| Google AI Pro 订阅本身 | ❌ 不可订 | ✅ 可订（HK$158/月） | 见 11.6 |
| Gemini 聊天 / Gemini 3 Pro | 需网络环境 | ✅ | — |
| **NotebookLM / Gemini Notebook** | 需网络环境 | ⚠️ **官方可用国家列表（answer/14534406）中未见香港**，港区账号可能打不开 notebook.google | 如遇此情况，见下方替代 |
| Deep Research / Deep Search | 需网络环境 | 🟡 Deep Search / AI Mode 部分功能限美国区 | 见 11.3 |
| Gmail AI Overview（问收件箱） | ❌ | ❌ US only | — |
| Google Photos Remix / Veo 图生视频 | ❌ | ❌ US only | 见 11.3 |
| Gemini Spark（24/7 代理） | ❌ | ❌ US only | — |
| YouTube Premium Lite | 需网络环境 | 🟡 视 YT Lite 国家列表 | 见 11.10 |
| Google Opinion Rewards / Play Points | ❌ | ✅ | 见 11.7 |
- **来源**：[List of countries where Google AI Pro & Gemini Notebook are available](https://support.google.com/googleone/answer/14534406?hl=en)
- **状态**：✅已查证（NotebookLM 国家列表当日实时展开核对，未见 Hong Kong）
- **实时核对**：⚠️ 2026-10-02（官方列表按字母排列含 Taiwan、Singapore、Japan、US，但**未列出 Hong Kong**；港区账号能否访问 notebook.google 以你登录时实际为准，打不开属正常）

### 13.8.2 网络与账号注意事项
1. 全程用**同一个谷歌账号**在同一网络环境登录；频繁跨 IP / 跨设备切换容易触发 Google 安全验证（要求手机验证码）。
2. 别在大陆裸连直连 Google，否则账号可能被风控。
3. Play 礼品卡与账号地区**必须一致**（美区卡只能充美区号），见 11.10。

### 13.8.3 用不了时的替代工具
| 想用但用不了的功能 | 替代 |
|---|---|
| NotebookLM 读文献 | 闭源替代：**ChatGPT（网页版传 PDF）、Claude.ai、Kimi、豆包**（都能传 PDF 问答）；开源：Ollama + Anything-LLM |
| Deep Research 自动调研 | ChatGPT Deep Research、Perplexity Pro、秘塔 AI 搜索 |
| Gemini Live 练口语 | 豆包/Starling/Elsa Speak/ChatGPT 语音模式 |
| Google Flow 生视频 | 即梦、可灵、Runway、Vidu |
| 5TB 云盘 | 百度网盘超级会员、阿里云盘、OneDrive（学生 5TB 见 01 文件） |
| Gems 自定义助手 | ChatGPT GPTs、Claude Projects、豆包智能体 |

---

*本文件聚焦「怎么用」，权益与价格以 `11-谷歌生态与Gemini权益.md` 为准，银行卡侧规则以 `12-*.md` 为准。功能入口可能随 Google 更新微调，关键页已在文中标注 URL，2026-10-02 实时核对。*
