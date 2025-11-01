import { motion } from 'framer-motion'
import { Target, TrendingUp } from 'lucide-react'
import { formatCurrency } from '../lib/utils'

interface FinancialGoal {
  id: string
  title: string
  target: number
  current: number
  color: string
}

export function GoalsWidget() {
  // Exemplo de metas - pode ser integrado com o Supabase depois
  const goals: FinancialGoal[] = [
    {
      id: '1',
      title: 'Economizar este mês',
      target: 500,
      current: 280,
      color: '#0ea5e9',
    },
    {
      id: '2',
      title: 'Reduzir gastos com delivery',
      target: 300,
      current: 180,
      color: '#8b5cf6',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="card"
    >
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-5 h-5 text-primary-500" />
        <h3 className="text-xl font-bold">Metas Financeiras</h3>
      </div>

      <div className="space-y-4">
        {goals.map((goal, index) => {
          const percentage = (goal.current / goal.target) * 100

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-800"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{goal.title}</h4>
                <TrendingUp className="w-4 h-4" style={{ color: goal.color }} />
              </div>

              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-500">
                  {formatCurrency(goal.current)} de {formatCurrency(goal.target)}
                </span>
                <span className="font-bold" style={{ color: goal.color }}>
                  {percentage.toFixed(0)}%
                </span>
              </div>

              <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(percentage, 100)}%` }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: goal.color }}
                />
              </div>
            </motion.div>
          )
        })}

        <button className="w-full btn-secondary text-sm">
          + Adicionar Nova Meta
        </button>
      </div>
    </motion.div>
  )
}
