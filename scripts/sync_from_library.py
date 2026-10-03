# -*- coding: utf-8 -*-
"""
一次性脚本：把资料库内容镜像到 VitePress 站点仓库（用后即删）
- 两遍处理：先建清单（库路径→站点路径），再拷贝
- 每个文件做：校名脱敏 → xidian 链接摘除 → 相对链接按清单重写（无目标则摘链保文）→ xidian 残余域名替换
- README.md → index.md
"""
import os, re, io, sys
from urllib.parse import quote

LIB = r"E:\ai资料(豆包)"
REPO = os.path.join(LIB, "_知识站构建（VitePress）")

# ---------- 1) 生成任务清单 src(lib rel) -> dst(repo rel) ----------
jobs = []  # (src_abs, dst_abs)

def add(src, dst):
    jobs.append((os.path.join(LIB, src), os.path.join(REPO, dst)))

# 01 电脑与工具链
for f in ["拯救者Y7000P高阶使用完全指南.md", "拯救者Y7000P_Windows优化与效率指南.md",
          "拯救者Y7000P使用指南_多媒体网络硬件.md", "电子信息专业工具链完全指南.md",
          "编程与开发环境配置指南.md", "联想拯救者电脑保养手册.md"]:
    add(f"01_电脑使用与工具链/{f}", f"01-电脑与工具链/{f}")
add("01_电脑使用与工具链/AI编程工具/README.md", "01-电脑与工具链/AI编程工具/index.md")
for tool_lib, tool_site in [("codex使用/codex-learning", "codex-learning"),
                            ("grok使用/grok-learning", "grok-learning"),
                            ("omp使用/omp-learning", "omp-learning")]:
    base = os.path.join(LIB, "01_电脑使用与工具链/AI编程工具", tool_lib)
    for root, dirs, files in os.walk(base):
        for f in files:
            if f.endswith(".md"):
                rel = os.path.relpath(os.path.join(root, f), base).replace("\\", "/")
                add(f"01_电脑使用与工具链/AI编程工具/{tool_lib}/{rel}",
                    f"01-电脑与工具链/AI编程工具/{tool_site}/{rel}")
add("01_电脑使用与工具链/AI编程工具/zcode使用/ZCode使用指南-大二学生版.md",
    "01-电脑与工具链/AI编程工具/ZCode使用指南-大二学生版.md")
add("01_电脑使用与工具链/AI编程工具/grok使用/README.md", "01-电脑与工具链/AI编程工具/grok使用/index.md")
add("01_电脑使用与工具链/AI编程工具/omp使用/README.md", "01-电脑与工具链/AI编程工具/omp使用/index.md")

# 02 求职研究（整目录）
base = os.path.join(LIB, "02_职业方向规划/求职研究")
for root, dirs, files in os.walk(base):
    for f in files:
        if f.endswith(".md"):
            rel = os.path.relpath(os.path.join(root, f), base).replace("\\", "/")
            dst = "02-职业方向规划/求职研究/" + ("index.md" if rel == "README.md" else rel)
            add(f"02_职业方向规划/求职研究/{rel}", dst)

# 03 竞赛与就业（两份 md）
add("03_竞赛与就业作战总资料包/泛AI软件就业作战资料包/实习速成方法论_思路篇与实践篇整合笔记.md",
    "03-竞赛与就业/实习速成方法论_思路篇与实践篇整合笔记.md")
add("03_竞赛与就业作战总资料包/泛AI软件就业作战资料包/求职面试高频题手册_大二实习版.md",
    "03-竞赛与就业/求职面试高频题手册_大二实习版.md")

# 04 视野简报
add("04_前沿科技雷达/每日视野简报/README.md", "04-视野简报/index.md")
for sub in ["reports/daily", "reports/weekly"]:
    base = os.path.join(LIB, "04_前沿科技雷达/每日视野简报", sub)
    for f in sorted(os.listdir(base)):
        if f.endswith(".md"):
            add(f"04_前沿科技雷达/每日视野简报/{sub}/{f}", f"04-视野简报/{sub}/{f}")

# 05 大学生活
base = os.path.join(LIB, "05_大学生活/大学生活规划指南")
for f in sorted(os.listdir(base)):
    if f.endswith(".md") and f != "07-西电专篇.md":
        dst = "05-大学生活/规划指南/" + ("index.md" if f == "README.md" else f)
        add(f"05_大学生活/大学生活规划指南/{f}", dst)
add("05_大学生活/大学四年自我提升全景手册.md", "05-大学生活/大学四年自我提升全景手册.md")
add("05_大学生活/大学生向上社交行动手册.md", "05-大学生活/大学生向上社交行动手册.md")

# 06 闲翻杂读（含古诗词资源库子目录）
base = os.path.join(LIB, "06_闲翻杂读")
for root, dirs, files in os.walk(base):
    for f in files:
        if f.endswith(".md"):
            rel = os.path.relpath(os.path.join(root, f), base).replace("\\", "/")
            dst = "06-闲翻杂读/" + ("index.md" if rel == "README.md" else rel)
            add(f"06_闲翻杂读/{rel}", dst)

# 07 学业与深造
add("07_学业与深造/01-电子信息核心课程学习地图.md", "07-学业与深造/01-电子信息核心课程学习地图.md")
add("07_学业与深造/02-保研考研留学深造预案.md", "07-学业与深造/02-保研考研留学深造预案.md")
base = os.path.join(LIB, "07_学业与深造/自学资源")
for f in sorted(os.listdir(base)):
    if f.endswith(".md"):
        dst = "07-学业与深造/自学资源/" + ("index.md" if f == "README.md" else f)
        add(f"07_学业与深造/自学资源/{f}", dst)
CV = "07_学业与深造/课程视频笔记"
CVS = "07-学业与深造/课程视频笔记"
add(f"{CV}/索引_学习文档.md", f"{CVS}/index.md")
add(f"{CV}/积累表_转写勘误.md", f"{CVS}/积累表_转写勘误.md")
add(f"{CV}/_模板/提示词模板_视频合集学习文档.md", f"{CVS}/提示词模板_视频合集学习文档.md")
for course, cdir in [("SI100+计算机导论2026夏", "SI100+计算机导论2026夏"),
                     ("科协暑培2025", "科协暑培2025"),
                     ("科协暑培2026", "科协暑培2026"),
                     ("生成式软件工程2026秋", "生成式软件工程2026秋"),
                     ("408核心课导学", "408核心课导学")]:
    cbase = os.path.join(LIB, CV, course)
    for root, dirs, files in os.walk(cbase):
        relroot = os.path.relpath(root, cbase).replace("\\", "/")
        if relroot == "原始转写":
            dirs[:] = []
            continue
        for f in files:
            if f.endswith(".md"):
                rel = f if relroot == "." else f"{relroot}/{f}"
                add(f"{CV}/{course}/{rel}", f"{CVS}/{cdir}/{rel}")

# 08 学生优惠（排除校名专篇与写作规范）
base = os.path.join(LIB, "08_学生优惠大全")
for f in sorted(os.listdir(base)):
    if f.endswith(".md") and f not in ("_写作规范.md", "08-校园与西电专属.md"):
        dst = "08-学生优惠大全/" + ("index.md" if f == "README.md" else f)
        add(f"08_学生优惠大全/{f}", dst)

# 09 课外技能（整目录，排除 _模板与规范）
base = os.path.join(LIB, "09_课外技能学习资源库")
for root, dirs, files in os.walk(base):
    dirs[:] = [d for d in dirs if d != "_模板与规范"]
    for f in files:
        if f.endswith(".md"):
            rel = os.path.relpath(os.path.join(root, f), base).replace("\\", "/")
            dst = "09-课外技能/" + ("index.md" if rel == "README.md" else rel)
            add(f"09_课外技能学习资源库/{rel}", dst)

# 10 脑力赚钱
base = os.path.join(LIB, "10_脑力赚钱方法调研")
for f in sorted(os.listdir(base)):
    if f.endswith(".md"):
        dst = "10-脑力赚钱/" + ("index.md" if f == "README.md" else f)
        add(f"10_脑力赚钱方法调研/{f}", dst)

print("jobs:", len(jobs))

# ---------- 2) 清单：库路径 -> 站点路径 ----------
manifest = {}
for src, dst in jobs:
    key = os.path.normpath(src)
    name = os.path.basename(dst)
    if name == "README.md":
        name = "index.md"
        dst = os.path.join(os.path.dirname(dst), name)
    dstdir = os.path.relpath(os.path.dirname(dst), REPO).replace("\\", "/")
    if dstdir == ".":
        dstdir = ""
    if name == "index.md":
        site = "/" + dstdir + ("/" if dstdir else "")
    else:
        site = ("/" + dstdir + "/" if dstdir else "/") + name[:-3]
    manifest[key] = site
# 站点根自带页面
for f in ["HANDOFF.md", "LEARNING.md", "LEARNING-3.md"]:
    manifest[os.path.normpath(os.path.join(REPO, f))] = "/" + f[:-3]

# 目录 -> 该目录下第一个站点页（供"链接指向目录"的场景落地）
dir_first = {}
for k, v in manifest.items():
    d = os.path.dirname(k)
    if d not in dir_first or k < dir_first[d]:
        dir_first[d] = k

# ---------- 3) 处理每个文件 ----------
def site_link(src_abs, target):
    """把 md 链接 target 解析为站点路径；失败返回 None"""
    t = target.strip()
    if t.startswith(("#", "http://", "https://", "mailto:", "data:")):
        return ("keep", None)
    anchor = ""
    if "#" in t:
        t, anchor = t.split("#", 1)
        anchor = "#" + anchor
    if not t:
        return ("keep", None)
    t = t.replace("%20", " ")
    if t.startswith("/"):
        resolved = os.path.normpath(os.path.join(LIB, t.lstrip("/")))
    else:
        resolved = os.path.normpath(os.path.join(os.path.dirname(src_abs), t))
    # 精确匹配 / 加 .md / 加 /README.md / 目录落到首文件
    for cand in [resolved, resolved + ".md", os.path.join(resolved, "README.md"),
                 os.path.join(resolved, "index.md")]:
        if cand in manifest:
            return ("ok", manifest[cand] + anchor)
    if os.path.isdir(resolved) and resolved in dir_first:
        return ("ok", manifest[dir_first[resolved]] + anchor)
    return ("strip", None)

link_re = re.compile(r"(!?)\[([^\]]*)\]\(([^)\s]*(?:\s[^)\s]+)*)\)")

def process(src_abs, dst_abs):
    # 任意层级的 README.md 一律落盘为 index.md（与清单映射一致）
    if os.path.basename(dst_abs) == "README.md":
        dst_abs = os.path.join(os.path.dirname(dst_abs), "index.md")
    t = io.open(src_abs, encoding="utf-8").read()
    # 校名脱敏
    t = t.replace("西安电子科技大学", "本校").replace("西安电子科大", "本校")
    t = t.replace("西军电", "本校").replace("西电", "本校")
    # xidian 域名链接摘链保文
    t = re.sub(r"\[([^\]]*)\]\(([^)]*xidian[^)]*)\)", r"\1", t)
    # 链接重写
    stripped, kept = [], 0
    def repl(m):
        nonlocal kept
        bang, text, target = m.group(1), m.group(2), m.group(3)
        action, val = site_link(src_abs, target)
        if action == "keep":
            return m.group(0)
        if action == "ok":
            kept += 1
            return f"{bang}[{text}]({val.replace(' ', '%20')})"
        stripped.append(f"[{text}]({target})")
        return bang + text
    t = link_re.sub(repl, t)
    # xidian 残余域名（纯文本）
    t = re.sub(r"[a-z0-9.-]*xidian\.edu\.cn\S*", "校园网内网系统", t)
    os.makedirs(os.path.dirname(dst_abs), exist_ok=True)
    io.open(dst_abs, "w", encoding="utf-8").write(t)
    return kept, stripped

total_kept, all_stripped = 0, []
for src, dst in jobs:
    if not os.path.exists(src):
        print("!! 缺源:", src)
        continue
    k, s = process(src, dst)
    total_kept += k
    if s:
        all_stripped.append((os.path.relpath(dst, REPO), s))

print("重写链接数:", total_kept)
print("摘链数:", sum(len(s) for _, s in all_stripped))
for f, s in all_stripped:
    for x in s[:6]:
        print("   摘:", f, "|", x[:70])

# 校验：脱敏后无残留
bad = 0
for src, dst in jobs:
    t = io.open(dst, encoding="utf-8").read()
    if re.search(r"西电|西安电子科技|xidian", t):
        print("!! 残留校名:", dst)
        bad += 1
print("脱敏残留文件数:", bad)
