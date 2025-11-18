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
  const { data: salesDataFromSupabase, isLoading, refetch, insertSalesData, isInserting } = useSalesData()
  const [records, setRecords] = useState<SalesRecord[]>([])
  const [uploadSuccess, setUploadSuccess] = useState(false)
  
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
              <XLSXInput onLoad={(newRecords) => {
                setRecords(newRecords)
                setUploadSuccess(false)
                // Se o Supabase estiver configurado, insere os dados
                insertSalesData(newRecords, () => {
                  setUploadSuccess(true)
                  refetch()
                  setTimeout(() => setUploadSuccess(false), 3000)
                })
              }} />
              {isInserting && (
                <div className="text-sm text-blue-600">💾 Salvando dados no Supabase...</div>
              )}
              {uploadSuccess && (
                <div className="text-sm text-green-600">✅ Dados salvos com sucesso no Supabase!</div>
              )}
            </div>
            <DataTable data={records} />
          </div>
        )}
      </main>
    </div>
  )
}