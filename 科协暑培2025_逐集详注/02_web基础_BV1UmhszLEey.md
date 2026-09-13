# 2025科协暑培 · Web 基础（姚宇辰, BV1UmhszLEey）

## 定位

以"个人名片网页"项目贯穿全讲的 Web 入门讲，覆盖 HTML 骨架、CSS 美化、JS 交互三件套与 GitHub Pages 部署，最后带看真实网页源码与逐行讲解。适合零 Web 基础、想一天内做出并上线第一个网页的同学；有前端经验者只需扫一遍脉络。

## 知识整理

### 三件套的分工：房子比喻

一个网页由三种语言协作：HTML 是骨架，决定"有什么、放哪里"；CSS 是装修，决定"长什么样"；JS 是功能，决定"能做什么"。比作房子：HTML 是墙、门、窗，CSS 负责刷漆加窗帘，JS 则是门铃会响、灯自动亮、窗帘自动开合。课程主线即环境准备 → HTML → CSS → JS → 部署，用一张含姓名、爱好、邮箱、GitHub 链接与"打招呼"按钮的名片页贯穿。环境只需 VS Code 加 Live Server 插件（保存即实时预览），新建 index.html 即可开工。

### HTML：骨架与语法规则

文件以 `<!DOCTYPE html>` 声明 HTML5 标准——必须第一行、前不能有空行（大小写不敏感，惯例大写）；根元素 `<html lang>` 在中文页面建议 `lang="zh-CN"`。页面分两区：head 是用户不可见的配置区，body 是可见内容区。head 三必配：`<meta charset="UTF-8">` 放最前防乱码；viewport 写 `width=device-width, initial-scale=1.0` 控制移动端视口——不写则手机按约 980px 的桌面视口渲染，字小且出现横向滚动；`<title>` 决定标签页与搜索结果标题，不能空着。

语法规则：标签成对闭合、可嵌套不可交叉（`<p><a></a></p>` 对，`<p><a></p></a>` 错）；img/link 是单标签；属性推荐双引号；图片用相对路径，引用上级目录要带文件夹名。常用元素：h1~h6 标题层级、p 段落（自带留白）、section 语义化分区、ul/li 无序列表、img（src + alt 无障碍文本）、form 与 input/button 表单。两个默认行为要记住：浏览器默认给 body 加 8px 外边距（CSS 里常写 `body{margin:0}` 去掉）；`</html>` 之后的内容会被浏览器忽略。

### CSS：清零、布局与细节

写样式先做清场：通用选择器 `*` 清零 margin/padding，并设 `box-sizing:border-box` 让宽高计算直观；font-family 给一串候选字体按顺序回退，保证不同系统都好看。布局是两层技巧：背景用 `linear-gradient(135deg, ...)` 做左上到右下的浅灰蓝-淡紫渐变，配 `100vh` 占满整屏；居中用 `display:flex` + `justify-content`（主轴）/`align-items`（交叉轴）——body 用它整屏居中卡片，导航栏也用 flex 横排加 gap 控制间距。

细节是一套组合拳：卡片固定 340px 宽、圆角 20px、box-shadow 做上浮阴影；头像 120px 正方加 `border-radius:50%` 成正圆、`object-fit:cover` 防拉伸；链接去项目符号与下划线，hover 变深蓝加 0.3s 过渡；输入框做成胶囊大圆角、focus 伪类聚焦变蓝；按钮 `cursor:pointer`、active 时 `transform:scale(0.96)`——transform 走合成层，动画流畅。视频里这段是速查式罗列、后面还会随项目逐行再讲一遍，若你已熟悉这些属性，此节可略。

### JavaScript：两步实现交互

原生 JS 交互就两步：获取元素（`document.getElementById` / `querySelector`，后者返回第一个匹配）+ 事件监听（`addEventListener('click', 回调)`）。打招呼按钮的逻辑四步：读输入框 value 并 `trim()` 去首尾空格；为空时靠逻辑或短路给默认称呼"朋友"；模板字符串拼出问候弹窗，顺带改 `document.title`；再给输入框监听 keydown，回车时程序化调用 `btn.click()`，免鼠标更顺手。几个细节：const 声明只读常量；判回车的 `event.keyCode===13` 是经典写法，正逐渐被可读性更好的 `event.key==='Enter'` 取代；script 放在 `</body>` 前引入，可确保执行时 DOM 已加载。

### 部署上线：GitHub Pages

注册登录 → 新建 public 仓库 → 上传 index.html/style.css/main.js → Settings → Pages → source 选 deploy from a branch 和 main 分支 → 等 30 秒到 2 分钟发布；可用二维码生成器生成链接二维码，手机扫码实测。课后作业即制作并部署自己的名片网页，代码与答案在课程主页。

### 看懂真实网页：开发者工具

最后讲师用清华大学图书馆、网络学堂页面演示 Ctrl+Shift+I 打开开发者工具，在 Elements 里对照检查 img、超链接、input 等元素，鼓励多看真实网页的源码。此节为纯演示浏览、无新语法，若你已会用开发者工具可跳过。

## 编者补充

- 编者补充（跨集联系）：JS 的 DOM 获取与"动态加载"概念正是 03 爬虫讲 [15:08] 所说"HTML 扒下来看不到评论"的原因——浏览器执行 JS 后才插入内容；听完本讲再看爬虫讲的 Selenium 部分会非常顺。
- 编者补充（行动线）：按讲内作业做名片页并部署到 GitHub Pages（约 1-2 小时），是三讲中成本最低的"可展示成果"，可直接挂到个人 GitHub 主页。
- 编者补充（缺口）：本讲未涉及响应式布局（媒体查询）与前端框架，仅静态页 + 原生 JS；想深入需另学。
