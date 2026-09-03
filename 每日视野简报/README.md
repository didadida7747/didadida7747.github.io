# 每日视野简报

这是一个面向长期阅读的中文信息简报项目。目标不是堆积新闻，而是每天用约 10 分钟了解国内外政策、经济金融、科技产业、科学能源与公共安全的重要变化。

## 工作方式

1. `scripts/collect.py` 从配置的一手来源采集候选标题和链接，保存原始候选与采集状态。
2. Codex 按 `prompts/每日任务提示词.md` 筛选候选、补充公开检索、核对原始页面并撰写日报。
3. `scripts/validate.py` 检查条目数、固定字段、链接和元数据是否完整。
4. 每逢周日，Codex 再根据本周日报生成一份趋势回顾。

固定采集源只是候选入口。一个链接被采集到，不代表其内容已经核实，也不代表它一定进入日报。

## 目录

```text
config/sources.json          固定来源、证据等级和分类
prompts/每日任务提示词.md    Codex 每日任务使用的完整提示词
scripts/collect.py           RSS/Atom/HTML 候选采集器
scripts/validate.py          候选包和最终报告校验器
scripts/run_daily.ps1        Windows 统一入口
templates/日报模板.md        日报结构
templates/周报模板.md        周报结构
data/raw/YYYY-MM-DD/         每日候选、采集汇总和研究包
reports/daily/               每日简报
reports/weekly/              每周趋势回顾
logs/                        运行日志
```

## 手动运行

在本目录打开 PowerShell：

```powershell
.\scripts\run_daily.ps1
```

采集完成后，研究包位于 `data/raw/YYYY-MM-DD/research_packet.md`。写完日报后运行：

```powershell
.\scripts\run_daily.ps1 -ValidateReport .\reports\daily\YYYY-MM-DD.md
```

指定日期只用于可复现测试：

```powershell
.\scripts\run_daily.ps1 -Date 2026-08-15
```

## 质量边界

- 每天目标 8 至 12 条；证据不足时宁可少写，并在报告中明确说明。
- 一级来源包括政府、监管机构、央行、交易所、国际组织和论文/项目原站。
- 二级来源可用于背景和交叉核对，不得替代重大数字、政策原文或公司公告。
- 聚合站、社交媒体、热搜和自媒体只可作为线索，不能单独支撑结论。
- 报告严格区分事实、重要性、可能影响和不确定性。
- 金融内容用于信息和机制理解，不构成投资建议，不输出买卖指令。
- 仅访问公开页面，不登录、不付费、不绕过访问限制，不提交外部表单。
- 采集失败必须写入 `collection_summary.json` 和研究包，不能静默丢弃。

## 成功标准

脚本退出码为 0 只是第一步。一次日报任务完成还必须同时满足：

- 当天 `candidates.json`、`collection_summary.json` 和 `research_packet.md` 存在；
- 最终日报存在并通过 `validate.py`；
- 每条均有可点击来源、发布日期或“页面未标明”，以及不确定性说明；
- 报告元数据中的条目数、成功来源数和失败来源数与正文/采集汇总一致；
- 周日的周报只总结本周已有证据，不把预测写成已发生事实。

