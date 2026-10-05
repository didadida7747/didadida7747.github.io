---
title: "dec2bin"
---

````python
# 第3次作业 第4题：输入一个十进制数，输出二进制
# 方法：除2取余，逆序排列（同时用内置 bin() 校验结果）


def dec_to_bin(n):
    """用“除2取余法”把非负十进制整数转换为二进制字符串"""
    if n == 0:
        return "0"
    bits = []
    while n > 0:
        bits.append(str(n % 2))  # 记录余数
        n //= 2                  # 商继续除以2
    return "".join(reversed(bits))  # 余数逆序排列


def main():
    text = input("请输入一个十进制整数：").strip()
    try:
        num = int(text)
    except ValueError:
        print("输入有误，请输入整数！")
        return
    sign = "-" if num < 0 else ""
    result = sign + dec_to_bin(abs(num))
    print(f"十进制 {num} 转换为二进制是：{result}")
    print(f"内置函数 bin() 校验结果：{bin(num)}")


if __name__ == "__main__":
    main()
````
