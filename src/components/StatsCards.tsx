import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react'
import { formatCurrency } from '../lib/utils'
import type { MonthlyStats } from '../types'

interface StatsCardsProps {
  stats: MonthlyStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="stats-grid">
      {/* Saldo Atual */}
      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Saldo Atual</span>
          <div className="stat-icon">
            <TrendingUp size={20} color="white" />
          </div>
        </div>
        <div className="stat-value">{formatCurrency(stats.currentBalance || 0)}</div>
        <div className="stat-trend positive">
          <TrendingUp size={16} />
          <span>+12%</span>
        </div>
      </div>

      {/* Total Gasto */}
      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Gasto no Mês</span>
          <div className="stat-icon">
            <DollarSign size={20} color="white" />
          </div>
        </div>
        <div className="stat-value">{formatCurrency(stats.totalSpent || 0)}</div>
        <div className="stat-trend negative">
          <TrendingDown size={16} />
          <span>-8%</span>
        </div>
      </div>

      {/* Percentual do Saldo */}
      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">% do Saldo Gasto</span>
          <div className="stat-icon">
            <Calendar size={20} color="white" />
          </div>
        </div>
        <div className="stat-value">{(stats.percentageSpent || 0).toFixed(1)}%</div>
        <div className="stat-trend positive">
          <TrendingUp size={16} />
          <span>Meta: 80%</span>
        </div>
      </div>

      {/* Previsão Final */}
      <div className="stat-card">
        <div className="stat-header">
          <span className="stat-label">Previsão Final</span>
          <div className="stat-icon">
            <TrendingUp size={20} color="white" />
          </div>
        </div>
        <div className="stat-value">{formatCurrency(stats.projectedBalance || 0)}</div>
        <div className="stat-trend positive">
          <TrendingUp size={16} />
          <span>+5%</span>
        </div>
      </div>
    </div>
  )
}