<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vitepress'

// 右下角阅读进度环：仅在文档页且页面可滚动时出现
const route = useRoute()
const pct = ref(0)
const visible = ref(false)
let raf = 0
let onScroll = null

function update() {
  raf = 0
  const doc = document.documentElement
  const scrollable = doc.scrollHeight - window.innerHeight
  const isDoc = !route.path.endsWith('index.html') && route.path !== '/'
  if (!isDoc || scrollable <= 40) {
    visible.value = false
    return
  }
  visible.value = true
  pct.value = Math.min(100, Math.round((window.scrollY / scrollable) * 100))
}

onMounted(() => {
  onScroll = () => {
    if (!raf) raf = requestAnimationFrame(update)
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
  update()
})
onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf)
  if (onScroll) {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  }
})

// 圆环参数
const R = 17
const CIRC = 2 * Math.PI * R

function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <Transition name="pop">
    <div v-if="visible" class="progress-orb" :title="`阅读进度 ${pct}%`">
      <svg width="44" height="44" viewBox="0 0 44 44">
        <circle class="track" cx="22" cy="22" :r="R" fill="none" stroke-width="3.5" />
        <circle
          class="fill"
          cx="22"
          cy="22"
          :r="R"
          fill="none"
          stroke-width="3.5"
          stroke-linecap="round"
          :stroke-dasharray="CIRC"
          :stroke-dashoffset="CIRC * (1 - pct / 100)"
          :transform="'rotate(-90 22 22)'"
        />
      </svg>
      <span class="num">{{ pct }}</span>
      <button class="top-btn" aria-label="回到顶部" @click="toTop">↑</button>
    </div>
  </Transition>
</template>

<style scoped>
.progress-orb {
  position: fixed;
  right: 22px;
  bottom: 24px;
  z-index: 55;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(10, 13, 34, 0.72);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(167, 139, 250, 0.25);
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
}
.progress-orb svg {
  position: absolute;
  inset: 0;
  margin: auto;
}
.track { stroke: rgba(148, 163, 184, 0.18); }
.fill {
  stroke: url(#none);
  stroke: #a78bfa;
  filter: drop-shadow(0 0 4px rgba(167, 139, 250, 0.6));
  transition: stroke-dashoffset 0.15s linear;
}
.num {
  font-size: 0.72rem;
  font-weight: 700;
  color: #e6e9f5;
  font-variant-numeric: tabular-nums;
}
.top-btn {
  position: absolute;
  right: -6px;
  bottom: -6px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid rgba(167, 139, 250, 0.35);
  background: rgba(10, 13, 34, 0.9);
  color: #a78bfa;
  font-size: 0.7rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease, background 0.15s ease;
}
.top-btn:hover {
  transform: translateY(-2px);
  background: rgba(124, 58, 237, 0.5);
  color: #fff;
}

.pop-enter-active, .pop-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: translateY(8px) scale(0.9); }
</style>
