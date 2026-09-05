<script setup>
import { computed, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'

// 错题本：读取闯关游戏写入的 quiz-wrong-book（答错入本、答对自动移出）。
// 本页提供总览、单题移除、清空和"只重做错题"模式——重做答对同样移出，答错累计错次。
const WRONG_KEY = 'quiz-wrong-book'
const ready = ref(false)
const book = ref({})

onMounted(() => {
  try {
    const raw = localStorage.getItem(WRONG_KEY)
    book.value = JSON.parse(raw)?.items || {}
  } catch (e) { book.value = {} }
  ready.value = true
})

function persist() {
  try { localStorage.setItem(WRONG_KEY, JSON.stringify({ items: book.value })) } catch (e) { /* 忽略 */ }
}

const list = computed(() =>
  Object.values(book.value).sort((a, b) => (b.lastTs || 0) - (a.lastTs || 0))
)
const count = computed(() => list.value.length)

function removeOne(q) {
  delete book.value[q.q]
  persist()
}
function clearAll() {
  if (!confirm('确定清空全部错题记录吗？此操作不可恢复。')) return
  book.value = {}
  persist()
}

function fmtTs(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return `${d.getMonth() + 1}-${d.getDate()}`
}

// ---------- 重做模式 ----------
const redoing = ref(false)
const redoList = ref([])
const redoIdx = ref(0)
const redoPicked = ref(-1)
const redoShowing = ref(false)
const redoCleared = ref(0)

const redoQ = computed(() => redoList.value[redoIdx.value] || null)

function startRedo() {
  redoList.value = [...list.value].sort(() => Math.random() - 0.5)
  redoIdx.value = 0
  redoPicked.value = -1
  redoShowing.value = false
  redoCleared.value = 0
  redoing.value = true
}

function redoPick(i) {
  if (redoShowing.value) return
  redoPicked.value = i
  redoShowing.value = true
  const q = redoQ.value
  if (i === q.answer) {
    // 答对：移出错题本
    delete book.value[q.q]
    persist()
    redoCleared.value++
  } else {
    // 答错：留在本里，累计错次
    q.wrongCount = (q.wrongCount || 0) + 1
    q.lastTs = Date.now()
    persist()
  }
}

function redoNext() {
  redoShowing.value = false
  redoPicked.value = -1
  if (redoIdx.value < redoList.value.length - 1) { redoIdx.value++; return }
  redoing.value = false
}
</script>

<template>
  <div v-if="ready" class="wb">
    <!-- 总览 -->
    <div v-if="!redoing" class="panel">
      <div class="head">
        <div>
          <h3>🖍️ 错题本 · {{ count }} 题</h3>
          <p class="sub">闯关游戏答错的题自动进本；在任何模式里答对同一题会自动移出。数据只存本浏览器。</p>
        </div>
        <div class="ops">
          <button class="btn" :disabled="!count" @click="startRedo">🔁 只重做错题</button>
          <button class="btn ghost danger" :disabled="!count" @click="clearAll">清空</button>
        </div>
      </div>

      <p v-if="!count" class="empty">
        错题本是空的——去 <a :href="withBase('/game')" class="link">知识闯关</a> 来一局，答错的题会自动收进来。
      </p>

      <div v-else class="list">
        <div v-for="q in list" :key="q.q" class="wq">
          <div class="wq-head">
            <span class="chip">{{ q.topic }}</span>
            <span class="meta">错过 {{ q.wrongCount }} 次<template v-if="q.lastTs"> · 最近 {{ fmtTs(q.lastTs) }}</template></span>
            <button class="del" title="移出错题本" @click="removeOne(q)">✕</button>
          </div>
          <p class="q">{{ q.q }}</p>
          <p class="ans">正确答案：{{ ['A', 'B', 'C', 'D'][q.answer] }}. {{ q.options[q.answer] }}</p>
          <a class="src" :href="withBase(q.source.link)" target="_blank">📖 {{ q.source.text }}（{{ q.source.from }}）↗</a>
        </div>
      </div>
    </div>

    <!-- 重做模式 -->
    <div v-else class="panel">
      <div class="head">
        <h3>🔁 重做错题 · 第 {{ redoIdx + 1 }} / {{ redoList.length }} 题</h3>
        <span class="meta">已移出 {{ redoCleared }} 题</span>
      </div>
      <div class="bar"><div class="bar-fill" :style="{ width: Math.round((redoIdx / redoList.length) * 100) + '%' }" /></div>

      <template v-if="redoQ">
        <p class="chip-line"><span class="chip">{{ redoQ.topic }}</span></p>
        <h3 class="q-text">{{ redoQ.q }}</h3>
        <div class="options">
          <button
            v-for="(opt, i) in redoQ.options"
            :key="i"
            class="opt"
            :class="{ right: redoShowing && i === redoQ.answer, wrong: redoShowing && i === redoPicked && i !== redoQ.answer, dim: redoShowing && i !== redoQ.answer && i !== redoPicked }"
            :disabled="redoShowing"
            @click="redoPick(i)"
          >
            {{ ['A', 'B', 'C', 'D'][i] }}. {{ opt }}
          </button>
        </div>
        <div v-if="redoShowing" class="explain">
          <p class="verdict">{{ redoPicked === redoQ.answer ? '✅ 答对，已移出错题本！' : `❌ 正确答案：${['A','B','C','D'][redoQ.answer]}` }}</p>
          <p class="note">📖 考的知识点：{{ redoQ.source.text }}</p>
          <a class="src" :href="withBase(redoQ.source.link)" target="_blank">查看原文（{{ redoQ.source.from }}）↗</a>
          <button class="btn" @click="redoNext">{{ redoIdx === redoList.length - 1 ? '完成 →' : '下一题 →' }}</button>
        </div>
      </template>

      <button class="btn ghost quit" @click="redoing = false">退出重做</button>
    </div>
  </div>
</template>

<style scoped>
.wb { max-width: 720px; margin: 0 auto; }
.panel {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 1.5rem 1.7rem;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.05);
}
.head { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; }
h3 { margin: 0 0 0.4rem; }
.sub { font-size: 0.8rem; color: var(--vp-c-text-3, #8b93b8); margin: 0; }
.ops { display: flex; gap: 0.6rem; }
.meta { font-size: 0.78rem; color: var(--vp-c-text-3, #8b93b8); font-variant-numeric: tabular-nums; }

.btn {
  padding: 0.5rem 1.2rem; font-size: 0.88rem; font-weight: 600;
  color: #fff; background: var(--vh-accent, #2f4fe0);
  border: none; border-radius: 10px; cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12); }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn.ghost { background: transparent; border: 1px solid var(--vp-c-divider); color: var(--vp-c-text-2, #b8c0d9); }
.btn.ghost.danger:not(:disabled):hover { border-color: #ef4444; color: #ef4444; }
.btn.quit { margin-top: 1rem; }

.empty { color: var(--vp-c-text-2, #b8c0d9); font-size: 0.92rem; margin-top: 1.2rem; }
.link { color: var(--vp-c-brand-1, var(--vh-accent, #2f4fe0)); }

.list { display: grid; gap: 0.8rem; margin-top: 1.1rem; }
.wq {
  padding: 0.9rem 1rem;
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.05);
}
.wq-head { display: flex; align-items: center; gap: 0.6rem; }
.chip {
  font-size: 0.7rem; color: var(--vh-accent, #2f4fe0);
  border: 1px solid var(--vh-accent-weak, rgba(47, 79, 224, 0.09));
  border-radius: 999px; padding: 0.05rem 0.55rem;
}
.chip-line { margin: 0.4rem 0 0; }
.q { margin: 0.5rem 0 0.3rem; font-size: 0.92rem; font-weight: 600; color: var(--vp-c-text-1, #e6e9f5); }
.q-text { font-size: 1.08rem; margin: 0.6rem 0 1rem; }
.ans { margin: 0 0 0.3rem; font-size: 0.84rem; color: #22c55e; }
.src {
  display: inline-block; font-size: 0.8rem; color: var(--vh-accent, #2f4fe0); text-decoration: none;
  border-bottom: 1px dashed var(--vh-accent-weak, rgba(47, 79, 224, 0.09));
}
.src:hover { color: #c4b5fd; }
.del {
  margin-left: auto; border: none; background: none; color: var(--vp-c-text-3, #8b93b8);
  cursor: pointer; font-size: 0.85rem; padding: 0.2rem 0.45rem; border-radius: 6px;
}
.del:hover { color: #22c55e; background: rgba(34, 197, 94, 0.1); }

.bar { height: 6px; border-radius: 3px; background: var(--vp-c-divider); margin: 0.6rem 0 1rem; overflow: hidden; }
.bar-fill { height: 100%; background: var(--vh-accent, #2f4fe0); transition: width 0.4s ease; }

.options { display: grid; gap: 0.6rem; }
.opt {
  text-align: left; padding: 0.7rem 1rem; font-size: 0.95rem;
  border: 1px solid var(--vp-c-divider); border-radius: 10px;
  background: var(--vp-c-bg); color: var(--vp-c-text-1, #e6e9f5);
  cursor: pointer;
  transition: border-color 0.15s ease, transform 0.15s ease;
}
.opt:hover:not(:disabled) { border-color: var(--vp-c-brand-2); transform: translateX(4px); }
.opt.right { border-color: #22c55e; background: rgba(34, 197, 94, 0.12); }
.opt.wrong { border-color: #ef4444; background: rgba(239, 68, 68, 0.12); }
.opt.dim { opacity: 0.5; }

.explain { margin-top: 1rem; }
.verdict { font-weight: 700; margin-bottom: 0.2rem; }
.note { color: var(--vp-c-text-2, #b8c0d9); margin: 0.2rem 0; }
</style>
