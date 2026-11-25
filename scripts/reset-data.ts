import { mkdir, writeFile, rename, rm } from 'node:fs/promises'
import { createConnection } from 'node:net'
import { initialLoans } from '../server/seed.ts'
import { dataDir, dataFile, failFile } from '../server/paths.ts'

if (!process.argv.includes('--yes')) {
  console.error('Остановите API. Для замены учебных данных: npm run data:reset -- --yes')
  process.exit(1)
}
const running = await new Promise<boolean>(resolve => {
  const socket = createConnection({ host: '127.0.0.1', port: 3001 })
  socket.once('connect', () => { socket.destroy(); resolve(true) })
  socket.once('error', () => resolve(false))
  socket.setTimeout(1000, () => { socket.destroy(); resolve(true) })
})
if (running) { console.error('Порт 3001 занят. Остановите API до сброса.'); process.exit(1) }
await mkdir(dataDir, { recursive: true })
await writeFile(dataFile + '.tmp', JSON.stringify(initialLoans(), null, 2) + '\n')
await rename(dataFile + '.tmp', dataFile)
await rm(failFile, { force: true })
console.log('Сброс: Алина — 2 выдано, Борис — 1 возвращён. Всего микрофонов: 6.')

