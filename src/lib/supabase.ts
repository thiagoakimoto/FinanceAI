import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      finances: {
        Row: {
          id: number
          date: string
          category: string
          amount: number
          type: 'gasto' | 'saldo'
          created_at: string
        }
        Insert: {
          id?: number
          date?: string
          category: string
          amount: number
          type: 'gasto' | 'saldo'
          created_at?: string
        }
        Update: {
          id?: number
          date?: string
          category?: string
          amount?: number
          type?: 'gasto' | 'saldo'
          created_at?: string
        }
      }
      monthly_balances: {
        Row: {
          id: number
          month: number
          year: number
          initial_balance: number
          created_at: string
        }
        Insert: {
          id?: number
          month: number
          year: number
          initial_balance: number
          created_at?: string
        }
        Update: {
          id?: number
          month?: number
          year?: number
          initial_balance?: number
          created_at?: string
        }
      }
    }
  }
}
