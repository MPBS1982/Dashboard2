import { useMemo, useState } from 'react'
import { formatCurrency, formatNumber, formatPercent } from '../../utils/formatters'
import FilterBar, { Filters } from './FilterBar'
import { SalesRecord } from '../../types/sales'

const headers = [
  'Unidade',
  'Data',
  'Código',
  'Produto',
  'Nv. de Produto Superior - setor',
  'Modalidade',
  'T. Consumidor',
  'Vr. Un.',
  'Qtd.',
  'Faturamento',
  'Vr. Acrés.',
  'Vr. Líquido',
  '% Vr. Vendido',
  'MTC',
]

export default function DataTable({ data }: { data: SalesRecord[] }) {
  const [filters, setFilters] = useState<Filters>({})
  const filtered = useMemo(() => {
    return data.filter(r => {
      const fromOk = filters.dateFrom ? r.data >= filters.dateFrom : true
      const toOk = filters.dateTo ? r.data <= filters.dateTo : true
      const prodOk = filters.produto ? r.produto.toLowerCase().includes(filters.produto.toLowerCase()) : true
      const setorOk = filters.setor ? r.nv_produto_superior_setor.toLowerCase().includes(filters.setor.toLowerCase()) : true
      const unidadeOk = filters.unidade ? r.unidade.toLowerCase().includes(filters.unidade.toLowerCase()) : true
      return fromOk && toOk && prodOk && setorOk && unidadeOk
    })
  }, [filters, data])

  const [pageSize, setPageSize] = useState<number>(100)
  const [page, setPage] = useState<number>(1)
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * pageSize
  const end = start + pageSize
  const paged = filtered.slice(start, end)

  return (
    <div className="space-y-4">
      <FilterBar onChange={f => { setFilters(f); setPage(1) }} />
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">{filtered.length} registros</div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Linhas por página</label>
          <select className="border rounded px-2 py-1" value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
          <button className="border rounded px-2 py-1" onClick={() => setPage(Math.max(1, currentPage - 1))}>Anterior</button>
          <span className="text-sm text-gray-600">{currentPage} / {totalPages}</span>
          <button className="border rounded px-2 py-1" onClick={() => setPage(Math.min(totalPages, currentPage + 1))}>Próxima</button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow overflow-auto">
        <table className="min-w-full text-xs md:text-sm">
          <thead className="sticky top-0 bg-gray-100">
            <tr>
              {headers.map(h => (
                <th key={h} className="text-left font-semibold text-gray-600 px-3 py-2 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map(r => (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2">{r.unidade}</td>
                <td className="px-3 py-2">{r.data}</td>
                <td className="px-3 py-2">{r.codigo}</td>
                <td className="px-3 py-2">{r.produto}</td>
                <td className="px-3 py-2">{r.nv_produto_superior_setor}</td>
                <td className="px-3 py-2">{r.modalidade}</td>
                <td className="px-3 py-2">{r.t_consumidor}</td>
                <td className="px-3 py-2">{formatCurrency(r.vr_un)}</td>
                <td className="px-3 py-2">{formatNumber(r.qtd)}</td>
                <td className="px-3 py-2">{formatCurrency(r.faturamento)}</td>
                <td className="px-3 py-2">{formatCurrency(r.vr_acres)}</td>
                <td className="px-3 py-2">{formatCurrency(r.vr_liquido)}</td>
                <td className="px-3 py-2">{formatPercent(r.perc_vr_vendido)}</td>
                <td className="px-3 py-2">{r.mtc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}