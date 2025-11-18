import { useEffect, useMemo, useState } from 'react'
import Header from './components/Common/Header'
import KPICard from './components/Common/KPICard'
import ConnectionStatus from './components/Common/ConnectionStatus'
import SalesTrendChart from './components/Dashboard/SalesTrendChart'
import TopProductsChart from './components/Dashboard/TopProductsChart'
import SectorDistribution from './components/Dashboard/SectorDistribution'
import DataTable from './components/SalesAnalytics/DataTable'
import ProductEvolution from './components/ProductAnalysis/ProductEvolution'
import ProductRankingBySector from './components/ProductAnalysis/ProductRankingBySector'
import UnitComparison from './components/ProductAnalysis/UnitComparison'
import ProductByUnitComparison from './components/ProductAnalysis/ProductByUnitComparison'
import { formatCurrency, formatNumber } from './utils/formatters'
import XLSXInput from './components/SalesAnalytics/XLSXInput'
import { SalesRecord } from './types/sales'
import { useSalesData } from './hooks/useSalesData'

type Tab = 'overview' | 'products' | 'analytics'

export default function App() {
  const hashToTab = (): Tab => {
    const h = (window.location.hash || '#overview').replace('#', '')
    return (['overview', 'products', 'analytics'] as Tab[]).includes(h as Tab) ? (h as Tab) : 'overview'
  }
  const [tab, setTab] = useState<Tab>(hashToTab())
  
  useEffect(() => {
    // Garante que há um hash inicial
    if (!window.location.hash || window.location.hash === '#') {
      window.location.hash = '#overview'
      setTab('overview')
    }
    
    const onHash = () => {
      const newTab = hashToTab()
      setTab(newTab)
    }
    
    // Escuta mudanças no hash
    window.addEventListener('hashchange', onHash)
    
    return () => {
      window.removeEventListener('hashchange', onHash)
    }
  }, [])
  
  const navigate = (t: Tab) => {
    window.location.hash = `#${t}`
    setTab(t)
  }
  
  // Usa o hook do Supabase para buscar dados
  const { data: salesDataFromSupabase, isLoading, refetch, insertSalesData, isInserting, error: dataError } = useSalesData()
  const [records, setRecords] = useState<SalesRecord[]>([])
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState<string>('')
  
  // Atualiza os records quando os dados do Supabase são carregados
  useEffect(() => {
    if (salesDataFromSupabase && salesDataFromSupabase.length > 0) {
      setRecords(salesDataFromSupabase)
    }
  }, [salesDataFromSupabase])
  const products = useMemo(() => Array.from(new Set(records.map(r => r.produto))).filter(Boolean), [records])
  const [selectedProduct, setSelectedProduct] = useState<string>(products[0] ?? '')
  useEffect(() => {
    if (!products.includes(selectedProduct)) {
      setSelectedProduct(products[0] ?? '')
    }
  }, [products])
  const totals = useMemo(() => {
    const totalRevenue = records.reduce((s, r) => s + r.vr_liquido, 0)
    const totalUnits = records.reduce((s, r) => s + r.qtd, 0)
    const averagePrice = totalRevenue / Math.max(totalUnits, 1)
    return { totalRevenue, totalUnits, averagePrice }
  }, [records])

  return (
    <div className="min-h-screen">
      <Header tab={tab} onChange={navigate} />
      <main className="mx-auto max-w-7xl p-4 space-y-6">
        <div className="flex justify-end">
          <ConnectionStatus />
        </div>
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KPICard title="Faturamento Total" value={formatCurrency(totals.totalRevenue)} icon={<span>💰</span>} accent="success" />
              <KPICard title="Unidades Vendidas" value={formatNumber(totals.totalUnits)} icon={<span>📦</span>} />
              <KPICard title="Preço Médio" value={formatCurrency(totals.averagePrice)} icon={<span>🏷️</span>} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SalesTrendChart data={records} />
              <TopProductsChart data={records} />
            </div>
            <SectorDistribution data={records} />
          </div>
        )}

        {tab === 'products' && (
          <div className="space-y-6">
            <ProductEvolution data={records} selectedProduct={selectedProduct} onChangeProduct={setSelectedProduct} />
            <ProductRankingBySector data={records} />
            <UnitComparison data={records} selectedProduct={selectedProduct} />
            <ProductByUnitComparison data={records} selectedProduct={selectedProduct} />
          </div>
        )}

        {tab === 'analytics' && (
          <div className="space-y-6">
            {isLoading && (
              <div className="text-center py-4 text-gray-600">🔄 Carregando dados do Supabase...</div>
            )}
            <div className="space-y-3">
              {dataError && (
                <div className="text-sm text-yellow-600 bg-yellow-50 border border-yellow-200 rounded px-3 py-2">
                  ⚠️ Aviso: Erro ao carregar dados do Supabase. Usando dados mockados.
                </div>
              )}
              <XLSXInput onLoad={(newRecords) => {
                setRecords(newRecords)
                setUploadSuccess(false)
                setUploadError('')
                // Se o Supabase estiver configurado, insere os dados
                insertSalesData(
                  newRecords, 
                  () => {
                    setUploadSuccess(true)
                    setUploadError('')
                    refetch()
                    setTimeout(() => setUploadSuccess(false), 3000)
                  },
                  (error) => {
                    setUploadError(`Erro ao salvar no Supabase: ${error.message || 'Erro desconhecido'}`)
                    setTimeout(() => setUploadError(''), 5000)
                  }
                )
              }} />
              {isInserting && (
                <div className="text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded px-3 py-2">
                  💾 Salvando dados no Supabase...
                </div>
              )}
              {uploadSuccess && (
                <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded px-3 py-2">
                  ✅ Dados salvos com sucesso no Supabase!
                </div>
              )}
              {uploadError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                  ❌ {uploadError}
                </div>
              )}
            </div>
            <DataTable data={records} />
          </div>
        )}
      </main>
    </div>
  )
}