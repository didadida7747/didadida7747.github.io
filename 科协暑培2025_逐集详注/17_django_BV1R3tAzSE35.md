# 2025科协暑培 · django（刘炳麟, BV1R3tAzSE35, 约 94 分钟）

## 定位
后端 track 第一节：以 Django 为载体讲清"为什么需要后端与前后端分离"、MVC/MTV 架构，并从零跑通博客项目（模型→迁移→视图→模板→Postman 测接口→admin→测试）。适合会 Python、想理解 Web 后端全链路的读者；前 25 分钟概念部分对有基础者可快进。

## 内容脉络

- [0:02] 课程定位：后端在前后端分离架构中负责与数据库打交道、并与前端交互；兼讲 Web 基础与数据库常识。
- [1:49] 为什么需要数据库：贪吃蛇/井字棋前端 alone 可玩，但胜负、棋面、用户信息要持久化就必须有数据库——后端的核心问题。⏭️可跳过：动机部分，懂前后端分离者可快进。
- [3:14] API 是前后端数据流的规范与桥梁；分离的好处：解耦、团队独立开发、独立仓库部署、不同语言/环境，维护性与安全性更好；常见风格 RESTful 与 GraphQL（转写"BQL"）。
- [5:06] 框架地图：Python 系 Django/Flask，Java 系 Spring Boot，PHP 系 Laravel；前端 React/Vue；通信协议 RESTful、WebSocket（即时）、gRPC。
- [6:31] Django 官网名言：为快节奏新闻部 deadline 而生、同时满足资深开发者苛刻要求——快速开发+干净设计；现场 django-admin 建项目、runserver 起 localhost:8000。
- [9:54] 目录结构：manage.py 是命令行入口一般不改；__init__.py 声明包；asgi.py 异步入口（WebSocket/高并发）与 wsgi.py 同步入口（传统 HTTP）两种部署协议。
- [11:44] settings.py 逐项：BASE_DIR、SECRET_KEY（部署绝不泄露）、DEBUG（上线必须关）、ALLOWED_HOSTS、六个内置 app、MIDDLEWARE、TEMPLATES、DATABASES 默认 SQLite3（轻量、不适合高并发，但 ORM 已封装各库差异、换库几乎不改代码）、zh-Hans、UTC+8、STATIC_URL。
- [16:59] app 与项目主目录平齐、独立目录、各有模型/视图/模板；一个项目可挂任意多 app，由 URL 统摄转发。
- [19:59] MVC：Model 管数据结构与数据库交互，View 管呈现，Controller 管路由调度——高内聚低耦合。
- [22:25] Django 的 MTV：Model 同 M；MTV 的 view 实际扮演 Controller（views.py 处理请求）；template 才对应 MVC 的 view（管展示）——两个 view 概念不同是常见混淆点。
- [23:48] 由此引出服务端渲染 vs 客户端渲染：模板整页渲染是 SSR；现代前端更多客户端渲染、后端只回小数据/局部更新——前后端分离的关键。
- [24:46] MTV 数据流：请求→view→model 取数→view 加工→template 渲染→返回页面。
- [26:44] ORM（对象关系映射）：Python 类↔数据库表，面向对象语法免写 SQL 操作数据库；支持 SQLite3/PostgreSQL 等。
- [30:09] 建模思路：博客需要 Article/Tag/Comment，"最优化满足需求"、避免冗余表。
- [31:35] 逐字段写 Article（值得精看）：BigAutoField 自增主键、CharField 标题（max_length 必填）、TextField 内容、DateTimeField(auto_now_add=True) 创建时间、IntegerField 阅读量默认 0；__str__ 返回标题；Meta 内 db_table/indexes/verbose_name/ordering。
- [39:58] 字段类型全景：CharField/TextField、整数/浮点/Decimal、Date/DateTime、Boolean；参数 null/blank/unique/choices。
- [41:46] 关联关系：ForeignKey 一对多（on_delete 级联删除，related_name 实现双向查询）；ManyToMany 多对多（Article↔Tag）；只在一边定义。
- [45:41] 迁移：先在 INSTALLED_APPS 注册 app，再 makemigrations 生成迁移、migrate 写入 db.sqlite3；用 DB Browser 可视化查看表结构。⏭️可跳过：跟做一遍即可。
- [52:36] ORM 增删改查：objects.create 自动保存；构造器方式需再 .save()；.get 后改属性 save 或 .delete()；.all() 列全部。
- [54:31] filter 条件查询：read_count__gt=200；title__contains（加 i 前缀忽略大小写）；order_by 降序。
- [58:24] 函数视图（值得精看）：收 HttpRequest 返回响应；article_list 取数排序→render(request, "article_list.html", {"articles": ...})。
- [1:00:43] 模板语法：{% if %}/{% for %} 循环渲染标题、日期、内容前 30 字符——接近编程语言而非纯 HTML；视图与模板不分家。
- [1:02:40] 返回的不一定是页面：前后端分离下更常返回 JsonResponse 或 redirect；insert_article 校验必须 POST 否则 403。
- [1:04:07] 类视图：继承 ListView/DetailView/CreateView/UpdateView/DeleteView，指定 model+template 即复用增删改查，内置分页；少造轮子。
- [1:10:06] 路由两级分发：项目 urls.py include 各 app；path("articles/`<int:article_id>`/") 捕获动态段（int/str/uuid），查无返回 404。
- [1:12:52] reverse() 反向解析；模板 {% url %} 标签异曲同工；app_name 命名空间区分同名路由。
- [1:14:35] 跑通博客：注册 app→迁移→DB Browser 确认表；Postman GET 首页拿渲染 HTML，POST /articles/insert 得 200，刷新见文章与 tag。
- [1:22:35] 细节验证：阅读量每次进详情 view +1；评论提交后 redirect 回本页、按时间倒序；DELETE 不存在 id 返回 404——接口行为逐项验证。
- [1:25:28] 装饰器：@login_required 权限、缓存装饰器，类视图用 method_decorator；强调示例项目安全性弱，真实部署须加密敏感数据、严控权限。
- [1:27:19] admin：createsuperuser 建管理员（密码强度校验严）→/admin 可视化增删改，与 Postman 发请求等价；含用户组认证授权。
- [1:30:15] 测试：用例写 tests.py 的 TestCase，python manage.py test 运行；原则：测试独立隔离、清理测试环境勿污染真库、覆盖边界条件、每个测试只验证一个点、恰当 assert；coverage 查覆盖率。
- [1:32:38] 收尾：本讲只是 Django 基础，进阶查官方文档（已到 5.2）。

## 勘误对照

| 转写 | 应为 |
|---|---|
| JANGO/jungle/JO/张go/张口/账号（框架语境） | Django |
| rascal API/BQL | RESTful API / GraphQL |
| LARA表/菲律宾比索 | Laravel / PHP |
| GEERPC | gRPC |
| ASTI和WSSTI/WFGI/AF解压 | ASGI 和 WSGI |
| allowed house | ALLOWED_HOSTS |
| BHHANS/AHA伤害 | zh-Hans / Asia/Shanghai（时区） |
| 机口语句/C口/SL语句 | SQL 语句 |
| pose press接口 | PostgreSQL |
| out of field/lot of field/all of field/uiid field | BigAutoField / AutoField / UUIDField（视上下文） |
| verbal name/verbs name/latin name/latent name | verbose_name / related_name |
| 外界/吉连删除/born key | 外键 / 级联删除 / ForeignKey |
| MANITORMANIF/MANTO Manife | ManyToManyField |
| TRACY/status traces | choices |
| like super use | createsuperuser |
| read write | redirect |
| HP请求/HV请求/实体请求 | HTTP 请求 |
| dB/eleven tables/dB dot colic | DB Browser /（11 张表，数字存疑）/ db.sqlite3 |
| cash配置 | @cache_page（缓存装饰器） |
| 呼字符串 | 空字符串（""，存疑按上下文） |

## 编者补充

- 编者补充（跨集联系）：MTV 数据流与 Unity 讲"Component 决定功能"同属框架约定优先的心智模型；manage.py test 与 Rust 讲的 cargo test、小学期 OA 测试文件夹互为印证。
- 编者补充（行动线）：跑通后可做两个延伸——把 render 模板改造成返回 JsonResponse 的纯 API（衔接 DRF）；把 SQLite 换 PostgreSQL 体会迁移；软工课前先吃透 1:30 的测试原则。
- 编者补充（缺口）：登录认证实操（只提 @login_required）、静态文件部署、asgi/WSGI 实际部署、DRF 均未展开，去官方文档补。
