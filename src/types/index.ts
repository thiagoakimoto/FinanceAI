export interface Transaction {
  id: number
  date: string
  category: string
  amount: number
  type: 'gasto' | 'saldo'
  created_at?: string
}

export interface MonthlyBalance {
  id: number
  month: number
  year: number
  initial_balance: number
  created_at?: string
}

export interface DashboardStats {
  currentBalance: number
  monthlySpending: number
  spendingPercentage: number
  dailyAverage: number
  balanceChange: number
  largestExpense: {
    amount: number
    category: string
  }
}

export interface CategorySpending {
  category: string
  total: number
  percentage: number
}

export interface DailySpending {
  date: string
  amount: number
}
