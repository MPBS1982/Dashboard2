import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { SalesRecord } from '../../types/sales'
import { parseISO, format } from 'date-fns'
import { useState } from 'react'

type Granularity = 'day' | 'month'

export default function SalesTrendChart({ data }: { data: SalesRecord[] }) {
  const [granularity, setGranularity] = useState<Granularity>('day')
  const chartData = Object.values(
    data.reduce<Record<string, { date: string; revenue: number }>>((acc, cur) => {
      const d = parseISO(cur.data)
      const key = granularity === 'month' ? format(d, 'yyyy-MM') : format(d, 'yyyy-MM-dd')
      acc[key] = acc[key] || { date: key, revenue: 0 }
      acc[key].revenue += cur.vr_liquido
      return acc
    }, {})
  ).sort((a, b) => a.date.localeCompare(b.date))
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-500">Tendência de Faturamento</div>
        <select className="border rounded px-2 py-1" value={granularity} onChange={e => setGranularity(e.target.value as Granularity)}>
          <option value="day">Dia</option>
          <option value="month">Mês</option>
        </select>
      </div>
      <div className="h-56 md:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}