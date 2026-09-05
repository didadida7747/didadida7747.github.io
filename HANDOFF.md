# HANDOFF.md · 站点交接与二次开发指南

> 这份文档的读者：**未来接手这个项目的任何人（包括新开对话的 AI 助手，包括半年后忘了细节的你自己）**。
> 目标：不读完全部代码，也能安全地加内容、改功能、二次开发。
> 深层原理和踩坑故事在 [LEARNING.md](./LEARNING.md)，本文只讲"怎么干"。

## 1. 一分钟现状（2026-09-03 二次开发后）

- 一个**已建成并验收**的 VitePress 知识站：工作区根目录 = 站点内容源，`.vitepress/` 是工程目录。
- 功能：深色星空 Canvas 背景、首页搜索发现面板、每日知识点（日期种子随机）、闯关游戏（每日挑战/全景闯关双模式 + 学情分析）、**错题本**（答错自动入本/重做移出）、**每日任务执行台**（贴任务/打卡/连续天数/复盘草稿生成）、阅读进度环、导航/目录滚动虚化、目录平滑滚动、全文搜索（Ctrl K）。
- 内容：学习笔记、成长规划、面试题手册、每日视野简报（日报即博客流），外加 2026-09-03 扩充的 4 个知识库栏目：**嵌入式体系/**（16 页）、**STM32工作流/**（7 页）、**AI学习/**（10 页）、**求职研究/**（13 页）——均从 `D:\ai资料` 兄弟目录精选拷贝并**脱敏**（删校名/成绩/个人排期，原文件不动）。
- 健康 status：所有已知 bug 已修复（含 SSR 空壳回归，见 LEARNING.md 坑 13）；扩充内容已通过脱敏扫描（无裸 HTML/`{{}}`/隐私词）与构建期锚点真值校验。
- 版本控制：git main 分支基线 `0b3172e`；二次开发在 `feature/content-expansion` 分支进行。
- 部署：GitHub Actions workflow 已就绪（`.github/workflows/deploy.yml`），push 到 GitHub 即自动构建发布，目标地址 `https://didadida7747.github.io/`。
- ⚠️ 新增内容时的隐私红线：`D:\ai资料` 里有含真实姓名/手机号/校名的文件（如 老师任务/复盘和回信/ 下的邮件模板、实习/career_research/00_个人求职画像），**永远不要拷进站点**；拷贝任何工作区文档前先 grep 西电/姓名/手机号/均分。

## 2. 命令表（就三条，别记多）

| 命令 | 什么时候用 | 行为 |
|---|---|---|
| `npm run dev` | **写笔记时**（日常模式） | 启动监视服务器（默认 5173 端口），新文件保存即上站，热更新。写完 Ctrl+C |
| `npm run rebuild` | **想看"正式版"时**（发布模式） | 杀旧预览(4173) → 构建 → 前台启动预览。Ctrl+C 停止 |
| `npm run build` | 只要产物不启动服务（如部署前检查） | 输出到 `.vitepress/dist/` |

> 注意：`preview` 不感知文件变化——构建后必须重跑才生效。这就是 `rebuild` 存在的原因。

### 公众号精选流水线（2026-09-03 新增）

| 命令 | 什么时候用 | 行为 |
|---|---|---|
| `npm run wx:sync` | wewe-rss 开着时（日常） | 拉新文章 → 全文存 `公众号精选/articles/`（git 忽略）→ 更新 `公众号精选/导读/<号名>.md`（上站） |
| `npm run wx:sync -- --backfill` | 新加订阅时（一次性） | 历史文章全部入导读目录，不抓全文 |

接入步骤（wewe-rss 下载/扫码/加订阅/填 feeds.json）见站点页面 `公众号精选/README.md`（即 `/公众号精选/` 页）。新号的导读页生成后，在 `config.mts` 侧边栏「📮 公众号精选」组补一行链接。**版权红线：全文只在本地，导读（标题/摘要/链接）才上站。**

## 3. 加内容的标准流程

1. 把 `.md` 文件放进工作区（根目录或已有子目录），保存。
2. 如果 `npm run dev` 开着：**已经上站了，什么都不用做**。
3. 侧边栏归属：
   - **根目录新文件**：自动进侧边栏「🗂 未归类笔记」组（构建/启动时自动扫描，取文件里第一个 `# 大标题` 做显示名）。零登记成本。
   - 想给它正式身份：在 `.vitepress/config.mts` 的 `sidebar` 里对应分组加一行 `{ text: '显示名', link: '/文件名（不带.md）' }`，它就会从未归类组消失、进入正式分组。
4. 如果只动了正文（不加文件），dev 模式下保存即刷新；发布模式需要重跑 `npm run rebuild`。

## 4. 硬规则（违反任何一条 = 网站坏给你看）

1. **主题代码里（`.vitepress/theme/**`），`window` / `document` / `location` / `localStorage` 绝不出现在模块顶层**——只能在 `onMounted` 或事件回调里用。违反 → SSR 构建期崩溃 → 全站页面变空壳且构建不报错（曾存活多轮的隐性事故，见 LEARNING.md 坑 13）。
2. **内容 md 里不要写裸 HTML 标签和 `{{ }}`**——会被当 Vue 模板编译。写代码示例用围栏 ` ``` `。
3. **第三方/机器生成的语料**（克隆仓库、抓取转写）先加进 `config.mts` 的 `srcExclude` 再说，不要直接丢进内容源。
4. **锚点链接不许手写猜测**——VitePress 生成的标题 id 有自己的规则（保留 `、·` 等标点，数字开头加 `_` 前缀）。取真值方法：`grep -oE 'id="[^"]*"' .vitepress/dist/目标页面.html`。
5. **构建输出别截断**（别习惯性 `| tail`）——本项目的坑 13 靠构建警告才能发现。
6. 本页目录的锚点链接点击已被自定义平滑滚动接管（`MyLayout.vue`，`setInterval` 驱动，**不要改回 rAF**——嵌入式/后台环境会挂起）。

## 5. 文件地图（改哪里）

| 想改什么 | 动哪个文件 |
|---|---|
| 导航栏 / 侧边栏分组 / 搜索配置 | `.vitepress/config.mts` |
| 品牌色 / 正文字体 / 排版 | `.vitepress/theme/custom.css` |
| 星空背景 | `.vitepress/theme/Starfield.vue` |
| 首页搜索发现面板（快捷词/猜你想看/热点榜） | `.vitepress/theme/DiscoverPanel.vue` |
| 每日知识点栏目 | `.vitepress/theme/DailyKnowledge.vue` |
| 闯关游戏（题目/模式/学情） | `.vitepress/theme/QuizGame.vue` + `knowledge.js` |
| 知识点数据库（知识点+题目+原文锚点） | `.vitepress/theme/knowledge.js`（被 DailyKnowledge 和 QuizGame 共享） |
| 错题本（列表/重做/清空） | `.vitepress/theme/WrongBook.vue` + `wrongbook.md`（数据 key `quiz-wrong-book` 由 QuizGame 写入） |
| 每日任务执行台（打卡/复盘草稿） | `.vitepress/theme/TaskBoard.vue` + `tasks.md`（数据 key `daily-task-v1`；灵感任务池在 `tasks.js`） |
| 术语图鉴（分类/搜索/弹层/收藏） | `.vitepress/theme/TermsPage.vue` + `terms.js`（收藏 key `term-favs`） |
| 情境练习（方向筛选/解锁/讲评） | `.vitepress/theme/PracticePage.vue` + `practice.js`（记录 key `practice-rec-v1`） |
| **文档课（2026-09-05 新增：系列章节/已读进度）** | `.vitepress/theme/DocsPage.vue` + `docs.md`（数据在 `docs.js`，加新文档课在此登记一个系列对象；进度 key `docs-read-v1`） |
| **主题色切换器（导航右侧色点，2026-09-05 新增）** | `.vitepress/theme/ThemePicker.vue`（选择 key `theme-accent-v1`；全站主色走 CSS 变量 `--vh-accent`，定义在 `custom.css`） |
| **UI 风格（2026-09-05 改版：vibe-hub 式浅色扁平）** | `.vitepress/theme/custom.css`（主色 `#2f4fe0`；首访默认浅色，深色模式保留星空；改主色只需换 `--vh-accent` 一处） |
| 阅读进度环 | `.vitepress/theme/ReadingProgress.vue` |
| 布局层（星空挂载/转场/滚动行为/导航淡化） | `.vitepress/theme/MyLayout.vue` |
| 首页内容 | `home.md`（rewrites 成 `/`）；游戏页 `game.md`；任务页 `tasks.md`；错题本 `wrongbook.md` |
| 扩充的 4 个知识库栏目 | 根目录 `嵌入式体系/`、`STM32工作流/`、`AI学习/`、`求职研究/`（各栏目 `README.md` 被 rewrites 成栏目首页） |

## 6. 二次开发路线建议

**保底操作（已完成 2026-09-03）**：git 已初始化，基线提交 `0b3172e`，当前"完好版本"已固化。之后任何改动搞砸了都能 `git diff` 看差异、`git checkout` 回滚；实验性大改开分支。这就是"不破坏现有完整网页"的标准答案——**版本控制不是备份，是时光机**。

**方向建议**（在现有站点上扩展，不要另起炉灶重写——13 个踩过的坑都沉淀在现在的配置里，重写等于全部再踩一遍）：
1. 错题本页面（读 localStorage 里的答题记录，列出错题 + 原文链接 + 重做模式）——入门。
2. 知识点/锚点自动校验脚本（Node 脚本进构建流程）——进阶。
3. 部署 GitHub Pages（workflow 已就绪，建仓库后 push 即上线）——实战，零成本上线。

## 7. 新对话开场模板（直接复制使用）

以后新开 AI 对话继续开发，起始提示词这样说：

```
请先读两份文档再动手：
- D:\ai资料\日常与规划\HANDOFF.md（怎么干活：命令、加内容流程、硬规则、文件地图）
- D:\ai资料\日常与规划\LEARNING.md 第 4 节（13 个踩过的坑，违反会弄坏网站）

【项目现状】个人知识站已上线：https://didadida7747.github.io/（仓库
didadida7747.github.io，push 到 main 自动部署；工作区根目录即站点内容源）。
【本次目标】二次开发，扩展成一个内容更丰富的网站。本次想加：〔在这里写你的新需求〕。
【约束】
1. 不破坏现有功能：大改动先给实现方案（改哪些文件、分几步），我确认后再动手；
   大重构开 git 分支。
2. 改完用 `npm run rebuild` 本地验收，我确认后再 push（push 即上线）。
3. 遵守 HANDOFF.md 第 4 节硬规则。
```

仓库本身就是最完整的交接文档——这也是先把 git 建起来的理由。
