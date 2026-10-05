// 构建后处理：把内容目录里的自包含 .html 资料页（如 泛AI就业作战地图.html）拷进 dist。
// VitePress 只原样拷贝 public/，源码树中的 .html 不会出现在产物里，必须在 build 后补拷。
// 由 package.json 的 build 脚本在 `vitepress build` 之后调用。
import { copyFileSync, mkdirSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = join(root, '.vitepress', 'dist')
const SKIP = new Set(['.git', '.github', 'node_modules', '.vitepress', 'public', 'scripts'])

const files = []
function walk(dir) {
  let entries
  try {
    entries = readdirSync(dir, { withFileTypes: true })
  } catch { return }
  for (const e of entries) {
    if (e.name.startsWith('.') || SKIP.has(e.name)) continue
    const p = join(dir, e.name)
    if (e.isDirectory()) walk(p)
    else if (e.name.endsWith('.html')) files.push(p)
  }
}
walk(root)

for (const f of files) {
  const dest = join(dist, f.slice(root.length))
  mkdirSync(dirname(dest), { recursive: true })
  copyFileSync(f, dest)
}
console.log(`已拷贝自包含 HTML 资料页: ${files.length} 个`)
