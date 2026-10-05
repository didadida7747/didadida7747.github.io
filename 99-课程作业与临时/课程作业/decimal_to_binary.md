---
title: "decimal_to_binary"
---

````python
# 十进制转二进制程序
# 功能：输入一个十进制整数，输出对应的二进制数

def decimal_to_binary(n):
    """将十进制整数转换为二进制字符串（除2取余法）"""
    if n == 0:
        return "0"
    binary = ""
    while n > 0:
        remainder = n % 2
        binary = str(remainder) + binary
        n = n // 2
    return binary


def main():
    # 输入十进制数
    decimal_str = input("请输入一个十进制数：")
    try:
        decimal_num = int(decimal_str)
    except ValueError:
        print("输入错误，请输入有效的整数！")
        return

    # 处理负数
    if decimal_num < 0:
        result = "-" + decimal_to_binary(-decimal_num)
    else:
        result = decimal_to_binary(decimal_num)

    # 输出结果
    print(f"十进制数 {decimal_str} 转换为二进制是：{result}")


if __name__ == "__main__":
    main()
````
