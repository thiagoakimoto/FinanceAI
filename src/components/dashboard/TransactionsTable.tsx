import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import type { Transaction } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useState } from 'react'

interface TransactionsTableProps {
  transactions: Transaction[]
}

const CATEGORY_COLORS: Record<string, string> = {
  'Alimentação': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  'Transporte': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'Lazer': 'bg-pink-500/10 text-pink-500 border-pink-500/20',
  'Contas Fixas': 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  'Saúde': 'bg-green-500/10 text-green-500 border-green-500/20',
  'Educação': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  'Compras': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  'Outros': 'bg-gray-500/10 text-gray-500 border-gray-500/20',
}

export const TransactionsTable = ({ transactions }: TransactionsTableProps) => {
  const [search, setSearch] = useState('')

  const filteredTransactions = transactions.filter(t =>
    t.category.toLowerCase().includes(search.toLowerCase()) ||
    formatDate(t.date).includes(search)
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Transações Recentes</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar transações..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                    Data
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                    Categoria
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                    Tipo
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.slice(0, 10).map((transaction, index) => (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-4 px-4 text-sm">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                          CATEGORY_COLORS[transaction.category] || CATEGORY_COLORS['Outros']
                        }`}
                      >
                        {transaction.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'gasto'
                            ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                            : 'bg-green-500/10 text-green-500 border border-green-500/20'
                        }`}
                      >
                        {transaction.type === 'gasto' ? 'Gasto' : 'Entrada'}
                      </span>
                    </td>
                    <td className={`py-4 px-4 text-right font-semibold ${
                      transaction.type === 'gasto' ? 'text-red-500' : 'text-green-500'
                    }`}>
                      {transaction.type === 'gasto' ? '-' : '+'} {formatCurrency(transaction.amount)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhuma transação encontrada</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
