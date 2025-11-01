import { LayoutDashboard, Receipt, BarChart3, TrendingUp } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export function Sidebar() {
  const location = useLocation()
  
  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/transactions', icon: Receipt, label: 'Transações' },
    { path: '/reports', icon: BarChart3, label: 'Relatórios' },
  ]
  
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-wrapper">
          <TrendingUp size={32} className="logo-icon" />
          <h1 className="logo-text">FinanceAI</h1>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
