import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { formatCurrency } from '../lib/utils'
import type { MonthlyStats } from '../types'

interface StatsCardsProps {
  stats: MonthlyStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="stats-grid">
      {/* Total de Entradas */}
      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Total de Entradas</span>
          <div className="stat-icon">
            <TrendingUp size={20} color="white" />
          </div>
        </div>
        <div className="stat-value">{formatCurrency(stats.totalIncomes || 0)}</div>
        <div className="stat-trend positive">
          <TrendingUp size={16} />
          <span>Receitas</span>
        </div>
      </div>

      {/* Total de Saídas */}
      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Total de Saídas</span>
          <div className="stat-icon">
            <TrendingDown size={20} color="white" />
          </div>
        </div>
        <div className="stat-value">{formatCurrency(stats.totalExpenses || 0)}</div>
        <div className="stat-trend negative">
          <TrendingDown size={16} />
          <span>Gastos</span>
        </div>
      </div>

      {/* Saldo Atual */}
      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Saldo Atual</span>
          <div className="stat-icon">
            <DollarSign size={20} color="white" />
          </div>
        </div>
        <div className="stat-value">{formatCurrency(stats.currentBalance || 0)}</div>
        <div className={`stat-trend ${stats.currentBalance >= 0 ? 'positive' : 'negative'}`}>
          {stats.currentBalance >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span>{stats.currentBalance >= 0 ? 'Positivo' : 'Negativo'}</span>
        </div>
      </div>

      {/* Percentual Gasto */}
      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">% do Orçamento</span>
          <div className="stat-icon">
            <DollarSign size={20} color="white" />
          </div>
        </div>
        <div className="stat-value">{(stats.percentageSpent || 0).toFixed(1)}%</div>
        <div className={`stat-trend ${stats.percentageSpent <= 80 ? 'positive' : 'negative'}`}>
          {stats.percentageSpent <= 80 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span>Meta: 80%</span>
        </div>
      </div>
    </div>
  )
}