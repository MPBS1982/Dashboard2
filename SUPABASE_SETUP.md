# Configuração do Supabase

Este documento explica como configurar a integração com o Supabase para o Dashboard de Vendas.

## 1. Criar Projeto no Supabase

1. Acesse [https://app.supabase.com](https://app.supabase.com)
2. Crie uma conta ou faça login
3. Clique em "New Project"
4. Preencha os detalhes do projeto e aguarde a criação

## 2. Obter Credenciais

1. No seu projeto, vá em **Settings** > **API**
2. Copie:
   - **Project URL** (será `VITE_SUPABASE_URL`)
   - **anon public** key (será `VITE_SUPABASE_ANON_KEY`)

## 3. Criar Tabela no Banco de Dados

1. No Supabase, vá em **SQL Editor**
2. Execute o seguinte SQL:

```sql
-- Criar tabela sales_data
CREATE TABLE sales_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unidade VARCHAR(100) NOT NULL,
    data DATE NOT NULL,
    codigo VARCHAR(50) NOT NULL,
    produto VARCHAR(255) NOT NULL,
    nv_produto_superior_setor VARCHAR(100),
    modalidade VARCHAR(50),
    t_consumidor VARCHAR(50),
    vr_un DECIMAL(10,2) NOT NULL,
    qtd INTEGER NOT NULL,
    faturamento DECIMAL(12,2) NOT NULL,
    vr_acres DECIMAL(10,2) DEFAULT 0.00,
    vr_liquido DECIMAL(12,2) NOT NULL,
    perc_vr_vendido DECIMAL(5,2),
    mtc VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para performance
CREATE INDEX idx_sales_data_date ON sales_data(data);
CREATE INDEX idx_sales_data_codigo ON sales_data(codigo);
CREATE INDEX idx_sales_data_setor ON sales_data(nv_produto_superior_setor);
CREATE INDEX idx_sales_data_unidade ON sales_data(unidade);
CREATE INDEX idx_sales_data_produto ON sales_data(produto);

-- Configurar permissões (permite leitura pública e escrita autenticada)
ALTER TABLE sales_data ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública
CREATE POLICY "Permitir leitura pública" ON sales_data
    FOR SELECT
    USING (true);

-- Política para permitir inserção pública (se necessário)
CREATE POLICY "Permitir inserção pública" ON sales_data
    FOR INSERT
    WITH CHECK (true);

-- Política para permitir atualização pública (se necessário)
CREATE POLICY "Permitir atualização pública" ON sales_data
    FOR UPDATE
    USING (true);

-- Política para permitir deleção pública (se necessário)
CREATE POLICY "Permitir deleção pública" ON sales_data
    FOR DELETE
    USING (true);
```

## 4. Configurar Variáveis de Ambiente

1. Crie um arquivo `.env` na raiz do projeto
2. Adicione as seguintes variáveis:

```env
VITE_SUPABASE_URL=sua-url-do-supabase
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

**Exemplo:**
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 5. Reiniciar o Servidor

Após configurar as variáveis de ambiente:

```bash
npm run dev
```

## Funcionalidades

- ✅ **Buscar dados**: Os dados são carregados automaticamente do Supabase ao iniciar a aplicação
- ✅ **Inserir dados**: Ao fazer upload de um arquivo XLSX, os dados são salvos no Supabase
- ✅ **Fallback**: Se o Supabase não estiver configurado, a aplicação usa dados mockados
- ✅ **Cache**: Os dados são cacheados por 5 minutos usando React Query

## Notas de Segurança

⚠️ **Importante**: As políticas de segurança acima permitem acesso público completo à tabela. Para produção, você deve:

1. Implementar autenticação de usuários
2. Criar políticas RLS mais restritivas baseadas em roles
3. Usar autenticação JWT do Supabase
4. Configurar políticas específicas por operação e por usuário

Para mais informações sobre Row Level Security no Supabase, consulte: [https://supabase.com/docs/guides/auth/row-level-security](https://supabase.com/docs/guides/auth/row-level-security)

