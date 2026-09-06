<script setup>
import { computed, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { buildDailyDeck, todaySeed, KNOWLEDGE } from './knowledge.js'

// 双模式：
// 🌱 每日挑战：今天抽中的知识点自动生成 8 题（答完可回看知识点原文）
// 🗺️ 全景闯关：知识点题 + 面试模拟题 混合 15 题，3 条命 + 连击
// 面试模拟题来源：站内《求职面试高频题手册_大二实习版》
const INTERVIEW_TOPICS = ['面试题 · 网络', '面试题 · 操作系统', '面试题 · 数据结构', '面试题 · HR']

function isInterview(q) { return INTERVIEW_TOPICS.some(t => q.topic === t) }

// ---------- 学情记录（localStorage，仅本人使用） ----------
const STATS_KEY = 'quiz-stats-v1'
const EMPTY_STATS = () => ({ total: {}, right: {}, wrong: {} })
const stats = ref(EMPTY_STATS())

onMounted(() => {
  best.value = Number(localStorage.getItem('quiz-best') || 0)
  dailyDone.value = localStorage.getItem('quiz-daily-' + todaySeed()) === '1'
  try {
    const raw = localStorage.getItem(STATS_KEY)
    if (raw) stats.value = { ...EMPTY_STATS(), ...JSON.parse(raw) }
  } catch (e) { /* 首次使用 */ }
})

function persist() {
  try { localStorage.setItem(STATS_KEY, JSON.stringify(stats.value)) } catch (e) { /* 忽略 */ }
}

function record(topic, correct) {
  const s = stats.value
  s.total[topic] = (s.total[topic] || 0) + 1
  if (correct) s.right[topic] = (s.right[topic] || 0) + 1
  else s.wrong[topic] = (s.wrong[topic] || 0) + 1
  persist()
}

// ---------- 错题本（localStorage，与错题本页面 /wrongbook 共享同一份数据） ----------
const WRONG_KEY = 'quiz-wrong-book'
function loadWrongBook() {
  try { return JSON.parse(localStorage.getItem(WRONG_KEY))?.items || {} } catch (e) { return {} }
}
function saveWrong(q) {
  try {
    const book = loadWrongBook()
    const prev = book[q.q]
    book[q.q] = { q: q.q, options: q.options, answer: q.answer, topic: q.topic, source: q.source, wrongCount: (prev?.wrongCount || 0) + 1, lastTs: Date.now() }
    localStorage.setItem(WRONG_KEY, JSON.stringify({ items: book }))
  } catch (e) { /* 存储不可用时静默降级 */ }
}
function clearWrong(q) {
  try {
    const book = loadWrongBook()
    if (book[q.q]) {
      delete book[q.q]
      localStorage.setItem(WRONG_KEY, JSON.stringify({ items: book }))
    }
  } catch (e) { /* 忽略 */ }
}

// 学情分析：按主题正确率给建议
const analysis = computed(() => {
  const rows = []
  for (const topic of Object.keys(stats.value.total)) {
    const t = stats.value.total[topic]
    const r = stats.value.right[topic] || 0
    rows.push({ topic, total: t, right: r, rate: Math.round((r / t) * 100) })
  }
  rows.sort((a, b) => a.rate - b.rate)
  const tips = []
  const weak = rows.filter(x => x.rate < 60)
  const mid = rows.filter(x => x.rate >= 60 && x.rate < 85)
  const strong = rows.filter(x => x.rate >= 85)
  if (weak.length) tips.push(`「${weak.map(x => x.topic).join('、')}」正确率低于 60%：先点开每日知识点里对应条目的原文链接，读完再来一轮。`)
  if (mid.length) tips.push(`「${mid.map(x => x.topic).join('、')}」处于 60–85% 爬坡区：错的多是记忆偏差，把解析里的出处句划重点即可。`)
  if (strong.length) tips.push(`「${strong.map(x => x.topic).join('、')}」已扎实（≥85%）：少刷这类，把时间让给弱项。`)
  if (!rows.length) tips.push('还没有作答记录，先来一局，我会告诉你哪里薄弱。')
  return { rows, tips }
})

// ---------- 题库 ----------
function fullDeck() {
  const knowledge = KNOWLEDGE.filter(k => k.quiz).map(k => ({ ...k.quiz, topic: k.from.split(' · ')[0], source: { text: k.text, link: k.link + (k.anchor || ''), from: k.from } }))
  const interview = knowledge.filter(q => isInterview(q))
  const pure = knowledge.filter(q => !isInterview(q))
  // 全景 = 全部知识点题 + 全部面试模拟题
  return [...pure, ...interview]
}

// ---------- 游戏状态 ----------
const HP_MAX = 3
const mode = ref(null) // null | 'daily' | 'full'
const stage = ref('intro') // intro | playing | levelClear | win | gameover
const deck = ref([])
const idx = ref(0)
const levelIdx = ref(0)
const hp = ref(HP_MAX)
const score = ref(0)
const combo = ref(0)
const picked = ref(-1)
const showing = ref(false)
const best = ref(0)
const dailyDone = ref(false)
const answeredLog = ref([]) // 本局答题记录，结算页展示错题知识点

// 全景闯关分三关：知识点基础 / 面试模拟 / 混合挑战
const LEVEL_NAMES = [
  { badge: '📘', name: '第一关 · 知识点基础' },
  { badge: '💼', name: '第二关 · 面试模拟' },
  { badge: '🔥', name: '第三关 · 混合挑战' }
]

const question = computed(() => deck.value[idx.value])
const progress = computed(() => (deck.value.length ? Math.round((idx.value / deck.value.length) * 100) : 0))
const wrongList = computed(() => answeredLog.value.filter(x => !x.ok))

function start(m) {
  mode.value = m
  stage.value = 'playing'
  idx.value = 0
  levelIdx.value = 0
  hp.value = HP_MAX
  score.value = 0
  combo.value = 0
  picked.value = -1
  showing.value = false
  answeredLog.value = []
  deck.value = m === 'daily' ? buildDailyDeck(todaySeed(), 8) : fullDeck()
}

function pick(i) {
  if (showing.value) return
  picked.value = i
  showing.value = true
  const ok = i === question.value.answer
  record(question.value.topic, ok)
  // 错题本联动：答错入本（累计错次），答对自动移出
  if (ok) clearWrong(question.value)
  else saveWrong(question.value)
  answeredLog.value.push({ ok, q: question.value })
  if (ok) {
    combo.value += 1
    score.value += 100 + (combo.value - 1) * 20
  } else {
    combo.value = 0
    hp.value -= 1
  }
}

function next() {
  showing.value = false
  picked.value = -1
  if (hp.value <= 0) {
    stage.value = 'gameover'
    finish()
    return
  }
  if (idx.value < deck.value.length - 1) {
    idx.value += 1
    if (mode.value === 'full') {
      // 按题类切关：知识点 → 面试 → 混合
      const q = deck.value[idx.value]
      const li = isInterview(q) ? 1 : 0
      const prev = deck.value[idx.value - 1]
      const prevLi = isInterview(prev) ? 1 : 0
      if (li !== prevLi) {
        levelIdx.value = li
        stage.value = 'levelClear'
      }
    }
    return
  }
  stage.value = 'win'
  finish()
}

function finish() {
  if (score.value > best.value) {
    best.value = score.value
    localStorage.setItem('quiz-best', String(best.value))
  }
  if (mode.value === 'daily') localStorage.setItem('quiz-daily-' + todaySeed(), '1')
}

function backHome() {
  stage.value = 'intro'
  mode.value = null
}
</script>

<template>
  <div class="quiz">
    <!-- 开场：模式选择 + 学情 -->
    <div v-if="stage === 'intro'" class="panel intro">
      <div class="big">🎓</div>
      <h2>知识闯关 · 双模式</h2>
      <p class="lead">知识点题出自站内笔记，面试模拟题出自《求职面试高频题手册》。作答会被记录并生成掌握分析。</p>

      <div class="modes">
        <button class="mode" :disabled="dailyDone" @click="start('daily')">
          <span class="m-icon">🌱</span>
          <b>每日挑战</b>
          <span class="m-desc">从今天的知识点自动出 8 题，当天固定</span>
          <span v-if="dailyDone" class="done-tag">今日已完成 ✓</span>
        </button>
        <button class="mode" @click="start('full')">
          <span class="m-icon">🗺️</span>
          <b>全景闯关</b>
          <span class="m-desc">知识点 + 面试模拟全题库，3 条命 + 连击</span>
        </button>
      </div>

      <div class="analysis">
        <h3>📊 我的学情分析</h3>
        <div v-if="analysis.rows.length" class="bars">
          <div v-for="r in analysis.rows" :key="r.topic" class="bar-row">
            <span class="t">{{ r.topic }}</span>
            <div class="bar">
              <div class="fill" :class="{ weak: r.rate < 60, mid: r.rate >= 60 && r.rate < 85 }" :style="{ width: r.rate + '%' }" />
            </div>
            <span class="v">{{ r.right }}/{{ r.total }}（{{ r.rate }}%）</span>
          </div>
        </div>
        <ul class="tips">
          <li v-for="(tip, i) in analysis.tips" :key="i">{{ tip }}</li>
        </ul>
        <p class="best-line">🏆 历史最高分：<b>{{ best }}</b></p>
      </div>
    </div>

    <!-- 答题中 -->
    <div v-else-if="stage === 'playing'" class="panel">
      <div class="hud">
        <span class="lv">{{ mode === 'daily' ? '🌱 每日挑战' : LEVEL_NAMES[levelIdx].badge + ' ' + LEVEL_NAMES[levelIdx].name }}</span>
        <span class="hearts">
          <span v-for="n in HP_MAX" :key="n" :class="['heart', { lost: n > hp }]">❤️</span>
        </span>
        <span class="score">得分 {{ score }}</span>
      </div>
      <div class="bar"><div class="bar-fill" :style="{ width: progress + '%' }" /></div>

      <div class="qtext">
        第 {{ idx + 1 }} / {{ deck.length }} 题 · 连击 ×{{ combo }}
        <span class="topic-chip" :class="{ interview: isInterview(question) }">{{ question.topic }}</span>
        <h3>{{ question.q }}</h3>
      </div>

      <div class="options">
        <button
          v-for="(opt, i) in question.options"
          :key="i"
          class="opt"
          :class="{ right: showing && i === question.answer, wrong: showing && i === picked && i !== question.answer, dim: showing && i !== question.answer && i !== picked }"
          :disabled="showing"
          @click="pick(i)"
        >
          {{ ['A', 'B', 'C', 'D'][i] }}. {{ opt }}
        </button>
      </div>

      <div v-if="showing" class="explain">
        <p class="verdict">{{ picked === question.answer ? '✅ 答对了！' : `❌ 正确答案：${['A','B','C','D'][question.answer]}` }}</p>
        <p class="note">📖 考的知识点：{{ question.source.text }}</p>
        <a class="src-link" :href="withBase(question.source.link)" target="_blank">查看原文（{{ question.source.from }}）↗</a>
        <button class="btn" @click="next">{{ idx === deck.length - 1 ? '查看结算 →' : '下一题 →' }}</button>
      </div>
    </div>

    <!-- 过关（仅全景） -->
    <div v-else-if="stage === 'levelClear'" class="panel intro">
      <div class="big">🎉</div>
      <h2>{{ LEVEL_NAMES[levelIdx - 1].name }} 通过！</h2>
      <p>当前得分 <b>{{ score }}</b>，剩余生命 <b>{{ hp }}</b>，下一关换题风。</p>
      <button class="btn" @click="stage = 'playing'">继续 →</button>
    </div>

    <!-- 通关 -->
    <div v-else-if="stage === 'win'" class="panel intro">
      <div class="big">👑</div>
      <h2>{{ mode === 'daily' ? '今日挑战完成！' : '全景闯关完成！' }}</h2>
      <p>最终得分 <b>{{ score }}</b>（历史最高 {{ best }}）。</p>
      <div v-if="wrongList.length" class="review">
        <h3>🖍️ 本局错题回顾（{{ wrongList.length }} 题）</h3>
        <div v-for="(w, i) in wrongList" :key="i" class="review-item">
          <p class="review-q">{{ w.q.q }}</p>
          <p class="review-k">→ {{ w.q.source.text }}</p>
          <a class="src-link" :href="withBase(w.q.source.link)" target="_blank">原文 {{ w.q.source.from }} ↗</a>
        </div>
      </div>
      <div v-else class="review">
        <p>🌟 全对，无错题——直接看学情分析。</p>
      </div>
      <button class="btn" @click="backHome">看学情分析</button>
    </div>

    <!-- 失败 -->
    <div v-else class="panel intro">
      <div class="big">💫</div>
      <h2>生命耗尽，差一点</h2>
      <div v-if="wrongList.length" class="review">
        <h3>🖍️ 本局错题回顾（{{ wrongList.length }} 题）</h3>
        <div v-for="(w, i) in wrongList" :key="i" class="review-item">
          <p class="review-q">{{ w.q.q }}</p>
          <p class="review-k">→ {{ w.q.source.text }}</p>
          <a class="src-link" :href="withBase(w.q.source.link)" target="_blank">原文 {{ w.q.source.from }} ↗</a>
        </div>
      </div>
      <button class="btn" @click="backHome">看学情分析</button>
    </div>
  </div>
</template>

<style scoped>
.quiz { max-width: 720px; margin: 0 auto; }
.panel {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 1.6rem 1.8rem;
  box-shadow: 0 8px 28px rgba(124, 58, 237, 0.08);
}
.intro { text-align: center; }
.big { font-size: 3rem; margin-bottom: 0.4rem; }
.lead { color: var(--vp-c-text-2, #b8c0d9); }

.modes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 1.4rem 0;
}
@media (max-width: 640px) { .modes { grid-template-columns: 1fr; } }
.mode {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 1.2rem 1rem;
  border-radius: 14px;
  border: 1px solid rgba(167, 139, 250, 0.3);
  background: rgba(10, 13, 34, 0.6);
  color: var(--vp-c-text-1, #e6e9f5);
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}
.mode:hover:not(:disabled) {
  transform: translateY(-3px);
  border-color: var(--vp-c-brand-2);
  box-shadow: 0 10px 26px rgba(124, 58, 237, 0.25);
}
.mode:disabled { opacity: 0.55; cursor: not-allowed; }
.m-icon { font-size: 1.6rem; }
.m-desc { font-size: 0.8rem; color: var(--vp-c-text-3, #8b93b8); }
.done-tag {
  position: absolute;
  top: 8px;
  right: 10px;
  font-size: 0.7rem;
  color: #22c55e;
}

.analysis {
  margin-top: 1.2rem;
  padding: 1.1rem 1.2rem;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.15);
  background: rgba(8, 10, 28, 0.5);
  text-align: left;
}
.analysis h3 { margin: 0 0 0.7rem; font-size: 0.95rem; }
.bars { display: grid; gap: 0.45rem; margin-bottom: 0.8rem; }
.bar-row { display: flex; align-items: center; gap: 0.7rem; font-size: 0.85rem; }
.bar-row .t { width: 6.5em; color: var(--vp-c-text-2, #b8c0d9); }
.bar { flex: 1; height: 8px; border-radius: 4px; background: rgba(148, 163, 184, 0.15); overflow: hidden; }
.fill { height: 100%; background: linear-gradient(90deg, #22c55e, #4ade80); transition: width 0.4s ease; }
.fill.mid { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
.fill.weak { background: linear-gradient(90deg, #ef4444, #f87171); }
.bar-row .v { font-variant-numeric: tabular-nums; color: var(--vp-c-text-3, #8b93b8); font-size: 0.78rem; }
.tips { margin: 0 0 0.5rem; padding-left: 1.2em; }
.tips li { font-size: 0.85rem; color: var(--vp-c-text-2, #b8c0d9); margin: 0.25rem 0; }
.best-line { margin: 0; font-size: 0.85rem; color: var(--vp-c-text-3, #8b93b8); }

.btn {
  margin-top: 1rem;
  padding: 0.6rem 1.6rem;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(120deg, #6366f1, #a855f7);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(124, 58, 237, 0.35); }

.hud { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; }
.lv { font-weight: 600; }
.hearts { letter-spacing: 0.15em; }
.heart.lost { filter: grayscale(1); opacity: 0.35; }
.score { font-variant-numeric: tabular-nums; color: var(--vp-c-brand-1, #a78bfa); font-weight: 700; }

.bar { height: 6px; border-radius: 3px; background: var(--vp-c-divider); margin: 0.8rem 0 1.2rem; overflow: hidden; }
.bar-fill { height: 100%; background: linear-gradient(90deg, #6366f1, #a855f7, #06b6d4); transition: width 0.4s ease; }

.qtext h3 { margin: 0.4rem 0 1rem; font-size: 1.15rem; }
.topic-chip {
  font-size: 0.72rem;
  color: #a78bfa;
  border: 1px solid rgba(167, 139, 250, 0.4);
  border-radius: 999px;
  padding: 0.05rem 0.55rem;
  margin-left: 0.4rem;
  vertical-align: 0.1em;
}
.topic-chip.interview {
  color: #fbbf24;
  border-color: rgba(251, 191, 36, 0.45);
}

.options { display: grid; gap: 0.6rem; }
.opt {
  text-align: left;
  padding: 0.7rem 1rem;
  font-size: 0.95rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1, #e6e9f5);
  cursor: pointer;
  transition: border-color 0.15s ease, transform 0.15s ease, background 0.15s ease;
}
.opt:hover:not(:disabled) { border-color: var(--vp-c-brand-2); transform: translateX(4px); }
.opt.right { border-color: #22c55e; background: rgba(34, 197, 94, 0.12); }
.opt.wrong { border-color: #ef4444; background: rgba(239, 68, 68, 0.12); }
.opt.dim { opacity: 0.5; }

.explain { margin-top: 1rem; }
.verdict { font-weight: 700; margin-bottom: 0.2rem; }
.note { color: var(--vp-c-text-2, #b8c0d9); margin: 0.2rem 0; }
.src-link {
  display: inline-block;
  font-size: 0.8rem;
  color: #a78bfa;
  text-decoration: none;
  border-bottom: 1px dashed rgba(167, 139, 250, 0.4);
  margin-bottom: 0.6rem;
}
.src-link:hover { color: #c4b5fd; }

.review { margin-top: 1rem; text-align: left; }
.review h3 { font-size: 0.95rem; margin: 0 0 0.6rem; }
.review-item {
  padding: 0.7rem 0.9rem;
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 10px;
  margin-bottom: 0.6rem;
  background: rgba(239, 68, 68, 0.06);
}
.review-q { margin: 0 0 0.25rem; font-size: 0.88rem; color: var(--vp-c-text-1, #e6e9f5); font-weight: 600; }
.review-k { margin: 0 0 0.3rem; font-size: 0.82rem; color: var(--vp-c-text-2, #b8c0d9); }
</style>
