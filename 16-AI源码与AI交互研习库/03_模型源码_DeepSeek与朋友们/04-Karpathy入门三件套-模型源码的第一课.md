---
title: "04 · Karpathy 入门三件套：模型源码的第一课"
---

# 04 · Karpathy 入门三件套：模型源码的第一课

> 素材：karpathy/minbpe、karpathy/nanoGPT、karpathy/llm.c 的 README（已验证）。
> Andrej Karpathy（OpenAI 创始成员、前特斯拉 AI 总监）的教学仓库是公认的"模型源码第一课"。DeepSeek 的代码你看不懂时，先来这里补地基——**总量不超过 1000 行代码，却覆盖 tokenizer、训练、推理三大件**。

## 一、为什么是这三件套：一条"从字符到智能"的路径

```
minbpe    ：文本怎么变成数字（tokenizer）      ← 模型的"识字"
nanoGPT   ：数字怎么变成预测（Transformer+训练）← 模型的"学会"
llm.c     ：这一切在 GPU 上怎么真实发生        ← 模型的"物理课"
```

## 二、minbpe：300 行看懂 tokenizer

README 定位（原文，已验证）：

> "Minimal, clean code for the (byte-level) Byte Pair Encoding (BPE) algorithm commonly used in LLM tokenization."

类谱系（已验证）：

```
Tokenizer (base.py)        基类：train / encode / decode 三个接口
  └─ BasicTokenizer        最朴素：字节对上迭代合并，无任何先验
      └─ RegexTokenizer    加正则预切分（数字/标点/多语言边界不许跨词合并）
          └─ GPT4Tokenizer 能"exactly reproduce the tokenization of GPT-4"
```

【BPE 三十秒版】把文本按字节展开 → 统计哪两个相邻符号最常一起出现 → 把它们合并成一个新符号 → 重复 → 词表就这样"长"出来。训练出的 `merges` 表就是 tokenizer 的全部灵魂。

【为什么 RegexTokenizer 是关键一步】没有正则预切分时，模型会把"dog." "dog!" "doggy"学成完全独立的符号，也无法正确处理数字边界。GPT-2 的正则规则就是为了这个——**一个正则，决定了模型对"什么算一个词"的先天世界观**。这也是为什么中文用户格外关心 tokenizer：分词质量直接影响你的 token 成本和理解质量。

【读法建议】按 base.py → basic.py → regex.py 的顺序，每个都短到一屏读完，配套 tests/ 和 exercise.md（作者自留的练习题）。**这是"读穿一个模块"练习（00 章 02 篇第 4 步）的最佳靶子。**

## 三、nanoGPT：两个 300 行文件训练一个 GPT

README 原文（已验证）：

> "The simplest, fastest repository for training/finetuning medium-sized GPTs."
> 结构就是 `model.py`（~300 行 GPT 定义）+ `train.py`（~300 行训练循环）+ `sample.py`

入门路径（README 已验证）：

```bash
# 1. 准备数据（莎士比亚字符级）
python data/shakespeare_char/prepare.py
# 2. 训练一个小 GPT（笔记本可跑）
python train.py config/train_shakespeare_char.py
# 3. 生成
python sample.py --out_dir=out-shakespeare-char
# 进阶：8×A100 跑 4 天复现 GPT-2 124M（val loss ~2.85）
```

【为什么 model.py 的 300 行值得逐行读】它就是 Transformer 的最小完备实现：embedding → N 层（自注意力+FFN+残差+norm）→ 输出层。**DeekSeek-V3 的 model.py（00 篇）是这 300 行的"plus 豪华版"**——把标准 MHA 换成 MLA、把 FFN 换成 MoE、加了 MTP 头。骨架完全一样。先读nanoGPT 的 300 行，再回看 DeepSeek 的 808 行，你会发现后者的每一块都挂在同一个骨架上。

【注意】README 已标注（2025.11 起）nanoGPT deprecated、推荐后继项目 nanochat（全流程栈）。教学价值不减，追新看 nanochat。

## 四、llm.c：去 PyTorch 化的物理课

README 原文（已验证）：

> "LLMs in simple, pure C/CUDA with no need for 245MB of PyTorch or 107MB of cPython."
> CPU 参考实现 "~1,000 lines of clean code in one file train_gpt2.c"
> "Currently, llm.c is a bit faster than PyTorch Nightly (by about 7%)."

【为什么存在】PyTorch 是给你的抽象，CUDA kernel 是机器的真相。llm.c 把注意力、GEMM、反向传播的每一步用 C/CUDA 手写出来——读 `train_gpt2.c` 的前向传播部分，你会第一次真正看到"attention 就是三串矩阵乘 + softmax"，以及 02 篇那批 kernel 库到底在优化什么环节。

【读法建议】不用啃完。挑 `train_gpt2.c` 里 attention 前向的那 100 行 + `dev/cuda` 里的教学 kernel（作者配了文档）即可。目标不是会写 CUDA，是**建立"模型=张量运算图"的物理直觉**。

## 五、本篇的任务卡（一周内可完成）

- [ ] 读 minbpe 的 basic.py + regex.py（合计 <300 行），跑一次训练和编码
- [ ] 手算：字符串 "aababcabcd" 手动执行 3 轮 BPE 合并
- [ ] 读 nanoGPT 的 model.py 前 150 行（Attention 类 + Block 类），对照 00 篇 DeepSeek 的 MLA 类，找出 5 处"同骨架不同实现"
- [ ] 选做：用 nanoGPT 在 shakespeare 上跑一次训练（CPU 也行，等 20 分钟）
- [ ] 输出：一篇 300 字笔记《我看到的 Transformer 最小骨架》

【配套】05 章资源地图里有 Karpathy 的视频课（Neural Networks: Zero to Hero 系列，YouTube/B站均有搬运），和这三个仓库是配套教材。

---

03 章完。回 [02 章对比](#/doc/d437) 或进 [04 章交互记录](#/doc/d450)。
