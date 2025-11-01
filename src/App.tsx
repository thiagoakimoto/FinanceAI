import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { ReportsPage } from './pages/ReportsPage'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

const queryClient = new QueryClient()

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 🧪 TESTE DE CONEXÃO SUPABASE
    const testConnection = async () => {
      console.log('🔍 INICIANDO TESTE DE CONEXÃO SUPABASE...')
      const { data, error } = await supabase.from("finances").select("*").limit(1)
      console.log("DATA:", data)
      console.log("ERROR:", error)
      
      if (error) {
        console.error('❌ Erro na conexão:', error)
      } else {
        console.log('✅ Conexão funcionando! Dados:', data)
      }
    }

    // Verificar se está logado (fake)
    const logged = localStorage.getItem('financeai-logged')
    setIsLoggedIn(!!logged)
    setLoading(false)
    
    // Executar teste de conexão
    testConnection()
  }, [])

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading">
          <div className="spinner">⚡</div>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return <LoginPage />
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App