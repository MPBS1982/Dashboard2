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

