import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Transaction, MonthlyBalance } from '../types'

// Mapeamento dos meses em português (lowercase) para armazenar/comparar com a coluna text
const MONTH_NAMES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
]

// Hook para buscar transações
export function useTransactions(month?: number, year?: number) {
  const currentMonth = month || new Date().getMonth() + 1
  const currentYear = year || new Date().getFullYear()
  
  return useQuery({
    queryKey: ['transactions', currentMonth, currentYear],
    queryFn: async () => {
      try {
        console.log('🔍 Buscando transações para:', { currentMonth, currentYear })
        
        // A coluna `month` na base é TEXT (ex: 'novembro'). Convertemos o número do mês
        // para o nome em português e buscamos diretamente por esse nome.
        const monthName = MONTH_NAMES[currentMonth - 1] || String(currentMonth)

        console.log('🔍 Buscando por month:', monthName)

        const { data, error } = await supabase
          .from('finances')
          .select('*')
          .ilike('month', monthName)
          .order('date', { ascending: false })
        
        if (error) {
          console.error('❌ Erro ao buscar transações:', error)
          console.log('🔄 Retornando lista vazia devido ao erro...')
          return [] as Transaction[]
        }
        
        console.log('✅ Transações encontradas:', data?.length || 0)
        console.log('📊 Estrutura da primeira transação:', data?.[0])
        
        // Filtrar por mês/ano no frontend se necessário (garantir que a data bate com o ano/mês)
        const filtered = data?.filter(t => {
          const transactionDate = new Date(t.date)
          return transactionDate.getMonth() + 1 === currentMonth &&
                 transactionDate.getFullYear() === currentYear
        }) || []
        
  console.log('📈 Transações filtradas:', filtered.length)
  return (filtered as Transaction[]) || []
      } catch (error) {
        console.error('💥 Erro no useTransactions:', error)
        return [] as Transaction[]
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
        
        // Buscar saldo mensal (month é TEXT com nomes, year é INTEGER)
        const monthName = MONTH_NAMES[currentMonth - 1] || String(currentMonth)

        console.log('🔍 Buscando saldo para month:', monthName, 'year:', currentYear)

        const { data, error } = await supabase
          .from('monthly_balances')
          .select('*')
          .ilike('month', monthName)
          .eq('year', currentYear)
        
        if (error) {
          console.error('❌ Erro ao buscar saldo mensal:', error)
          console.log('🔄 Retornando undefined devido ao erro...')
          return undefined
        }
        
        console.log('✅ Saldos encontrados:', data?.length || 0)
        console.log('📊 Dados dos saldos:', data)
        
        if (data && data.length > 0) {
          console.log('🎯 Saldo encontrado para o mês:', data[0])
          return data[0] as MonthlyBalance
        } else {
          console.log('⚠️ Saldo não encontrado para', { currentMonth, currentYear })
          console.log('📝 Retornando undefined (nenhum saldo encontrado)')
          return undefined
        }
      } catch (error) {
        console.error('💥 Erro no useMonthlyBalance:', error)
        return undefined
      }
    },
    refetchInterval: 30000,
  })
}

// Nota: Removidos dados fictícios. Agora retornamos somente os dados vindos do Supabase.
