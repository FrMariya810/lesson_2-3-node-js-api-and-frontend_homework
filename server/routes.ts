import type { IncomingMessage, ServerResponse } from 'node:http'
import { HttpError, readJson, sendJson } from './http.ts'
import { listLoans, createLoan, returnLoan } from './loans.ts'

// Готовое сопоставление URL и HTTP-метода с операцией предметной области.
export async function route(req: IncomingMessage, res: ServerResponse, url: URL) {
  if (url.pathname === '/api/loans') {
    if (req.method === 'GET') {
      sendJson(res, 200, { data: await listLoans(url) }); return
    }
    if (req.method === 'POST') {
      sendJson(res, 201, { data: await createLoan(await readJson(req)) }); return
    }
    res.setHeader('Allow', 'GET, POST')
    throw new HttpError(405, 'METHOD', 'Для журнала доступны GET и POST.')
  }
  const match = /^\/api\/loans\/([^/]+)$/.exec(url.pathname)
  if (match) {
    if (req.method !== 'PATCH') {
      res.setHeader('Allow', 'PATCH')
      throw new HttpError(405, 'METHOD', 'Для возврата нужен PATCH.')
    }
    sendJson(res, 200, { data: await returnLoan(decodeURIComponent(match[1]), await readJson(req)) })
    return
  }
  throw new HttpError(404, 'NOT_FOUND', 'Маршрут не найден.')
}

