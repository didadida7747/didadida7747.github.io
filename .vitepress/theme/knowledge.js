// 站内知识点总库：每日知识点栏目与闯关小游戏的共享数据源。
// 每条知识点 = 最小知识单元（一句话说清一个点），link 精确到原文锚点。
// 锚点规则：VitePress 把中文标题转成 URL 片段（保留中文、空格转 -、去掉标点）。
// 每条可带 quiz: { q, options, answer } —— 有 quiz 的知识点才有资格进入每日挑战出题。

export const PAGE = {
  jizu: '/计算机组成原理_全景导学笔记',
  si100: '/SI100+ 2026夏合集_大二学生学习文档',
  intern: '/实习速成方法论_思路篇与实践篇整合笔记',
  four: '/大学四年自我提升全景手册',
  social: '/大学生向上社交行动手册',
  english: '/英语听说能力12周提升计划',
  invest: '/投资与金融素养入门计划',
  hack: '/黑客松与可交付项目增收行动指南',
  fit: '/健身指导手册_从入门到进阶',
  pc: '/联想拯救者电脑保养手册',
  interview: '/求职面试高频题手册_大二实习版',
  // —— 2026-09 扩充栏目 ——
  emb: '/嵌入式体系/C工程化',
  embmap: '/嵌入式体系/嵌入式能力地图',
  embmetric: '/嵌入式体系/实习指标与故障注入',
  stm: '/STM32工作流/中断模型知识卡',
  uart: '/STM32工作流/UART常见坑检查单',
  ai: '/AI学习/大模型基础速读',
  rl: '/AI学习/强化学习基础速读',
  marl: '/AI学习/多智能体强化学习速读',
  career: '/求职研究/能力矩阵',
  resume: '/求职研究/简历项目写法',
  score: '/求职研究/岗位评分规则'
}

export const KNOWLEDGE = [
  // ============ 计算机组成原理 ============
  {
    text: '整门计组课的地基是「指令」——所有章节都从"什么是指令"展开',
    from: '计组 · 知识主线', link: PAGE.jizu, anchor: '#_0-起点-什么是指令-全课的地基',
    quiz: { q: '整门计组课的"地基"是什么？', options: ['总线', '指令', '存储器', '中断'], answer: 1 }
  },
  {
    text: '计算机是人设计的系统——所以计组应当推理理解，而不是当文科死背',
    from: '计组 · 学习观', link: PAGE.jizu, anchor: '#_1-计算机-注意是-计算机-而不是-大自然-是人设计的',
    quiz: { q: '按笔记的学习观，计组为什么"不是文科"？', options: ['公式特别多', '计算机是人设计的，可以被推理理解', '要背的部件名多', '考试不考名词解释'], answer: 1 }
  },
  {
    text: '中央处理器（CPU）是全课核心、篇幅最大的一章',
    from: '计组 · 第 5 章', link: PAGE.jizu, anchor: '#第-5-章-中央处理器-全课核心-篇幅最大的一章',
    quiz: { q: '计组哪一章是"全课核心、篇幅最大"？', options: ['存储器系统', '指令系统', '中央处理器', '输入输出系统'], answer: 2 }
  },
  {
    text: '一条指令的执行五步：取指 → 译码 → 取数 → 执行 → 存数/写回',
    from: '计组 · 5.1 指令执行过程', link: PAGE.jizu, anchor: '#_5-1-一条指令的执行过程-把大象装进冰箱',
    quiz: { q: '"翻译这条指令让我干嘛"对应指令执行的哪一步？', options: ['取指', '译码', '执行', '写回'], answer: 1 }
  },
  {
    text: 'CPU 的两大部件：运算器（ALU）干活算数，控制器指挥全场',
    from: '计组 · 5.2 CPU 两大部件', link: PAGE.jizu, anchor: '#_5-2-cpu-的两大部件',
    quiz: { q: 'CPU 里"真正干活算数"的是？', options: ['控制器', '运算器（ALU）', '寄存器堆', '总线'], answer: 1 }
  },
  {
    text: '教材经典划分把机器周期分为：取指、间址、执行、中断四个周期',
    from: '计组 · 5.1 指令执行过程', link: PAGE.jizu, anchor: '#_5-1-一条指令的执行过程-把大象装进冰箱'
  },
  {
    text: '"中断"放在最后是因为：每条指令执行结束，CPU 要检查一次有没有中断请求',
    from: '计组 · 5.1 指令执行过程', link: PAGE.jizu, anchor: '#_5-1-一条指令的执行过程-把大象装进冰箱'
  },
  {
    text: '计组有四条贯穿全课的暗线，是编者自己的提炼而非教材原文',
    from: '计组 · 四条暗线', link: PAGE.jizu, anchor: '#四、贯穿全课的四条暗线-编者的思考',
    quiz: { q: '"四条暗线"是教材自带的吗？', options: ['是，视频原课程就有', '不是，是编者自己提炼的', '是考纲内容', '是考研书里的'], answer: 1 }
  },
  {
    text: '自测过关标准是"能秒答"，而不是能默写',
    from: '计组 · 自测清单', link: PAGE.jizu, anchor: '#六、自测清单-能秒答-这部分过关',
    quiz: { q: '计组自测清单的过关标准是什么？', options: ['能抄写', '能秒答', '能默写整章', '能做全部习题'], answer: 1 }
  },

  // ============ SI100+ / Python ============
  {
    text: 'Lec 顺序：变量表达式 → 函数 → 控制流 → Python 进阶，一环扣一环',
    from: 'SI100+ · 课程线', link: PAGE.si100, anchor: '#二、知识课要点-lec-00–07-intro',
    quiz: { q: 'Lec.04 之后紧接的一讲是？', options: ['Lec.05 函数', 'Lec.06 控制流', 'Lec.07 进阶', 'Lec.03 简介'], answer: 0 }
  },
  {
    text: '《一些重要的计算机素养》是合集播放量最高的一集（5.8 万）',
    from: 'SI100+ · 素养', link: PAGE.si100, anchor: '#_16-一些重要的计算机素养-bv1su8t6megd-40-min-合集播放量最高-5-8万',
    quiz: { q: '合集里播放量最高的一集讲的是？', options: ['培养方案解读', '科研经验分享', '一些重要的计算机素养', '嵌入式系统漫游'], answer: 2 }
  },
  {
    text: '搜索解决问题的能力被编入「全年贯穿：素养与工具」行动线',
    from: 'SI100+ · 行动线', link: PAGE.si100, anchor: '#四、把-18-集编织成三条行动线-我的统筹观点'
  },
  {
    text: '大二上学期主线是定位与选课，大二下是进组与第一段科研',
    from: 'SI100+ · 行动线', link: PAGE.si100, anchor: '#四、把-18-集编织成三条行动线-我的统筹观点',
    quiz: { q: '按笔记行动线，大二下学期的主线是？', options: ['定位与选课', '进组与第一段科研', '实习冲刺', '刷绩点'], answer: 1 }
  },

  // ============ 实习速成 ============
  {
    text: '找实习是期末考，不是高考——可控、可准备、可再来',
    from: '实习速成 · 重构一', link: PAGE.intern, anchor: '#_1-重构一-找实习是期末考-不是高考',
    quiz: { q: '笔记的"重构一"说找实习是？', options: ['高考，一次定终身', '期末考，可反复准备重修', '随堂小测', '开卷考试'], answer: 1 }
  },
  {
    text: '实习 offer 极看运气，策略是用数量对抗概率',
    from: '实习速成 · 重构二', link: PAGE.intern, anchor: '#_2-重构二-实习求职极看运气-→-用数量对抗概率',
    quiz: { q: '对抗求职运气成分的策略是？', options: ['等内推', '用数量对抗概率', '只投大厂', '简历改到完美再投'], answer: 1 }
  },
  {
    text: '面试是随堂小测，不是期末（第二定律）——考的是近期积累',
    from: '实习速成 · 重构三', link: PAGE.intern, anchor: '#_3-重构三-面试是随堂小测-不是期末-第二定律',
    quiz: { q: '"面试是随堂小测"对应笔记的？', options: ['第一定律', '第二定律', '第三定律', '兼容性原则'], answer: 1 }
  },
  {
    text: '简历 = 学习清单：想被问什么，就写什么',
    from: '实习速成 · 简历', link: PAGE.intern, anchor: '#五、执行层·简历-讲二为主-简历-学习清单',
    quiz: { q: '笔记把简历比喻成什么？', options: ['成绩单', '广告传单', '学习清单', '档案袋'], answer: 2 }
  },
  {
    text: '选赛道要守「兼容性原则」，而不是只看薪资上限',
    from: '实习速成 · 赛道', link: PAGE.intern, anchor: '#_2-兼容性原则-作者以亲身经历强调',
    quiz: { q: '赛道选择的关键原则是？', options: ['只看薪资上限', '兼容性原则', '跟风热门', '离家近优先'], answer: 1 }
  },
  {
    text: '项目准备用「逐字倒推追问树」，可覆盖九成面试追问',
    from: '实习速成 · 项目', link: PAGE.intern, anchor: '#_3-准备方法-逐字倒推追问树-覆盖九成面试问题'
  },

  // ============ 求职面试高频题（新文档） ============
  {
    text: 'TCP 面向连接、可靠交付、面向字节流；UDP 无连接、尽最大努力交付、面向报文',
    from: '面试题 · 网络', link: PAGE.interview, anchor: '#_1-tcp-和-udp-的区别-出现率几乎-100',
    quiz: { q: '【面试模拟】TCP 与 UDP 的区别，下列说法错误的是？', options: ['TCP 面向连接，UDP 无连接', 'TCP 可靠，UDP 尽最大努力交付', 'UDP 比 TCP 更适合文件传输', 'TCP 首部至少 20 字节，UDP 仅 8 字节'], answer: 2 }
  },
  {
    text: '三次握手才能确认双方的收发能力正常，并防止失效连接请求建立错误连接',
    from: '面试题 · 网络', link: PAGE.interview, anchor: '#_2-tcp-为什么是三次握手-不是两次',
    quiz: { q: '【面试模拟】TCP 为什么是三次握手而不是两次？', options: ['省一个报文', '两次无法确认双方收发能力，且可能被失效请求干扰', '三次是为了加密', '协议规定，没有原因'], answer: 1 }
  },
  {
    text: '挥手要四次：TCP 全双工，服务端的 ACK 和 FIN 之间可能还有数据要发',
    from: '面试题 · 网络', link: PAGE.interview, anchor: '#3-tcp-为什么挥手要四次',
    quiz: { q: '【面试模拟】TCP 挥手为什么四次比握手多一次？', options: ['因为要断开两个方向的数据通道，ACK 和 FIN 常分开发', '因为客户端更慢', '防止黑客攻击', '其实是三次，说四次是误传'], answer: 0 }
  },
  {
    text: 'TIME-WAIT 等 2MSL：保证最后的 ACK 可达，并让旧报文在网络中消失',
    from: '面试题 · 网络', link: PAGE.interview, anchor: '#_4-time-wait-为什么要等-2msl'
  },
  {
    text: 'HTTP 状态码五类：1xx 信息 / 2xx 成功 / 3xx 重定向 / 4xx 客户端错 / 5xx 服务端错',
    from: '面试题 · 网络', link: PAGE.interview, anchor: '#_5-http-常见状态码',
    quiz: { q: '【面试模拟】404、502 分别属于哪类问题？', options: ['都是客户端错', '都是服务端错', '404 客户端请求了不存在的资源，502 服务端网关错误', '404 服务端错，502 客户端错'], answer: 2 }
  },
  {
    text: '进程是资源分配的独立单位，线程是资源调度的独立单位',
    from: '面试题 · 操作系统', link: PAGE.interview, anchor: '#_1-进程和线程的区别-出现率几乎-100',
    quiz: { q: '【面试模拟】进程和线程的区别，正确的是？', options: ['线程是资源分配的独立单位', '进程是资源分配的独立单位，线程是调度的独立单位', '线程有独立地址空间', '进程切换比线程快'], answer: 1 }
  },
  {
    text: 'IPC 五大方式：管道、信号量、消息队列、共享内存（最快）、套接字',
    from: '面试题 · 操作系统', link: PAGE.interview, anchor: '#_2-进程间通信方式-ipc-有哪些',
    quiz: { q: '【面试模拟】哪种进程间通信方式最快？', options: ['管道', '消息队列', '共享内存', '套接字'], answer: 2 }
  },
  {
    text: '死锁四条件：互斥、请求和保持、不剥夺、环路等待——破坏其一即可预防',
    from: '面试题 · 操作系统', link: PAGE.interview, anchor: '#3-死锁产生的四个必要条件',
    quiz: { q: '【面试模拟】下列哪项不属于死锁的四个必要条件？', options: ['互斥', '环路等待', '抢占调度', '请求和保持'], answer: 2 }
  },
  {
    text: '排序算法记三个：快排平均 O(n log n)但不稳定，归并稳定，堆排最坏也是 O(n log n)',
    from: '面试题 · 数据结构', link: PAGE.interview, anchor: '#_1-常见排序算法复杂度-必考',
    quiz: { q: '【面试模拟】关于排序算法，正确的是？', options: ['快排最坏也是 O(n log n)', '归并排序是稳定排序', '冒泡排序是 O(n log n)', '堆排是稳定排序'], answer: 1 }
  },
  {
    text: '自我介绍 1 分钟结构：我是谁 → 做过什么（1-2 个具体成果）→ 为什么来',
    from: '面试题 · HR', link: PAGE.interview, anchor: '#_1-自我介绍-1-分钟版怎么准备',
    quiz: { q: '【面试模拟】1 分钟自我介绍的最佳结构是？', options: ['从小学经历讲起', '我是谁 → 具体成果 → 为什么来', '只讲兴趣爱好', '背诵简历全文'], answer: 1 }
  },
  {
    text: '没做过项目就诚实承认 + 讲清自驱小项目；用"追问树"准备：为什么做→怎么做→坑→学到什么',
    from: '面试题 · HR', link: PAGE.interview, anchor: '#_2-你有什么项目经历-——大二没做过项目怎么答',
    quiz: { q: '【面试模拟】被问"项目经历"但没有正式项目时，更好的回应是？', options: ['编一个项目', '诚实说明 + 讲课程作业或自驱 demo 的拆解过程', '直接说没有', '转移话题聊成绩'], answer: 1 }
  },

  // ============ 四年规划 / 社交 / 生活 ============
  {
    text: '大学提升七板块：学业 / 能力 / 实践 / 关系 / 身心 / 生活 / 方向',
    from: '四年手册 · 总框架', link: PAGE.four, anchor: '#一、总框架-大学提升的七个板块',
    quiz: { q: '大学提升总框架分为几个板块？', options: ['五个', '六个', '七个', '八个'], answer: 2 }
  },
  {
    text: '向上社交不是攀附，而是跨经验层级的合作',
    from: '向上社交 · 结论', link: PAGE.social, anchor: '#一、先给结论-向上社交不是-攀附-而是跨经验层级合作',
    quiz: { q: '笔记如何定义"向上社交"？', options: ['攀附大佬', '跨经验层级的合作', '利益交换', '广撒网加好友'], answer: 1 }
  },
  {
    text: '第一次联系大佬：用七步降低对方的回复成本',
    from: '向上社交 · 首联', link: PAGE.social, anchor: '#四、第一次联系-七步降低对方回复成本'
  },
  {
    text: '英语听说：先判断起点，再进入每天的固定训练闭环',
    from: '英语 12 周 · 起点', link: PAGE.english, anchor: '#一-先判断自己的起点'
  },
  {
    text: '投资入门先记住 8 条边界，再谈收益',
    from: '投资素养 · 边界', link: PAGE.invest, anchor: '#一、先记住-8-条边界',
    quiz: { q: '投资入门计划的第一步是？', options: ['选牛股', '记住 8 条边界', '学 K 线', '研究宏观'], answer: 1 }
  },
  {
    text: '黑客松收入不能只押一种路径，也不能当稳定副业',
    from: '黑客松 · 结论', link: PAGE.hack, anchor: '#一、结论-可行-但不能把黑客松当稳定副业'
  },
  {
    text: '休息才是变强的时刻：恢复是训练计划的一部分',
    from: '健身手册 · 恢复', link: PAGE.fit, anchor: '#_6-恢复与修养-休息才是变强的时刻',
    quiz: { q: '健身笔记里"变强的时刻"指？', options: ['训练时', '休息恢复时', '吃补剂时', '冲重量时'], answer: 1 }
  },
  {
    text: '一次训练的正确顺序：热身 → 正式训练 → 放松整理',
    from: '健身手册 · 顺序', link: PAGE.fit, anchor: '#_3-一次训练的正确顺序'
  },

  // ============ 嵌入式体系（2026-09 扩充） ============
  {
    text: '嵌入式课程按依赖排序：C 工程化 → STM32 → 通信协议 → FreeRTOS → Linux/C++ → ROS2，每单元以"离开条件"验收',
    from: '嵌入式 · 能力体系', link: PAGE.embmap, anchor: '#条件能力',
    quiz: { q: '嵌入式课程体系用什么标准判断"学完一单元"？', options: ['看完视频', '满足离开条件（能独立交付的验收标准）', '做完所有习题', '考试及格'], answer: 1 }
  },
  {
    text: 'C 工程化要跨越的是"会语法"到"会拆模块"：driver/service/app 分层，题目代码和项目代码差在工程组织',
    from: '嵌入式 · C 工程化', link: PAGE.emb, anchor: '#这一单元解决什么',
    quiz: { q: 'C 工程化单元要解决的核心跨越是？', options: ['背熟语法', '从会语法到会拆模块', '刷够题量', '换更好的 IDE'], answer: 1 }
  },
  {
    text: '嵌入式项目交付要量化：周期抖动、丢失率、吞吐、RAM/CPU 占用、恢复时间——说得出数才算数',
    from: '嵌入式 · 项目指标', link: PAGE.embmetric, anchor: '#性能指标',
    quiz: { q: '嵌入式项目"做完了"的判断依据是？', options: ['功能能跑就行', '代码量足够大', '量化指标达标（抖动/丢失率/吞吐等）', '界面好看'], answer: 2 }
  },
  {
    text: '中断五步核心理解：外设提出请求 → NVIC 仲裁优先级 → CPU 进 ISR → ISR 尽量短 → 复杂处理下放主循环',
    from: 'STM32 · 中断模型', link: PAGE.stm, anchor: '#你要建立的核心理解',
    quiz: { q: '中断服务函数（ISR）的编写原则是？', options: ['越复杂越好，一次做完', '尽量短，复杂处理下放主循环或任务', '必须包含 printf 打印', '和普通函数没有区别'], answer: 1 }
  },
  {
    text: '中断四大常见误区：只开外设中断没开 NVIC、清标志位顺序不对、ISR 里做耗时打印、忘记 volatile',
    from: 'STM32 · 中断误区', link: PAGE.stm, anchor: '#常见误区',
    quiz: { q: '"中断进了但一次都不触发"，最常见的原因是？', options: ['波特率配错', '只开了外设中断，没开 NVIC 使能', '堆栈太小', '主循环太长'], answer: 1 }
  },
  {
    text: '串口不出字先查六项：引脚复用、外设时钟、波特率基准时钟、NVIC 使能、缓冲区生命周期、printf 重定向',
    from: 'STM32 · UART 排查', link: PAGE.uart, anchor: '#快速检查项',
    quiz: { q: 'UART 没有输出，第一个不该忽略的检查项是？', options: ['换根串口线', '外设时钟是否开启', '重装系统', '降低波特率'], answer: 1 }
  },

  // ============ AI 学习（2026-09 扩充） ============
  {
    text: '模型不直接理解汉字或单词：文本先切成最小处理单元 token，编号化后再变成向量（embedding）',
    from: 'AI · 大模型', link: PAGE.ai, anchor: '#_1-token',
    quiz: { q: '大模型处理文本的第一步是？', options: ['直接理解句子含义', '切成最小处理单元 token 并向量化', '翻译成英文', '压缩成摘要'], answer: 1 }
  },
  {
    text: '注意力的 Q/K/V 直觉：Q 是我想找什么，K 是我这里有什么可匹配，V 是真正传递的内容',
    from: 'AI · 大模型', link: PAGE.ai, anchor: '#_4-q-k-v',
    quiz: { q: '注意力机制中"真正被传递的内容"是？', options: ['Q', 'K', 'V', 'softmax 分数'], answer: 2 }
  },
  {
    text: 'reward 不直接给正确答案，只告诉你当前行为是更好还是更差',
    from: 'AI · 强化学习', link: PAGE.rl, anchor: '#_5-reward',
    quiz: { q: '强化学习中 reward 的作用是？', options: ['给出标准答案', '告诉智能体当前行为更好还是更差', '代替损失函数', '随机扰动'], answer: 1 }
  },
  {
    text: 'policy 是"看到什么情况倾向做什么"的规则；return 是一段时间累计总回报，不是单步奖励',
    from: 'AI · 强化学习', link: PAGE.rl, anchor: '#_6-policy',
    quiz: { q: '强化学习里"return"指的是？', options: ['单步奖励', '一段时间内累计总回报', '函数返回值', '奖励的方差'], answer: 1 }
  },
  {
    text: 'MARL 的 CTDE 范式：训练时集中化（Centralized），执行时分散化（Decentralized）',
    from: 'AI · 多智能体', link: PAGE.marl, anchor: '#ctde',
    quiz: { q: 'CTDE 缩写的含义是？', options: ['训练集中、执行分散', '训练分散、执行集中', '训练执行都集中', '训练执行都分散'], answer: 0 }
  },

  // ============ 求职研究（2026-09 扩充） ============
  {
    text: '能力分三级证据：只算接触 / 可写进项目 / 可投实习——达到投递线要看证据等级，不看"学过"',
    from: '求职 · 能力标准', link: PAGE.career, anchor: '#公共底座',
    quiz: { q: '"会 Python"要达到可投实习线，公共底座的要求是？', options: ['看过基础语法视频', '能处理 JSON/CSV/日志、管环境、调试 traceback', '会 print 就行', '背过八股'], answer: 1 }
  },
  {
    text: '简历项目写法核心是"弱表达→强表达"：把"参与了/学习了"换成"实现了什么、指标如何"',
    from: '求职 · 简历', link: PAGE.resume, anchor: '#弱表达与强表达',
    quiz: { q: '下列哪种写法属于"强表达"？', options: ['参与了 STM32 项目', '学习了 FreeRTOS', '实现了采集控制器，周期抖动 <5%，丢失率 <1%', '熟悉 C 语言'], answer: 2 }
  },
  {
    text: '岗位六维评分：真实性/时效性/匹配度/差距/可行性/质量，加权得 P 值再分 P0-P3 优先级',
    from: '求职 · 岗位运营', link: PAGE.score, anchor: '#六项评分',
    quiz: { q: '岗位评分体系中"P0"代表？', options: ['必须放弃', '最低优先级', '最高优先级，尽快复核投递', '已过期岗位'], answer: 2 }
  }
]

// 每日知识点：以日期为种子抽 n 条，当天固定
export function dailyPick(seedStr, n) {
  let h = 2166136261
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  const rand = () => {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    return ((h >>> 0) % 10000) / 10000
  }
  const arr = [...KNOWLEDGE]
  const out = []
  while (out.length < n && arr.length) out.push(arr.splice(Math.floor(rand() * arr.length), 1)[0])
  return out
}

// 每日挑战出题：优先从带 quiz 的知识点生成（今天的知识点优先，凑不够则从全题库补）
export function buildDailyDeck(seedStr, n) {
  const quizPool = KNOWLEDGE.filter(k => k.quiz)
  const todaySet = new Set(dailyPick(seedStr, 10).map(k => k.text))
  const todays = quizPool.filter(k => todaySet.has(k.text))
  const rest = quizPool.filter(k => !todaySet.has(k.text))
  // 用另一种子从剩余题库补足
  let h = 5381
  for (let i = 0; i < seedStr.length; i++) h = (Math.imul(h, 33) ^ seedStr.charCodeAt(i)) >>> 0
  const rand = () => {
    h ^= h << 13; h ^= h >>> 17; h ^= h << 5
    return (h >>> 0) / 4294967296
  }
  const out = [...todays]
  while (out.length < n && rest.length) out.push(rest.splice(Math.floor(rand() * rest.length), 1)[0])
  return out.map(k => ({ ...k.quiz, topic: k.from.split(' · ')[0], source: { text: k.text, link: k.link + (k.anchor || ''), from: k.from } }))
}

export function todaySeed() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}
