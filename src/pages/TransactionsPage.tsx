import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { useTransactions } from '../hooks/useFinance'
import { formatCurrency, formatDate } from '../lib/utils'
import { CATEGORIES, type CategoryName } from '../types'

export function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas')
  
  const { data: transactions = [], isLoading } = useTransactions()
  
  // Filtra transações
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch = searchTerm === '' || 
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'Todas' || t.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [transactions, searchTerm, selectedCategory])
  
  // Calcula totais por categoria
  const categoryTotals = useMemo(() => {
    const totals = new Map<CategoryName, number>()
    transactions.forEach((t) => {
      const current = totals.get(t.category as CategoryName) || 0
      totals.set(t.category as CategoryName, current + t.amount)
    })
    
    const totalSpent = Array.from(totals.values()).reduce((sum, val) => sum + val, 0)
    
    return Object.keys(CATEGORIES).map((cat) => ({
      category: cat as CategoryName,
      amount: totals.get(cat as CategoryName) || 0,
      percentage: totalSpent > 0 ? ((totals.get(cat as CategoryName) || 0) / totalSpent) * 100 : 0,
    }))
  }, [transactions])
  
  if (isLoading) {
    return <div className="loading">Carregando...</div>
  }
  
  return (
    <div className="transactions-page">
      <div className="page-header">
        <h1>Transações</h1>
        <p className="subtitle">Visualize todos os seus gastos</p>
      </div>
      
      <div className="transactions-filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar transação..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select
          className="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option>Todas</option>
          {Object.keys(CATEGORIES).map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>
      
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
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{formatDate(transaction.date)}</td>
                <td>
                  <span 
                    className="category-tag" 
                    style={{ 
                      backgroundColor: CATEGORIES[transaction.category as CategoryName] + '20',
                      color: CATEGORIES[transaction.category as CategoryName]
                    }}
                  >
                    {transaction.category}
                  </span>
                </td>
                <td className="amount-cell">
                  {formatCurrency(transaction.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredTransactions.length === 0 && (
          <div className="empty-state">
            <p>Nenhuma transação encontrada</p>
          </div>
        )}
      </div>
      
      <div className="category-summary">
        <h2>Gastos por Categoria</h2>
        <div className="category-cards">
          {categoryTotals.map(({ category, amount, percentage }) => (
            <div key={category} className="category-card">
              <div 
                className="category-indicator" 
                style={{ backgroundColor: CATEGORIES[category] }}
              />
              <div className="category-info">
                <h3>{category}</h3>
                <p className="category-amount">{formatCurrency(amount)}</p>
                <p className="category-percentage">{percentage.toFixed(0)}% do orçamento</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
