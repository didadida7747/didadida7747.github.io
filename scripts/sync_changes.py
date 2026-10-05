# -*- coding: utf-8 -*-
"""
库 → 站点增量同步（一键更新网站）

用法（在 _知识站构建（VitePress） 目录下）：
  python scripts/sync_changes.py                # 同步有差异的库文件到站点仓库（只写不提交）
  python scripts/sync_changes.py --check        # 只报告差异，不写入
  python scripts/sync_changes.py --push "说明"  # 同步 + 隐私门禁 + 本地构建 + git 提交推送

原理：遍历资料库全部可映射 .md（18 个板块目录 + 根 README），按手机版构建器
（build_mobile.py clean_markdown + sync_mobile_full.py 渲染层）的既定管线重渲染——
剥离 frontmatter → 链接改写/摘链、callout/wikilink 清理、URL 尾反斜杠清理 → 脱敏 →
围栏外裸 HTML 中和 → 首个 H1 提为 frontmatter 标题——与站点副本逐字节比对，只写
有差异的文件。新增文件自动上站（侧边栏 scanDir 自动收录）；库中已删除的文件只报告、
不自动删站。两遍渲染：先按站点现有文件集找差异，再按"本批将写入"重渲染差异文件，
保证新旧页面互链一次成型。
"""
import io
import json
import os
import posixpath
import re
import subprocess
import sys
from urllib.parse import unquote

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

LIB = r"E:\ai资料(豆包)"
REPO = os.path.join(LIB, "_知识站构建（VitePress）")

DIRMAP = {
    "01_电脑使用与工具链": "01-电脑与工具链",
    "02_职业方向规划": "02-职业方向规划",
    "03_竞赛与就业作战总资料包": "03-竞赛与就业",
    "04_前沿科技雷达": "04-前沿科技雷达",
    "05_大学生活": "05-大学生活",
    "06_闲翻杂读": "06-闲翻杂读",
    "07_学业与深造": "07-学业与深造",
    "08_学生优惠大全": "08-学生优惠大全",
    "09_课外技能学习资源库": "09-课外技能",
    "10_脑力赚钱方法调研": "10-脑力赚钱",
    "11_健康与用药知识库": "11-健康与用药知识库",
    "12_安全与反诈知识库": "12-安全与反诈知识库",
    "13_法律与权益常识库": "13-法律与权益常识库",
    "14_学习方法与效率体系": "14-学习方法与效率体系",
    "15_娱乐活动全攻略": "15-娱乐活动全攻略",
    "16_AI源码与AI交互研习库": "16-AI源码与AI交互研习库",
    "17_跨学科学习资源库": "17-跨学科学习资源库",
    "99_课程作业与临时": "99-课程作业与临时",
    "三设备联动指南": "三设备联动指南",
}
SECTION_DIRS = sorted(set(DIRMAP.values()) | {"00-总索引"})
# 不收录的目录（与手机版构建器规则一致：构建原料/第三方源码克隆/工具配置）
EXCLUDE_DIRS = {"_shots", "_shots_自检", "数据源", "自动化脚本", "07_源码仓库", "__pycache__"}

SELF_NAME = "资料库手机版.html"
FM_RE = re.compile(r"\A---[ \t]*\r?\n(.*?)\r?\n---[ \t]*\r?\n?", re.S)
# Obsidian callout 标记（可能被转义为 \[!type\]）-> 普通引用加粗标签
CALLOUT_RE = re.compile(r"^> ?\\?\[!(\w+)\\?\][ \t]?", re.M)
CALLOUT_LABELS = {
    "warning": "⚠️ 注意", "caution": "⚠️ 谨慎", "note": "ℹ️ 说明", "info": "ℹ️ 说明",
    "tip": "💡 提示", "hint": "💡 提示", "success": "✅ 相关信息", "check": "✅ 相关信息",
    "done": "✅ 已完成", "important": "❗ 重要", "danger": "🚨 危险", "error": "🚨 错误",
    "bug": "🐞 问题", "example": "📌 示例", "quote": "❝ 引用", "question": "❓ 疑问",
    "faq": "❓ 疑问",
}
# 裸 URL 后误带的转义反斜杠（markdown 换行残留）
URL_BS_RE = re.compile(r"(https?://[^\s()<>]+)\\(?=[\s）、，。,)]|$)", re.M)
# 链接文字是行内代码的写法：[`path`](target) —— 必须先于代码切分处理
MD_CODELINK_RE = re.compile(r"\[\s*(`[^`\n]*`)\s*\]\(((?:[^()\s]|\([^()]*\))+)\)")
# 尖括号目标（可含空格）：[text](<path with space.md>)
MD_LINK_ANGLE_RE = re.compile(r"(?<!!)(\[[^\]]*\])\(\s*<([^<>\n]*)>\s*\)")
# 常规目标（允许一层平衡圆括号，如 wiki 链接）
MD_LINK_RE = re.compile(r"(?<!!)(\[[^\]]*\])\(((?:[^()\s]|\([^()]*\))+)\)")
MD_IMG_RE = re.compile(r"!\[([^\]]*)\]\(((?:[^()\s]|\([^()]*\))+)\)")
WIKI_HTML_RE = re.compile(r"<a href=\"[^\"]*\" class=\"wikilink\">(.*?)</a>", re.S)
WIKI_RE = re.compile(r"\[\[([^\]|]+)(?:\|([^\]]*))?\]\]")
FENCE_SPLIT_RE = re.compile(r"(```.*?```|~~~.*?~~~|`[^`\n]*`)", re.S)
FENCE_RE = re.compile(r"(```.*?```|`[^`\n]*`)", re.S)

# ---------------- 脱敏（与 sync_mobile_full.py 保持一致） ----------------
def desensitize(t):
    t = (t.replace("西安电子科技大学", "本校").replace("西安电子科大", "本校")
          .replace("西军电", "本校").replace("西电", "本校"))
    t = re.sub(r"姓名[：:]\s*[\u4e00-\u9fa5]{2,4}", "姓名：***（已脱敏）", t)
    t = re.sub(r"学号[：:\s]*\d{6,}", "学号***（已脱敏）", t)
    t = re.sub(r"\[([^\]]*)\]\(([^)]*xidian[^)]*)\)", r"\1", t)
    t = re.sub(r"<a\s[^>]*href=\"[^\"]*xidian[^\"]*\"[^>]*>(.*?)</a>", r"\1", t, flags=re.S | re.I)
    t = re.sub(r"[a-z0-9.-]*xidian\.edu\.cn\S*", "校园网内网系统", t)
    t = re.sub(r"xidian_employment[^\s\"'，。；）)]*", "就业质量报告（已脱敏）", t, flags=re.I)
    t = t.replace("xidianjob", "本校就业情报")
    t = re.sub(r"xidian", "本校", t, flags=re.I)
    return t

def sanitize_name(name):
    name = desensitize(name)
    name = re.sub(r"\d{9,}", "", name)
    name = re.sub(r"_+(\.)", r"\1", name).rstrip("_ ")
    return name.strip()

def neutralize_html(t):
    """围栏外的裸 HTML 会被 Vue 当模板编译导致构建失败（HANDOFF 硬规则 2）"""
    parts = FENCE_RE.split(t)
    for i in range(0, len(parts), 2):
        p = parts[i]
        p = re.sub(r'<iframe[^>]*?src="([^"]+)"[^>]*>(?:\s*</iframe>)?',
                   lambda m: "[▶️ 视频嵌入](%s)" % m.group(1), p, flags=re.S | re.I)
        p = p.replace("</iframe>", "")
        p = re.sub(r"\\</([a-zA-Z])", r"</\1", p)
        p = re.sub(r"<(/?[a-zA-Z][^<>]*)>", lambda m: "\\<" + m.group(1) + ">", p, flags=re.S)
        parts[i] = p
    return "".join(parts)

# ---------------- 库路径 → 站点路径 ----------------
def doc_target(src):
    """库内相对路径 -> 站点相对路径；无法映射返回 None"""
    src = src.replace("\\", "/").strip()
    top = src.split("/")[0]
    if top == "README.md":
        return "00-总索引/index.md"
    if top not in DIRMAP:
        return None
    rest = src[len(top) + 1:]
    if not rest:
        return None
    low = rest.lower()
    if low == "readme.md":
        rest = "index.md"
    elif low.endswith("/readme.md"):
        rest = rest[:-9] + "index.md"
    d, f = os.path.split(rest)
    f = sanitize_name(f)
    cur_ext = f.rsplit(".", 1)[-1].lower()
    if cur_ext == "htm":
        f = f[:-4] + ".html"
    elif cur_ext not in ("md", "html"):
        f = f.rsplit(".", 1)[0] + ".md"
    return DIRMAP[top] + "/" + (d + "/" if d else "") + f

def site_url(rel):
    rel = rel.replace("\\", "/")
    if rel == "index.md":
        return "/"
    if rel.endswith("/index.md"):
        return "/" + rel[:-9] + "/"
    if rel.endswith(".md"):
        return "/" + rel[:-3]
    return "/" + rel

# ---------------- 库文件清单 ----------------
def lib_walk():
    """返回 [(库内相对路径 posix, 绝对路径)]：根 README + 各板块目录下全部 .md"""
    out = []
    root_readme = os.path.join(LIB, "README.md")
    if os.path.isfile(root_readme):
        out.append(("README.md", root_readme))
    for top in sorted(DIRMAP):
        base = os.path.join(LIB, top)
        for root, dirs, files in os.walk(base):
            dirs[:] = [d for d in dirs
                       if d not in EXCLUDE_DIRS and not d.startswith(".")]
            for fn in files:
                if fn.lower().endswith(".md"):
                    abs_p = os.path.join(root, fn)
                    rel = os.path.relpath(abs_p, LIB).replace("\\", "/")
                    out.append((rel, abs_p))
    return out

def should_add(rel):
    """该库文件是否允许作为"新增页"上站（04 板块的原始工作文件不迁，与既定规则一致）"""
    if rel == "README.md":
        return True
    if rel.split("/")[0] == "04_前沿科技雷达":
        # 只补 每日视野简报/reports/ 下的成品日报/周报；data/raw、output/ 等原始工作文件不迁
        return rel.startswith("04_前沿科技雷达/每日视野简报/reports/")
    return True

def is_report(rel):
    return rel.startswith("04_前沿科技雷达/每日视野简报/reports/")

CJ_SET = set()    # content.json 收录过的库文件（posix 小写）——决定渲染路径
def in_content_json(rel):
    return rel.lower() in CJ_SET

# ---------------- 清理管线（移植 build_mobile.py clean_markdown） ----------------
class Cleaner:
    def __init__(self, resolve, title_map):
        self.resolve = resolve        # (target, src_rel) -> 站内 URL 或 None
        self.title_map = title_map    # 文档标题 -> 站内 URL

    def resolve_local(self, target, src_rel):
        t = unquote(target).strip().replace("\\", "/")
        if not t or t.startswith(("http://", "https://", "mailto:", "data:", "#")):
            return None
        frag = ""
        if "#" in t:
            t, frag = t.split("#", 1)
        t = t.strip()
        if not t:
            return None
        if os.path.basename(t) == SELF_NAME and not frag:
            return "/"
        return self.resolve(t, src_rel, frag)

    def rewrite_link(self, text, target, src_rel):
        t = target.strip()
        if t.startswith(("http://", "https://", "mailto:", "data:")) or t.startswith("#"):
            return "%s(%s)" % (text, target)      # 外网链接/同页锚点保持原样
        hit = self.resolve_local(target, src_rel)
        return "%s(%s)" % (text, hit) if hit else text   # 未收录/无效 -> 仅保留文字

    def __call__(self, body, src_rel):
        # 0) [`code`](target) 形式：整段处理，避免被代码切分打散
        def codelink_repl(m):
            code, target = m.group(1), m.group(2)
            hit = None
            if not target.strip().startswith(("http", "mailto:", "data:")):
                hit = self.resolve_local(target, src_rel)
            if hit:
                return "[%s](%s)" % (code, hit)
            if target.strip().startswith(("http", "mailto:", "data:", "#")):
                return m.group(0)
            return code
        body = MD_CODELINK_RE.sub(codelink_repl, body)

        parts = FENCE_SPLIT_RE.split(body)
        for i, part in enumerate(parts):
            if i % 2 == 1:
                continue
            # 0.5) callout 转普通文字；清理裸 URL 尾部转义反斜杠
            def callout_repl(m):
                label = CALLOUT_LABELS.get(m.group(1).lower(), "ℹ️ 提示")
                return "> **%s**%s" % (label, " " if m.group(0).endswith((" ", "\t")) else "")
            part = CALLOUT_RE.sub(callout_repl, part)
            part = URL_BS_RE.sub(r"\1", part)
            # 1) Obsidian wikilink 残留 -> 文字或站内链接
            part = WIKI_HTML_RE.sub(r"\1", part)
            part = WIKI_RE.sub(self._wiki_repl, part)
            # 2) 本地图片引用 -> 图片链接或未收录占位（网络图不动）
            def img_repl(m):
                r = self._rewrite_image(m.group(1), m.group(2), src_rel)
                return m.group(0) if r is None else r
            part = MD_IMG_RE.sub(img_repl, part)
            # 3) 普通链接：站内跳转 / 锚点保留 / 无效改文字
            part = MD_LINK_ANGLE_RE.sub(
                lambda m: self.rewrite_link(m.group(1), m.group(2), src_rel), part)
            part = MD_LINK_RE.sub(
                lambda m: self.rewrite_link(m.group(1), m.group(2), src_rel), part)
            parts[i] = part
        return "".join(parts)

    def _wiki_repl(self, m):
        name = m.group(1).strip()
        label = (m.group(2) or name).strip() or name
        hit = self.title_map.get(name)
        return "[%s](%s)" % (label, hit) if hit else label

    def _rewrite_image(self, alt, target, src_rel):
        if target.strip().startswith(("http://", "https://", "data:")):
            return None                            # 网络图保持原样
        hit = self.resolve_local(target, src_rel)
        if hit:
            return "[%s](%s)" % (("🖼 " + alt) if alt else "🖼 图片", hit)
        return "[%s]（图片未收录：%s）" % (alt, target) if alt else ""

def title_md(raw):
    """取第一个不在代码块里的 # 标题（与构建器 title_md 一致）"""
    for i, part in enumerate(FENCE_SPLIT_RE.split(raw)):
        if i % 2 == 1:
            continue
        m = re.search(r"(?m)^\s*#\s+(.+?)\s*$", part)
        if m:
            return m.group(1).strip()
    return None

# ---------------- 单文件渲染 ----------------
def render(src_rel, raw, resolve, title_map):
    """渲染一篇库 md 为站点页文本（模拟 构建器清理 + sync_mobile_full 渲染层的合成效果）"""
    m = FM_RE.match(raw)
    body = raw[m.end():] if m else raw
    if is_report(src_rel) and not in_content_json(src_rel):
        # 补充收录路径（sync_mobile_full）：标题取文件名、正文保留原 H1、只做链接与脱敏
        title = sanitize_name(os.path.basename(src_rel)[:-3])
        body = Cleaner(resolve, title_map)(body, src_rel)
        body = desensitize(body)
        body = neutralize_html(body)
        return "---\ntitle: %s\n---\n\n" % json.dumps(title, ensure_ascii=False) + body.strip() + "\n"
    # 正式文档路径（构建器 render_md 合成）：标题取首个 # 标题，删除后按 title 重新置顶
    h1 = title_md(body)
    title = sanitize_name(h1) if h1 else sanitize_name(os.path.basename(src_rel)[:-3])
    body = Cleaner(resolve, title_map)(body, src_rel)
    body = desensitize(body)
    body = neutralize_html(body)
    # 移除首个非代码 H1（构建器已删、渲染层按 title 补回，合成效果 = 提为标题）
    for i, part in enumerate(FENCE_SPLIT_RE.split(body)):
        if i % 2 == 1:
            continue
        mm = re.search(r"(?m)^[ \t]*#\s+.+?[ \t]*\r?\n", part)
        if mm and h1 and mm.group(0).strip() == "# " + h1.strip():
            parts = FENCE_SPLIT_RE.split(body)
            parts[i] = part[:mm.start()] + part[mm.end():]
            body = "".join(parts)
            break
    if not re.match(r"\s*#\s", body):
        body = "# " + title + "\n\n" + body.lstrip("\n")
    return "---\ntitle: %s\n---\n\n" % json.dumps(title, ensure_ascii=False) + body.strip() + "\n"

# ---------------- 隐私门禁 ----------------
PRIVACY_PATTERNS = [
    (re.compile(r"西电|西安电子|xidian", re.I), "校名/域名残留"),
    (re.compile(r"姓名[：:]\s*[\u4e00-\u9fa5]{2,4}"), "真实姓名"),
    (re.compile(r"\b1[3-9]\d{9}\b"), "手机号"),
    (re.compile(r"学号[：:\s]*\d{6,}"), "学号"),
    (re.compile(r"均分[：:为]?\s*\d{2,3}(\.\d+)?|GPA[：:]\s*[0-9]"), "成绩信息"),
]

def privacy_check(items):
    """items: [(rel, rendered_text)]；返回违规列表 [(rel, 行号, 类别, 行内容)]"""
    hits = []
    for rel, text in items:
        for ln, line in enumerate(text.splitlines(), 1):
            for pat, label in PRIVACY_PATTERNS:
                if pat.search(line):
                    hits.append((rel, ln, label, line.strip()[:80]))
    return hits

# ---------------- 主流程 ----------------
def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "--sync"
    msg = sys.argv[2] if len(sys.argv) > 2 else None
    walk = lib_walk()
    site_now = site_files_set()

    # content.json 收录清单（手机版构建时收录过哪些库文件）→ 决定渲染路径
    cj_path = os.path.join(LIB, "_手机网站构建", "content.json")
    try:
        with io.open(cj_path, encoding="utf-8") as f:
            CJ_SET.update(d["src"].replace("\\", "/").lower() for d in json.load(f)["docs"])
    except Exception as e:
        print("!! content.json 读取失败（全部按正式路径渲染）:", e)

    # 本批将存在的站点文件集：现有 + 允许新增的映射
    allowed = {doc_target(rel) for rel, _ in walk
               if should_add(rel)} - {None}
    batch_all = site_now | allowed

    def resolver(exists):
        def resolve(t, src_rel, frag=""):
            t_n = t.rstrip("/")
            is_dir = t.endswith("/")
            src_dir = posixpath.dirname(src_rel.replace(os.sep, "/"))
            joined = posixpath.normpath(posixpath.join(src_dir, t_n)) if src_dir else posixpath.normpath(t_n)
            cands = [joined]
            if is_dir or "." not in posixpath.basename(joined):
                cands.insert(0, posixpath.normpath(joined + "/README.md"))
            for c in cands:
                sr = doc_target(c)
                if sr and sr in batch_all and (sr in site_now or should_add(c)):
                    return site_url(sr) + ("#" + frag if frag else "")
            return None
        return resolve

    resolve = resolver(batch_all)
    # wikilink 用标题表：全部允许存在的文档 标题 -> 站内 URL
    title_map = {}
    for rel, abs_p in walk:
        sr = doc_target(rel)
        if not sr or sr not in batch_all:
            continue
        try:
            raw = io.open(abs_p, encoding="utf-8").read()
        except Exception:
            continue
        m = FM_RE.match(raw)
        body = raw[m.end():] if m else raw
        h1 = title_md(body) or os.path.basename(rel)[:-3]
        title_map.setdefault(sanitize_name(h1), site_url(sr))

    # 第一遍：渲染全部库文件，与站点副本比对，找出差异
    diffs = []            # (rel, abs_p, site_rel)
    for rel, abs_p in walk:
        sr = doc_target(rel)
        if not sr:
            print("!! 无法映射（跳过）:", rel)
            continue
        if sr not in site_now and not should_add(rel):
            continue      # 原始工作文件：不迁不上站（data/raw、output 等）
        try:
            raw = io.open(abs_p, encoding="utf-8").read()
        except Exception as e:
            print("!! 读取失败（跳过）:", rel, e)
            continue
        rendered = render(rel, raw, resolve, title_map)
        dst = os.path.join(REPO, sr.replace("/", os.sep))
        try:
            cur = io.open(dst, encoding="utf-8").read()
        except Exception:
            cur = None
        if cur != rendered:
            diffs.append((rel, abs_p, sr))
    batch_write = {sr for _, _, sr in diffs}

    def resolve2(t, src_rel, frag=""):
        # 第二遍：把"本批将写入"的文件视为存在，修正新页互链
        t_n = t.rstrip("/")
        is_dir = t.endswith("/")
        src_dir = posixpath.dirname(src_rel.replace(os.sep, "/"))
        joined = posixpath.normpath(posixpath.join(src_dir, t_n)) if src_dir else posixpath.normpath(t_n)
        cands = [joined]
        if is_dir or "." not in posixpath.basename(joined):
            cands.insert(0, posixpath.normpath(joined + "/README.md"))
        for c in cands:
            sr = doc_target(c)
            if sr and (sr in site_now or sr in batch_write):
                return site_url(sr) + ("#" + frag if frag else "")
        return None

    final = []
    for rel, abs_p, sr in diffs:
        raw = io.open(abs_p, encoding="utf-8").read()
        final.append((rel, sr, render(rel, raw, resolve2, title_map)))

    print("库文件总数: %d ｜ 站点文件集: %d ｜ 有差异: %d（其中新增上站: %d）"
          % (len(walk), len(site_now), len(final), len(batch_write - site_now)))
    for rel, sr, _ in final:
        tag = "新增" if sr not in site_now else "更新"
        print("  [%s] %s -> %s" % (tag, rel, sr))

    # 隐私门禁：先于一切写入
    hits = privacy_check([(sr, t) for _, sr, t in final])
    if hits:
        print("⛔ 隐私门禁拦截，未写入任何文件。以下内容疑似违规：")
        for rel, ln, label, line in hits[:30]:
            print("  [%s] %s:%d  %s" % (label, rel, ln, line))
        sys.exit(2)

    # 库中已删除（站点有、库映射不到）只报告
    mapped_now = {doc_target(rel) for rel, _ in walk} - {None}
    gone = sorted(site_now - mapped_now)
    if gone:
        print("⚠ 站点上有但库里已没有的文件（不自动删站，请人工处理）：%d 个" % len(gone))
        for g in gone[:20]:
            print("  -", g)

    if mode == "--check":
        print("（--check 模式：未写入）")
        return

    for rel, sr, text in final:
        dst = os.path.join(REPO, sr.replace("/", os.sep))
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        io.open(dst, "w", encoding="utf-8", newline="\n").write(text)
    print("已写入 %d 个文件。" % len(final))

    def git(*args):
        return subprocess.run(["git", "-C", REPO] + list(args), capture_output=True, text=True,
                              encoding="utf-8", errors="replace")

    if not final:
        st = git("status", "--porcelain").stdout.strip()
        if not st:
            print("站点与库内容一致，无需提交。")
            return
        print("本次无新差异，但存在未提交改动，继续构建推送流程。")

    if mode != "--push":
        print("（未提交。确认无误后运行：python scripts/sync_changes.py --push \"提交说明\"）")
        return

    # ---- 构建（构建不过不推送；完整日志落盘，不截断告警） ----
    log_path = os.path.join(REPO, ".vitepress", "build-last.log")
    print("正在本地构建（npm run build）……")
    with io.open(log_path, "w", encoding="utf-8") as log:
        r = subprocess.run("npm run build", cwd=REPO, shell=True, stdout=log,
                           stderr=subprocess.STDOUT)
    tail = io.open(log_path, encoding="utf-8", errors="replace").read().splitlines()[-15:]
    print("\n".join(tail))
    if r.returncode != 0:
        print("⛔ 构建失败（完整日志: %s），已取消推送。" % log_path)
        sys.exit(3)
    print("构建通过。")

    # ---- 提交推送 ----
    def git(*args):
        return subprocess.run(["git", "-C", REPO] + list(args), capture_output=True, text=True,
                              encoding="utf-8", errors="replace")

    st = git("status", "--porcelain").stdout.strip()
    if not st:
        print("无内容变更，跳过提交。")
        return
    commit_msg = msg or ("内容同步：%d 篇库文件更新上站（sync_changes.py 自动提交）" % len(final))
    git("add", "-A")
    c = git("commit", "-m", commit_msg)
    if c.returncode != 0:
        print("⛔ git commit 失败：", c.stderr)
        sys.exit(4)
    p = git("push", "origin", "main")
    print(p.stdout.strip() or p.stderr.strip())
    if p.returncode != 0:
        print("⛔ git push 失败。")
        sys.exit(5)
    print("✅ 已推送。GitHub Actions 将自动构建并发布到 https://didadida7747.github.io （约 1-2 分钟）。")

def site_files_set():
    """站点仓库内全部 .md/.html（板块目录 + 00-总索引），posix 相对路径集合"""
    out = set()
    for d in SECTION_DIRS:
        base = os.path.join(REPO, d)
        if not os.path.isdir(base):
            continue
        for root, dirs, files in os.walk(base):
            for fn in files:
                if fn.lower().endswith((".md", ".html")):
                    out.add(os.path.relpath(os.path.join(root, fn), REPO).replace("\\", "/"))
    return out

if __name__ == "__main__":
    main()
