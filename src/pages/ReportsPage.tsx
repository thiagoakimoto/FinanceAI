import { BarChart3, TrendingUp, Target, Calendar } from 'lucide-react'
import { useTransactions } from '../hooks/useFinance'
import { formatCurrency } from '../lib/utils'
import { type CategoryName } from '../types'
import { useMemo } from 'react'

export function ReportsPage() {
  const { data: transactions = [], isLoading } = useTransactions()
  
  // Análises básicas
  const analytics = useMemo(() => {
    if (transactions.length === 0) return null
    
    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0)
    const avgPerTransaction = totalSpent / transactions.length
    
    // Gastos por categoria
    const categorySpending = new Map<CategoryName, number>()
    transactions.forEach((t) => {
      const current = categorySpending.get(t.category as CategoryName) || 0
      categorySpending.set(t.category as CategoryName, current + t.amount)
    })
    
    const topCategory = Array.from(categorySpending.entries())
      .sort(([,a], [,b]) => b - a)[0]
    
    // Tendência (últimos 30 dias vs 30 anteriores)
    const now = new Date()
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const previous30Days = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
    
    const recentSpending = transactions
      .filter(t => new Date(t.date) >= last30Days)
      .reduce((sum, t) => sum + t.amount, 0)
    
    const previousSpending = transactions
      .filter(t => new Date(t.date) >= previous30Days && new Date(t.date) < last30Days)
      .reduce((sum, t) => sum + t.amount, 0)
    
    const trend = previousSpending > 0 
      ? ((recentSpending - previousSpending) / previousSpending) * 100 
      : 0
    
    return {
      totalSpent,
      avgPerTransaction,
      topCategory,
      recentSpending,
      trend
    }
  }, [transactions])
  
  if (isLoading) {
    return <div className="loading">Carregando relatórios...</div>
  }
  
  if (!analytics) {
    return (
      <div className="reports-page">
        <div className="page-header">
          <h1>Relatórios</h1>
          <p className="subtitle">Análises e insights financeiros</p>
        </div>
        
        <div className="empty-state">
          <BarChart3 size={64} style={{ margin: '0 auto 1rem', color: '#6366f1' }} />
          <p>Adicione algumas transações para ver suas análises financeiras</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Relatórios</h1>
        <p className="subtitle">Análises e insights financeiros</p>
      </div>
      
      <div className="reports-grid">
        <div className="report-card">
          <div className="report-header">
            <div className="report-icon">
              <TrendingUp size={24} />
            </div>
            <h3>Análise Geral</h3>
          </div>
          <div className="report-content">
            <div className="metric">
              <span className="metric-label">Total Gasto</span>
              <span className="metric-value">{formatCurrency(analytics.totalSpent)}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Média por Transação</span>
              <span className="metric-value">{formatCurrency(analytics.avgPerTransaction)}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Categoria Principal</span>
              <span className="metric-value">{analytics.topCategory[0]}</span>
            </div>
          </div>
        </div>
        
        <div className="report-card">
          <div className="report-header">
            <div className="report-icon">
              <Calendar size={24} />
            </div>
            <h3>Últimos 30 Dias</h3>
          </div>
          <div className="report-content">
            <div className="metric">
              <span className="metric-label">Total do Período</span>
              <span className="metric-value">{formatCurrency(analytics.recentSpending)}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Tendência</span>
              <span className={`metric-value ${analytics.trend >= 0 ? 'negative' : 'positive'}`}>
                {analytics.trend >= 0 ? '+' : ''}{analytics.trend.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="report-card">
          <div className="report-header">
            <div className="report-icon">
              <Target size={24} />
            </div>
            <h3>Metas e Objetivos</h3>
          </div>
          <div className="report-content">
            <div className="goal-item">
              <span className="goal-label">Meta Mensal</span>
              <div className="goal-progress">
                <div className="goal-bar">
                  <div 
                    className="goal-fill" 
                    style={{ width: `${Math.min((analytics.recentSpending / 5000) * 100, 100)}%` }}
                  />
                </div>
                <span className="goal-percentage">
                  {((analytics.recentSpending / 5000) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            <p className="goal-description">
              Meta de R$ 5.000 por mês
            </p>
          </div>
        </div>
      </div>
      
      <div className="insights-section">
        <h2>Insights Financeiros</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>💡 Dica de Economia</h4>
            <p>
              Sua categoria com maior gasto é <strong>{analytics.topCategory[0]}</strong> 
              ({formatCurrency(analytics.topCategory[1])}). 
              Considere revisar esses gastos para otimizar seu orçamento.
            </p>
          </div>
          
          <div className="insight-card">
            <h4>📊 Análise de Tendência</h4>
            <p>
              {analytics.trend >= 0 
                ? `Seus gastos aumentaram ${analytics.trend.toFixed(1)}% comparado ao mês anterior. Considere revisar seu orçamento.`
                : `Parabéns! Você reduziu seus gastos em ${Math.abs(analytics.trend).toFixed(1)}% comparado ao mês anterior.`
              }
            </p>
          </div>
          
          <div className="insight-card">
            <h4>🎯 Recomendação</h4>
            <p>
              Com base no seu padrão de gastos, recomendamos estabelecer um limite de 
              {formatCurrency(analytics.avgPerTransaction * 1.2)} por transação para manter 
              o controle financeiro.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
