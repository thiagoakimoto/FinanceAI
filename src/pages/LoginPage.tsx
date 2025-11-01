import { TrendingUp } from 'lucide-react'

export function LoginPage() {
  const handleLogin = () => {
    // Login fake - apenas redireciona
    localStorage.setItem('financeai-logged', 'true')
    window.location.reload()
  }
  
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <TrendingUp size={40} />
        </div>
        
        <h1 className="login-title">FinanceAI</h1>
        <p className="login-subtitle">
          Seu controle financeiro inteligente
        </p>
        
        <button className="btn-login" onClick={handleLogin}>
          Acessar Dashboard
        </button>
        
        <div style={{ 
          marginTop: '2rem', 
          fontSize: '0.9rem', 
          color: '#a0a0b8',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <p>💼 Dashboard completo</p>
          <p>📊 Relatórios em tempo real</p>
          <p>📈 Análise de gastos</p>
        </div>
      </div>
    </div>
  )
}