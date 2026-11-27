import type { Loan, Snapshot } from '../shared/loan.ts'
import { STOCK } from './seed.ts'
import { store } from './store.ts'
import { HttpError } from './http.ts'
import { randomUUID } from 'node:crypto'

// Чтение уже работает. Параметры URL понадобятся только для бонуса Д1.
export async function listLoans(_url: URL): Promise<Snapshot> {
  return { stock: STOCK, loans: await store.list() }
}

// А1: проверка выдачи и доступного остатка.
// Сетевой ввод недоверенный; за изменение файла отвечает готовый store.edit.
export async function createLoan(_body: unknown): Promise<Loan> {
  if (typeof _body !== 'object' || _body === null || Array.isArray(_body)) {
    throw new HttpError(400, 'INVALID_INPUT', 'Некорректные данные выдачи.')
  }

  const input = _body as Record<string, unknown>
  const borrower = input.borrower
  const quantity = input.quantity

  if (
    typeof borrower !== 'string' ||
    borrower.trim().length === 0 ||
    typeof quantity !== 'number' ||
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > 3
  ) {
    throw new HttpError(400, 'INVALID_INPUT', 'Проверьте имя и количество микрофонов.')
  }

  return store.edit(draft => {
    const issued = draft.reduce(
      (sum, loan) => loan.status === 'active' ? sum + loan.quantity : sum,
      0
    )

    const available = STOCK - issued

    if (quantity > available) {
      throw new HttpError(409, 'NOT_ENOUGH_STOCK', 'Недостаточно микрофонов в наличии.')
    }

    const loan: Loan = {
      id: randomUUID(),
      borrower: borrower.trim(),
      quantity,
      status: 'active'
    }

    draft.push(loan)

    return loan
  })
}

// А2: возврат оборудования и повторный запрос.
export async function returnLoan(_id: string, _body: unknown): Promise<Loan> {
  if (typeof _body !== 'object' || _body === null || Array.isArray(_body)) {
    throw new HttpError(400, 'INVALID_RETURN', 'Некорректные данные возврата.')
  }

  const input = _body as Record<string, unknown>

  if (input.status !== 'returned') {
    throw new HttpError(400, 'INVALID_RETURN', 'Статус возврата должен быть returned.')
  }

  return store.edit(draft => {
    const loan = draft.find(item => item.id === _id)

    if (!loan) {
      throw new HttpError(404, 'NOT_FOUND', 'Выдача не найдена.')
    }

    if (loan.status === 'active') {
      loan.status = 'returned'
    }

    return loan
  })
}

