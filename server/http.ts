import type { IncomingMessage, ServerResponse } from 'node:http'

export class HttpError extends Error {
  status: number
  code: string
  constructor(status: number, code: string, message: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

export function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  res.end(JSON.stringify(body))
}

// Готовая обвязка: тело запроса приходит частями; здесь собираем не более 16 КиБ.
// Маршрут получает разобранное значение unknown.
export async function readJson(req: IncomingMessage): Promise<unknown> {
  const mediaType = req.headers['content-type']?.split(';')[0].trim().toLowerCase()
  if (mediaType !== 'application/json') {
    req.resume()
    throw new HttpError(415, 'CONTENT_TYPE', 'Отправьте Content-Type: application/json.')
  }
  const text = await new Promise<string>((resolve, reject) => {
    let size = 0
    const chunks: Buffer[] = []
    const cleanup = () => {
      req.off('data', onData); req.off('end', onEnd)
      req.off('error', onError); req.off('aborted', onAborted)
    }
    const onError = (error: Error) => { cleanup(); reject(error) }
    const onAborted = () => onError(new HttpError(400, 'ABORTED', 'Запрос прерван.'))
    const onData = (chunk: Buffer) => {
      size += chunk.length
      if (size > 16 * 1024) {
        cleanup()
        req.resume()
        reject(new HttpError(413, 'BODY_LIMIT', 'Тело запроса больше 16 КиБ.'))
      } else chunks.push(chunk)
    }
    const onEnd = () => { cleanup(); resolve(Buffer.concat(chunks).toString('utf8')) }
    req.on('data', onData); req.on('end', onEnd)
    req.on('error', onError); req.on('aborted', onAborted)
  })
  try { return JSON.parse(text) as unknown }
  catch { throw new HttpError(400, 'BAD_JSON', 'Тело запроса должно быть корректным JSON.') }
}
