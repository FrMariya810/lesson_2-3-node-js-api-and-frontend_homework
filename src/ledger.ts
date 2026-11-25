import type { Loan } from '../shared/loan.ts'

// Готовое отображение журнала. Действие передаётся наружу, HTTP здесь нет.
export function renderLedger(target: HTMLElement, rows: Loan[], busy: boolean, onReturn: (id: string) => void) {
  target.replaceChildren()
  for (const loan of rows) {
    const tr = document.createElement('tr')
    for (const value of [loan.borrower, String(loan.quantity), loan.status === 'active' ? 'На руках' : 'Возвращено']) {
      const td = document.createElement('td')
      td.textContent = value
      tr.append(td)
    }
    const action = document.createElement('td')
    const button = document.createElement('button')
    button.type = 'button'
    button.textContent = loan.status === 'active' ? 'Принять возврат' : 'Возвращено'
    button.disabled = busy || loan.status !== 'active'
    button.addEventListener('click', () => onReturn(loan.id))
    action.append(button); tr.append(action); target.append(tr)
  }
}

