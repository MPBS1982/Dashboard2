import { useState } from 'react'
import * as XLSX from 'xlsx'
import { SalesRecord } from '../../types/sales'
import { parseNumberBR } from '../../utils/formatters'

const toISODate = (val: any) => {
  if (typeof val === 'number') {
    const epoch = new Date(Math.round((val - 25569) * 86400 * 1000))
    return epoch.toISOString().slice(0, 10)
  }
  const d = new Date(val)
  return isNaN(d.getTime()) ? String(val ?? '') : d.toISOString().slice(0, 10)
}

export default function XLSXInput({ onLoad }: { onLoad: (rows: SalesRecord[]) => void }) {
  const [name, setName] = useState('')
  const [count, setCount] = useState(0)
  const handleFile = async (file: File) => {
    const buf = await file.arrayBuffer()
    const wb = XLSX.read(buf, { cellDates: true })
    const sheet = wb.Sheets[wb.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: '' })
    const data: SalesRecord[] = rows.map((row) => ({
      id: crypto.randomUUID(),
      unidade: row['Unidade'] ?? '',
      data: toISODate(row['Data']),
      codigo: row['Código'] ?? '',
      produto: row['Produto'] ?? '',
      nv_produto_superior_setor: row['Nv. de Produto Superior - setor'] ?? '',
      modalidade: row['Modalidade'] ?? '',
      t_consumidor: row['T. Consumidor'] ?? '',
      vr_un: parseNumberBR(row['Vr. Un.']),
      qtd: Math.round(parseNumberBR(row['Qtd.'])),
      faturamento: parseNumberBR(row['Faturamento']),
      vr_acres: parseNumberBR(row['Vr. Acrés.']),
      vr_liquido: parseNumberBR(row['Vr. Líquido']),
      perc_vr_vendido: parseNumberBR(row['% Vr. Vendido']),
      mtc: row['MTC'] ?? '',
      created_at: toISODate(row['Data']) || new Date().toISOString(),
    }))
    setName(file.name)
    setCount(data.length)
    onLoad(data)
  }
  return (
    <div className="flex items-center gap-3">
      <label className="inline-flex items-center gap-2 bg-primary text-white rounded px-3 py-2 cursor-pointer">
        <span>Carregar XLSX</span>
        <input className="hidden" type="file" accept=".xlsx,.xls" onChange={e => e.target.files && handleFile(e.target.files[0])} />
      </label>
      {name && <span className="text-sm text-gray-600">{name} • {count} registros</span>}
    </div>
  )
}