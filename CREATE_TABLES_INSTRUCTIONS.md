# Instruções para Criar Tabelas no Supabase

## ✅ Status Atual

A tabela `sales_data` já existe no seu projeto Supabase! 

- ✅ Tabela criada
- 📊 Total de registros: 0

## 📋 Verificar Configuração Completa

Para garantir que tudo está configurado corretamente, execute o SQL abaixo no SQL Editor do Supabase:

1. **Acesse o SQL Editor:**
   - URL: https://xprfptktvktgoyopzany.supabase.co/project/default/sql
   - Ou: Supabase Dashboard > SQL Editor

2. **Clique em "New query"**

3. **Execute o SQL abaixo:**

```sql
-- Verificar se a tabela existe e ver estrutura
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'sales_data'
ORDER BY ordinal_position;

-- Verificar se RLS está habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'sales_data';

-- Verificar políticas RLS existentes
SELECT * FROM pg_policies WHERE tablename = 'sales_data';
```

4. **Se faltar alguma política ou índice, execute o SQL completo:**

O arquivo `create-tables.sql` na raiz do projeto contém todo o SQL necessário.

## 🚀 Próximos Passos

1. A tabela já está criada ✅
2. Agora você pode:
   - Carregar dados via upload de XLSX no dashboard
   - Ou inserir dados manualmente via SQL Editor
   - Ou usar a API REST do Supabase

## 📝 Executar Script de Verificação

Para verificar o status das tabelas, execute:

```bash
npm run create-tables
```

Este script verifica se a tabela existe e mostra o total de registros.

