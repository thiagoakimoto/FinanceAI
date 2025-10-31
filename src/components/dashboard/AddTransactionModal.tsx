import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Transaction } from '@/types'

interface AddTransactionModalProps {
  onAdd: (transaction: Omit<Transaction, 'id' | 'created_at'>) => Promise<{ success: boolean }>
}

const CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Lazer',
  'Contas Fixas',
  'Saúde',
  'Educação',
  'Compras',
  'Outros'
]

export const AddTransactionModal = ({ onAdd }: AddTransactionModalProps) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    amount: '',
    type: 'gasto' as 'gasto' | 'saldo'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = await onAdd({
      date: formData.date,
      category: formData.category,
      amount: parseFloat(formData.amount),
      type: formData.type
    })

    setLoading(false)

    if (result.success) {
      setOpen(false)
      setFormData({
        date: new Date().toISOString().split('T')[0],
        category: '',
        amount: '',
        type: 'gasto'
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button className="gradient-bg gap-2 shadow-lg hover:shadow-xl transition-all">
            <Plus className="w-5 h-5" />
            Nova Transação
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Nova Transação</DialogTitle>
          <DialogDescription>
            Adicione uma nova transação ao seu controle financeiro
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select
              value={formData.type}
              onValueChange={(value: 'gasto' | 'saldo') => 
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gasto">Gasto</SelectItem>
                <SelectItem value="saldo">Saldo/Entrada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0,00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.category}
              className="flex-1 gradient-bg"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
