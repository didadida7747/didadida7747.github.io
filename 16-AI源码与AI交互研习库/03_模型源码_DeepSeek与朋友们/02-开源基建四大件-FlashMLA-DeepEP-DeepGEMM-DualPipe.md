---
title: "02 · 开源基建四大件：FlashMLA / DeepEP / DeepGEMM / DualPipe（+3FS）"
---

# 02 · 开源基建四大件：FlashMLA / DeepEP / DeepGEMM / DualPipe（+3FS）

> 素材：`deepseek-ai/open-infra-index`（索引仓库，已验证）+ 各仓库 README（已验证）。
> 2025 年 2 月"开源周"（2.24 起，每日一库），DeepSeek 把生产环境在用的核心基建全部开源（MIT/CC0）。本篇讲每个件"解决什么疼"——不懂 CUDA 也能读懂设计。

## 一、先看一张"训练一 step 发生了什么"的地图

```
一个大 MoE 模型的训练 step，四大疼点：

疼点 A：注意力算不过来        → FlashMLA（手写 MLA kernel）
疼点 B：专家分散在各机，通信慢  → DeepEP（MoE 专用通信库）
疼点 C：FP8 矩阵乘没有好 kernel → DeepGEMM（FP8 GEMM 库）
疼点 D：流水线干活有空转等待    → DualPipe（双向流水线算法）
   （外加：海量训练数据读不动   → 3FS 分布式文件系统）
```

【总批注】注意这份清单的形状：**没有一件是"模型创新"，全是"让模型创新能落地"的脏活**。这揭示了一个行业真相——头部模型团队 70% 的工程量在系统层，而且这层的能力差距直接换算成训练成本差距。

## 二、FlashMLA：为 MLA 量身定做的注意力 kernel

- 官方发布的首发数字（open-infra-index README，已验证）：H800 上 **3000 GB/s 内存带宽**（访存受限场景）、**580 TFLOPS**（计算受限场景，BF16）；支持paged KV cache（block size 64）。
- 演化（已验证，README 现版）：2026 年已迭代到 SM100（B200）与昇腾 950，为 DeepSeek-V4.1 线和 **DSA 稀疏注意力**服务（B200 稀疏 prefill 最高 1350 TFlops）。

【为什么必须自己写】00 篇讲过：MLA 的缓存是"压缩潜向量"（512+64 维），标准 FlashAttention 的 kernel 根本不认这种输入格式。**你选了非标架构，就得自建生态**——FlashMLA 就是把这笔债还上。开源后它成了所有想部署 MLA 系模型（DeepSeek/Kimi K2 都用 MLA）的人的公共基础设施。

【你能学到】"架构选型"从来不只是数学题，是"我愿不愿意维护一整套非标基础设施"的承诺。

## 三、DeepEP：MoE 的跨机通信库

背景：MoE 训练时，每个 token 要被快递到"它的 8 个专家"所在的机器上算完再寄回来，这叫 all-to-all 通信。专家分布越散、模型越大，通信占比越高——高到通信时间能吃掉一半的训练时长。

- 首发描述（已验证）：首个开源的 EP（专家并行）通信库；NVLink（机内）+ RDMA（跨机）双通道；FP8 dispatch（把要寄的 tensor 直接用 FP8 发，带宽再省一半）；低延迟 decode 模式专为推理解码设计。
- 现版注意（已验证）：V2 起接口统一为 `EPBuffer`，且**不再支持"零 SM 纯 RDMA"模式**（dispatch/combine 需要 GPU SM 参与）——引用"纯 RDMA 零 SM"的说法要注明是首发时点的设计。

【为什么这是"卡脖子级"的件】训练大 MoE 的集群里，网卡和显卡的配合方式直接决定钱烧多快。DeepEP 把"怎么让 400G InfiniBand 跑满"的经验开源了，等于把 MoE 训练的隐形门槛削平了一大截。

【你能学到】看基建库先看它优化的"瓶颈在哪一层"：显存带宽（FlashMLA/DeepGEMM）vs 网络带宽（DeepEP）vs 磁盘带宽（3FS）。**系统优化的第一问永远是：现在到底谁在阻塞？**

## 四、DeepGEMM：FP8 矩阵乘

- 首发数字（已验证）：Hopper 上 **1350+ FP8 TFLOPS**；核心逻辑约 300 行、完全 JIT 编译（运行时才编译 kernel，不需要装的时候编译）。
- 演化（已验证）：现版已到 **1550 TFLOPS on H800**（2025.04 记录），并扩展成统一 kernel 库（FP8/FP4/BF16、Mega MoE、V3.2 lightning indexer 的 MQA 内核）。

【为什么 300 行能打】它把"每种矩阵形状编译一个专用 kernel"做成了运行时自动完成（DeepJIT）。传统 CUDA 库为了通用性要在 kernel 里塞大量 if-else，JIT 则是为"你恰好要算的形状"现场生成最优代码。**用编译期换运行期，和"用检索换上下文"（Agent 那边）是同一种思维：把一次性成本移出热路径。**

## 五、DualPipe：把流水线的"空转"挤掉

背景：训练用流水线并行（PP）——GPU0 干第 1 段、GPU1 干第 2 段…… 问题是"气泡"：下游 GPU 等上游数据时空转。传统 1F1B 方案气泡率不小，而 MoE 训练里还有 all-to-all 通信和计算抢资源。

DualPipe 的做法（README 已验证）：**双向流水线**——数据从两端同时喂入，前向/后向的通信与对侧计算完全重叠，把气泡压到接近消失。README 给出了 1F1B / ZB1P / DualPipe 的气泡公式对比（DualPipe 每设备参数量 2×，用显存换气泡）。

【为什么叫"算法"而不是"库"】它是一套调度策略（前后向 micro-batch 的交错安排），谁家训练框架都能实现。DeepSeek 开源的也是参考实现。**这种"纯调度层创新"成本低、收益大，是系统层最值得关注的创新类型。**

## 六、3FS：训练数据的"高速公路"

- 首发数字（已验证）：180 节点集群聚合读吞吐 **6.6 TiB/s**；排序测试 GraySort 3.66 TiB/min；KV cache 场景单客户端峰值 40+ GiB/s。
- 架构要点（已验证）：存算分离；元数据用 FoundationDB；一致性用 CRAQ（链式复制）；数据路径 RDMA + 自研 USRBIO。

【为什么需要它】14.8T token 的预训练数据 + 高频 checkpoint + 推理侧 KV cache 复用，对存储的要求是"几万张卡同时饿着等数据"。存储跟不上，前面的算力优化全白搭——**木桶的最短板在存储时，最性感的位置就是存储。**

## 七、开源动机：一句话值得抄在笔记本上

open-infra-index README 原文（已验证）：

> "No vaporware, just sincere code that moved our tiny yet ambitious dream forward."
> （没有期货，只有推动我们渺小而宏大梦想前进的真诚代码。）

【批注】对比某些大厂"开源"即"弃养"的作风，DeepSeek 开源的是**自己生产环境在用的东西**（"Production-tested"），且配套开放了推理系统概览（每 H800 节点 73.7k input tokens/s、成本利润率 545% 的著名数据点）。**开源策略本身也是产品策略：让整个行业跑在你的架构上，你就成了事实标准。**

## 思考题

1. 四大件分别对应"计算/通信/存储/调度"四个瓶颈。如果让你预测 2027 年最疼的瓶颈会变成哪个，你的依据是什么？
2. DeepGEMM 的 JIT 思路（运行时编译专用 kernel）能不能搬到 Agent harness 上？（提示：动态生成提示词/工具 vs 静态模板）
3. 为什么说 FlashMLA 的存在反而**增强**了 MLA 架构决策的合理性？（提示：基础设施一旦公开，选型护城河转化为生态标准）

---

下一篇：[03-开源模型群像](#/doc/d447)
