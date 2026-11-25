import type { Loan } from '../shared/loan.ts'

// Один вид оборудования. Имена вымышлены.
export const STOCK = 6
export function initialLoans(): Loan[] {
  return [
    { id: 'l1', borrower: 'Алина', quantity: 2, status: 'active' },
    { id: 'l2', borrower: 'Борис', quantity: 1, status: 'returned' },
  ]
}

