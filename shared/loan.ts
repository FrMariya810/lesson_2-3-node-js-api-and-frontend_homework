export interface Loan {
  id: string
  borrower: string
  quantity: number
  status: 'active' | 'returned'
}
export interface LoanInput { borrower: string; quantity: number }
export interface Snapshot { stock: number; loans: Loan[] }

// Проверка файла готова. Она не заменяет проверку входящего HTTP-запроса.
export function isLoanArray(value: unknown): value is Loan[] {
  if (!Array.isArray(value)) return false
  return value.every(item => {
    if (typeof item !== 'object' || item === null) return false
    const row = item as Record<string, unknown>
    return typeof row.id === 'string' && row.id.length > 0
      && typeof row.borrower === 'string' && row.borrower.trim().length > 0
      && typeof row.quantity === 'number' && Number.isInteger(row.quantity)
      && row.quantity >= 1 && row.quantity <= 3
      && (row.status === 'active' || row.status === 'returned')
  })
}

