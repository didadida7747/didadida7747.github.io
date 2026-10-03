# 2025科协暑培 · NLP与主流LLM架构（陈子陶, BV1jDbCzuE3c）

## 定位

AI 部分的架构细节讲：先补前置概念（softmax/全连接/残差/训练稳定性），再从零过一遍 Transformer 全流程，最后讲现代大模型对原始架构的工程改进与 MoE 入门。大纲明确参考 Stanford CS336，是第 10 讲"大模型基础"的深化、也是第 12 讲 reasoning 的前置。适合要读模型代码或做引论作业的同学整讲精看。

## 知识整理

### 前置概念速通

softmax 把任意分数压成数量级合理、保序、和为 1 的分布（后面 QK 乘积要用）；全连接层=矩阵乘法+激活函数，是网络的基本积木；残差连接出自 ResNet，输出加原输入，把学习目标改成残差、解决深层梯度消失。训练稳定性是近期关注点：平滑无尖峰的 loss 曲线本身就是卖点——Kimi K2 新闻稿强调换优化器后支持数万亿 token 无 loss spike 预训练。（激活函数与异或问题与第 10/13 讲重复，已熟悉者可略。）

### Transformer 全流程（以翻译为例）

词先变 embedding 行向量，过多层 encoder 得"编码矩阵"（每词已融入上下文），再与已输出内容一起进 decoder 预测下一 token，自回归滚动至终止符，输入输出可不等长；训练时用 mask 强迫每个词只看自己与前文、不偷看后文。

词有三种表示：整数 ID 引入"大学−清华=人类"式伪偏置；one-hot 全正交、无偏，但几万维且仅一维有效、低效；稠密 embedding 让相似词聚堆、支持 king−man+woman 式语义运算，还可当迁移学习的知识补给弱模型。embedding 本身无上下文语义，self-attention 补上：softmax 后的方阵即"每词对其他词的关注程度"，左乘 V 得语义矩阵 Z；多头=多组 W_Q/W_K/W_V 各出一批语义矩阵拼接过线性层，各头关注不同信息（QKV 直觉第 10 讲"找朋友"比喻更细，已熟悉可略）。masked multi-head attention 在 softmax 前乘 mask：逐行看 Z，第 i 行只含前 i+1 个词的信息、末行含全句，与自回归生成严格对应。attention 不感知词序，需位置编码——原版正余弦（偶数维 sin、奇数维 cos）加到 embedding 上。前馈层是两层全连接（第一层 ReLU、第二层不激活）；ADD&Norm=残差+层归一化（稳定激活值、防 loss 尖峰，"加层就加 LayerNorm"的小笑话）。输出用 Z 的最后一行（含全句信息）过 softmax 预测下一词。

### 为什么 decoder-only 能行

把指令当作"已输出的内容"，decoder 自能理解前文；组件齐全（self-attention+FFN）；encoder-decoder 原本服务输入输出分明的任务（翻译），纯 chatbot 追求生成连贯性，encoder 反而多余——OpenAI 由此选定此路线。

### 现代架构改进

（本节与下节大量参考 Stanford CS336，强推；大一听众可留到"人工智能导论"训模型时回来参照调参。）

**Pre-Norm vs Post-Norm**：原版是 post-norm，主流改 pre-norm——残差本意是恒等通路，norm 放残差流内会破坏它，故移到流之外。两种解释：各层梯度更稳（甚至可省 warmup）；更现代的解释是防数值爆炸（softmax 分母处尤甚）。但别迷信主流——讲者亲例：图神经网络项目上 post-norm 反而更好；Gemma2/Llama2 在 attention 前后都放 norm。

**RMSNorm 与去 Bias**：RMSNorm 去掉减均值平移、只做缩放（假设激活值在零附近）；Bias 虽只占 0.17% 计算量却占 25% 运行时间（内存搬运），故现代模型连 FFN 的 bias 也去掉。

**门控激活**：ReLU→带门控（GLU 后缀）版本——激活后逐元素乘可学习"门"，激活函数从此带参数；主流是 SwiGLU 系；因激活层自带参数，FFN 隐藏维降到约 2/3 匹配参数量。

**RoPE（旋转位置编码）**：期望"编码后向量内积只与内容与相对位置差有关"；内积旋转不变，故第 i 个词转 i·θ；实践把 embedding 切成多段二维子空间、各段不同频率旋转。注意 RoPE 直接作用于算完的 Q/K，不是加在 embedding 上。

### 超参经验（引论作业速查）

d_model 全程不变（否则残差连不起来）；FFN 隐藏维=4×d_model（试出来的，各家互相抄），用门控激活则约 2.67×（T5 有 64 倍反例）；n_head×head_dim≈d_model（比值约 1，对 hidden 切分再重组）；宽高比约 100；加深比加宽更难并行训练。作业建议：情感分类用 transformer encoder 效果不好时，试着把组件换成上述现代配置。

### 训练杂项与 MoE 入门

多语言模型词表大一个数量级；分词从按词到 BPE（字节对找高频组合）；训练技巧有 z-loss、QK-norm，正则从 dropout 转向 weight decay；CS336 有各模型架构对照表。MoE 把 FFN 复制多份做"专家"，每 token 经路由选 top-k 个通过——参数量猛增而单 token FLOPs 不变，专家可分布到不同机器。路由=小线性层+softmax 打分取 top-k、按得分加权输出；甚至换成无参 hash 函数也能涨点——"参数量越大效果越好，router 训不好也有提升"。两个改进方向：专家切更小（几分之一 FFN）表现更好；共享专家（shared expert）不参与路由、每 token 必经。（MoE 概念与 2026 合集重叠，但 router/hash 细节仍有增量。）

## 勘误对照

- 该集未发现新勘误。

## 编者补充

- 编者补充（跨集联系）：第 10 讲给 Transformer 的"为什么"，本讲给"工程上怎么改"；两讲合读即 CS336 架构章的中文速成版。第 12 讲训 32B formal reasoning 模型用的正是本讲的 decoder-only+RoPE+SwiGLU 这套现代配置。
- 编者补充（行动线）：做人工智能导论作业前重读 44:17 与 45:43 两段——讲者明说"情感分类作业把组件改现代试试"；CS336 公开课列入自学清单。
- 编者补充（缺口）：讲者自认 MoE"了解不多"，负载均衡 loss、expert parallel 通信等均未讲；位置编码外推（NTK/YaRN 类）未提。
