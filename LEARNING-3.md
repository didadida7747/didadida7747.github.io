# LEARNING-3.md · 三轮开发复盘（2026-09-06 ~ 09-07）

> **读者**：未来的自己，以及新开对话接手的 AI 助手。
> **范围**：接续 [LEARNING.md](./LEARNING.md)（二轮：内容扩充→功能迭代→大回退→精简为资料储藏室，止于 `c117e7a`）。本文覆盖其后的四波工作：**构建体检与运行时优化 → 大观栏目上站 → 移动端/平板适配 → 对标借鉴与功能取舍**（提交 `725c6a3` ~ `d1b4a0d`，共 5 个上线提交）。共 1 次"差点修错方向"、1 次"烧了 10+ 轮构建的止损"。
> **v1 建站复盘**：`git show 0b3172e:LEARNING.md`。
> **配套文档**：[HANDOFF.md](./HANDOFF.md) 讲「怎么干活」，本文讲「为什么这样干」和「踩过什么坑」。

---

## 0. 一分钟时间线

| 提交 | 干了什么 | 结局 |
|---|---|---|
| `725c6a3` | 构建体检：修 2 条潜伏死链，**关闭 `ignoreDeadLinks` 让构建把关**，清 game.md 重写残留与 `ld` 语言块 | ✅ 上线 |
| `7b496ce` | 运行时优化：星空后台标签页暂停绘制、平滑滚动尊重系统"减少动态效果" | ✅ 上线 |
| `2849ff6` | **大观栏目**：6 篇全站导读上站（脱敏：校名/公司名/届别/个人排期），侧栏最顶组 + 知识库入口 | ✅ 上线 |
| `c49b1c8` | **移动端/平板适配**：侧栏抽屉实底、表头横排、768–959 提前切汉堡、触控热区 44px | ✅ 上线 |
| `d1b4a0d` | **对标借鉴**：页脚"最后更新于"、sitemap.xml、代码块行号；搜索整句优化探索后止损回退 | ✅ 上线 |

**最终形态一句话**：纯资料储藏室 + 全站导读 + 完整移动端体验 + 构建期死链/更新时间把关。**没有新增任何娱乐性功能**——本轮最大的功能决策是"搜索整句优化做了三轮全部失败，回退"。

---

## 1. 技术栈总览

### 1.1 核心框架层（v1/v2 已有，本轮用到更深）

**VitePress**（静态站点生成器，Static Site Generator，SSG——把源文件预先渲染成纯 HTML 的工具）
- 解决什么：Markdown → 多页面网站，自带侧边栏/搜索/目录。
- **本轮新开启的四个内置能力**：
  - `sitemap: { hostname }`：构建时生成 `dist/sitemap.xml`（站点地图——给搜索引擎爬虫看的全站页面清单），一行配置；
  - `lastUpdated: true` + `themeConfig.lastUpdated`：构建时对每个 md 跑 `git log -1` 取提交时间渲染到页脚——**这个功能让 git 从版本工具升级成数据源**，没有 git 历史它就是死的；
  - `markdown.lineNumbers: true`：全部代码块渲染行号；
  - `ignoreDeadLinks: false`：死链检查从"豁免"转为"把关"——构建期发现指向不存在页面的链接直接构建失败。本轮靠它抓出 3 条死链（含大观原文自带的一条）。
- **本轮摸清的深层机制**（代价惨重，见第 4 节坑 21）：主题配置要跨"构建机器 → 用户浏览器"传递，VitePress 把它序列化（Serialization——把内存对象转成可传输文本）成 `@siteData` 虚拟模块；函数有官方编码（`_vp-fn_` 前缀字符串，客户端 `new Function` 还原），**但这条链路在搜索配置上实测不可靠**——这是"给框架根深处动手术"的边界案例。
- 替代：Docusaurus（React 系、重）、Astro（灵活、概念多）、Hugo（快但模板别扭）。二轮结论不变，**但搜索是 VitePress 短板**，真要整句搜索得换 Pagefind。

**Vue 3 单文件组件**（SFC）
- 本轮用到：`visibilitychange` 事件驱动的动画暂停、`::after` 伪元素触控热区、`window.matchMedia('(prefers-reduced-motion: reduce)')` 系统偏好检测——三处修改全部遵守"浏览器 API 只出现在 `onMounted`/事件回调里"的 SSR 铁律（v1 坑 13）。
- 取舍同前：组件是壳，Markdown 内容才是资产。

**CSS 媒体查询**（Media Query——同一套 HTML 按视口宽度应用不同样式）
- 本轮的移动端适配核心武器，断点体系见第 3 节精读③。
- 替代：JS 监听 resize 切 class（难维护）、容器查询（兼容未铺满）。选纯媒体查询：零 JS、不失灵。

### 1.2 验收与调试工具层（本轮的重头戏）

**Chrome Headless**（无头浏览器——不带界面的浏览器进程，命令行驱动）
- 解决什么：自动化截图验收，零依赖（项目没装 Playwright）。
- **本轮踩出的关键差异**（坑 17）：旧版 `--headless` + `--window-size=390` **不产生移动布局**（页面仍按桌面宽排版，截出的"整页溢出"全是假象）；**`--headless=new` 才正确应用移动视口**。
- 参数组合：`--headless=new --screenshot=out.png --window-size=390,844 --hide-scrollbars --virtual-time-budget=8000 URL`（virtual-time-budget 让页面 JS 快进跑完再截）。
- 替代：Playwright/Puppeteer（要装依赖）、真机（最准但无法自动化）。

**Browser Use IAB**（内嵌浏览器，Playwright 风格 API）
- 解决什么：交互式验收——`setViewportSize` 设真机视口、`evaluate` 在页面里执行 JS 拿运行时硬数据（`scrollWidth`、`getBoundingClientRect()`、`getComputedStyle`）、`domSnapshot` 看无障碍树。
- **本轮实测**：数据验收极可靠；**screenshot 命令间歇挂**（"capture failed for guest"，重试/换标签页可恢复）。最终策略：**数据走 IAB evaluate，视觉走 headless=new 截图**，双轨互备（坑 19）。

**Node 脚本**（`node -e` 与一次性 .mjs）
- 本轮实战：大观 6 篇的 Windows 绝对路径批量替换——**先试 `sed`，被反斜杠转义打到报错**（坑 16），换 node 的 `split().join()` 十行解决。教训：**Windows 路径批处理用字符串 API，别用 sed 正则**。

**Git + GitHub Actions**：`lastUpdated` 依赖 git log；push 走代理四件套（http.proxy + openssl + HTTP/1.1，一次性参数不落盘）。

### 1.3 搜索底层（本轮深坑主角）

**MiniSearch**（VitePress 本地搜索的底层库——构建期建倒排索引、浏览器端完成查询的轻量全文引擎）
- 三轮改造全败的机制收获（详见坑 21）：**索引侧**（构建时 Node）与**查询侧**（浏览器运行时）是两条独立代码路径，配置必须两边都活；**搜索组件内联打包了自己的 minisearch 拷贝**，外部 patch 摸不到它。
- 替代（真要整句搜索）：**Pagefind**（构建期索引、原生中日韩分块）、Algolia DocSearch。

### 1.4 内容与协议层

**隐私脱敏**（Sanitization——把含个人信息的文档改写成可公开版本）
- 大观上站实战：删校名（"西电"）、公司名+岗位编号（"亘岩 JAVA 实习"）、届别值、个人排期快照（"当前第 3 周末"）；绝对路径改库别名；上站前终扫 grep（校名/手机号模式/裸 HTML/`{{}}`）。
- 铁律：只改站点副本，原文件不动。

---

## 2. 架构与数据流

### 2.1 一次页面访问的完整流程（以手机打开某篇笔记为例）

```
【构建期】npm run rebuild（本地验收）或 GitHub Actions（push main 自动）
  ① config.mts 读取：
     - srcExclude 排除工具产物；rewrites 把 home.md→index.md、大观/00→大观/index 等映射成 URL
     - buildAutoSidebarGroup() 扫根目录未登记 .md 自动归入「未归类」组（子目录不扫，大观要手登）
  ② 每个 .md 走 VitePress 编译：
     - markdown-it 解析正文 + Shiki 代码高亮（lineNumbers 加行号）
     - 死链检查：指向不存在的页面 → 构建失败（ignoreDeadLinks 已关，坑 14/23）
     - lastUpdated：git log -1 取提交时间 → 写进页面数据
  ③ 搜索索引：全站文本 → MiniSearch 索引 JSON → assets/chunks/@localSearchIndexroot.*.js
     （1.85MB，懒加载——打开搜索框才下载；首个查询可能打在加载完成前，坑 22）
  ④ 站点配置序列化：themeConfig（导航/侧栏/搜索文案）→ @siteData 虚拟模块
     （函数经 _vp-fn_ 编码；这条链路的边界 = 坑 21 的战场）
  ⑤ 产物落盘 dist/：115+ HTML + assets + sitemap.xml
  ⑥ scripts/rebuild.mjs：杀旧 4173 进程 → 起新 preview（preview 只认启动时清单，坑 18）

【部署期】git push origin main → GitHub Actions 自动构建 → didadida7747.github.io

【运行期】手机浏览器打开
  ① HTML 首屏直出（正文已在里面）
  ② CSS 媒体查询按视口分流：<960 侧栏变抽屉+导航收汉堡+抽屉实底；
     <768 表头 nowrap+本页目录按钮加高（详见第 3 节精读③）
  ③ Vue 水合（Hydration——把静态 HTML 接上事件与响应式数据）：
     - MyLayout.onMounted：滚动监听、锚点平滑滚动（setInterval 驱动）；
       smoothScrollTo 入口检查 prefers-reduced-motion，系统开了"减少动态"就直接落位
     - Starfield.onMounted：visibilitychange 监听——切后台 stopLoop() 取消帧，切回 startLoop()
     - ReadingProgress：滚动更新进度环；"回到顶部"按钮有 46px 触控热区（::after）
  ④ Ctrl K / 点搜索 → 懒加载索引 → MiniSearch.loadJSON → 查询
     （默认分词：短词/双词组合可用；整句是框架限制，坑 21）
```

### 2.2 目录结构职责（★ = 本轮新增/修改）

```
日常与规划/                    ← 工作区根 = 站点内容源
├── .vitepress/
│   ├── config.mts            ← 唯一配置；★本轮 +sitemap/lastUpdated/lineNumbers +搜索注释
│   ├── theme/
│   │   ├── MyLayout.vue      ← ★+smoothScrollTo 的 reduced-motion 检查
│   │   ├── Starfield.vue     ← ★+后台暂停（running 标志 + visibilitychange）
│   │   ├── ReadingProgress.vue ← ★+回到顶部 46px 触控热区（::after）
│   │   └── custom.css        ← ★+移动端适配区块（媒体查询四组，见精读③）
│   └── dist/                 ← 构建产物；★教训：构建失败会清空它（坑 15）
├── 大观/                      ← ★新栏目：全站导读 6 篇（00 rewrite 成栏目首页）
├── scripts/rebuild.mjs       ← 杀旧预览→build→起新预览（验收入口）
├── 公众号精选/、自学资源/      ← 并行会话在建（未跟踪；已进 dist 但勿混入提交，坑 23）
└── *.md                      ← 内容源
```

**为什么大观用目录**：6 篇是系列，`00-总导读` rewrite 成 `index` 得到干净的 `/大观/` 栏目入口，与既有四栏目结构一致。**为什么进侧栏最顶部**：导读是"地图层"——先看地图再看内容。

---

## 3. 核心代码精读

### ① Starfield.vue 的后台暂停：running 标志与帧生命周期

```js
let running = false
function startLoop() {
  if (running) return          // 防重复启动
  running = true
  rafId = requestAnimationFrame(draw)
}
function stopLoop() {
  running = false
  cancelAnimationFrame(rafId)  // 取消"已排队的下一帧"
}
function draw(t) {
  // ...画星空...
  if (running) rafId = requestAnimationFrame(draw)   // ← 关键：running 才续帧
}
onVisChange = () => (document.hidden ? stopLoop() : startLoop())
document.addEventListener('visibilitychange', onVisChange)   // 在 onMounted 里注册
```

**在做什么**：标签页切到后台时暂停星空逐帧重绘（省 CPU），切回自动恢复。

**为什么这样写**：`requestAnimationFrame`（rAF，浏览器每帧回调一次的动画 API）循环的模式是"画完这帧→预订下一帧"。`cancelAnimationFrame` 只能取消**还没执行**的那帧；draw 内部若无条件续帧，取消后下一个已排队帧又把循环续起来。**`if (running)` 是保险丝**：漏网帧发现自己不该续命，循环彻底停。

**更常见的写法**：教程常在 rAF 回调里判断 `document.hidden` 跳过绘制——省了状态变量，但每帧仍跑回调，省电打折。本写法是"事件驱动 + 状态标志"的标准组合。

**SSR 注意**：整段在 `onMounted`，`onBeforeUnmount` 注销监听——模块顶层碰 `window`/`document` = 构建期全站空壳（v1 坑 13）。

### ② ReadingProgress.vue 的触控热区：视觉尺寸与交互尺寸分离

```css
.top-btn {
  position: absolute;
  width: 22px; height: 22px;   /* 视觉：小圆点挂在进度环右下角 */
}
/* 视觉保持 22px 小圆点，触控热区外扩到 46px（移动端点击不落空） */
.top-btn::after {
  content: '';
  position: absolute;
  inset: -12px;                /* 四周各外扩 12px */
  border-radius: 50%;
}
```

**在做什么**："回到顶部"视觉只有 22px，但手机触控目标需要 **44×44px 以上**（Apple HIG / Material Design 共同建议；术语 Touch Target，触控目标）。`::after` 伪元素（用 CSS 凭空生成的"假子元素"）撑出透明 46px 点击区。

**为什么这样写**：真把按钮放大到 44px 会盖住进度环数字。**视觉尺寸和交互尺寸是两个独立设计变量**，伪元素让它们解耦——这是标准手法。

**更常见的写法**：透明 padding 放大 + 负 margin 收回视觉——效果同但更绕。注意点：伪元素区域也响应 hover，悬停样式要写在父元素上。

### ③ custom.css 的移动端断点体系：一条规则只回答一个问题

```css
/* 1) 侧栏抽屉实底：<960 时侧栏是悬浮在正文上的抽屉，全透明会让菜单文字
      与正文文字重叠——桌面端的"透明融星空"必须在此关闭 */
@media (max-width: 959px) {
  .dark .VPSidebar { background: rgba(15, 19, 46, 0.97) !important; backdrop-filter: blur(18px); }
  html:not(.dark) .VPSidebar { background: rgba(248, 249, 255, 0.98) !important; }
}
/* 2) 窄屏表格：CJK 字符在被均分的窄列里逐字竖排（一字一行不可读），
      表头 nowrap 撑开列宽 → 表格整体横向滚动 */
@media (max-width: 767px) {
  .vp-doc th { white-space: nowrap; }
}
/* 3) 768–959 提前切汉堡导航：VitePress 默认 768 以上仍显示完整导航，
      本站菜单项多，768 视口装不下会横向溢出 50px+ */
@media (max-width: 959px) {
  .VPNavBarMenu, .VPNavBarSearch { display: none !important; }
  .VPNavBarHamburger { display: flex !important; }
}
```

**在做什么**：三条规则各解决一个**实测确认**的问题（抽屉文字重叠、表头竖排、平板导航溢出 53px）。

**为什么这些数字**：960 = VitePress 侧栏抽屉化的原生断点（对齐它，行为可预测）；768 = VitePress 导航原生断点，但本站导航项多装不下，把汉堡切换**提前到 960**。

**`!important` 的纪律**：只在覆盖第三方框架默认值时用；自己写的规则之间永远不用——滥用会让后续所有覆盖升级成军备竞赛。

**方法论**：每条都是"真机视口拿 `scrollWidth` 硬数据 → 确认问题真实 → 写规则 → 同一组数据验证修复"。**绝不对着截图猜**（坑 17 的假溢出差点骗出一个错误修复）。

### ④ miniSearch 双字分词（已回退，教学价值最高的一段）

```ts
// config.mts（已移除，此处为讲解）
tokenize: (text: string) => {
  const segments = text.toLowerCase().match(/[\u4e00-\u9fff]+|[a-z0-9]+/g) || []
  const tokens: string[] = []
  for (const seg of segments) {
    if (/^[\u4e00-\u9fff]+$/.test(seg) && seg.length > 1) {
      for (let i = 0; i < seg.length - 1; i++) tokens.push(seg.slice(i, i + 2))  // 双字滑窗
    } else tokens.push(seg)
  }
  return tokens
}
```

**在做什么**：中文按**相邻双字滑动窗口**切词——"启动流程"→"启动/动流/流程"。任何连续中文子串都能命中，解决"整句搜索恒 0 条"（默认 AND 语义下，整句里的虚词没有文档命中就整组落空）。

**为什么最终回退**（本段最重要）：**tokenize 必须在两个世界各活一次**——
1. **索引侧**（构建时 Node）：读完整 config → 索引里全是双字词 ✅（实测确认）
2. **查询侧**（浏览器）：配置要跨"构建机器→页面"传递。VitePress 的官方函数序列化（`_vp-fn_` 前缀 + `new Function` 还原）确实把函数编码进了产物——**但实测查询侧仍失效**；用 vite transform 插件强行注回，又触发水合异常（搜索弹窗打不开、`undefined reading 'id'`）。

**三层教训**：
- 分词必须索引/查询**两侧一致**，只改一侧等于密码本对不上；
- **SSG 的配置有"构建期/运行期"两个生命期**，函数能否活着跨过序列化边界取决于框架策略——所有 SSG（Next/Nuxt）的深层课题；
- **止损是工程能力**：三轮（含两个"聪明" hack）全败后回退默认，短词搜索保住健康。config 里留了注释防后人重蹈。

**正道**：换 Pagefind（构建期索引、原生中日韩分块）——一箭双雕解决整句搜索。

### ⑤ buildAutoSidebarGroup：新文件的零登记收录

```ts
function buildAutoSidebarGroup(links: Set<string>) {
  const skip = new Set(['home.md', 'index.md'])
  const items = readdirSync(process.cwd())                              // 只扫根目录
    .filter(f => f.endsWith('.md') && !skip.has(f) && !links.has('/' + f.replace(/\.md$/, '')))
    .map(f => {
      let title = f.replace(/\.md$/, '')
      try {
        const m = readFileSync(f, 'utf8').match(/^#\s+(.+)$/m)          // 取第一个 # 大标题
        if (m) title = m[1].replace(/[*`]/g, '').trim()
      } catch { /* 读不出标题就用文件名 */ }
      return { text: '🆕 ' + title, link: '/' + f.replace(/\.md$/, '') }
    })
  return items.length ? [{ text: '🗂 未归类笔记（新文件自动收录）', collapsed: false, items }] : []
}
```

**在做什么**：构建/启动时扫根目录，未登记的 `.md` 自动进「未归类笔记」组——新笔记零登记成本。

**为什么**：`collectSidebarLinks` 先递归收集已登记链接，剩下即未登记——**"全集减已登记"比"标记收录"省心**。`try/catch` 兜底：一个坏文件不能弄死构建。

**边界（本轮给大观登记时踩到的知识）**：`readdirSync` 不递归——**子目录文件不会进未归类组**，大观 6 篇必须手动登记侧边栏。日报归档同样手动（自动化 = 第 6 节练习题②）。

---

## 4. 难点与踩坑记录

### 4.1 前两轮的 24 个坑（编号保留，详表见 LEARNING.md 1-13 / git 历史版）

v1 坑 1–13（SSR 空壳、路径解析、URL 编码、preview 清单、进程残留、异步 DOM、框架内部类名、CSS 层叠、锚点真值、平滑滚动三连、文件过期、构建输出截断）与 v2 坑 14–24（死链豁免负债、构建清空 dist、sed 转义地狱、headless 假视口、preview 重启、IAB 命令间歇挂、内部类名取证、**中文搜索三连败**、索引懒加载时序、探针清理纪律、脱敏四步）——全部仍有效，**v2 的完整详表在 [LEARNING.md](./LEARNING.md) 第 4 节**。

### 4.2 本轮（第三轮）新增坑（25–31）

| # | 问题现象 | 根本原因 | 解决方案 | 以后如何预防 | 经典度 |
|---|---|---|---|---|---|
| 25 | 旧版 headless 截图"整页溢出"，差点据此大修 CSS | 旧 `--headless` 不应用移动视口，页面按桌面宽排版（连汉堡按钮都不出现） | 换 `--headless=new`；或 IAB `setViewportSize` | **验收工具先被验证，再用它验收**：用两种独立通道交叉取证 | ⭐经典：设备模拟假象 |
| 26 | 改 config 直接 build，浏览器里新功能"不存在" | preview 只认启动时文件清单（v1 坑 4 变体，本轮反复踩） | 固化：改配置 = 必跑 `npm run rebuild` | 把"重启"写进脚本而不是写进脑子 | 中 |
| 27 | IAB screenshot/viewport 命令间歇挂（"capture failed for guest"/30s 超时） | 内嵌浏览器 guest 进程状态劣化 | 双轨验收：**数据走 IAB evaluate，视觉走 headless=new** | 验收链要有 Plan B，证据不押一个通道 | 中 |
| 28 | 想给"本页目录"折叠条加高，不知道类名 | VitePress 内部类名（`VPLocalNavOutlineDropdown`）无文档 | evaluate 从按钮向上遍历父链取真实类名（v1 坑 8 原则复用） | 不猜框架内部命名，运行时取证 | ⭐经典 |
| 29 | **中文整句搜索三轮全败**：①config 双字分词——索引侧生效、查询侧失效；②shim+alias patch——循环依赖（alias 替换 shim 自身的 import）+ 双类拷贝（组件内联自己的 minisearch）+ 纯转发也崩；③transform 注入 @siteData——水合异常弹窗打不开 | 索引/查询两条代码路径 + 官方函数序列化（_vp-fn_）实测在该链路不可靠 + 组件内联第三方库拷贝，三层机制缠绕 | **止损回退**：删 shim/alias/注入，恢复默认分词；短词/双词搜索健康；config 留注释防复踩；正道是换 Pagefind | 给框架根深处功能动手术前，先定止损线；"聪明 hack"失败两次就该停 | ⭐⭐本轮最深 |
| 30 | 搜索测试"第一个查询恒 0，第二个就正常"，多轮误判 | 索引 chunk 1.85MB 懒加载，首个查询打在加载完成前 | 测试前先热身一次查询 | 同一操作两次结果不同 = 有异步在跑，先怀疑时序再怀疑代码 | ⭐经典：异步时序 |
| 31 | 要写复盘时发现 LEARNING.md 已被并行会话重写（未提交） | 多会话并行开发，同一文档被另一会话占用 | **不覆盖别人的工作**：新复盘写独立文件（本文），文首注明接续关系 | 共享工作区里，写公共文档前先 `git status` 看它是否已被占用 | 中 |
| 32 | 大观原文自带死链（`05-工具站与信息流导读.md` 多写一个"站"字） | 原文档写给自己，链接错了没人发现 | **新开的死链闸门当场抓住**——关闭 ignoreDeadLinks 的第一战 | 正面案例：把关机制的价值在"第一次拦截"时兑现 | 正面 |

**如果只记三条**：
1. **验收工具本身会说谎**——headless 假视口（25）、preview 旧清单（26）、索引懒加载（30）：先用两种独立手段交叉验证再下结论。
2. **框架的深层定制有止损线**——搜索三连败换来的边界地图（29）本身就是交付物；"聪明 hack"失败两次，第三次之前先问值不值。
3. **共享工作区里，先看再写**——LEARNING.md 被占用（31）、并行内容混进 dist（v2 坑 23）：多会话协作的一切动作前先 `git status`。

---

## 5. 安全与工程规范检查

**✅ 本轮做对的**：
- 大观上站完整脱敏（校名/公司名/届别/排期零命中后才进 git），**原文件未动**；终扫 grep 成为固定步骤。
- 提交粒度按文件点名（绝不 `git add -A`）——并行会话的未跟踪内容全程零混入。
- 无密钥入库、无 `v-html`、localStorage 操作仍带 try/catch。
- 死链从"豁免"转"把关"：构建即质检（本轮实战拦截 1 条）。

**⚠️ 遗留风险与建议（按优先级）**：
1. **隐私红线靠人肉记忆**（高优先级）：每轮上站人工 grep 校名/手机号/裸 HTML。建议 `scripts/check-privacy.mjs` 挂在 build 前，命中即失败并报文件行号（练习题①）。
2. **未跟踪内容已在构建产物里**：`公众号精选/README.md`、`自学资源/` 5 篇被构建收录（可 URL 直达、已进搜索索引）但 git 未跟踪——**任何一次 `git add -A` 都会把半成品推上线**。等并行会话完成由其提交，或先加 srcExclude。
3. **依赖健康**：本轮并行会话引入 `rss-parser`、`turndown` 依赖。上线前 `npm audit` + `npm outdated`，此后每月一次。
4. **LEARNING/HANDOFF 随站点公开**：内容无隐私，但若介意"给自己的说明书人手一份"可加入 srcExclude。
5. **代理 push 四件套**是一次性参数，换机器要翻记忆——可固化成 `scripts/push.mjs`。

---

## 6. 优化空间与练手方向

### 6.1 如果重写一遍

**性能（Performance）**
- 搜索索引 1.85MB 懒加载可接受；真要提速换 Pagefind（顺带解决整句搜索，一箭双雕）。
- 星空已按屏幕面积控星数 + 后台暂停（本轮已做），合格。
- 中文字体走系统字体栈零成本，保持。

**可维护性（Maintainability）**
- 侧边栏手写 350+ 行：日报归档/未归类组的扫描可脚本化（练习题②）。
- 移动端断点（959/767/767）散在 custom.css 注释里——可在文件头集中声明断点表。
- 坑表已 32 条：新坑入库时同步 HANDOFF 硬规则，防两份文档漂移。

**用户体验（UX）**
- 整句搜索：换 Pagefind。
- 窄屏表格横向滚动无视觉暗示——可给滚动容器加渐隐边。
- 日报 RSS（练习题③）。

### 6.2 练手功能（按难度排序）

**练习题①（入门）：隐私红线自动化**
`scripts/check-privacy.mjs`：遍历将上站的 `.md`，命中校名/手机号模式（`1[3-9]\d{9}`）/裸 HTML/`{&#8288;{` 即 `process.exit(1)` 并打印文件+行号；挂在 `build` 前。练到：Node 文件遍历、正则设计（「均分」会误报「平均分」）、把检查固化进构建（CI 思想）。

**练习题②（进阶）：日报归档侧栏自动化**
config.mts 里读 `每日视野简报/reports/daily/`，按文件名倒序自动生成归档组，新日报零登记。练到：构建期读文件系统、sidebar 动态生成（参考 buildAutoSidebarGroup 套路）。

**练习题③（实战）：RSS 订阅 feed**
构建时读日报标题/日期/链接生成 RSS 2.0 的 `feed.xml` 放进 dist，`<head>` 加 `<link rel="alternate" type="application/rss+xml">`。练到：XML 生成、构建产物注入（参考 sitemap 怎么进 dist 的）、RSS 阅读器实测。

---

## 7. Prompt 复盘

本轮 7 条实质提示词逐条点评：

| # | 提示词（摘要） | 效果 | 分析 |
|---|---|---|---|
| 1 | 开场模板：先读两份文档 + 项目现状 + "你觉得哪里需要优化" + 三条约束 | ✅ 教科书 | 上下文（文档）、目标（开放但带框架）、约束（大改动先方案/验收后 push/硬规则）三件套。**约束写在开场、全程生效**——后续每轮交付都按此执行，用户一次没重复过 |
| 2 | "可以；你觉得这个网站还能怎样扩展" | ✅ 简洁 | 前半句验收确认，后半句开放追问，一句话两件事 |
| 3 | "大观的文档上线网站没？没上线的话上线一下；需要你优化一下手机，平板端的ui界面" | ✅ 有效但两处隐性风险 | ① 两条独立任务合一条消息（本轮侥幸无歧义，仍是要警惕的模式）；② **"大观"是一个词的代指**——赌 AI 能在工作区定位到 `D:\ai资料\大观`。这次猜对，但若同名文档有两个就会返工。**首次提及时给全路径更稳** |
| 4 | "1，2，3都挺好的，我同意了" | ✅ 简洁且零歧义 | 确认覆盖汇报全部分组，push 获得明确授权 |
| 5 | "你可以去看看别的软件的功能，借鉴一下，优化一下本体功能，界面切换，ui等等，需要优化的优化，不需要优化的不优化" | ⚠️ 本轮最需改进 | 详见 7.2 改写示范 |
| 6-7 | "继续" ×N | ✅ 中性 | 打断恢复有效；零信息但方向正确时无害 |

### 7.1 五条通用原则（本轮新增，与前两轮互补）

1. **开放题给"判断权 + 克制信号"**。#5 的救场句"需要优化的优化，不需要优化的不优化"是全条的价值所在——授权 AI 裁量，同时暗示"宁少勿多"（配合项目记忆里的功能膨胀敏感，最终只落地 3 个小优化、拒了一堆可抄的功能）。对比"帮我全面优化"——会得到膨胀清单。
2. **约束写在开场文档里，比口头重复强**。三条约束贯穿全程七次交付；最艰难时刻（搜索三连败）是"不破坏现有功能"这条救的场——回退而不是硬上。
3. **确认要显式覆盖所有分组**。"1，2，3都挺好的"零歧义，前提是上一轮汇报恰好分了①②编号。**AI 汇报主动分组编号 + 用户确认点名分组** = 双向配合出的零歧义协议。
4. **合体消息自检"任务间是否共享上下文"**。#3 的两任务互不依赖、各自可验收，合一条没问题；若表述耦合（"像大观那样优化移动端"）就必须拆开。
5. **开放式授权下，主动止损是 AI 的义务、中途知情是用户的权利**。搜索三连败烧了 10+ 轮构建，止损是 AI 自主决定（依据克制信号），用户事后知情。更理想：**成本超出该子任务全局占比时中途同步**——"这个坑比预想深，继续挖还是先回退？"

### 7.2 最差一条的改写示范

原文：
> 你可以去看看别的软件的功能，借鉴一下，优化一下本体功能，界面切换，ui等等，需要优化的优化，不需要优化的不优化

问题拆解：① "别的软件"无参照物（Vue 官网 / Notion / 微信代表完全不同方向）；② "优化"无维度优先级（性能？好看？好找？）；③ "等等"把范围彻底打开；④ 全条唯一有效的是最后一句克制信号。

改写示范：
> 参考三个标杆：Vue 官网（vuejs.org）、mkdocs-material、Docusaurus 文档站，对比我们的站找差距。方向限定在：文档站标配能力（我们缺的）、移动端体验、加载性能。**不加新内容栏目、不加互动娱乐功能**——定位是资料储藏室。先给一份"建议抄的 / 不建议抄的"清单带理由，我挑了你再动手。

改写后：参照物消除歧义；方向限定砍掉一半无效探索；"先清单后动手"把决策权还给用户——搜索深坑若先有清单确认，大概率会被划掉，省下 10+ 轮构建。

---

## 8. 检验

5 道题：3 道概念 + 2 道动手，覆盖本轮核心知识点。先只出题；把答案发给我，我再逐题批改讲解。允许翻代码、查资料——查得到并能讲明白，也算学会。

### 概念题

**Q1（移动端验收的假象）** 本轮用旧版 `--headless --window-size=390` 截图，看到"所有页面整页横向溢出"，差点据此大修 CSS；换 `--headless=new` 后溢出消失。
(a) 解释两种模式下浏览器处理 `<meta name="viewport" content="width=device-width">` 的差异，为什么旧模式会按桌面宽度排版？
(b) 本轮用哪**两类独立证据**交叉确认"溢出是假象"？（提示：一类是 IAB 里的数值，一类是另一种渲染通道的视觉）
(c) 总结一条"验收工具说什么不算数"的通用原则。

**Q2（死链把关与构建失败）** `ignoreDeadLinks` 从 `true` 改 `false` 后，第一次体检构建 `exit=1`，且 `dist/` 里只剩一个 `logo.svg`。
(a) 为什么"构建失败"会把上一次成功构建的产物也毁掉？从"先清空再写回"的流程角度解释。
(b) 这解释了体检后必须做什么动作？
(c) 大观原文里 `05-工具站与信息流导读.md` 的错误链接（多写一个"站"字）被谁、在什么时机抓住？"关闭豁免"的价值由此体现在哪？

**Q3（动画循环的生命周期）** Starfield 后台暂停实现里，`draw()` 末尾是 `if (running) rafId = requestAnimationFrame(draw)`。
(a) 若去掉 `if (running)`，`stopLoop()` 里的 `cancelAnimationFrame(rafId)` 为什么停不下来？
(b) `startLoop()` 开头的 `if (running) return` 防的是什么？（提示：visibilitychange 可能连发）
(c) 这段代码全在 `onMounted` 里，违反会怎样（引用一个具体坑编号）？

### 动手题

**Q4（把验收固化为把关——移动端溢出检查）** 平板 768px 导航溢出 53px 是"真机测试才发现"的。请设计一个**构建前自动检查**：用 headless Chrome（`--headless=new`）对若干代表页面在 390/768/1280 三个视口下检查 `scrollWidth > clientWidth`，任一溢出退出码非 0。
写出：(1) 脚本关键伪代码（改视口、注入检查、收集结果）；(2) 挂在 package.json 哪个脚本位置；(3) 这个思路和"死链把关"的共同设计模式。

**Q5（触控热区与视觉分离）** 回到顶部按钮用 `::after { inset: -12px }` 扩热区。
(a) 不用伪元素，改用"真放大按钮 + 负 margin 收回视觉"，写出 CSS；
(b) 两种方案各有一个副作用（提示：伪元素共享 hover 区域；负 margin 影响布局计算），分别说明；
(c) 手机端"本页目录"折叠条（`.VPLocalNavOutlineDropdown button`）的修复是 `padding: 10px 12px`——这改的是触控高度还是视觉高度？与 (a) 方案的本质区别？

---

*答题方式：直接在聊天里发答案，我来逐题批改。第 7 节如果你对提示词习惯有不同看法，欢迎反驳——复盘的价值在讨论，不在定论。*
