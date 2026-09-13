# 2025科协暑培 · NLP与主流LLM架构（陈子陶, BV1jDbCzuE3c, 约62分钟）

## 定位

AI 部分的架构细节讲：先补四个前置概念（softmax/全连接/激活函数/残差/训练稳定性），再从零过一遍 Transformer 全流程，最后讲现代大模型对原始架构的工程改进与 MoE 入门。大纲明确参考 Stanford CS336，是第 10 讲"大模型基础"的深化、也是第 12 讲 reasoning 的前置。适合要读模型代码或做引论作业的同学整讲精看。

## 内容脉络

- [0:13] 前置知识：softmax 压数量级、保序、输出和为 1（QK 乘积后要用）；全连接层=矩阵乘法+激活，是网络的 building block；⏭️可跳过：激活函数与异或问题，与第 10/13 讲重复。
- [3:29] 残差连接：来自 ResNet，输出加原输入，解决深层梯度消失、转为学习残差。
- [4:27] 训练稳定性：平滑无尖峰的 loss 曲线是近期关注点；Kimi K2 新闻稿强调换优化器后支持数万亿 token 无 loss spike 预训练。
- [5:24] Transformer 总览：Attention Is All You Need 是开山之作，主流大模型多取其 decoder 组件；本讲还将讲现代架构改进与一点点 MoE（DeepSeek 用法）。
- [7:12] encoder-decoder 全流程（翻译为例）：词→embedding 行向量→多层 encoder 得"编码矩阵"（每词融入上下文）→与已输出内容一起进 decoder 预测下一 token，自回归滚动至终止符；输入输出可不等长。⏭️可跳过：embedding 与自回归概念，第 10 讲已详述。
- [10:29] mask：训练时强迫每个词只看自己与前文，不偷看后文。
- [11:28] 词的三种表示：整数 ID（引入"大学−清华=人类"式伪偏置）→one-hot（全正交、无偏但几万维且仅一维有效，低效）→稠密 embedding（相似词聚堆、king−man+woman 式语义运算，还可当迁移学习的知识补给弱模型）。
- [16:16] self-attention：embedding 无上下文语义，attention 让词带上整体语义；softmax 后的方阵即"每词对其他词的关注程度"，左乘 V 得语义矩阵 Z；多头=多组 W_Q/W_K/W_V 各出一批语义矩阵拼接过线性层，各头关注不同信息。⏭️可跳过：QKV 直觉，第 10 讲"找朋友"比喻更详细。
- [19:04] masked multi-head attention：softmax 前乘 mask 挡后文；逐行分析 Z——第 i 行只含前 i+1 个词的信息，末行含全句，与自回归生成严格对应。
- [21:51] 位置编码：attention 不感知词序，需"embedding+位置→带位置向量"的函数；原版正余弦（偶数维 sin、奇数维 cos，加到 embedding 上）。
- [23:12] 前馈层：两层全连接，第一层 ReLU、第二层不激活；ADD&Norm=残差+层归一化（稳定激活值、防 loss 尖峰，"加层就加 LayerNorm"的小笑话）。
- [26:00] 输出：用 Z 的最后一行（含全句信息）过 softmax 预测下一词。
- [27:00] 为什么 decoder-only 能行：把指令当作"已输出的内容"，decoder 自能理解前文；组件齐全（self-attention+FFN）；encoder-decoder 原本服务输入输出分明的任务（翻译），纯 chatbot 追求生成连贯性，encoder 反而多余——OpenAI 选此路线。
- [30:41] 现代改进总纲：本部分与第 4 部分大量参考 Stanford CS336（强推）；大一听众可留到"人工智能导论"训模型时回来参照调参。
- [31:39] Pre-Norm vs Post-Norm：原版是 post-norm，主流改 pre-norm——残差本意是恒等通路，norm 放残差流内会破坏它，故移到流之外；Gemma2/Llama2 在 attention 前后都放 norm；讲者亲例：图神经网络项目上 post-norm 反而更好，别迷信主流。
- [34:54] pre-norm 两种解释：各层梯度更稳（甚至可省 warmup）；更现代的解释是防数值爆炸（softmax 分母处尤甚）。
- [36:18] RMSNorm：去掉减均值平移、只做缩放（假设激活值在零附近）；Bias 虽只占 0.17% 计算量却占 25% 运行时间（内存搬运），故现代模型连 FFN 的 bias 也去掉。
- [38:37] 激活函数升级：ReLU→带门控（GLU 后缀）版本——激活后逐元素乘可学习"门"，激活函数从此带参数；主流是 SwiGLU 系；因激活层自带参数，FFN 隐藏维降到约 2/3 匹配参数量。
- [41:29] RoPE（旋转位置编码）：期望"编码后向量内积只与内容与相对位置差有关"；内积旋转不变→第 i 个词转 i·θ；实践把 embedding 切成多段二维子空间、各段不同频率旋转。注意 RoPE 直接作用于算完的 Q/K，不是加在 embedding 上。作业建议：情感分类用 transformer encoder 效果不好时，试着换现代组件。
- [45:43] 超参经验（对引论作业有用）：d_model 全程不变（否则残差连不起来）；FFN 隐藏维=4×d_model（试出来的，各家互相抄），用门控激活则约 2.67×（T5 用 64 倍的反例也在）；n_head×head_dim≈d_model（比值约 1，对 hidden 切分再重组）；宽高比约 100；加深比加宽更难并行训练。
- [52:54] 其他：多语言模型词表大一个数量级；分词从按词到 BPE（字节对找高频组合）；训练技巧有 z-loss、QK-norm、正则从 dropout 转向 weight decay；CS336 有各模型架构对照表。
- [54:46] MoE：把 FFN 复制多份做"专家"，每 token 经路由选 top-k 个通过——参数量猛增而单 token FLOPs 不变，专家可分布到不同机器。路由=小线性层+softmax 打分取 top-k、按得分加权输出；甚至换成无参 hash 函数也能涨点——"参数量越大效果越好，router 训不好也有提升"。
- [1:00:28] MoE 两个改进方向：专家切更小（几分之一 FFN）表现更好；共享专家（shared expert）不参与路由、每 token 必经。⏭️可跳过：MoE 概念与 2026 合集重叠，但 router/hash 细节仍有增量。

## 编者补充

- 编者补充（跨集联系）：第 10 讲给 Transformer 的"为什么"，本讲给"工程上怎么改"；两讲合读即 CS336 架构章的中文速成版。第 12 讲训 32B formal reasoning 模型用的正是本讲的 decoder-only+RoPE+SwiGLU 这套现代配置。
- 编者补充（行动线）：做人工智能导论作业前重读 44:17 与 45:43 两段——讲者明说"情感分类作业把组件改现代试试"；CS336 公开课列入自学清单。
- 编者补充（缺口）：讲者自认 MoE"了解不多"，负载均衡 loss、expert parallel 通信等均未讲；位置编码外推（NTK/YaRN 类）未提。
