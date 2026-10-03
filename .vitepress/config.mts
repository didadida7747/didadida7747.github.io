import { defineConfig } from 'vitepress'
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'

// 工作区根目录即站点根：内容镜像自本地资料库 01–10 编号板块（2026-10-03 整理）。
// 侧边栏按板块目录自动扫描生成：md 文件取第一个 # 大标题做显示名，子目录折叠为分组。

// —— 从 md 文件读第一个 # 大标题（退化用文件名）——
function mdTitle(absPath: string, fallback: string): string {
  try {
    const m = readFileSync(absPath, 'utf8').match(/^#\s+(.+)$/m)
    if (m) return m[1].replace(/[*`]/g, '').trim()
  } catch { /* 读不出标题就用文件名 */ }
  return fallback
}

// —— 递归扫描一个内容目录，生成侧边栏 items ——
// index.md / README.md 命名为「栏目导览」并排在首位；子目录折叠为分组。
function scanDir(relDir: string): any[] {
  const abs = join(process.cwd(), relDir)
  const base = '/' + relDir
  const files: any[] = []
  const dirs: any[] = []
  let indexItem: any = null

  for (const name of readdirSync(abs)) {
    if (!name.endsWith('.md')) continue
    const full = join(abs, name)
    if (name === 'index.md' || name === 'README.md') {
      indexItem = { text: '栏目导览', link: base + '/' }
      continue
    }
    files.push({ text: mdTitle(full, name.replace(/\.md$/, '')), link: `${base}/${name.replace(/\.md$/, '')}` })
  }

  for (const name of readdirSync(abs)) {
    const full = join(abs, name)
    if (!statSync(full).isDirectory()) continue
    const sub = scanDir(join(relDir, name))
    if (!sub.length) continue
    let groupText = name
    if (sub[0]?.text === '栏目导览') {
      const idxFile = ['index.md', 'README.md'].map(n => join(full, n)).find(p => existsSync(p))
      if (idxFile) groupText = mdTitle(idxFile, name)
    }
    dirs.push({ text: groupText, collapsed: true, items: sub })
  }

  const natural = (a: any, b: any) => String(a.text).localeCompare(String(b.text), 'zh-Hans-CN', { numeric: true })
  files.sort(natural)
  dirs.sort((a, b) => String(a.text).localeCompare(String(b.text), 'zh-Hans-CN', { numeric: true }))
  return indexItem ? [indexItem, ...files, ...dirs] : [...files, ...dirs]
}

const config = defineConfig({
  lang: 'zh-CN',
  title: '日常与规划',
  description: '一名大二学生的个人资料储藏室：学习笔记、求职研究、技能知识库与每日视野简报',

  // 排除不想成为页面的内容
  srcExclude: [
    '.bili_tmp/**',
    'node_modules/**',
    '.vitepress/**',
    'public/**'
  ],
  rewrites: {
    'home.md': 'index.md',
    '大观导读_脱敏版/00-总导读_先读我.md': '大观/index.md',
    '大观导读_脱敏版/01-求职与就业导读.md': '大观/01-求职与就业导读.md',
    '大观导读_脱敏版/02-课程学习导读.md': '大观/02-课程学习导读.md',
    '大观导读_脱敏版/03-技术成长导读.md': '大观/03-技术成长导读.md',
    '大观导读_脱敏版/04-生活与自我管理导读.md': '大观/04-生活与自我管理导读.md',
    '大观导读_脱敏版/05-工具与信息流导读.md': '大观/05-工具与信息流导读.md'
  },

  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]],
  // 死链体检保持开启：新死链当场暴露而非带上线（2026-09-06 起）。
  // 仅豁免教程里的 localhost 示例地址（如 Docker 测试页），它们本就不是站内链接。
  ignoreDeadLinks: [/^https?:\/\/localhost/],

  sitemap: { hostname: 'https://didadida7747.github.io' },
  lastUpdated: true,

  markdown: {
    lineNumbers: true
  },

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: '日常与规划',

    lastUpdated: {
      text: '最后更新于',
      formatOptions: { dateStyle: 'short', timeStyle: 'short' }
    },

    nav: [
      { text: '首页', link: '/' },
      { text: '🗺️ 大观', link: '/大观/' },
      {
        text: '📚 课程笔记',
        items: [
          { text: 'SI100+ 夏合集 · 学习手册', link: '/07-学业与深造/课程视频笔记/SI100+计算机导论2026夏/SI100+ 2026夏合集_大二学生学习文档' },
          { text: '计算机组成原理 · 全景导学', link: '/07-学业与深造/课程视频笔记/408核心课导学/计算机组成原理_全景导学笔记' },
          { text: '科协暑培 2026 · 大二学习文档', link: '/07-学业与深造/课程视频笔记/科协暑培2026/科协暑培2026合集_大二学生学习文档' },
          { text: '科协暑培 2025 · 学习导览', link: '/07-学业与深造/课程视频笔记/科协暑培2025/科协暑培2025合集_大二学生学习文档' },
          { text: '生成式软工 2026 秋 · 导览', link: '/07-学业与深造/课程视频笔记/生成式软件工程2026秋/生成式软件工程2026秋合集_大二学生学习文档' }
        ]
      },
      {
        text: '🎯 求职就业',
        items: [
          { text: '求职研究 · 方法论导航', link: '/02-职业方向规划/求职研究/' },
          { text: '实习速成方法论', link: '/03-竞赛与就业/实习速成方法论_思路篇与实践篇整合笔记' },
          { text: '求职面试高频题手册', link: '/03-竞赛与就业/求职面试高频题手册_大二实习版' },
          { text: '职业战略校准（决策范例）', link: '/02-职业方向规划/求职研究/职业战略校准_2026-09' }
        ]
      },
      { text: '🗞️ 简报', link: '/04-视野简报/' }
    ],

    sidebar: {
      '/': [
        {
          text: '🗺️ 大观 · 全站导读',
          collapsed: false,
          items: [
            { text: '总导读 · 先读我', link: '/大观/' },
            { text: '01 求职与就业', link: '/大观/01-求职与就业导读' },
            { text: '02 课程学习', link: '/大观/02-课程学习导读' },
            { text: '03 技术成长', link: '/大观/03-技术成长导读' },
            { text: '04 生活与自我管理', link: '/大观/04-生活与自我管理导读' },
            { text: '05 工具与信息流', link: '/大观/05-工具与信息流导读' }
          ]
        },
        {
          text: '💻 电脑与工具链',
          collapsed: true,
          items: scanDir('01-电脑与工具链')
        },
        {
          text: '🎯 职业方向与求职',
          collapsed: false,
          items: [...scanDir('02-职业方向规划'), ...scanDir('03-竞赛与就业')]
        },
        {
          text: '📚 课程与学业',
          collapsed: false,
          items: [
            { text: '01-电子信息核心课程学习地图', link: '/07-学业与深造/01-电子信息核心课程学习地图' },
            { text: '02-保研考研留学深造预案', link: '/07-学业与深造/02-保研考研留学深造预案' },
            ...scanDir('07-学业与深造/课程视频笔记'),
            ...scanDir('07-学业与深造/自学资源')
          ]
        },
        {
          text: '🤖 技能与兴趣',
          collapsed: true,
          items: scanDir('09-课外技能')
        },
        {
          text: '🧭 成长与生活',
          collapsed: true,
          items: scanDir('05-大学生活')
        },
        {
          text: '💰 学生优惠大全',
          collapsed: true,
          items: scanDir('08-学生优惠大全')
        },
        {
          text: '🧠 脑力赚钱调研',
          collapsed: true,
          items: scanDir('10-脑力赚钱')
        },
        {
          text: '🗞️ 视野简报',
          collapsed: true,
          items: scanDir('04-视野简报')
        },
        {
          text: '🕳️ 闲翻杂读',
          collapsed: true,
          items: scanDir('06-闲翻杂读')
        },
        {
          text: '🛠️ 站点工程',
          collapsed: true,
          items: [
            { text: 'HANDOFF · 交接与二次开发指南', link: '/HANDOFF' },
            { text: 'LEARNING · 开发原理与踩坑', link: '/LEARNING' },
            { text: 'LEARNING-3 · 三轮复盘', link: '/LEARNING-3' }
          ]
        }
      ]
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: {
            noResultsText: '没有找到结果',
            resetButtonTitle: '清除查询',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
          }
        }
        // 注：曾尝试自定义中文分词优化整句搜索，实测与 VitePress 打包/水合机制冲突，
        // 短词搜索反而挂掉，已回退默认分词（详见 LEARNING.md）。
      }
    },

    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',

    notFound: {
      title: '页面走丢了',
      quote: '这条链接还没点亮（内容已随资料库整理迁移），先回首页逛逛吧。',
      linkLabel: '回首页',
      linkText: '返回首页'
    }
  }
})

export default defineConfig(config)
