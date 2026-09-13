# 2025科协暑培 · OM/OR 分享（左捷瑞, BV1R2b8zeEfc, 约21分钟）

> 发布于 2025-08-13；讲师左捷瑞（经管学院信息管理与信息系统专业，即将大四）。

## 定位

全合集唯一非 CS 主线的方向视野讲：经管信管背景讲师介绍运筹学（OR）/运营管理（OM）这门"研究如何做决策"的学科——用线性规划与 multi-armed bandit 两个例子展示学科风格，再讲 OR×CS 前沿、PhD 申请与职业出路。适合想拓宽方向选择或对量化/优化有兴趣的同学。

## 内容脉络

- [0:03] 开场与背景：左捷瑞，大二下起接触 OR，一年多做了几段科研；讲三件事——领域研究什么问题、风格如何、毕业后能干嘛；声明多为个人看法。
- [0:58] 引入场景：滴滴派单策略收益最大化、京东选址让用户一天收货、旅行商最短路径、量化投资组合优化——共同点是复杂约束下做决策；OR 本质=研究如何做决策的学科，偏抽象数学建模、从理论角度刻画。
- [1:56] 归纳 vs 演绎：ML/统计=归纳，从数据学规律，但受样本少、selection bias、相关性≠因果性所限；OR=演绎，给出数学假设后抽象建模找最优决策，故 OR 论文主体是数学推导。
- [2:55] 方法论与应用：经典 OR 方法论=Optimization+applied probability；应用于量化、金融工程、交通、能源、运营管理、机器学习——ML 参数拟合本质就是 OR 的凸优化/随机优化内容；OM=用 OR 方法论研究管理科学问题（供应链/收益/医疗健康管理、机制设计），滴滴派单与京东选址归 OM。
- [4:49] 例子1 线性规划：max cx, s.t. Ax≤B；工厂产 A/B 两产品，约束为每周机器时间≤100 小时、原材料≤120 kg，formulate 成 LP 求解；加"产量须为整数"即整数线性规划（ILP），不同问题各有算法。
- [6:42] 例子2 multi-armed bandit：一排老虎机中奖概率未知，拉杆观察，限次数内最大化 reward expectation——exploration=反复拉动学习隐藏概率；exploitation=发现 1 号概率更高后剩余全拉 1 号（探索之后的利用阶段）。
- [9:00] 数学抽象：各 arm 对应 unknown 的 reward distribution，中奖概率即 distribution 的均值；最优 arm=均值最大者；总时间大 T，每轮小 t 选 arm 拉动并观察 reward。
- [10:22] regret（遗憾）：上帝视角总 reward expectation − 实际策略的 reward expectation；问题本质=exploration/exploitation 的 balance，经典算法如 UCB 采样做 regret minimization；YouTube/淘宝推荐都可建模为 bandit。
- [12:28] OR 前沿=天生交叉：×统计=experiment design/A/B test；×经济=市场机制设计、信息设计；×finance=mechanism design games；×CS=LLM 相关（三个方向名转写不清，存疑）。
- [13:22] CS×OR 研究差异：CS 研究 LLM 关注模型本身（架构、泛化）；OR 关注 LLM 如何嵌入决策过程、为 LLM 更优利用资源提供指导。例1：LLM for large-scale optimization model auto formulation——给 LLM 自然语言自动生成优化模型，降低大规模问题人工建模成本；例2（转写残缺）：用 OR 方法论做缓存有限下的调度优化（存疑）。
- [14:49] PhD 申请：申请者历来多来自数学/统计/CS，商科申 OR 同样要修大量数学课；信管 7 字班王天宇学长在哥伦比亚读 IEOR PhD（top program），课程推荐：optimization theory、统计、概率论、测度论、CS 课程、计量经济学、强化学习；申请以推荐信为主——OR 发 paper 难（做 learning 投会议除外），stochastic modeling 类期刊审稿周期极长，申请前大多没 paper。⏭️可跳过：已读 2026"保研出国"讲者可略申请逻辑，但"OR 发文慢、推荐信主导"是本领域特有信息。
- [16:17] 职业出路：教职——商学院（经管管理科学与工程系）或工业工程系（清华很多老师 OR 背景）；业界——传统运筹（优化/排队论/博弈）对口航空、交通、零售（京东、波音）；data science/AI 交叉则亚马逊、Uber 与 Google/Meta/Microsoft/OpenAI 等 research lab 都招；例：前 Microsoft 副总裁 bill甲（存疑），OR 背景出身的 AI 大佬后被 Google 挖走；OR PhD 去量化也非常多——量化重数学建模，与 OR 高数学要求匹配。
- [18:12] 领域特质与诟病：OR 更接近咨询业——成功应用依附在成熟产业上（早期航空/供应链/交通优化→共享经济→新兴市场，转写存疑），需产业规模化后优化才产生额外价值；OR/OM 提供 theoretical insights 推动 LLM 发展，也反过来用 LLM 优化本领域传统方法；但被诟病学界业界 gap 大（理论假设现实中难成立），community 已在做更贴业界的研究。
- [19:32] 入门资源：知乎（如"钱张老师"，存疑）、微信公众号"运筹帷幄"（较大运筹学中文社区）；看 MIT ORC、Stanford、Michigan、Georgia Tech ISyE、Berkeley IEOR 等院系主页的 research 与老师 paper（转写连读不清，存疑），很多工作很交叉。

## 编者补充

- 编者补充（跨集联系）：exploration/exploitation 与第 12 讲 RL 的"考试蒙题"比喻同源，bandit 相当于无 state 的 RL 最小案例，可作 MDP 前的直觉铺垫；"LLM 自动建模优化问题"与第 12 讲 formal math 同属"LLM×传统学科"前沿；18 讲"找准方向"在本讲落地为信管学生大二下转 OR 的具体样本。
- 编者补充（行动线）：订阅"运筹帷幄"+知乎入门；对 bandit 感兴趣顺 UCB/regret minimization 找综述；认真考虑 OR 则按王天宇课程单先补 optimization theory 与测度论。
- 编者补充（缺口）：OR×CS 三个前沿方向名与第二个 LLM×OR 例子转写残缺，需讲义核对；LP 与 bandit 均只到直觉层；CS 学生转 OR 的路径未展开。

## 勘误对照（本集新发现）

| 转写 | 应为 | 说明 |
|---|---|---|
| 爱单策略 | 派单策略 | 0:58（后文"派单"正确） |
| OA领域 | OR 领域 | 3:23 参数拟合处 |
| 图优化 | 凸优化（存疑） | 3:23，"图/凸"同音致误 |
| COMMITORACOMMITTE | OR community（存疑） | 19:05 |
| ORPG | OR PhD（存疑） | 17:44 量化处 |
| 拉trical model | LLM | 18:39，已知"拉伸model"条变体 |
