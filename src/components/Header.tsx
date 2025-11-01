import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export function Header() {
  const { theme, toggleTheme } = useTheme()
  
  const handleLogout = () => {
    localStorage.removeItem('financeai-logged')
    window.location.reload()
  }

  return (
    <div className="header">
      <div className="user-menu">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <div className="user-avatar">
          U
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </div>
  )
}