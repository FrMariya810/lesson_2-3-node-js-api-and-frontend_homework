import { createServer } from 'node:http'
import { HttpError, sendJson } from './http.ts'
import { route } from './routes.ts'

const server = createServer((req, res) => {
  void (async () => {
    try {
      const url = new URL(req.url ?? '/', 'http://127.0.0.1:3001')
      try { decodeURIComponent(url.pathname) }
      catch { throw new HttpError(400, 'BAD_URL', 'Некорректный URL.') }
      if (req.method === 'GET' && url.pathname === '/api/health') {
        sendJson(res, 200, { data: { ok: true, storage: 'file' } }); return
      }
      await route(req, res, url)
    } catch (error) {
      if (res.destroyed || res.writableEnded) return
      if (!(error instanceof HttpError)) console.error('Ошибка API:', error)
      sendJson(res, error instanceof HttpError ? error.status : 500, {
        error: {
          code: error instanceof HttpError ? error.code : 'INTERNAL',
          message: error instanceof HttpError ? error.message : 'Не удалось сохранить или прочитать данные. Проверьте терминал API.',
        },
      })
    }
  })()
})
server.requestTimeout = 15_000
server.on('error', error => { console.error('API не запущен:', error.message); process.exitCode = 1 })
server.listen(3001, '127.0.0.1', () => {
  console.log('API: http://127.0.0.1:3001 · файловое хранилище')
  console.log('После изменения server/ или shared/ перезапустите API.')
})

