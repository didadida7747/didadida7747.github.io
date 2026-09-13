# 2025科协暑培 · Rust（陈毓椿, BV1uitpzNE5L, 约 130 分钟）

## 定位
语言基础一讲：从环境搭建（rustup/cargo/rustlings）讲到所有权、借用、trait、match 等核心概念，目标是能看懂 Rust 代码、能写基本算法题。讲义大量复用官方文档，假定有 C/C++ 基础；所有权一节是本讲核心，值得精看。

## 内容脉络

- [05:08] 讲义大部分搬运 Rust 官方文档与科协自维护文档；课程主页部署在 GitHub，慢就多刷新。
- [07:04] 讲师背景：大一暑假"程序设计训练"课韩老师的 Rust 课堂入门；自述不以 Rust 为工作语言，现讲现复习。⏭️可跳过：个人闲聊。
- [08:00] Rust 定位：注重安全、并发、性能的系统级语言；历史速览——2006 年 Graydon Hoare 个人项目→2009 Mozilla 赞助→2015 年 1.0→2021 Rust 基金会→2022 年底成为 Linux 内核除 C/汇编外第一个支持的语言。
- [09:53] 以所有权/借用/生命周期在编译期避免 C 的内存问题；操作系统课可选 Rust 方案 rCore（转写"阿CORE"）；cargo 是依赖与项目管理首选。
- [12:18] 学习资料：官方教程 The Rust Programming Language（中文社区称"圣经"，有中文版）作第一阅读；Rust by Example 例子驱动；docs.rs 查 std 与第三方库；Effective Rust 进阶（韩老师课上推荐）。
- [14:40] 环境：VSCode/CLion/RustRover + rust-analyzer 插件——把编译检查实时跑在编辑器里，自动补全推断类型、提前报错；rust playground 在线环境与本地一致。
- [19:28] rustup 一路回车装好工具链，rustc --version 验证；单文件可直接 rustc 编译运行。
- [21:24] cargo 工作流：cargo new 生成 src/ 与 Cargo.toml；build/run；--release 更高效；cargo fmt 一键统一风格。⏭️可跳过：演示琐碎，记命令即可。
- [25:13] rustlings 入门练习题（20 多个主题），现场按编译器提示修通 intro1——借机展示 Rust 报错极详尽：告诉你错在哪、help 教你怎么改。
- [32:52] 所有权铺垫（引 ZHC 学长讲义）：值是内存上一串字节，变量只是名字；C 指针可产生多别名与悬垂指针，项目一大必出内存错。
- [36:13] 所有权规则：每个值有唯一所有者；所有者失效值即释放；let 是绑定，赋给新变量默认 move，被移走的变量编译期禁用（现场演示报错）；基础类型默认 Copy，复杂类型 .clone() 显式拷贝。
- [42:23] move 是编译语义不搬运行时数据；同样的 double free 在 C/C++ 要运行时才暴露。
- [43:19] 借用：&引用"只借不夺权"，借用存在期间原值不能转移；引用分可变/不可变，多个不可变引用或一个可变引用二选一；函数参数同理——传 String 默认被拿走，保留需 &，可变需 mut。
- [54:23] 类型系统：静态强类型+推断；变量默认不可变（mut 声明）；const 编译期确定且必须标类型，与 C 的 const（只读变量）定位不同；变量遮蔽（同名 let 重绑定）适合临时复用名字。
- [1:01:30] 类型速览：i8–i128/u8–u128 默认 i32；isize/usize 随平台字长、数组下标用 usize；f32/f64 默认 f64；char 为 Unicode 支持表情；元组解构（_ 通配）；数组 [T; N] 与 [0; 100]；Vec 越界立即退出而非未定义行为。
- [1:10:43] 单元类型 ()：无返回值函数默认返回它；"一切皆表达式"——不加分号的表达式就是返回值。
- [1:13:39] if/for/while/loop 都是表达式：if 可直接给 let 赋值；loop 用 break 带出返回值（现场跑"收敛到 1"数论例子）；'label 跳出多层循环；fn 箭头后标返回类型。
- [1:21:23] 枚举变体可无数据/带命名字段/带类型元组，可与 Result 组合用 match 捕获 Ok/Err；match 强制穷尽所有分支（漏一个编译不过）；if let 是单值轻量匹配。
- [1:28:35] struct 对应 C++ class（无类概念、保留结构体）；impl 块写方法，new 即构造函数；跨文件可见性靠 pub。
- [1:31:59] "组合优先于继承"：企鹅不会飞、蝙蝠非鸟的继承树反例→把"能飞/能叫"拆成 trait，impl Trait for Cat/Dog 逐个拼装；函数参数可限定"实现某 trait"；derive 宏一键实现 Debug/Clone/PartialEq 等。
- [1:39:12] 泛型：函数/枚举/结构体加尖括号，impl 开头声明泛型存在；重点讲 Option`<T>`（None/Some）与 Result`<T, E>`（Ok/Err）两个标准枚举及示例。
- [1:47:03] 迭代器链把值包进 Result/Option，拆包可用 match/if let，偷懒用 unwrap/expect——失败即 panic（类似 C 的 assert 且带回溯行号）；现场演示对 None unwrap 直接 panic。
- [1:55:43] 模块化：一个文件一个 mod，use 引入；展示讲师的表达式解析器项目；大型项目 use 很多，功能类比 Python import/C include；顺带提到 actix web 框架与 unused 变量警告。
- [1:58:31] 智能指针 Box/Rc/RefCell：无裸指针导致递归类型无法确定大小，需 Box 装箱；讲师极度不建议用 Rust 写指针式链/树（"非常痛苦"），建议数组模拟。⏭️可跳过：入门写题先不碰智能指针。
- [2:01:46] #[test] 与 cargo test（小学期 OA 的测试文件夹即此思路）；unsafe 把裸指针等危险操作的安全责任转交开发者；闭包作参数可大幅压缩代码。

## 勘误对照

| 转写 | 应为 |
|---|---|
| MAZDA/MOZA/monza research | Mozilla |
| Grain graden horn | Graydon Hoare |
| cheat/chat（多处） | trait |
| on rap/UNRAP/暗WAP/olive | unwrap |
| inflate | if let |
| B包 | 闭包（closure） |
| 阿CORE | rCore（存疑） |
| 剑网 | 借用 |
| long/sun（Option 处） | None/Some |
| K（result 的 K 和 error） | Ok |
| ITIACTI | actix（存疑） |
| 玄学指针 | 悬垂指针 |
| rust DOVER/rust allider | RustRover / rust-analyzer（视上下文） |

## 编者补充

- 编者补充（跨集联系）：cargo test 与 django 讲的 TestCase 同属"框架自带测试工具链"；讲师两次提到小学期 OA 项目及其测试文件夹，可与暑培后续项目作业衔接。
- 编者补充（行动线）：装 rustup→cargo new 起项目→刷完 rustlings→通读"the book"中文版→进阶 Effective Rust；想写操作系统可提前看 rCore。
- 编者补充（缺口）：String/&str 与生命周期标注未系统展开（讲师预告讲字符串但后文未兑现）；智能指针、多线程、宏、async 均仅点名带过。
