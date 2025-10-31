import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Transaction, DashboardStats, CategorySpending, DailySpending } from '@/types'

export const useFinances = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('finances')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error
      setTransactions(data || [])
      calculateStats(data || [])
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (data: Transaction[]) => {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    // Filtra transações do mês atual
    const currentMonthTransactions = data.filter(t => {
      const date = new Date(t.date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })

    // Calcula gastos do mês
    const monthlySpending = currentMonthTransactions
      .filter(t => t.type === 'gasto')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    // Calcula saldo atual (entradas - saídas)
    const totalIncome = currentMonthTransactions
      .filter(t => t.type === 'saldo')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const currentBalance = totalIncome - monthlySpending

    // Calcula percentual gasto
    const spendingPercentage = totalIncome > 0 ? (monthlySpending / totalIncome) * 100 : 0

    // Calcula média diária
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const dailyAverage = monthlySpending / daysInMonth

    // Calcula mudança em relação ao mês anterior
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

    const lastMonthTransactions = data.filter(t => {
      const date = new Date(t.date)
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
    })

    const lastMonthSpending = lastMonthTransactions
      .filter(t => t.type === 'gasto')
      .reduce((sum, t) => sum + Number(t.amount), 0)

    const balanceChange = lastMonthSpending > 0
      ? ((monthlySpending - lastMonthSpending) / lastMonthSpending) * 100
      : 0

    // Encontra maior gasto
    const expenses = currentMonthTransactions.filter(t => t.type === 'gasto')
    const largestExpense = expenses.length > 0
      ? expenses.reduce((max, t) => Number(t.amount) > Number(max.amount) ? t : max)
      : null

    setStats({
      currentBalance,
      monthlySpending,
      spendingPercentage,
      dailyAverage,
      balanceChange,
      largestExpense: largestExpense ? {
        amount: Number(largestExpense.amount),
        category: largestExpense.category
      } : {
        amount: 0,
        category: 'N/A'
      }
    })
  }

  const getCategorySpending = (): CategorySpending[] => {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    const currentMonthExpenses = transactions.filter(t => {
      const date = new Date(t.date)
      return date.getMonth() === currentMonth && 
             date.getFullYear() === currentYear && 
             t.type === 'gasto'
    })

    const categoryTotals = currentMonthExpenses.reduce((acc, t) => {
      const category = t.category
      acc[category] = (acc[category] || 0) + Number(t.amount)
      return acc
    }, {} as Record<string, number>)

    const total = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0)

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      total: amount,
      percentage: total > 0 ? (amount / total) * 100 : 0
    })).sort((a, b) => b.total - a.total)
  }

  const getDailySpending = (): DailySpending[] => {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    const currentMonthExpenses = transactions.filter(t => {
      const date = new Date(t.date)
      return date.getMonth() === currentMonth && 
             date.getFullYear() === currentYear && 
             t.type === 'gasto'
    })

    const dailyTotals = currentMonthExpenses.reduce((acc, t) => {
      const date = t.date
      acc[date] = (acc[date] || 0) + Number(t.amount)
      return acc
    }, {} as Record<string, number>)

    return Object.entries(dailyTotals)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('finances')
        .insert([transaction])
        .select()

      if (error) throw error
      
      await fetchTransactions()
      return { success: true, data }
    } catch (error) {
      console.error('Error adding transaction:', error)
      return { success: false, error }
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  return {
    transactions,
    stats,
    loading,
    getCategorySpending,
    getDailySpending,
    addTransaction,
    refetch: fetchTransactions
  }
}
