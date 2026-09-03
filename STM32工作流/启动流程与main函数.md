# 启动流程与 main 函数

**概念**

STM32 的“启动流程与 `main()`”解决的是一个最基础的问题：

> 芯片上电或复位之后，CPU 是怎么从一片空白状态，逐步运行到你写的 `main()` 函数的？

在普通 C 程序里，你通常从 `main()` 开始看。但在 STM32 里，`main()` 不是 CPU 真正执行的第一行代码。CPU 复位后会先读取启动文件里的中断向量表，设置栈指针，然后跳转到复位入口 `Reset_Handler`，完成一些底层初始化，最后才调用 `main()`。

对 `stm32f103c8t6` 来说，这个过程通常由以下几部分组成：

```text
上电 / 复位
  ↓
读取 Flash 起始地址的向量表
  ↓
设置 MSP 主栈指针
  ↓
跳转到 Reset_Handler
  ↓
执行启动文件 startup_stm32f103xb.s
  ↓
调用 SystemInit()
  ↓
初始化 .data / .bss 段
  ↓
调用 __libc_init_array()
  ↓
进入 main()
  ↓
HAL_Init()
  ↓
SystemClock_Config()
  ↓
外设初始化
  ↓
while(1)
```

你可以把它理解为：

> `main()` 是用户程序的入口，但不是芯片启动的入口。

---

**前置知识**

学习这个主题前，最好先知道这些概念：

1. **Flash**
   程序代码一般烧录在 STM32 内部 Flash 中。`stm32f103c8t6` 的 Flash 起始地址通常是：

   ```c
   0x08000000
   ```

2. **SRAM**
   运行时变量、栈、堆等通常放在 SRAM 中。`stm32f103c8t6` 的 SRAM 起始地址通常是：

   ```c
   0x20000000
   ```

3. **栈 Stack**
   函数调用、局部变量、中断现场保存都依赖栈。CPU 复位后第一件重要的事就是设置栈指针。

4. **中断向量表**
   向量表是一张地址表，告诉 CPU：

   - 栈顶在哪里
   - 复位后跳到哪里执行
   - 各种中断发生时跳到哪里执行

5. **启动文件**
   一般是汇编文件，例如：

   ```text
   startup_stm32f103xb.s
   ```

   它负责从复位入口把程序带到 `main()`。

---

**它在 STM32 工程里的位置**

一个典型 HAL 工程里，启动流程相关文件大概是这些：

```text
Core/
  Inc/
    main.h
    stm32f1xx_hal_conf.h
    stm32f1xx_it.h

  Src/
    main.c
    stm32f1xx_it.c
    system_stm32f1xx.c

startup/
  startup_stm32f103xb.s

STM32F103C8Tx_FLASH.ld
```

它们的作用分别是：

| 文件 | 作用 |
|---|---|
| `startup_stm32f103xb.s`  | 启动文件，包含向量表和 `Reset_Handler` |
| `system_stm32f1xx.c`     | 系统初始化，包含 `SystemInit()` |
| `main.c`                 | 用户主程序入口 |
| `stm32f1xx_it.c`         | 中断服务函数 |
| `STM32F103C8Tx_FLASH.ld` | 链接脚本，决定代码和变量放到 Flash / RAM 的哪里 |

其中最关键的关系是：

```text
startup_stm32f103xb.s
  ↓
Reset_Handler
  ↓
SystemInit()
  ↓
main()
```

---

**这个主题解决什么问题**

启动流程主要解决 5 个问题：

1. CPU 复位后从哪里开始执行？
2. 栈指针如何设置？
3. 全局变量和静态变量如何初始化？
4. 中断入口地址从哪里找？
5. 用户代码 `main()` 是怎么被调用的？

如果不理解启动流程，后面遇到这些问题时会比较难排查：

- 程序根本进不了 `main()`
- 下载成功但运行异常
- 一进中断就 HardFault
- 全局变量初值不对
- 修改 Flash 地址后程序不能启动
- Bootloader 跳转 App 失败

---

**必须理解的 5 个关键点**

**1. CPU 复位后不会直接进入 `main()`**

STM32F103 是 Cortex-M3 内核。复位后，CPU 会从地址 `0x08000000` 开始读取向量表。

向量表前两个内容非常关键：

```text
0x08000000: 初始栈顶地址
0x08000004: Reset_Handler 地址
```

也就是说，CPU 复位后的动作大致是：

```text
读取 0x08000000 的值 → 设置 MSP 栈指针
读取 0x08000004 的值 → 跳转到 Reset_Handler
```

所以，如果向量表错误，程序可能连 `Reset_Handler` 都进不去。

---

**2. `Reset_Handler` 是真正的启动入口**

`Reset_Handler` 通常在启动文件中，例如：

```asm
Reset_Handler:
  bl  SystemInit
  bl  __main
```

不同编译器生成的启动文件细节不完全一样，但核心目标一致：

```text
初始化运行环境
  ↓
调用系统初始化
  ↓
进入 C 运行时
  ↓
调用 main()
```

对于 HAL 工程来说，你一般不需要手写 `Reset_Handler`，但需要知道它存在。

---

**3. `SystemInit()` 早于 `main()` 执行**

`SystemInit()` 位于：

```text
system_stm32f1xx.c
```

它通常做一些非常早期的系统设置，例如：

- 配置时钟相关寄存器的初始状态
- 设置向量表位置
- 关闭或复位某些时钟配置
- 为后续 `SystemClock_Config()` 做准备

注意：

```c
SystemInit();
main();
```

所以 `SystemInit()` 不是你在 `main()` 里调用的，而是在进入 `main()` 之前由启动文件调用。

---

**4. `HAL_Init()` 不是启动流程的第一步**

很多 HAL 工程的 `main()` 开头是：

```c
int main(void)
{
  HAL_Init();
  SystemClock_Config();

  MX_GPIO_Init();

  while (1)
  {
  }
}
```

这里容易误解：

```text
HAL_Init() 并不是芯片复位后执行的第一步。
```

它只是进入 `main()` 之后，HAL 库需要做的初始化。

`HAL_Init()` 通常会做：

- 初始化 HAL 库内部状态
- 配置 SysTick 为 1ms 时基
- 设置 NVIC 优先级分组
- 调用底层 MSP 初始化函数

所以如果你使用 HAL_Delay、HAL_GetTick 等函数，通常需要先执行 `HAL_Init()`。

---

**5. `main()` 里的初始化顺序很重要**

HAL 工程中常见顺序是：

```c
HAL_Init();
SystemClock_Config();
MX_GPIO_Init();
MX_USART1_UART_Init();
MX_TIMx_Init();
```

原因是：

| 步骤 | 为什么要先做 |
|---|---|
| `HAL_Init()`            | 初始化 HAL 和 SysTick |
| `SystemClock_Config()`  | 配置系统主频和总线时钟 |
| `MX_GPIO_Init()`        | GPIO 外设要先开时钟再配置 |
| UART / TIM / I2C 初始化 | 这些外设依赖 APB 总线时钟 |
| `while(1)`              | 主循环业务逻辑 |

如果顺序混乱，可能出现：

- `HAL_Delay()` 不工作
- 外设初始化失败
- 串口波特率不对
- 定时器频率不对
- 程序卡在错误处理函数

---

**数据流向**

启动流程里的“数据流向”主要不是外设数据流，而是程序执行流和内存初始化流。

**执行流：**

```text
Flash 向量表
  ↓
CPU 读取初始 MSP
  ↓
CPU 跳转 Reset_Handler
  ↓
SystemInit()
  ↓
C 运行时初始化
  ↓
main()
  ↓
用户外设初始化
  ↓
while(1)
```

**内存初始化流：**

```text
Flash 中保存的 .data 初值
  ↓
复制到 SRAM 的 .data 区

SRAM 中的 .bss 区
  ↓
清零
```

比如：

```c
int a = 10;      // .data，初值 10 存在 Flash，启动时复制到 RAM
int b;           // .bss，启动时清零
static int c = 5; // .data
```

如果启动流程没有正确初始化 `.data` 和 `.bss`，这些变量的值就可能异常。

---

**初始化依赖什么时钟或中断**

启动流程本身对外设时钟依赖很少，因为它发生在外设初始化之前。

但需要理解几个点：

| 阶段 | 是否依赖外设时钟 | 说明 |
|---|---|---|
| CPU 读取向量表          | 不依赖          | 只要 Flash 映射正常 |
| 设置栈指针              | 不依赖          | CPU 内核行为 |
| 执行 `Reset_Handler`   | 不依赖外设时钟   | 使用默认系统时钟 |
| `SystemInit()`         | 会操作 RCC      | 但通常还没有配置最终主频 |
| `HAL_Init()`           | 依赖 SysTick    | 配置 1ms 时基 |
| `SystemClock_Config()` | 配置 RCC        | 设置 HSE / HSI / PLL |
| 外设初始化              | 依赖对应总线时钟 | GPIO、USART、TIM 等都需要开时钟 |

对于 `stm32f103c8t6`，复位后默认通常使用内部高速时钟 HSI，频率为 8 MHz。之后你可以在 `SystemClock_Config()` 中切换到：

```text
HSE 外部晶振
  ↓
PLL 倍频
  ↓
SYSCLK 72 MHz
```

---

**配置**

如果使用 STM32CubeMX / STM32CubeIDE，启动流程相关配置通常不是手写的，而是由工程模板生成。

你重点检查这些地方：

**1. 芯片型号**

确保工程选择的是：

```text
STM32F103C8Tx
```

如果启动文件或链接脚本选错，可能导致内存大小、向量表、启动文件不匹配。

---

**2. 启动文件**

工程中应该有类似文件：

```text
startup_stm32f103xb.s
```

`stm32f103c8t6` 属于中容量 F103 系列，常见启动文件名是：

```text
startup_stm32f103xb.s
```

不要误用其他系列文件，例如：

```text
startup_stm32f407xx.s
startup_stm32f10x_hd.s
```

---

**3. 链接脚本**

常见文件：

```text
STM32F103C8Tx_FLASH.ld
```

里面一般会定义：

```ld
FLASH (rx)  : ORIGIN = 0x08000000, LENGTH = 64K
RAM (xrw)   : ORIGIN = 0x20000000, LENGTH = 20K
```

对常见 `stm32f103c8t6` 来说：

```text
Flash: 64 KB
SRAM : 20 KB
```

如果 Flash 或 RAM 配置错误，可能出现：

- 下载失败
- 运行异常
- 栈溢出
- HardFault
- 程序覆盖错误区域

---

**4. 向量表位置**

在 `system_stm32f1xx.c` 中可能会看到类似配置：

```c
#define VECT_TAB_OFFSET  0x00000000U
```

普通裸机 App 通常向量表在：

```text
0x08000000
```

如果有 Bootloader，App 可能放在：

```text
0x08002000
0x08004000
```

这时就必须正确设置向量表偏移，否则中断会跳错地址。

---

**代码**

下面是典型 HAL 工程中 `main.c` 的结构：

```c
#include "main.h"

int main(void)
{
  HAL_Init();

  SystemClock_Config();

  MX_GPIO_Init();

  while (1)
  {
    HAL_GPIO_TogglePin(GPIOC, GPIO_PIN_13);
    HAL_Delay(500);
  }
}
```

这段代码虽然从 `main()` 开始写，但真实执行顺序是：

```text
Reset_Handler
  ↓
SystemInit()
  ↓
main()
  ↓
HAL_Init()
  ↓
SystemClock_Config()
  ↓
MX_GPIO_Init()
  ↓
while(1)
```

一个最小 LED 验证程序可以这样写。

假设使用 Blue Pill 常见板子，板载 LED 在：

```text
GPIOC PIN13
```

GPIO 初始化示例：

```c
static void MX_GPIO_Init(void)
{
  GPIO_InitTypeDef GPIO_InitStruct = {0};

  __HAL_RCC_GPIOC_CLK_ENABLE();

  HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_SET);

  GPIO_InitStruct.Pin = GPIO_PIN_13;
  GPIO_InitStruct.Mode = GPIO_MODE_OUTPUT_PP;
  GPIO_InitStruct.Pull = GPIO_NOPULL;
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;
  HAL_GPIO_Init(GPIOC, &GPIO_InitStruct);
}
```

主循环：

```c
int main(void)
{
  HAL_Init();

  SystemClock_Config();

  MX_GPIO_Init();

  while (1)
  {
    HAL_GPIO_TogglePin(GPIOC, GPIO_PIN_13);
    HAL_Delay(500);
  }
}
```

注意：

```c
HAL_Delay(500);
```

依赖 `HAL_Init()` 配置好的 SysTick。如果没有 `HAL_Init()`，`HAL_Delay()` 很可能不能正常工作。

---

**最小实验方案**

目标：

> 证明程序确实从启动文件进入 `main()`，并且 `main()` 中的代码可以正常执行。

实验现象：

```text
板载 LED 每 500ms 翻转一次
```

实验步骤：

1. 新建 STM32F103C8Tx HAL 工程。
2. 配置 PC13 为 GPIO Output。
3. 使用默认时钟即可，先不追求 72 MHz。
4. 在 `main()` 的 `while(1)` 中翻转 PC13。
5. 下载程序。
6. 观察 LED 是否闪烁。
7. 在 `main()` 第一行打断点。
8. 单步调试，观察程序是否停在 `main()`。
9. 打开启动文件，找到 `Reset_Handler`。
10. 尝试在 `Reset_Handler` 处打断点，观察复位后是否先进入这里。

如果调试器支持，可以重点观察这几个位置：

```text
Reset_Handler
SystemInit
main
HAL_Init
SystemClock_Config
while(1)
```

---

**最小验证方法**

推荐按这个顺序验证：

**1. 验证是否进入 `main()`**

在 `main()` 第一行打断点：

```c
int main(void)
{
  HAL_Init();
```

如果能停住，说明：

```text
向量表、启动文件、链接脚本、Reset_Handler 基本正常
```

---

**2. 验证 HAL 初始化是否正常**

执行：

```c
HAL_Init();
```

如果程序卡住，要检查：

- SysTick 配置
- 中断向量表
- HAL 库配置
- 是否进入了 HardFault

---

**3. 验证 GPIO 是否正常**

翻转 LED：

```c
HAL_GPIO_TogglePin(GPIOC, GPIO_PIN_13);
HAL_Delay(500);
```

如果 LED 不闪，检查：

- GPIOC 时钟是否开启
- PC13 是否配置为输出
- LED 是高电平亮还是低电平亮
- 板子 PC13 是否真接了 LED

---

**4. 验证时钟是否正常**

可以先不配置复杂外部晶振，使用默认 HSI。等 LED 闪烁正常后，再配置 HSE + PLL 到 72 MHz。

这样做的原因是：

```text
先验证启动链路，再验证时钟配置。
```

否则 LED 不闪时，你很难判断是启动失败、GPIO 错误，还是时钟错误。

---

**常见坑总结**

**1. 程序下载成功，但不进入 `main()`**

可能原因：

- 启动文件不匹配
- 链接脚本地址错误
- Flash 起始地址错误
- 向量表损坏
- 栈地址错误
- 代码进入 HardFault

排查思路：

1. 确认启动文件是否是 F103 对应版本。
2. 确认链接脚本 Flash 起始地址是 `0x08000000`。
3. 在 `Reset_Handler` 打断点。
4. 在 `main()` 打断点。
5. 查看是否进入 `HardFault_Handler`。

---

**2. 一运行就进入 HardFault**

可能原因：

- 栈溢出
- 中断向量表错误
- 函数指针错误
- 访问非法地址
- RAM / Flash 配置不对
- 使用了未初始化的外设

排查思路：

1. 在 `HardFault_Handler` 打断点。
2. 查看调用栈。
3. 检查最近执行的代码。
4. 检查链接脚本的 RAM 大小。
5. 暂时注释外设初始化，只保留 LED 闪烁。

---

**3. `HAL_Delay()` 卡死**

常见原因：

- 没有调用 `HAL_Init()`
- SysTick 中断没有运行
- 全局中断被关闭
- 中断优先级配置异常
- 程序卡在更高优先级中断中

为什么会这样？

`HAL_Delay()` 通常依赖一个毫秒计数变量，这个变量由 SysTick 中断递增。如果 SysTick 不工作，计数不增加，`HAL_Delay()` 就会一直等。

排查思路：

1. 确认 `HAL_Init()` 在 `HAL_Delay()` 之前调用。
2. 检查 `SysTick_Handler()` 是否调用了 `HAL_IncTick()`。
3. 检查是否关闭了中断。
4. 暂时用空循环代替 `HAL_Delay()`，判断是不是 SysTick 问题。

---

**4. LED 不闪，但程序能进 `main()`**

可能原因：

- GPIO 时钟没开
- 引脚选错
- LED 电平逻辑反了
- 板子硬件和示例不一致
- GPIO 初始化函数没有被调用

排查思路：

1. 确认有：

```c
__HAL_RCC_GPIOC_CLK_ENABLE();
```

2. 确认调用了：

```c
MX_GPIO_Init();
```

3. 尝试分别写高低电平：

```c
HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_RESET);
HAL_Delay(1000);
HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_SET);
HAL_Delay(1000);
```

4. 如果是 Blue Pill，PC13 LED 通常是低电平点亮。

---

**5. 修改 Flash 起始地址后程序不能运行**

比如你把 App 放到：

```text
0x08002000
```

但没有同步修改：

- 链接脚本
- 向量表偏移
- Bootloader 跳转逻辑
- MSP 设置
- Reset_Handler 跳转地址

就可能导致程序无法启动。

普通入门阶段建议先使用默认地址：

```text
0x08000000
```

等理解启动流程后，再学习 Bootloader。

---

**结构化笔记**

建议把这篇内容沉淀到：

```text
01_knowledge/stm32/startup_and_main_stm32f103c8t6.md
```

可以按这个结构整理：

```text
# STM32 启动流程与 main()

## 1. 这个主题解决什么问题
- 上电后 CPU 如何找到第一条指令
- 栈如何初始化
- main() 如何被调用

## 2. 工程中的相关文件
- startup_stm32f103xb.s
- system_stm32f1xx.c
- main.c
- STM32F103C8Tx_FLASH.ld

## 3. 启动执行流
上电 / 复位
  ↓
向量表
  ↓
Reset_Handler
  ↓
SystemInit()
  ↓
main()

## 4. 关键概念
- 向量表
- MSP
- Reset_Handler
- SystemInit()
- HAL_Init()

## 5. 最小实验
- PC13 LED 闪烁
- main() 打断点
- Reset_Handler 打断点

## 6. 常见错误
- 不进 main()
- 进入 HardFault
- HAL_Delay 卡死
- LED 不闪
- 向量表地址错误
```

---

**一句话总结**

STM32 的启动流程就是：CPU 复位后先通过向量表找到栈顶和 `Reset_Handler`，由启动文件完成底层运行环境初始化，再进入 `main()`，之后才轮到你写的 HAL 初始化、外设配置和业务代码。理解这条链路，是以后排查“不进 main、HardFault、Delay 卡死、Bootloader 跳转失败”等问题的基础。