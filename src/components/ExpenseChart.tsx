interface ExpenseChartProps {
  data: { date: string; amount: number }[]
}

export function ExpenseChart({ }: ExpenseChartProps) {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Evolução Semanal</h3>
        <p className="chart-subtitle">Gastos por dia da semana</p>
      </div>
      
      <div className="empty-state">
        <p>Gráfico será exibido quando houver dados</p>
      </div>
    </div>
  )
}