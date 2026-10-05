---
title: "GitHub 开源项目（诗词数据 / 工具 / 生成器）"
---

# GitHub 开源项目（诗词数据 / 工具 / 生成器）

> 面向愿意"折腾一点"的读者：用开源数据自建诗词应用、做推送、写小游戏。整理日期：2026-10-03，star 数以当日 GitHub 页面为准（约数）；链接均经核验。

## 一、重点推荐（已逐一打开仓库页核验）

| 项目 | 链接 | 简介 | 备注 |
|---|---|---|---|
| chinese-poetry 中华古诗词数据库 | https://github.com/chinese-poetry/chinese-poetry | GitHub 最全中华古诗词数据库：5.5 万首唐诗、26 万首宋诗、2.1 万首宋词，近 1.4 万位唐宋诗人；另含诗经、楚辞、论语、元曲、花间集。JSON 格式下载即用，几乎是所有诗词应用的"标准数据源" | 约 53.5k star，MIT 协议，持续活跃 |
| 诗泉 chinese-poetry-api | https://github.com/palemoky/chinese-poetry-api | 基于 Go 的高性能诗词 API（收录近 40 万首）：REST + GraphQL、全文搜索、按朝代/作者/体裁/**单字（飞花令）**随机取诗，支持简繁切换；`docker run` 一行自建 | 约 2.9k star，GPL-3.0，活跃；免费在线版 https://poetry.palemoky.com |
| 殆知阁古代文献 daizhigev20 | https://github.com/garychowcmu/daizhigev20 | 古籍 txt 大全集：佛藏、儒藏、史藏、诗藏、集藏等十大类整库收录，clone 即得全部文本，仓库顶部可全文检索 | 约 3.4k star；静态资源库，基本停更 |
| GPT2-Chinese | https://github.com/Morizeyao/GPT2-Chinese | 中文 GPT-2 训练代码，附**古诗词预训练模型**、对联/文言文/歌词模型（网盘/HuggingFace 可下载），本地跑"AI 作诗机" | 约 7.6k star，作者已停更但可用 |
| chinese-gushiwen | https://github.com/aopao/chinese-gushiwen | 1 万首古诗文数据库 + API：含**注释、译文、赏析、朗诵音频 URL** 字段，另有作者简介、名句库 | fork 多；仅供学习交流，商用需谨慎 |

## 二、其他优质项目（均经 GitHub 核实）

| 项目 | 链接 | 简介 | 备注 |
|---|---|---|---|
| wenyan-lang 文言 | https://github.com/wenyan-lang/wenyan | 用文言文写程序的编程语言，可做诗词主题创意编程；有在线 IDE 直接玩 | 约 20.3k star |
| chinese-xinhua | https://github.com/pwxcoo/chinese-xinhua | 汉字、词语、成语、歇后语数据库，写诗词查字义、对对子的辅助数据 | 约 11.7k star，MIT |
| tensorflow_poems | https://github.com/lucasjinreal/tensorflow_poems | 中文古诗自动作诗机器人（LSTM），经典"AI 写诗"入门教程项目 | 约 3.6k star，教学 demo |
| 京墨 jingmo | https://github.com/hefengbao/jingmo | 开源中华文化阅读 App（Flutter）：诗词名句、汉字、成语、节气、传统色等，适合参考做自己的"每日诵读" | 约 2.2k star，活跃 |
| meet-libai 遇见李白 | https://github.com/BinNong/meet-libai | 李白主题诗词知识图谱 + AI 应用 | 约 1.9k star，GPL-3.0 |
| Werneror/Poetry | https://github.com/Werneror/Poetry | 先秦到现代 85 万余首古诗词数据集，覆盖面比 chinese-poetry 更广 | 约 1.8k star |
| cope 格律诗编辑程序 | https://github.com/LingDong-/cope | "写格律诗的现代 IDE"：实时检查平仄、押韵，界面直观，创作辅助利器 | 约 481 star |
| poems-db | https://github.com/yxcs/poems-db | 约 21 万首古诗词，**带注释、赏析**，含 1 万余位诗人介绍、1600 多个词牌 | 约 434 star |
| chinese-poetry-mysql | https://github.com/Kooooooma/chinese-poetry-mysql | 把 chinese-poetry 整理成 MySQL 表结构，导入即用，方便写 SQL 检索 | 约 398 star，MIT |
| huajianji 花间集 | https://github.com/chinese-poetry/huajianji | 简洁的诗歌阅读网页：唐诗三百首、宋词三百首、花间集、古诗十九首等 | 约 363 star，官方组织维护 |
| weapp-poem 诗词墨客 | https://github.com/nslogx/weapp-poem | "最全中华古诗词"微信小程序源码，想自做小程序可直接参考 | 约 506 star |
| tang_poetry 全唐诗数据库 | https://github.com/hxgdzyuyi/tang_poetry | 全唐诗结构化数据库，适合做"只查唐诗"的轻量应用 | 约 449 star |
| chinese_word_rhyme | https://github.com/charlesix59/chinese_word_rhyme | 汉字**平仄、平水韵、词林正韵** JSON 数据，自做格律/押韵工具的现成数据 | 约 37 star |
| chinese-poetry-npm | https://github.com/chinese-poetry/chinese-poetry-npm | chinese-poetry 的 npm 包，前端项目 install 即得全套数据 | 约 186 star，活跃 |
| gushiwen 10 万首数据集 | https://github.com/yht050511/gushiwen | 2022 年从古诗文网爬取的 10 万首数据库 | 仅限学习，注意版权 |
| xenv/gushici 一言·古诗词 | https://github.com/xenv/gushici | 随机名句 API 开源项目；官方在线接口已停，可自行 Docker 部署 | 约 1.4k star |
| GuwenBERT | https://github.com/Ethan-yt/guwenbert | 古文预训练语言模型，可做古诗分类、自动断句等下游任务 | 约 566 star，Apache-2.0 |

## 三、在线 API 服务（不想搭服务器就看这里）

| 服务 | 链接 | 用途 | 备注 |
|---|---|---|---|
| 今日诗词 jinrishici | https://www.jinrishici.com | 根据**时间、地点、天气、节日**智能推荐契合场景的诗句；提供 JS/小程序/安卓 SDK，一行代码给博客加"每日一句" | 免费非商用，接口实测可用 |
| 诗泉在线版 | https://poetry.palemoky.com | 40 万首的免费在线 API：随机一诗、搜索、飞花令单字取诗、GraphQL | 实测可用；也可 Docker 自建 |
| 一言 Hitokoto·诗词分类 | https://v1.hitokoto.cn/?c=i | 随机返回一句诗词/古文（含出处），适合做签名、开屏诗 | 免费；含少量仿古句，严肃用途需筛选 |
| 天行数据 TianAPI | https://www.tianapi.com | 聚合接口平台，含诗词/名句类接口，适合小程序开发 | 注册取 key；额度价格以官网为准 |

## 四、创意玩法（用开源数据做点好玩的）

1. **自建"每日诗词"推送**：用诗泉随机接口或今日诗词的场景推荐，每天早上把"一句诗 + 出处 + 译文"推到 Server酱 / 邮件 / 博客副标题；进阶按节气筛主题诗（中秋取"月"、冬至取"雪"）。
2. **飞花令人机 PK**：用诗泉单字接口写"给定关键字 → 轮流出含该字的诗句"网页小游戏，让 AI 接令、判词。
3. **诗人足迹地图**：用 chinese-poetry 的作者元数据 + 地名识别，把李白、苏轼的诗标注到地图上，复刻"搜韵诗词地图"。
4. **每周一诗学习卡**：从 poems-db（自带赏析字段）抽诗，自动排成 A5 卡片 PDF 打印贴冰箱；再生成背诵打卡表。
5. **格律自查 + 藏头诗贺卡**：用 chinese_word_rhyme 的平仄数据查格律，用 GPT2-Chinese 生成藏头诗，输出成祝福图。

## 使用提示

- chinese-poetry 系列为 MIT 宽松协议，可放心二次开发；爬取类数据集（如 gushiwen 爬虫数据）仅建议自用学习，公开发布或商用前核对版权。
- 更完整的数据来源与网站见 [01-诗词网站与数据库](#/doc/d123)。
