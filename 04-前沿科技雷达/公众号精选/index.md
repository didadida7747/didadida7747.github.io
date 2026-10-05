---
title: "📮 公众号精选"
---

# 📮 公众号精选

把微信公众号里值得看的文章（学校通知、讲座、科技文章）自动收进来，**全文留在本地、导读上站**，重要文章由 AI 沉淀成精读笔记。

## 怎么用（三步）

### 第 1 步：启动 wewe-rss（抓取引擎）

公众号没有官方 API，本方案用开源项目 [wewe-rss](https://github.com/cooderl/wewe-rss) 借**微信读书**接口把公众号变成 RSS：

1. 到 [Releases 页](https://github.com/cooderl/wewe-rss/releases) 下载 Windows 版（`wewe-rss-xxx.exe`，免安装，不需要 Docker）
2. 双击运行，浏览器打开 `http://127.0.0.1:4000`
3. 用**微信扫码**登录（原理是微信读书授权，社区已用一年多；介意账号风险就别扫码，只用手动方式）
4. 「公众号订阅」里搜索并添加你想关注的号（如学校官微、讲座通知号、科技媒体）
5. 每个号有一条 RSS 地址，形如 `http://127.0.0.1:4000/feed/MP_WXS_xxxx`

> ⚠️ wewe-rss 需保持运行，`npm run wx:sync` 才能拉到数据。日常可把它留在后台。

### 第 2 步：登记订阅

编辑 `config/feeds.json`，把 RSS 地址填进去：

```json
{
  "feeds": [
    { "name": "XX大学通知", "url": "http://127.0.0.1:4000/feed/MP_WXS_xxxx", "limit": 20 }
  ]
}
```

- `name`：导读页文件名（也是文章归档目录名）
- `limit`：每次同步最多抓全文的条数

### 第 3 步：同步 + 沉淀

```powershell
npm run wx:sync              # 日常：拉新文章 → 全文存本地 → 更新导读页（在本目录运行，首次先 `npm install`）
npm run wx:sync -- --backfill  # 新加订阅时：把历史文章目录一次性补进导读页
```

产出：

| 位置 | 内容 | 是否上站 |
|---|---|---|
| `articles/<号名>/` | 全文 Markdown | ❌ git 忽略，仅本地 |
| `导读/<号名>.md` | 标题+日期+摘要+原文链接 表格 | ✅ 上站 |
| `导读/精读/` | AI 沉淀的精读笔记 | ✅ 上站 |

## 日常节奏建议

- **每天/每两天**：wewe-rss 开着时跑一次 `wx:sync`（也可配 Windows 计划任务）
- **每周**：让我（AI）扫一遍导读页，挑出值得精读的（讲座预告、重要通知、硬核科技文），沉淀成精读笔记放进 `导读/精读/`，并在导读表格里补一行链接

## 版权边界（为什么全文不上站）

站点部署在公开的 GitHub Pages。公众号文章版权归原公众号所有，**全文搬运上公网有版权风险**。所以：

- 本地 `articles/` 供你自己检索阅读（`.gitignore` 已排除，永远不会被 push）
- 网站只放 导读（标题/摘要/链接，属合理引用）+ 你自己写的批注和精读笔记

## 历史文章一次性回填（可选）

[wecom 精选导出](https://github.com/jooooock/wechat-article-exporter)（wechat-article-exporter）：在线批量下载公众号全部历史文章，原理是登录你注册的公众号平台账号借官方接口。适合把「学校通知号」的历史通知一次性搬进 `articles/`：

```powershell
npx wechat-article-exporter   # 或访问其在线版，导出后把 md 丢进 articles/<号名>/
```

导入后想把这些历史文章也列进导读页：不必整理进 `data/state.json`，直接手动往 `导读/<号名>.md` 的表格里加行即可，格式：`| 日期 | [标题](链接) | 摘要 |`。
