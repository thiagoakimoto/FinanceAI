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
  
  console.log('🗓️ Dashboard - Mês/Ano atual:', { currentMonth, currentYear })
  
  const { data: transactions = [], isLoading: loadingTransactions } = useTransactions(currentMonth, currentYear)
  const { data: monthlyBalance, isLoading: loadingBalance } = useMonthlyBalance(currentMonth, currentYear)

  const stats: MonthlyStats = useMemo(() => {
    // Definir categorias de ENTRADA vs SAÍDA
    const INCOME_CATEGORIES = ['Salário', 'Freelance', 'Investimentos', 'Renda Extra', 'Vendas']
    const EXPENSE_CATEGORIES = ['Alimentação', 'Transporte', 'Lazer', 'Contas Fixas', 'Locomoção', 'Outros']
    
    // Separar por categoria OU por valor (positivo/negativo)
    const incomes = transactions.filter(t => {
      // Se valor é negativo, não é entrada
      if (t.amount < 0) return false
      // Se categoria está na lista de entradas, é entrada
      if (INCOME_CATEGORIES.includes(t.category)) return true
      // Se valor é positivo mas categoria é de gasto, considerar como gasto
      return false
    })
    
    const expenses = transactions.filter(t => {
      // Se valor é negativo, é saída
      if (t.amount < 0) return true
      // Se categoria está na lista de gastos, é saída
      if (EXPENSE_CATEGORIES.includes(t.category)) return true
      // Se não está nas categorias de entrada, considerar como gasto
      return !INCOME_CATEGORIES.includes(t.category)
    })
    
    const totalIncomes = incomes.reduce((sum, t) => sum + Math.abs(t.amount), 0)
    const totalExpenses = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0)
    const totalSpent = totalExpenses // Para compatibilidade
    
    const initialBalance = monthlyBalance?.initial_balance || 0
    const currentBalance = initialBalance + totalIncomes - totalExpenses
    const percentageSpent = initialBalance > 0 ? (totalExpenses / initialBalance) * 100 : 0

    console.log('💰 Dados financeiros:', {
      totalIncomes,
      totalExpenses,
      currentBalance,
      transações: transactions.length,
      incomes: incomes.length,
      expenses: expenses.length,
      incomesData: incomes,
      expensesData: expenses
    })

    // Calcular gastos por categoria (apenas saídas)
    const categoryMap = new Map<string, number>()
    expenses.forEach(t => {
      const current = categoryMap.get(t.category) || 0
      categoryMap.set(t.category, current + Math.abs(t.amount))
    })

    let categoryTotals: CategoryTotal[] = Array.from(categoryMap.entries()).map(([category, total]) => ({
      category,
      total,
      percentage: totalExpenses > 0 ? (total / totalExpenses) * 100 : 0,
      color: CATEGORIES[category as keyof typeof CATEGORIES] || CATEGORIES['Outros'],
    }))

    // 🧪 DADOS DE TESTE - Se não há dados reais, usar mock
    if (categoryTotals.length === 0) {
      console.log('🧪 Usando dados mock para gráficos')
      categoryTotals = [
        { category: 'Alimentação', total: 500, percentage: 40, color: '#6366f1' },
        { category: 'Transporte', total: 300, percentage: 24, color: '#8b5cf6' },
        { category: 'Lazer', total: 250, percentage: 20, color: '#ec4899' },
        { category: 'Contas Fixas', total: 200, percentage: 16, color: '#06b6d4' },
      ]
    }

    console.log('📊 CategoryTotals:', categoryTotals)

    // Gastos diários (apenas saídas)
    const dailyMap = new Map<string, number>()
    expenses.forEach(t => {
      const date = t.date.split('T')[0]
      const current = dailyMap.get(date) || 0
      dailyMap.set(date, current + Math.abs(t.amount))
    })

    let dailyExpenses = Array.from(dailyMap.entries())
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // 🧪 DADOS DE TESTE - Se não há dados reais, usar mock
    if (dailyExpenses.length === 0) {
      console.log('🧪 Usando dados mock para gastos diários')
      const today = new Date()
      dailyExpenses = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today)
        date.setDate(today.getDate() - (6 - i))
        return {
          date: date.toISOString().split('T')[0],
          amount: Math.floor(Math.random() * 200) + 50
        }
      })
    }

    console.log('📈 DailyExpenses:', dailyExpenses)

    // Projeção de saldo
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate()
    const currentDay = new Date().getDate()
    const avgDailySpending = totalSpent / currentDay
    const projectedTotalSpending = avgDailySpending * daysInMonth
    const projectedBalance = initialBalance - projectedTotalSpending

    return {
      currentBalance,
      totalSpent,
      totalIncomes,     // ✅ Adicionando entradas
      totalExpenses,    // ✅ Adicionando saídas  
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
