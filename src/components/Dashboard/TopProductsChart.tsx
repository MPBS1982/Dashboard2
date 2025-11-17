import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { SalesRecord } from '../../types/sales'

export default function TopProductsChart({ data }: { data: SalesRecord[] }) {
  const grouped = data.reduce<Record<string, number>>((acc, cur) => {
    acc[cur.produto] = (acc[cur.produto] || 0) + cur.faturamento
    return acc
  }, {})

  const chartData = Object.entries(grouped)
    .map(([produto, faturamento]) => ({ produto, faturamento }))
    .sort((a, b) => b.faturamento - a.faturamento)
    .slice(0, 10)
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="text-sm text-gray-500 mb-2">Top Produtos por Faturamento</div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="produto" tick={{ fontSize: 12 }} interval={0} height={60} angle={-15} dy={20} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="faturamento" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}