import { motion } from 'framer-motion'
import { Wallet, TrendingDown, Percent, TrendingUp, Receipt, LogOut } from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { CategoryChart } from '@/components/dashboard/CategoryChart'
import { WeeklyChart } from '@/components/dashboard/WeeklyChart'
import { TransactionsTable } from '@/components/dashboard/TransactionsTable'
import { AddTransactionModal } from '@/components/dashboard/AddTransactionModal'
import { Button } from '@/components/ui/button'
import { useFinances } from '@/hooks/useFinances'
import { formatCurrency } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

export const Dashboard = () => {
  const { 
    transactions, 
    stats, 
    loading, 
    getCategorySpending, 
    getDailySpending,
    addTransaction 
  } = useFinances()

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando dados...</p>
        </motion.div>
      </div>
    )
  }

  const categoryData = getCategorySpending()
  const dailyData = getDailySpending()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center shadow-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                  FinanceAI
                </h1>
                <p className="text-sm text-muted-foreground">Gestão Inteligente</p>
              </div>
            </motion.div>
            <div className="flex items-center gap-3">
              <AddTransactionModal onAdd={addTransaction} />
              <Button
                variant="outline"
                size="icon"
                onClick={handleLogout}
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
            <p className="text-muted-foreground">Visão geral das suas finanças em tempo real</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Saldo Atual"
              value={formatCurrency(stats?.currentBalance || 0)}
              subtitle="Atualizado há 2 min"
              icon={Wallet}
              trend={stats?.balanceChange}
              index={0}
              color="bg-gradient-to-br from-purple-500 to-purple-600"
            />
            <StatCard
              title="Gasto no Mês"
              value={formatCurrency(stats?.monthlySpending || 0)}
              subtitle="Maio 2025"
              icon={TrendingDown}
              trend={stats?.balanceChange ? -stats.balanceChange : undefined}
              index={1}
              color="bg-gradient-to-br from-red-500 to-red-600"
            />
            <StatCard
              title="% do Saldo"
              value={`${stats?.spendingPercentage.toFixed(1)}%`}
              subtitle="Gasto este mês"
              icon={Percent}
              index={2}
              color="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <StatCard
              title="Média Diária"
              value={formatCurrency(stats?.dailyAverage || 0)}
              subtitle="Total no mês"
              icon={TrendingUp}
              index={3}
              color="bg-gradient-to-br from-green-500 to-green-600"
            />
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {categoryData.length > 0 && <CategoryChart data={categoryData} />}
          {dailyData.length > 0 && <WeeklyChart data={dailyData} />}
        </div>

        {/* Transactions Table */}
        {transactions.length > 0 && <TransactionsTable transactions={transactions} />}

        {/* Empty State */}
        {transactions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 rounded-full gradient-bg flex items-center justify-center mx-auto mb-6">
              <Receipt className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Nenhuma transação ainda</h3>
            <p className="text-muted-foreground mb-6">
              Comece adicionando sua primeira transação para ver seus dados aqui
            </p>
            <AddTransactionModal onAdd={addTransaction} />
          </motion.div>
        )}
      </main>
    </div>
  )
}
