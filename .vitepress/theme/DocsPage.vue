<script setup>
import { computed, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { SERIES } from './docs.js'

// 文档课（vibe-hub「路线」式）：系列大卡 → 展开章节列表 + 已读进度 + 从第一章开始。
// 已读章节存 localStorage（key: docs-read-v1），SSR 安全：全部 onMounted 后读写。
const READ_KEY = 'docs-read-v1'
const ready = ref(false)
const openId = ref('')
const readSet = ref(new Set())

onMounted(() => {
  try {
    const raw = JSON.parse(localStorage.getItem(READ_KEY)) || {}
    readSet.value = new Set(raw.read || [])
  } catch (e) { /* 首次使用 */ }
  ready.value = true
})

function persist() {
  try { localStorage.setItem(READ_KEY, JSON.stringify({ read: [...readSet.value] })) } catch (e) { /* 忽略 */ }
}

function toggleRead(id) {
  const s = new Set(readSet.value)
  s.has(id) ? s.delete(id) : s.add(id)
  readSet.value = s
  persist()
}

function toggleOpen(id) {
  openId.value = openId.value === id ? '' : id
}

const totalChapters = computed(() => SERIES.reduce((n, s) => n + s.chapters.length, 0))
const totalRead = computed(() => SERIES.reduce((n, s) => n + s.chapters.filter(c => readSet.value.has(c.id)).length, 0))

function readCount(s) {
  return s.chapters.filter(c => readSet.value.has(c.id)).length
}
function firstUnread(s) {
  return s.chapters.find(c => !readSet.value.has(c.id)) || s.chapters[0]
}
function href(link) { return withBase(link) }
</script>

<template>
  <div class="dc">
    <!-- 总进度条 -->
    <div class="dc-summary">
      <span>共 {{ SERIES.length }} 门文档课 · {{ totalChapters }} 章</span>
      <span class="dc-done">已读 {{ totalRead }} / {{ totalChapters }} 章</span>
    </div>

    <!-- 系列大卡列表 -->
    <section v-for="s in SERIES" :key="s.id" class="dc-card" :class="{ open: openId === s.id }">
      <button class="dc-head" @click="toggleOpen(s.id)">
        <span class="dc-num">{{ String(SERIES.indexOf(s) + 1).padStart(2, '0') }}</span>
        <span class="dc-body">
          <b>{{ s.title }}</b>
          <span class="dc-desc">{{ s.desc }}</span>
          <i class="dc-count">{{ readCount(s) }} / {{ s.chapters.length }} 章</i>
        </span>
        <span class="dc-badge" :class="{ done: readCount(s) === s.chapters.length }">
          {{ readCount(s) === s.chapters.length ? '已读完' : readCount(s) > 0 ? '在读' : '未开始' }}
        </span>
      </button>

      <!-- 展开的章节列表 -->
      <div v-if="openId === s.id" class="dc-chapters">
        <div class="dc-toolbar">
          <a class="dc-start" :href="href(firstUnread(s).link)">
            {{ readCount(s) > 0 ? '继续阅读 →' : '从第一章开始 →' }}
          </a>
          <span class="dc-tip">点章节行末的圆圈标记已读</span>
        </div>
        <div v-for="(c, i) in s.chapters" :key="c.id" class="dc-chapter" :class="{ read: readSet.has(c.id) }">
          <a class="dc-ch-link" :href="href(c.link)">
            <i class="dc-ch-no">{{ String(i + 1).padStart(2, '0') }}</i>
            <span class="dc-ch-body">
              <b>{{ c.title }}</b>
              <span class="dc-ch-desc">{{ c.desc }}</span>
            </span>
          </a>
          <button
            class="dc-ch-check"
            :class="{ on: readSet.has(c.id) }"
            :title="readSet.has(c.id) ? '取消已读' : '标记已读'"
            @click="toggleRead(c.id)">✓</button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dc { max-width: 760px; margin: 0 auto; }

.dc-summary {
  display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;
  font-size: 0.85rem; color: var(--vh-text-3, #a1a1aa); margin-bottom: 1.2rem;
}
.dc-done { color: var(--vh-accent, #2f4fe0); font-variant-numeric: tabular-nums; }

/* ===== 系列大卡 ===== */
.dc-card {
  border: 1px solid var(--vh-border, #e4e4e7);
  border-radius: 12px;
  background: var(--vp-c-bg);
  margin-bottom: 0.9rem;
  overflow: hidden;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}
.dc-card:hover { border-color: var(--vh-text-3, #a1a1aa); }
.dc-card.open { border-color: var(--vh-accent, #2f4fe0); }

.dc-head {
  display: flex; align-items: flex-start; gap: 1rem; width: 100%; text-align: left;
  padding: 1.15rem 1.3rem; border: none; background: none; cursor: pointer; font-family: inherit;
}
.dc-num { font-size: 0.85rem; color: var(--vh-text-3, #a1a1aa); font-weight: 700; padding-top: 0.2rem; }
.dc-body { flex: 1; display: flex; flex-direction: column; gap: 0.3rem; }
.dc-body b { font-size: 1.05rem; color: var(--vh-text-1, #18181b); font-weight: 700; }
.dc-desc { font-size: 0.85rem; color: var(--vh-text-2, #52525b); line-height: 1.65; }
.dc-count { font-style: normal; font-size: 0.76rem; color: var(--vh-text-3, #a1a1aa); }
.dc-badge {
  flex: none; font-size: 0.72rem; padding: 0.18rem 0.65rem; border-radius: 999px;
  border: 1px solid var(--vh-border, #e4e4e7); color: var(--vh-text-3, #a1a1aa);
}
.dc-badge.done { border-color: #16a34a; color: #16a34a; background: rgba(34, 197, 94, 0.08); }

/* ===== 章节列表 ===== */
.dc-chapters { border-top: 1px solid var(--vh-border, #e4e4e7); padding: 0.9rem 1.3rem 1.2rem; }
.dc-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 0.8rem; }
.dc-start {
  display: inline-block; padding: 0.5rem 1.2rem; border-radius: 10px;
  font-size: 0.88rem; font-weight: 600; text-decoration: none;
  color: #fff !important; background: var(--vh-accent, #2f4fe0);
}
.dc-start:hover { background: color-mix(in srgb, var(--vh-accent, #2f4fe0) 85%, #000); }
.dc-tip { font-size: 0.75rem; color: var(--vh-text-3, #a1a1aa); }

.dc-chapter { display: flex; align-items: center; gap: 0.6rem; }
.dc-ch-link {
  flex: 1; display: flex; align-items: flex-start; gap: 0.8rem; min-width: 0;
  padding: 0.6rem 0.7rem; border-radius: 10px; text-decoration: none !important;
  transition: background 0.15s ease;
}
.dc-ch-link:hover { background: var(--vh-accent-weak, rgba(47, 79, 224, 0.09)); }
.dc-ch-no { flex: none; font-style: normal; font-size: 0.78rem; font-weight: 700; color: var(--vh-text-3, #a1a1aa); padding-top: 0.15rem; }
.dc-ch-body { display: flex; flex-direction: column; gap: 0.15rem; min-width: 0; }
.dc-ch-body b { font-size: 0.92rem; color: var(--vh-text-1, #18181b); font-weight: 600; }
.dc-ch-desc {
  font-size: 0.78rem; color: var(--vh-text-2, #52525b); line-height: 1.5;
  display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
}
.dc-chapter.read .dc-ch-body b { color: var(--vh-text-3, #a1a1aa); text-decoration: line-through; text-decoration-thickness: 1px; }
.dc-chapter.read .dc-ch-no { color: #16a34a; }

.dc-ch-check {
  flex: none; width: 1.35rem; height: 1.35rem; border-radius: 50%;
  border: 1.5px solid var(--vh-border, #e4e4e7); background: var(--vp-c-bg);
  color: transparent; font-size: 0.7rem; cursor: pointer; line-height: 1;
  transition: all 0.15s ease;
}
.dc-ch-check:hover { border-color: #16a34a; color: var(--vh-border, #e4e4e7); }
.dc-ch-check.on { border-color: #16a34a; background: #16a34a; color: #fff; }
</style>
