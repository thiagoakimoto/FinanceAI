import { useState } from 'react'
import { motion } from 'framer-motion'
import { Wallet, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'

interface LoginProps {
  onLoginSuccess: () => void
}

export const Login = ({ onLoginSuccess }: LoginProps) => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password
        })
        if (error) throw error
      }
      onLoginSuccess()
    } catch (err: unknown) {
      const error = err as { message: string }
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-purple-500/20 -z-10" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 rounded-3xl gradient-bg flex items-center justify-center mx-auto mb-4 shadow-2xl"
          >
            <Wallet className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent mb-2">
            FinanceAI
          </h1>
          <p className="text-muted-foreground">Gestão Inteligente de Finanças Pessoais</p>
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {isLogin ? 'Bem-vindo de volta' : 'Criar conta'}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin 
                ? 'Entre com suas credenciais para continuar' 
                : 'Crie sua conta para começar a gerenciar suas finanças'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                >
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full gradient-bg text-white shadow-lg hover:shadow-xl transition-all"
              >
                {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Criar conta')}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setError('')
                  }}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
