import type { Loan, Snapshot } from '../shared/loan.ts'
import { STOCK } from './seed.ts'
import { store } from './store.ts'
import { HttpError } from './http.ts'

// Чтение уже работает. Параметры URL понадобятся только для бонуса Д1.
export async function listLoans(_url: URL): Promise<Snapshot> {
  return { stock: STOCK, loans: await store.list() }
}

// А1: проверка выдачи и доступного остатка.
// Сетевой ввод недоверенный; за изменение файла отвечает готовый store.edit.
export async function createLoan(_body: unknown): Promise<Loan> {
  throw new HttpError(501, 'NOT_IMPLEMENTED', 'Выдача пока не реализована.')
}

// А2: возврат оборудования и повторный запрос.
export async function returnLoan(_id: string, _body: unknown): Promise<Loan> {
  throw new HttpError(501, 'NOT_IMPLEMENTED', 'Возврат пока не реализован.')
}

