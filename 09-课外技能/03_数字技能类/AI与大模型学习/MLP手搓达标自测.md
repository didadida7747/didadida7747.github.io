# MLP 手搓达标自测

这份达标标准的核心不是“背会 MLP 代码”，而是：你要从“能让 AI 帮你跑通”进阶到“自己知道每一步为什么这么写、错了能改、换数据也能改”。

适用前提：零基础起步，已借助 AI 跑通 MLP/CNN，目标是独立手搓 MLP 并补齐 Python/PyTorch 基础。

**你需要达到的 Python 熟练度**
- 能独立写函数、类、循环、条件、列表/字典推导式。
- 能读懂并修改别人写的训练代码。
- 知道 `list`、`dict`、`tuple`、`set`、`numpy array`、`torch.Tensor` 的区别。
- 会用 `numpy` / `pandas` 做基本数据处理：读文件、切片、筛选、归一化、划分训练集测试集。
- 遇到报错能根据 traceback 定位是哪一行、变量形状哪里不对。

对你现在来说，“熟练 Python”不等于会写大型软件，而是至少能自己写出这种逻辑：

```python
def accuracy(pred, y):
    pred_label = pred.argmax(dim=1)
    return (pred_label == y).float().mean()
```

也就是说：能把数学/训练流程翻译成 Python 代码。

**PyTorch 要熟到什么程度**
你至少要掌握这几块：

- `torch.Tensor`：创建张量、查看 `shape`、类型转换、维度变换。
- `torch.nn`：会用 `nn.Linear`、`nn.ReLU`、`nn.CrossEntropyLoss`、`nn.Module`。
- `torch.optim`：知道 `SGD`、`Adam` 是优化器，负责更新参数。
- `Dataset` / `DataLoader`：知道怎么批量取数据。
- 训练流程：`forward → loss → backward → optimizer.step()`。
- 设备切换：知道 `.to(device)`、`cuda` / `cpu` 是什么。
- 调试形状：比如 `[batch_size, input_dim]` 进 MLP，输出 `[batch_size, num_classes]`。

你可以先把 PyTorch 理解成：**一个帮你写神经网络、自动求导、用 GPU 加速训练的 Python 工具包**。大模型也是用类似框架训练的，但你现在先不用管大模型，先把小型神经网络训练流程吃透。

**“手搓 MLP”具体是什么意思**
考核时大概率要求你不完整照抄模板，自己写出：

1. 准备数据  
2. 定义 MLP 网络  
3. 定义损失函数  
4. 定义优化器  
5. 写训练循环  
6. 写测试/准确率评估  
7. 能改隐藏层大小、学习率、epoch、batch size  
8. 能解释每一行代码在干嘛  

比如你应该能解释：

```python
loss.backward()
optimizer.step()
```

含义是：先自动计算梯度，再让优化器根据梯度更新模型参数。

**一个合格目标**
你近期可以把目标定成：

> 不看完整答案，能在 1 小时内从零写出一个用 PyTorch 训练 MNIST 或 sklearn 鸢尾花数据集的 MLP，并能解释输入维度、输出维度、loss、optimizer、训练循环。

如果能做到这个，“熟练 Python 和 PyTorch 基础”这条要求就基本达标了。

**建议学习路线**
- 第 1 阶段：补 Python 基础，重点是函数、类、列表/字典、文件读取、报错调试。
- 第 2 阶段：补 `numpy`、`pandas`、`matplotlib`，会处理表格和画 loss 曲线。
- 第 3 阶段：手写不用 PyTorch 的简单 MLP，理解矩阵乘法、激活函数、loss。
- 第 4 阶段：用 PyTorch 写标准 MLP，掌握 `nn.Module`、`DataLoader`、训练循环。
- 第 5 阶段：改代码做实验，比如换激活函数、层数、学习率、优化器。

你现在不用焦虑“大模型”，先把 **Python → 数据处理 → MLP → CNN → Transformer** 这条线一步步走。当前最重要的是：你要能自己把 MLP 从数据到训练循环完整写出来。