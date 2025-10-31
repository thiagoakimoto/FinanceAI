import { useEffect, useState } from 'react'
import { Dashboard } from './pages/Dashboard'
import { Login } from './pages/Login'
import { supabase } from './lib/supabase'
import './index.css'

function App() {
  const [session, setSession] = useState<boolean | null>(null)

  useEffect(() => {
    // Ativa o modo escuro por padrão
    document.documentElement.classList.add('dark')

    // Verifica se há uma sessão ativa
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(!!session)
    })

    // Escuta mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (session === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return session ? <Dashboard /> : <Login onLoginSuccess={() => setSession(true)} />
}

export default App
