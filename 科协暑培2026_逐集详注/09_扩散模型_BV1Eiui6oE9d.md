# 2026科协暑培 · 第9讲 扩散模型：从入门到精通（刘青乐, BV1Eiui6oE9d）

## 定位

AI Track 第五讲，全合集单讲信息量最大的一份（约 54 分钟）：VAE → DDPM → DDIM → score/SDE/Flow Matching → 条件生成与蒸馏 → 架构演进 → 视频生成 → 前沿。讲者是清华计算机系大三本科生，声明学过本科数学与概率论即可跟。全讲主线是"每代方法的卡点是什么、怎么破"——适合想建立生成模型全景的读者；推导细节大量"直接上结论"，需配讲义 https://summer26.net9.org/ai/diffusion/ 。

## 知识整理

### VAE：一个积分堵住两条路

真实数据服从未知的 p_data，用网络学近似分布并最大化各样本概率密度之积（取 log 防下溢）。VAE 引入隐空间 latent space 与隐变量，但面临两难——后验 p(z|x) 与似然 p_θ(x) 都被同一个积分卡死。解法是用另一网络 q_φ（encoder）近似后验，借助 KL 散度推出 ELBO = log p_θ(x) − KL ≥ 的形式：因 KL 非负故为下界，"变分"即变一个分布去优化。ELBO 拆成重建项 + 规范项（KL 有闭式解），encoder/decoder 协同训练，生成时直接从隐空间采样。

### DDPM：加噪足以学会"造"

核心直觉——"不断加噪让图片越来越花，这个过程能不能就足够让模型学会去造？听起来挺不可思议，但 Diffusion 就是在做这样一件事。"前向是马尔可夫加噪链 x_t = √(1−β_t)·x_{t−1} + √β_t·ε，令 α_t = 1−β_t 后可重参数化为从 x_0 一步到任意 t（ᾱ_T 累积乘积）。反向 p_θ 不可算，但补上条件 x_0 后经贝叶斯公式 + 高斯展开配系数（解出 μ̃_t、β̃_t）得到精确后验。负对数似然是 T 重积分不可算，套用 VAE 思路加非负 KL 项推得 VLB，分解为 L_T+…+L_0，KL 闭式解使其化为带系数 MSE；论文实验发现把系数全扔掉效果更好——网络成为"噪声学习器"即可完成训练与逐步采样。

### DDIM：砍掉随机性换跳步

T≈1000 步太慢，想跳步。把 x_0 反解后代入推进式得到 t→t−1 关系；当 σ_T = √β̃_T 时与 DDPM 完全一致，而 DDIM 大胆令 σ² = η²·β̃_t（η 可调），η=0 时砍掉随机扰动项，去噪路径变为确定性的，可从 1000→900→…→0 跳步。代价是需构建非马尔可夫联合分布（多出 σ 一个自由度）；DDIM 定理保证无论 σ 取何值，都存在系数 γ 使 L_VLB 与 DDPM 的损失一致——即**训练完全沿用 DDPM，只改采样即可加速**。

### Score、SDE 与 Flow Matching：三种学习目标的统一

score = ∇log p(x)，指明概率密度上升最快的方向；对加噪公式两边取梯度可得 score = −ε/系数，故 noise 学习器本质是 score 学习器——"把整个分布想象成一个向量场，score 就是当前位置指向概率密度上升最快的那个'小念头'"。SDE 用漂移项+扩散项建模加噪、用 score 建模去噪，并给出概率流 ODE；可视化显示 DDPM 轨迹因随机扰动而杂乱、DDIM 轨迹平滑。Flow Matching 更进一步：不绕道 score，直接以噪声 x_0 与数据 x_1 的插值对 t 求导作为"速度"学习目标，把生成变成解 ODE。小结四种理解：学噪声→算均值、学 score→梯度上升、学速度→解 ODE/SDE、概率论视角→分布搬运。

### 条件生成与蒸馏加速

classifier guidance 用贝叶斯展开出的分类器梯度项（乘系数控制"听话程度"）；classifier-free guidance（CFG）不训分类器——训练时以一定概率丢弃条件 y，让单一模型同时具备条件/无条件两种 score，讲者称此思路"非常优美"。蒸馏加速三条线：progressive distillation（老师两步并学生一步、反复对半）、consistency model（确定性 ODE 路径上任意点映射到终点应一致，以此作监督）、DMD（学生 fake 分布对齐老师 real 分布，KL 梯度化为两个 score 之差，匹配分布而非逐图对应，泛化更稳）。

### 架构演进：从 U-Net 到 MMDiT

U-Net（CNN 式下/上采样 + 跳跃连接防信息丢失）→ LDM（在压缩的 latent 空间做扩散，规避 1024×1024 像素空间过慢；条件经 cross-attention 注入）→ unCLIP（借助 CLIP 图/文编码器，先经 prior 再扩散解码）→ Imagen（级联：小图逐级放大，任务拆解降难度）→ DiT（patch 化 + adaLN：条件经 MLP 输出系数做 scale/shift/gating）→ MMDiT（文本 context 与图像 embedding 拼接 QKV 做 self-attention）。SD3 是 MMDiT 的成熟工程形态（多 encoder 编码 caption、区分长期目标 y 与短期 context c）。

### 视频生成

难点是帧间连贯性与维度增加导致的计算成本飙升。VDM 的"3D"是 2D 图 + 1D 时间轴而非空间 3D；时空分离 attention（时间层与空间层分开做）把 (F×H×W)² 成本降为线性。Make-A-Video：文本 → 低帧率短视频 → 帧插值 → 高分辨率合成，与 Imagen 同样的任务拆解思想；Imagen Video、Video LDM 把已验证的图片生成器迁移到视频；Sora 将视频切成时空 patch 用 DiT 做 attention。

### 前沿四条线

①**双向生成 → AR 流式生成**：CausVid（2024，MIT 等团队）把双向老师蒸馏成单向 AR 模型；Self Forcing 解决训练见真数据、生成见自己输出的不匹配（偏移累积）；CausForcing（存疑）在其上进一步。②**Memory 与 efficiency** 一体两面、是 trade-off：LongLive 流式生成只保留最近 token。③**统一模型与世界模型**：用生成模型做理解任务、同时会生成/理解/动作；world model 联合训练动作与视频网络、用预测的未来状态校验动作。④**经典概念迁移**：一步去噪可视为一条完整 MDP 轨迹 → Diffusion RL、Diffusion DPO；on-policy distillation 让模型自己走、老师纠正且可多师学习；Diffusion LM 把 token-by-token 生成变成扩散过程——2026 年 ICML best paper 给了清华黄高老师组的 DLM 工作。另有 editing、高分辨率、3D/4D 等未及展开。

## 勘误对照

| 转写 | 应为 |
|---|---|
| DEUSION/DECOCTION/defasion/DPTION | Diffusion |
| unit/google net/learn net | U-Net / GoogLeNet / LeNet |
| 下移/上传 | 下采样/上采样 |
| K难度/KO3个公式/K散数 | KL 散度 |
| CLASSIFIL/class file | classifier |
| very very blower bound | variational lower bound |
| flow mansion/FMH | Flow Matching / FM |
| 真用力加速/把老师争了一半 | 蒸馏加速 / 蒸 |
| on clip | unCLIP |
| imagine/imagine video | Imagen / Imagen Video |
| DIAT/dt block | DiT / DiT block |
| MIDIT | MMDiT |
| Z3 | SD3 |
| VLOG | block |
| contact（embedding） | context |
| LEN/雷雷en/listen | latent |
| 排序法 | patch 化 |
| 多么开的电梯 | 多模态的 DiT |
| process tention | cross-attention |
| V6/V69分sion model | video / Video Diffusion Model |
| 插针 | 插值 |
| COSWEED/m i it | CausVid / MIT |
| self force/cell fing/call of force | Self Forcing / CausForcing（存疑） |
| long life | LongLive |
| 剧情/巨神智能 | 具身 |
| C大/C塔/PC塔X/4G网络/q five | θ / p_θ(x) / θ 网络 / q_φ |
| EPSM/EC塔/伊森导 | ε / ε_θ |
| 阿尔法T8 | ᾱ_T |
| 谬误跳它/贝塔T跳 | μ̃_t / β̃_t |
| E的平方贝塔T跳 | η²·β̃_t |
| 3×3的向量场 | R³→R³ 的映射 |
| 影片/永恒剑 | 隐变量 / 隐空间 |
| 跳舞 | 跳步 |
| 渠道/去道/去掉/去造 | 去噪 |
| 加到商/加造 | 加噪 |
| 贝塔的分布 | 数据分布 |
| 平房/空检 | 平方 / 空间 |
| 下移（连乘处） | 下溢 |
| vision bona/call on3/RNG | 模型名无法辨识（存疑，需对照讲义） |

## 编者补充

- 编者补充（跨集联系）：LDM 处说 latent"就是像老师讲 VAE 的思想"，第 5 讲是本讲的框架预告（扩散是连续生成范式的一种）；第 10 讲的 diffusion policy 与 rectified flow 直接复用本讲的加噪/去噪公式——三讲构成"框架 → 数学 → 应用"链。
- 编者补充（行动线）：①课上多处推导"直接上结论/略过"（ELBO 展开、DDIM 定理、score→SDE、Flow Matching、DMD），讲者反复强调看讲义，且建议"看不懂的地方跟 agent 聊一聊"；②DDPM 训练伪代码仅数行，适合用 PyTorch 在 MNIST/CIFAR 上复现最小 DDPM，再改 DDIM 跳步采样对比轨迹（score 向量场可视化可仿做）。
- 编者补充（缺口）：score→SDE→概率流 ODE 与 Flow Matching 的完整推导是全讲最大跳步（30:25、33:46 明说"略过去"），仅靠本视频无法建立 ODE 视角，必须补讲义或原论文。
