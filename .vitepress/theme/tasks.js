// 每日任务数据源：灵感任务池 + 日期工具（与 knowledge.js 的日期种子思路一致，当天固定、隔天更换）
// 任务看板的主数据（每天的具体任务）来自用户自己粘贴/添加，存 localStorage；
// 这里只提供"今天还没贴任务时"的灵感建议，链接指向站内方法论文档。

export const SPARK_POOL = [
  { text: '过一遍 UART 常见坑检查单，把最近踩的坑沉淀成一条新检查项', link: '/STM32工作流/UART常见坑检查单' },
  { text: '读中断模型知识卡，对照最近代码确认 5 个重点', link: '/STM32工作流/中断模型知识卡' },
  { text: '用「固件故障排查」提示词复盘一个今天遇到的问题', link: '/STM32工作流/嵌入式AI提示词五件套' },
  { text: '做 C 工程化练习表里的一个专项练习', link: '/嵌入式体系/C工程化' },
  { text: '给当前项目补一条量化指标（周期抖动/丢失率/吞吐）', link: '/嵌入式体系/实习指标与故障注入' },
  { text: '给当前项目过一遍作品集发布标准，逐项打勾', link: '/嵌入式体系/作品集发布标准' },
  { text: '读大模型基础速读的一个模块，用自己的话复述一遍', link: '/AI学习/大模型基础速读' },
  { text: '跑一段强化学习入门代码，记录一个疑问', link: '/AI学习/强化学习基础速读' },
  { text: '用"源码 > 文档 > 视频"的顺序精读 30 行官方教程代码', link: '/AI学习/LLM与RL代码实践指南' },
  { text: '读 PPO 逐行讲解的一个模块，答出小节里的自测问题', link: '/AI学习/PPO_CartPole逐行讲解' },
  { text: '按简历项目写法改写一条项目描述（弱表达 → 强表达）', link: '/求职研究/简历项目写法' },
  { text: '用岗位评分规则给一条在库岗位重新打分', link: '/求职研究/岗位评分规则' }
]

// 与 knowledge.js dailyPick 同款的种子随机（xorshift），返回随机函数
export function seedRand(seedStr) {
  let h = 2166136261
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    return ((h >>> 0) % 10000) / 10000
  }
}

// 不放回抽 n 条灵感任务
export function pickSparks(seedStr, n) {
  const rand = seedRand(seedStr)
  const arr = [...SPARK_POOL]
  const out = []
  while (out.length < n && arr.length) out.push(arr.splice(Math.floor(rand() * arr.length), 1)[0])
  return out
}

// 本地日期键（与 todaySeed 同格式），offset 为天数偏移：0=今天，-1=昨天
export function dateKey(offset = 0) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

// 日期键 → 短展示名，如 "9月3日 · 周三"
const WEEK = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
export function dateLabel(key) {
  const [y, m, dd] = key.split('-').map(Number)
  const d = new Date(y, m - 1, dd)
  return `${m}月${dd}日 · ${WEEK[d.getDay()]}`
}
