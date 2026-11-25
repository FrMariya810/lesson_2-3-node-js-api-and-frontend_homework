import { readFile, writeFile, rename, rm, unlink } from 'node:fs/promises'
import type { Loan } from '../shared/loan.ts'
import { isLoanArray } from '../shared/loan.ts'
import { dataFile, failFile } from './paths.ts'

// Готовая инфраструктура: операции одного процесса выполняются последовательно.
let tail: Promise<unknown> = Promise.resolve()
function serial<T>(action: () => Promise<T>): Promise<T> {
  const next = tail.then(action)
  tail = next.catch(() => undefined)
  return next
}
async function read(): Promise<Loan[]> {
  const value: unknown = JSON.parse(await readFile(dataFile, 'utf8'))
  if (!isLoanArray(value)) throw new Error('Некорректный файл выдач. Используйте явный сброс учебных данных.')
  return value
}
async function write(rows: Loan[]): Promise<void> {
  if (!isLoanArray(rows)) throw new Error('Попытка сохранить неверные данные.')
  // Управляемый сбой возникает до изменения файла и расходуется одной записью.
  try {
    await unlink(failFile)
    throw new Error('Учебный отказ записи.')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
  }
  const temporary = dataFile + '.tmp'
  try {
    await writeFile(temporary, JSON.stringify(rows, null, 2) + '\n', 'utf8')
    await rename(temporary, dataFile)
  } finally { await rm(temporary, { force: true }) }
}

export const store = {
  list: (): Promise<Loan[]> => serial(read),
  // Контракт: change получает свежий массив; его изменения сохраняются до
  // разрешения Promise. Возврат из change — результат edit, не замена массива.
  // Исключение отменяет запись. Внутри change не вызывайте store.list или edit.
  edit: <T>(change: (draft: Loan[]) => T | Promise<T>): Promise<T> => serial(async () => {
    const draft = await read()
    const before = JSON.stringify(draft)
    const result = await change(draft)
    if (JSON.stringify(draft) !== before) await write(draft)
    return result
  }),
}

