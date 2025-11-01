import type { CategoryTotal } from '../types'

interface CategoryChartProps {
  data: CategoryTotal[]
}

export function CategoryChart({ }: CategoryChartProps) {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Gastos por Categoria</h3>
        <p className="chart-subtitle">Distribuição dos seus gastos</p>
      </div>
      
      <div className="empty-state">
        <p>Gráfico será exibido quando houver dados</p>
      </div>
    </div>
  )
}