# 📊 Dashboard de Vendas

Um dashboard completo de análise de dados de vendas que transforma dados brutos em insights acionáveis para negócios. O dashboard analisa o desempenho de vendas em múltiplas dimensões incluindo produtos, setores, tipos de consumidores e períodos de tempo.

![Status](https://img.shields.io/badge/status-active-success)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Supabase](https://img.shields.io/badge/Supabase-Integrado-green)

## 🚀 Funcionalidades

### 📈 Visão Geral (Overview)
- **KPIs Principais**: Faturamento Total, Unidades Vendidas, Preço Médio
- **Gráfico de Tendências de Vendas**: Visualização de receita ao longo do tempo
- **Top Produtos**: Gráfico de barras dos 10 principais produtos por receita
- **Distribuição por Setor**: Gráfico de pizza mostrando distribuição de receita por setor

### 📦 Análise de Produtos
- **Evolução de Produtos**: Rastreamento de desempenho ao longo do tempo
- **Ranking por Setor**: Comparação de produtos dentro de setores
- **Comparação de Unidades**: Análise comparativa entre unidades de negócio
- **Comparação Produto/Unidade**: Análise detalhada de produtos por unidade

### 📊 Análises de Vendas
- **Tabela de Dados**: Visualização detalhada com filtros e ordenação
- **Upload de Arquivos XLSX**: Carregamento e importação de dados Excel
- **Exportação de Dados**: Exportação em múltiplos formatos (CSV, XLSX, PDF)
- **Filtros Avançados**: Por data, produto, setor e unidade

## 🛠️ Tecnologias

### Frontend
- **React 18.3** - Biblioteca JavaScript para interfaces
- **TypeScript 5.6** - Superset tipado do JavaScript
- **Vite 5.4** - Build tool e dev server
- **Tailwind CSS 3.4** - Framework CSS utility-first
- **Recharts 2.12** - Biblioteca de gráficos para React

### Backend & Data
- **Supabase** - Backend as a Service (PostgreSQL)
- **React Query 5.51** - Gerenciamento de estado servidor
- **XLSX 0.18** - Manipulação de arquivos Excel
- **jsPDF 2.5** - Geração de PDFs

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase (para integração completa)

## 🔧 Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/MPBS1982/Dashboard2.git
cd Dashboard2
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
```bash
# Crie um arquivo .env na raiz do projeto
VITE_SUPABASE_URL=sua-url-do-supabase
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

4. **Crie as tabelas no Supabase:**
```bash
npm run create-tables
```
Siga as instruções para executar o SQL no Supabase SQL Editor.

**Ou consulte:** `SUPABASE_SETUP.md` para instruções detalhadas.

5. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

6. **Acesse o dashboard:**
```
http://localhost:5173
```

## 📖 Documentação

- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Guia completo de configuração do Supabase
- **[CREATE_TABLES_INSTRUCTIONS.md](./CREATE_TABLES_INSTRUCTIONS.md)** - Instruções para criar tabelas
- **[CHANGELOG.md](./CHANGELOG.md)** - Histórico de mudanças

## 🏗️ Estrutura do Projeto

```
Dashboard2/
├── src/
│   ├── components/
│   │   ├── Common/          # Componentes compartilhados
│   │   │   ├── Header.tsx
│   │   │   ├── KPICard.tsx
│   │   │   └── ConnectionStatus.tsx
│   │   ├── Dashboard/       # Componentes do dashboard
│   │   │   ├── SalesTrendChart.tsx
│   │   │   ├── TopProductsChart.tsx
│   │   │   └── SectorDistribution.tsx
│   │   ├── ProductAnalysis/ # Análise de produtos
│   │   └── SalesAnalytics/  # Analytics e tabelas
│   ├── hooks/
│   │   └── useSalesData.ts  # Hook customizado para dados
│   ├── lib/
│   │   └── supabase.ts      # Cliente Supabase
│   ├── types/
│   │   └── sales.ts         # Tipos TypeScript
│   ├── utils/
│   │   └── formatters.ts    # Funções de formatação
│   └── App.tsx              # Componente principal
├── scripts/
│   └── create-tables.ts     # Script de criação de tabelas
├── create-tables.sql        # SQL para criar tabelas
└── package.json
```

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento

# Build
npm run build            # Cria build de produção
npm run preview          # Preview do build de produção

# Utilitários
npm run create-tables    # Verifica/ajuda a criar tabelas no Supabase
```

## 🔐 Variáveis de Ambiente

| Variável | Descrição | Obrigatório |
|----------|-----------|-------------|
| `VITE_SUPABASE_URL` | URL do projeto Supabase | Sim* |
| `VITE_SUPABASE_ANON_KEY` | Chave pública (anon) do Supabase | Sim* |

*Opcional: A aplicação funciona com dados mockados se não configurado.

## 📊 Estrutura de Dados

### Tabela: `sales_data`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | Identificador único |
| `unidade` | VARCHAR(100) | Unidade de negócio |
| `data` | DATE | Data da venda |
| `codigo` | VARCHAR(50) | Código do produto |
| `produto` | VARCHAR(255) | Nome do produto |
| `nv_produto_superior_setor` | VARCHAR(100) | Setor do produto |
| `modalidade` | VARCHAR(50) | Modalidade de venda |
| `t_consumidor` | VARCHAR(50) | Tipo de consumidor |
| `vr_un` | DECIMAL(10,2) | Valor unitário |
| `qtd` | INTEGER | Quantidade |
| `faturamento` | DECIMAL(12,2) | Faturamento total |
| `vr_acres` | DECIMAL(10,2) | Valor de acréscimo |
| `vr_liquido` | DECIMAL(12,2) | Valor líquido |
| `perc_vr_vendido` | DECIMAL(5,2) | Percentual vendido |
| `mtc` | VARCHAR(20) | Código MTC |
| `created_at` | TIMESTAMP | Data de criação |

## 🚀 Deploy

### Vercel (Recomendado)

O projeto já está configurado para deploy na Vercel:

1. Conecte seu repositório GitHub à Vercel
2. Configure as variáveis de ambiente no painel da Vercel
3. Deploy automático a cada push

### Outras Plataformas

O projeto pode ser deployado em qualquer plataforma que suporte aplicações Node.js/React:
- Netlify
- AWS Amplify
- Cloudflare Pages
- Etc.

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob licença MIT.

## 👥 Autores

- **MPBS1982** - *Desenvolvimento inicial*

## 🙏 Agradecimentos

- Supabase pela plataforma backend
- Comunidade React
- Todos os contribuidores de código aberto

---

**Desenvolvido com ❤️ usando React, TypeScript e Supabase**

