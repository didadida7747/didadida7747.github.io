<script setup>
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import { dailyPick, todaySeed } from './knowledge.js'

// 每日知识点 + 每日挑战入口同框：知识点从全站文档抽取最小单元，附原文锚点链接
const today = new Date()
const seed = todaySeed()
const dateLabel = `${today.getFullYear()} 年 ${today.getMonth() + 1} 月 ${today.getDate()} 日`
const items = computed(() => dailyPick(seed, 10))
const expanded = ref(false)
</script>

<template>
  <section class="daily">
    <div class="head">
      <h3>🎲 每日知识点 · {{ dateLabel }}</h3>
      <span class="sub">每天从全站笔记抽 10 条最小知识点，当天固定 · 点击来源直达原文</span>
      <a class="quiz-entry" :href="withBase('/game')" @click.right.prevent>🌱 去做今日 8 题 →</a>
    </div>
    <ol class="list" :class="{ collapsed: !expanded }">
      <li v-for="(k, i) in items" :key="seed + i" class="item">
        <span class="idx">{{ i + 1 }}</span>
        <span class="text">{{ k.text }}</span>
        <a class="src" :href="withBase(k.link + (k.anchor || ''))" target="_blank">{{ k.from }} ↗</a>
      </li>
    </ol>
    <button class="toggle" @click="expanded = !expanded">{{ expanded ? '收起 ▲' : '展开全部 10 条 ▼' }}</button>
  </section>
</template>

<style scoped>
.daily {
  max-width: 900px;
  margin: 2.6rem auto 0;
  padding: 0 1.5rem 1rem;
}
.head {
  display: flex;
  align-items: baseline;
  gap: 0.9rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.head h3 {
  margin: 0;
  font-size: 1.05rem;
  color: var(--vp-c-text-1, #e6e9f5);
}
.sub {
  font-size: 0.8rem;
  color: var(--vp-c-text-3, #8b93b8);
}
.quiz-entry {
  margin-left: auto;
  font-size: 0.85rem;
  color: var(--vh-accent, #2f4fe0);
  text-decoration: none;
  border-bottom: 1px dashed var(--vh-accent-weak, rgba(47, 79, 224, 0.09));
}
.quiz-entry:hover { color: #c4b5fd; }

.list {
  margin: 0;
  padding: 1.1rem 1.3rem;
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.55rem 2rem;
  border-radius: 14px;
  border: 1px solid var(--vh-accent-weak, rgba(47, 79, 224, 0.09));
  background: var(--vp-c-bg);
  backdrop-filter: blur(8px);
}
@media (max-width: 768px) {
  .list { grid-template-columns: 1fr; }
}
.item {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  font-size: 0.88rem;
}
.idx {
  flex: none;
  width: 1.3rem;
  text-align: center;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--vh-accent, #2f4fe0);
  border: 1px solid var(--vh-accent-weak, rgba(47, 79, 224, 0.09));
  border-radius: 6px;
  padding: 0.05rem 0;
}
.text {
  flex: 1;
  color: var(--vp-c-text-2, #b8c0d9);
}
.src {
  flex: none;
  font-size: 0.75rem;
  color: var(--vh-accent, #2f4fe0);
  text-decoration: none;
  border-bottom: 1px dashed var(--vh-accent-weak, rgba(47, 79, 224, 0.09));
  white-space: nowrap;
}
.src:hover { color: #c4b5fd; }

.toggle {
  display: block;
  margin: 0.7rem auto 0;
  background: none;
  border: none;
  color: var(--vp-c-text-3, #8b93b8);
  font-size: 0.8rem;
  cursor: pointer;
}
.toggle:hover { color: var(--vh-accent, #2f4fe0); }
</style>
