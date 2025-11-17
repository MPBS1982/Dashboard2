import { useEffect, useMemo, useState } from 'react'
import Header from './components/Common/Header'
import KPICard from './components/Common/KPICard'
import SalesTrendChart from './components/Dashboard/SalesTrendChart'
import TopProductsChart from './components/Dashboard/TopProductsChart'
import SectorDistribution from './components/Dashboard/SectorDistribution'
import DataTable from './components/SalesAnalytics/DataTable'
import ProductEvolution from './components/ProductAnalysis/ProductEvolution'
import ProductRankingBySector from './components/ProductAnalysis/ProductRankingBySector'
import UnitComparison from './components/ProductAnalysis/UnitComparison'
import ProductByUnitComparison from './components/ProductAnalysis/ProductByUnitComparison'
import { salesData } from './mock/data'
import { formatCurrency, formatNumber } from './utils/formatters'
import XLSXInput from './components/SalesAnalytics/XLSXInput'
import { SalesRecord } from './types/sales'

type Tab = 'overview' | 'products' | 'analytics'

export default function App() {
  const hashToTab = (): Tab => {
    const h = (location.hash || '#overview').replace('#', '')
    return (['overview', 'products', 'analytics'] as Tab[]).includes(h as Tab) ? (h as Tab) : 'overview'
  }
  const [tab, setTab] = useState<Tab>(hashToTab())
  useEffect(() => {
    const onHash = () => setTab(hashToTab())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const navigate = (t: Tab) => {
    location.hash = `#${t}`
    setTab(t)
  }
  const [records, setRecords] = useState<SalesRecord[]>(salesData)
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
            <XLSXInput onLoad={setRecords} />
            <DataTable data={records} />
          </div>
        )}
      </main>
    </div>
  )
}