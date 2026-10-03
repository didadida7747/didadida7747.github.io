# 2025科协暑培 · Rust（陈毓椿, BV1uitpzNE5L）

## 定位

语言基础一讲：从环境搭建（rustup/cargo/rustlings）讲到所有权、借用、trait、match 等核心概念，目标是能看懂 Rust 代码、能写基本算法题。讲义大量复用官方文档，假定有 C/C++ 基础；所有权一节是本讲核心，值得精看。

## 知识整理

### 语言定位、环境与工具链

Rust 是注重安全、并发、性能的系统级语言：靠所有权/借用/生命周期在编译期避免 C 的内存问题。历史一句话：2006 年 Graydon Hoare 个人项目→2009 Mozilla 赞助→2015 年 1.0→2021 Rust 基金会→2022 年底成为 Linux 内核除 C/汇编外第一个支持的语言；操作系统课可选 Rust 方案 rCore。环境：rustup 一路回车装好工具链，rustc --version 验证；编辑器用 VSCode/CLion/RustRover 配 rust-analyzer 插件——把编译检查实时跑在编辑器里，自动补全推断类型、提前报错；rust playground 在线环境与本地一致。工作流以 cargo 为中心：cargo new 生成 src/ 与 Cargo.toml，build/run，--release 更高效，cargo fmt 一键统一风格。入门练习推荐 rustlings（20 多个主题）——顺便见识 Rust 报错之详尽：告诉你错在哪，help 教你怎么改。资料：官方教程 The Rust Programming Language（中文社区称"圣经"，有中文版）作第一阅读，Rust by Example 例子驱动，docs.rs 查 std 与第三方库，Effective Rust 进阶。

### 所有权与借用（本讲核心）

铺垫一个观念：值是内存上一串字节，变量只是名字。C 指针可产生多别名与悬垂指针，项目一大必出内存错。Rust 的答案是三条规则：每个值有唯一所有者；所有者失效值即释放；let 是绑定，赋给新变量默认 move，被移走的变量在编译期禁用。move 是编译语义、不搬运行时数据——同样的 double free 在 C/C++ 要运行时才暴露。基础类型默认 Copy，复杂类型 .clone() 显式拷贝。

借用是"只借不夺权"的 & 引用：借用存在期间原值不能转移；引用分可变/不可变，多个不可变引用或一个可变引用二选一。函数参数同理——传 String 默认被拿走，保留需 &，可变需 mut。

### 类型系统与"一切皆表达式"

静态强类型+推断；变量默认不可变（mut 声明）；const 编译期确定且必须标类型，与 C 的 const（只读变量）定位不同；同名 let 重绑定（变量遮蔽）适合临时复用名字。类型速览：i8–i128/u8–u128 默认 i32；isize/usize 随平台字长、数组下标用 usize；f32/f64 默认 f64；char 为 Unicode、支持表情；元组可解构（_ 通配）；数组 [T; N]，可 [0; 100] 初始化；Vec 越界立即退出而非未定义行为。

单元类型 () 是无返回值函数的默认返回；"一切皆表达式"——不加分号的表达式就是返回值：if 可直接给 let 赋值，loop 用 break 带出返回值（讲师现场跑"收敛到 1"的数论例子），'label 跳出多层循环；fn 箭头后标返回类型。

### 枚举、match 与错误处理

枚举变体可无数据、带命名字段或带类型元组。标准库两个最重要的泛型枚举：`Option<T>`（None/Some，表达"可能没有"）与 `Result<T, E>`（Ok/Err，表达"可能失败"）。match 强制穷尽所有分支——漏一个编译不过——与枚举组合捕获 Ok/Err 正合适；if let 是单值轻量匹配。迭代器链把值包进 Result/Option，拆包可用 match/if let，偷懒用 unwrap/expect——失败即 panic（类似 C 的 assert 且带回溯行号）。

### struct、trait 与泛型：组合优于继承

struct 对应 C++ class（Rust 无类概念、保留结构体）；impl 块写方法，new 即构造函数；跨文件可见性靠 pub。继承在这里被 trait 取代：讲师用"企鹅不会飞、蝙蝠非鸟"的继承树反例说明"组合优先于继承"——把"能飞/能叫"拆成 trait，impl Trait for Cat/Dog 逐个拼装；函数参数可限定"实现某 trait"；derive 宏一键实现 Debug/Clone/PartialEq 等。泛型给函数/枚举/结构体加尖括号即可，impl 开头声明泛型存在。

### 模块化与工程实践

一个文件一个 mod，use 引入；大型项目 use 很多，功能上类比 Python import/C include。测试用 #[test] 标注加 cargo test（小学期 OA 的测试文件夹即此思路）；unsafe 把裸指针等危险操作的安全责任转交开发者；闭包作参数可大幅压缩代码。无裸指针时递归类型无法确定大小，需 Box 装箱——但讲师极度不建议用 Rust 写指针式链/树（"非常痛苦"），建议数组模拟；入门写题先不碰智能指针（Box/Rc/RefCell）。

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
