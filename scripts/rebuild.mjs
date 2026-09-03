// 一键发布流程：停掉旧预览（释放 4173 端口）→ 重新构建 → 前台启动预览
// 用法：npm run rebuild（预览在前台运行，按 Ctrl+C 停止）
import { execSync } from 'node:child_process'

function killOldPreview() {
  try {
    const out = execSync('netstat -ano', { encoding: 'utf8' })
    const pids = new Set(
      out
        .split('\n')
        .filter(l => l.includes(':4173') && l.includes('LISTENING'))
        .map(l => l.trim().split(/\s+/).pop())
        .filter(p => p && p !== '0')
    )
    for (const pid of pids) {
      try {
        execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' })
        console.log('已停止旧预览进程 (PID ' + pid + ')')
      } catch { /* 可能已被其他方式结束 */ }
    }
  } catch { /* 端口本来就空着 */ }
}

killOldPreview()
console.log('构建中…')
execSync('npx vitepress build', { stdio: 'inherit' })
console.log('✅ 构建完成，启动预览（按 Ctrl+C 停止）：http://localhost:4173\n')
execSync('npx vitepress preview --port 4173 --strictPort', { stdio: 'inherit' })
