# 🔧 GUIA DE RESOLUÇÃO - Conexão Supabase

## 🚨 **PROBLEMA IDENTIFICADO**
O sistema não está conseguindo conectar corretamente ao Supabase ou as tabelas não existem.

## ✅ **SOLUÇÕES EM ORDEM DE PRIORIDADE:**

### **1. VERIFICAR VARIÁVEIS DE AMBIENTE**

Abra o arquivo `.env` e confirme se as variáveis estão corretas:
```env
VITE_SUPABASE_URL=https://aycpkncnhyzzvxgkmdnz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

✅ **URL está correta**  
✅ **Chave anônima está definida**

### **2. EXECUTAR SQL NO SUPABASE (RECOMENDADO)**

1. **Acesse** o painel do Supabase: https://aycpkncnhyzzvxgkmdnz.supabase.co
2. **Vá em** "SQL Editor" no menu lateral
3. **Cole** o conteúdo do arquivo `supabase-setup.sql`
4. **Execute** o script SQL (botão "Run")

Isso irá:
- ✅ Criar as tabelas `finances` e `monthly_balances`
- ✅ Inserir dados de exemplo
- ✅ Verificar se tudo foi criado corretamente

### **3. VERIFICAR LOGS NO CONSOLE**

1. **Abra** o navegador em http://localhost:5173
2. **Pressione** F12 para abrir DevTools
3. **Vá** na aba "Console"
4. **Recarregue** a página (F5)
5. **Procure** por logs que começam com 🚀, ✅ ou ❌

### **4. VERIFICAR PERMISSÕES RLS**

Se as tabelas existem mas ainda não funcionam:

1. **Acesse** "Authentication" > "Policies" no Supabase
2. **Desabilite** temporariamente o RLS para teste:

```sql
-- Execute no SQL Editor para desabilitar RLS temporariamente
ALTER TABLE finances DISABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_balances DISABLE ROW LEVEL SECURITY;
```

### **5. TESTE DIRETO VIA SUPABASE**

Execute no SQL Editor para testar:

```sql
-- Verificar se as tabelas existem
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('finances', 'monthly_balances');

-- Contar registros
SELECT 'finances' as tabela, count(*) as total FROM finances
UNION ALL
SELECT 'monthly_balances' as tabela, count(*) as total FROM monthly_balances;
```

## 🔍 **COMO IDENTIFICAR O PROBLEMA:**

### **Console Logs Esperados:**
```
🚀 Iniciando testes de conexão Supabase...
URL: https://aycpkncnhyzzvxgkmdnz.supabase.co
Key definida: true
✅ Conexão bem-sucedida!
✅ Tabela finances: Existe
✅ Tabela monthly_balances: Existe
```

### **Se aparecer erro 42P01:**
- **Problema**: Tabela não existe
- **Solução**: Execute o SQL do passo 2

### **Se aparecer erro de conexão:**
- **Problema**: URL ou chave incorreta
- **Solução**: Verifique arquivo .env

### **Se aparecer erro de permissão:**
- **Problema**: RLS bloqueando acesso
- **Solução**: Execute passo 4

## 🎯 **TESTE FINAL**

Após seguir os passos:

1. **Recarregue** a página (F5)
2. **Verifique** se o Dashboard mostra dados reais
3. **Vá** na página "Transações" e veja se há transações listadas
4. **Confira** no console se não há mais erros

## 📞 **SE AINDA NÃO FUNCIONAR**

Envie um print dos logs do console e eu ajudo a identificar o problema específico!