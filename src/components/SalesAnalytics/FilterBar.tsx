import { useState } from 'react'

export type Filters = {
  dateFrom?: string
  dateTo?: string
  produto?: string
  setor?: string
  unidade?: string
}

export default function FilterBar({ onChange }: { onChange: (f: Filters) => void }) {
  const [filters, setFilters] = useState<Filters>({})
  const update = (f: Partial<Filters>) => {
    const next = { ...filters, ...f }
    setFilters(next)
    onChange(next)
  }
  return (
    <div className="bg-white rounded-lg shadow p-4 grid md:grid-cols-5 gap-3">
      <input className="border rounded px-2 py-1" type="date" onChange={e => update({ dateFrom: e.target.value })} />
      <input className="border rounded px-2 py-1" type="date" onChange={e => update({ dateTo: e.target.value })} />
      <input className="border rounded px-2 py-1" placeholder="Produto" onChange={e => update({ produto: e.target.value })} />
      <input className="border rounded px-2 py-1" placeholder="Setor" onChange={e => update({ setor: e.target.value })} />
      <input className="border rounded px-2 py-1" placeholder="Unidade" onChange={e => update({ unidade: e.target.value })} />
    </div>
  )
}