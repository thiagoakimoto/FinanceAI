import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useState, useEffect } from 'react'

interface User {
  id: number
  name: string
}

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const [user, setUser] = useState<User | null>(null)
  
  useEffect(() => {
    // Buscar dados do usuário logado
    const userData = localStorage.getItem('financeai-user')
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch {
        // Se houver erro no JSON, remove dados corrompidos
        localStorage.removeItem('financeai-user')
      }
    }
  }, [])
  
  const handleLogout = () => {
    localStorage.removeItem('financeai-logged')
    localStorage.removeItem('financeai-user')
    window.location.reload()
  }

  const getUserInitial = () => {
    return user?.name?.charAt(0).toUpperCase() || 'U'
  }

  return (
    <div className="header">
      <div className="user-menu">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        
        {user && (
          <span className="user-name">
            Olá, {user.name}
          </span>
        )}
        
        <div className="user-avatar" title={user?.name || 'Usuário'}>
          {getUserInitial()}
        </div>
        
        <button className="btn-logout" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </div>
  )
}