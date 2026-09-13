# 2025科协暑培 · Web 基础（姚宇辰, BV1UmhszLEey, 约 43 分钟）

## 定位

以"个人名片网页"项目贯穿全讲的 Web 入门讲，覆盖 HTML 骨架、CSS 美化、JS 交互三件套与 GitHub Pages 部署，最后带看真实网页源码与逐行讲解。适合零 Web 基础、想一天内做出并上线第一个网页的同学；有前端经验者只需扫一遍脉络。

## 内容脉络

- [00:08] 课程结构：环境准备 → HTML → CSS → JavaScript → GitHub Pages 部署，以个人名片网页（姓名、爱好、邮箱、GitHub、打招呼按钮）贯穿始终。
- [00:37] 三者角色比喻：HTML 是骨架（决定"有什么、放哪里"），CSS 是装修（决定"长什么样"），JS 是功能（决定"能做什么"）；房子比喻——HTML 是墙门窗，CSS 是刷漆加窗帘，JS 是门铃响灯自动窗帘。
- [02:33] 环境准备：新建文件夹，VS Code 打开，安装 Live Server 插件实时预览；新建 index.html。
- [03:01] HTML 骨架：`<!DOCTYPE html>` 声明 HTML5 标准（必须第一行、前不能有空行、大小写不敏感但惯例大写）；`<html lang>` 根元素，中文页面建议 `lang="zh-CN"`。
- [03:58] head 配置区：对用户不可见但浏览器必需；`<meta charset="UTF-8">` 必须放 head 最前防乱码；viewport 声明控制移动端视口，`width=device-width, initial-scale=1.0` 不写则手机默认桌面缩放出现小字与横向滚动；`<title>` 标签页与搜索结果标题，不能空着。
- [05:51] body 可见区：浏览器默认给 body 加 8px 外边距（CSS 里常写 body{margin:0} 去掉）；结束标签必须成对，`</html>` 后的内容被忽略；标签可嵌套不可交叉（`<p><a></a></p>` 对，`<p><a></p></a>` 错）；img/link 是单标签；属性推荐双引号；图片用相对路径，上级目录加文件夹名。
- [09:10] HTML 语法系统整理：文档声明、meta 编码与 viewport、title、语义化分区 section、img 单标签（src + alt 无障碍文本）、h1~h6 标题层级、p 段落自动留白、ul/li 无序列表、form 表单与 input/button。与前面重复，⏭️可跳过（同一内容的速查表式复述）。
- [11:07] CSS 基础：通用选择器 `*` 清零 margin/padding 并设 box-sizing:border-box 让宽高计算直观；font-family 给出一串候选字体按顺序回退，保证不同系统都好看。
- [13:00] 背景与布局：`linear-gradient(135deg, ...)` 线性渐变（浅灰蓝到淡紫）；`display:flex` + `justify-content`/`align-items` 实现水平垂直居中；body flex 整屏居中，导航用 flex 横排 + gap 控制间距。
- [14:31] 其余常用样式速览：border-radius 圆角、box-shadow 阴影做按钮；list-style 去项目符号；a 去下划线加颜色过渡；input 的 padding/border/outline；button 的 background、cursor:pointer。速查性质，⏭️可跳过（后面 32:34 起会逐行再讲一遍）。
- [16:01] JS 交互两步：获取元素（document.getElementById / querySelector 返回第一个匹配）+ 事件监听（addEventListener 绑定 click/keydown 回调）。
- [17:43] 打招呼逻辑四步：读输入框值并用 trim() 去首尾空格；空则默认称呼"朋友"（逻辑或短路）；模板字符串拼问候弹窗；同时改 document.title；输入框 keydown 监听回车触发按钮 click，免鼠标更顺手。
- [18:40] GitHub Pages 部署：注册登录 → 新建 public 仓库 → 上传 index.html/style.css/main.js → Settings → Pages → source 选 deploy from a branch + main 分支 → 等 30 秒~2 分钟发布；可用二维码生成器手机扫码测试。
- [20:04] 速查表与作业：HTML/CSS/JS 常用标签属性属性一览；作业是制作并部署自己的名片网页，代码与答案在课程主页。
- [21:24] 实战看网页源码：清华大学图书馆、网络学堂页面 Ctrl+Shift+I 打开开发者工具，对照检查 element 里的 img、超链接、input 等；鼓励多看其他网页。与目标读者常识重复度高，⏭️可跳过（纯演示浏览，无新语法）。
- [24:18] 逐行过 HTML：DOCTYPE、lang、head 内编码与 viewport（不写则手机以 980px 视口渲染导致页面缩小）、title、外链样式表；body 内 section 卡片、img 头像、h1 姓名、p 简介、ul 导航、form 表单（button 类型不触发提交）、`</body>` 前外链 JS 确保 DOM 已加载。与前面重复，⏭️可跳过（项目代码的第三遍讲解）。
- [28:46] 逐行过 JS：const 声明只读常量；getElementById 拿按钮与输入框节点；addEventListener('click', 匿名回调)；value.trim() 防纯空格；逻辑或给默认值；模板字符串占位符；`event.keyCode===13` 判回车是经典写法，现已逐渐被 `event.key==='Enter'` 取代（可读性更高）；`btn.click()` 程序化点击。
- [32:34] 逐行过 CSS：`*` 清零外边距内边距 + border-box；body 渐变背景 135deg 左上到右下、100vh 整屏高、flex 两轴居中；.card 固定 340px 宽、圆角 20px、box-shadow(0 8px 30px rgba(0,0,0,.12)) 上浮阴影；.card img 120px 正方 + border-radius 50% 成正圆 + object-fit:cover 防拉伸；导航去点横排 gap；a 半粗体与 hover 深蓝过渡 0.3s；input 胶囊形大圆角、focus 伪类聚焦变蓝；button cursor:pointer、hover 深蓝、active 缩到 96%——transform 走合成层动画流畅。想抄样式设计时再看。
- [43:08] 成品演示与收尾：点击按钮弹"hello 朋友"；课程主页有讲义与作业答案。

## 编者补充

- 编者补充（跨集联系）：JS 的 DOM 获取与"动态加载"概念正是 03 爬虫讲 [15:08] 所说"HTML 扒下来看不到评论"的原因——浏览器执行 JS 后才插入内容；听完本讲再看爬虫讲的 Selenium 部分会非常顺。
- 编者补充（行动线）：按讲内作业做名片页并部署到 GitHub Pages（约 1-2 小时），是三讲中成本最低的"可展示成果"，可直接挂到个人 GitHub 主页。
- 编者补充（缺口）：本讲未涉及响应式布局（媒体查询）与前端框架，仅静态页 + 原生 JS；想深入需另学。
