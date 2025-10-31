import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { DailySpending } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'

interface WeeklyChartProps {
  data: DailySpending[]
}

export const WeeklyChart = ({ data }: WeeklyChartProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Evolução Semanal</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis
                dataKey="date"
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
                }}
              />
              <YAxis />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                        <p className="text-sm text-muted-foreground">
                          {formatDate(payload[0].payload.date)}
                        </p>
                        <p className="text-primary font-bold text-lg">
                          {formatCurrency(payload[0].value as number)}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
