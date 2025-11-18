import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [recordCount, setRecordCount] = useState<number | null>(null)

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error, count } = await supabase
          .from('sales_data')
          .select('id', { count: 'exact', head: true })

        if (error) {
          setIsConnected(false)
          return
        }

        setIsConnected(true)
        setRecordCount(count || 0)
      } catch (error) {
        setIsConnected(false)
      }
    }

    checkConnection()
  }, [])

  if (isConnected === null) {
    return null
  }

  if (!isConnected) {
    return (
      <div className="text-xs text-gray-500 px-2 py-1 bg-yellow-50 rounded">
        ⚠️ Usando dados mockados (Supabase não conectado)
      </div>
    )
  }

  return (
    <div className="text-xs text-gray-500 px-2 py-1 bg-green-50 rounded">
      ✅ Conectado ao Supabase • {recordCount !== null ? `${recordCount} registros` : 'Verificando...'}
    </div>
  )
}

