# 2025科协暑培 · 数据库 & SQL（陈毓椿, BV1FgtnzVEXF）

## 定位

前 1/3 讲数据库概念（关系模型、键与冗余、关系型 vs 非关系型），后 2/3 用 PostgreSQL 官方练习场 pgexercises（真实场馆预订系统）从 CRUD 讲到 JOIN、聚合、GROUP BY/HAVING、CTE 与窗口函数，收尾 ORM 与 SQL 注入。适合跟练；只想要实用部分的读者可直接从"CRUD 实操要点"一节开始。

## 知识整理

### 为什么需要数据库，以及选型

从文本/CSV 文件到数据库服务器再到数据中心集群，数据规模每上一级，就越需要数据库的四大能力：高效检索、一致性保障（键约束）、并发与权限控制、事务支持。关系型有 MySQL（高并发、轻量）、PostgreSQL（标准、功能强，本课所选）、SQLite（单文件、非服务器形态）、Oracle；非关系型 NoSQL（not only SQL）有 MongoDB（文档型、类 JSON）、Redis（键值型做缓存）、列式与图数据库。一致性敏感的业务选关系型，社交/物联网等重灵活性的场景选 NoSQL。

### 关系模型：拆表去冗余

关系型数据库里行是 record、列是 field，比 Excel 多出来的关键是"关系"。以场馆预订系统三表 members/bookings/facilities 为例：booking 只存 memberid/facid 两个外键，用时再回各表查全信息。表间关系分一对一、一对多、多对多三种，多对多必须加中间表。讲师现场算了笔账：一张 100 行 × 8 字段的大表是 800 格，拆成三张表约 490 格——削减冗余正是关系数据库的基本思想。围绕键：主键唯一非空（可联合主键，组合唯一即可）；外键保证引用一致性，可配 ON DELETE CASCADE/SET NULL 联动；索引加速查询（如查字典先查拼音），代价是略降写入性能。

### PostgreSQL 语言特性与上手

教学工具按学长建议从 MySQL 换成更标准、功能更强的 PostgreSQL（多聚合与窗口机制）；官方文档 3000 页不必通读，边练边查加问 AI 交叉验证即可。语言特性：可交互也可脚本执行；强类型（MySQL 会把非数字串当 0 相加，PG 直接报错，但 '123'+1 两边都通——有类型推断）；关键字不分大小写，标识符不加双引号自动转小写；单引号是字符串常量、双引号是区分大小写的名称，不可混用。常用类型：char/varchar/text、timestamp（可比较、可相减得 interval）、布尔、serial 自增（对应 MySQL 的 AUTO_INCREMENT）、UUID；NULL 不等于 0 也不等于空串，必须 IS NULL 判断，且尽量少用（影响查询性能）。psql 交互里反斜杠指令不用分号：`\l` 列库、`\c` 连库、`\dt` 列表、`\d 表` 看结构；SQL 语句必须分号结尾。建表写"字段 类型 约束"（讲义里的 AUTO_INCREMENT 是去年 MySQL 讲义残留，PG 必须用 serial）；ALTER 加删改字段；删外键要先查约束名——约束名/键名/引用目标是三个不同名称。SQL 按功能分四类：DQL（SELECT）、DDL（CREATE/ALTER/DROP）、DML（INSERT/UPDATE/DELETE）、DCL（GRANT/REVOKE）；`SELECT name, age FROM student WHERE age > 18` 也点明 SQL 是声明式语言——只描述要什么。对有编程基础者此段多为常识，可略。

### CRUD 实操要点

INSERT：指定字段 + VALUES，多行逗号隔开；NOT NULL 字段缺值报错；INSERT...SELECT 可把查询结果（临时表）直接插入，也可用 max(id)+1 这类计算值。UPDATE/DELETE：UPDATE SET 必带 WHERE，否则全表更新；UPDATE...FROM 是 PG 独有的非标准扩展；DELETE 删记录不释放磁盘空间（需 VACUUM），TRUNCATE 更快且立刻释放但不删表结构。SELECT 的条件工具箱：WHERE 比较用单等号，AND/OR/NOT 连接；IN 可接元组（本质是子查询小表）；LIKE 模糊匹配（% 任意串、_ 单字符）、ILIKE 忽略大小写、~ 走正则；CASE WHEN 在字段内做分支（未覆盖返回 NULL）；时间处理用 EXTRACT 提取字段、date_trunc 按月截断；DISTINCT 去重（含主键则无意义）；ORDER BY + LIMIT 取极值行，通用写法是子查询求 max 再 WHERE 相等；UNION 上下拼接两个查询结果、字段需对齐。

### JOIN：多表查询的核心

JOIN 的本质是按 ON 条件把两表记录逐一比对、满足者并入一张临时新表，后续查询都作用在这张表上；多表 join 有先后顺序，只能拿上一步的新表继续 join。LEFT JOIN 左表全保留、右表匹配不上补 NULL。练习题里还出现了自引用外键（recommendedby 指向本表成员）。

### 聚合与分组

count/max/min/avg 把多行坍缩成单值，因此 `SELECT firstname, max(joindate)` 不合法——多值对单值冲突，必须先子查询求 max 再 WHERE 相等。GROUP BY 按字段分组后聚合（PG 要求 SELECT 里的非聚合字段全部进 GROUP BY）；WHERE 过滤聚合前的输入行，HAVING 过滤聚合后的结果，两者先后分明。

### CTE 与窗口函数

WITH...AS 把重复使用的子查询定义成命名临时结果（类比宏），提升可读性，还支持 WITH RECURSIVE 迭代。窗口函数则是"聚合但不坍缩行数"：count(*) OVER() 让每行都带上总数，PARTITION BY 分组的同时保留明细，rank() OVER 可排位。

### ORM 与 SQL 注入

ORM 把 table 映射成 class、record 映射成 instance，好处是开发效率高、屏蔽数据库差异（换库改配置即可）、自动校验、防注入；主流有 SQLAlchemy/Django ORM、Rust 的 Diesel（链式 filter）、Node 的 TypeORM/Sequelize、mongoose。SQL 注入的原理是用户输入被字符串拼接进语句：' OR '1'='1 恒真即可绕过验证；防线是参数化查询、不动态拼接、不信任用户输入、机密信息哈希加密。调优用 EXPLAIN ANALYZE 看执行计划。

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
