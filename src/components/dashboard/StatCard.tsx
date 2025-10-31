import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { formatPercent } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  subtitle: string
  icon: LucideIcon
  trend?: number
  index: number
  color?: string
}

export const StatCard = ({ title, value, subtitle, icon: Icon, trend, index, color = 'bg-primary' }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-card to-card/50">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {title}
              </p>
              <h3 className="text-3xl font-bold mb-1 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                {value}
              </h3>
              <p className="text-xs text-muted-foreground">
                {subtitle}
              </p>
            </div>
            <motion.div
              className={`${color} p-3 rounded-2xl`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-6 h-6 text-white" />
            </motion.div>
          </div>
          {trend !== undefined && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 flex items-center gap-1"
            >
              <span className={`text-xs font-semibold ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatPercent(trend)}
              </span>
              <span className="text-xs text-muted-foreground">
                vs mês anterior
              </span>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
