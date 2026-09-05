<script setup>
import { computed } from 'vue'
import { useRoute, withBase } from 'vitepress'

// 功能页顶部切换栏：术语 / 练习 / 闯关 / 任务 / 错题 / 卡片。
// 当前路径高亮；点其他 tab 直接换页（对齐 vibe-hub 顶部导航在功能间横跳的体验）。
const route = useRoute()

const tabs = [
  { text: '📚 文档课', link: '/docs', match: '/docs' },
  { text: '🗂 术语', link: '/terms', match: '/terms' },
  { text: '🎯 练习', link: '/practice', match: '/practice' },
  { text: '🎮 闯关', link: '/game', match: '/game' },
  { text: '✅ 任务', link: '/tasks', match: '/tasks' },
  { text: '📒 错题本', link: '/wrongbook', match: '/wrongbook' },
  { text: '🧩 卡片', link: '/points', match: '/points' }
]

const current = computed(() => {
  const p = decodeURIComponent(route.path || '')
  return tabs.find(t => p === withBase(t.link) || p.startsWith(withBase(t.link) + '/') || p === t.link || p.startsWith(t.link + '/'))?.link || ''
})
</script>

<template>
  <nav class="tt">
    <a v-for="t in tabs" :key="t.link" class="tt-tab" :class="{ on: current === t.link }" :href="withBase(t.link)">
      {{ t.text }}
    </a>
  </nav>
</template>

<style scoped>
.tt {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0 0 1.2rem;
  padding: 0.35rem;
  border: 1px solid var(--vh-border, #e4e4e7);
  border-radius: 12px;
  background: var(--vp-c-bg);
}
.tt-tab {
  padding: 0.4rem 0.95rem;
  border-radius: 9px;
  font-size: 0.88rem;
  color: var(--vh-text-2, #52525b);
  text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease;
}
.tt-tab:hover { color: var(--vh-accent, #2f4fe0); background: var(--vh-accent-weak, rgba(47, 79, 224, 0.09)); }
.tt-tab.on {
  color: #fff;
  background: var(--vh-accent, #2f4fe0);
  font-weight: 600;
}
</style>
