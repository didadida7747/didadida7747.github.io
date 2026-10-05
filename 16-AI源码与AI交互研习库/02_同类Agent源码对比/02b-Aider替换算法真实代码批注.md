---
title: "02b · Aider 替换算法：真实代码逐段批注（含一段被作者亲手禁用的代码）"
---

# 02b · Aider 替换算法：真实代码逐段批注（含一段被作者亲手禁用的代码）

> 素材：本库 clone 的 `aider`，`aider/coders/editblock_coder.py`（`replace_most_similar_chunk` 在第 157 行起，行号为 clone 版实测）。
> 这篇是全部资料里**含金量/长度比最高的代码批注**：不到 80 行的函数，浓缩了"模型输出的不可靠性"这个领域的全部工程智慧——包括一段**作者写了又禁用**的模糊匹配代码，那比任何成功案例都有教育意义。

## 1. 主函数：一条"宽容度递增"的匹配瀑布

```python
def replace_most_similar_chunk(whole, part, replace):
    """Best efforts to find the `part` lines in `whole` and replace them with `replace`"""

    whole, whole_lines = prep(whole)
    part, part_lines = prep(part)
    replace, replace_lines = prep(replace)

    res = perfect_or_whitespace(whole_lines, part_lines, replace_lines)
    if res:
        return res

    # drop leading empty line, GPT sometimes adds them spuriously (issue #25)
    if len(part_lines) > 2 and not part_lines[0].strip():
        skip_blank_line_part_lines = part_lines[1:]
        res = perfect_or_whitespace(whole_lines, skip_blank_line_part_lines, replace_lines)
        if res:
            return res

    # Try to handle when it elides code with ...
    try:
        res = try_dotdotdots(whole, part, replace)
        if res:
            return res
    except ValueError:
        pass

    return
    # Try fuzzy matching
    res = replace_closest_edit_distance(whole_lines, part, part_lines, replace_lines)
    if res:
        return res
```

【逐段批注】

**开头三个 `prep(...)`**：统一预处理（规范化行尾/空白）。三个输入各过一遍——注意 `part`（模型给的 SEARCH 块）和 `whole`（真实文件）被**同等地**规范化：不做"文件是真的所以文件不用洗"的假设。

**第一级 `perfect_or_whitespace`**：先试完全匹配，失败再试"忽略空白差异"的匹配。**宽容度阶梯的第一级**——空白错误是模型最常见的无害错误（缩进习惯不同），修它零风险。

**第二级：扔掉开头的空行**。注意注释：

```python
# drop leading empty line, GPT sometimes adds them spuriously (issue #25)
```

这是全函数我最喜欢的一行——**它引用了具体的 GitHub issue 编号**。模型（当年是 GPT-3.5/4）会在 SEARCH 块开头多插一个空行，导致精确匹配失败；作者没写论文，而是把 issue 号写进了代码注释。还有 `len(part_lines) > 2` 的保护：只有两行的块不扔首行（扔了就剩一行，匹配意义全无）——**容错也要带护栏，防止容错引入新错误**。

**第三级 `try_dotdotdots`**：处理模型用 `...` 省略代码的情况（下节细讲）。

**最后：一个裸 `return`。** 往下看。

## 2. 那段"不可达代码"：被亲手禁用的模糊匹配

注意主函数的结构——`return` 之后、函数结束之前，还有代码：

```python
    return
    # Try fuzzy matching
    res = replace_closest_edit_distance(whole_lines, part, part_lines, replace_lines)
    if res:
        return res
```

【批注：为什么这比功能本身更重要】

1. **`replace_closest_edit_distance` 的逻辑**是：在 whole 里滑动找编辑距离最小的位置，把 part 替换成 replace——听起来很美好："模型没给全原文？没关系，我找最像的地方改"。
2. **作者禁用了它**。为什么？推演一下它的失败模式：模型给的 SEARCH 块**内容本身是错的**（幻觉了一个不存在的函数体），编辑距离"最像的位置"可能是一段完全无关但字面相近的代码——于是 harness **静默地**把错误替换应用到了错误的位置。文件的修改成功了、没有报错，但改的是错的地方。
3. 对照 02章02篇的思考题："SEARCH/REPLACE 的相似度兜底有没有风险？什么场景下应该拒绝兜底？"——**答案就躺在这段不可达代码里**：编辑距离兜底把"匹配失败"这个宝贵信号（模型对代码的认知有误）转换成了"静默改错位置"这个最贵故障。**宁可失败响亮，不可成功安静。**
4. 保留而不删除这 4 行，也是姿态：作者在说"我知道这个方案存在，考虑过，因为 X 而停用"——这是比删除更诚实的工程记录。

## 3. `try_dotdotdots`：当模型"偷懒"时怎么接

```python
def try_dotdotdots(whole, part, replace):
    """
    See if the edit block has ... lines.
    If not, return none.
    If yes, try and do a perfect edit with the ... chunks.
    If there's a mismatch or otherwise imperfect edit, raise ValueError.
    """
    dots_re = re.compile(r"(^\s*\.\.\.\n)", re.MULTILINE | re.DOTALL)
    part_pieces = re.split(dots_re, part)
    replace_pieces = re.split(dots_re, replace)

    if len(part_pieces) != len(replace_pieces):
        raise ValueError("Unpaired ... in SEARCH/REPLACE block")
    # ...
    all_dots_match = all(part_pieces[i] == replace_pieces[i]
                         for i in range(1, len(part_pieces), 2))
    # ...
    if whole.count(part) == 0:
        raise ValueError
    if whole.count(part) > 1:
        # （原文还有严格的唯一性检查）
```

【批注】

1. **模型有个经典偷懒**：SEARCH 块里写 `def foo():\n    ...\n    return x`（用 `...` 省略它懒得复述的中间代码）。天真地拿它去匹配必然失败——`...` 不在真实文件里。
2. 这个函数的解法：按 `...` 行**切分** SEARCH 和 REPLACE 两边，校验切出的"省略段"两边完全一致（`all_dots_match`），然后对"非省略段"逐段做替换。相当于**把一个粗块拆成多个精确小块分别替换**。
3. 注意它全程的失败姿态：数量不配对、省略段不一致、匹配数非 1——**全部 `raise ValueError` 立刻失败**，绝不"尽力而为"。docstring 原话："If there's a mismatch or otherwise imperfect edit, raise ValueError."
4. 【对比记忆】同一个文件里，空白差异可以被原谅（第二级），`...` 省略可以被展开（第三级），但**编辑距离近似匹配被禁用**。三级宽容度各自的边界划在哪里？规则其实很清晰：**可以修"模型表达上的无损误差"（空白/省略），不可以修"模型认知上的有损误差"（内容本身记错了）**。这一条线，值得你抄进任何"模型输出解析器"的设计里。

## 4. 把这篇压缩成三句工程箴言

1. **容错是分层的**：每一级宽容度都要有明确的"它修复的是哪类错误、为什么这个修复是无损的"。
2. **失败信息是产品**：所有失败路径都 `raise` 出明确原因（"Unpaired ..."），让上游（模型）能读懂并自纠——错误文案即接口。
3. **注释里留 issue 号、留被禁用的方案**：代码不只是给机器跑的，也是给下一个维护者（和三年后的你）看的决策记录。

## 思考题

1. 如果模型给的 SEARCH 块在文件里出现 3 次（重复样板代码），主瀑布会在哪一级失败？失败信息该怎么设计才能让模型一次改对？
2. `try_dotdotdots` 里 `part_pieces` 和 `replace_pieces` 数量不配对时直接报错——有没有更宽容且仍然安全的处理方式？（提示：允许一边多 `...` 意味着什么风险？）
3. 去对比 Gemini CLI 的 `edit.ts` 和 Claude Code 的 Edit 工具描述（07b 篇）：三家的"编辑协议"各自的宽容度阶梯是什么？谁的更激进、谁的更保守，为什么？

---

回 [02 章目录](#/doc/d437) ｜ 06 章练习题 1 的实现可以参考本篇的瀑布结构。
