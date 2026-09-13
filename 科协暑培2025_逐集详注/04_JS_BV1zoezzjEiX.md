# 2025科协暑培 · JavaScript 入门（于越洋, BV1zoezzjEiX, 约2小时01分）

## 定位
本讲是"JS+TS"双语言课的 JS 半场，从浏览器控制台零环境起步，覆盖基本类型、对象、函数、闭包、this，最后落到事件循环、Promise 与 async/await。适合会 C/Python、看过 web基础 的同学作为写前端前的语言关。

## 内容脉络
- [00:00–03:46] 定位与环境：JS 负责网页动态性（HTML/CSS 只管静态）；环境就是浏览器——开发者工具的控制台内置 JS 引擎，可直接交互运行。讲义源自钱厚德学长。
- [03:46–07:15] 变量与弱类型：var/let/const 三种声明，推荐 let/const，未声明直接用等于隐式 var（不推荐）；弱类型，变量可随时改存其他类型的值，与 C++ 声明定死类型相反。⏭️可跳过：动态类型与 Python 一致，听一句对比即可。
- [07:15–11:03] 基本类型与判等：七种基本类型；typeof 查类型；== 做类型转换（1==true 为 true），=== 不转换、更常用；number 统一按浮点处理，5/2=2.5，整数运算只在 MAX_SAFE_INTEGER 内安全。
- [11:03–17:45] Math 与特殊数：Math.floor/ceil/sin/PI；0.1+0.2≠0.3 是浮点通病；NaN 来自非法运算，与任何值比较皆 false（NaN≠NaN），判断须用 isNaN（先强制转换，"2.3"可转故 false）；Infinity 满足 1/0=+∞、∞-∞=NaN、∞ 等于自身。
- [17:45–25:22] 字符串：单双引号等价但须配对、整段统一；字符串不可变（同 Python）；+ 拼接，"4"+3 得 "43"，空串+数字可快速转字符串；charAt/replace/indexOf/substring；模板字符串用反引号配 ${} 内嵌表达式；parseInt 可指定进制，解析到不能转为止（"1243abc"→1243），失败得 NaN。
- [25:22–27:15] BigInt 与 Symbol：BigInt 字面量尾加 n，突破 number 精度上限；Symbol 每次构造都唯一且可哈希，与 number/string 同为仅有的三种可作对象键的类型。
- [27:15–35:08] 对象与数组：对象≈Python dict，点或中括号访问，含空格的键只能中括号；const 对象是"指向不可换、属性可改"（现场演示）；数组可混类型，length=最大索引+1（a[100]=2 后为 101，空洞是 undefined）；indexOf/slice/join。⏭️可跳过：会 dict/list 的话，只需听 const 对象与 length 两个特有点。
- [35:08–37:57] 内置对象：正则两条斜杠字面量；Date 转当地时间演示；Set 去重；JSON 序列化/解析；console.log/error。
- [37:57–41:17] 展开语法：... 即解包，{...obj} 是新对象；两对象同展开时后名覆盖前名；数组不展开会嵌套、展开则拼接；函数调用中实参展开为多个参数。
- [41:17–45:58] 解构赋值：一行交换（C 要三行临时变量）；...rest 收集剩余；可忽略项、重命名、嵌套。
- [45:58–50:46] undefined vs null 与可选链：undefined=不存在（越界、不存在的属性、无返回值函数），null=存在但为空（React 里表示不渲染）；对 undefined 取属性必报错，典型是 response.data.xxx 断链——用 ?. 可选链让整句返回 undefined 而不报错。
- [50:46–54:33] 控制语句：if/switch/for 与 C++ 同构；for-in 遍历索引，数组更推荐 forEach/for-of；条件判断强转：undefined/null/0/NaN/空串/false 均假、其余皆真，注意 new Boolean(false) 是对象、转布尔为 true。⏭️可跳过：与 C 同构，只听"假值列表"。
- [54:33–58:00] 分号陷阱：不强制但建议加分号——let g=f 换行写 (a) 会被并成调用 f(a)；return 单独成行返回 undefined，{ 必须跟 return 同行；行首大括号解构语句有歧义，需包小括号。
- [58:00–1:07:26] 函数与变量提升：实参个数不检查（缺参运算出 NaN，多参丢弃）；...rest 实现任意参数求和；函数可赋给变量（比 C 函数指针更直接）；var 声明提升到函数顶而赋值不提升，故"先打印后声明"得 undefined；函数声明整体提升、函数变量不提升；let/const 块作用域无这些坑。
- [1:07:26–1:11:00] 箭头函数：参数=>返回值的多级简写，单参数可省括号；返回对象字面量要再包一层括号，否则大括号被解析成代码块。
- [1:11:00–1:19:08] 回调函数（讲师称 JS 灵魂）：把"操作"抽象成函数传参，calculate(x,y,op) 对比 C 的 switch 分发写法；forEach/map 都收回调，map 可链式组成"预处理→筛选→排序"流水线；setTimeout 一次性、setInterval 周期性，延迟因消息队列排队略不准，多数场景无碍。
- [1:20:35–1:23:53] 闭包：函数返回函数、把参数按引用包进环境（加法器例子）；陷阱——var 循环里三个闭包共享同一 i 全输出 9，改用 let 即修复。
- [1:23:53–1:33:06] OOP 与 this：讲师明言 JS 面向对象用得少且是原型链机制（本讲跳过）；成员必须 this. 访问，无 private/public/protected；this 永远指向最近的调用者（裸调用→window，obj.f()→obj）；call/apply 手动指定、bind 永久绑定；箭头函数自身无 this，保存定义时的 this（相当于定义即 bind）；object.bar() 与 bar=object.bar 再调用输出不同的对比。
- [1:33:06–1:40:43] 异步与事件循环：网络请求动辄数秒，同步等待会白屏；JS 单线程，靠事件循环+消息队列实现异步——异步完成后回调入队，事件循环空闲时取出执行；setTimeout 演示不等待。
- [1:40:43–1:44:28] 回调地狱：依赖链式请求（用户名→用户 id→手机号→详情）层层嵌套，再叠 try-catch 后几乎不可读。
- [1:44:28–1:52:06] Promise：构造函数收 (resolve,reject)，成功/失败各走其一，替代层层 try-catch；then/catch 都返回新 Promise 可无限链，上个 then 的返回值传给下个；Promise.all 等全部完成再统一拿结果数组；Promise 创建即派遣且不可取消，写完 then 链≠已执行完（打印 i 仍为 1 的例子）。
- [1:52:06–2:00:13] async/await：async 函数返回值自动包装成 Promise；await 阻塞本行直至完成，失败且未接 catch 回调则报 uncaught failure；把回调地狱改写成顺序风格；但 await 会"异步传染"——所在函数必须标 async、层层外扩；无依赖的请求别用 await 串行，应保持 Promise 并行，按真实依赖选写法。
- [2:00:13–2:01:00] 未讲部分：原型链与浏览器中的 JS 留给讲义；预告下半场 TypeScript。

## 编者补充
- 编者补充（跨集联系）：结尾预告的"第二部分 TS"即《05_TS》一集，两集连看才是完整 JS/TS 线；开头"前端三件套"出自合集《web基础》讲。
- 编者补充（行动线）：事件循环→Promise→async/await 这条链是《django》与《爬虫》的前置心智模型，时间紧建议精看 [1:33:06] 至结尾。
- 编者补充（缺口）：讲师跳过的内容（数据安全、提升顺序规则、原型链、浏览器内置对象）只在钱厚德学长讲义中，视频未给讲义链接，单看视频这些主题缺失。

## 勘误对照（本集新发现）
| 转写 | 应为 |
|---|---|
| GSTS | JS/TS |
| max sainteger | MAX_SAFE_INTEGER |
| B包 | 闭包 |
| list | this（1:24:51 起讲类成员访问处） |
| band/ban | bind |
| 回到地狱/回到地域 | 回调地狱 |
| anna find/antifine/ANDEFINED | undefined |
| to local stream | toLocaleString |
| week tape/week type | 演示变量名（存疑） |
