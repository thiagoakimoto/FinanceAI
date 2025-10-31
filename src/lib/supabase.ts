import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aycpkncnhyzzvxgkmdnz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5Y3BrbmNuaHl6enZ4Z2ttZG56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwMjM3NjMsImV4cCI6MjA3NTU5OTc2M30.J7IbQtcWITcpCjCkzfTMqdV3lHcvetSklVZ88eEAyPI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
