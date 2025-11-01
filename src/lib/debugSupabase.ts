// Teste simples de verificação das variáveis de ambiente
export function checkEnvironmentVariables() {
  console.log('🔍 VERIFICAÇÃO DE VARIÁVEIS DE AMBIENTE:')
  console.log('-------------------------------------------')
  
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  
  console.log('VITE_SUPABASE_URL:', url || '❌ NÃO DEFINIDA')
  console.log('VITE_SUPABASE_ANON_KEY:', key ? '✅ DEFINIDA' : '❌ NÃO DEFINIDA')
  
  if (key) {
    console.log('Primeiros 20 caracteres da chave:', key.substring(0, 20) + '...')
  }
  
  // Verificar se o arquivo .env está sendo carregado
  console.log('Todas as variáveis VITE_:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')))
  
  return {
    url: !!url,
    key: !!key,
    urlValue: url,
    keyLength: key?.length || 0
  }
}

export async function testDirectSupabaseQuery() {
  console.log('🔗 TESTE DIRETO DE QUERY SUPABASE:')
  console.log('-----------------------------------')
  
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  
  if (!url || !key) {
    console.error('❌ Variáveis de ambiente não definidas')
    return { error: 'Missing environment variables' }
  }
  
  try {
    // Fazer uma requisição HTTP direta para testar
    const testUrl = `${url}/rest/v1/finances?select=count&limit=1`
    
    console.log('URL de teste:', testUrl)
    
    const response = await fetch(testUrl, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Status da resposta:', response.status)
    console.log('Headers da resposta:', Object.fromEntries(response.headers.entries()))
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Erro na resposta:', errorText)
      return { error: errorText, status: response.status }
    }
    
    const data = await response.json()
    console.log('✅ Resposta bem-sucedida:', data)
    return { success: true, data }
    
  } catch (error) {
    console.error('❌ Erro na requisição:', error)
    return { error: (error as Error).message }
  }
}