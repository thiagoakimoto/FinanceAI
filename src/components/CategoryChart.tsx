import { formatCurrency } from '../lib/utils'
import type { CategoryTotal } from '../types'

interface CategoryChartProps {
  data: CategoryTotal[]
}

export function CategoryChart({ data }: CategoryChartProps) {
  const maxAmount = Math.max(...data.map(item => item.total), 0)
  
  console.log('📊 CategoryChart - dados recebidos:', data)
  console.log('📊 CategoryChart - maxAmount:', maxAmount)
  
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Gastos por Categoria</h3>
        <p className="chart-subtitle">Distribuição dos seus gastos</p>
      </div>
      
      {data.length > 0 ? (
        <div className="category-chart">
          {data.map((item, index) => (
            <div key={index} className="category-bar-item">
              <div className="category-info">
                <span className="category-name">{item.category}</span>
                <span className="category-amount">{formatCurrency(item.total)}</span>
              </div>
              <div className="category-bar-container">
                <div 
                  className="category-bar"
                  style={{
                    width: maxAmount > 0 ? `${(item.total / maxAmount) * 100}%` : '0%',
                    backgroundColor: item.color
                  }}
                />
              </div>
              <span className="category-percentage">{item.percentage.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>Nenhum gasto por categoria encontrado</p>
        </div>
      )}
    </div>
  )
}