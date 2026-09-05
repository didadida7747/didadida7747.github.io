<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Starfield from './Starfield.vue'
import DiscoverPanel from './DiscoverPanel.vue'
import ReadingProgress from './ReadingProgress.vue'
import DailyKnowledge from './DailyKnowledge.vue'

const { Layout } = DefaultTheme
const { isDark, frontmatter } = useData()
const route = useRoute()

// 双阶段转场：路由一变先盖纱（旧页面淡出感），新页渲染完后揭纱（新页面上移进入）
const switching = ref(false)
watch(
  () => route.path,
  (to, from) => {
    if (to === from) return
    switching.value = true
    nextTick(() => {
      requestAnimationFrame(() => requestAnimationFrame(() => (switching.value = false)))
    })
  }
)

// 维护 body.scrolled：离顶即真，供导航/本页目录虚化样式使用
let onScroll = null

// 本页锚点的缓动滚动：先加速后减速（easeInOutCubic），时长随距离缩放。
// 用 setInterval 而非 requestAnimationFrame：后台/被节流的标签页里 rAF 会挂起导致滚动卡死
let scrollTimer = null
function smoothScrollTo(targetY) {
  if (scrollTimer) clearInterval(scrollTimer)
  const startY = window.scrollY
  const dist = targetY - startY
  if (Math.abs(dist) < 2) return
  const duration = Math.min(900, 280 + Math.abs(dist) * 0.35)
  const start = performance.now()
  const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
  scrollTimer = setInterval(() => {
    const t = Math.min(1, (performance.now() - start) / duration)
    window.scrollTo(0, startY + dist * ease(t))
    if (t >= 1) {
      clearInterval(scrollTimer)
      scrollTimer = null
    }
  }, 16)
}

// 拦截同页 # 锚点点击（目录、正文内跳转），换成缓动滚动。
// 挂捕获阶段以抢在 Vue Router 之前；不用 stopPropagation，避免破坏大纲高亮等其他逻辑。
function onAnchorClick(e) {
  const a = e.target.closest('a')
  if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
  const href = a ? a.getAttribute('href') || '' : ''
  if (!href.startsWith('#') || href.length < 2) return
  const id = decodeURIComponent(href.slice(1))
  const el = document.getElementById(id)
  if (!el) return
  e.preventDefault()
  const navOffset = 80 // 避免标题被固定导航挡住
  smoothScrollTo(el.getBoundingClientRect().top + window.scrollY - navOffset)
  history.replaceState(null, '', href)
}

// 兜底：若 click 链路被其他处理器抢先 preventDefault（hash 仍变化），
// 监听 hashchange 接管滚动——刚落地的瞬跳由平滑动画覆盖。
// 注意：lastHash 不能在模块顶层读 location（SSR 构建期没有该对象，模块会崩），
// 必须等 onMounted 再初始化。
let lastHash = null
function onHashChange() {
  const h = location.hash
  if (h === lastHash) return
  lastHash = h
  if (h.length < 2) return
  const el = document.getElementById(decodeURIComponent(h.slice(1)))
  if (!el) return
  const navOffset = 80
  smoothScrollTo(el.getBoundingClientRect().top + window.scrollY - navOffset)
}

onMounted(() => {
  lastHash = location.hash
  onScroll = () => document.body.classList.toggle('scrolled', window.scrollY > 80)
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('hashchange', onHashChange)
  document.addEventListener('click', onAnchorClick, { capture: true })
  onScroll()
})
onBeforeUnmount(() => {
  if (onScroll) window.removeEventListener('scroll', onScroll)
  window.removeEventListener('hashchange', onHashChange)
  document.removeEventListener('click', onAnchorClick, { capture: true })
  if (scrollTimer) clearInterval(scrollTimer)
})
</script>

<template>
  <div v-if="isDark" class="starfield-holder">
    <Starfield />
  </div>

  <Layout>
    <template #home-hero-after>
      <DiscoverPanel v-if="frontmatter.layout === 'home'" />
      <DailyKnowledge v-if="frontmatter.layout === 'home'" />
    </template>

    <template #page-top>
      <div class="page-glow" aria-hidden="true" />
    </template>
  </Layout>

  <ReadingProgress />
  <div class="page-veil" :class="{ on: switching }" aria-hidden="true" />
</template>

<style>
.starfield-holder {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

/* 内容浮于星空之上 */
.VPContent {
  position: relative;
  z-index: 1;
}

/* ===== 导航栏：融入星空，无任何边框线；滚动后整条淡化防与正文重合 ===== */
.dark .VPNavBar {
  background: transparent !important;
  border-bottom: none !important;
  transition: opacity 0.35s ease;
}
.dark .VPNavBar .content-body {
  background: transparent !important;
  border-bottom: none !important;
  box-shadow: none !important;
}
/* 屏幕边缘细线（content-body::after 是那条黑线的来源）彻底移除 */
.dark .VPNavBar .content-body::after,
.dark .VPNavBar .divider,
.dark .divider-line {
  display: none !important;
  background: transparent !important;
  border: none !important;
  height: 0 !important;
}
.dark .divider { background: transparent !important; }

.dark .VPNavBar:not(.home) {
  background: rgba(19, 23, 53, 0.5) !important;
  backdrop-filter: blur(10px);
}

/* 滚动离顶后：导航整体（含字体与搜索框）淡化到 35%，悬停恢复 */
.dark .VPNavBar:not(.top) {
  opacity: 0.35;
  background: transparent !important;
  backdrop-filter: none;
}
.dark .VPNavBar:not(.top):hover,
.dark .VPNavBar:not(.top):focus-within {
  opacity: 1;
  background: rgba(19, 23, 53, 0.75) !important;
  backdrop-filter: blur(12px);
}

/* 滚动离顶后：右侧"本页目录"同步虚化，悬停恢复（scrolled class 由布局脚本维护） */
.dark .VPDocAsideOutline {
  transition: opacity 0.35s ease;
}
.dark body.scrolled .VPDocAsideOutline {
  opacity: 0.3;
}
.dark .VPDocAsideOutline:hover,
.dark .VPDocAsideOutline:focus-within {
  opacity: 1 !important;
}

/* ===== 侧边栏：半透明悬浮 ===== */
.dark .VPSidebar {
  background: rgba(19, 23, 53, 0.6) !important;
  backdrop-filter: blur(12px);
  border-right: 1px solid rgba(170, 180, 210, 0.1);
}
.dark .VPContent.has-sidebar {
  background: transparent !important;
}

/* ===== 文档正文：磨砂卡片保证可读性 ===== */
.dark .VPDoc {
  background: transparent;
}
.dark .vp-doc .container > .content {
  background: rgba(22, 27, 62, 0.55);
  backdrop-filter: blur(10px);
  border-radius: 14px;
  padding: 1.4rem 2rem;
}

/* ===== 页面转场：揭纱 + 内容上移进入 ===== */
.VPPage {
  animation: page-enter 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes page-enter {
  from {
    opacity: 0;
    transform: translateY(22px) scale(0.995);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 转场纱幕：路由切换瞬间盖一层快速的暗色渐隐 */
.page-veil {
  position: fixed;
  inset: 0;
  z-index: 60;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(7, 9, 23, 0.5), rgba(7, 9, 23, 0.85));
  opacity: 0;
  transition: opacity 0.22s ease;
}
.page-veil.on {
  opacity: 1;
  transition: opacity 0.1s ease;
}

@media (prefers-reduced-motion: reduce) {
  .VPPage { animation: none; }
  .page-veil { display: none; }
}

/* ===== 文档页顶部光带 ===== */
.page-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 180px;
  pointer-events: none;
  background:
    radial-gradient(ellipse 60% 100% at 30% 0%, rgba(124, 58, 237, 0.10), transparent 70%),
    radial-gradient(ellipse 50% 100% at 75% 0%, rgba(6, 182, 212, 0.08), transparent 70%);
}

</style>
