// 术语图鉴数据层：一张术语卡 = 一个术语（大白话讲清 + 站内深链 + 联想）。
// 结构对齐 vibe-hub：名（中/英）、say（你可能会说）、def（定义）、alias（也常被叫作）、
// links（站内深链，anchor 为构建产物真值）、rel（联想栏：相关术语 id + 跨界联想）。
// 分类 cat：计组 / 嵌入式 / AI / 网络 / 求职 / 生活

export const CATS = [
  { id: 'all', name: '全部' },
  { id: 'jizu', name: '计组' },
  { id: 'embedded', name: '嵌入式' },
  { id: 'ai', name: 'AI' },
  { id: 'net', name: '网络' },
  { id: 'career', name: '求职' },
  { id: 'life', name: '生活' }
]

export const TERMS = [
  // ================= 计组 =================
  {
    id: 'instruction', cat: 'jizu',
    name: '指令', en: 'Instruction', icon: '🧩', color: '#a78bfa',
    say: '老听人说什么"指令集""指令周期"，其实指令就是 CPU 能听懂的一句句命令。',
    def: '整门计组课的地基：CPU 只认识指令，所有章节都从"什么是指令"展开。一条指令的执行分五步——取指 → 译码 → 取数 → 执行 → 存数/写回。',
    alias: ['命令', '指令周期', 'Instruction Cycle'],
    links: [
      { text: '什么是指令：全课的地基', link: '/计算机组成原理_全景导学笔记', anchor: '#_0-起点-什么是指令-全课的地基', from: '计组 · 起点' },
      { text: '指令执行五步：把大象装进冰箱', link: '/计算机组成原理_全景导学笔记', anchor: '#_5-1-一条指令的执行过程-把大象装进冰箱', from: '计组 · 5.1' }
    ],
    rel: [
      { type: 'term', id: 'cpu', text: 'CPU：执行指令的机器本身' },
      { type: 'ext', text: '联想 · 工程：可靠任务服务的状态机就是指令周期的工程版', link: '/求职研究/方向实验/方向实验一_可靠任务服务' },
      { type: 'ext', text: '联想 · 健身：一次训练的固定顺序（热身→正式→放松）也是一种"执行周期"', link: '/健身指导手册_从入门到进阶' }
    ]
  },
  {
    id: 'cpu', cat: 'jizu',
    name: '中央处理器', en: 'CPU', icon: '🖥️', color: '#a78bfa',
    say: '别人问"CPU 里有什么"，就记两句：运算器干活算数，控制器指挥全场。',
    def: 'CPU 是全课核心、篇幅最大的一章。两大部件：运算器（ALU）负责算数，控制器负责指挥；数据通路则回答"数据怎么在部件间流动"。',
    alias: ['处理器', '中央处理单元'],
    links: [
      { text: '第 5 章 中央处理器：全课核心', link: '/计算机组成原理_全景导学笔记', anchor: '#第-5-章-中央处理器-全课核心-篇幅最大的一章', from: '计组 · 第 5 章' },
      { text: 'CPU 的两大部件', link: '/计算机组成原理_全景导学笔记', anchor: '#_5-2-cpu-的两大部件', from: '计组 · 5.2' }
    ],
    rel: [
      { type: 'term', id: 'instruction', text: '指令：CPU 消耗的"粮食"' },
      { type: 'term', id: 'interrupt', text: '中断：打断 CPU 当前工作的机制' }
    ]
  },
  {
    id: 'darkline', cat: 'jizu',
    name: '四条暗线', en: 'Hidden Threads', icon: '🧵', color: '#a78bfa',
    say: '计组不是一堆零散章节——编者自己提炼了四条贯穿全课的暗线，抓住它们就抓住了主线。',
    def: '四条暗线是编者自己的提炼而非教材原文：它们把存储、指令、CPU、IO 等章节串成一个逻辑故事，是"推理理解"而非"文科死背"的抓手。',
    alias: ['知识主线', '贯穿线'],
    links: [
      { text: '贯穿全课的四条暗线（编者的思考）', link: '/计算机组成原理_全景导学笔记', anchor: '#四、贯穿全课的四条暗线-编者的思考', from: '计组 · 暗线' }
    ],
    rel: [
      { type: 'term', id: 'gate', text: '离开条件：学习任何课都要有"主线意识"' },
      { type: 'ext', text: '联想 · 方法论：自测过关标准是"能秒答"，不是能默写', link: '/计算机组成原理_全景导学笔记', anchor: '#六、自测清单-能秒答-这部分过关' }
    ]
  },
  {
    id: 'cache', cat: 'jizu',
    name: '存储层次', en: 'Memory Hierarchy', icon: '🗄️', color: '#a78bfa',
    say: '寄存器最快、内存居中、硬盘最慢——计算机用"金字塔"让你感觉处处都快。',
    def: '速度与容量的平衡术：寄存器 → Cache → 内存 → 外存，越往上越快越贵越少。局部性原理是这座金字塔能生效的原因。',
    alias: ['缓存层次', '存储金字塔', 'Memory Hierarchy'],
    links: [
      { text: '计组 · 存储系统主线', link: '/计算机组成原理_全景导学笔记', anchor: '', from: '计组' }
    ],
    rel: [
      { type: 'term', id: 'cpu', text: 'CPU：存储层次服务的对象' },
      { type: 'ext', text: '联想 · 生活：电脑保养里的内存/硬盘升级，就是在金字塔上"搬家"', link: '/联想拯救者电脑保养手册' }
    ]
  },

  // ================= 嵌入式 =================
  {
    id: 'interrupt', cat: 'embedded',
    name: '中断', en: 'Interrupt', icon: '⚡', color: '#fbbf24',
    say: '中断就像门铃：外设一按铃，CPU 暂停手头活去开门——但开门动作（ISR）必须快进快出。',
    def: '五步核心理解：外设提出请求 → NVIC 仲裁优先级 → CPU 进入 ISR → ISR 尽量短 → 复杂处理下放主循环。常见误区：只开外设中断没开 NVIC、ISR 里做耗时打印、忘记 volatile。',
    alias: ['ISR', '中断服务函数', 'NVIC'],
    links: [
      { text: '中断模型知识卡：核心理解', link: '/STM32工作流/中断模型知识卡', anchor: '#你要建立的核心理解', from: 'STM32' },
      { text: '常见误区', link: '/STM32工作流/中断模型知识卡', anchor: '#常见误区', from: 'STM32' }
    ],
    rel: [
      { type: 'term', id: 'uart', text: 'UART：最常见的"按门铃"外设' },
      { type: 'ext', text: '联想 · 计组：每条指令执行结束 CPU 都要检查一次中断请求', link: '/计算机组成原理_全景导学笔记', anchor: '#_5-1-一条指令的执行过程-把大象装进冰箱' }
    ]
  },
  {
    id: 'uart', cat: 'embedded',
    name: '串口通信', en: 'UART', icon: '📡', color: '#fbbf24',
    say: '串口不出字，八成不是玄学——按检查单过一遍：时钟、引脚、波特率、NVIC。',
    def: '最常用的嵌入式通信外设。可靠通信靠帧设计：帧头/长度/校验/超时/重同步。不出字先查六项：引脚复用、外设时钟、波特率基准、NVIC 使能、缓冲区生命周期、printf 重定向。',
    alias: ['串口', 'USART', '波特率'],
    links: [
      { text: 'UART 常见坑检查单', link: '/STM32工作流/UART常见坑检查单', anchor: '#快速检查项', from: 'STM32' },
      { text: '通信与协议：UART 帧设计', link: '/嵌入式体系/通信与协议', anchor: '', from: '嵌入式' }
    ],
    rel: [
      { type: 'term', id: 'interrupt', text: '中断：UART 收发的常见驱动方式' },
      { type: 'term', id: 'handshake', text: '可靠传输：UART 帧设计是它的嵌入式版' }
    ]
  },
  {
    id: 'hal', cat: 'embedded',
    name: 'HAL 与标准库', en: 'HAL vs LL', icon: '🔧', color: '#fbbf24',
    say: 'HAL 是"傻瓜相机"出活快，标准库是"手动挡"懂得深——学习用哪个，看你要什么。',
    def: 'HAL 库封装厚、移植快，适合快速出活；LL/标准库贴近寄存器，适合理解底层。双工程基线方法论：一个 HAL 基线保证进度，一个标准库主线保证深度。',
    alias: ['硬件抽象层', 'LL 库', '寄存器开发'],
    links: [
      { text: '技术取舍：标准库 vs HAL', link: '/嵌入式体系/技术取舍记录', anchor: '', from: '嵌入式' },
      { text: 'STM32 与调试：双工程基线', link: '/嵌入式体系/STM32与调试', anchor: '', from: '嵌入式' }
    ],
    rel: [
      { type: 'term', id: 'evidence', text: '证据分级：能讲清 HAL 封装了什么，才算"可写进项目"' }
    ]
  },
  {
    id: 'rtos', cat: 'embedded',
    name: '实时系统', en: 'FreeRTOS', icon: '⏱️', color: '#fbbf24',
    say: 'RTOS 不是让代码"跑得快"，是让代码"来得及"——先证明裸机不行，再上 RTOS。',
    def: '实时性的核心是截止时间（deadline）而不是速度。三条进入条件之一：裸机已证明无法满足实时性。任务调度、优先级反转、信号量是三件套。',
    alias: ['RTOS', '任务调度', '实时操作系统'],
    links: [
      { text: '实时系统与 FreeRTOS：进入条件', link: '/嵌入式体系/实时系统与FreeRTOS', anchor: '', from: '嵌入式' }
    ],
    rel: [
      { type: 'term', id: 'metric', text: '量化指标：周期抖动是实时性的体检报告' },
      { type: 'ext', text: '联想 · AI：策略也讲究"及时响应"——但 RL 关心的是长期回报而非单次 deadline', link: '/AI学习/强化学习基础速读' }
    ]
  },
  {
    id: 'metric', cat: 'embedded',
    name: '量化指标', en: 'Metrics', icon: '📈', color: '#fbbf24',
    say: '嵌入式项目"做完了"不算数——抖动多少、丢多少、能扛多少，说得出数才算数。',
    def: '项目交付的量化口径：周期抖动、丢失率、吞吐、RAM/CPU 占用、恢复时间。配套必做故障注入清单，模拟真实异常验证指标。',
    alias: ['性能指标', '故障注入', '基准测试'],
    links: [
      { text: '实习指标与故障注入', link: '/嵌入式体系/实习指标与故障注入', anchor: '#性能指标', from: '嵌入式' },
      { text: '必做故障注入清单', link: '/嵌入式体系/实习指标与故障注入', anchor: '#必做故障注入', from: '嵌入式' }
    ],
    rel: [
      { type: 'term', id: 'evidence', text: '证据分级：实测数字是最硬的证据' },
      { type: 'ext', text: '联想 · 求职：简历上的每个数字都必须附环境、输入和测量方法', link: '/求职研究/职业战略校准_2026-09' }
    ]
  },
  {
    id: 'gate', cat: 'embedded',
    name: '离开条件', en: 'Exit Criteria', icon: '🚪', color: '#fbbf24',
    say: '别做"看过"式学习——每门课都有闸门：满足离开条件才算学完，否则一直在门里。',
    def: '嵌入式课程按依赖排序（C 工程化 → STM32 → 通信 → FreeRTOS → Linux/C++ → ROS2），每单元以"能独立交付什么"为离开条件。能力三级证据：只算接触 / 可写进项目 / 可投实习。',
    alias: ['闸门机制', '验收标准', '能力地图'],
    links: [
      { text: '能力地图与离开条件', link: '/嵌入式体系/嵌入式能力地图', anchor: '#条件能力', from: '嵌入式' },
      { text: '能力矩阵：三级证据标准', link: '/求职研究/能力矩阵', anchor: '#公共底座', from: '求职' }
    ],
    rel: [
      { type: 'term', id: 'darkline', text: '四条暗线：课程内部也要有主线意识' },
      { type: 'ext', text: '联想 · 规划：四年手册的里程碑与检查点是更大尺度的"离开条件"', link: '/大学四年自我提升全景手册' }
    ]
  },

  // ================= AI =================
  {
    id: 'token', cat: 'ai',
    name: '词元', en: 'Token', icon: '🔤', color: '#22d3ee',
    say: 'AI 不认识汉字——它把你的话切成一块块"词元"，每块变成编号再变成向量。',
    def: 'token 是模型的最小处理单元：文本先被切分、编号化，再通过 embedding 变成向量。你付的 API 费用、上下文长度限制，数的就是它。',
    alias: ['词元', '分词', 'Tokenization'],
    links: [
      { text: '大模型基础速读：token', link: '/AI学习/大模型基础速读', anchor: '#_1-token', from: 'AI' },
      { text: 'embedding：从编号到向量', link: '/AI学习/大模型基础速读', anchor: '#_2-embedding', from: 'AI' }
    ],
    rel: [
      { type: 'term', id: 'attention', text: '注意力：token 之间的"看见"机制' }
    ]
  },
  {
    id: 'attention', cat: 'ai',
    name: '注意力', en: 'Attention', icon: '🎯', color: '#22d3ee',
    say: 'Q 是我想找什么，K 是我这里有什么，V 是真正传递的内容——注意力就是按相似度加权汇总。',
    def: '自注意力的直觉：拿 Q 和所有 K 比相似度，再用权重对 V 做加权汇总。它让每个 token 都能"看见"别的 token，是大模型的心脏。',
    alias: ['自注意力', 'Self-Attention', 'QKV'],
    links: [
      { text: 'Q / K / V 直觉', link: '/AI学习/大模型基础速读', anchor: '#_4-q-k-v', from: 'AI' },
      { text: 'self-attention：让每个位置看见别的位置', link: '/AI学习/大模型基础速读', anchor: '#_3-self-attention', from: 'AI' }
    ],
    rel: [
      { type: 'term', id: 'token', text: '词元：注意力的作用对象' },
      { type: 'ext', text: '联想 · 求职：简历筛选也是"JD 的 Q 匹配简历的 K"——强表达就是让对方匹配到你想传递的 V', link: '/求职研究/简历项目写法', anchor: '#弱表达与强表达' }
    ]
  },
  {
    id: 'reward', cat: 'ai',
    name: '奖励', en: 'Reward', icon: '🍬', color: '#22d3ee',
    say: 'reward 不告诉你正确答案，只告诉你"这一步是更好还是更差"——像健身后的肌肉感觉。',
    def: '强化学习的反馈信号：环境给智能体的评价。policy 是"看到什么情况倾向做什么"的规则，return 是长期累计总回报——目标是回报最大而不是单步奖励最大。',
    alias: ['奖励函数', '回报', 'Return'],
    links: [
      { text: '强化学习基础速读：reward', link: '/AI学习/强化学习基础速读', anchor: '#_5-reward', from: 'AI' },
      { text: 'policy 与 return', link: '/AI学习/强化学习基础速读', anchor: '#_6-policy', from: 'AI' }
    ],
    rel: [
      { type: 'term', id: 'ppo', text: 'PPO：用奖励信号更新策略的算法' },
      { type: 'ext', text: '联想 · 生活：投递反馈（笔试/面试/拒信）就是求职系统的 reward 流', link: '/求职研究/岗位检索异常处理' }
    ]
  },
  {
    id: 'ppo', cat: 'ai',
    name: 'PPO', en: 'Proximal Policy Optimization', icon: '🏋️', color: '#22d3ee',
    say: 'PPO = 让策略"小步慢走"：每次更新别离上一步太远，稳字当头。',
    def: '近端策略优化：Actor 出动作、Critic 打分、clip 限制更新幅度、GAE 估计优势。CartPole 是它的 hello world——30KB 逐行讲解帮你从整体到每一步都看懂。',
    alias: ['近端策略优化', '策略梯度', 'Actor-Critic'],
    links: [
      { text: 'PPO CartPole 逐行讲解', link: '/AI学习/PPO_CartPole逐行讲解', anchor: '#_1-整体功能-这个程序到底在做什么', from: 'AI' }
    ],
    rel: [
      { type: 'term', id: 'reward', text: '奖励：PPO 优化的目标信号' },
      { type: 'ext', text: '联想 · 工程：DQN/PPO 实验要"可复现对照"，不提前包装成算法实习资格', link: '/求职研究/技术栈优先级' }
    ]
  },
  {
    id: 'ctde', cat: 'ai',
    name: '多智能体', en: 'MARL / CTDE', icon: '👥', color: '#22d3ee',
    say: '一群智能体互相影响，环境就"活"了——训练时开天眼（集中），上场各打各的（分散）。',
    def: '多智能体强化学习三大难点：其他智能体也在变（非平稳）、观测与目标更复杂、训练组织更麻烦。CTDE 范式：Centralized Training, Decentralized Execution。',
    alias: ['多智能体强化学习', 'CTDE', '非平稳性'],
    links: [
      { text: '多智能体强化学习速读', link: '/AI学习/多智能体强化学习速读', anchor: '#什么叫多智能体', from: 'AI' },
      { text: 'CTDE 范式', link: '/AI学习/多智能体强化学习速读', anchor: '#ctde', from: 'AI' }
    ],
    rel: [
      { type: 'term', id: 'agent', text: 'Agent：多智能体里的"一个智能体"' }
    ]
  },
  {
    id: 'agent', cat: 'ai',
    name: '智能体', en: 'Agent', icon: '🤖', color: '#22d3ee',
    say: '不是"调用了大模型"就是 Agent——检索、引用、拒答、评测、异常处理，这些工程环节才是价值。',
    def: 'Agent = LLM + 工具 + 任务闭环。工程价值来自数据、检索、引用、拒答、评测、接口和异常处理。最低证据：受限资料问答 CLI，带可定位引用和正确拒答。',
    alias: ['智能助手', 'LLM 应用', '工具调用'],
    links: [
      { text: '职业战略校准：AI 工程服务定位', link: '/求职研究/职业战略校准_2026-09', anchor: '', from: '求职' },
      { text: '两模型辩论项目实录', link: '/AI学习/两模型辩论项目实录', anchor: '', from: 'AI' }
    ],
    rel: [
      { type: 'term', id: 'ctde', text: '多智能体：多个 Agent 的协作/竞争' },
      { type: 'ext', text: '联想 · 工具：Codex 的任务操作系统是人机协作的另一面', link: '/软件使用/codex使用/codex-learning/', anchor: '' },
      { type: 'ext', text: '联想 · 工具：OMP 学习路线——同样的"任务-提示词-验证"结构换个工具依然成立', link: '/软件使用/omp使用/omp-learning/00-start-here' }
    ]
  },
  {
    id: 'hallucination', cat: 'ai',
    name: '幻觉', en: 'Hallucination', icon: '👻', color: '#22d3ee',
    say: '模型一本正经地胡说八道，就是幻觉——治它的办法不是更大的模型，是引用和拒答。',
    def: '模型生成看似合理但无依据的内容。工程对策：受限检索（只读白名单目录）、要求可定位引用、信息不足时正确拒答、固定样例评测。',
    alias: ['幻觉问题', '胡编', '无依据生成'],
    links: [
      { text: 'AI 工程服务实验：拒答与引用', link: '/求职研究/四周验证计划_2026-09', anchor: '', from: '求职' },
      { text: '两模型辩论：互评暴露漏洞', link: '/AI学习/两模型辩论项目实录', anchor: '', from: 'AI' }
    ],
    rel: [
      { type: 'term', id: 'agent', text: 'Agent：幻觉治理是 Agent 工程的核心环节' }
    ]
  },
  {
    id: 'prompt', cat: 'ai',
    name: '提示词', en: 'Prompt', icon: '💬', color: '#22d3ee',
    say: '提示词不是"咒语"——它是给 AI 的岗位说明书：输入什么、做什么、输出什么格式。',
    def: '嵌入式五件套的设计原则：先复述再动手、给最小验证动作、区分"已知正确"和"待验证草稿"、不假装已验证。输出格式约束是程序解析的前提。',
    alias: ['提示词工程', 'Prompt Engineering'],
    links: [
      { text: '嵌入式 AI 提示词五件套', link: '/STM32工作流/嵌入式AI提示词五件套', anchor: '', from: 'STM32' },
      { text: 'AI 协作请求模板：先自己试 20-40 分钟', link: '/嵌入式体系/AI协作请求模板', anchor: '', from: '嵌入式' }
    ],
    rel: [
      { type: 'term', id: 'agent', text: 'Agent：提示词是驱动 Agent 的接口' },
      { type: 'ext', text: '联想 · 工具：ZCode 使用指南里的提示词实践', link: '/软件使用/zcode使用/ZCode使用指南-大二学生版' }
    ]
  },

  // ================= 网络 =================
  {
    id: 'handshake', cat: 'net',
    name: '三次握手', en: 'TCP Handshake', icon: '🤝', color: '#38bdf8',
    say: '两次不够三次刚好：握手是确认"你听得见我、我听得见你"，不是仪式感。',
    def: 'TCP 建连要三次：确认双方收发能力正常，防止失效的连接请求突然到达造成错误连接。挥手要四次：全双工两条通道分别关闭，ACK 和 FIN 常分开发。',
    alias: ['TCP 建连', '握手挥手'],
    links: [
      { text: 'TCP 为什么是三次握手', link: '/求职面试高频题手册_大二实习版', anchor: '#_2-tcp-为什么是三次握手-不是两次', from: '面试 · 网络' },
      { text: '挥手为什么四次', link: '/求职面试高频题手册_大二实习版', anchor: '#3-tcp-为什么挥手要四次', from: '面试 · 网络' }
    ],
    rel: [
      { type: 'term', id: 'tcpudp', text: 'TCP vs UDP：握手是 TCP 可靠性的起点' }
    ]
  },
  {
    id: 'tcpudp', cat: 'net',
    name: 'TCP 与 UDP', en: 'TCP vs UDP', icon: '🔀', color: '#38bdf8',
    say: 'TCP 是挂号信（确认签收），UDP 是传单（发出去就行）——选哪个看你丢不丢得起。',
    def: 'TCP 面向连接、可靠交付、面向字节流；UDP 无连接、尽最大努力交付、面向报文。TCP 首部至少 20 字节，UDP 仅 8 字节。',
    alias: ['传输层协议'],
    links: [
      { text: 'TCP 和 UDP 的区别（出现率几乎 100）', link: '/求职面试高频题手册_大二实习版', anchor: '#_1-tcp-和-udp-的区别-出现率几乎-100', from: '面试 · 网络' }
    ],
    rel: [
      { type: 'term', id: 'handshake', text: '三次握手：TCP 连接的建立' },
      { type: 'ext', text: '联想 · 嵌入式：UART 帧的校验与重同步，是串口世界的"可靠性补丁"', link: '/嵌入式体系/通信与协议' }
    ]
  },
  {
    id: 'statuscode', cat: 'net',
    name: '状态码', en: 'HTTP Status Code', icon: '🚦', color: '#38bdf8',
    say: '4 开头是你的错，5 开头是服务器的错——404 找不到页面，502 网关出了岔子。',
    def: 'HTTP 状态码五类：1xx 信息 / 2xx 成功 / 3xx 重定向 / 4xx 客户端错 / 5xx 服务端错。做 Agent 服务化时，正确的状态码是异常处理的第一道说明书。',
    alias: ['HTTP 状态码'],
    links: [
      { text: 'HTTP 常见状态码', link: '/求职面试高频题手册_大二实习版', anchor: '#_5-http-常见状态码', from: '面试 · 网络' }
    ],
    rel: [
      { type: 'term', id: 'agent', text: 'Agent 服务化：异常处理依赖正确状态码' }
    ]
  },
  {
    id: 'processthread', cat: 'net',
    name: '进程与线程', en: 'Process vs Thread', icon: '🏭', color: '#38bdf8',
    say: '进程是独立厂房，线程是厂房里的工人——厂房隔离资源，工人共享车间。',
    def: '进程是资源分配的独立单位，线程是资源调度的独立单位。IPC 五大方式：管道、信号量、消息队列、共享内存（最快）、套接字。死锁四条件：互斥、请求和保持、不剥夺、环路等待。',
    alias: ['并发', 'IPC', '死锁'],
    links: [
      { text: '进程和线程的区别', link: '/求职面试高频题手册_大二实习版', anchor: '#_1-进程和线程的区别-出现率几乎-100', from: '面试 · 操作系统' },
      { text: '进程间通信方式 IPC', link: '/求职面试高频题手册_大二实习版', anchor: '#_2-进程间通信方式-ipc-有哪些', from: '面试 · 操作系统' }
    ],
    rel: [
      { type: 'term', id: 'rtos', text: 'RTOS 任务调度：嵌入式版"线程管理"' }
    ]
  },
  {
    id: 'idempotent', cat: 'net',
    name: '幂等性', en: 'Idempotency', icon: '♻️', color: '#38bdf8',
    say: '同一单子重复提交，不能创建两个任务——这就是幂等：做一次和做多次效果一样。',
    def: '可靠服务的第一课：客户端重试、网络抖动都会造成重复请求。幂等键（idempotency_key）+ 状态机（pending/running/succeeded/failed）+ 失败重试限制，是任务服务的最小骨架。',
    alias: ['幂等键', '重试', '任务状态机'],
    links: [
      { text: '方向实验一：可靠任务服务', link: '/求职研究/方向实验/方向实验一_可靠任务服务', anchor: '', from: '求职 · 实验' }
    ],
    rel: [
      { type: 'term', id: 'statuscode', text: '状态码：重复请求的正确回应' },
      { type: 'ext', text: '联想 · 工程：断档恢复协议也是"幂等"思维——不逐日补卡，从最后一次产出恢复', link: '/求职研究/规划优先级与冲突处理' }
    ]
  },

  // ================= 求职 =================
  {
    id: 'resume', cat: 'career',
    name: '一页简历', en: 'Resume', icon: '📄', color: '#f472b6',
    say: '简历不是成绩单，是学习清单——想被面试官问什么，就写什么。',
    def: '简历 = 学习清单。弱表达换强表达："参与了"换成"实现了什么、指标如何"。每个数字都要能复现：附环境、输入和测量方法，否则就是简历风险。',
    alias: ['简历', 'CV', '项目经历'],
    links: [
      { text: '简历项目写法：弱表达与强表达', link: '/求职研究/简历项目写法', anchor: '#弱表达与强表达', from: '求职' },
      { text: '项目条目模板', link: '/求职研究/简历项目写法', anchor: '#项目条目模板', from: '求职' },
      { text: '简历 = 学习清单（实习速成）', link: '/实习速成方法论_思路篇与实践篇整合笔记', anchor: '#五、执行层·简历-讲二为主-简历-学习清单', from: '实习速成' }
    ],
    rel: [
      { type: 'term', id: 'evidence', text: '证据分级：S 级资产才能撑起一条强表达' },
      { type: 'ext', text: '联想 · AI：写简历也是"对 JD 做关键词对齐"——先看高频词再组织语言', link: '/求职研究/岗位搜索源与查询词' }
    ]
  },
  {
    id: 'evidence', cat: 'career',
    name: '证据分级', en: 'Evidence Levels', icon: '📊', color: '#f472b6',
    say: '参与证明只算 C 级，真实代码任务才是 S 级——一切凭证据说话。',
    def: '简历资产四级：S（真实代码任务的实习/助研/团队项目）、A（可复现深度项目/技术型开源贡献）、B（黑客松成品/校级获奖）、C（参与证明/教程复现/刷题数量——只作学习记录）。能力同样分级：只算接触 / 可写进项目 / 可投实习。',
    alias: ['能力三级', 'SABC 分级', '能力证据'],
    links: [
      { text: '职业战略校准：简历资产优先级', link: '/求职研究/职业战略校准_2026-09', anchor: '', from: '求职' },
      { text: '能力矩阵：三级证据标准', link: '/求职研究/能力矩阵', anchor: '#公共底座', from: '求职' }
    ],
    rel: [
      { type: 'term', id: 'metric', text: '量化指标：实测数字是最硬的证据' },
      { type: 'ext', text: '联想 · 站内：闯关游戏的学情条形图，是自己给自己出的证据报告', link: '/game' }
    ]
  },
  {
    id: 'jobscore', cat: 'career',
    name: '岗位评分', en: 'Job Scoring', icon: '🧮', color: '#f472b6',
    say: '投不投别凭感觉——六维打分算 P 值，P0 岗位 24 小时内必须给答复。',
    def: '六维评分：真实性/时效性/匹配度/差距/可行性/质量，加权得 P 值再分 P0-P3 优先级。硬门槛：P≥80 且各维达标才是 P0。标题多不等于容易拿到，一切看两层样本。',
    alias: ['六维评分', '优先级公式', 'P0-P3'],
    links: [
      { text: '岗位评分与申请优先级规则', link: '/求职研究/岗位评分规则', anchor: '#六项评分', from: '求职' },
      { text: 'v2 优先级计算', link: '/求职研究/岗位评分规则', anchor: '#v2-优先级计算', from: '求职' }
    ],
    rel: [
      { type: 'term', id: 'evidence', text: '证据分级：评分依据不足时降级待核验，不凭感觉拉分' }
    ]
  },
  {
    id: 'funnel', cat: 'career',
    name: '三层漏斗', en: 'Job Funnel', icon: '🔻', color: '#f472b6',
    say: '搜得到 ≠ 投得上 ≠ 值得投——三层滤完，剩下的才是真机会。',
    def: '岗位可得性三层框架：搜得到（岗位可见度）、投得上（本科第一段入门难度）、值得投（高质量供给与竞争结构）。找实习是期末考不是高考，用数量对抗概率的前提是漏斗干净。',
    alias: ['可得性矩阵', '岗位漏斗'],
    links: [
      { text: '岗位可得性与竞争矩阵', link: '/求职研究/岗位可得性与竞争矩阵', anchor: '', from: '求职' },
      { text: '找实习是期末考（实习速成）', link: '/实习速成方法论_思路篇与实践篇整合笔记', anchor: '#_1-重构一-找实习是期末考-不是高考', from: '实习速成' }
    ],
    rel: [
      { type: 'term', id: 'jobscore', text: '岗位评分：漏斗下游的量化筛选' }
    ]
  },
  {
    id: 'selfintro', cat: 'career',
    name: '自我介绍', en: 'Self Introduction', icon: '🎤', color: '#f472b6',
    say: '一分钟三段式：我是谁 → 做过什么（1-2 个具体成果）→ 为什么来。别从小学讲起。',
    def: '面试第一题的标准结构。没做过项目就诚实承认 + 讲清自驱小项目：为什么做 → 怎么做 → 踩了什么坑 → 学到什么（追问树），可覆盖九成面试追问。',
    alias: ['面试开场', '追问树'],
    links: [
      { text: '自我介绍 1 分钟版怎么准备', link: '/求职面试高频题手册_大二实习版', anchor: '#_1-自我介绍-1-分钟版怎么准备', from: '面试 · HR' },
      { text: '没有项目经历怎么答', link: '/求职面试高频题手册_大二实习版', anchor: '#_2-你有什么项目经历-——大二没做过项目怎么答', from: '面试 · HR' }
    ],
    rel: [
      { type: 'term', id: 'resume', text: '一页简历：自我介绍的素材库' }
    ]
  },
  {
    id: 'directiontest', cat: 'career',
    name: '方向实验', en: 'Direction Experiment', icon: '🧪', color: '#f472b6',
    say: '别凭想象下注职业方向——6-8 小时做个最小项目，用行为证据判断愿不愿意干。',
    def: '用相同时间、相同证据标准测试相邻方向：可靠任务服务（后端）、媒体处理管线（音视频）、受限问答 CLI（AI 服务）。统一记录模板对比：主动投入、受挫耐受、学习速度、成就感。',
    alias: ['方向验证', '四周实验', '体验项目'],
    links: [
      { text: '四周验证计划', link: '/求职研究/四周验证计划_2026-09', anchor: '', from: '求职' },
      { text: '方向实验统一记录模板', link: '/求职研究/方向实验/方向实验统一记录模板', anchor: '', from: '求职' }
    ],
    rel: [
      { type: 'term', id: 'idempotent', text: '幂等性：方向实验一要做的核心机制' },
      { type: 'term', id: 'gate', text: '离开条件：实验也有最低交付线' }
    ]
  },
  {
    id: 'conflict', cat: 'career',
    name: '规划冲突', en: 'Priority Rules', icon: '⚖️', color: '#f472b6',
    say: '五份计划都说"下一步听我的"怎么办——文档分层级，高层级 + 更新时间的赢。',
    def: '文档优先级从高到低：最新明确决定与课程期限 > 学期执行计划 > 求职画像与岗位证据 > 长期规划 > 手册与模板 > 历史日报。每天只设一个主交付物 + 至多一个次要能力块。',
    alias: ['优先级裁决', '任务生成规则'],
    links: [
      { text: '规划优先级与冲突处理', link: '/求职研究/规划优先级与冲突处理', anchor: '', from: '求职' }
    ],
    rel: [
      { type: 'term', id: 'recovery', text: '断档恢复：冲突处理的姊妹协议' }
    ]
  },

  // ================= 生活 =================
  {
    id: 'recovery', cat: 'life',
    name: '断档恢复', en: 'Recovery Protocol', icon: '🔄', color: '#fb7185',
    say: '断档超 3 天别想着"逐日补卡"——直接从最后一次产出恢复，断档本身不是重来的理由。',
    def: '每日任务断档超过 3 天：不逐日补生成任务，按周复盘口径恢复——读取最后一次产出、重算闸门位置、生成当天任务。健身同理：停练两周不补练，从当前体能重新开始。',
    alias: ['恢复协议', '断档处理'],
    links: [
      { text: '断档恢复协议（规划冲突处理）', link: '/求职研究/规划优先级与冲突处理', anchor: '', from: '求职' },
      { text: '四周计划的降级条款', link: '/求职研究/四周验证计划_2026-09', anchor: '', from: '求职' }
    ],
    rel: [
      { type: 'term', id: 'rest', text: '休息与恢复：主动的休息，被动的断档' },
      { type: 'ext', text: '联想 · 工程：幂等思维——不重放历史，从当前状态前进', link: '/求职研究/方向实验/方向实验一_可靠任务服务' }
    ]
  },
  {
    id: 'rest', cat: 'life',
    name: '休息恢复', en: 'Rest & Recovery', icon: '💪', color: '#fb7185',
    say: '休息才是变强的时刻——训练撕裂肌纤维，休息让它们长粗。',
    def: '恢复是训练计划的一部分，不是偷懒。训练顺序：热身 → 正式 → 放松。课程不失守是第一成功标准：不从睡眠补工时，方向实验可以为课程让路。',
    alias: ['恢复日', '休息才是变强的时刻'],
    links: [
      { text: '恢复与修养：休息才是变强的时刻', link: '/健身指导手册_从入门到进阶', anchor: '#_6-恢复与修养-休息才是变强的时刻', from: '健身' },
      { text: '一次训练的正确顺序', link: '/健身指导手册_从入门到进阶', anchor: '#_3-一次训练的正确顺序', from: '健身' }
    ],
    rel: [
      { type: 'term', id: 'recovery', text: '断档恢复：被动中断后的重启协议' },
      { type: 'ext', text: '联想 · AI：奖励设计里必须有恢复项，否则会"学出过拟合"', link: '/AI学习/强化学习基础速读', anchor: '#_5-reward' }
    ]
  },
  {
    id: 'pccare', cat: 'life',
    name: '电脑保养', en: 'PC Maintenance', icon: '🧹', color: '#fb7185',
    say: '笔记本清灰换硅脂，就像给长跑运动员换气——性能和寿命都在里面。',
    def: '拯救者保养：定期清灰、硅脂老化判断、电池健康维护、风扇策略。性能与寿命的平衡也是"恢复性维护"——设备和人一样需要恢复。',
    alias: ['清灰', '硅脂', '电池健康'],
    links: [
      { text: '联想拯救者电脑保养手册', link: '/联想拯救者电脑保养手册', anchor: '', from: '生活' }
    ],
    rel: [
      { type: 'term', id: 'rest', text: '休息恢复：设备与人的共同逻辑' }
    ]
  },
  {
    id: 'streak', cat: 'life',
    name: '连续打卡', en: 'Streak', icon: '🔥', color: '#fb7185',
    say: '打卡的意义不是数字，是"今天也没有骗自己"——但断一次也别全盘崩溃。',
    def: '站内每日任务执行台记录连续推进天数和 14 天状态条：全清/有推进/未动/无任务。看趋势不看单日——连续天数是激励工具，不是自我惩罚工具。',
    alias: ['打卡', '连续天数', '任务看板'],
    links: [
      { text: '每日任务 · 执行台', link: '/tasks', anchor: '', from: '站内' }
    ],
    rel: [
      { type: 'term', id: 'recovery', text: '断档恢复：打卡断了怎么办' },
      { type: 'ext', text: '联想 · AI：只奖励连续天数会过拟合——奖励设计要有弹性', link: '/AI学习/强化学习基础速读' }
    ]
  }
]
