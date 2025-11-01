export interface Transaction {
  id: number
  date: string
  category: string
  amount: number
  created_at: string
  month: string  // Campo adicional que existe na sua tabela
}

export interface MonthlyBalance {
  id: number
  month: string  // TEXT na sua tabela
  year: number   // INTEGER na sua tabela  
  initial_balance: number
  created_at: string
}

export interface CategoryTotal {
  category: string
  total: number
  percentage: number
  color: string
}

export interface MonthlyStats {
  currentBalance: number
  totalSpent: number
  percentageSpent: number
  lastTransaction: Transaction | null
  categoryTotals: CategoryTotal[]
  dailyExpenses: { date: string; amount: number }[]
  projectedBalance: number
}

export const CATEGORIES = {
  'Alimentação': '#6366f1',
  'Transporte': '#8b5cf6',
  'Lazer': '#ec4899',
  'Contas Fixas': '#06b6d4',
  'Outros': '#10b981',
} as const

export type CategoryName = keyof typeof CATEGORIES
