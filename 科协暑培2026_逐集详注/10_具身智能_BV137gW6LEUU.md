# 2026科协暑培 · 第10讲 具身智能：从 VLA 到 World Action Model（李少轩, BV137gW6LEUU）

## 定位

AI Track 第六讲。具身智能覆盖面极广（多模态理解、传统机器人学、LLM 先验），本讲只从宏观过一遍，但选了一个聪明的切入：以一个具体的 world action model（转写作 "motors"，名字存疑，架构为 Mixture-of-Transformers）为出发点串起整条技术路线。适合作为具身方向的"地图/目录"讲；diffusion policy 一节依赖第 9 讲。约 40 分钟。讲义 https://summer26.net9.org/ai/embodied/ 。

## 知识整理

### 任务闭环与四类建模接口

以"把蓝色杯子放进篮子"为例：机器人只有 head camera，循环是"看懂（语义与空间对齐）→ 想象（动作后的未来世界）→ 行动（policy 输出 action chunk 张量交给控制器）→ 新观测回到循环"，自回归地转起来。四类建模接口：①**policy**（观测+指令→动作，接口最简单、推理最快）；②**world model**（观测+动作→预测未来场景，理解世界运行规律）；③**inverse dynamic model/IDM**（逆动力学：由世界变化反推该输入什么动作）；④**video generation model**（指令+当前观测→生成未来视频，如 Seedance、Veo 一类）。WAM 的建模是：当前一帧观测+指令，同时联合输出未来一段视频和一个 action chunk——联合建模理论上效果更好。

### MoT 架构：三个 expert 与 joint attention

motors 采用 mixture-of-transformers 架构：understanding expert（由 Qwen3-VL 改出）、video generation expert（基于通义万相 Wan）、action expert（与 Wan 相同深度的 transformer 分支）。每个 expert 保留自己的 norm 和 MLP，只在 attention 层做 joint attention：每个模态的 Q 能 attend 到所有模态的 K/V，信息在每一层跨模态流动。

这个模型等于给出了一张具身智能的"地图/目录"，由此引出后续各问题：理解（VLM、ViT、DINO）、动作（behavior cloning、action chunk、diffusion policy、DiT、flow matching）、视频策略/world model、latent action。

### Understanding expert 与 VLA

ViT 把图像 patchify 成 token 序列过 transformer；Qwen-VL 把视觉 token 拼进千问 LLM 作前缀序列，Flamingo 则用 cross attention。常用视觉编码器：DINO（物体结构/轮廓感知敏锐）、CLIP/SigLIP（图文对齐强）。VLA 的最简做法：把 VLM 输出的 language token 换成 action token 去训练——OpenVLA 就是图像观测过 DINO+SigLIP，投影后连指令一起作为前缀喂给 Llama，decode 出 action token 再解码成具体关节角。代表模型：OpenVLA、RDT-1B、Physical Intelligence 的 π 系列（已到 π0.7）；motors 不严格算 VLA，但可以表现为 VLA 形式。

### 行为克隆及其两大缺陷

传统机器人学的 behavior cloning 非常像 SFT：用专家示范数据，最大似然训练让专家动作出现概率最大。问题一：MSE 会把多个动作模式压成均值——"数据中一半从左绕、一半从右边绕过去，均值一下你就直接从中间走过去"。问题二：训练只见过专家状态（正确分布），部署时策略自己生成分布，手一旦"飞到天上"就没见过、不知所措（协变量偏移）；DAgger（离线问专家）与 HG-DAgger（在线收集纠正动作）就是为缩小这个分布差。实用 tips："你不能只给正确的数据，你还要给一些非常烂的数据，这样才能训出非常鲁棒的模型。"

### Diffusion policy 与 flow matching

BC 的均值问题引出 diffusion policy——它天然支持动作的多模态性（同一条件下多种输出都对，类比文生图：生成泰迪或贵宾都算狗；注意这与多模态大模型的"多模态"不是一回事）。训练时给真实动作加噪、让模型预测噪声，推理时从随机噪声出发逐步去噪（公式细节见第 9 讲）。motors 用的是 flow matching，准确说 rectified flow：与 diffusion 数学原理相近，但把 SDE 换成 ODE，好处是连续建模、训练更稳、可少步采样；π 和 motors 都用这条路。

### 利用"预测未来"的三条路线与 latent action

路线一：VLA 直接策略，与预测未来无关。路线二：视频规划（如 UniPi）——先生成未来观测视频，再用 IDM 反解动作；缺点是两级偏差叠加、两步推理慢且有前后依赖。路线三：latent action——如 LAPA 用 VQ-VAE 一类结构从相邻帧学出潜在动作（也有光流等方法），先用海量无动作标签的视频 scale 起来，再用少量带真实动作的数据对齐；动机是"互联网上纯 action 数据极少而视频极多"——YouTube 上"人把一个物体拿到另一个物体上面"的视频就可以作为训练语料。

motors 是集大成者：三个 expert + 两阶段训练安排 + 用光流（optical flow）作为 pixel 级 delta action 充当 latent action 表示，encoder 压缩 flow 成 latent action、decoder 重建对齐，类似 VAE 的 reconstruction loss。

### 数据金字塔与跨本体

数据是阻挡具身智能发展的关键因素：网上文本、视频多，action 数据少，且机器人型号不同导致数据无法跨本体。motors 建了数据金字塔（自底向上）：web 数据（文本/视频）→ ego-centric 人类手部视频 → 合成数据 → 非当前任务的机器人数据 → 其他机器人做同任务 → 最顶层的当前机器人+当前任务轨迹数据。训练流程分阶段：先用 web data 训 VLM 和视频生成模型，再用操作域相关视频继续训视频生成模型，然后冻结 VLM、用大量 latent action 训三个 expert（重点 action 分支），最后在目标机器人目标任务上微调。跨本体问题的代表性尝试是 Open X-Embodiment：统一数据格式、存相对量而非绝对关节参数——但仍是未解决的开放问题。

### 强化学习收尾与论文地图

BC=SFT 只学了训练分布下的动作；DAgger 家族靠问专家缩小分布差；RL 则允许自主探索、用 reward 优化。传统 Q-learning 估计"当前 state 下采取某 action 后的未来折扣回报 G"，rollout 时选 Q 最大的动作；现在机器人领域常用 actor-critic 类算法（大模型里的 PPO、还有 SAC）。

讲者给的论文清单按主题：宏观（motors 类具身基模文献）、多模态（ViT、DINO、OpenVLA、π）、生成式动作（DDPM、DDIM、CFG、latent diffusion、DiT、diffusion policy）、视频策略与 latent action（UniPi、VPP 等）、WAM（motors、DreamZero 等）、DAgger 家族、IL 与机器人 RL、数据与模拟器（Open X-Embodiment、RoboTwin 2.0）。入门建议：选一个有名的 WAM/VLA 模型弄懂它怎么运作，把"它还做不好什么"assign 到具体缺点上，带着这些问题去读文献。

## 勘误对照

| 转写 | 应为 |
|---|---|
| MOSES/MOTI/MOTTOS | 与 motors 同一模型名的转写变体（真名需对照讲义，存疑） |
| 千万 | 千问（Qwen/Qwen-VL） |
| action pert | action expert |
| see dance/we do | Seedance / Veo |
| V1A | VLA |
| PREFU | prefix |
| lava | Llama |
| ST | SFT（存疑） |
| MMSE | MLE（最大似然估计） |
| DEFUSION 的 SDE 变成 ODEE | diffusion / ODE |
| 派灵/派领/派 | π（Physical Intelligence） |
| reaction model | world action model（存疑） |
| VAVAE | VQ-VAE（存疑） |
| sending expert | understanding expert |
| Q棱镜 | Q-learning |
| 巨神机膜 | 具身基模 |
| open vil a | OpenVLA |
| 懒杯 | 蓝杯 |
| pacify | patchify |
| 例举 | 关节角 |
| 最大自然 | 最大似然 |
| 相连针/针 | 相邻帧/帧 |
| 句式/军人正能 | 具身 |
| 筋膜 | 基模 |
| Target rol | Target robot |
| action 分值 | action 分支 |
| 235 235/L6/维达尔C/0 bt va/fledagger | 无法辨识（存疑，需对照讲义） |

## 编者补充

- 编者补充（跨集联系）：第 9 讲 diffusion 入门是本讲 diffusion policy / rectified flow 的数学前置，讲者在 17:40 与 26:11 两处明确回指；科研二讲者康梓林正是做机器人 RL（许华哲组），其"跨本体迁移"首项目与本讲"跨本体开放问题"直接呼应。
- 编者补充（行动线）：按讲者给的入门路径实操——到课程主页拿讲义，在仿真环境（RoboTwin 2.0 等）里跑通一个开源 VLA/WAM，亲手复现"观测→想象→动作"闭环；并用"assign 缺点"读书法：选定 OpenVLA 或 π，列出现阶段失败模式，再按缺点检索论文。
- 编者补充（缺口）：全讲核心模型名转写严重不稳定（motors/MOTIST/MOSES/MOTI/MOTTOS 五种变体），引用其论文前必须对照讲义确认真名；论文清单、数据金字塔配图、latent action 训练细节在转写里只有口播，完整链接与图示需到讲义获取。
