<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

// 深色星空背景：三层视差星星 + 缓慢闪烁，canvas 绘制，fixed 铺满视口
const canvasRef = ref(null)
let rafId = 0
let onResize = null

function starColor(r, g, b, alpha) {
  return `rgba(${r},${g},${b},${alpha})`
}

onMounted(() => {
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')

  // prefers-reduced-motion 或浅色模式：只画静态星空，不做动画
  let stars = []
  let shooting = []
  let w = 0
  let h = 0
  let dpr = 1

  function buildStars() {
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = window.innerWidth
    h = window.innerHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const count = Math.floor((w * h) / 3200)
    stars = Array.from({ length: count }, () => {
      const tint = Math.random()
      // 三种色温：冷蓝 / 纯白 / 暖金
      const rgb = tint < 0.45 ? [148, 180, 255] : tint < 0.85 ? [235, 238, 255] : [255, 221, 170]
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.3,
        depth: Math.random() * 0.8 + 0.2, // 视差层
        rgb,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.015 + 0.004
      }
    })
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h)
    // 星云薄雾：两团径向渐变，极低透明度
    const nebula = ctx.createRadialGradient(w * 0.78, h * 0.22, 0, w * 0.78, h * 0.22, Math.max(w, h) * 0.5)
    nebula.addColorStop(0, 'rgba(124, 58, 237, 0.10)')
    nebula.addColorStop(1, 'rgba(124, 58, 237, 0)')
    ctx.fillStyle = nebula
    ctx.fillRect(0, 0, w, h)
    const nebula2 = ctx.createRadialGradient(w * 0.15, h * 0.75, 0, w * 0.15, h * 0.75, Math.max(w, h) * 0.45)
    nebula2.addColorStop(0, 'rgba(6, 182, 212, 0.07)')
    nebula2.addColorStop(1, 'rgba(6, 182, 212, 0)')
    ctx.fillStyle = nebula2
    ctx.fillRect(0, 0, w, h)

    for (const s of stars) {
      const twinkle = 0.55 + 0.45 * Math.sin(t * s.speed + s.phase)
      const alpha = (0.35 + 0.65 * s.depth) * twinkle
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
      ctx.fillStyle = starColor(s.rgb[0], s.rgb[1], s.rgb[2], alpha)
      ctx.fill()
    }

    // 偶发流星：低概率生成
    if (Math.random() < 0.006 && shooting.length < 2) {
      shooting.push({
        x: Math.random() * w * 0.7 + w * 0.3,
        y: Math.random() * h * 0.3,
        vx: -(Math.random() * 4 + 5),
        vy: Math.random() * 2 + 2.5,
        life: 1
      })
    }
    shooting = shooting.filter(m => m.life > 0)
    for (const m of shooting) {
      const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 9, m.y - m.vy * 9)
      grad.addColorStop(0, `rgba(255,255,255,${0.85 * m.life})`)
      grad.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.strokeStyle = grad
      ctx.lineWidth = 1.4
      ctx.beginPath()
      ctx.moveTo(m.x, m.y)
      ctx.lineTo(m.x - m.vx * 9, m.y - m.vy * 9)
      ctx.stroke()
      m.x += m.vx
      m.y += m.vy
      m.life -= 0.018
    }

    rafId = requestAnimationFrame(draw)
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  buildStars()
  if (reduceMotion) {
    draw(0)
    cancelAnimationFrame(rafId)
  } else {
    rafId = requestAnimationFrame(draw)
  }

  onResize = () => {
    buildStars()
    if (reduceMotion) {
      draw(0)
      cancelAnimationFrame(rafId)
    }
  }
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  if (onResize) window.removeEventListener('resize', onResize)
})
</script>

<template>
  <div class="starfield" aria-hidden="true">
    <canvas ref="canvasRef" class="stars" />
    <div class="veil" />
  </div>
</template>

<style scoped>
.starfield {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 80% 50% at 50% -10%, rgba(129, 140, 248, 0.32), transparent 70%),
    linear-gradient(180deg, #101431 0%, #161a3d 55%, #1b2050 100%);
}
.stars {
  position: absolute;
  inset: 0;
}
.veil {
  /* 底部渐隐，避免与内容边缘生硬相接 */
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 60%, rgba(5, 6, 15, 0.55) 100%);
}
</style>
