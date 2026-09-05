<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Starfield from './Starfield.vue'
import DiscoverPanel from './DiscoverPanel.vue'
import ReadingProgress from './ReadingProgress.vue'
import DailyKnowledge from './DailyKnowledge.vue'
import ThemePicker from './ThemePicker.vue'

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
    <template #nav-bar-content-after>
      <div class="nav-themepicker"><ThemePicker /></div>
    </template>

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
/* 主题色切换器在导航栏中的落位（search 框之后） */
.nav-themepicker {
  display: flex;
  align-items: center;
  margin-left: 0.4rem;
  padding-right: 0.6rem;
}
@media (max-width: 719px) {
  .nav-themepicker { display: none; }
}

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

/* ===== 导航栏：vibe-hub 式白底 + 1px 底线（深色模式为深底同款线） ===== */
.VPNavBar {
  background: var(--vp-c-bg) !important;
  border-bottom: 1px solid var(--vh-border, #e4e4e7);
  transition: background 0.25s ease;
}
.VPNavBar .content-body {
  background: transparent !important;
  border-bottom: none !important;
  box-shadow: none !important;
}
.VPNavBar .content-body::after,
.VPNavBar .divider,
.divider-line {
  display: none !important;
  background: transparent !important;
  border: none !important;
  height: 0 !important;
}
.divider { background: transparent !important; }

.VPNavBar:not(.home) {
  background: var(--vp-c-bg) !important;
  backdrop-filter: none;
}

/* 滚动离顶后：导航保持白底细线（vibe-hub 不做淡化） */
.VPNavBar:not(.top) {
  opacity: 1;
  background: var(--vp-c-bg) !important;
  backdrop-filter: none;
  border-bottom: 1px solid var(--vh-border, #e4e4e7);
}

/* 滚动离顶后：右侧"本页目录"淡化，悬停恢复（scrolled class 由布局脚本维护） */
.VPDocAsideOutline {
  transition: opacity 0.35s ease;
}
body.scrolled .VPDocAsideOutline {
  opacity: 0.3;
}
.VPDocAsideOutline:hover,
.VPDocAsideOutline:focus-within {
  opacity: 1 !important;
}

/* ===== 侧边栏 ===== */
.VPSidebar {
  background: var(--vp-c-bg) !important;
  border-right: 1px solid var(--vh-border, #e4e4e7);
}
.VPContent.has-sidebar {
  background: transparent !important;
}

/* ===== 文档正文区 ===== */
.VPDoc {
  background: transparent;
}
/* 浅色模式正文直接铺在白底上（vibe-hub 无卡片包裹） */
html:not(.dark) .vp-doc .container > .content {
  background: transparent;
  backdrop-filter: none;
  border-radius: 0;
  padding: 1.4rem 2rem;
}
/* 深色模式正文保持磨砂卡片保证可读性 */
.dark .vp-doc .container > .content {
  background: rgba(23, 23, 28, 0.72);
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
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.85));
  opacity: 0;
  transition: opacity 0.22s ease;
}
.dark .page-veil {
  background: linear-gradient(180deg, rgba(10, 10, 14, 0.5), rgba(10, 10, 14, 0.85));
}
.page-veil.on {
  opacity: 1;
  transition: opacity 0.1s ease;
}

@media (prefers-reduced-motion: reduce) {
  .VPPage { animation: none; }
  .page-veil { display: none; }
}

/* ===== 页面顶部光带（浅色仅极淡主色晕，深色保留原氛围） ===== */
.page-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 180px;
  pointer-events: none;
  background:
    radial-gradient(ellipse 60% 100% at 30% 0%, var(--vh-accent-weak), transparent 70%),
    radial-gradient(ellipse 50% 100% at 75% 0%, rgba(47, 79, 224, 0.05), transparent 70%);
}

</style>
