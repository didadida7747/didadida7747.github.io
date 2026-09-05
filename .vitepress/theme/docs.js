// 文档课数据：系列 → 章节。以后加新文档课只需在这里登记一个系列对象。
// chapter.link 必须是站内真实路径（与 config.mts 侧边栏链接保持一致）。
// 展示文本注意隐私红线：不出现校名等真实信息（链接路径本身已是公开页面）。
export const SERIES = [
  {
    id: 'si100',
    icon: '🐍',
    title: 'SI100+ 夏季课程 · 逐集详注',
    desc: '18 集视频逐集拆解：从 Intro 与生存指南到变量、函数、控制流，再到培养方案与荣誉班——跟着课程进度建立 C 语言全景。',
    chapters: [
      { id: 'si100-01', title: '01 Intro 与生存指南', desc: '课程 intro 与大学学习方式入门', link: '/SI100+ 2026夏_逐集详注/01_Intro与上科大生存指南_BV1XJuH63EWr' },
      { id: 'si100-02', title: '02 Lec00 环境配置微课', desc: '开发环境一次配好', link: '/SI100+ 2026夏_逐集详注/02_Lec00环境配置微课_BV1HauP6gET8_P1' },
      { id: 'si100-03', title: '03 Lec00 环境介绍正课', desc: '工具链与课程工作流', link: '/SI100+ 2026夏_逐集详注/03_Lec00环境介绍正课_BV1HauP6gET8_P2' },
      { id: 'si100-04', title: '04 Lec04 变量运算符和表达式', desc: 'C 语言地基：变量与表达式', link: '/SI100+ 2026夏_逐集详注/04_Lec04变量运算符和表达式_BV1PCuZ6aE3L' },
      { id: 'si100-05', title: '05 Lec05 函数', desc: '拆解函数、参数与返回值', link: '/SI100+ 2026夏_逐集详注/05_Lec05函数_BV1KCgp6BEAd' },
      { id: 'si100-06', title: '06 Lec06 控制流', desc: '分支与循环的思维方式', link: '/SI100+ 2026夏_逐集详注/06_Lec06控制流_BV1xCgp6BEkj' },
      { id: 'si100-07', title: '07 CSEE 培养方案解读', desc: '看懂培养方案，规划选课', link: '/SI100+ 2026夏_逐集详注/07_CSEE培养方案解读_BV17z8F6rEn4' },
      { id: 'si100-08', title: '08 从零开始的荣誉班', desc: '荣誉课程体系经验分享', link: '/SI100+ 2026夏_逐集详注/08_从零开始的荣誉班_BV1N8g56LE8c' }
    ]
  },
  {
    id: 'embedded',
    icon: '🔬',
    title: '嵌入式体系 · 能力课程',
    desc: '七门能力课按依赖顺序推进：C 工程化 → STM32 与调试 → 通信协议 → FreeRTOS → Linux/C++ → ROS2 → AI 基础，每单元有明确的离开条件。',
    chapters: [
      { id: 'emb-01', title: '01 C 工程化', desc: '从玩具代码到工程代码', link: '/嵌入式体系/C工程化' },
      { id: 'emb-02', title: 'C 工程化 · 实习专项练习', desc: '面向实习的 C 工程化强化', link: '/嵌入式体系/C工程化实习专项练习' },
      { id: 'emb-03', title: '02 STM32 与调试', desc: '点灯只是开始，调试才是能力', link: '/嵌入式体系/STM32与调试' },
      { id: 'emb-04', title: '03 通信与协议', desc: 'UART/I2C/SPI 一条线讲清', link: '/嵌入式体系/通信与协议' },
      { id: 'emb-05', title: '04 实时系统与 FreeRTOS', desc: '任务、调度与实时思维', link: '/嵌入式体系/实时系统与FreeRTOS' },
      { id: 'emb-06', title: '05 Linux 与 C++', desc: '嵌入式上位能力栈', link: '/嵌入式体系/Linux与C++' },
      { id: 'emb-07', title: '06 ROS2 与机器人基础', desc: '机器人开发的工程框架', link: '/嵌入式体系/ROS2与机器人基础' },
      { id: 'emb-08', title: '07 AI 与强化学习基础', desc: '嵌入式视角的 AI 入门', link: '/嵌入式体系/AI与强化学习基础' }
    ]
  },
  {
    id: 'ai',
    icon: '🤖',
    title: 'AI 学习 · 从零入门路线',
    desc: '三篇速读建立语言体系，LLM/RL 代码实践落到实现，PPO CartPole 逐行讲解吃透第一个强化学习算法。',
    chapters: [
      { id: 'ai-01', title: '大模型基础速读', desc: 'Transformer 与 LLM 的最小语言体系', link: '/AI学习/大模型基础速读' },
      { id: 'ai-02', title: '强化学习基础速读', desc: 'MDP、奖励与策略的核心概念', link: '/AI学习/强化学习基础速读' },
      { id: 'ai-03', title: '多智能体强化学习速读', desc: '从单智能体到多方博弈', link: '/AI学习/多智能体强化学习速读' },
      { id: 'ai-04', title: 'LLM 与 RL 代码实践指南', desc: '把速读变成能跑的代码', link: '/AI学习/LLM与RL代码实践指南' },
      { id: 'ai-05', title: '第一小时视频清单（7 天）', desc: '七天入门视频路线', link: '/AI学习/第一小时视频清单' },
      { id: 'ai-06', title: 'PPO CartPole 逐行讲解', desc: '第一个 RL 算法逐行吃透', link: '/AI学习/PPO_CartPole逐行讲解' }
    ]
  }
]
