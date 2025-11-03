import { formatCurrency } from '../lib/utils'

interface ExpenseChartProps {
  data: { date: string; amount: number }[]
}

export function ExpenseChart({ data }: ExpenseChartProps) {
  const maxAmount = Math.max(...data.map(item => item.amount), 0)
  
  console.log('📈 ExpenseChart - dados recebidos:', data)
  console.log('📈 ExpenseChart - maxAmount:', maxAmount)
  
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Gastos Diários</h3>
        <p className="chart-subtitle">Evolução dos gastos por dia</p>
      </div>
      
      {data.length > 0 ? (
        <div className="expense-chart">
          {data.slice(-7).map((item, index) => {
            const dayName = new Date(item.date).toLocaleDateString('pt-BR', { 
              weekday: 'short' 
            })
            const dayNumber = new Date(item.date).getDate()
            
            return (
              <div key={index} className="expense-bar-item">
                <div className="day-info">
                  <span className="day-name">{dayName}</span>
                  <span className="day-number">{dayNumber}</span>
                </div>
                <div className="expense-bar-container">
                  <div 
                    className="expense-bar"
                    style={{
                      height: maxAmount > 0 ? `${(item.amount / maxAmount) * 100}%` : '0%'
                    }}
                  />
                </div>
                <span className="expense-amount">{formatCurrency(item.amount)}</span>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="empty-state">
          <p>Nenhum gasto diário encontrado</p>
        </div>
      )}
    </div>
  )
}