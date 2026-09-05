import { defineConfig } from 'vitepress'
import { readdirSync, readFileSync } from 'node:fs'

// 工作区根目录即站点根：新增 md 文件即自动成为新页面。
// site/ 子目录已弃用，站点工程文件都在 .vitepress/ 与根目录。

// —— 自动收录：根目录下未登记进侧边栏的笔记，自动归入「未归类笔记」组 ——
function collectSidebarLinks(items: any[], set = new Set<string>()): Set<string> {
  for (const it of items) {
    if (it.link) set.add(it.link)
    if (it.items) collectSidebarLinks(it.items, set)
  }
  return set
}

function buildAutoSidebarGroup(links: Set<string>) {
  const skip = new Set(['home.md', 'game.md', 'index.md', 'tasks.md', 'wrongbook.md', 'points.md', 'terms.md', 'practice.md', 'docs.md'])
  const items = readdirSync(process.cwd())
    .filter(f => f.endsWith('.md') && !skip.has(f) && !links.has('/' + f.replace(/\.md$/, '')))
    .map(f => {
      let title = f.replace(/\.md$/, '')
      try {
        const m = readFileSync(f, 'utf8').match(/^#\s+(.+)$/m)
        if (m) title = m[1].replace(/[*`]/g, '').trim()
      } catch { /* 读不出标题就用文件名 */ }
      return { text: '🆕 ' + title, link: '/' + f.replace(/\.md$/, '') }
    })
  return items.length
    ? [{ text: '🗂 未归类笔记（新文件自动收录）', collapsed: false, items }]
    : []
}

const config = defineConfig({
  lang: 'zh-CN',
  title: '日常与规划',
  description: '一名大二学生的知识站：学习笔记、成长规划、每日视野简报，外加一场知识闯关',

  // 排除不想成为页面的内容（B 站抓取的临时转写、grok 克隆仓库、简报原始素材等）
  srcExclude: [
    '.bili_tmp/**',
    'node_modules/**',
    '.vitepress/**',
    'public/**',
    // grok 目录里整仓克隆的 openai-codex 仓库（200+ md、含裸 HTML），属工具产物非笔记
    '软件使用/grok使用/**',
    '每日视野简报/data/**',
    '每日视野简报/prompts/**',
    '每日视野简报/templates/**'
  ],
  rewrites: {
    'home.md': 'index.md',
    'game.md': 'game.md',
    '每日视野简报/README.md': '每日视野简报/index.md',
    '软件使用/codex使用/codex-learning/README.md': '软件使用/codex使用/codex-learning/index.md',
    '嵌入式体系/README.md': '嵌入式体系/index.md',
    'STM32工作流/README.md': 'STM32工作流/index.md',
    'AI学习/README.md': 'AI学习/index.md',
    '求职研究/README.md': '求职研究/index.md',
    '自学资源/README.md': '自学资源/index.md'
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    // 首访默认浅色（vibe-hub 式白底）；用户手动切过深色后尊重其选择（存 vitepress-theme-appearance）
    ['script', {}, `
      try {
        if (!localStorage.getItem('vitepress-theme-appearance')) {
          localStorage.setItem('vitepress-theme-appearance', 'light')
        }
      } catch (e) {}
    `]
  ],
  // 笔记是手工语料，个别相对链接可能指向被排除的原始素材，不因死链中断构建
  ignoreDeadLinks: true,

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: '日常与规划',

    nav: [
      {
        // 顶栏收敛：无首页项（点 logo 回首页），所有内容入口收进「内容」下拉
        text: '📚 内容',
        items: [
          { text: '📝 学习笔记', items: [
            { text: 'SI100+ 夏合集 · 学习手册', link: '/SI100+ 2026夏合集_大二学生学习文档' },
            { text: '计算机组成原理 · 全景导学', link: '/计算机组成原理_全景导学笔记' },
            { text: '科协暑培 2026 · 大二学习文档', link: '/科协暑培2026合集_大二学生学习文档' },
            { text: '生成式软工 2026 秋 · 导览', link: '/生成式软件工程2026秋合集_大二学生学习文档' }
          ]},
          { text: '🧭 成长规划', items: [
            { text: '大学四年自我提升全景手册', link: '/大学四年自我提升全景手册' },
            { text: '实习速成方法论', link: '/实习速成方法论_思路篇与实践篇整合笔记' },
            { text: '💼 求职面试高频题手册', link: '/求职面试高频题手册_大二实习版' },
            { text: '向上社交行动手册', link: '/大学生向上社交行动手册' }
          ]},
          { text: '🗞️ 视野简报', link: '/每日视野简报/' },
          { text: '🗂 知识库', items: [
            { text: '🔬 嵌入式体系', link: '/嵌入式体系/' },
            { text: '⚙️ STM32 工作流', link: '/STM32工作流/' },
            { text: '🤖 AI 学习', link: '/AI学习/' },
            { text: '🎯 求职研究', link: '/求职研究/' },
            { text: '🧠 自学资源', link: '/自学资源/' }
          ]},
          { text: '🧰 学习工具', items: [
            { text: '✅ 每日任务 · 执行台', link: '/tasks' },
            { text: '📒 错题本', link: '/wrongbook' },
            { text: '🎮 知识闯关', link: '/game' },
            { text: '🧩 知识点卡片', link: '/points' }
          ]}
        ]
      },
      { text: '🗂 术语', link: '/terms' },
      { text: '🎯 练习', link: '/practice' },
      { text: '📚 文档课', link: '/docs' }
    ],

    sidebar: {
      // —— 功能页（文档/术语/练习/闯关/任务/错题/卡片）：独立页面，无文档侧栏，顶部用 ToolTabs 切换 ——
      '/docs/': [],
      '/terms/': [],
      '/practice/': [],
      '/points/': [],
      '/tasks/': [],
      '/wrongbook/': [],
      '/game/': [],
      '/': [
        {
          text: '📚 学习笔记',
          items: [
            // 排序逻辑：先读合集手册建立全景 → 再看单科导学 → 最后逐集详注（跟着课程进度走）
            { text: 'SI100+ 夏合集 · 大二学习手册（先看：建立全景）', link: '/SI100+ 2026夏合集_大二学生学习文档' },
            { text: '科协暑培 2026 · 大二学习文档（先看：杂谈热身）', link: '/科协暑培2026合集_大二学生学习文档' },
            { text: '计算机组成原理 · 全景导学（本学期硬课：优先吃透）', link: '/计算机组成原理_全景导学笔记' },
            { text: '生成式软工 2026 秋 · 开学前导览（新学期课程）', link: '/生成式软件工程2026秋合集_大二学生学习文档' },
            {
              text: 'SI100+ 逐集详注（查漏：按讲次顺序）',
              collapsed: true,
              items: [
                { text: '01 Intro 与上科大生存指南', link: '/SI100+ 2026夏_逐集详注/01_Intro与上科大生存指南_BV1XJuH63EWr' },
                { text: '02 Lec00 环境配置微课', link: '/SI100+ 2026夏_逐集详注/02_Lec00环境配置微课_BV1HauP6gET8_P1' },
                { text: '03 Lec00 环境介绍正课', link: '/SI100+ 2026夏_逐集详注/03_Lec00环境介绍正课_BV1HauP6gET8_P2' },
                { text: '04 Lec04 变量运算符和表达式', link: '/SI100+ 2026夏_逐集详注/04_Lec04变量运算符和表达式_BV1PCuZ6aE3L' },
                { text: '05 Lec05 函数', link: '/SI100+ 2026夏_逐集详注/05_Lec05函数_BV1KCgp6BEAd' },
                { text: '06 Lec06 控制流', link: '/SI100+ 2026夏_逐集详注/06_Lec06控制流_BV1xCgp6BEkj' },
                { text: '07 CSEE 培养方案解读', link: '/SI100+ 2026夏_逐集详注/07_CSEE培养方案解读_BV17z8F6rEn4' },
                { text: '08 从零开始的荣誉班', link: '/SI100+ 2026夏_逐集详注/08_从零开始的荣誉班_BV1N8g56LE8c' }
              ]
            }
          ]
        },
        {
          text: '🔬 嵌入式体系',
          collapsed: false,
          items: [
            { text: '栏目导览', link: '/嵌入式体系/' },
            { text: '能力地图与离开条件', link: '/嵌入式体系/嵌入式能力地图' },
            { text: '资源索引', link: '/嵌入式体系/嵌入式资源索引' },
            {
              text: '能力课程（按依赖顺序）',
              collapsed: true,
              items: [
                { text: '01 C 工程化', link: '/嵌入式体系/C工程化' },
                { text: 'C 工程化 · 实习专项练习', link: '/嵌入式体系/C工程化实习专项练习' },
                { text: '02 STM32 与调试', link: '/嵌入式体系/STM32与调试' },
                { text: '03 通信与协议', link: '/嵌入式体系/通信与协议' },
                { text: '04 实时系统与 FreeRTOS', link: '/嵌入式体系/实时系统与FreeRTOS' },
                { text: '05 Linux 与 C++', link: '/嵌入式体系/Linux与C++' },
                { text: '06 ROS2 与机器人基础', link: '/嵌入式体系/ROS2与机器人基础' },
                { text: '07 AI 与强化学习基础', link: '/嵌入式体系/AI与强化学习基础' }
              ]
            },
            {
              text: '工程方法',
              collapsed: true,
              items: [
                { text: 'AI 协作请求模板', link: '/嵌入式体系/AI协作请求模板' },
                { text: '实习指标与故障注入', link: '/嵌入式体系/实习指标与故障注入' },
                { text: '技术取舍记录', link: '/嵌入式体系/技术取舍记录' },
                { text: '作品集发布标准', link: '/嵌入式体系/作品集发布标准' },
                { text: '简历与面试证据', link: '/嵌入式体系/简历与面试证据' }
              ]
            }
          ]
        },
        {
          text: '⚙️ STM32 工作流',
          collapsed: true,
          items: [
            { text: '栏目导览', link: '/STM32工作流/' },
            { text: 'STM32 学习路径', link: '/STM32工作流/STM32学习路径' },
            { text: '中断模型知识卡', link: '/STM32工作流/中断模型知识卡' },
            { text: 'UART 常见坑检查单', link: '/STM32工作流/UART常见坑检查单' },
            { text: '启动流程与 main 函数', link: '/STM32工作流/启动流程与main函数' },
            { text: '工具链检查清单', link: '/STM32工作流/工具链检查清单' },
            { text: '嵌入式 AI 提示词五件套', link: '/STM32工作流/嵌入式AI提示词五件套' }
          ]
        },
        {
          text: '🤖 AI 学习',
          collapsed: false,
          items: [
            { text: '栏目导览（入门路线）', link: '/AI学习/' },
            { text: '大模型基础速读', link: '/AI学习/大模型基础速读' },
            { text: '强化学习基础速读', link: '/AI学习/强化学习基础速读' },
            { text: '多智能体强化学习速读', link: '/AI学习/多智能体强化学习速读' },
            { text: 'LLM 与 RL 代码实践指南', link: '/AI学习/LLM与RL代码实践指南' },
            { text: '第一小时视频清单（7 天）', link: '/AI学习/第一小时视频清单' },
            { text: 'PPO CartPole 逐行讲解', link: '/AI学习/PPO_CartPole逐行讲解' },
            {
              text: '巩固与实战',
              collapsed: true,
              items: [
                { text: 'MLP 手搓达标自测', link: '/AI学习/MLP手搓达标自测' },
                { text: '两模型辩论项目实录', link: '/AI学习/两模型辩论项目实录' },
                { text: '嵌入式 AI 转型路线图', link: '/AI学习/嵌入式AI转型路线图' }
              ]
            }
          ]
        },
        {
          text: '🧠 自学资源',
          collapsed: false,
          items: [
            { text: '栏目导览（大学不教的四件事）', link: '/自学资源/' },
            { text: 'MIT Missing Semester（缺失的一课）', link: '/自学资源/MIT-Missing-Semester' },
            { text: 'CS 自学指南（csdiy.wiki）', link: '/自学资源/CS自学指南_csdiy' },
            { text: '《提问的智慧》', link: '/自学资源/提问的智慧' },
            { text: 'University of NotTaught（待考证）', link: '/自学资源/University of NotTaught_拟缺即刻' }
          ]
        },
        {
          text: '🧭 成长规划',
          collapsed: false,
          items: [
            // 排序逻辑：紧急且当下就要用的在前（实习>面试题>四年框架>社交>语言>金融>副业）
            { text: '实习速成方法论（🔥 大二下就要用：最紧急）', link: '/实习速成方法论_思路篇与实践篇整合笔记' },
            { text: '求职面试高频题手册（💼 配合闯关「面试模拟」）', link: '/求职面试高频题手册_大二实习版' },
            { text: '大学四年自我提升全景手册（总框架：先立地图）', link: '/大学四年自我提升全景手册' },
            { text: '大学生向上社交行动手册（本学期就能练）', link: '/大学生向上社交行动手册' },
            { text: '英语听说能力 12 周提升计划（长期Daily，任选时机启动）', link: '/英语听说能力12周提升计划' },
            { text: '黑客松与可交付项目增收指南（有机会再启用）', link: '/黑客松与可交付项目增收行动指南' },
            { text: '投资与金融素养入门（低紧急度：打好钱包观即可）', link: '/投资与金融素养入门计划' }
          ]
        },
        {
          text: '🎯 求职研究',
          collapsed: true,
          items: [
            { text: '栏目导览', link: '/求职研究/' },
            {
              text: '战略与实验（2026-09 新增）',
              collapsed: false,
              items: [
                { text: '职业战略校准（方向决策范例）', link: '/求职研究/职业战略校准_2026-09' },
                { text: '四周验证计划（三方向对比）', link: '/求职研究/四周验证计划_2026-09' },
                { text: '方向实验一 · 可靠任务服务', link: '/求职研究/方向实验/方向实验一_可靠任务服务' },
                { text: '方向实验二 · 媒体处理管线', link: '/求职研究/方向实验/方向实验二_媒体处理管线' },
                { text: '方向实验统一记录模板', link: '/求职研究/方向实验/方向实验统一记录模板' }
              ]
            },
            {
              text: '方向选择',
              collapsed: true,
              items: [
                { text: '岗位地图', link: '/求职研究/岗位地图' },
                { text: '岗位可得性与竞争矩阵', link: '/求职研究/岗位可得性与竞争矩阵' },
                { text: '能力矩阵（三级证据标准）', link: '/求职研究/能力矩阵' },
                { text: '大学整体实习规划', link: '/求职研究/大学整体实习规划' },
                { text: '技术栈优先级', link: '/求职研究/技术栈优先级' },
                { text: '规划优先级与冲突处理', link: '/求职研究/规划优先级与冲突处理' }
              ]
            },
            {
              text: '申请执行',
              collapsed: true,
              items: [
                { text: '简历项目写法', link: '/求职研究/简历项目写法' },
                { text: '申请与避坑', link: '/求职研究/申请与避坑' },
                { text: '官方资料清单', link: '/求职研究/官方资料清单' }
              ]
            },
            {
              text: '岗位运营',
              collapsed: true,
              items: [
                { text: '岗位评分规则', link: '/求职研究/岗位评分规则' },
                { text: '岗位检索异常处理', link: '/求职研究/岗位检索异常处理' },
                { text: '岗位搜索源与查询词', link: '/求职研究/岗位搜索源与查询词' }
              ]
            }
          ]
        },
        {
          text: '🏃 生活与健康',
          collapsed: false,
          items: [
            { text: '健身指导手册 · 从入门到进阶', link: '/健身指导手册_从入门到进阶' },
            { text: '联想拯救者电脑保养手册', link: '/联想拯救者电脑保养手册' }
          ]
        },
        {
          text: '🧰 学习工具',
          collapsed: false,
          items: [
            { text: '🧩 知识点卡片（一个点串全站）', link: '/points' },
            { text: '✅ 每日任务 · 执行台（贴任务/打卡/复盘草稿）', link: '/tasks' },
            { text: '📒 错题本（闯关答错自动收录）', link: '/wrongbook' },
            { text: '🎮 知识闯关（每日挑战/全景闯关）', link: '/game' }
          ]
        },
        {
          text: '🗞️ 视野简报',
          collapsed: true,
          items: [
            { text: '简报说明', link: '/每日视野简报/' },
            {
              text: '日报归档',
              collapsed: true,
              items: [
                { text: '2026-08-15', link: '/每日视野简报/reports/daily/2026-08-15' },
                { text: '2026-08-16', link: '/每日视野简报/reports/daily/2026-08-16' },
                { text: '2026-08-18', link: '/每日视野简报/reports/daily/2026-08-18' },
                { text: '2026-08-19', link: '/每日视野简报/reports/daily/2026-08-19' },
                { text: '2026-08-20', link: '/每日视野简报/reports/daily/2026-08-20' },
                { text: '2026-08-22', link: '/每日视野简报/reports/daily/2026-08-22' },
                { text: '2026-08-31', link: '/每日视野简报/reports/daily/2026-08-31' }
              ]
            },
            { text: '2026-W33 周报', link: '/每日视野简报/reports/weekly/2026-W33' }
          ]
        },
        {
          text: '🛠️ 工具与资源',
          collapsed: true,
          items: [
            { text: '软件使用 · 总览', link: '/软件使用/README' },
            { text: 'Codex 学习路线 · 总览', link: '/软件使用/codex使用/codex-learning/' },
            {
              text: 'Codex 学习路线 · 分册',
              collapsed: true,
              items: [
                { text: '30 分钟上手', link: '/软件使用/codex使用/codex-learning/01-quick-start/00-30min-onboarding' },
                { text: '第一周路线', link: '/软件使用/codex使用/codex-learning/01-quick-start/01-first-week-route' },
                { text: '任务操作系统', link: '/软件使用/codex使用/codex-learning/02-daily-workflow/01-task-operating-system' },
                { text: '提示词模板', link: '/软件使用/codex使用/codex-learning/02-daily-workflow/02-prompt-templates' },
                { text: '命令速查', link: '/软件使用/codex使用/codex-learning/03-cli/01-command-cheatsheet' },
                { text: '进阶地图', link: '/软件使用/codex使用/codex-learning/04-advanced/01-advanced-map' },
                { text: '练习阶梯', link: '/软件使用/codex使用/codex-learning/05-practice/01-practice-ladder' },
                { text: 'Windows 与安全', link: '/软件使用/codex使用/codex-learning/06-troubleshooting/01-windows-and-safety' },
                { text: '资料来源索引', link: '/软件使用/codex使用/codex-learning/reference/00-source-index' },
                { text: '本地环境快照', link: '/软件使用/codex使用/codex-learning/reference/01-local-environment-snapshot' },
                { text: '橙皮书提取笔记', link: '/软件使用/codex使用/codex-learning/reference/02-orange-book-extraction-notes' }
              ]
            },
            {
              text: 'OMP 学习路线',
              collapsed: true,
              items: [
                { text: '从这里开始', link: '/软件使用/omp使用/omp-learning/00-start-here' },
                { text: '快速上手', link: '/软件使用/omp使用/omp-learning/01-quickstart' },
                { text: '命令速查', link: '/软件使用/omp使用/omp-learning/02-command-cheatsheet' },
                { text: '进阶地图', link: '/软件使用/omp使用/omp-learning/03-advanced-map' },
                { text: '资料来源索引', link: '/软件使用/omp使用/omp-learning/reference/source-index' }
              ]
            },
            { text: 'ZCode 使用指南 · 大二学生版', link: '/软件使用/zcode使用/ZCode使用指南-大二学生版' },
            { text: '提示词模板 · 视频合集学习文档', link: '/提示词模板_视频合集学习文档' }
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
      quote: '这条链接还没点亮，先回首页逛逛吧。',
      linkLabel: '回首页',
      linkText: '返回首页'
    }
  }
})

// 新文件零登记：根目录新增而未归类的笔记，自动进「未归类」组
const autoGroup = buildAutoSidebarGroup(collectSidebarLinks(config.themeConfig.sidebar['/']))
if (autoGroup.length) config.themeConfig.sidebar['/'].push(...autoGroup)

export default defineConfig(config)
