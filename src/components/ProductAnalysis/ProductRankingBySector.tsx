import { useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { SalesRecord } from '../../types/sales'

export default function ProductRankingBySector({ data }: { data: SalesRecord[] }) {
  const sectors = useMemo(() => Array.from(new Set(data.map(d => d.nv_produto_superior_setor))).filter(Boolean), [data])
  const [sector, setSector] = useState<string>(sectors[0] ?? '')
  const [productQuery, setProductQuery] = useState('')

  const chartData = useMemo(() => {
    const rows = data.filter(d => (sector ? d.nv_produto_superior_setor === sector : true))
    const grouped = rows.reduce<Record<string, number>>((acc, cur) => {
      acc[cur.produto] = (acc[cur.produto] || 0) + cur.qtd
      return acc
    }, {})
    return Object.entries(grouped)
      .map(([produto, qtd]) => ({ produto, qtd }))
      .filter(r => r.produto.toLowerCase().includes(productQuery.toLowerCase()))
      .sort((a, b) => b.qtd - a.qtd)
      .slice(0, 30)
  }, [data, sector, productQuery])

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">Ranking de Produtos Mais Vendidos por Setor (Top 30)</div>
        <div className="flex items-center gap-2">
          <input className="border rounded px-2 py-1" placeholder="Buscar produto" value={productQuery} onChange={e => setProductQuery(e.target.value)} />
          <select className="border rounded px-2 py-1" value={sector} onChange={e => setSector(e.target.value)}>
            {sectors.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="produto" width={180} />
            <Tooltip />
            <Bar dataKey="qtd" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}