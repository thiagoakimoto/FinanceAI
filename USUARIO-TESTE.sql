-- 👤 SCRIPT PARA CRIAR USUÁRIO DE TESTE
-- Execute no Supabase SQL Editor

-- Inserir usuário de teste
INSERT INTO users (name, password) 
VALUES ('admin', '123456')
ON CONFLICT (id) DO NOTHING;

-- Verificar se o usuário foi criado
SELECT 'Usuários cadastrados:' as info;
SELECT id, name, created_at FROM users ORDER BY created_at DESC;

-- NOTA: Para teste, use:
-- Usuário: admin
-- Senha: 123456