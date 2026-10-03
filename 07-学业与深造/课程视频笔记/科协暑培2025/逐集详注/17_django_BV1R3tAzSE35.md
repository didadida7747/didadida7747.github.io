# 2025科协暑培 · django（刘炳麟, BV1R3tAzSE35）

## 定位
后端 track 第一节：以 Django 为载体讲清"为什么需要后端与前后端分离"、MVC/MTV 架构，并从零跑通博客项目（模型→迁移→视图→模板→Postman 测接口→admin→测试）。适合会 Python、想理解 Web 后端全链路的读者；概念部分对有基础者可快进。

## 知识整理

### 为什么需要后端、数据库与 API
贪吃蛇、井字棋这类游戏纯前端就能玩，但胜负记录、棋面状态、用户信息要持久化，就必须有数据库——持久化正是后端要解决的核心问题。在前后端分离架构中，后端负责与数据库打交道，并与前端交互。
API 是前后端数据流的规范与桥梁。分离的好处：解耦、团队可独立开发、独立仓库部署、可用不同语言/环境，维护性与安全性更好。常见接口风格有 RESTful 与 GraphQL；框架地图上 Python 系是 Django/Flask，Java 系是 Spring Boot，PHP 系是 Laravel，前端为 React/Vue；通信协议除 RESTful 外还有 WebSocket（即时通信）与 gRPC。若你已熟悉前后端分离概念，本节可略读。

### 项目结构与配置要点
Django 官网自述"为快节奏新闻部的 deadline 而生、同时满足资深开发者的苛刻要求"——快速开发+干净设计。`django-admin` 建项目后，`runserver` 即可在 localhost:8000 跑起来。
目录结构中：manage.py 是命令行入口一般不改；__init__.py 声明包；asgi.py（异步入口，面向 WebSocket/高并发）与 wsgi.py（同步入口，传统 HTTP）是两种部署协议。settings.py 逐项要点：BASE_DIR、SECRET_KEY（部署绝不泄露）、DEBUG（上线必须关）、ALLOWED_HOSTS、六个内置 app、MIDDLEWARE、TEMPLATES、DATABASES、语言 zh-Hans、时区 UTC+8、STATIC_URL。其中 DATABASES 默认 SQLite3——轻量但不适合高并发；好在 ORM 已封装各库差异，换库几乎不改代码。
app 与项目主目录平齐、各自独立，各有模型/视图/模板；一个项目可挂任意多 app，由 URL 配置统摄转发。

### MVC 与 MTV：两个"View"的辨析
经典 MVC：Model 管数据结构与数据库交互，View 管呈现，Controller 管路由调度——目标是高内聚低耦合。Django 采用的是 MTV：Model 同 MVC 的 M；**MTV 的 view 实际扮演 Controller**（views.py 处理请求）；**template 才对应 MVC 的 view**（管展示）。两个 view 概念不同，是常见混淆点。
由此引出服务端渲染 vs 客户端渲染：模板整页渲染是 SSR；现代前端更多客户端渲染，后端只回小数据/局部更新——这正是前后端分离的关键。MTV 的完整数据流：请求→view→model 取数→view 加工→template 渲染→返回页面。

### ORM 与数据建模
ORM（对象关系映射）：Python 类↔数据库表，用面向对象语法免写 SQL 操作数据库，支持 SQLite3/PostgreSQL 等。
建模思路是"最优化满足需求"、避免冗余表：博客需要 Article/Tag/Comment。以 Article 为例逐字段看：BigAutoField 自增主键、CharField 标题（max_length 必填）、TextField 内容、DateTimeField(auto_now_add=True) 创建时间、IntegerField 阅读量默认 0；写 `__str__` 返回标题；Meta 里可配 db_table/indexes/verbose_name/ordering。
字段类型全景：CharField/TextField、整数/浮点/Decimal、Date/DateTime、Boolean；常用参数 null/blank/unique/choices。关联关系两种：ForeignKey 一对多（on_delete 级联删除，related_name 实现双向查询）、ManyToMany 多对多（Article↔Tag），且只在一边定义。
写完模型先在 INSTALLED_APPS 注册 app，再 `makemigrations` 生成迁移、`migrate` 写入 db.sqlite3；可用 DB Browser 可视化查看表结构。ORM 增删改查：`objects.create` 自动保存（构造器方式需再 `.save()`）；`.get` 后改属性再 save 或 `.delete()`；`.all()` 列全部。条件查询用 filter：`read_count__gt=200`、`title__contains`（加 i 前缀忽略大小写）、`order_by` 排序。

### 路由、视图与模板
视图收 HttpRequest 返回响应：函数视图如 article_list 取数排序后 `render(request, "article_list.html", {"articles": ...})`。模板语法 `{% if %}`/`{% for %}` 接近编程语言而非纯 HTML，可循环渲染标题、日期、内容前 30 字符——视图与模板不分家。但返回的不一定是页面：前后端分离下更常返回 JsonResponse 或 redirect；如 insert_article 校验必须 POST 否则 403。
类视图继承 ListView/DetailView/CreateView/UpdateView/DeleteView，指定 model+template 即复用增删改查，还内置分页——少造轮子。
路由是两级分发：项目 urls.py include 各 app 的 urls；`path("articles/<int:article_id>/")` 捕获动态段（int/str/uuid），查无返回 404。`reverse()` 反向解析，模板 `{% url %}` 标签异曲同工；app_name 命名空间用于区分同名路由。

### 测试、缓存、admin 与安全
admin 后台：`createsuperuser` 建管理员（密码强度校验严），访问 /admin 即可可视化增删改，与用 Postman 发请求等价；内置用户组与认证授权。装饰器方面：@login_required 做权限、缓存装饰器做缓存，类视图用 method_decorator。讲师强调示例项目安全性弱，真实部署必须加密敏感数据、严控权限。
测试用例写在 tests.py 的 TestCase 里，`python manage.py test` 运行。五条原则：测试独立隔离；清理测试环境勿污染真库；覆盖边界条件；每个测试只验证一个点；恰当使用 assert。可用 coverage 查覆盖率。

### 实战验证与上手路线
跑通顺序：注册 app→迁移→DB Browser 确认表→Postman GET 首页拿渲染 HTML→POST /articles/insert 得 200→刷新见文章与 tag。接口行为逐项验证：阅读量每次进详情 view +1；评论提交后 redirect 回本页、按时间倒序；DELETE 不存在的 id 返回 404。
本讲只是 Django 基础，进阶查官方文档（已到 5.2）。

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
- 编者补充（行动线）：跑通后可做两个延伸——把 render 模板改造成返回 JsonResponse 的纯 API（衔接 DRF）；把 SQLite 换 PostgreSQL 体会迁移；软工课前先吃透测试原则一节。
- 编者补充（缺口）：登录认证实操（只提 @login_required）、静态文件部署、asgi/WSGI 实际部署、DRF 均未展开，去官方文档补。
