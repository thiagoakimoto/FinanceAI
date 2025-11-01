import { useMemo } from 'react'
import { StatsCards } from '../components/StatsCards'
import { CategoryChart } from '../components/CategoryChart'
import { ExpenseChart } from '../components/ExpenseChart'
import { TransactionTable } from '../components/TransactionTable'
import { useTransactions, useMonthlyBalance } from '../hooks/useFinance'
import { CATEGORIES } from '../types'
import type { MonthlyStats, CategoryTotal } from '../types'
import { Loader2 } from 'lucide-react'

export function DashboardPage() {
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()
  
  const { data: transactions = [], isLoading: loadingTransactions } = useTransactions(currentMonth, currentYear)
  const { data: monthlyBalance, isLoading: loadingBalance } = useMonthlyBalance(currentMonth, currentYear)

  const stats: MonthlyStats = useMemo(() => {
    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0)
    const initialBalance = monthlyBalance?.initial_balance || 0
    const currentBalance = initialBalance - totalSpent
    const percentageSpent = initialBalance > 0 ? (totalSpent / initialBalance) * 100 : 0

    // Calcular gastos por categoria
    const categoryMap = new Map<string, number>()
    transactions.forEach(t => {
      const current = categoryMap.get(t.category) || 0
      categoryMap.set(t.category, current + t.amount)
    })

    const categoryTotals: CategoryTotal[] = Array.from(categoryMap.entries()).map(([category, total]) => ({
      category,
      total,
      percentage: totalSpent > 0 ? (total / totalSpent) * 100 : 0,
      color: CATEGORIES[category as keyof typeof CATEGORIES] || CATEGORIES['Outros'],
    }))

    // Gastos diários
    const dailyMap = new Map<string, number>()
    transactions.forEach(t => {
      const date = t.date.split('T')[0]
      const current = dailyMap.get(date) || 0
      dailyMap.set(date, current + t.amount)
    })

    const dailyExpenses = Array.from(dailyMap.entries())
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Projeção de saldo
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate()
    const currentDay = new Date().getDate()
    const avgDailySpending = totalSpent / currentDay
    const projectedTotalSpending = avgDailySpending * daysInMonth
    const projectedBalance = initialBalance - projectedTotalSpending

    return {
      currentBalance,
      totalSpent,
      percentageSpent,
      lastTransaction: transactions[0] || null,
      categoryTotals,
      dailyExpenses,
      projectedBalance,
    }
  }, [transactions, monthlyBalance, currentMonth, currentYear])

  if (loadingTransactions || loadingBalance) {
    return (
      <div className="dashboard-page">
        <div className="loading">
          <Loader2 className="spinner" size={48} />
          <p>Carregando seus dados financeiros...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="subtitle">Visão geral das suas finanças</p>
      </div>
      
      <StatsCards stats={stats} />

      <div className="charts-grid">
        <CategoryChart data={stats.categoryTotals} />
        <ExpenseChart data={stats.dailyExpenses} />
      </div>

      <TransactionTable transactions={transactions.slice(0, 5)} />
    </div>
  )
}
