import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Transaction, MonthlyBalance } from '../types'

// Hook para buscar transações
export function useTransactions(month?: number, year?: number) {
  const currentMonth = month || new Date().getMonth() + 1
  const currentYear = year || new Date().getFullYear()
  
  return useQuery({
    queryKey: ['transactions', currentMonth, currentYear],
    queryFn: async () => {
      try {
        console.log('🔍 Buscando transações para:', { currentMonth, currentYear })
        
        // Vamos buscar TODAS as transações primeiro para ver a estrutura
        const { data, error } = await supabase
          .from('finances')
          .select('*')
          .order('date', { ascending: false })
          .limit(50)
        
        if (error) {
          console.error('❌ Erro ao buscar transações:', error)
          console.log('🔄 Usando dados de exemplo...')
          return mockTransactions
        }
        
        console.log('✅ Transações encontradas:', data?.length || 0)
        console.log('📊 Estrutura da primeira transação:', data?.[0])
        
        // Filtrar por mês/ano no frontend se necessário
        const filtered = data?.filter(t => {
          const transactionDate = new Date(t.date)
          return transactionDate.getMonth() + 1 === currentMonth && 
                 transactionDate.getFullYear() === currentYear
        }) || []
        
        console.log('📈 Transações filtradas:', filtered.length)
        return (filtered as Transaction[]) || mockTransactions
      } catch (error) {
        console.error('💥 Erro no useTransactions:', error)
        return mockTransactions
      }
    },
    refetchInterval: 30000,
  })
}

// Hook para buscar saldo mensal
export function useMonthlyBalance(month?: number, year?: number) {
  const currentMonth = month || new Date().getMonth() + 1
  const currentYear = year || new Date().getFullYear()
  
  return useQuery({
    queryKey: ['monthly-balance', currentMonth, currentYear],
    queryFn: async () => {
      try {
        console.log('🔍 Buscando saldo mensal para:', { currentMonth, currentYear })
        
        // Como month é TEXT e year é INTEGER na sua tabela
        const monthStr = String(currentMonth).padStart(2, '0')
        
        const { data, error } = await supabase
          .from('monthly_balances')
          .select('*')
          .eq('month', monthStr)
          .eq('year', currentYear)  // year é INTEGER, não precisa converter
        
        if (error) {
          console.error('❌ Erro ao buscar saldo mensal:', error)
          console.log('🔄 Usando saldo de exemplo...')
          return mockMonthlyBalance
        }
        
        console.log('✅ Saldos encontrados:', data?.length || 0)
        console.log('📊 Dados dos saldos:', data)
        
        if (data && data.length > 0) {
          console.log('🎯 Saldo encontrado para o mês:', data[0])
          return data[0] as MonthlyBalance
        } else {
          console.log('⚠️ Saldo não encontrado para', { currentMonth, currentYear })
          console.log('📝 Criando saldo de exemplo...')
          return mockMonthlyBalance
        }
      } catch (error) {
        console.error('💥 Erro no useMonthlyBalance:', error)
        return mockMonthlyBalance
      }
    },
    refetchInterval: 30000,
  })
}

// Dados de exemplo para quando o Supabase não estiver configurado
const mockTransactions: Transaction[] = [
  {
    id: 1,
    date: '2025-11-01T10:00:00Z',
    category: 'Alimentação',
    amount: 150.00,
    created_at: '2025-11-01T10:00:00Z',
    month: '11'
  },
  {
    id: 2,
    date: '2025-11-02T14:30:00Z',
    category: 'Transporte',
    amount: 45.00,
    created_at: '2025-11-02T14:30:00Z',
    month: '11'
  },
  {
    id: 3,
    date: '2025-11-03T19:15:00Z',
    category: 'Alimentação',
    amount: 80.00,
    created_at: '2025-11-03T19:15:00Z',
    month: '11'
  },
  {
    id: 4,
    date: '2025-11-04T20:45:00Z',
    category: 'Lazer',
    amount: 200.00,
    created_at: '2025-11-04T20:45:00Z',
    month: '11'
  },
  {
    id: 5,
    date: '2025-11-05T09:00:00Z',
    category: 'Contas Fixas',
    amount: 300.00,
    created_at: '2025-11-05T09:00:00Z',
    month: '11'
  }
]

const mockMonthlyBalance: MonthlyBalance = {
  id: 1,
  month: '11',
  year: 2025,  // INTEGER, não string
  initial_balance: 5000.00,
  created_at: '2025-11-01T00:00:00Z'
}
