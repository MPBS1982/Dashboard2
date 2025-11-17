import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { SalesRecord } from '../../types/sales'
import { useMemo, useState } from 'react'
import { parseISO, subMonths, isAfter } from 'date-fns'

export default function ProductEvolution({ data, selectedProduct, onChangeProduct }: { data: SalesRecord[]; selectedProduct: string; onChangeProduct: (p: string) => void }) {
  const products = useMemo(() => Array.from(new Set(data.map(d => d.produto))).filter(Boolean), [data])
  const [months, setMonths] = useState<number>(6)
  const [productQuery, setProductQuery] = useState('')

  const latestDate = useMemo(() => {
    const ds = data.map(d => parseISO(d.data)).filter(d => !isNaN(d.getTime()))
    return ds.length ? ds.sort((a, b) => b.getTime() - a.getTime())[0] : new Date()
  }, [data])

  const filtered = useMemo(() => {
    const threshold = subMonths(latestDate, months)
    return data.filter(d => d.produto === selectedProduct && isAfter(parseISO(d.data), threshold))
  }, [data, selectedProduct, months, latestDate])

  const dates = useMemo(() => Array.from(new Set(filtered.map(d => d.data))).sort(), [filtered])

  const chartData = useMemo(() => dates.map(date => {
    const qty = filtered.filter(x => x.data === date).reduce((s, r) => s + r.qtd, 0)
    return { date, qty }
  }), [dates, filtered])

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-500">Evolução de Produto por Quantidade</div>
        <div className="flex items-center gap-2">
          <input className="border rounded px-2 py-1" placeholder="Buscar produto" value={productQuery} onChange={e => setProductQuery(e.target.value)} />
          <select className="border rounded px-2 py-1" value={selectedProduct} onChange={e => onChangeProduct(e.target.value)}>
            {products.filter(p => p.toLowerCase().includes(productQuery.toLowerCase())).map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select className="border rounded px-2 py-1" value={months} onChange={e => setMonths(Number(e.target.value))}>
            <option value={3}>3 meses</option>
            <option value={6}>6 meses</option>
            <option value={12}>12 meses</option>
          </select>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="qty" stroke="#2563eb" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}