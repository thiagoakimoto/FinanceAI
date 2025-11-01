// Teste de conexão com Supabase
import { supabase } from '../lib/supabase'

export async function testSupabaseConnection() {
  console.log('🔍 Testando conexão com Supabase...')
  
  console.log('Variáveis de ambiente:')
  console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL)
  console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Definida' : 'Não definida')
  
  try {
    // Teste 1: Verificar se consegue fazer uma query simples
    const { data, error } = await supabase
      .from('finances')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Erro na query:', error)
      return { success: false, error }
    }
    
    console.log('✅ Conexão bem-sucedida!')
    console.log('Dados retornados:', data)
    return { success: true, data }
    
  } catch (err) {
    console.error('❌ Erro na conexão:', err)
    return { success: false, error: err }
  }
}

export async function testTablesExist() {
  console.log('🔍 Verificando se as tabelas existem...')
  
  try {
    // Testar tabela finances
    const { data: financesData, error: financesError } = await supabase
      .from('finances')
      .select('*')
      .limit(1)
    
    console.log('Tabela finances:', financesError ? '❌ Não existe' : '✅ Existe')
    if (financesError) console.log('Erro finances:', financesError)
    
    // Testar tabela monthly_balances
    const { data: balanceData, error: balanceError } = await supabase
      .from('monthly_balances')
      .select('*')
      .limit(1)
    
    console.log('Tabela monthly_balances:', balanceError ? '❌ Não existe' : '✅ Existe')
    if (balanceError) console.log('Erro monthly_balances:', balanceError)
    
    return {
      finances: { exists: !financesError, data: financesData, error: financesError },
      monthly_balances: { exists: !balanceError, data: balanceData, error: balanceError }
    }
    
  } catch (err) {
    console.error('❌ Erro geral ao verificar tabelas:', err)
    return { error: err }
  }
}