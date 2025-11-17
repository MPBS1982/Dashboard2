import { useState } from 'react'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

type Format = 'csv' | 'xlsx' | 'pdf'

export default function ExportButton({ rows, filenameBase = 'dados', columns }: { rows: Record<string, any>[]; filenameBase?: string; columns?: string[] }) {
  const [format, setFormat] = useState<Format>('csv')
  const cols = columns && columns.length ? columns : (rows[0] ? Object.keys(rows[0]) : [])

  const exportCSV = () => {
    if (!rows.length || !cols.length) return
    const escape = (val: any) => {
      const s = String(val ?? '')
      const needs = /[",\n]/.test(s)
      const escaped = s.replace(/"/g, '""')
      return needs ? `"${escaped}"` : escaped
    }
    const header = cols.join(',')
    const body = rows.map(r => cols.map(c => escape(r[c])).join(',')).join('\n')
    const csv = `${header}\n${body}`
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filenameBase}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportXLSX = () => {
    if (!rows.length || !cols.length) return
    const data = rows.map(r => Object.fromEntries(cols.map(c => [c, r[c]])))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Dados')
    XLSX.writeFile(wb, `${filenameBase}.xlsx`)
  }

  const exportPDF = () => {
    if (!rows.length || !cols.length) return
    const doc = new jsPDF()
    autoTable(doc, { head: [cols], body: rows.map(r => cols.map(c => r[c])) })
    doc.save(`${filenameBase}.pdf`)
  }

  const run = () => {
    if (format === 'csv') return exportCSV()
    if (format === 'xlsx') return exportXLSX()
    return exportPDF()
  }

  return (
    <div className="flex items-center gap-2">
      <select className="border rounded px-2 py-1" value={format} onChange={e => setFormat(e.target.value as Format)}>
        <option value="csv">CSV</option>
        <option value="xlsx">XLSX</option>
        <option value="pdf">PDF</option>
      </select>
      <button className="border rounded px-3 py-2" onClick={run}>Exportar</button>
    </div>
  )
}