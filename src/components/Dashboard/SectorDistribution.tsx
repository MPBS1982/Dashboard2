import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { SalesRecord } from '../../types/sales'

export default function SectorDistribution({ data }: { data: SalesRecord[] }) {
  const grouped = data.reduce<Record<string, number>>((acc, cur) => {
    const key = cur.nv_produto_superior_setor
    acc[key] = (acc[key] || 0) + cur.vr_liquido
    return acc
  }, {})

  const chartData = Object.entries(grouped).map(([name, value]) => ({ name, value }))
const colors = ['#2563eb', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6']

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="text-sm text-gray-500 mb-2">Distribuição por Setor</div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={100}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}