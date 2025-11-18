import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Carrega variáveis de ambiente
const envFile = readFileSync(join(__dirname, '..', '.env'), 'utf-8')
const envVars = {}
envFile.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=')
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim()
  }
})

const supabaseUrl = envVars.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseAnonKey = envVars.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Erro: Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não encontradas!')
  console.error('Verifique se o arquivo .env existe e contém as credenciais corretas.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const createTablesSQL = `
-- Criar tabela sales_data
CREATE TABLE IF NOT EXISTS sales_data (
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
CREATE INDEX IF NOT EXISTS idx_sales_data_date ON sales_data(data);
CREATE INDEX IF NOT EXISTS idx_sales_data_codigo ON sales_data(codigo);
CREATE INDEX IF NOT EXISTS idx_sales_data_setor ON sales_data(nv_produto_superior_setor);
CREATE INDEX IF NOT EXISTS idx_sales_data_unidade ON sales_data(unidade);
CREATE INDEX IF NOT EXISTS idx_sales_data_produto ON sales_data(produto);

-- Configurar Row Level Security
ALTER TABLE sales_data ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Permitir leitura pública" ON sales_data;
DROP POLICY IF EXISTS "Permitir inserção pública" ON sales_data;
DROP POLICY IF EXISTS "Permitir atualização pública" ON sales_data;
DROP POLICY IF EXISTS "Permitir deleção pública" ON sales_data;

-- Política para permitir leitura pública
CREATE POLICY "Permitir leitura pública" ON sales_data
    FOR SELECT
    USING (true);

-- Política para permitir inserção pública
CREATE POLICY "Permitir inserção pública" ON sales_data
    FOR INSERT
    WITH CHECK (true);

-- Política para permitir atualização pública
CREATE POLICY "Permitir atualização pública" ON sales_data
    FOR UPDATE
    USING (true);

-- Política para permitir deleção pública
CREATE POLICY "Permitir deleção pública" ON sales_data
    FOR DELETE
    USING (true);
`

async function createTables() {
  console.log('🔄 Tentando criar tabelas no Supabase...')
  console.log(`📡 URL: ${supabaseUrl}`)
  
  try {
    // O Supabase client com chave anon não pode executar SQL direto
    // Precisamos usar a API REST ou o usuário precisa executar no SQL Editor
    // Vou tentar usar RPC se disponível, ou criar o arquivo SQL
    
    console.log('\n⚠️  A chave anon não permite executar SQL diretamente.')
    console.log('📝 Criando arquivo SQL para execução manual...\n')
    
    // Criar arquivo SQL
    const fs = await import('fs')
    const path = await import('path')
    const sqlFilePath = path.join(__dirname, '..', 'create-tables.sql')
    
    fs.writeFileSync(sqlFilePath, createTablesSQL, 'utf-8')
    
    console.log('✅ Arquivo SQL criado: create-tables.sql')
    console.log('\n📋 Instruções:')
    console.log('1. Acesse https://xprfptktvktgoyopzany.supabase.co/project/default/sql')
    console.log('2. Clique em "New query"')
    console.log('3. Copie e cole o conteúdo do arquivo create-tables.sql')
    console.log('4. Clique em "Run" para executar\n')
    
    // Verificar se a tabela já existe
    const { data, error } = await supabase
      .from('sales_data')
      .select('count', { count: 'exact', head: true })
    
    if (error && error.code === 'PGRST116') {
      console.log('ℹ️  Tabela não existe ainda. Execute o SQL acima para criar.')
    } else if (error) {
      console.log('ℹ️  Erro ao verificar tabela:', error.message)
      console.log('Execute o SQL acima para criar a tabela.')
    } else {
      console.log('✅ Tabela sales_data já existe!')
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
    console.log('\n📝 Use o arquivo create-tables.sql no SQL Editor do Supabase.')
  }
}

createTables()

