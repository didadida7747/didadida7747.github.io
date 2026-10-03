# 2025科协暑培 · Java 基础（康嘉成, BV1gXbzzHE97）

## 定位

面向 C++/Python 背景同学的 Java 速成：环境（IDEA+Gradle+JDK21）→基本语法→面向对象→异常→常用标准库→线程入门，附三道代码填空作业。讲师自述一年未以 Java 为主力语言、细节或有不准。

## 知识整理

### 环境与语言印象

一次编写到处运行、完全面向对象。装 JDK（推荐 21），IDE 用 IDEA（学生认证免费专业版），项目用 Gradle 构建；IDEA 新建项目的逐步点击可跳过。

### 基本语法与类型系统

三种注释，其中文档注释可用 javadoc 生成 API 文档（软工会用）；main 方法是入口；package 对应目录结构且必须是源文件第一条语句，import 导入其他包（同包不必导，星号通配全部）。基本类型：四种整型（byte 一字节、-128~127，与后文缓存池呼应）；float 字面量须加 F、long 须加 L（int/double 是默认类型，不加编译不过）；boolean 全小写（区别 C 的 bool）；char 占 16 位、可表汉字等 Unicode 字符。引用类型不存数据本身、存地址：数组推荐 int[] a 写法（C 风格会有 warning），数组也是对象、有 .length；类、接口、枚举都是引用类型。String 不可变，+ 拼接是创建新对象；== 比地址、equals 比内容；可变场景选 StringBuilder（非线程安全、快）或 StringBuffer（线程安全、慢）。运算符与 C++ 基本相同，重点是 >> 算术右移（高位补符号位、负数保号）与 >>> 逻辑右移（高位恒补 0、负数得大正数），补码计组会系统讲。输出 print/println/printf 同 C；输入 new Scanner 后 nextInt/nextDouble 各取所需，类型不符抛 InputMismatchException。控制语句与 C++ 逐字相同，没啥好讲。

### 面向对象

所有代码必须在类中；每个 .java 文件恰好一个与文件同名的 public 类。垃圾回收管内存、无指针、传参只有传值；不写构造函数默认给无参构造，无析构函数（finalize 已废弃）；构造参数与成员同名用 this. 区分；修饰符规则看表不必背。static 成员属于类本身、内存只有一份、实例共享（计数器例子），静态方法不能访问非静态成员；类内大括号代码块在构造函数前自动执行（冷门）。final≈C++ const，与 static 搭配定义全大写常量，final 方法禁止子类重写。组合（一个类的对象作成员变量，如车有引擎）讲师说实际价值不大；extends 继承、子类构造用 super 调父类（类比 Python）、可重写方法。更地道的做法：Animal 这种"现实里没有实例"的概念应实现为 abstract 抽象类——不能实例化，抽象方法无方法体、必须子类实现，≈C++ 纯虚函数。接口 interface 定义方法签名，implements 的实现类必须实现全部方法；Java 类只能单继承，为避免菱形问题（A 的方法经 B、C 两条路径到 D 产生二义）；接口可多实现，同名方法由实现类提供唯一实现、故无二义。

### 异常处理

连报错都是对象。异常分 Error（严重，不建议处理）与 Exception；后者分受检异常（编译期强制处理，如文件读写）与非受检 RuntimeException（空指针/越界等，不处理交 JVM 终止——OJ 上 RE 常客，讲师顺带建议别用指针手写数据结构）。处理方式：try-catch 捕获，或方法签名 throws 抛给上层，层层甩锅到 main 仍无人接则终止；finally 必执行；throw 抛具体对象 vs throws 声明类型要区分；可自定义异常继承 Exception。

### 常用标准库与集合

Math 求根随机数等；BigInteger/BigDecimal 任意精度（C++ 高精度需字符串模拟，Python 天生支持）。Arrays 工具类 sort/equals/binarySearch（先排序才能二分）。ArrayList 泛型动态数组：add/remove/contains，排序借 Collections.sort。LinkedList 双向链表已实现好（对比 DSA 课 OJ 上 C++ 手写链表的指针地狱）：插入删除优于 ArrayList、头尾操作最优，且实现了 Deque 接口、可模拟栈与队列。HashMap 存键值映射（≈C++ map、Python dict）：键唯一值可重复、重复 put 覆盖、遍历用 keySet；HashSet 不重复、加重复返回 false——ArrayList 转 HashSet 去重是讲师点名要记的应用。所有类的基类 Object：toString 默认输出类名@哈希码、通常重写；equals 比内容、通常重写；且 equals 相等则 hashCode 必须相等。基本类型不是对象，包装类（int→Integer 等）使其可参与集合泛型；valueOf 转包装对象、parseXxx 解析基本类型；缓存池 -128~127 返回同一对象（127 比较为 true、128 为 false）；泛型只能写 Integer 不能写 int；自动装箱/拆箱即隐式类型转换。

### 线程入门

创建两法——继承 Thread 或实现 Runnable 接口（讲师偏好后者）；五状态：新建/就绪/运行/阻塞/死亡；start 启动（run 别直接调）、sleep、join、yield、isAlive。两线程交替输出且顺序每次不同，直观演示调度不确定性。作业为三道代码填空（数组/字符串/线程各一），补全 TODO 的 begin/end 之间，数据规模小、无复杂度要求，克隆仓库跑测试脚本、每题 10 个样例。

## 勘误对照（本集新发现）

| 转写 | 应为 |
|---|---|
| 议程/异程/术前议程/触检一程 | 异常/受检异常 |
| 鸡肋 | 基类（53:34 Object 类是所有类的基类） |
| LT | length（10:35 数组属性） |
| DECUTE | Deque |
| zero 关键字 | throw 关键字 |
| 移动/洞 | long（定义加 L 处） |
| unit后 | Unicode |
| 艾瑞斯/ARRELEAST/A relift | Arrays/ArrayList |
| 记机盖 | 计组（存疑） |
| 分数异常 | 算术异常（存疑） |

## 编者补充

- 编者补充（跨集联系）：String 不可变与 == 比地址、equals 比内容，可与《04_JS》的字符串不可变及 ==/=== 判等对照理解——两讲都在纠正值直觉误判。
- 编者补充（行动线）：目标若是下学期软工/OOP，优先精看 [20:43–34:24]（面向对象+异常）与 [1:02:54] 线程段（作业第 3 题前置）；集合框架 [41:32–53:04] 信息密度低，当查询材料按需回看。
- 编者补充（缺口）：线程只讲到创建与状态，锁/synchronized 未涉及；泛型仅在集合处顺带一提，与《05_TS》的完整泛型系统反差明显；合集内也没有数据结构一讲承接讲师手写链表/指针的提醒。
