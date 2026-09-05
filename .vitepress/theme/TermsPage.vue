<script setup>
import { computed, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { CATS, TERMS } from './terms.js'

// 术语图鉴：分类 tab + 搜索 + 卡片墙 + 弹层详情（含联想栏）+ 收藏。
// 收藏与主题色等纯本地偏好存 localStorage，SSR 安全（全部 onMounted 后读写）。
const FAV_KEY = 'term-favs'

const cat = ref('all')
const query = ref('')
const openTerm = ref(null)
const favs = ref(new Set())

onMounted(() => {
  try { favs.value = new Set(JSON.parse(localStorage.getItem(FAV_KEY)) || []) } catch (e) { favs.value = new Set() }
})

function toggleFav(id) {
  const s = new Set(favs.value)
  s.has(id) ? s.delete(id) : s.add(id)
  favs.value = s
  try { localStorage.setItem(FAV_KEY, JSON.stringify([...s])) } catch (e) { /* 忽略 */ }
}

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return TERMS.filter(t => {
    if (cat.value !== 'all' && t.cat !== cat.value) return false
    if (!q) return true
    return (t.name + t.en + (t.alias || []).join('') + t.say + t.def).toLowerCase().includes(q)
  })
})

const grouped = computed(() => {
  const g = []
  for (const c of CATS) {
    if (c.id === 'all') continue
    const items = filtered.value.filter(t => t.cat === c.id)
    if (items.length) g.push({ ...c, items })
  }
  return g
})

const countOf = id => (id === 'all' ? TERMS.length : TERMS.filter(t => t.cat === id).length)

function href(item) { return withBase((item.link || '') + (item.anchor || '')) }
function termById(id) { return TERMS.find(t => t.id === id) }
function openRel(r) {
  if (r.type !== 'term') return
  const t = termById(r.id)
  if (t) openTerm.value = t
}
</script>

<template>
  <div class="tg">
    <!-- 分类 tab + 搜索 -->
    <div class="tg-toolbar">
      <div class="tg-cats">
        <button v-for="c in CATS" :key="c.id" class="tg-cat" :class="{ on: cat === c.id }" @click="cat = c.id">
          {{ c.name }}<i>{{ countOf(c.id) }}</i>
        </button>
      </div>
      <input v-model="query" class="tg-search" placeholder="搜索术语：试试「中断」「注意力」「简历」…" />
    </div>

    <!-- 空状态 -->
    <p v-if="!filtered.length" class="tg-empty">没有匹配「{{ query }}」的术语，换个词试试。</p>

    <!-- 分组卡片墙 -->
    <section v-for="g in grouped" :key="g.id" class="tg-group">
      <h3>{{ g.name }}<i>{{ g.items.length }} 个条目</i></h3>
      <div class="tg-grid">
        <button v-for="t in g.items" :key="t.id" class="tg-card" :style="{ '--tc': t.color }" @click="openTerm = t">
          <span class="tg-row1">
            <b>{{ t.name }}</b>
            <span class="tg-en">{{ t.en }}</span>
            <i class="tg-star" :class="{ on: favs.has(t.id) }" @click.stop="toggleFav(t.id)">★</i>
          </span>
          <span class="tg-say">“{{ t.say }}”</span>
          <span class="tg-go">查看详情 →</span>
        </button>
      </div>
    </section>

    <!-- 弹层详情 -->
    <Teleport to="body">
      <div v-if="openTerm" class="tg-mask" @click.self="openTerm = null">
        <div class="tg-modal" :style="{ '--tc': openTerm.color }">
          <header class="tg-mhead">
            <span class="tg-micon">{{ openTerm.icon }}</span>
            <div class="tg-mtitle">
              <h3>{{ openTerm.name }} <em>{{ openTerm.en }}</em></h3>
            </div>
            <button class="tg-mclose" aria-label="关闭" @click="openTerm = null">✕</button>
          </header>
          <div class="tg-mbody">
            <div class="tg-saybox">“你可能会说：{{ openTerm.say }}”</div>
            <p class="tg-def">{{ openTerm.def }}</p>

            <div v-if="openTerm.alias?.length" class="tg-alias-row">
              <i>也常被叫作</i>
              <span v-for="a in openTerm.alias" :key="a" class="tg-alias">{{ a }}</span>
            </div>

            <h4>📖 站内原文</h4>
            <a v-for="(l, i) in openTerm.links" :key="i" class="tg-link" :href="href(l)">
              <span class="dot" />{{ l.text }}<i class="tg-from">{{ l.from }}</i>
            </a>

            <h4>🧠 联想栏</h4>
            <template v-for="(r, i) in openTerm.rel" :key="i">
              <!-- 术语联想：弹层内切换 -->
              <button v-if="r.type === 'term'" class="tg-link rel" @click="openRel(r)">
                <span class="dot" />{{ r.text }}<i class="tg-from">术语卡 →</i>
              </button>
              <!-- 跨界联想：跳文档 -->
              <a v-else class="tg-link rel ext" :href="href(r)">
                <span class="dot" />{{ r.text }}<i class="tg-from">{{ r.from || '跳转 ↗' }}</i>
              </a>
            </template>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.tg { max-width: 960px; margin: 0 auto; }

/* ===== 工具栏 ===== */
.tg-toolbar { display: flex; flex-wrap: wrap; gap: 0.7rem; align-items: center; margin-bottom: 1.4rem; }
.tg-cats { display: flex; flex-wrap: wrap; gap: 0.4rem; flex: 1; }
.tg-cat {
  padding: 0.35rem 0.85rem; border-radius: 999px; cursor: pointer;
  border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2, #b8c0d9); font-size: 0.85rem;
  transition: all 0.15s ease;
}
.tg-cat i { font-style: normal; opacity: 0.6; margin-left: 0.25rem; font-size: 0.75rem; }
.tg-cat.on {
  background: linear-gradient(120deg, #6366f1, #a855f7); color: #fff; border-color: transparent;
}
.tg-search {
  min-width: 220px; flex: 0 1 260px;
  padding: 0.45rem 0.9rem; border-radius: 999px; font-size: 0.85rem;
  border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); color: var(--vp-c-text-1, #e6e9f5);
}

/* ===== 分组 ===== */
.tg-group h3 { margin: 1.4rem 0 0.7rem; font-size: 1.05rem; }
.tg-group h3 i { font-style: normal; font-size: 0.78rem; color: var(--vp-c-text-3, #8b93b8); margin-left: 0.5rem; font-weight: 400; }
.tg-empty { text-align: center; color: var(--vp-c-text-3, #8b93b8); padding: 2rem 0; }

/* ===== 卡片 ===== */
.tg-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 0.8rem; }
.tg-card {
  --tc: #a78bfa;
  display: flex; flex-direction: column; gap: 0.45rem; text-align: left;
  padding: 1rem 1.1rem; border-radius: 14px; cursor: pointer;
  border: 1px solid color-mix(in srgb, var(--tc) 32%, transparent);
  background: color-mix(in srgb, var(--tc) 6%, var(--vp-c-bg-soft));
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}
.tg-card:hover {
  transform: translateY(-3px); border-color: var(--tc);
  box-shadow: 0 10px 26px color-mix(in srgb, var(--tc) 20%, transparent);
}
.tg-row1 { display: flex; align-items: baseline; gap: 0.45rem; }
.tg-row1 b { font-size: 1rem; color: var(--vp-c-text-1, #e6e9f5); }
.tg-en { font-size: 0.8rem; color: var(--tc); font-weight: 600; }
.tg-star {
  margin-left: auto; font-style: normal; cursor: pointer; font-size: 0.95rem;
  color: color-mix(in srgb, var(--tc) 35%, transparent); transition: color 0.15s ease;
}
.tg-star.on { color: #fbbf24; }
.tg-star:hover { color: #fbbf24; }
.tg-say {
  font-size: 0.82rem; color: var(--vp-c-text-2, #b8c0d9); line-height: 1.55;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.tg-go { font-size: 0.75rem; color: var(--tc); }

/* ===== 弹层 ===== */
.tg-mask {
  position: fixed; inset: 0; z-index: 90;
  background: rgba(8, 10, 28, 0.62); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; padding: 1.2rem;
}
.tg-modal {
  --tc: #a78bfa;
  width: min(680px, 100%); max-height: 84vh; overflow-y: auto;
  border-radius: 18px; border: 1px solid color-mix(in srgb, var(--tc) 40%, transparent);
  background: var(--vp-c-bg-soft); box-shadow: 0 24px 64px rgba(0, 0, 0, 0.45);
}
.tg-mhead {
  position: sticky; top: 0; z-index: 1;
  display: flex; align-items: center; gap: 0.8rem; padding: 1.1rem 1.3rem;
  background: color-mix(in srgb, var(--tc) 10%, var(--vp-c-bg-soft));
  border-bottom: 1px solid color-mix(in srgb, var(--tc) 25%, transparent);
}
.tg-micon { font-size: 1.9rem; }
.tg-mtitle { flex: 1; }
.tg-mtitle h3 { margin: 0; font-size: 1.2rem; }
.tg-mtitle em { font-style: normal; font-size: 0.9rem; color: var(--tc); margin-left: 0.3rem; }
.tg-mclose {
  border: none; background: none; color: var(--vp-c-text-2, #b8c0d9);
  font-size: 1.05rem; cursor: pointer; padding: 0.3rem 0.55rem; border-radius: 8px;
}
.tg-mclose:hover { color: #ef4444; background: rgba(239, 68, 68, 0.1); }
.tg-mbody { padding: 0.9rem 1.3rem 1.3rem; }
.tg-saybox {
  padding: 0.7rem 0.9rem; border-radius: 10px; font-size: 0.88rem; line-height: 1.6;
  background: color-mix(in srgb, var(--tc) 9%, transparent);
  border-left: 3px solid var(--tc); color: var(--vp-c-text-1, #e6e9f5);
  margin-bottom: 0.8rem;
}
.tg-def { font-size: 0.9rem; line-height: 1.75; color: var(--vp-c-text-1, #e6e9f5); }
.tg-alias-row { display: flex; flex-wrap: wrap; align-items: center; gap: 0.4rem; margin: 0.7rem 0 0.2rem; }
.tg-alias-row i { font-style: normal; font-size: 0.76rem; color: var(--vp-c-text-3, #8b93b8); }
.tg-alias {
  font-size: 0.76rem; padding: 0.1rem 0.6rem; border-radius: 999px;
  border: 1px solid var(--vp-c-divider); color: var(--vp-c-text-2, #b8c0d9);
}
.tg-mbody h4 { margin: 1rem 0 0.4rem; font-size: 0.9rem; }

/* ===== 链接条（原文 + 联想共用） ===== */
.tg-link {
  display: block; width: 100%; text-align: left;
  padding: 0.5rem 0.8rem; margin: 0.3rem 0;
  font-size: 0.86rem; line-height: 1.55;
  color: var(--vp-c-text-1, #e6e9f5); text-decoration: none;
  border-radius: 10px; border: 1px solid transparent;
  background: none; cursor: pointer; font-family: inherit;
  transition: border-color 0.15s ease, background 0.15s ease;
}
.tg-link:hover { border-color: color-mix(in srgb, var(--tc) 45%, transparent); background: color-mix(in srgb, var(--tc) 6%, transparent); }
.tg-link .dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: var(--tc); margin-right: 0.5rem; vertical-align: 0.12em; }
.tg-link.rel { opacity: 0.92; }
.tg-link.rel.ext { opacity: 0.85; }
.tg-from { display: block; font-style: normal; font-size: 0.72rem; color: var(--tc); margin-top: 0.1rem; padding-left: 1.05rem; }
</style>
