import { formatCurrency, formatDate } from '../lib/utils'
import type { Transaction } from '../types'

interface TransactionTableProps {
  transactions: Transaction[]
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <div className="transactions-table-wrapper">
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Categoria</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{formatDate(transaction.date)}</td>
                <td>
                  <span className="category-tag" style={{ 
                    backgroundColor: '#6366f1' + '20',
                    color: '#6366f1'
                  }}>
                    {transaction.category}
                  </span>
                </td>
                <td className="amount-cell">
                  {formatCurrency(transaction.amount)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="empty-state">
                Nenhuma transação encontrada
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}