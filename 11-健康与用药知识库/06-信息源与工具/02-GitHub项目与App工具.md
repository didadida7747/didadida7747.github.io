---
title: "GitHub 开源项目与实用 App 工具"
---

# GitHub 开源项目与实用 App 工具

> 一句话定位:把能真正帮上忙的"工具层"一次讲清——GitHub 上经过核实的健康开源项目、手机里按场景分类的实用 App、AI 工具的正确用法,以及学术检索的入门路径。
>
> ⚠️ 免责声明:本文为信息导航整理,不构成医疗建议;所有平台内容请结合多方信源交叉验证。开源项目和 App 均非医疗器械,其输出**仅供参考,不可替代医生诊断**;star 数为撰写时(2026-10)检索到的量级,会随时间变化。

---

## 🎯 核心速览

| 你想做什么 | 用什么 |
|---|---|
| 管理自己的健康数据并让 AI 解读 | OpenHealth(开源,本地部署) |
| 记录训练/饮食/体重 | wger(开源自托管)或 薄荷健康(App) |
| 买药前查批准文号 | 国家药监局官网(App见02表) |
| 查药品说明书/相互作用 | 用药助手App(偏专业) |
| 预约 HPV/流感疫苗 | 约苗App |
| 挂号/问诊 | 健康160、微信/支付宝医疗健康入口、好大夫在线 |
| 查医保、带家人激活医保码 | 国家医保服务平台App |
| 扫码看食品配料 | Open Food Facts App |
| 让 AI 帮忙"说人话" | 通用AI助手(用法见第三节,先读免责规则) |
| 想读研究原文 | PubMed / Google Scholar(路径见第四节) |

---

## 一、GitHub 开源项目

> 面向普通用户的说明:GitHub 是代码托管平台,大部分项目需要一点动手能力(会看 README、会用 Docker)。下面按"用途"分类,只收录本次逐一打开仓库核实过的项目。

### 1. Awesome 聚合清单(不知道要什么时,先逛这里)

| 仓库 | Star量级 | 一句话用途 | 链接 |
|---|---|---|---|
| kakoni/awesome-healthcare | 约4k | 最知名的"开源医疗软件大全":电子病历、医学影像、远程医疗、个人健康记录(PHR)等分类齐全 | github.com/kakoni/awesome-healthcare |
| woop/awesome-quantified-self | 约2.8k | "量化自我"资源大全:健康、睡眠、饮食、情绪等自我追踪的App/设备/开源项目导航 | github.com/woop/awesome-quantified-self |
| AgenticHealthAI/Awesome-AI-Agents-for-Healthcare | 约1.3k | 医疗AI智能体论文与项目清单(学术向,配套发表于 Journal of Biomedical Informatics 的综述) | github.com/AgenticHealthAI/Awesome-AI-Agents-for-Healthcare |
| JuneYaooo/awesome-medical-ai-cn | 约31(新但精) | 中文医疗AI开源项目合集:国产医疗大模型、影像AI、临床系统、医疗NLP | github.com/JuneYaooo/awesome-medical-ai-cn |
| awesome-selfhosted/awesome-selfhosted | 约32万(全站) | 自托管软件大全,内含"Health and Fitness(健康与健身)"分类,想自己搭健康服务先翻它 | github.com/awesome-selfhosted/awesome-selfhosted |

### 2. 个人健康数据 + AI 解读

| 仓库 | Star量级 | 一句话用途 | 链接 |
|---|---|---|---|
| OpenHealthForAll/open-health | 约4k | 把血液检查、体检报告、家族史、症状等集中管理,自动解析成结构化数据后对接大模型对话;支持 Ollama 完全本地运行保护隐私,Docker 一键部署 | github.com/OpenHealthForAll/open-health |

**怎么用**:懂一点技术的话,按 README 用 Docker 部署,导入你的体检 PDF;AI 回答基于你自己导入的数据。**注意:它给出的"建议"是语言模型的输出,仅供参考不可替代医生,异常指标务必找医生复核。**

### 3. 健康与运动追踪

| 仓库 | Star量级 | 一句话用途 | 链接 |
|---|---|---|---|
| wger-project/wger | 约7k | 自托管的健身/营养/体重追踪:训练计划、饮食记录(集成 Open Food Facts 食物库)、进度照片,有 Android/iOS 客户端 | github.com/wger-project/wger |
| MBombeck/HealthLog | 131 | 隐私优先的自托管健康记录PWA:体重、血压、血糖、睡眠、用药一站式,支持AI洞察 | github.com/MBombeck/HealthLog |

### 4. 用药提醒与追踪

| 仓库 | Star量级 | 一句话用途 | 链接 |
|---|---|---|---|
| topics/medication-tracker | 共69个仓库 | GitHub"用药追踪"主题页,按star排序可自选(下面是本次核实的前几名) | github.com/topics/medication-tracker |
| MBombeck/HealthLog(同上) | 131 | 含用药提醒模块 | github.com/MBombeck/HealthLog |
| DanielVolz/medassist-ng | 20 | 用药追踪与规划应用 | github.com/DanielVolz/medassist-ng |
| Tinnci/anshin | 3 | Kotlin + Jetpack Compose 的 Android 用药提醒(适合安卓开发者改造自用) | github.com/Tinnci/anshin |

**怎么用**:对普通用户,现成App(手机闹钟/系统健康App的用药提醒)其实够用;开源方案适合"想自己搭、极客兴趣、或给家里长辈定制"的场景。

### 5. 食品与成分查询

| 仓库 | Star量级 | 一句话用途 | 链接 |
|---|---|---|---|
| openfoodfacts/openfoodfacts-server | 约1.2k | Open Food Facts 开放食品数据库后端:由全球2.5万+贡献者众包的百万级商品数据库,含配料、过敏原、营养标签;配套同名扫码App(Android/iOS) | github.com/openfoodfacts/openfoodfacts-server |

**怎么用**:装"Open Food Facts"App,超市扫码即看配料与 Nutri-Score 评分;中国商品覆盖不全,查不到时可看国内App或直接读包装配料表。**注意:对"添加剂"信息保持平常心,合规添加剂≠有毒(见第03篇"成分恐吓"套路)。**

### 6. 体检报告辅助解读(LLM类)

> 先说实话:GitHub 上"体检报告解读"方向目前**没有成熟的大项目**,多数是个人练手作品(本次核实的一批仓库多在0–3 star)。这个领域更适合用"第2类个人健康数据项目 + 通用大模型"组合,或者直接找医生/专业服务。

| 仓库 | Star量级 | 一句话用途 | 链接 |
|---|---|---|---|
| Mrduan-cloud/MediRead | 2 | 体检报告智能解读平台(OCR + RAG + Agent),可作为学习项目研究其思路 | github.com/Mrduan-cloud/MediRead |
| xianjianshenqu/health-report-analyzer | 3 | "智健解语":AI体检报告分析与建议网站(个人项目) | github.com/xianjianshenqu/health-report-analyzer |
| HuatuoGPT / DISC-MedLLM / PULSE / Sunsimiao 等中文医疗大模型 | 见清单 | 开源中文医疗大模型(复旦DISC-MedLLM、港中深HuatuoGPT等),覆盖问诊、报告解读、病历结构化;多数是研究演示,不适合直接自用 | 汇总见 github.com/JuneYaooo/awesome-medical-ai-cn |

> 🛑 **再次强调:任何 LLM 项目的体检报告解读都是"辅助理解",不是"医学判读"。指标异常(如结节、血糖、肝功)的正确路径是:挂对应科室复查→带原始报告问医生。**

### 7. 医学学习资源(进阶)

| 仓库 | Star量级 | 一句话用途 | 链接 |
|---|---|---|---|
| awesome-healthcare 内的 Books/Datasets 分类 | — | 医学书籍、数据集导航(kakoni 清单内) | github.com/kakoni/awesome-healthcare |
| JuneYaooo/awesome-medical-ai-cn 的"资源合集"分类 | — | 中文医学AI课程与资料导航 | github.com/JuneYaooo/awesome-medical-ai-cn |

---

## 二、实用 App(按场景)

> 下载渠道: iOS 用 App Store,安卓优先手机自带应用商店或官网;**凡是要钱、要授权过多隐私、名字带"官方"却查不到开发者的,先警惕**。

### 用药查询

| 名称 | 开发方 | iOS/安卓 | 一句话定位 | 注意点 |
|---|---|---|---|---|
| 用药助手 | 丁香园 | 双端 | 面向医生/药师的临床工具:药品说明书、临床指南(集成MedSeeker AI),内容专业严谨 | 偏专业,普通人查说明书够用;用药决策仍听医生的 |
| 默沙东诊疗手册(大众版) | 默沙东 | 双端 | 经典参考书App,疾病/症状/药物词条免费离线看 | 首次安装需Wi-Fi下载内容包 |

### 疾病科普

| 名称 | 开发方 | iOS/安卓 | 一句话定位 | 注意点 |
|---|---|---|---|---|
| 腾讯医典 | 腾讯 | 双端 | 百科全书式医学科普,专家委员会审核,可按症状/疾病/药物检索 | 广告位注意甄别;结论与医生意见冲突时以医生为准 |
| 丁香医生 | 丁香园 | 双端 | 泛健康科普+在线问诊入口 | 问诊服务按次收费,看清服务条款 |

### 疫苗预约

| 名称 | 开发方 | iOS/安卓 | 一句话定位 | 注意点 |
|---|---|---|---|---|
| 约苗 | 约苗平台 | 双端 | HPV等疫苗预约、接种记录查询,还集成两癌筛查预约 | 热门疫苗需排队抢号,谨防"代抢"黄牛;以当地疾控政策为准 |

### 挂号就医

| 名称 | 开发方 | iOS/安卓 | 一句话定位 | 注意点 |
|---|---|---|---|---|
| 健康160 | 健康160平台 | 双端 | 覆盖多城市的预约挂号/问诊平台(起源于深圳),诊前中后全流程 | 各地挂号主渠道不同:优先用医院官方公众号/当地统一挂号平台 |
| 微信/支付宝"医疗健康" | 微信/支付宝 | 双端 | 城市服务里的挂号、报告查询、医保支付入口 | 以所在城市开通的服务为准 |
| 好大夫在线 | 好大夫 | 双端 | 按科室/疾病找医生、图文/电话问诊,医生履历信息全 | 问诊收费,注意区分"咨询"与"诊疗"边界 |

### 医保服务

| 名称 | 开发方 | iOS/安卓 | 一句话定位 | 注意点 |
|---|---|---|---|---|
| 国家医保服务平台 | 国家医保局 | 双端 | 官方应用:医保码(电子凭证)、亲情账户(帮家人激活)、异地就医备案、消费记录查询 | 认准"国家医疗保障局"开发方;另有支付宝/微信同名小程序 |

### 饮食运动与睡眠记录

| 名称 | 开发方 | iOS/安卓 | 一句话定位 | 注意点 |
|---|---|---|---|---|
| 薄荷健康 | 薄荷健康 | 双端 | 160万+食物库的饮食记录、AI拍照算热量、体重管理 | 别陷入极端卡路里焦虑;其"减肥方案"商品需理性看待 |
| Open Food Facts | 开源非营利 | 双端 | 扫码查食品配料与营养评分(见第一节第5类) | 国内商品覆盖有限 |
| 手机自带健康App(苹果健康/华为运动健康等) | 手机厂商 | 随机自带 | 步数、睡眠、心率、用药提醒的"零成本"记录方案 | 数据仅供参考,异常以体检和医生判断为准 |

---

## 三、AI 工具的正确用法

### AI 能帮你做什么(推荐场景)

1. **把术语翻译成人话**:"帮我用高中生能懂的话解释'窦性心律不齐''HPV一过性感染'是什么意思。"
2. **生成就诊问题清单**:见下方模板,去见医生前花5分钟准备,沟通效率翻倍。
3. **整理叙述材料**:把你零散的症状时间线交给AI整理成结构化段落,贴给医生看。
4. **解释检查项目的目的**:"体检单上的'肿瘤标志物筛查'具体查什么?升高一定代表癌症吗?"
5. **英文资料辅助**:看懂英文药品说明书、国外科普文章。

### AI 不能替你做什么(红线)

- **不能诊断**:同一症状背后可能是十种病,AI 没有"视触叩听"和检验检查,无法收敛。
- **不能开药/调药**:任何"AI推荐我吃XX药"都不可执行,处方权只在医生。
- **不能替代急诊**:胸痛、呼吸困难、大出血、意识改变——打120,别问AI。
- **模型有幻觉与时效问题**:它可能一本正经地编造不存在的文献;其训练数据也可能滞后。

### 两个可复制的提示词模板

**模板A|术语解释:**
> 我在体检/病历上看到「____」,请用高中生能听懂的语言解释:①它是什么 ②为什么查它 ③常见异常原因有哪些 ④哪些情况需要就医。请最后列出你的信息可能过时或出错之处,并提示我向医生核实。

**模板B|就诊问题清单:**
> 我要去【科室】看【症状】,持续【时间】,已试过【处理方式】,有【既往史/过敏史】。请帮我列一份问医生的问题清单,按重要程度排序,不超过8个,并用一句话告诉我每项为什么重要。

### 使用守则

- **要求给来源,并且点开验证**:让AI附上出处后,自己去默沙东/腾讯医典核对一遍。
- **重要结论落到权威渠道**:AI的回答只是草稿,最终以医生、指南和第01篇金字塔上三层信源为准。

---

## 四、检索学术信息的入门路径

| 工具 | 是什么 | 普通人怎么用 | 收费 |
|---|---|---|---|
| PubMed | 美国国立医学图书馆的医学文献库(3000万+摘要) | 搜英文关键词,读摘要了解"研究说了什么";标题右下常有"Free article" | 免费 |
| Google Scholar | 全学科论文搜索引擎 | 找某篇研究的原文/引用次数(引用高≈影响力大);别迷信单篇研究 | 免费 |
| Cochrane Library | 循证医学"证据之王"的系统综述库 | 先看摘要部分(Cochrane summaries 免费),它回答的是"把所有研究合起来看,证据到底够不够" | 综述摘要免费,全文收费 |
| UpToDate | 医生用的循证临床决策参考 | 面向专业人士且收费,个人一般用不到;知道它的存在有助于理解"医生也在查证据" | 收费(机构订阅) |
| 默沙东诊疗手册(专业版) | 免费的"民间版UpToDate" | 想读专业深度内容时的平替 | 免费 |
| 中国知网(CNKI) | 中文学术文献库 | 查中文指南/共识的解读文章;校园网一般免费 | 校园网内免费 |

**三步上手法(以"熬夜是否伤肝"为例):**
1. 先在默沙东/腾讯医典查词条,建立框架;
2. 再去 Cochrane Library 搜英文关键词(如 sleep deprivation liver),读免费摘要看证据强度;
3. 只想看结论?记住:**单篇研究(尤其动物/体外实验)< 综述 < 临床指南**,媒体口中"震撼研究"几乎总是第1档。

---

## ✅ 行动清单

- [ ] 给 GitHub 加一个书签夹:awesome-healthcare、awesome-quantified-self、awesome-medical-ai-cn 三个清单
- [ ] 会折腾的:用 Docker 试装 OpenHealth,把自己的体检报告导入试一次(结论仍需医生复核)
- [ ] 手机装3个App:默沙东诊疗手册(大众版)、国家医保服务平台、约苗(或当地疫苗预约渠道)
- [ ] 把"用药助手"装给家里管药的长辈,教TA查一次说明书
- [ ] 下次就诊前,用模板B生成一份问题清单并实际用一次
- [ ] 校园网环境下打开 PubMed 和 Cochrane 各搜一次自己感兴趣的健康话题

## 🔗 参考来源

- kakoni/awesome-healthcare 仓库主页:https://github.com/kakoni/awesome-healthcare
- OpenHealthForAll/open-health 仓库主页:https://github.com/OpenHealthForAll/open-health
- wger-project/wger 仓库主页:https://github.com/wger-project/wger
- woop/awesome-quantified-self 仓库主页:https://github.com/woop/awesome-quantified-self
- AgenticHealthAI/Awesome-AI-Agents-for-Healthcare 仓库主页:https://github.com/AgenticHealthAI/Awesome-AI-Agents-for-Healthcare
- JuneYaooo/awesome-medical-ai-cn 仓库主页:https://github.com/JuneYaooo/awesome-medical-ai-cn
- awesome-selfhosted/awesome-selfhosted 仓库主页:https://github.com/awesome-selfhosted/awesome-selfhosted
- openfoodfacts/openfoodfacts-server 仓库主页:https://github.com/openfoodfacts/openfoodfacts-server
- GitHub Topic: medication-tracker:https://github.com/topics/medication-tracker
- GitHub 搜索"体检报告解读"结果页:https://github.com/search?q=体检报告解读&type=repositories
- App Store:用药助手(丁香园出品):https://apps.apple.com
- App Store:约苗:https://apps.apple.com
- 360应用商店:健康160:https://m.app.so.com
- 百度百科:国家医保服务平台App(医保码/亲情账户):https://baike.baidu.com
- App Store:薄荷健康:https://apps.apple.com
- 默沙东诊疗手册中文版官网:https://www.msdmanuals.cn/home
- 知乎专栏:国产开源健康数据标准化项目介绍(2026-09):https://zhuanlan.zhihu.com
