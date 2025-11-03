import { useState } from 'react'
import { TrendingUp, User, Lock, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

export function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos')
      return
    }

    setLoading(true)
    setError('')

    try {
      console.log('🔐 Tentando fazer login com:', username)
      
      // Buscar usuário no banco
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('name', username.trim())
        .eq('password', password)
        .limit(1)

      if (error) {
        console.error('❌ Erro na consulta:', error)
        setError('Erro ao conectar com o banco de dados')
        return
      }

      if (!users || users.length === 0) {
        console.log('❌ Credenciais inválidas')
        setError('Usuário ou senha incorretos')
        return
      }

      const user = users[0]
      console.log('✅ Login realizado com sucesso:', user.name)
      
      // Salvar dados do usuário logado
      localStorage.setItem('financeai-logged', 'true')
      localStorage.setItem('financeai-user', JSON.stringify({
        id: user.id,
        name: user.name
      }))
      
      // Recarregar página para aplicar login
      window.location.reload()
      
    } catch (error) {
      console.error('💥 Erro no login:', error)
      setError('Erro inesperado ao fazer login')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <TrendingUp size={40} />
        </div>
        
        <h1 className="login-title">FinanceAI</h1>
        <p className="login-subtitle">
          Faça login para acessar seu dashboard
        </p>
        
        {error && (
          <div className="login-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <div className="input-icon">
              <User size={20} />
            </div>
            <input
              type="text"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <div className="input-icon">
              <Lock size={20} />
            </div>
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-login" 
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Fazer Login'}
          </button>
        </form>
        
        
      </div>
    </div>
  )
}