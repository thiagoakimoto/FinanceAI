import { supabase } from './supabase'

export async function createTablesIfNotExist() {
  console.log('🔧 Verificando/criando tabelas no Supabase...')
  
  try {
    console.log('Executando teste de conexão básica...')
    
    // Testar conexão básica primeiro
    const { data: testData, error: testError } = await supabase
      .from('finances')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.log('❌ Erro ao acessar tabela finances:', testError.message)
      console.log('Código do erro:', testError.code)
      
      if (testError.code === '42P01') {
        console.log('🔍 Tabela finances não existe!')
      }
    } else {
      console.log('✅ Tabela finances acessível:', testData)
    }
    
    // Testar tabela monthly_balances
    const { data: balanceTestData, error: balanceTestError } = await supabase
      .from('monthly_balances')
      .select('count')
      .limit(1)
    
    if (balanceTestError) {
      console.log('❌ Erro ao acessar tabela monthly_balances:', balanceTestError.message)
      console.log('Código do erro:', balanceTestError.code)
      
      if (balanceTestError.code === '42P01') {
        console.log('🔍 Tabela monthly_balances não existe!')
      }
    } else {
      console.log('✅ Tabela monthly_balances acessível:', balanceTestData)
    }
    
    console.log('✅ Processo de verificação concluído')
    return { 
      success: true, 
      financesExists: !testError,
      monthlyBalancesExists: !balanceTestError 
    }
    
  } catch (error) {
    console.error('❌ Erro geral na verificação:', error)
    return { success: false, error }
  }
}

export async function insertSampleData() {
  console.log('📊 Inserindo dados de exemplo...')
  
  try {
    // Inserir saldo mensal
    const { data: balanceData, error: balanceError } = await supabase
      .from('monthly_balances')
      .upsert({
        month: 11,
        year: 2025,
        initial_balance: 5000.00
      })
    
    if (balanceError) {
      console.error('Erro ao inserir saldo mensal:', balanceError)
    } else {
      console.log('✅ Saldo mensal inserido:', balanceData)
    }
    
    // Inserir transações
    const sampleTransactions = [
      { date: '2025-11-01', category: 'Alimentação', amount: 150.00, type: 'gasto' },
      { date: '2025-11-02', category: 'Transporte', amount: 45.00, type: 'gasto' },
      { date: '2025-11-03', category: 'Alimentação', amount: 80.00, type: 'gasto' },
      { date: '2025-11-04', category: 'Lazer', amount: 200.00, type: 'gasto' },
      { date: '2025-11-05', category: 'Contas Fixas', amount: 300.00, type: 'gasto' },
    ]
    
    const { data: transactionData, error: transactionError } = await supabase
      .from('finances')
      .upsert(sampleTransactions)
    
    if (transactionError) {
      console.error('Erro ao inserir transações:', transactionError)
    } else {
      console.log('✅ Transações inseridas:', transactionData)
    }
    
    return { success: true }
    
  } catch (error) {
    console.error('❌ Erro ao inserir dados de exemplo:', error)
    return { success: false, error }
  }
}