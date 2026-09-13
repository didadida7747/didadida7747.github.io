# 2025科协暑培 · 数据库 & SQL（陈毓椿, BV1FgtnzVEXF, 约 145 分钟）

## 定位

前 1/3 讲数据库概念（关系模型、键与冗余、关系型 vs 非关系型），后 2/3 用 PostgreSQL 官方练习场（pgexercises 的真实场馆预订系统）从 CRUD 讲到 JOIN、聚合、GROUP BY/HAVING、CTE 与窗口函数，收尾 ORM 与 SQL 注入。适合跟练；只要实用部分可从 [1:04:51] 直接开始。

## 内容脉络

- [0:01] 开场：应学长建议，教学工具从 MySQL 换成更标准、功能更强的 PostgreSQL（多聚合与窗口机制）；底层原理与 ORM 等间接访问留给后端框架课。
- [3:20] 为什么需要数据库：从文本/CSV 文件到数据库服务器再到数据中心集群；四大优势——高效检索、一致性保障（键约束）、并发与权限控制、事务支持。
- [8:33] 分类：关系型——MySQL（高并发轻量）、PostgreSQL（标准、功能强）、SQLite（单文件非服务器形态）、Oracle；非关系型 NoSQL（not only SQL）——MongoDB（文档型类 JSON）、Redis（键值型做缓存）、列式、图数据库；一致性敏感选关系型，社交/物联网重灵活性选 NoSQL。
- [11:53] 关系模型：行 = record、列 = field；比 Excel 多的关键是"关系"——场馆系统三表（members/bookings/facilities）中 booking 只存 memberid/facid 外键，用时回各表查全信息。
- [17:52] 三种关系：一对一、一对多、多对多——多对多必须加中间表；现场算账：一张大表 100 条 × 8 字段 = 800 格，拆三张表约 490 格，冗余削减即关系数据库基本思想。
- [27:26] 上手准备：Mac brew 装、Ubuntu 先切 postgres 用户；官方文档 3000 页不必通读，边练边查 + 问 AI 交叉验证；主线是官方 exercise（可在线做题带可视化），另提供自制 summer25 学生-课程-成绩练习库脚本。
- [32:44] SQL 四类：DQL（SELECT）、DDL（CREATE/ALTER/DROP）、DML（INSERT/UPDATE/DELETE）、DCL（GRANT/REVOKE）；`SELECT name, age FROM student WHERE age > 18` 说明 SQL 是声明式语言——只描述要什么。⏭️可跳过（对有编程基础者是常识）。
- [35:39] PostgreSQL 语言特性：可交互也可脚本执行；强类型（MySQL 弱类型会把非数字串当 0 相加，PG 直接报错，但 '123'+1 两边都通——有类型推断）；关键字不分大小写，标识符不加双引号自动转小写；单引号=字符串常量、双引号=区分大小写名称，不可混用。
- [40:02] 类型：char/varchar/text、timestamp（可比较可相减得 interval）、布尔、serial 自增（对应 MySQL AUTO_INCREMENT）、UUID；NULL ≠ 0 ≠ 空串，必须 IS NULL 判断，尽量少用（影响查询性能）。
- [45:24] 主键/外键/索引（概念核心）：主键唯一非空，可联合主键（组合唯一即可）；外键保证引用一致性，配 ON DELETE CASCADE/SET NULL 联动；索引加速查询（如查字典先查拼音），代价是略降写入性能。
- [51:10] psql 上手：服务启动；`psql -U 用户 -d 库 -f 脚本.sql` 导入（只需一遍）；`\l` 列库、`\c` 连库、`\dt` 列表、`\d 表` 看结构——反斜杠指令不用分号，SQL 指令必须分号结尾。
- [56:05] 建库建表：CREATE TABLE 写"字段 类型 约束"——讲义中 AUTO_INCREMENT 是去年 MySQL 讲义残留，PG 必须用 serial；ALTER 加删改字段；删外键要先查约束名（约束名/键名/引用目标是三个不同名称）。
- [1:04:51] INSERT：指定字段 + VALUES（多行逗号隔开）；NOT NULL 字段缺值报错；INSERT...SELECT 把查询结果（临时表）直接插入；可用 max(id)+1 带计算插入。
- [1:10:43] UPDATE/DELETE：UPDATE SET 必带 WHERE 否则全表更新；UPDATE...FROM 是 PG 独有非标准扩展；DELETE FROM 删记录不释放磁盘空间（需 VACUUM），TRUNCATE 更快且立刻释放但不删表结构。
- [1:17:03] SELECT：WHERE 比较（= 单等号）与 AND/OR/NOT；IN 元组（本质子查询小表）；LIKE 模糊匹配（% 任意串、_ 单字符）、~ 正则、ILIKE 忽略大小写（讲师现场发现讲义漏写并口头纠正）。
- [1:26:42] CASE WHEN 字段内分支（未覆盖返回 NULL）；timestamp 可比可减；EXTRACT 提取字段、date_trunc 按月截断。
- [1:30:57] DISTINCT 去重（含主键则无意义）；ORDER BY + LIMIT 取极值，通用做法是子查询 max 再 WHERE 相等；UNION 拼接两查询结果（上下拼接、字段对齐）。
- [1:36:37] JOIN（技术重心）：JOIN 本质是按 ON 条件把两表记录逐一比对、满足者并入一张临时新表，后续查询都作用其上；多表 join 有顺序（只能拿上一步的新表继续 join）。LEFT JOIN 左表全保留、右表匹配不上补 NULL；例题含自引用外键 recommendedby。
- [1:54:57] 聚合：count/max/min/avg 把多行坍缩成单值；`SELECT firstname, max(joindate)` 不合法——多值对单值冲突，必须先子查询 max 再 WHERE 相等。
- [1:59:18] GROUP BY/HAVING：按 facid 分组求 SUM(slots)；PG 要求 SELECT 非聚合字段都进 GROUP BY；WHERE 过滤聚合前输入行、HAVING 过滤聚合后结果，先后差别讲得清楚。
- [2:05:03] CTE：WITH...AS 把重复子查询定义成命名临时结果（类比宏），提升可读性，支持 WITH RECURSIVE 迭代。
- [2:08:22] 窗口函数：聚合 + OVER 不坍缩行数（count(*) OVER() 每行带总数）；PARTITION BY 分组保留明细，rank() OVER 排位。
- [2:14:40] ORM 与安全：table↔class、record↔instance；好处——效率高、屏蔽数据库差异（换库改配置即可）、自动校验、防注入。主流：SQLAlchemy/Django ORM、Rust Diesel（链式 filter）、Node TypeORM/Sequelize、mongoose。SQL 注入 = 输入被字符串拼接进语句（' OR '1'='1 恒真绕过验证）；防线：参数化查询、不动态拼接、不信任用户输入、机密信息哈希加密。EXPLAIN ANALYZE 看执行计划。

## 勘误对照

| 转写 | 应为 |
|---|---|
| SQUI/C库/C得苦 | SQL（系统性） |
| 威尔/唯二 | WHERE |
| 芙蓉 | FROM |
| 交易/交印 | JOIN |
| 阴的学位/ALF | INNER JOIN / LEFT JOIN |
| 古鲁拜/黑领 | GROUP BY / HAVING |
| 浪/non/闹了 | NULL |
| 巨额函数 | 聚合函数 |
| 中国/jungle/JUNGLOSS | Django |
| om/阿米 | ORM |
| SKERO曲名/低走 | SQLAlchemy / Diesel |
| type im | TypeORM（存疑） |
| Z口注入 | SQL 注入 |
| TRUNCHUNK/枪口 | TRUNCATE |
| fake id | facid |
| C罗/zero | serial（存疑） |
| jit series | generate_series |
| ground revt | GRANT / REVOKE |
| INTERV | INTERVAL |
| radio/没有for j | Redis / Neo4j |

## 编者补充

- 编者补充（跨集联系）："SELECT/JOIN 生成临时表"的声明式视角与 08 Docker 讲"镜像静态/容器进程"互补；08 的 MySQL 容器+数据卷可直接迁移为本讲 PostgreSQL 练习库的运行环境；07 的 SSH/权限是本讲"基于服务的用户访问控制"的落地前提。
- 编者补充（行动线）：注册 pgexercises 跟做（讲师全程用它），本讲时间戳可当题型索引——LIKE 看 [1:22:48]、JOIN 看 [1:40:26]、GROUP BY/HAVING 看 [1:59:18]、窗口函数看 [2:08:22]；再用 Docker 起 PG 导入 summer25 库，一并练 08、09。
- 编者补充（缺口）：事务/ACID 仅开头一句带过；窗口函数未提 row_number/lead/lag；索引底层结构（B 树）明确留给数据库系统概论课。
