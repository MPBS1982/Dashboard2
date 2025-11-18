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
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleFile = async (file: File) => {
    setError('')
    setIsLoading(true)
    
    try {
      // Validação do tipo de arquivo
      if (!file.name.match(/\.(xlsx|xls)$/i)) {
        throw new Error('Por favor, selecione um arquivo Excel (.xlsx ou .xls)')
      }

      // Validação do tamanho (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('O arquivo é muito grande. Tamanho máximo: 10MB')
      }

      const buf = await file.arrayBuffer()
      const wb = XLSX.read(buf, { cellDates: true })
      
      if (!wb.SheetNames || wb.SheetNames.length === 0) {
        throw new Error('O arquivo não contém planilhas válidas')
      }

      const sheet = wb.Sheets[wb.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: '' })
      
      if (!rows || rows.length === 0) {
        throw new Error('O arquivo está vazio ou não contém dados válidos')
      }

      const data: SalesRecord[] = rows.map((row) => ({
        id: crypto.randomUUID(),
        unidade: String(row['Unidade'] ?? ''),
        data: toISODate(row['Data']),
        codigo: String(row['Código'] ?? ''),
        produto: String(row['Produto'] ?? ''),
        nv_produto_superior_setor: String(row['Nv. de Produto Superior - setor'] ?? ''),
        modalidade: String(row['Modalidade'] ?? ''),
        t_consumidor: String(row['T. Consumidor'] ?? ''),
        vr_un: parseNumberBR(row['Vr. Un.']),
        qtd: Math.round(parseNumberBR(row['Qtd.'])),
        faturamento: parseNumberBR(row['Faturamento']),
        vr_acres: parseNumberBR(row['Vr. Acrés.']),
        vr_liquido: parseNumberBR(row['Vr. Líquido']),
        perc_vr_vendido: parseNumberBR(row['% Vr. Vendido']),
        mtc: String(row['MTC'] ?? ''),
        created_at: toISODate(row['Data']) || new Date().toISOString(),
      }))

      setName(file.name)
      setCount(data.length)
      onLoad(data)
    } catch (err: any) {
      const errorMessage = err?.message || 'Erro ao processar o arquivo. Verifique se o formato está correto.'
      setError(errorMessage)
      console.error('Erro ao processar arquivo XLSX:', err)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <label className={`inline-flex items-center gap-2 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary cursor-pointer'} text-white rounded px-3 py-2`}>
          {isLoading ? (
            <>
              <span>⏳ Processando...</span>
            </>
          ) : (
            <>
              <span>📁 Carregar XLSX</span>
              <input 
                className="hidden" 
                type="file" 
                accept=".xlsx,.xls" 
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0])
                  }
                }}
                disabled={isLoading}
              } 
              disabled={isLoading}
              />
            </>
          )}
        </label>
        {name && !error && (
          <span className="text-sm text-gray-600">
            ✅ {name} • {count} registro{count !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          ❌ {error}
        </div>
      )}
    </div>
  )
}