<script setup>
import { computed, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { POINTS } from './points.js'

// 知识点卡片：一张卡 = 一个点，串起站内多篇文档。
// 展示模式：grid = 卡片墙（首页，点卡片弹层展开）；full = 详情列表页（/points）。
const props = defineProps({ mode: { type: String, default: 'grid' } })

const openId = ref('')
const ready = ref(false)
// 弹层打开时锁滚动（锁 body 就够，VitePress 页面滚动在 body/html 上）
onMounted(() => { ready.value = true })

const openPoint = computed(() => POINTS.find(p => p.id === openId.value) || null)

function open(id) { openId.value = id }
function close() { openId.value = '' }

function href(item) {
  return withBase(item.link + (item.anchor || ''))
}
</script>

<template>
  <!-- ===== 卡片墙（首页） ===== -->
  <div v-if="mode === 'grid'" class="pt-grid">
    <button v-for="p in POINTS" :key="p.id" class="pt-card" :style="{ '--pc': p.color }" @click="open(p.id)">
      <span class="pt-icon">{{ p.icon }}</span>
      <span class="pt-body">
        <b class="pt-title">{{ p.title }}</b>
        <span class="pt-tagline">{{ p.tagline }}</span>
      </span>
      <span class="pt-arrow">→</span>
    </button>
  </div>

  <!-- ===== 详情列表页（/points） ===== -->
  <div v-else class="pt-list">
    <section v-for="p in POINTS" :key="p.id" class="pt-section" :style="{ '--pc': p.color }">
      <header class="pt-head" @click="openId = openId === p.id ? '' : p.id">
        <span class="pt-icon lg">{{ p.icon }}</span>
        <div class="pt-head-body">
          <h3>{{ p.title }}</h3>
          <p>{{ p.tagline }}</p>
        </div>
        <span class="pt-toggle">{{ openId === p.id ? '收起 ▲' : '展开 ▼' }}</span>
      </header>
      <div v-if="openId === p.id" class="pt-detail">
        <h4>🎯 这个点串起什么</h4>
        <a v-for="(c, i) in p.core" :key="i" class="pt-item" :href="href(c)">
          <span class="dot" /> {{ c.text }}<i class="from">{{ c.from }}</i>
        </a>
        <h4>🌿 发散联想</h4>
        <a v-for="(b, i) in p.branch" :key="'b' + i" class="pt-item branch" :href="href(b)">
          <span class="dot" /> {{ b.text }}<i class="from">{{ b.from }}</i>
        </a>
      </div>
    </section>
  </div>

  <!-- ===== 弹层（仅卡片墙模式；详情页用内联展开） ===== -->
  <Teleport to="body">
    <div v-if="mode === 'grid' && openPoint" class="pt-mask" @click.self="close">
      <div class="pt-modal" :style="{ '--pc': openPoint.color }">
        <header class="pt-modal-head">
          <span class="pt-icon lg">{{ openPoint.icon }}</span>
          <div>
            <h3>{{ openPoint.title }}</h3>
            <p>{{ openPoint.tagline }}</p>
          </div>
          <button class="pt-close" aria-label="关闭" @click="close">✕</button>
        </header>
        <div class="pt-modal-body">
          <h4>🎯 这个点串起什么</h4>
          <a v-for="(c, i) in openPoint.core" :key="i" class="pt-item" :href="href(c)" @click="close">
            <span class="dot" /> {{ c.text }}<i class="from">{{ c.from }}</i>
          </a>
          <h4>🌿 发散联想</h4>
          <a v-for="(b, i) in openPoint.branch" :key="'b' + i" class="pt-item branch" :href="href(b)" @click="close">
            <span class="dot" /> {{ b.text }}<i class="from">{{ b.from }}</i>
          </a>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
/* ===== 卡片墙 ===== */
.pt-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 0.8rem;
}
.pt-card {
  --pc: var(--vh-accent, #2f4fe0);
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  text-align: left;
  padding: 0.9rem 1rem;
  border-radius: 14px;
  border: 1px solid color-mix(in srgb, var(--pc) 35%, transparent);
  background: color-mix(in srgb, var(--pc) 7%, var(--vp-c-bg-soft));
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}
.pt-card:hover {
  transform: translateY(-3px);
  border-color: var(--pc);
  box-shadow: 0 10px 26px color-mix(in srgb, var(--pc) 22%, transparent);
}
.pt-icon { font-size: 1.5rem; line-height: 1.25; }
.pt-icon.lg { font-size: 1.9rem; }
.pt-body { display: flex; flex-direction: column; gap: 0.25rem; min-width: 0; }
.pt-title { font-size: 0.98rem; color: var(--vp-c-text-1, #e6e9f5); }
.pt-tagline {
  font-size: 0.78rem;
  color: var(--vp-c-text-2, #b8c0d9);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.pt-arrow { margin-left: auto; color: var(--pc); font-weight: 700; align-self: center; }

/* ===== 详情列表页 ===== */
.pt-list { display: grid; gap: 0.9rem; }
.pt-section {
  --pc: var(--vh-accent, #2f4fe0);
  border: 1px solid color-mix(in srgb, var(--pc) 30%, transparent);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}
.pt-head {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 1.2rem;
  cursor: pointer;
  user-select: none;
}
.pt-head-body { flex: 1; min-width: 0; }
.pt-head h3 { margin: 0; font-size: 1.05rem; }
.pt-head p { margin: 0.2rem 0 0; font-size: 0.82rem; color: var(--vp-c-text-2, #b8c0d9); }
.pt-toggle { font-size: 0.78rem; color: var(--pc); flex: none; }
.pt-detail { padding: 0.2rem 1.2rem 1.1rem; border-top: 1px dashed color-mix(in srgb, var(--pc) 30%, transparent); }
.pt-detail h4 { margin: 0.9rem 0 0.4rem; font-size: 0.86rem; }

/* ===== 条目（两处共用） ===== */
.pt-item {
  display: block;
  padding: 0.45rem 0.7rem;
  margin: 0.3rem 0;
  font-size: 0.88rem;
  line-height: 1.55;
  color: var(--vp-c-text-1, #e6e9f5);
  text-decoration: none;
  border-radius: 10px;
  border: 1px solid transparent;
  transition: border-color 0.15s ease, background 0.15s ease;
}
.pt-item:hover { border-color: color-mix(in srgb, var(--pc) 45%, transparent); background: color-mix(in srgb, var(--pc) 6%, transparent); }
.pt-item .dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: var(--pc); margin-right: 0.5rem; vertical-align: 0.12em; }
.pt-item.branch { opacity: 0.88; }
.pt-item .from { display: block; font-style: normal; font-size: 0.72rem; color: var(--pc); margin-top: 0.1rem; padding-left: 1.05rem; }

/* ===== 弹层 ===== */
.pt-mask {
  position: fixed;
  inset: 0;
  z-index: 90;
  background: rgba(8, 10, 28, 0.62);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.2rem;
}
.pt-modal {
  --pc: var(--vh-accent, #2f4fe0);
  width: min(680px, 100%);
  max-height: 84vh;
  overflow-y: auto;
  border-radius: 18px;
  border: 1px solid color-mix(in srgb, var(--pc) 40%, transparent);
  background: var(--vp-c-bg-soft);
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.45);
}
.pt-modal-head {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1.1rem 1.3rem;
  background: color-mix(in srgb, var(--pc) 10%, var(--vp-c-bg-soft));
  border-bottom: 1px solid color-mix(in srgb, var(--pc) 25%, transparent);
}
.pt-modal-head h3 { margin: 0; font-size: 1.15rem; }
.pt-modal-head p { margin: 0.25rem 0 0; font-size: 0.82rem; color: var(--vp-c-text-2, #b8c0d9); }
.pt-modal-head > div { flex: 1; min-width: 0; }
.pt-close {
  border: none;
  background: none;
  color: var(--vp-c-text-2, #b8c0d9);
  font-size: 1.05rem;
  cursor: pointer;
  padding: 0.3rem 0.55rem;
  border-radius: 8px;
}
.pt-close:hover { color: #ef4444; background: rgba(239, 68, 68, 0.1); }
.pt-modal-body { padding: 0.6rem 1.3rem 1.2rem; }
.pt-modal-body h4 { margin: 0.9rem 0 0.4rem; font-size: 0.88rem; }
</style>
