<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

// 主题色切换器（vibe-hub 同款彩蛋）：导航右侧一排色点，点击换整站主色。
// 实现：改 documentElement 上的 --vh-accent / --vh-accent-weak，选择存 localStorage。
// 浏览器 API 全部在 onMounted / 事件回调里（SSR 构建期无 window/document，硬规则 1）。
const KEY = 'theme-accent-v1'

const COLORS = [
  { id: 'blue', value: '#2f4fe0' },   // 默认靛蓝（vibe-hub 同款）
  { id: 'violet', value: '#7c3aed' },
  { id: 'green', value: '#0d9488' },
  { id: 'orange', value: '#ea580c' },
  { id: 'red', value: '#dc2626' },
  { id: 'pink', value: '#db2777' },
  { id: 'gold', value: '#ca8a04' },
  { id: 'black', value: '#18181b' }
]

const current = ref('blue')
const open = ref(false)

function apply(id) {
  const c = COLORS.find(x => x.id === id) || COLORS[0]
  current.value = c.id
  const root = document.documentElement
  root.style.setProperty('--vh-accent', c.value)
  // weak 态 = 主色 9% 透明度（与 custom.css 默认值同构）
  const n = parseInt(c.value.slice(1), 16)
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
  root.style.setProperty('--vh-accent-weak', `rgba(${r}, ${g}, ${b}, 0.09)`)
}

function pick(id) {
  apply(id)
  try { localStorage.setItem(KEY, JSON.stringify({ id })) } catch (e) { /* 忽略 */ }
}

onMounted(() => {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY))
    if (raw?.id) apply(raw.id)
  } catch (e) { /* 首次使用 */ }
})
</script>

<template>
  <div class="tp" @mouseleave="open = false">
    <button
      class="tp-dot"
      :class="{ on: open }"
      title="主题色"
      aria-label="切换主题色"
      @click="open = !open">
      <i :style="{ background: COLORS.find(c => c.id === current)?.value }" />
    </button>
    <div v-if="open" class="tp-panel">
      <button
        v-for="c in COLORS"
        :key="c.id"
        class="tp-opt"
        :class="{ on: current === c.id }"
        :title="c.id"
        :aria-label="`主题色 ${c.id}`"
        @click="pick(c.id)">
        <i :style="{ background: c.value }" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.tp { position: relative; display: inline-block; }
.tp-dot {
  width: 2rem; height: 2rem; border-radius: 50%;
  border: none; background: none; cursor: pointer;
  display: grid; place-items: center;
}
.tp-dot i {
  width: 0.9rem; height: 0.9rem; border-radius: 50%;
  display: block; transition: transform 0.15s ease;
}
.tp-dot:hover i, .tp-dot.on i { transform: scale(1.25); }

.tp-panel {
  position: absolute; top: calc(100% + 0.5rem); right: 0; z-index: 50;
  display: flex; gap: 0.45rem; align-items: center;
  padding: 0.5rem 0.7rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vh-border, #e4e4e7);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
.tp-opt {
  width: 1.35rem; height: 1.35rem; border-radius: 50%;
  border: 2px solid transparent; cursor: pointer;
  padding: 0; display: grid; place-items: center;
  background: none;
}
.tp-opt i { width: 0.85rem; height: 0.85rem; border-radius: 50%; display: block; }
.tp-opt.on { border-color: var(--vh-text-1, #18181b); }
.tp-opt:hover { transform: scale(1.15); }
</style>
