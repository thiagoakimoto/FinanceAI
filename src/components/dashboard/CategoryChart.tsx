import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { CategorySpending } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface CategoryChartProps {
  data: CategorySpending[]
}

const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe']

export const CategoryChart = ({ data }: CategoryChartProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Gastos por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical">
              <XAxis type="number" />
              <YAxis dataKey="category" type="category" width={100} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-semibold">{payload[0].payload.category}</p>
                        <p className="text-primary font-bold">
                          {formatCurrency(payload[0].value as number)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {payload[0].payload.percentage.toFixed(1)}% do total
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="total" radius={[0, 8, 8, 0]}>
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {data.slice(0, 5).map((item, index) => (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-2"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-muted-foreground">{item.category}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
