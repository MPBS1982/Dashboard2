import { useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { SalesRecord } from '../../types/sales'
import { parseISO, subMonths, isAfter } from 'date-fns'

type Metric = 'faturamento' | 'vr_liquido' | 'qtd' | 'preco_medio'

export default function UnitComparison({ data, selectedProduct }: { data: SalesRecord[]; selectedProduct: string }) {
  const [months, setMonths] = useState<number>(6)
  const [metric, setMetric] = useState<Metric>('faturamento')
  const sectors = useMemo(() => Array.from(new Set(data.map(d => d.nv_produto_superior_setor))).filter(Boolean), [data])
  const modalidades = useMemo(() => Array.from(new Set(data.map(d => d.modalidade))).filter(Boolean), [data])
  const consumidores = useMemo(() => Array.from(new Set(data.map(d => d.t_consumidor))).filter(Boolean), [data])
  const [sector, setSector] = useState<string>('')
  const [modalidade, setModalidade] = useState<string>('')
  const [consumidor, setConsumidor] = useState<string>('')

  const latestDate = useMemo(() => {
    const ds = data.map(d => parseISO(d.data)).filter(d => !isNaN(d.getTime()))
    return ds.length ? ds.sort((a, b) => b.getTime() - a.getTime())[0] : new Date()
  }, [data])

  const filtered = useMemo(() => {
    const threshold = subMonths(latestDate, months)
    return data.filter(d =>
      isAfter(parseISO(d.data), threshold) &&
      (selectedProduct ? d.produto === selectedProduct : true) &&
      (sector ? d.nv_produto_superior_setor === sector : true) &&
      (modalidade ? d.modalidade === modalidade : true) &&
      (consumidor ? d.t_consumidor === consumidor : true)
    )
  }, [data, months, latestDate, selectedProduct, sector, modalidade, consumidor])

  const chartData = useMemo(() => {
    const map = new Map<string, { qtd: number; faturamento: number; vr_liquido: number; sumPriceQty: number }>()
    for (const r of filtered) {
      const m = map.get(r.unidade) || { qtd: 0, faturamento: 0, vr_liquido: 0, sumPriceQty: 0 }
      m.qtd += r.qtd
      m.faturamento += r.faturamento
      m.vr_liquido += r.vr_liquido
      m.sumPriceQty += r.vr_un * r.qtd
      map.set(r.unidade, m)
    }
    const rows = Array.from(map.entries()).map(([unidade, agg]) => ({
      unidade,
      qtd: agg.qtd,
      faturamento: agg.faturamento,
      vr_liquido: agg.vr_liquido,
      preco_medio: agg.qtd > 0 ? agg.sumPriceQty / agg.qtd : 0,
    }))
    return rows.sort((a, b) => (b[metric] as number) - (a[metric] as number))
  }, [filtered, metric])

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">Comparativo por Unidade</div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Produto: {selectedProduct || 'Todos'}</span>
          <select className="border rounded px-2 py-1" value={sector} onChange={e => setSector(e.target.value)}>
            <option value="">Todos os setores</option>
            {sectors.map(s => (<option key={s} value={s}>{s}</option>))}
          </select>
          <select className="border rounded px-2 py-1" value={modalidade} onChange={e => setModalidade(e.target.value)}>
            <option value="">Todas as modalidades</option>
            {modalidades.map(m => (<option key={m} value={m}>{m}</option>))}
          </select>
          <select className="border rounded px-2 py-1" value={consumidor} onChange={e => setConsumidor(e.target.value)}>
            <option value="">Todos os consumidores</option>
            {consumidores.map(c => (<option key={c} value={c}>{c}</option>))}
          </select>
          <select className="border rounded px-2 py-1" value={months} onChange={e => setMonths(Number(e.target.value))}>
            <option value={3}>3 meses</option>
            <option value={6}>6 meses</option>
            <option value={12}>12 meses</option>
          </select>
          <select className="border rounded px-2 py-1" value={metric} onChange={e => setMetric(e.target.value as Metric)}>
            <option value="qtd">Qtd.</option>
            <option value="faturamento">Faturamento</option>
            <option value="vr_liquido">Vr. Líquido</option>
            <option value="preco_medio">Preço Médio</option>
          </select>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="unidade" tick={{ fontSize: 12 }} interval={0} height={50} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={metric} fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}