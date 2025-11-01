-- 🚀 SCRIPT PARA CONFIGURAR DADOS DE TESTE NO SUPABASE
-- Execute este SQL no painel SQL Editor do Supabase

-- ✅ 1. Limpar dados existentes (opcional)
-- DELETE FROM finances;
-- DELETE FROM monthly_balances;

-- ✅ 2. Inserir saldo mensal para novembro de 2025
INSERT INTO monthly_balances (month, year, initial_balance) 
VALUES ('11', 2025, 5000.00)
ON CONFLICT (id) DO NOTHING;

-- ✅ 3. Inserir transações de exemplo para novembro de 2025
INSERT INTO finances (date, category, amount, month) VALUES
  ('2025-11-01', 'Alimentação', 150.00, '11'),
  ('2025-11-02', 'Transporte', 45.00, '11'),
  ('2025-11-03', 'Alimentação', 80.00, '11'),
  ('2025-11-04', 'Lazer', 200.00, '11'),
  ('2025-11-05', 'Contas Fixas', 300.00, '11'),
  ('2025-11-06', 'Alimentação', 120.00, '11'),
  ('2025-11-07', 'Transporte', 35.00, '11'),
  ('2025-11-08', 'Lazer', 180.00, '11'),
  ('2025-11-09', 'Alimentação', 95.00, '11'),
  ('2025-11-10', 'Contas Fixas', 250.00, '11')
ON CONFLICT (id) DO NOTHING;

-- ✅ 4. Verificar se os dados foram inseridos
SELECT 'Saldos mensais:' as tabela, count(*) as total FROM monthly_balances
UNION ALL
SELECT 'Transações:' as tabela, count(*) as total FROM finances;

-- ✅ 5. Visualizar os dados inseridos
SELECT 'Dados do saldo mensal' as info;
SELECT * FROM monthly_balances WHERE month = '11' AND year = '2025';

SELECT 'Dados das transações' as info;
SELECT * FROM finances WHERE month = '11' ORDER BY date DESC;

-- ✅ 6. Verificar estrutura das tabelas
SELECT 'Estrutura da tabela finances' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'finances' 
ORDER BY ordinal_position;

SELECT 'Estrutura da tabela monthly_balances' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'monthly_balances' 
ORDER BY ordinal_position;