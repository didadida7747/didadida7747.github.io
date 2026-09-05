<script setup>
import { computed, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { TRACKS, QUESTIONS } from './practice.js'
import { TERMS } from './terms.js'

// 情境练习：一题一个真实处境，四选一；答对解锁讲评与深链（vibe-hub 式"答对后看完整详情"）。
// 记录存 localStorage：答对过的题保持解锁；方向筛选 + 进度统计。
const REC_KEY = 'practice-rec-v1'
const ready = ref(false)
const track = ref('all')
const idx = ref(0)
const picked = ref(-1)
const solvedIds = ref(new Set())

onMounted(() => {
  try {
    const raw = JSON.parse(localStorage.getItem(REC_KEY)) || {}
    solvedIds.value = new Set(raw.solved || [])
  } catch (e) { /* 首次使用 */ }
  ready.value = true
})

function persist() {
  try { localStorage.setItem(REC_KEY, JSON.stringify({ solved: [...solvedIds.value] })) } catch (e) { /* 忽略 */ }
}

const pool = computed(() => QUESTIONS.filter(q => track.value === 'all' || q.track === track.value))
const q = computed(() => pool.value[idx.value])
const solved = computed(() => q.value && solvedIds.value.has(q.value.id))
const isCorrect = computed(() => picked.value === q.value?.answer)

const stats = computed(() => {
  const total = QUESTIONS.length
  const done = solvedIds.value.size
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 }
})

const trackDone = id => solvedIds.value.has(id)

function pick(i) {
  if (solved.value) return
  picked.value = i
  if (i === q.value.answer) {
    solvedIds.value = new Set([...solvedIds.value, q.value.id])
    persist()
  }
}

function next() {
  picked.value = -1
  if (idx.value < pool.value.length - 1) idx.value++
  else idx.value = 0
}

function prev() {
  picked.value = -1
  if (idx.value > 0) idx.value--
  else idx.value = pool.value.length - 1
}

function termRef(id) { return TERMS.find(t => t.id === id) }
function href(item) { return withBase((item.link || '') + (item.anchor || '')) }

// 点击讲评里的术语引用 → 跳术语页并带上 hash（TermsPage 支持初始展开）
function goTerm(id) {
  window.location.href = withBase('/terms#t-' + id)
}
</script>

<template>
  <div v-if="ready" class="pq">
    <!-- 顶栏：方向筛选 + 进度 -->
    <div class="pq-toolbar">
      <div class="pq-tracks">
        <button v-for="t in TRACKS" :key="t.id" class="pq-track" :class="{ on: track === t.id }"
          @click="track = t.id; idx = 0; picked = -1">
          {{ t.name }}
        </button>
      </div>
      <span class="pq-progress">已解锁 {{ stats.done }} / {{ stats.total }}</span>
    </div>
    <div class="pq-bar"><div class="pq-fill" :style="{ width: stats.pct + '%' }" /></div>

    <!-- 题卡 -->
    <div v-if="q" class="pq-card">
      <div class="pq-meta">
        <span class="pq-no">第 {{ idx + 1 }} / {{ pool.length }} 题</span>
        <span class="pq-track-chip">{{ TRACKS.find(t => t.id === q.track)?.name }}</span>
        <span v-if="solved" class="pq-done-chip">✓ 已解锁</span>
      </div>
      <p class="pq-scene">{{ q.scene }}</p>

      <div class="pq-options">
        <button v-for="(opt, i) in q.options" :key="i" class="pq-opt"
          :class="{
            right: (picked === i || solved) && i === q.answer,
            wrong: picked === i && i !== q.answer,
            dim: picked !== -1 && i !== q.answer && i !== picked,
            plain: solved && picked === -1
          }"
          :disabled="solved"
          @click="pick(i)">
          <b>{{ ['A', 'B', 'C', 'D'][i] }}</b>{{ opt }}
        </button>
      </div>

      <!-- 讲评：答对解锁 / 答错提示 -->
      <div v-if="picked !== -1 && !solved" class="pq-wrongtip">
        ❌ 再想想——这题考的是真实处境下的取舍，换一个选择试试。
      </div>

      <div v-if="solved" class="pq-explain">
        <h4>✅ 讲评</h4>
        <p>{{ q.explain }}</p>
        <div class="pq-refs">
          <i>继续深入</i>
          <template v-for="(r, i) in q.refs" :key="i">
            <a v-if="!r.term" class="pq-ref" :href="href(r)">{{ r.text }}<em>{{ r.from }}</em></a>
            <button v-else class="pq-ref" @click="goTerm(r.term)">{{ r.text }}<em>术语卡 →</em></button>
          </template>
        </div>
      </div>

      <div class="pq-nav">
        <button class="pq-btn ghost" @click="prev">← 上一题</button>
        <button class="pq-btn" @click="next">下一题 →</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pq { max-width: 720px; margin: 0 auto; }

.pq-toolbar { display: flex; align-items: center; gap: 0.7rem; flex-wrap: wrap; }
.pq-tracks { display: flex; flex-wrap: wrap; gap: 0.4rem; flex: 1; }
.pq-track {
  padding: 0.35rem 0.85rem; border-radius: 999px; cursor: pointer; font-size: 0.85rem;
  border: 1px solid var(--vh-border, #e4e4e7); background: var(--vp-c-bg); color: var(--vh-text-2, #52525b);
  transition: all 0.15s ease;
}
.pq-track.on { background: var(--vh-accent, #2f4fe0); color: #fff; border-color: transparent; }
.pq-track:hover:not(.on) { border-color: var(--vh-accent, #2f4fe0); color: var(--vh-accent, #2f4fe0); }
.pq-progress { font-size: 0.8rem; color: var(--vh-text-3, #a1a1aa); font-variant-numeric: tabular-nums; }
.pq-bar { height: 5px; border-radius: 3px; background: var(--vh-border, #e4e4e7); margin: 0.7rem 0 1.2rem; overflow: hidden; }
.pq-fill { height: 100%; background: var(--vh-accent, #2f4fe0); transition: width 0.4s ease; }

.pq-card {
  background: var(--vp-c-bg);
  border: 1px solid var(--vh-border, #e4e4e7);
  border-radius: 14px;
  padding: 1.4rem 1.6rem;
}
.pq-meta { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
.pq-no { font-size: 0.8rem; color: var(--vh-text-3, #a1a1aa); }
.pq-track-chip {
  font-size: 0.72rem; color: var(--vh-accent, #2f4fe0);
  background: var(--vh-accent-weak, rgba(47, 79, 224, 0.09));
  border-radius: 999px; padding: 0.1rem 0.6rem;
}
.pq-done-chip { font-size: 0.72rem; color: #16a34a; }
.pq-scene { font-size: 1.02rem; font-weight: 600; line-height: 1.8; margin: 0.8rem 0 1.1rem; color: var(--vh-text-1, #18181b); }

.pq-options { display: grid; gap: 0.55rem; }
.pq-opt {
  display: flex; align-items: baseline; gap: 0.7rem; text-align: left;
  padding: 0.7rem 0.9rem; font-size: 0.9rem; line-height: 1.6;
  border: 1px solid transparent; border-radius: 10px;
  background: var(--vh-bg-soft, #f4f4f5); color: var(--vh-text-1, #18181b);
  cursor: pointer; font-family: inherit;
  transition: border-color 0.15s ease, transform 0.15s ease, background 0.15s ease;
}
.dark .pq-opt { background: var(--vp-c-bg-soft); }
.pq-opt:hover:not(:disabled) { border-color: var(--vh-accent, #2f4fe0); }
.pq-opt b {
  flex: none; width: 1.5rem; height: 1.5rem; line-height: 1.5rem; text-align: center;
  font-size: 0.75rem; border-radius: 50%;
  background: var(--vp-c-bg); color: var(--vh-text-2, #52525b);
  border: 1px solid var(--vh-border, #e4e4e7);
}
.pq-opt.right { border-color: #16a34a; background: rgba(34, 197, 94, 0.1); }
.pq-opt.right b { color: #16a34a; border-color: #16a34a; background: rgba(34, 197, 94, 0.12); }
.pq-opt.wrong { border-color: #dc2626; background: rgba(239, 68, 68, 0.1); }
.pq-opt.wrong b { color: #dc2626; border-color: #dc2626; background: rgba(239, 68, 68, 0.12); }
.pq-opt.dim { opacity: 0.45; }

.pq-wrongtip { margin-top: 0.9rem; font-size: 0.86rem; color: #dc2626; }
.pq-explain {
  margin-top: 1rem; padding: 0.9rem 1rem; border-radius: 12px;
  border: 1px solid rgba(34, 197, 94, 0.35); background: rgba(34, 197, 94, 0.06);
}
.pq-explain h4 { margin: 0 0 0.4rem; font-size: 0.9rem; }
.pq-explain p { margin: 0; font-size: 0.88rem; line-height: 1.75; color: var(--vh-text-1, #18181b); }
.pq-refs { margin-top: 0.8rem; display: grid; gap: 0.35rem; }
.pq-refs i { font-style: normal; font-size: 0.76rem; color: var(--vh-text-3, #a1a1aa); }
.pq-ref {
  display: block; text-align: left; padding: 0.45rem 0.7rem; font-size: 0.84rem;
  color: var(--vh-text-1, #18181b); text-decoration: none;
  border: 1px solid transparent; border-radius: 8px; background: none; cursor: pointer; font-family: inherit;
}
.pq-ref:hover { border-color: var(--vh-accent, #2f4fe0); background: var(--vh-accent-weak, rgba(47, 79, 224, 0.09)); }
.pq-ref em { display: block; font-style: normal; font-size: 0.72rem; color: var(--vh-accent, #2f4fe0); }

.pq-nav { display: flex; justify-content: space-between; margin-top: 1.1rem; }
.pq-btn {
  padding: 0.5rem 1.3rem; font-size: 0.88rem; font-weight: 600;
  color: #fff; background: var(--vh-accent, #2f4fe0);
  border: none; border-radius: 10px; cursor: pointer;
  transition: background 0.15s ease;
}
.pq-btn:hover { background: color-mix(in srgb, var(--vh-accent, #2f4fe0) 85%, #000); }
.pq-btn.ghost { background: transparent; border: 1px solid var(--vh-border, #e4e4e7); color: var(--vh-text-2, #52525b); }
.pq-btn.ghost:hover { border-color: var(--vh-accent, #2f4fe0); color: var(--vh-accent, #2f4fe0); background: transparent; }
</style>
