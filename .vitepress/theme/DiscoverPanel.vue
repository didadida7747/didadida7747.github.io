<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const { theme } = useData()

// 快捷词：点了直接填进 VitePress 本地搜索框
const hotWords = [
  '指令', 'CPU', '存储器', '函数', '控制流',
  '简历', '实习', '赛道', '科研', '选课', '健身', '投资'
]

const picks = computed(() => [
  { icon: '🧠', title: '计算机组成原理 · 全景导学', desc: '一条主线 + 四条暗线，408 最难的课讲成逻辑故事', link: '/计算机组成原理_全景导学笔记' },
  { icon: '🐍', title: 'SI100+ 夏合集 · 大二学习手册', desc: '18 集拆两卷，再编成三条行动线', link: '/SI100+ 2026夏合集_大二学生学习文档' },
  { icon: '🚀', title: '实习速成方法论', desc: '找实习是期末考不是高考；简历 = 学习清单', link: '/实习速成方法论_思路篇与实践篇整合笔记' },
  { icon: '🧭', title: '大学四年自我提升全景手册', desc: '学业、实践、认知三条路径的里程碑', link: '/大学四年自我提升全景手册' }
])

const trending = computed(() => [
  { rank: 1, text: '中央处理器：全课核心、篇幅最大的一章', link: '/计算机组成原理_全景导学笔记', tag: '计组' },
  { rank: 2, text: '计算机素养：合集播放量最高的一集', link: '/SI100+ 2026夏合集_大二学生学习文档', tag: '素养' },
  { rank: 3, text: '简历内容性价比排序：想被问什么就写什么', link: '/实习速成方法论_思路篇与实践篇整合笔记', tag: '实习' },
  { rank: 4, text: '大二上学期：定位与选课的行动清单', link: '/SI100+ 2026夏合集_大二学生学习文档', tag: '规划' },
  { rank: 5, text: '健身从入门到进阶：新手期怎么练', link: '/健身指导手册_从入门到进阶', tag: '健康' }
])

// 打开 VitePress 本地搜索并可选地自动填入搜索词。
// VitePress 的搜索状态没有公开全局句柄，只能走 DOM：点导航栏搜索按钮 →
// 等待 .VPLocalSearchBox 出现 → 对 .search-input 用原生 setter + input 事件填词（Vue 可响应）。
function openSearch(word) {
  const btn = document.querySelector('.VPNavBarSearch button, .DocSearch-Button')
  if (!btn) return
  btn.click()

  if (word === undefined) return
  // 轮询等待弹窗渲染完成（最多 ~2s），避免“空的搜索栏”
  let tries = 0
  const timer = setInterval(() => {
    const input = document.querySelector('.VPLocalSearchBox .search-input')
    if (input) {
      clearInterval(timer)
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
      setter.call(input, word)
      input.dispatchEvent(new Event('input', { bubbles: true }))
      input.focus()
    } else if (++tries > 20) {
      clearInterval(timer)
    }
  }, 100)
}
</script>

<template>
  <section class="discover">
    <!-- 搜索框（视觉仿搜索引擎首页） -->
    <div class="searchbox" @click="openSearch()">
      <span class="icon">🔍</span>
      <span class="placeholder">搜索文档，比如「指令」「简历」「健身」…</span>
      <span class="kbd">Ctrl K</span>
    </div>

    <div class="hotwords">
      <button v-for="w in hotWords" :key="w" class="chip" @click.stop="openSearch(w)">{{ w }}</button>
    </div>

    <div class="columns">
      <!-- 猜你想看 -->
      <div class="col">
        <h3>✨ 猜你想看</h3>
        <a v-for="p in picks" :key="p.title" class="pick" :href="withBase(p.link)">
          <span class="pick-icon">{{ p.icon }}</span>
          <span class="pick-body">
            <span class="pick-title">{{ p.title }}</span>
            <span class="pick-desc">{{ p.desc }}</span>
          </span>
        </a>
      </div>

      <!-- 热点榜 -->
      <div class="col">
        <h3>🔥 站内热点</h3>
        <a v-for="t in trending" :key="t.rank" class="trend" :href="withBase(t.link)">
          <span class="rank" :class="`top${t.rank}`">{{ t.rank }}</span>
          <span class="trend-text">{{ t.text }}</span>
          <span class="tag">{{ t.tag }}</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.discover {
  max-width: 900px;
  margin: 2.2rem auto 0;
  padding: 0 1.5rem;
}
.searchbox {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  max-width: 620px;
  margin: 0 auto;
  padding: 0.8rem 1.2rem;
  border-radius: 999px;
  border: 1px solid rgba(167, 139, 250, 0.35);
  background: rgba(15, 17, 40, 0.75);
  backdrop-filter: blur(8px);
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}
.searchbox:hover {
  border-color: var(--vp-c-brand-2);
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.15), 0 8px 28px rgba(124, 58, 237, 0.25);
  transform: translateY(-1px);
}
.icon { font-size: 1.05rem; }
.placeholder { flex: 1; color: var(--vp-c-text-3, #94a3b8); font-size: 0.95rem; }
.kbd {
  font-size: 0.75rem;
  color: var(--vp-c-text-3, #94a3b8);
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 6px;
  padding: 0.1rem 0.45rem;
}

.hotwords {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.9rem;
}
.chip {
  font-size: 0.82rem;
  color: var(--vp-c-text-2, #cbd5e1);
  background: rgba(139, 92, 246, 0.12);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 999px;
  padding: 0.25rem 0.85rem;
  cursor: pointer;
  transition: all 0.18s ease;
}
.chip:hover {
  color: #fff;
  background: rgba(139, 92, 246, 0.4);
  transform: translateY(-1px);
}

.columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  margin-top: 2rem;
}
@media (max-width: 768px) {
  .columns { grid-template-columns: 1fr; gap: 1.5rem; }
}
.col h3 {
  margin: 0 0 0.9rem;
  font-size: 1.02rem;
  color: var(--vp-c-text-1, #e2e8f0);
}

.pick {
  display: flex;
  gap: 0.75rem;
  padding: 0.65rem 0.8rem;
  border-radius: 12px;
  text-decoration: none !important;
  transition: background 0.18s ease, transform 0.18s ease;
}
.pick:hover {
  background: rgba(139, 92, 246, 0.12);
  transform: translateX(4px);
}
.pick-icon { font-size: 1.4rem; line-height: 1.2; }
.pick-body { display: flex; flex-direction: column; }
.pick-title { color: var(--vp-c-text-1, #e2e8f0); font-weight: 600; font-size: 0.93rem; }
.pick-desc { color: var(--vp-c-text-3, #94a3b8); font-size: 0.82rem; margin-top: 0.15rem; }

.trend {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.5rem 0.8rem;
  border-radius: 10px;
  text-decoration: none !important;
  transition: background 0.18s ease;
}
.trend:hover { background: rgba(139, 92, 246, 0.12); }
.rank {
  width: 1.35rem;
  text-align: center;
  font-weight: 800;
  font-style: italic;
  font-size: 0.95rem;
  color: #94a3b8;
}
.rank.top1 { color: #f43f5e; }
.rank.top2 { color: #f97316; }
.rank.top3 { color: #eab308; }
.trend-text {
  flex: 1;
  color: var(--vp-c-text-2, #cbd5e1);
  font-size: 0.88rem;
}
.tag {
  font-size: 0.72rem;
  color: var(--vp-c-brand-3, #a78bfa);
  border: 1px solid rgba(167, 139, 250, 0.4);
  border-radius: 999px;
  padding: 0.05rem 0.5rem;
  white-space: nowrap;
}
</style>
