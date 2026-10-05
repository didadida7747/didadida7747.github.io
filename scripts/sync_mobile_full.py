# -*- coding: utf-8 -*-
"""
全量迁移：《资料库手机版.html》背后 content.json（20 板块 499 篇）→ VitePress 站点。
- 20 板块 ↔ 站点目录一一映射；README→index；文件名脱敏（校名/学号）
- 每篇正文：脱敏（校名→本校、姓名/学号打码、xidian 摘链）+ 手机版路由 #/doc/dXXX 还原为站内链接
- md 原样上站；html 作静态页；txt/code/docx 转围栏文本页；xlsx/csv 转 md 表格
- 日报等按日归档文件（手机版未收录）从库目录补齐到 04-前沿科技雷达
- 清理板块目录下未被新集合覆盖的陈旧文件；旧 04-视野简报 目录整体退役
- 对站内原生 md（home/HANDOFF/LEARNING*/大观导读）做死链修复（按新文件集合重写/摘链）
"""
import io, json, os, re, shutil, sys
from urllib.parse import unquote

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

LIB = r"E:\ai资料(豆包)"
REPO = os.path.join(LIB, "_知识站构建（VitePress）")
SRC_JSON = os.path.join(LIB, "_手机网站构建", "content.json")

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
OLD_SECTION_DIRS = ["01-电脑与工具链", "02-职业方向规划", "03-竞赛与就业", "04-视野简报",
                    "05-大学生活", "06-闲翻杂读", "07-学业与深造", "08-学生优惠大全",
                    "09-课外技能", "10-脑力赚钱"]
RETIRED_DIRS = ["04-视野简报"]
CODE_EXTS = {"py": "python", "go": "go", "c": "c", "cpp": "cpp", "h": "c", "java": "java"}
DATE_RE = re.compile(r"\d{4}-\d{2}-\d{2}")
FM_RE = re.compile(r"\A---[ \t]*\r?\n(.*?)\r?\n---[ \t]*\r?\n?", re.S)
LINK_RE = re.compile(r"(!?)\[([^\]]*)\]\(([^)\s]*(?:\s[^)\s]+)*)\)")
FENCE_RE = re.compile(r"(```.*?```|`[^`\n]*`)", re.S)

def neutralize_html(t):
    """围栏外的裸 HTML 会让 md 被 Vue 当模板编译而构建失败（HANDOFF 硬规则 2）：
    iframe 嵌入转为视频链接，其余疑似标签转义为字面文本；代码块/行内代码不动。"""
    parts = FENCE_RE.split(t)
    for i in range(0, len(parts), 2):
        p = parts[i]
        p = re.sub(r'<iframe[^>]*?src="([^"]+)"[^>]*>(?:\s*</iframe>)?',
                   lambda m: "[▶️ 视频嵌入](%s)" % m.group(1), p, flags=re.S | re.I)
        p = p.replace("</iframe>", "")
        p = re.sub(r"\\</([a-zA-Z])", r"</\1", p)      # 先归一化已转义的闭合标签
        p = re.sub(r"<(/?[a-zA-Z][^<>]*)>", lambda m: "\\<" + m.group(1) + ">", p, flags=re.S)
        parts[i] = p
    return "".join(parts)

# ---------------- 脱敏 ----------------
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
    t = re.sub(r"xidian", "本校", t, flags=re.I)   # 裸词兜底
    return t

def sanitize_name(name):
    name = desensitize(name)
    name = re.sub(r"\d{9,}", "", name)          # 学号等超长数字
    name = re.sub(r"_+(\.)", r"\1", name).rstrip("_ ")
    return name.strip()

# ---------------- 目标路径 ----------------
def doc_target(src, ext=None):
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
    cur_ext = ext or f.rsplit(".", 1)[-1].lower()
    if cur_ext == "htm":
        f = f[:-4] + ".html"
    elif cur_ext not in ("md", "html"):
        f = f.rsplit(".", 1)[0] + ".md"         # txt/xlsx/csv/docx/code -> md 页
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

# ---------------- 主流程 ----------------
with io.open(SRC_JSON, encoding="utf-8") as f:
    DATA = json.load(f)
docs = DATA["docs"]

# 1) 目标集合
targets = {}        # rel -> doc
url_by_id = {}
for x in docs:
    rel = doc_target(x["src"])
    if not rel:
        print("!! 无法映射:", x["id"], x["src"])
        continue
    targets[rel] = x
    url_by_id[x["id"]] = site_url(rel)

# 2) 补充：已发布的视野日报（手机版按日期规则整体排除，但属于成品内容）
#    只取 每日视野简报/reports/ 下的成品 md；data/raw、output/tech-radar-* 等原始工作文件不迁
supplemental = {}   # rel -> lib abs
for root, dirs, files in os.walk(os.path.join(LIB, "04_前沿科技雷达", "每日视野简报", "reports")):
    for fn in files:
        if not fn.endswith(".md"):
            continue
        abs_p = os.path.join(root, fn)
        rel_lib = os.path.relpath(abs_p, LIB).replace("\\", "/")
        rel = doc_target(rel_lib)
        if rel and rel not in targets:
            targets[rel] = None
            supplemental[rel] = abs_p

print("目标页面总数:", len(targets), "（content.json:", len(docs), "+ 补充:", len(supplemental), "）")

# 3) 清理：全部板块目录里不在新集合中的 .md/.html（含历史误入文件）；退役目录整体删除
deleted = []
for d in SECTION_DIRS:
    base = os.path.join(REPO, d)
    if not os.path.isdir(base):
        continue
    for root, dirs, files in os.walk(base):
        for fn in files:
            rel = os.path.relpath(os.path.join(root, fn), REPO).replace("\\", "/")
            if rel in targets:
                continue
            if fn.endswith((".md", ".html")):
                os.remove(os.path.join(root, fn))
                deleted.append(rel)
for d in SECTION_DIRS:                            # 修剪清空后的空目录
    base = os.path.join(REPO, d)
    for root, dirs, files in os.walk(base, topdown=False):
        if not os.listdir(root):
            os.rmdir(root)
for d in RETIRED_DIRS:
    base = os.path.join(REPO, d)
    if os.path.isdir(base):
        shutil.rmtree(base)
        deleted.append(d + "/（整个目录退役）")
print("清理陈旧文件数:", len(deleted))

# 4) 渲染
def rewrite_routes(t):
    """手机版路由 #/doc/dXXX / #/ -> 站内链接"""
    def repl(m):
        r = m.group(1)
        if r == "#" or r == "#/":
            return m.group(0).replace("(#/)", "(/)")
        did = r[5:].split("#")[0].strip()
        u = url_by_id.get(did)
        return "(%s)" % u if u else m.group(0)
    return re.sub(r"\((#/doc/[^)]+|#/)\)", repl, t)

def cell_escape(v):
    s = "" if v is None else str(v)
    s = desensitize(s).replace("|", "\\|").replace("\r", " ").replace("\n", " ")
    return neutralize_html(s)

def md_table(rows):
    rows = [r for r in rows if r]
    if not rows:
        return ""
    n = max(len(r) for r in rows)
    rows = [list(r) + [""] * (n - len(r)) for r in rows]
    out = ["| " + " | ".join(cell_escape(c) for c in rows[0]) + " |",
           "|" + " --- |" * n]
    for r in rows[1:]:
        out.append("| " + " | ".join(cell_escape(c) for c in r) + " |")
    return "\n".join(out)

def strip_local_links(t):
    """补充文件里的本地相对链接：目标不在站内（如 data/raw），摘链保文"""
    def repl(m):
        tt = m.group(3).strip()
        if tt.startswith(("#", "/", "http://", "https://", "mailto:", "data:")):
            return m.group(0)
        return m.group(1) + m.group(2)
    return LINK_RE.sub(repl, t)

def fm_block(title):
    return "---\ntitle: %s\n---\n\n" % json.dumps(sanitize_name(title), ensure_ascii=False)

def render_md(x):
    t = x["data"]
    m = FM_RE.match(t)
    if m:
        t = t[m.end():]
    t = rewrite_routes(desensitize(t))
    t = neutralize_html(t)
    if not re.match(r"\s*#\s", t):              # 手机版删过与标题重复的 H1，这里补回
        t = "# " + sanitize_name(x["title"]) + "\n\n" + t.lstrip("\n")
    return fm_block(x["title"]) + t.strip() + "\n"

def render_html(x):
    return desensitize(x["data"])

def render_fenced(x, lang="text"):
    body = desensitize(x["data"]).replace("````", "``\u200b``")
    return fm_block(x["title"]) + "````%s\n%s\n````\n" % (lang, body.strip())

def render_tables(x, sheets):
    parts = [fm_block(x["title"])]
    for name, rows in sheets:
        parts.append("## %s\n\n%s\n" % (desensitize(str(name)), md_table(rows)))
    return "\n".join(parts)

def render_docx(x):
    data = desensitize(x["data"])
    i = data.find("<w:")                          # 表格段落是原始 document.xml，转成行文本
    if i >= 0:
        head, xml = data[:i], data[i:]
        lines = [head.strip()] if head.strip() else []
        for row in re.split(r"</w:tr>", xml):
            cells = re.findall(r"<w:t[^>]*>([^<]*)</w:t>", row)
            if cells:
                lines.append(" | ".join(c.strip() for c in cells))
        data = "\n".join(lines)
        data = re.sub(r"\d{20,}", "（长数字已脱敏）", data)   # 二进制/十六进制结果
        data = re.sub(r"\b\d{9,12}\b", "***", data)          # 学号等裸长数字
    body = data.replace("````", "``\u200b``")
    return fm_block(x["title"]) + "````text\n%s\n````\n" % body.strip()

written = 0
for rel, x in targets.items():
    dst = os.path.join(REPO, rel.replace("/", os.sep))
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    if x is None:                                # 补充文件：从库盘读取
        raw = io.open(supplemental[rel], encoding="utf-8").read()
        title = re.sub(r"\.md$", "", os.path.basename(rel))
        body = rewrite_routes(desensitize(raw))
        body = strip_local_links(body)           # 指向未迁内容（如 data/raw）的相对链接摘链保文
        m = FM_RE.match(body)
        if m:
            body = body[m.end():]
        content = fm_block(title) + body.strip() + "\n"
    else:
        typ = x["type"]
        if typ == "md":
            content = render_md(x)
        elif typ == "html":
            content = render_html(x)
        elif typ == "docx":
            content = render_docx(x)
        elif typ in ("text",):
            content = render_fenced(x, "text")
        elif typ == "code":
            ext = x["src"].rsplit(".", 1)[-1].lower()
            content = render_fenced(x, CODE_EXTS.get(ext, "text"))
        elif typ == "csv":
            content = render_tables(x, [("数据表", x["data"].get("rows", []))])
        elif typ == "xlsx":
            content = render_tables(x, [(s.get("name", "Sheet"), s.get("rows", []))
                                        for s in x["data"].get("sheets", [])])
        else:
            print("!! 未知类型:", typ, x["src"])
            continue
    io.open(dst, "w", encoding="utf-8", newline="\n").write(content)
    written += 1
print("写入页面数:", written)

# 5) 站内原生 md 死链修复
site_urls = {site_url(r) for r in targets}
site_urls |= {"/", "/大观/", "/HANDOFF", "/LEARNING", "/LEARNING-3",
              "/大观/01-求职与就业导读", "/大观/02-课程学习导读", "/大观/03-技术成长导读",
              "/大观/04-生活与自我管理导读", "/大观/05-工具与信息流导读"}
basename_map = {}
for u in site_urls:
    seg = u.rstrip("/").rsplit("/", 1)[-1]
    if seg:
        basename_map.setdefault(seg, []).append(u)

NATIVE = ["home.md", "HANDOFF.md", "LEARNING.md", "LEARNING-3.md"] + [
    "大观导读_脱敏版/" + f for f in os.listdir(os.path.join(REPO, "大观导读_脱敏版"))
    if f.endswith(".md")]

fix_log = []
def fix_links(path_rel):
    abs_p = os.path.join(REPO, path_rel.replace("/", os.sep))
    t = io.open(abs_p, encoding="utf-8").read()
    changed = [0]

    def resolve(target):
        tt = target.strip()
        if tt.startswith(("#", "http://", "https://", "mailto:", "data:")):
            return ("keep", None)
        base, _, frag = tt.partition("#")
        frag = ("#" + frag) if frag else ""
        if not base:
            return ("keep", None)
        b = unquote(base.replace("%20", " ")).rstrip("/")
        if b.endswith(".md"):
            b = b[:-3]
        cand = b if b.startswith("/") else None
        if cand is None:
            cur_dir = os.path.dirname(path_rel)
            relp = os.path.normpath(os.path.join(cur_dir, unquote(base))).replace("\\", "/")
            if relp.endswith(".md"):
                relp = relp[:-3]
            if relp == "home":
                cand = "/"
            elif relp.startswith("大观导读_脱敏版/"):
                cand = "/大观/" + relp.split("/", 1)[1]
            elif "/" not in relp:
                cand = "/" + relp
            else:
                cand = None
        if cand and cand in site_urls:
            return ("ok", cand + frag)
        if cand and (cand + "/") in site_urls:      # 目录链接 -> 带尾斜杠的栏目页
            return ("ok", cand + "/" + frag)
        seg = b.rstrip("/").rsplit("/", 1)[-1]
        hits = basename_map.get(seg, [])
        if len(hits) == 1:
            return ("ok", hits[0] + frag)
        return ("strip", None)

    def repl(m):
        bang, text, target = m.group(1), m.group(2), m.group(3)
        act, val = resolve(target)
        if act == "keep":
            return m.group(0)
        if act == "ok":
            if val != target:
                changed[0] += 1
            return "%s[%s](%s)" % (bang, text, val.replace(" ", "%20"))
        fix_log.append((path_rel, target[:70]))
        changed[0] += 1
        return bang + text

    t2 = LINK_RE.sub(repl, t)
    if changed[0]:
        io.open(abs_p, "w", encoding="utf-8", newline="\n").write(t2)
    return changed[0]

fixed = 0
for p in NATIVE:
    fixed += fix_links(p)
print("站内原生文件修复链接数:", fixed)
if fix_log:
    print("摘链（目标不存在）:")
    for f, t in fix_log[:30]:
        print("   ", f, "|", t)

# 6) 隐私残留扫描
bad = []
pat = re.compile(r"西电|西安电子科技|xidian|梁灿灿|2602602008")
for rel in targets:
    dst = os.path.join(REPO, rel.replace("/", os.sep))
    t = io.open(dst, encoding="utf-8").read()
    m = pat.search(t)
    if m:
        i = m.start()
        bad.append((rel, t[max(0, i - 30):i + 40].replace("\n", " ")))
print("隐私残留文件数:", len(bad))
for r, ctx in bad[:15]:
    print("   !!", r, "|", ctx)
print("完成。")
