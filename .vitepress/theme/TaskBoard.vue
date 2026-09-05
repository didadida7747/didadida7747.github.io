<script setup>
import { computed, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { dateKey, dateLabel, pickSparks } from './tasks.js'

// 每日任务看板：上午贴任务 → 白天打勾 → 晚上生成复盘草稿。
// 边界：网站是纯静态的，"让 AI 生成明天任务"这一步仍在你的 AI 对话里完成；
// 这里负责结构化（拆成可勾选清单）、持久化（localStorage，仅存本浏览器）和不靠自觉（连续天数、断档可见）。
const STORE_KEY = 'daily-task-v1'
const MAX_DAYS = 60 // 历史保留天数，防止 localStorage 膨胀

const ready = ref(false)
const today = ref('')
const days = ref({}) // { [dateKey]: { items: [{ text, done }], ts } }

onMounted(() => {
  today.value = dateKey(0)
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (raw) days.value = JSON.parse(raw).days || {}
  } catch (e) { /* 首次使用或数据损坏，从空开始 */ }
  prune()
  ready.value = true
})

function persist() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify({ days: days.value })) } catch (e) { /* 隐私模式等场景静默降级 */ }
}

function prune() {
  const keys = Object.keys(days.value)
  if (keys.length <= MAX_DAYS) return
  keys.sort()
  for (const k of keys.slice(0, keys.length - MAX_DAYS)) delete days.value[k]
}

function ensureToday() {
  if (!days.value[today.value]) days.value[today.value] = { items: [], ts: Date.now() }
  return days.value[today.value]
}

const todayData = computed(() => days.value[today.value] || { items: [] })
const doneCount = computed(() => todayData.value.items.filter(i => i.done).length)
const totalCount = computed(() => todayData.value.items.length)
const allDone = computed(() => totalCount.value > 0 && doneCount.value === totalCount.value)

// 连续推进天数：从今天（或昨天，若今天还没动）往回数"至少完成 1 项"的日子
const streak = computed(() => {
  let n = 0
  let offset = allDone.value || doneCount.value > 0 ? 0 : -1
  for (;;) {
    const d = days.value[dateKey(offset)]
    if (d && d.items.some(i => i.done)) { n++; offset-- } else break
  }
  return n
})

// 最近 14 天状态条：full 全清 / partial 有推进 / planned 有任务未动 / empty 无任务
const recent = computed(() => {
  const out = []
  for (let i = 13; i >= 0; i--) {
    const key = dateKey(-i)
    const d = days.value[key]
    const total = d ? d.items.length : 0
    const done = d ? d.items.filter(x => x.done).length : 0
    out.push({
      key, label: dateLabel(key),
      state: !total ? 'empty' : done === total ? 'full' : done > 0 ? 'partial' : 'planned'
    })
  }
  return out
})

// ---------- 贴任务 / 加任务 ----------
const pasteText = ref('')
const customText = ref('')

function cleanLine(line) {
  return line.replace(/^[\s\-\*\d\.、①②③④⑤⑥⑦⑧⑨⑩\[\]【】>✅☑☐]*\s*/, '').trim()
}

function addPasted() {
  const lines = pasteText.value.split('\n').map(cleanLine).filter(l => l.length > 1)
  if (!lines.length) return
  const data = ensureToday()
  const existed = new Set(data.items.map(i => i.text))
  for (const l of lines) {
    if (!existed.has(l) && data.items.length < 12) data.items.push({ text: l.slice(0, 120), done: false })
  }
  data.ts = Date.now()
  pasteText.value = ''
  persist()
}

function addCustom() {
  const t = customText.value.trim()
  if (!t) return
  const data = ensureToday()
  data.items.push({ text: t.slice(0, 120), done: false })
  data.ts = Date.now()
  customText.value = ''
  persist()
}

function toggle(item) {
  item.done = !item.done
  ensureToday().ts = Date.now()
  persist()
}

function removeItem(item) {
  const data = ensureToday()
  const idx = data.items.indexOf(item)
  if (idx >= 0) data.items.splice(idx, 1)
  persist()
}

// ---------- 灵感任务（当天没贴任务时给建议） ----------
const sparks = computed(() => (totalCount.value ? [] : pickSparks(today.value, 3)))

// ---------- 晚间复盘草稿生成 ----------
const review = ref({ done: '', todo: '', output: '', blocker: '', main: '', side: '' })
const draftText = ref('')
const copied = ref(false)

function buildDraft() {
  const r = review.value
  const L = []
  L.push(`# 晚间复盘 · ${dateLabel(today.value)}`)
  L.push('')
  L.push('## 一、今日完成')
  for (const i of todayData.value.items) L.push(`- [${i.done ? 'x' : ' '}] ${i.text}`)
  if (r.done.trim()) L.push(`- 补充：${r.done.trim()}`)
  if (!todayData.value.items.length && !r.done.trim()) L.push('- （未填写）')
  L.push('')
  if (r.todo.trim()) { L.push('## 二、未完成与原因'); L.push(r.todo.trim()); L.push('') }
  if (r.output.trim()) { L.push('## 三、产出物'); L.push(r.output.trim()); L.push('') }
  if (r.blocker.trim()) { L.push('## 四、卡点'); L.push(r.blocker.trim()); L.push('') }
  L.push('## 五、明日任务（一个主交付物 + 至多一个次要能力块）')
  L.push(`- 主线：${r.main.trim() || '（待定）'}`)
  if (r.side.trim()) L.push(`- 次要：${r.side.trim()}`)
  L.push('')
  L.push('（生成依据：当天勾选情况 + 手填字段。请 AI 依据本文件与总规划生成明日任务文档。）')
  draftText.value = L.join('\n')
  copied.value = false
}

async function copyDraft() {
  try {
    await navigator.clipboard.writeText(draftText.value)
    copied.value = true
  } catch (e) {
    // 剪贴板 API 不可用时退回选中方式
    const ta = document.getElementById('draft-ta')
    if (ta) { ta.select(); document.execCommand('copy'); copied.value = true }
  }
}

const gapDays = computed(() => {
  for (let i = 0; i < 30; i++) {
    const d = days.value[dateKey(-i)]
    if (d && d.items.some(x => x.done)) return i
  }
  return -1
})
</script>

<template>
  <div v-if="ready" class="tb">
    <!-- 顶部：日期 + 打卡概览 -->
    <div class="panel head">
      <div class="date-block">
        <div class="date">{{ dateLabel(today) }}</div>
        <div class="sub">任务数据只保存在本浏览器（localStorage），不上传</div>
      </div>
      <div class="stats">
        <div class="stat"><b>{{ doneCount }}</b>/<span>{{ totalCount }}</span><i>今日完成</i></div>
        <div class="stat streak"><b>{{ streak }}</b><i>连续推进天数</i></div>
        <div class="stat" :class="{ warn: gapDays > 3 }"><b>{{ gapDays < 0 ? '—' : gapDays }}</b><i>距上次推进（天）</i></div>
      </div>
    </div>

    <!-- 14 天状态条 -->
    <div class="panel strip-panel">
      <div class="strip-title">最近 14 天：<span class="lg full">■ 全清</span><span class="lg partial">■ 有推进</span><span class="lg planned">■ 未动</span><span class="lg empty">■ 无任务</span></div>
      <div class="strip">
        <div v-for="d in recent" :key="d.key" class="cell" :class="d.state" :title="d.label + ' ' + d.state" />
      </div>
    </div>

    <!-- 今日任务 -->
    <div class="panel">
      <h3>✅ 今日任务</h3>
      <p v-if="!totalCount" class="empty-line">今天还没有任务。把 AI 生成的当日任务文档贴到下面，或手动添加。</p>
      <div v-else class="items">
        <div v-for="(item, i) in todayData.items" :key="i" class="item" :class="{ done: item.done }">
          <label class="check">
            <input type="checkbox" :checked="item.done" @change="toggle(item)">
            <span class="box" />
            <span class="txt">{{ item.text }}</span>
          </label>
          <button class="del" title="移除" @click="removeItem(item)">✕</button>
        </div>
      </div>
      <p v-if="totalCount && allDone" class="cheer">🎉 今日全清！晚上记得复盘并生成明天的任务。</p>

      <!-- 灵感任务 -->
      <div v-if="!totalCount" class="sparks">
        <p class="sparks-title">💡 今天没头绪？从站内方法论里挑一件（按日期轮换）：</p>
        <a v-for="s in sparks" :key="s.text" class="spark" :href="withBase(s.link)">{{ s.text }} ↗</a>
      </div>

      <div class="add-area">
        <details :open="!totalCount">
          <summary>📋 粘贴 AI 生成的任务文档（每行一条，自动去掉序号和符号）</summary>
          <textarea v-model="pasteText" rows="4" placeholder="例如：&#10;1. 完成 Agent 工具调用模块的参数校验&#10;2. 阅读 STM32 学习路径第 3 主题&#10;3. 简历项目一改成强表达" />
          <button class="btn" @click="addPasted">拆成今日任务</button>
        </details>
        <div class="custom-row">
          <input v-model="customText" placeholder="或手动加一条任务…" maxlength="120" @keyup.enter="addCustom">
          <button class="btn ghost" @click="addCustom">＋ 添加</button>
        </div>
      </div>
    </div>

    <!-- 晚间复盘 -->
    <div class="panel">
      <h3>🌙 晚间复盘 → 明日任务草稿</h3>
      <p class="hint">填完点"生成草稿"，复制后发给你的 AI（连同总规划），让它产出明天的任务文档；明早再把新文档贴回这里。</p>
      <div class="form">
        <label>未完成与原因（可选）<textarea v-model="review.todo" rows="2" placeholder="哪项没动、为什么" /></label>
        <label>今日产出物（可选）<textarea v-model="review.output" rows="2" placeholder="提交了什么代码 / 写了什么笔记" /></label>
        <label>卡点（可选）<input v-model="review.blocker" placeholder="被什么挡住了" /></label>
        <label>明日主线（必填：一个主交付物）<input v-model="review.main" placeholder="例如：跑通工具调用的最小闭环" /></label>
        <label>明日次要（可选：至多一个能力块）<input v-model="review.side" placeholder="例如：读一篇方法论并复述" /></label>
      </div>
      <button class="btn" @click="buildDraft">生成复盘草稿</button>
      <div v-if="draftText" class="draft">
        <textarea id="draft-ta" readonly rows="12" :value="draftText" />
        <button class="btn ghost" @click="copyDraft">{{ copied ? '✓ 已复制' : '复制草稿' }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tb { max-width: 720px; margin: 0 auto; display: grid; gap: 1rem; }
.panel {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 1.4rem 1.6rem;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.05);
}
h3 { margin: 0 0 0.6rem; }

.head { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
.date { font-size: 1.35rem; font-weight: 700; }
.sub { font-size: 0.78rem; color: var(--vp-c-text-3, #8b93b8); margin-top: 0.25rem; }
.stats { display: flex; gap: 1.6rem; }
.stat { text-align: center; }
.stat b { font-size: 1.5rem; color: var(--vp-c-brand-1, var(--vh-accent, #2f4fe0)); font-variant-numeric: tabular-nums; }
.stat span { color: var(--vp-c-text-3, #8b93b8); }
.stat i { display: block; font-style: normal; font-size: 0.72rem; color: var(--vp-c-text-3, #8b93b8); margin-top: 0.15rem; }
.stat.streak b { color: #f59e0b; }
.stat.warn b { color: #ef4444; }

.strip-panel { padding: 1rem 1.6rem; }
.strip-title { font-size: 0.8rem; color: var(--vp-c-text-2, #b8c0d9); margin-bottom: 0.5rem; }
.lg { margin-right: 0.8rem; }
.strip { display: flex; gap: 4px; }
.cell { flex: 1; height: 14px; border-radius: 4px; background: rgba(148, 163, 184, 0.18); }
.cell.full { background: linear-gradient(90deg, #22c55e, #4ade80); }
.cell.partial { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
.cell.planned { background: rgba(239, 68, 68, 0.55); }
.cell.empty { opacity: 0.5; }

.items { display: grid; gap: 0.5rem; margin: 0.6rem 0 0.4rem; }
.item {
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.55rem 0.8rem; border-radius: 10px;
  border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg);
}
.item.done { opacity: 0.62; }
.item.done .txt { text-decoration: line-through; }
.check { display: flex; align-items: center; gap: 0.6rem; cursor: pointer; flex: 1; }
.check input { position: absolute; opacity: 0; pointer-events: none; }
.box {
  width: 18px; height: 18px; flex: none; border-radius: 6px;
  border: 2px solid var(--vp-c-brand-1, var(--vh-accent, #2f4fe0)); position: relative; transition: background 0.15s ease;
}
.check input:checked + .box { background: var(--vh-accent, #2f4fe0); }
.check input:checked + .box::after {
  content: '✓'; position: absolute; inset: 0; display: grid; place-items: center;
  color: #fff; font-size: 12px; font-weight: 700;
}
.txt { font-size: 0.92rem; }
.del {
  border: none; background: none; color: var(--vp-c-text-3, #8b93b8);
  cursor: pointer; font-size: 0.85rem; padding: 0.2rem 0.4rem; border-radius: 6px;
}
.del:hover { color: #ef4444; background: rgba(239, 68, 68, 0.1); }
.empty-line { color: var(--vp-c-text-2, #b8c0d9); font-size: 0.9rem; }
.cheer { color: #22c55e; font-weight: 600; font-size: 0.9rem; }

.sparks { margin: 0.8rem 0; display: grid; gap: 0.4rem; }
.sparks-title { font-size: 0.82rem; color: var(--vp-c-text-2, #b8c0d9); margin: 0 0 0.2rem; }
.spark {
  font-size: 0.86rem; color: var(--vp-c-brand-1, var(--vh-accent, #2f4fe0)); text-decoration: none;
  padding: 0.5rem 0.8rem; border: 1px dashed var(--vh-accent-weak, rgba(47, 79, 224, 0.09)); border-radius: 10px;
}
.spark:hover { border-style: solid; }

.add-area { margin-top: 1rem; display: grid; gap: 0.7rem; }
details summary { cursor: pointer; font-size: 0.88rem; color: var(--vp-c-text-2, #b8c0d9); }
textarea, input[type="text"], .custom-row input, .form input, .form textarea {
  width: 100%; box-sizing: border-box; margin-top: 0.4rem;
  padding: 0.6rem 0.8rem; border-radius: 10px; font-size: 0.9rem;
  border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); color: var(--vp-c-text-1, #e6e9f5);
  font-family: inherit; resize: vertical;
}
.custom-row { display: flex; gap: 0.6rem; }
.custom-row input { flex: 1; margin-top: 0; }
.custom-row .btn { margin-top: 0; }

.btn {
  margin-top: 0.8rem; padding: 0.55rem 1.4rem; font-size: 0.9rem; font-weight: 600;
  color: #fff; background: var(--vh-accent, #2f4fe0);
  border: none; border-radius: 10px; cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12); }
.btn.ghost { background: transparent; border: 1px solid var(--vp-c-brand-1, var(--vh-accent, #2f4fe0)); color: var(--vp-c-brand-1, var(--vh-accent, #2f4fe0)); }

.hint { font-size: 0.82rem; color: var(--vp-c-text-3, #8b93b8); margin: 0 0 0.8rem; }
.form { display: grid; gap: 0.7rem; margin-bottom: 0.4rem; }
.form label { font-size: 0.85rem; color: var(--vp-c-text-2, #b8c0d9); display: block; }
.form input, .form textarea { margin-top: 0.25rem; }
.draft { margin-top: 0.8rem; }
</style>
