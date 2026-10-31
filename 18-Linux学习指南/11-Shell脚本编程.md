---
title: "第 11 章 Shell 脚本编程"
---

# 第 11 章 Shell 脚本编程

> 学完这章，你能把"每次都要手敲一串命令"的重复劳动写成一个脚本，让 Linux 每天自动替你干活——备份、清理日志、检查磁盘，全都不用你盯着。

## 本章你将学会

- 写出一个能跑的 `.sh` 脚本，并搞懂 `./脚本`、`bash 脚本`、`source 脚本` 三种执行方式的区别
- 熟练使用变量、引号、命令替换 `$()`、算术运算 `$(( ))`
- 用 `$0 $1 $# $@ $?` 拿到脚本的参数和上一条命令的退出码
- 用 `if / case / for / while` 写出能做判断和循环的脚本
- 写出带返回值的函数，并看懂 `set -euo pipefail` 这行"生产级脚本标配"
- 用 `bash -x` 调试跑飞的脚本
- 用 `grep / awk / sed` 配合管道处理日志
- 用 `crontab` 让脚本每天定时自动跑
- 亲手写完 3 个能直接用的实战脚本：文件备份、批量重命名、磁盘健康检查

---

## 为什么要学 Shell 脚本

你前面学的所有命令——`ls`、`cd`、`grep`、`find`、`tar`、`df`——都是一条一条敲的。但真实工作里，很多事情是**一串命令按固定顺序重复执行**：

- 每天凌晨把某个目录打包备份到另一台机器
- 每周清理一次 7 天前的旧日志
- 磁盘使用率超过 80% 时发个提醒
- 批量把目录里 100 个 `*.JPG` 改成小写 `.jpg`

如果你每天手动敲，一年下来几千条命令，累不说，还容易敲错。**Shell 脚本就是把这一串命令写进一个文本文件，让 bash 替你一次跑完。** 它是后端/运维的看家本领：你去看任何一台服务器的 `/etc/cron.daily/` 目录，里面全是别人写好的脚本。

先建立一个观念：Shell 脚本不是"编程语言"里的主力选手（复杂业务请用 Python），它的强项是**把系统命令粘起来、自动化重复操作**。写得短、糙、能跑，就是好脚本。

---

## 11.1 第一个脚本：Hello World 与 shebang

打开你的编辑器（nano 或者 VS Code），新建一个文件叫 `hello.sh`：

```bash
$ nano hello.sh
```

写入下面三行：

```bash
#!/bin/bash
# 这是我的第一个脚本
echo "Hello, Linux!"
```

保存退出（nano 里是 `Ctrl+O` 回车、`Ctrl+X`）。现在你有了一个脚本文件。我们逐行讲：

| 行 | 内容 | 含义 |
|---|---|---|
| 第 1 行 | `#!/bin/bash` | **shebang**（读作"希邦"）。`#!` 告诉系统："这个脚本请用 `/bin/bash` 这个程序来解释执行"。没有这行，系统会用默认 shell，可能行为不一致 |
| 第 2 行 | `# 这是...` | 以 `#` 开头的是**注释**，bash 会忽略。第 1 行是唯一的例外 |
| 第 3 行 | `echo "Hello, Linux!"` | 真正的命令：打印一句话 |

> 📌 **注意：** `#!` 必须写在**第一行第一个字符**，前面不能有空格、不能有空行，写错了整行 shebang 就失效。在 Ubuntu 24.04 里 bash 的路径就是 `/bin/bash`（你可以用 `which bash` 确认）。

### 三种执行方式（重点，最容易踩坑）

写好脚本后，怎么跑？有三种方式，**行为不一样**，必须分清：

```bash
# 方式一：直接执行（需要先加执行权限）
$ chmod +x hello.sh
$ ./hello.sh

# 方式二：用 bash 显式调用
$ bash hello.sh

# 方式三：source（在当前 shell 里执行）
$ source hello.sh
# 或者简写
. hello.sh
```

| 方式 | 是否需要 chmod +x | 在哪个 shell 里跑 | 对当前终端的影响 |
|---|---|---|---|
| `./hello.sh` | 需要 | **新开一个子 bash** | 脚本里的 `cd`、变量都不影响你当前终端 |
| `bash hello.sh` | 不需要 | **新开一个子 bash** | 同上 |
| `source hello.sh` / `. hello.sh` | 不需要 | **就在你当前这个 shell 里跑** | 脚本里改的变量、`cd` 目录，会**直接改变你当前终端** |

> 💡 **小技巧：** 为什么 `source` 要存在？想象你写了一个脚本用来"切换到项目目录 + 激活 Python 虚拟环境"。如果你用 `./脚本`，子 shell 里 cd 完就结束了，你当前终端还在原地——白切了。用 `source 脚本`，它就在你当前终端里执行，切完目录你立刻就在项目里了。第 12 章你会看到 `source ~/.bashrc` 就是这个原理。

试试这个对比实验，理解"子 shell"：

```bash
# 写一个脚本：切到 /tmp 并打印
$ cat > go.sh << 'EOF'
cd /tmp
echo "现在脚本里的目录是: $(pwd)"
EOF

$ chmod +x go.sh
$ pwd          # 假设现在是 /home/yourname
/home/yourname
$ ./go.sh
现在脚本里的目录是: /tmp
$ pwd          # 你看，当前目录没变！
/home/yourname

$ source go.sh
现在脚本里的目录是: /tmp
$ pwd          # 这次真的切过去了
/tmp
```

> 📌 **注意：** 写脚本时默认用 `./脚本` 或 `bash 脚本`（隔离，不会搞乱当前终端）；只有"激活环境变量/别名"这类脚本才用 `source`。

---

## 11.2 变量：定义、使用与三种引号

### 变量的基本用法

Shell 里定义变量**等号两边不能有空格**（这是新手最常犯的错）：

```bash
$ name="张三"          # 正确：等号两边没空格
$ age=20               # 数字不用加引号
$ echo $name           # 用变量要加 $
张三
$ echo "我叫 $name，今年 $age 岁"
我叫 张三，今年 20 岁
```

```bash
# 错误示范（不要这么写）
$ name = "张三"        # 报错：bash: name: 未找到命令
```

为什么等号两边不能有空格？因为在 bash 眼里，`name = "张三"` 是"执行一个叫 `name` 的命令，参数是 `=` 和 `张三`"——它把 `=` 当成参数了。记住：**赋值写法永远是 `变量=值`，紧贴着写。**

### 单引号、双引号、反引号——三种引号的区别

这是 Shell 里最容易混的东西，我用一张表讲透：

```bash
$ name="Linux"
$ echo "双引号：$name"
双引号：Linux
$ echo '单引号：$name'
单引号：$name
$ echo "反引号今天是：`date +%Y`"
反引号今天是：2026
```

| 引号 | 变量会被展开吗 | 命令会执行吗 | 用途 |
|---|---|---|---|
| 双引号 `" "` | **会**（`$name` 显示值） | 会 | 大多数情况用它，能处理带空格的字符串 |
| 单引号 `' '` | **不会**（原样显示 `$name`） | 不会 | 想让 `$`、`*`、`\` 这些符号原样显示时用 |
| 反引号 `` ` ` `` 或 `$( )` | —— | **把命令输出当字符串** | 命令替换，见下文 |

> 📌 **注意：** 凡是变量后面要跟别的字符，或者字符串里有空格，**一律用双引号包起来**，比如 `echo "你好 $name"`、`ls "$filename"`。变量不加引号是 Shell 脚本里排名第一的安全隐患（第 11.8 节讲 `set -u` 时还会回来）。

### 命令替换 `$( )`

把一条命令的输出"抓下来"存进变量，这叫命令替换。两种写法：

```bash
# 老式写法（反引号）
$ files=`ls | wc -l`

# 新式写法（$()，推荐，能嵌套、可读性好）
$ files=$(ls | wc -l)

$ echo "当前目录有 $files 个文件"
当前目录有 12 个文件
```

实际脚本里常见的例子：

```bash
#!/bin/bash
today=$(date +%Y%m%d)          # 今天的日期，比如 20261013
echo "今天是 $today，开始干活"
```

> 💡 **小技巧：** 推荐永远用 `$( )` 而不是反引号。因为 `$(嵌套 $(命令))` 能无限套，反引号嵌套要靠 `\` 转义，很难看。

### 算术运算 `$(( ))`

Shell 里数字默认都是"字符串"，直接 `age+1` 不会算数。要算数学用 `$(( ))`：

```bash
$ a=10
$ b=3
$ echo $((a + b))        # 13
$ echo $((a * b))        # 30
$ echo $((a / b))        # 3（注意：整数除法，直接截断）
$ echo $((a % b))        # 1（取余）
$ echo $((a++))          # 自增
```

> 📌 **注意：** `$(( ))` 里**不需要给变量加 `$`**（写 `$(( $a + $b ))` 也能跑，但写 `$(( a + b ))` 更地道）。而且它只支持整数，要算小数请用 `bc` 命令（后面用到再说）。

---

## 11.3 特殊变量：`$0 $1 $# $@ $?` 与 `read`

脚本不是死的，你可以给它传参数。比如你写个备份脚本，想备份哪个目录，就当参数传进去：

```bash
$ ./backup.sh /home/yourname/data /backup
```

脚本内部用下面这几个"特殊变量"接收：

| 变量 | 含义 | 上面例子里的值 |
|---|---|---|
| `$0` | 脚本自己的名字（路径） | `./backup.sh` |
| `$1` | 第 1 个参数 | `/home/yourname/data` |
| `$2` | 第 2 个参数 | `/backup` |
| `$3`、`$4`…… | 第 3、4 个参数 | （没有） |
| `$#` | 参数总个数 | `2` |
| `$@` | **所有参数**（一个一个分开），常用于循环遍历 | `/home/yourname/data` `/backup` |
| `$?` | **上一条命令的退出码**（0 表示成功，非 0 表示失败） | 见下文 |

写个试试：

```bash
$ cat > args.sh << 'EOF'
#!/bin/bash
echo "脚本名字是: $0"
echo "一共收到 $# 个参数"
echo "第一个参数是: $1"
echo "全部参数是: $@"
EOF

$ chmod +x args.sh
$ ./args.sh apple banana cherry
脚本名字是: ./args.sh
一共收到 3 个参数
第一个参数是: apple
全部参数是: apple banana cherry
```

### `$?`：看懂"命令成没成功"

这是脚本健壮性的关键。Linux 里**每条命令跑完都会返回一个退出码**：0 是成功，1、2、127……都是各种失败。

```bash
$ ls /etc > /dev/null
$ echo $?
0                     # 成功了

$ ls /不存在的目录 > /dev/null
$ echo $?
2                     # 失败了

$ grep "abc" /etc/hostname > /dev/null
$ echo $?
1                     # grep 没找到，也返回 1
```

脚本里你会经常写"上一条命令失败了就退出"这种判断（11.7 节讲 `set -e`）。

### `read`：让脚本跟你交互

有些参数不想写死，想让脚本跑起来后**问你**，用 `read`：

```bash
$ cat > ask.sh << 'EOF'
#!/bin/bash
read -p "你叫什么名字？ " username
read -p "你今年多大？ " age
echo "你好 $username，明年你就 $((age + 1)) 岁了"
EOF

$ chmod +x ask.sh
$ ./ask.sh
你叫什么名字？ 小明
你今年多大？ 20
你好 小明，明年你就 21 岁了
```

`-p` 是"在输入前打印一句提示"。没有 `-p`，`read` 会傻乎乎地等你输，用户都不知道该干嘛。

### `export` 简介

变量默认只在当前 shell 有效。想让"子 shell / 子脚本能看到这个变量"，要加 `export`：

```bash
$ name="张三"
$ bash -c 'echo "子 shell 看到: $name"'
子 shell 看到:            # 空的！子 shell 看不到

$ export name
$ bash -c 'echo "子 shell 看到: $name"'
子 shell 看到: 张三
```

`export` 的完整机制（PATH、`.bashrc` 持久化）放到**第 12 章**细讲，现在你只要记住："变量想传给子进程，就 `export` 一下"。

---

## 11.4 条件判断：`test`、`[ ]`、`[[ ]]` 与 `if`

### 最基本的 `if` 结构

Shell 的 if 语法有点怪（结尾要写 `fi`），看一遍就记住了：

```bash
if 条件; then
    命令
elif 条件; then
    命令
else
    命令
fi
```

> 📌 **注意：** `if` 后面那个分号 `;` 不能少（或者把 `then` 换行写也行）。结尾的 `fi` 是 `if` 反过来拼，写多了自然记住。

### 三种判断写法

判断"条件成不成立"，有三种等价写法：

```bash
# 写法一：test 命令
$ test -f /etc/hostname && echo "文件存在"

# 写法二：[ ]（test 的别名，注意括号两边必须有空格！）
$ [ -f /etc/hostname ] && echo "文件存在"

# 写法三：[[ ]]（bash 增强版，推荐，功能更多）
$ [[ -f /etc/hostname ]] && echo "文件存在"
```

> ⚠️ **警告：** `[` 其实是一个独立命令（就是 `test`），所以 `[ -f xxx ]` 里**括号两边必须有空格**。写成 `[-f xxx]` 或 `[ -f xxx]`（少个空格）都会报错。这是新手第一高发错误。

### 常用判断条件（背这张表）

**文件判断：**

| 写法 | 判断什么 |
|---|---|
| `[ -f 文件 ]` | 存在且是**普通文件**（不是目录） |
| `[ -d 目录 ]` | 存在且是**目录** |
| `[ -e 路径 ]` | 路径**存在就行**（不管是文件还是目录） |
| `[ -r 文件 ]` | 存在且**当前用户可读** |
| `[ -w 文件 ]` | 存在且**可写** |
| `[ -x 文件 ]` | 存在且**可执行**（脚本有没有 +x 就看它） |
| `[ -s 文件 ]` | 存在且**非空**（大小 > 0） |

**字符串判断：**

| 写法 | 判断什么 |
|---|---|
| `[ "$a" = "$b" ]` | 两个字符串**相等** |
| `[ "$a" != "$b" ]` | 不相等 |
| `[ -z "$a" ]` | 字符串**为空**（长度 0） |
| `[ -n "$a" ]` | 字符串**非空** |

**数值判断（注意：不是数学里的 `>` `<`，是下面这几个怪符号）：**

| 写法 | 含义 |
|---|---|
| `[ "$a" -eq "$b" ]` | 等于（equal） |
| `[ "$a" -ne "$b" ]` | 不等于（not equal） |
| `[ "$a" -gt "$b" ]` | 大于（greater than） |
| `[ "$a" -ge "$b" ]` | 大于等于 |
| `[ "$a" -lt "$b" ]` | 小于（less than） |
| `[ "$a" -le "$b" ]` | 小于等于 |

> 📌 **注意：** 字符串相等用 `=`，数字相等用 `-eq`。用错了脚本能跑但逻辑不对——这是最难查的 bug。数字比较时变量加双引号（`"$a" -eq`），防止 `$a` 是空的语法报错。

### `[[ ]]` 的增强能力（推荐用）

`[[ ]]` 是 bash 内置的，比 `[ ]` 好用，主要多了这些：

```bash
# 1. 支持 && 和 || 组合条件
if [[ $age -ge 18 && $age -le 60 ]]; then
    echo "成年人"
fi

# 2. 支持正则和通配符匹配
if [[ $file == *.txt ]]; then
    echo "这是个 txt 文件"
fi

# 3. 变量不用加双引号（更省心）
```

### 一个完整的 if 例子：检查文件存不存在

```bash
$ cat > check.sh << 'EOF'
#!/bin/bash
file="/etc/hostname"

if [[ -e "$file" ]]; then
    echo "$file 存在"
    if [[ -f "$file" ]]; then
        echo "而且它是个普通文件，内容是："
        cat "$file"
    elif [[ -d "$file" ]]; then
        echo "它其实是个目录"
    fi
else
    echo "$file 不存在！"
fi
EOF

$ chmod +x check.sh
$ ./check.sh
/etc/hostname 存在
而且它是个普通文件，内容是：
your-machine-name
```

### `case`：多分支选择

if 嵌套到三层以上就该换 `case` 了（类似其他语言的 `switch`）：

```bash
$ cat > greet.sh << 'EOF'
#!/bin/bash
read -p "你想看什么？(1=日期 2=路径 3=退出) " choice

case "$choice" in
    1)
        echo "今天是 $(date)"
        ;;
    2)
        echo "你在 $(pwd)"
        ;;
    3|q|Q)          # 3、q、Q 都走这个分支
        echo "再见"
        ;;
    *)              # 以上都不匹配时的默认分支
        echo "看不懂你输的什么：$choice"
        ;;
esac
EOF
```

> 📌 **注意：** `case` 结尾是 `esac`（case 反过来）；每个分支结尾是 `;;`（两个分号，不能漏）；匹配模式后面是 `)`；最后必须有 `esac`。

---

## 11.5 循环：`for`、`while`、`break`、`continue`

### `for` 循环

`for` 把"一堆东西"挨个拿出来处理一遍。

```bash
# 基本形态：遍历一组词
$ for name in 张三 李四 王五; do
    echo "你好 $name"
done

# 范围展开 {1..5}：打印 1 到 5
$ for i in {1..5}; do
    echo "第 $i 次"
done

# 步进：1 到 10，每次加 2
$ for i in {1..10..2}; do echo $i; done
# 输出 1 3 5 7 9

# seq 命令（老派写法，作用同上）
$ for i in $(seq 1 5); do echo $i; done
```

实战：遍历当前目录所有 `.txt` 文件，把它们改成 `.bak`：

```bash
$ for f in *.txt; do
    mv "$f" "${f%.txt}.bak"
done
```

> 💡 **小技巧：** `${f%.txt}` 是"变量截断"——把 `f` 末尾的 `.txt` 去掉，再拼上 `.bak`。这种字符串处理在批量改名里极常用。

### `while` 循环

当"条件一直成立"就一直循环：

```bash
# 从 1 数到 5
$ i=1
$ while [[ $i -le 5 ]]; do
    echo $i
    i=$((i + 1))
done
```

读文件每一行（日志处理最常用）：

```bash
while read line; do
    echo "这一行是: $line"
done < /etc/hostname
```

> 📌 **注意：** `while` 读文件这种写法 `done < 文件`，把文件喂给 `read`。处理几百行的日志脚本基本都长这样。

### `break` 和 `continue`

- `break`：立刻跳出整个循环
- `continue`：跳过这一轮，进入下一轮

```bash
# 找到第一个大于 3 的数就停
$ for i in 1 2 3 4 5; do
    if [[ $i -gt 3 ]]; then
        echo "找到了: $i"
        break
    fi
done

# 遇到 3 就跳过
$ for i in 1 2 3 4 5; do
    [[ $i -eq 3 ]] && continue
    echo $i          # 输出 1 2 4 5，没有 3
done
```

---

## 11.6 函数

函数就是把一段常用代码打包起来，给它起个名字反复调用。

```bash
$ cat > func.sh << 'EOF'
#!/bin/bash

# 定义函数：打招呼
greet() {
    echo "你好，$1！"       # $1 是函数的第一个参数，不是脚本的
}

# 定义函数：两数相加，用 return 返回
add() {
    local a=$1
    local b=$2
    return $((a + b))       # return 只能返回 0-255 的整数（退出码）
}

# 调用
greet "小明"
greet "小红"

add 3 5
echo "3 + 5 的结果是: $?"
EOF

$ chmod +x func.sh
$ ./func.sh
你好，小明！
你好，小红！
3 + 5 的结果是: 8
```

> ⚠️ **重要：** 函数里的 `$1 $2` 是**函数自己的参数**，不是脚本的参数，别搞混。`return` 只能返回 **0~255 的整数**（本质是退出码），想返回字符串或大数，用 `echo` 输出，外面再用 `$(函数名)` 抓：

```bash
# 想返回字符串？用 echo
get_time() {
    echo "现在是 $(date +%H:%M)"
}

now=$(get_time)
echo "抓到了: $now"
```

> 💡 **小技巧：** 函数里定义变量用 `local 变量=值`，这样它只在函数内部有效，不会污染外面。脚本一大起来全靠这个避免变量撞名。

---

## 11.7 退出码与 `set -euo pipefail`

### 为什么需要 `set` 这一行

新手写的脚本经常这样：第一步 `cp` 失败了（比如源目录不存在），脚本**不报错继续往下跑**，最后产生一堆错误结果，你还以为成功了。生产级脚本第一行几乎都加这么一句：

```bash
#!/bin/bash
set -euo pipefail
```

拆开逐个解释：

| 选项 | 全称 | 含义 | 不写会怎样 |
|---|---|---|---|
| `-e` | exit | **任何一条命令返回非 0（失败），脚本立刻退出** | 错误被忽略，继续跑，越跑越错 |
| `-u` | unset | **使用未定义的变量直接报错**（比如手滑写成 `$nmae`） | 空变量悄悄当空字符串，bug 难查 |
| `-o pipefail` | pipe fail | **管道里任何一步失败，整个管道算失败** | `cmd1 | cmd2` 只看最后 cmd2 的退出码，cmd1 崩了没人知道 |

举个例子理解 `pipefail` 的意义：

```bash
# 没有 pipefail 时
$ cat 不存在的文件 | wc -l
0                    # wc -l 成功了（数了 0 行），退出码 0
$ echo $?
0                    # 居然显示成功！cat 失败被吞了

# 加了 pipefail
$ set -o pipefail
$ cat 不存在的文件 | wc -l
$ echo $?
1                    # 现在能正确反映 cat 的失败
```

> 📌 **注意：** `set -e` 很严格，有时候你就是"知道这条命令会失败但想继续"（比如 `grep` 没找到返回 1）。那种情况可以写成 `grep xxx || true`，意思是"grep 失败了就执行 true（成功），整体不报错"。

---

## 11.8 用 `bash -x` 调试脚本

脚本跑飞了别慌，bash 自带"单步调试"——`bash -x`：

```bash
$ bash -x ./args.sh apple banana
+ ./args.sh:3=脚本名字是: ./args.sh      # 它会把执行的每一条命令先打出来
+ echo 一共收到 2 个参数
一共收到 2 个参数
...
```

`+` 号开头的行是 bash 正在执行的命令（变量已经替换成真实值）。你一眼就能看出："哦，原来它在这一步拿到的是空值"或者"原来它进了错误的分支"。

> 💡 **小技巧：** 也可以在脚本内部临时打开调试：在脚本某行前加 `set -x`，想停就 `set +x`。这样你只调试那一段，不用从头 trace 到尾。

---

## 11.9 实战：管道 + `grep / awk / sed` 处理日志

脚本写多了你会发现，**80% 的工作是"从日志里捞出我要的信息"**。这三个命令是文本处理三剑客：

- `grep`：按**关键词**过滤行
- `awk`：按**列**取数据
- `sed`：按**规则**做替换

### 例子 1：找出 nginx 日志里访问最多的 IP

假设你有个 access.log，每行长这样：

```text
192.168.1.10 - - [13/Oct/2026:10:00:01] "GET /index.html" 200
192.168.1.15 - - [13/Oct/2026:10:00:02] "GET /api" 404
192.168.1.10 - - [13/Oct/2026:10:00:03] "GET /home" 200
```

一行命令搞定（这就是"管道"的威力）：

```bash
$ awk '{print $1}' access.log | sort | uniq -c | sort -rn
```

拆开看：

| 命令 | 作用 |
|---|---|
| `awk '{print $1}'` | 取每行**第 1 列**（默认按空格分列，第 1 列就是 IP） |
| `sort` | 把相同的 IP 排到一起 |
| `uniq -c` | 合并重复行，并在前面数个数 |
| `sort -rn` | 按数字**倒序**排，访问最多的在最上面 |

输出：

```text
2 192.168.1.10
1 192.168.1.15
```

### 例子 2：统计 404 错误有多少次

```bash
$ grep " 404" access.log | wc -l
```

### 例子 3：用 sed 批量替换文件内容

```bash
# 把 config.txt 里所有的 127.0.0.1 改成 0.0.0.0，直接改原文件（-i）
$ sed -i 's/127.0.0.1/0.0.0.0/g' config.txt
```

`s/旧/新/g`：`s` 是 substitute，`g` 是全局（一行里出现多次都换）。

> ⚠️ **警告：** `sed -i` 直接改原文件，**不备份**。想保险点用 `sed -i.bak 's/...' file`，它会自动留一份 `file.bak`。

---

## 11.10 crontab：让脚本定时自动跑

写好脚本，最爽的就是"不用我手动敲，系统每天自己跑"。`cron` 就是干这个的（crontab 是它的配置工具）。

### 五段时间语法（背下来）

打开定时任务配置：

```bash
$ crontab -e
```

格式是这样的（一行一条任务）：

```text
分  时  日  月  周   要执行的命令
*   *   *   *   *    命令
┬  ┬  ┬  ┬  ┬
│  │  │  │  └─ 星期几 (0-7，0 和 7 都是周日)
│  │  │  └──── 月份 (1-12)
│  │  └─────── 几号 (1-31)
│  └────────── 小时 (0-23)
└───────────── 分钟 (0-59)
```

| 写法 | 含义 |
|---|---|
| `*` | 每一个（每分/每小时/每天……） |
| `*/5` | 每 5 个单位（如 `*/5 * * * *` = 每 5 分钟） |
| `10 * * * *` | 每小时的第 10 分钟 |
| `0 2 * * *` | 每天凌晨 2:00 |
| `0 1 * * 0` | 每周日凌晨 1:00 |
| `30 3 1 * *` | 每月 1 号凌晨 3:30 |
| `0 8,12,18 * * *` | 每天 8 点、12 点、18 点 |
| `0 9-18 * * 1-5` | 工作日 9 点到 18 点，每小时整点 |

来几个真实例子：

```bash
# 每天凌晨 2 点备份 /data 到 /backup（注意要写绝对路径！）
0 2 * * * /home/yourname/backup.sh /data /backup

# 每 10 分钟检查一次磁盘，结果写到日志里
*/10 * * * * /home/yourname/disk_check.sh >> /home/yourname/logs/disk.log 2>&1

# 每周日凌晨 3 点清理 7 天前的日志
0 3 * * 0 find /var/log/myapp -mtime +7 -name "*.log" -delete
```

### crontab 的三个大坑（每个都踩过）

1. **必须写绝对路径。** cron 跑的时候没有你的当前目录，也没有你 `.bashrc` 里那些 PATH。写 `backup.sh` 它会告诉你"找不到命令"，必须写 `/home/yourname/backup.sh`。
2. **环境变量是干净的。** 你在终端里 `export` 的变量、装的 `nvm`、`conda` 环境，cron 一概不知道。这是"我手动跑脚本好好的，cron 里就报错"的头号原因。解决办法：在脚本开头自己重新 `export`，或者用 `EnvironmentFile`（13 章 systemd 的做法）。
3. **输出默认没地方看。** 脚本里 `echo` 的东西、报错，cron 默认会尝试发邮件给 root——你根本收不到。**必须自己重定向到日志文件**：`>> 日志路径 2>&1`。`2>&1` 的意思是"把错误输出也扔到正确输出那个地方"，这样正常信息和报错都进同一个日志。

常用命令：

```bash
$ crontab -l          # 列出当前所有定时任务
$ crontab -e          # 编辑
$ crontab -r          # 删除所有定时任务（慎用！）
```

> ⚠️ **警告：** `crontab -r` 一条命令清空你所有定时任务，没有提示。新手别用，要删就 `crontab -e` 进去手动删那一行。

> 📌 **注意：** WSL2 默认**没有一直开机**（你关电脑它就停了）。所以"每天凌晨 2 点"的任务，如果你电脑凌晨没开，那次就错过了，**不会补跑**。真要定时任务 7×24 跑，请放到 13 章讲的云服务器上。

---

## 11.11 实战脚本一：带日志的文件备份脚本

这是最经典的运维脚本。功能：把指定目录打包成带日期的 tar.gz，写日志，磁盘不够就报警。

```bash
$ mkdir -p ~/scripts
$ nano ~/scripts/backup.sh
```

写入：

```bash
#!/bin/bash
# backup.sh —— 把源目录打包备份到目标目录，带日志

set -euo pipefail

# ---------- 可配置变量 ----------
SRC_DIR="${1:-/home/yourname/data}"     # 第 1 个参数是源目录，没给就用默认
DST_DIR="${2:-/home/yourname/backup}"  # 第 2 个参数是备份目录
LOG_FILE="$DST_DIR/backup.log"
KEEP_DAYS=7                            # 保留多少天的备份
# ---------------------------------

# 确保目标目录和日志目录存在
mkdir -p "$DST_DIR"

# 打印日志的小函数：同时输出到屏幕和日志文件
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "===== 备份开始 ====="
log "源目录: $SRC_DIR"
log "目标目录: $DST_DIR"

# 1. 检查源目录存不存在
if [[ ! -d "$SRC_DIR" ]]; then
    log "错误：源目录 $SRC_DIR 不存在，退出"
    exit 1                          # 非 0 退出码表示失败
fi

# 2. 打包，文件名带日期
BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S).tar.gz"
BACKUP_PATH="$DST_DIR/$BACKUP_NAME"

log "正在打包到 $BACKUP_PATH ..."
tar -czf "$BACKUP_PATH" -C "$(dirname "$SRC_DIR")" "$(basename "$SRC_DIR")"

# 3. 打印这次备份多大
SIZE=$(du -sh "$BACKUP_PATH" | awk '{print $1}')
log "备份完成，大小: $SIZE"

# 4. 删掉 7 天前的旧备份
log "清理 $KEEP_DAYS 天前的旧备份..."
find "$DST_DIR" -name "backup_*.tar.gz" -mtime +$KEEP_DAYS -delete

log "===== 备份结束 ====="
```

逐行讲解关键部分：

| 代码 | 为什么这么写 |
|---|---|
| `set -euo pipefail` | 上面讲了，任何一步失败立刻停 |
| `${1:-默认值}` | 取第 1 个参数，**没传就用冒号后那个默认值**。这是脚本可选参数的标准写法 |
| `mkdir -p` | 目录不存在就建，不报错 |
| `tee -a "$LOG_FILE"` | `tee` 的作用是"既显示到屏幕，又追加到文件"。`-a` 是 append（追加，不覆盖） |
| `exit 1` | 失败了，用非 0 退出码告诉外面"没成功" |
| `tar -czf 输出 -C 目录 名字` | `-C` 是"先切到那个目录再打包"，这样解压出来不带一长串绝对路径 |
| `find ... -mtime +7 -delete` | 找 7 天前的文件直接删 |

跑一下试试：

```bash
$ chmod +x ~/scripts/backup.sh
$ mkdir -p ~/data
$ echo "一些重要数据" > ~/data/note.txt
$ ~/scripts/backup.sh ~/data ~/backup
[2026-10-13 20:00:01] ===== 备份开始 =====
[2026-10-13 20:00:01] 源目录: /home/yourname/data
[2026-10-13 20:00:01] 目标目录: /home/yourname/backup
[2026-10-13 20:00:01] 正在打包到 /home/yourname/backup/backup_20261013_200001.tar.gz ...
[2026-10-13 20:00:01] 备份完成，大小: 20K
...
$ ls ~/backup
backup_20261013_200001.tar.gz  backup.log
```

接进 crontab（每天凌晨 2 点跑）：

```bash
$ crontab -e
# 加一行（注意绝对路径 + 日志重定向）
0 2 * * * /home/yourname/scripts/backup.sh >> /home/yourname/backup/cron.log 2>&1
```

---

## 11.12 实战脚本二：批量重命名

场景：你从相机导进来一堆 `IMG_001.JPG`、`IMG_002.JPG`……想统一改成 `vacation_001.jpg` 这种小写、带前缀的格式。

```bash
$ nano ~/scripts/rename.sh
```

```bash
#!/bin/bash
# rename.sh —— 把目录里的 *.JPG 改成 vacation_序号.jpg

set -euo pipefail

DIR="${1:-.}"          # 没给目录就用当前目录
PREFIX="vacation"
COUNT=1

echo "处理目录: $DIR"

# 遍历所有 .JPG（不区分大小写也可以用 *.jpg *.JPG）
for f in "$DIR"/*.JPG; do
    # 防一手：如果没有匹配文件，glob 会原样返回 "*.JPG"，判断一下
    [[ -e "$f" ]] || { echo "没有 .JPG 文件"; exit 0; }

    # 数字序号补零：001、002 ...
    NEW_NAME=$(printf "%s_%03d.jpg" "$PREFIX" "$COUNT")
    NEW_PATH="$DIR/$NEW_NAME"

    # 防止覆盖已存在的文件
    if [[ -e "$NEW_PATH" ]]; then
        echo "跳过：$NEW_PATH 已存在"
    else
        mv "$f" "$NEW_PATH"
        echo "重命名: $f -> $NEW_PATH"
    fi

    COUNT=$((COUNT + 1))
done

echo "完成，共处理 $((COUNT - 1)) 个文件"
```

关键点：

| 代码 | 解释 |
|---|---|
| `${1:-.}` | 没给参数就用 `.`（当前目录） |
| `for f in "$DIR"/*.JPG` | 遍历匹配的文件 |
| `[[ -e "$f" ]] \|\| ...` | 没匹配到时 glob 不展开，会留下字面量 `*.JPG`，这里防一下 |
| `printf "%s_%03d.jpg" "$PREFIX" 1` | `%03d` 让数字补零到 3 位：1 → 001 |
| `mv "$f" "$NEW_PATH"` | 注意变量都加了双引号（文件名可能有空格） |

> ⚠️ **警告：** 批量改名前，**先把 `mv` 换成 `echo` 试跑一遍**（dry-run），看看要改成什么样，确认没问题再真改。这是所有批量操作的黄金法则。

---

## 11.13 实战脚本三：磁盘空间健康检查

场景：服务器跑久了磁盘快满了都不知道。这个脚本每天跑一次，使用率超过 80% 就把 top 大文件列出来写日志（真实环境可以接邮件/钉钉，这里先打日志）。

```bash
$ nano ~/scripts/disk_check.sh
```

```bash
#!/bin/bash
# disk_check.sh —— 检查磁盘使用率，超过阈值就报警并列出大目录

set -euo pipefail

THRESHOLD=80                        # 阈值 80%
LOG_FILE="/tmp/disk_check.log"

log() {
    echo "[$(date '+%F %T')] $1" >> "$LOG_FILE"
}

log "===== 开始磁盘检查 ====="

# df -h 输出里挑出挂载点那几行（跳过 tmpfs 这些临时文件系统）
# 我们关心 / 和 /home 这种真实磁盘
df -h --output=pcent,target | tail -n +2 | while read -r percent mount; do
    # percent 长这样 "85%"，去掉百分号
    usage=${percent%\%}

    log "挂载点 $mount 使用率: $usage%"

    if [[ $usage -ge $THRESHOLD ]]; then
        log "⚠️ 警告：$mount 超过 ${THRESHOLD}%！正在列出最大的 5 个目录..."
        log "$(du -sh "$mount"/* 2>/dev/null | sort -rh | head -5)"
    fi
done

log "===== 检查结束 ====="
```

逐行讲：

| 代码 | 解释 |
|---|---|
| `df -h --output=pcent,target` | 只输出"使用率"和"挂载点"两列，干净 |
| `tail -n +2` | 跳过表头那一行 |
| `while read -r percent mount` | 每行读成两个变量：percent、mount |
| `${percent%\%}` | 把 `85%` 末尾的 `%` 去掉，得到数字 `85` |
| `du -sh "$mount"/* 2>/dev/null` | 统计每个子目录多大；`2>/dev/null` 把"权限不够"的报错扔掉 |
| `sort -rh` | 按人可读大小（K/M/G）倒序排 |
| `head -5` | 只取前 5 个 |

跑一下：

```bash
$ chmod +x ~/scripts/disk_check.sh
$ ~/scripts/disk_check.sh
$ cat /tmp/disk_check.log
[2026-10-13 20:30:00] ===== 开始磁盘检查 =====
[2026-10-13 20:30:00] 挂载点 / 使用率: 35%
[2026-10-13 20:30:00] ===== 检查结束 =====
```

接进 cron：

```bash
$ crontab -e
# 每天早上 8 点检查一次
0 8 * * * /home/yourname/scripts/disk_check.sh
```

> 📌 **注意：** 真实服务器上 `2>/dev/null` 是为了不让 "Permission denied" 刷屏。但排查问题时你可以临时去掉它，看看哪些目录没权限读。

---

## ⚠️ 危险操作与安全红线

> ⚠️ **警告：`rm -rf` 在脚本里是核弹！** 尤其是 `rm -rf "$DIR"/` 这种——如果 `$DIR` 变量没设（空字符串），就变成了 `rm -rf /`，全盘蒸发。写删除类脚本时永远：① 先 `echo` 打印一遍要删什么；② 变量加双引号；③ 永远不写 `rm -rf /` 这种硬编码。

> ⚠️ **警告：** 脚本里 `exit` 会直接结束当前 shell。如果你用 `source` 跑脚本，`exit` 会把你当前终端也关掉。所以系统脚本用 `./` 或 `bash` 跑，别随便 `source`。

> ⚠️ **警告：** crontab 的任务以你用户的权限跑，但 `find -delete`、`tar` 这些如果路径写错，删的就是别的目录。上线前先手动跑一遍验证。

> ⚠️ **警告：** `set -e` 不是万能的。它管不住"管道里中间命令失败"（所以才要 pipefail），也管不住函数里的某些情况。脚本复杂了一定要 `bash -x` 走一遍。

---

## 常见报错与排查

| 现象 | 原因 | 解决 |
|---|---|---|
| `bash: ./hello.sh: 权限不够` | 没加执行权限 | `chmod +x hello.sh` |
| `bash: ./hello.sh: /bin/bash^M: 解释器错误` | 文件是 Windows 换行（CRLF） | `sed -i 's/\r$//' hello.sh`，VS Code 右下角把换行改成 LF |
| `command not found`（脚本里的命令） | cron 环境 PATH 不全 | 用绝对路径，或脚本开头 `export PATH=...` |
| `syntax error near unexpected token` | 少了 `fi` / `done` / `;;` / 引号不配对 | `bash -n script.sh` 做语法检查（不执行） |
| `line 3: name: 未找到命令` | 赋值时等号两边有空格 | 改成 `name=值` |
| `test: -f: 缺少参数` | `[` 括号两边没空格 | 写成 `[ -f "$file" ]` |
| crontab 任务"手动跑正常、定时就失败" | 环境变量、相对路径 | 全用绝对路径，脚本里自己 export 变量 |

---

## 动手练习

1. **改写 `hello.sh`：** 让它接收一个名字参数，没有参数时提示"请输入名字"，否则打印"你好，XXX"。
2. **写一个 `mkdir_and_cd.sh`：** 接收一个目录名参数，不存在就创建，存在就提示；最后用 `cd` 进去（提示：想想是该 `./` 还是 `source`）。
3. **改造备份脚本：** 加一个判断"备份文件大于 100M 才写日志说很大"。
4. **写一个 `count_log.sh`：** 读取 `/var/log/syslog`（没有就读 `/var/log/kern.log`），用 `grep` + `awk` 统计里面出现次数最多的前 5 个单词。
5. **加 crontab：** 让 `disk_check.sh` 每小时跑一次，日志写到 `~/logs/` 目录（自己建）。

---

## 本章小结

| 你学会的 | 关键命令/写法 |
|---|---|
| 写脚本 | `#!/bin/bash`、`chmod +x`、`./x.sh` / `bash x.sh` / `source x.sh` |
| 变量 | `name=值`、`$name`、`"$name"`、`$( )`、`$(( ))` |
| 参数 | `$0 $1 $# $@ $?`、`read -p` |
| 判断 | `if [[ .. ]]; then .. elif .. else .. fi`、`case .. esac` |
| 循环 | `for x in ..; do .. done`、`while ..; do .. done` |
| 健壮性 | `set -euo pipefail`、`bash -x`、`exit 1` |
| 定时 | `crontab -e / -l`、五段语法、绝对路径、日志重定向 |

---

## 下一章预告

脚本里你经常要装各种软件、配各种环境变量——Python、Node、Git 各自有一套。下一章《环境变量与开发环境》，我们把一台干净的 Ubuntu 真正配成"能写后端项目"的开发机。

---

## 配套资料

- [GNU Bash 官方手册（英文，最权威）](https://www.gnu.org/software/bash/manual/)
- [Ubuntu 中文社区《Bash 参考手册》译文](https://wiki.ubuntu.com.cn/Bash_Reference_Manual/zh)
- [《Linux 命令行大全》免费在线书（William Shotts，Shell 脚本章节经典）](https://www.linuxcommand.org/tlcl.php)
- [MIT 计算机教育缺失的一课（中文，Shell 工具与脚本）](https://missing-semester-cn.github.io/)
- [阮一峰《rsync 用法教程》（远程同步备份，11 章备份脚本的进阶版）](https://www.ruanyifeng.com/blog/2020/08/rsync.html)

**卡住时再看（可选视频）：**

- [B站：老男孩 Shell 脚本 8 小时教程（可选，卡住时看）](https://www.bilibili.com/video/BV1Xh4y1h7kL)
- [B站：crontab 定时任务语法详解（可选，卡住时看）](https://www.bilibili.com/video/BV1V6WizNEEv/)
