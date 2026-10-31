---
title: "第10章 网络命令与 SSH"
---

# 第10章 网络命令与 SSH

> 学完这章，你能自己排查"为什么连不上服务器"，能用 SSH 免密登录任何 Linux 机器，还能给 GitHub 配好 SSH key——以后 `git push` 再也不用输密码。

## 本章你将学会

- 补上网底知识：IP、端口、TCP/UDP、公网/私网、127.0.0.1
- 用 `ip addr` / `ip route` 看自己的网络配置（知道 `ifconfig` 已过时）
- 用 `ping` 测连通性，用 `ss -tlnp` 看端口占用
- 熟练用 `curl` 发各种 HTTP 请求（GET/POST/带 Header/下载/调试）
- 用 `dig` / `nslookup` 查 DNS，看懂 `/etc/resolv.conf`
- 完整走一遍 SSH 登录流程，知道 `known_hosts` 是啥
- 用 `ssh-keygen` 生成 ed25519 密钥对，配 `ssh-copy-id` 免密登录
- 写 `~/.ssh/config` 配主机别名，给 GitHub 配免密
- 用 `scp` / `rsync` 传文件
- 知道 `ufw` 防火墙和云安全组是什么关系
- 搞懂 WSL2 的网络特性（localhost 转发、mirrored 模式）

## 为什么需要它

后端开发的日常就是"我的程序跑在某台 Linux 机器上，我要从自己电脑连上去看它"。这个"连上去"靠的就是 SSH。而排查问题时 90% 的思路是：能 ping 通吗？DNS 解析对吗？端口开着吗？服务在监听吗？这一章把这些工具一次给你。

---

## 10.1 先补十分钟网络基础

不然后面命令你看不懂。

**IP 地址**：设备在网络上的门牌号。比如 `192.168.1.100`。有两类：
- **公网 IP**：在整个互联网上唯一，云服务器都有一个公网 IP。
- **私网 IP**：局域网内部用的，比如你宿舍路由器分出来的 `192.168.x.x`、`10.x.x.x`、`172.16-31.x.x`。私网 IP 在公网上不路由，得通过 NAT（路由器）共享一个公网 IP 上网。

**127.0.0.1 / localhost**：本机自己访问自己的地址。你在 WSL 里 `curl http://127.0.0.1:8000`，就是访问同一个系统上刚启动的那个服务。

**端口**：一台机器上可能跑着几十个服务（Web、SSH、数据库……），光靠 IP 不够，还得靠端口区分。端口是 0-65535 的数字，常见约定：22 = SSH，80 = HTTP，443 = HTTPS，3306 = MySQL，8000 = 开发常用。

**TCP / UDP**：两种传输协议。你以后写后端基本只碰 TCP（HTTP、SSH、数据库全在 TCP 上）。UDP 是那种"丢包无所谓"的场景（视频流、DNS 查询）。现在知道这俩名字就行。

---

## 10.2 `ip addr`：看自己的网络配置

老教程里你会看到 `ifconfig`——那是**已经过时**的命令（在 net-tools 包里），现代 Linux 用 `ip` 命令替代它：

```bash
$ ip addr
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
    link/ether 00:15:5d:aa:bb:cc brd ff:ff:ff:ff:ff:ff
    inet 172.25.123.45/28 brd 172.25.123.47 scope global eth0
       valid_lft forever preferred_lft forever
```

解读：
- `lo` 是回环接口，绑着 `127.0.0.1`，别管它。
- `eth0`（WSL 里可能叫 `eth0` 也可能叫别的）是真正的网卡，`inet 172.25.123.45/28` 就是它的 IP。

```bash
$ ip route
default via 172.25.112.1 dev eth0
172.25.112.0/20 dev eth0 proto kernel scope link src 172.25.123.45
```

`ip route` 看路由表——重点看第一行 `default via 172.25.112.1`，那个就是你的网关（相当于"要上网就把包先扔给这个地址"）。

> 📌 **注意：`ifconfig` 和 `netstat` 属于老的 `net-tools` 包，现在 Ubuntu 默认不装。** 新代码别再用它们，用 `ip` 和 `ss`。真要在老教程里看到 `ifconfig`，脑子里替换成 `ip addr`；看到 `netstat`，替换成 `ss`。

---

## 10.3 `ping`：最基础的连通性测试

```bash
$ ping -c 4 baidu.com
PING baidu.com (220.181.38.148) 56(84) bytes of data.
64 bytes from 220.181.38.148: icmp_seq=1 ttl=52 time=25.3 ms
64 bytes from 220.181.38.148: icmp_seq=2 ttl=52 time=25.1 ms
64 bytes from 220.181.38.148: icmp_seq=3 ttl=52 time=25.2 ms
64 bytes from 220.181.38.148: icmp_seq=4 ttl=52 time=25.0 ms

--- baidu.com ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3005ms
rtt min/avg/max/mdev = 25.084/25.190/25.312/0.090 ms
```

`-c 4` 表示发 4 个包就停（不加的话它会一直 ping 下去，`Ctrl+C` 停）。`time=25.3 ms` 是你到对方的往返延迟。

排障时 ping 的位置：
- `ping 127.0.0.1` 不通 → 你本机网络栈都坏了，见鬼了
- `ping 网关IP` 不通 → 你连路由器都连不上
- `ping 公网IP（比如 223.5.5.5，阿里 DNS）` 不通 → 你没网
- `ping baidu.com` 不通但 `ping 223.5.5.5` 通 → **DNS 问题**，下面讲

> 📌 **注意：有些服务器/云厂商默认禁 ICMP，ping 不通不代表服务没起。** ping 只是第一步，不是结论。

---

## 10.4 `ss`：看端口监听情况

你想知道"我机器上哪些端口正在被监听"——老命令是 `netstat`，新命令是 `ss`：

```bash
$ sudo ss -tlnp
State    Recv-Q  Send-Q   Local Address:Port   Peer Address:Port  Process
LISTEN   0       4096           127.0.0.1:8000        0.0.0.0:*      users:(("python",pid=5678,fd=3))
LISTEN   0       4096             0.0.0.0:22          0.0.0.0:*      users:(("sshd",pid=999,fd=3))
```

参数拆开：
- `-t` 只看 TCP
- `-l` 只看 LISTEN 状态（正在监听的端口）
- `-n` 不解析服务名，直接显示数字端口
- `-p` 显示是哪个进程在监听（要 sudo 才能看到别人的进程名）

你以后写后端服务启动后，第一件事就是 `ss -tlnp | grep 8000` 确认它真的在监听了。

> 💡 **小技巧：对应老教程里的 `netstat -tunlp`，现在写 `ss -tlnp` 就行，输出几乎一样。**

---

## 10.5 `curl`：HTTP 请求瑞士军刀

`curl` 是命令行里发 HTTP 请求的工具，后端开发每天用。先装：

```bash
$ sudo apt install curl
```

### 最常用：GET 一个页面

```bash
$ curl https://example.com
```

直接把响应 body 打印出来。

### `-I`：只看响应头

```bash
$ curl -I https://example.com
HTTP/2 200
content-type: text/html
...
```

排查"这个 URL 返回了什么状态码、内容类型是什么"用这个。

### `-X`：指定方法，`-d`：发数据，`-H`：加请求头

模拟一个 POST 请求登录：

```bash
$ curl -X POST https://api.example.com/login \
    -H "Content-Type: application/json" \
    -d '{"user":"alice","pass":"123456"}'
```

拆开：
- `-X POST`：方法是 POST（不写 `-X` 默认 GET）
- `-H "Content-Type: application/json"`：加一个请求头
- `-d '...'`：请求体，发 JSON 字符串

### `-O`：下载文件

```bash
# -O 用远程文件名保存
$ curl -O https://example.com/files/data.zip

# -o 指定保存成什么名
$ curl -o mydata.zip https://example.com/files/data.zip
```

### `-L`：自动跟随重定向

有些 URL 会 301/302 跳转，不加 `-L` curl 就停在那不动了：

```bash
$ curl -L https://github.com/some/repo/archive/refs/heads/main.zip
```

### `-v`：调试模式

网络不通、请求报错时，加 `-v` 看完整握手过程：DNS 解析到哪个 IP、TCP 连的哪个地址、发了什么请求、收了什么响应。这是排查"为什么我的请求失败"的最强武器。

```bash
$ curl -v https://example.com
```

`wget` 是另一个下载工具，和 curl 功能有重叠，主打"后台静默下载大文件、支持断点续传"：

```bash
$ wget https://example.com/bigfile.zip
```

你日常 curl 用得多，wget 知道有这东西就行。

---

## 10.6 DNS：`dig` / `nslookup` / `host`

DNS 是把域名翻译成 IP 的系统。你 `ping baidu.com` 时系统背后先做了一次 DNS 查询。

```bash
$ dig baidu.com

; <<>> DiG 9.18.x <<>> baidu.com
;; ANSWER SECTION:
baidu.com.              5       IN      A       220.181.38.148
```

看 `ANSWER SECTION` 那行——`baidu.com` 解析到 `220.181.38.148`。

更简单的：

```bash
$ host baidu.com
baidu.com has address 220.181.38.148

$ nslookup baidu.com
```

系统用哪个 DNS 服务器呢？看 `/etc/resolv.conf`：

```bash
$ cat /etc/resolv.conf
nameserver 172.25.112.1
nameserver 223.5.5.5
```

> 📌 **注意：WSL2 里 DNS 经常抽风（解析不到域名）。** 排查思路就是 `ping 公网IP` 通不通、`ping 域名` 通不通、看 `/etc/resolv.conf` 里 nameserver 是谁。第 15 章排错手册会细讲。

---

## 10.7 SSH：远程登录

SSH（Secure Shell）是你远程连到 Linux 服务器的主要方式。命令长这样：

```bash
$ ssh 用户名@服务器IP
```

比如：

```bash
$ ssh ubuntu@123.45.67.89
```

如果对方 SSH 端口不是默认的 22（很多云服务器为了安全改成别的），用 `-p`：

```bash
$ ssh -p 2222 ubuntu@123.45.67.89
```

### 首次连接：指纹确认

第一次连一台新服务器，会看到：

```text
The authenticity of host '123.45.67.89 (123.45.67.89)' can't be established.
ED25519 key fingerprint is SHA256:xxxxxxx...
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

这是 SSH 在问你："这台服务器我第一次见，它的指纹是这个，你确认是你要连的那台吗？"输入 `yes` 回车。

之后这台服务器的指纹会被存到你本地的 `~/.ssh/known_hosts` 文件里。以后再连，SSH 会比对指纹——如果对不上（比如服务器重装系统了、或者有人中间劫持），它会红色警告你"指纹变了"，这时候要小心，别盲目继续。

### 免密登录：ssh-keygen

每次 ssh 都要输密码很烦。而且后面要写脚本自动部署，根本没法交互输密码。解决办法是**密钥对**：

- 你在**本地**生成一对密钥：公钥（public key）和私钥（private key）。
- 把公钥放到**服务器**上。
- 以后连的时候，SSH 用私钥证明"我是我"，不用密码。

```bash
$ ssh-keygen -t ed25519
Generating public/private ed25519 key pair.
Enter file in which to save the key (/home/yourname/.ssh/id_ed25519):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/yourname/.ssh/id_ed25519
Your public key has been saved in /home/yourname/.ssh/id_ed25519.pub
```

三个问题：
1. 保存在哪？默认 `~/.ssh/id_ed25519`，直接回车。
2. passphrase（私钥密码）？**直接回车空着**（不然每次用还要输一次，失去免密意义）。要更安全可以设，但新手先空着。

> 📌 **注意：`ed25519` 是现在推荐的算法，比传统 RSA 更短更安全。** 新教程一律用它。

生成完你家目录多个文件：
- `~/.ssh/id_ed25519` —— **私钥，绝对不能给任何人**，权限必须 600
- `~/.ssh/id_ed25519.pub` —— 公钥，可以随便分享

### ssh-copy-id：把公钥推到服务器

```bash
$ ssh-copy-id ubuntu@123.45.67.89
```

它会把你本地的 `~/.ssh/id_ed25519.pub` 内容追加到服务器的 `~/.ssh/authorized_keys` 文件末尾。第一次还要输一次服务器密码，之后再 `ssh ubuntu@123.45.67.89` 就直接进去了，不用密码。

> 💡 **小技巧：`ssh-copy-id` 本质就干了一件事：把公钥那一行文字写到服务器的 `~/.ssh/authorized_keys` 里。** 没有 ssh-copy-id 的环境（比如 Windows），你可以手动 `cat ~/.ssh/id_ed25519.pub`，然后在服务器上 `echo 那串内容 >> ~/.ssh/authorized_keys`，效果一样。

### `~/.ssh/config`：给主机起别名

你记不住 IP，也不想每次敲 `ssh -p 2222 ubuntu@123.45.67.89`？在 `~/.ssh/config` 里配：

```text
Host myserver
    HostName 123.45.67.89
    User ubuntu
    Port 2222
```

然后以后只要：

```bash
$ ssh myserver
```

就够了。

### 给 GitHub 配免密

这是你马上就要用的。流程：

1. 先确认你已经 `ssh-keygen -t ed25519` 生成了密钥对（没有就先生成）。
2. 查看公钥内容：
   ```bash
   $ cat ~/.ssh/id_ed25519.pub
   ssh-ed25519 AAAA... yourname@wsl
   ```
3. 复制这一整行。
4. 打开 GitHub 网页 → 右上角头像 → Settings → SSH and GPG keys → New SSH key。
5. Title 随便填（比如"我的WSL"），Key 粘贴刚才那一行，点 Add SSH key。
6. 测试：
   ```bash
   $ ssh -T git@github.com
   Hi yourname! You've successfully authenticated...
   ```
7. 以后 clone 仓库用 SSH 地址（`git@github.com:xxx/xxx.git`）而不是 HTTPS 地址，push/pull 都不用输密码。

---

## 10.8 传文件：scp 与 rsync

### scp：简单粗暴复制

```bash
# 从本地复制到服务器
$ scp ./localfile.txt ubuntu@123.45.67.89:/home/ubuntu/

# 从服务器拉回来
$ scp ubuntu@123.45.67.89:/home/ubuntu/remote.txt ./

# -r 递归复制整个目录
$ scp -r ./mydir ubuntu@123.45.67.89:/home/ubuntu/
```

### rsync：增量同步，专业选手用这个

`rsync` 比 scp 聪明：只传有变化的部分，支持断点续传。后端部署基本用它。

```bash
# 把本地 mydir 同步到服务器（-a 归档模式，-v 显示过程，-z 压缩传输）
$ rsync -avz ./mydir/ ubuntu@123.45.67.89:/home/ubuntu/mydir/
```

> 📌 **注意：源路径末尾的 `/` 很关键。** `./mydir/` 是"目录里的内容"，`./mydir` 是"目录本身"。差一个斜杠，结果差很多。

`--delete` 是个危险但有用的选项：让目标目录和源**严格一致**——目标里多出来的文件会被删掉。慎用。

---

## 10.9 防火墙：ufw 与云安全组

你服务跑起来了，端口也监听了，但外面就是连不上？两个地方可能挡着：

1. **服务器本机的防火墙**：Ubuntu 默认带 `ufw`（Uncomplicated Firewall）。
   ```bash
   $ sudo ufw status
   $ sudo ufw allow 8000/tcp    # 开放 8000 端口
   $ sudo ufw allow OpenSSH     # 允许 SSH（这个一定要先开，不然你把自己锁外面）
   $ sudo ufw enable
   ```
   > ⚠️ **警告：开 ufw 之前一定先 `sudo ufw allow OpenSSH`，再 `sudo ufw enable`。** 顺序反了，你远程连进来会被自己的防火墙踢出去。

2. **云厂商的安全组**：即使你服务器上防火墙放行了，云平台控制台还有一层"安全组"，默认只开 22 端口。要从外面访问 8000，得去阿里云/腾讯云控制台手动加规则。

> 📌 **注意：WSL2 里你基本不用碰 ufw。** 本机练手时端口开着就是开着，Windows 那边直接 `localhost:8000` 就能访问。

---

## 10.10 WSL2 的网络特性

WSL2 是跑在一个轻量虚拟机里的，所以它有自己的虚拟网卡，IP 和 Windows 不一样。几个你必须知道的点：

1. **Windows 可以直接用 localhost 访问 WSL 里的服务。** 你在 WSL 里跑 `python -m http.server 8000`，然后在 Windows 浏览器开 `http://localhost:8000`，就能访问。这是 WSL2 自动做的端口转发，不用配置。

2. **反过来不行（默认情况下）**：WSL 里访问 Windows 上的服务，要用 Windows 主机的 IP（`ip route` 里那个网关地址）。

3. **mirrored 镜像模式**：Windows 11 较新版本支持在 `.wslconfig` 里开网络 mirrored 模式，让 WSL 和 Windows 共享同一个网络接口，这样从局域网其他机器直接 SSH 进 WSL 就方便了。配置大概是：
   ```ini
   # C:\Users\fjbsllc\.wslconfig
   [wsl2]
   networkingMode=mirrored
   ```
   改完 `wsl --shutdown` 重启 WSL 生效。

4. **从局域网别的机器 SSH 进 WSL**：默认做不到，因为 WSL2 的网卡是 NAT 出来的。要么开上面说的 mirrored 模式，要么在 Windows 上做端口转发（`netsh interface portproxy`）。这个进阶配置知道思路就行，不是本章重点。

---

## ⚠️ 危险操作与安全红线

- **`ufw enable` 之前先放行 SSH。** 不然把自己锁外面。
- **SSH 私钥 `~/.ssh/id_ed25519` 权限必须 600。** 权限松了 ssh 会拒绝用它，还会一脸懵为什么配好了还叫密码。
- **GitHub 上贴私钥 = 立刻删密钥。** 永远只贴 `.pub` 公钥。
- **`known_hosts` 里的指纹警告别盲目输 yes。** 如果你连的是公司服务器，指纹变了要先找运维确认是不是被中间人了。
- **`rsync --delete` 之前先 `rsync -avn`（dry-run）看一遍会删什么。** `-n` 是"假装跑一遍不真删"。
- **不要在 WSL 里折腾 `iptables`**，那是云服务器上才玩的东西。

## 常见报错与排查

| 现象 | 原因 | 解决 |
|---|---|---|
| `ssh: connect to host xxx port 22: Connection refused` | 对方没开 SSH 服务，或端口不是 22 | 先确认服务器 sshd 起了没；用 `-p` 指定正确端口 |
| `Connection timed out` | 网络不通/防火墙挡了 | 先 ping，再查云安全组和 ufw |
| `WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!` | 服务器重装过，指纹变了 | `ssh-keygen -R 域名/IP` 清掉旧指纹，重连 |
| `Permission denied (publickey)` | 公钥没配对 | 检查服务器 `~/.ssh/authorized_keys`、私钥权限是不是 600 |
| `curl: (7) Failed to connect` | 服务没起 / 端口不对 / 防火墙 | `ss -tlnp` 看服务在不在 |
| `curl: (6) Could not resolve host` | DNS 挂了 | `ping 223.5.5.5` 通不通；看 `/etc/resolv.conf` |
| Windows 浏览器访问不了 WSL 里的服务 | 服务绑在了 127.0.0.1 而不是 0.0.0.0 | 启动服务时绑 `0.0.0.0:8000` |
| GitHub push 要密码 | 你用的是 HTTPS 地址 | 改成 SSH 地址 `git@github.com:...` |

## 动手练习

1. 在 WSL 里跑 `ip addr`、`ip route`，报告你 WSL 的 IP 和网关。
2. `ping -c 4 baidu.com`，看延迟多少毫秒。
3. `python3 -m http.server 8000 &`，然后另开终端 `ss -tlnp | grep 8000` 确认它在监听。Windows 浏览器开 `http://localhost:8000` 验证能访问。
4. `curl -I https://www.baidu.com` 看响应头；再 `curl -v https://www.baidu.com` 看调试输出。
5. `dig github.com` 看 GitHub 的 IP。
6. 生成 ed25519 密钥对，把公钥加到 GitHub，`ssh -T git@github.com` 测试成功。
7. （选做，有学生机再做）`ssh 用户名@学生机IP` 连上去，`ssh-copy-id` 配免密，`scp` 传个文件上去，再 `rsync -avz` 同步一个目录。

## 本章小结

| 命令 | 作用 |
|---|---|
| `ip addr` / `ip route` | 看 IP / 看路由（替代 ifconfig） |
| `ping -c 4 地址` | 测连通性 |
| `ss -tlnp` | 看端口监听（替代 netstat） |
| `curl -I/-X/-d/-H/-O/-L/-v` | 发 HTTP 请求，调试 |
| `dig 域名` | 查 DNS |
| `ssh user@host` / `-p 端口` | 远程登录 |
| `ssh-keygen -t ed25519` | 生成密钥对 |
| `ssh-copy-id user@host` | 推公钥，配免密 |
| `scp` / `rsync -avz` | 传文件 |
| `sudo ufw allow 端口` | 本机防火墙 |

## 下一章预告

到这里你已经把"日常用 Linux"需要的命令都过了一遍。下一章开始进阶——**Shell 脚本编程**，教你把这些命令拼成自动化脚本，让电脑自己干活。

## 配套资料

- [MIT 计算机教育中缺失的一课（中文版）](https://missing-semester-cn.github.io/) —— 第 5 讲"命令行环境"专门讲 SSH 密钥和服务器协作
- [Ubuntu 在线 Manpages](https://manpages.ubuntu.com/) —— `man ssh`、`man curl`、`man ss` 的浏览器版，随时查
- [WSL 官方文档：网络](https://learn.microsoft.com/zh-cn/windows/wsl/) —— localhost 转发、mirrored 模式的权威说明
- [OverTheWire: Bandit](https://overthewire.org/wargames/bandit/) —— 从第 1 关开始就是用 SSH 连过去的，边玩边练

**卡住时再看（可选视频）：**

- [Missing Semester 第五讲：命令行环境与SSH（B站中译）](https://www.bilibili.com/video/BV1x7411H7wa) —— 一小时把 SSH 工程化思维讲透（可选，卡住时看）
