import { createClient } from '@supabase/supabase-js'
import { SalesRecord } from '../types/sales'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Using mock data.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function fetchSalesData(): Promise<SalesRecord[]> {
  // Se as credenciais não estiverem configuradas, retorna array vazio
  // O App.tsx vai usar dados mockados como fallback
  if (!supabaseUrl || !supabaseAnonKey) {
    return []
  }

  try {
    const { data, error } = await supabase
      .from('sales_data')
      .select('*')
      .order('data', { ascending: false })

    if (error) {
      console.error('Error fetching sales data:', error)
      return []
    }

    return (data || []).map((record) => ({
      id: record.id,
      unidade: record.unidade,
      data: record.data,
      codigo: record.codigo,
      produto: record.produto,
      nv_produto_superior_setor: record.nv_produto_superior_setor,
      modalidade: record.modalidade,
      t_consumidor: record.t_consumidor,
      vr_un: parseFloat(record.vr_un) || 0,
      qtd: parseInt(record.qtd) || 0,
      faturamento: parseFloat(record.faturamento) || 0,
      vr_acres: parseFloat(record.vr_acres) || 0,
      vr_liquido: parseFloat(record.vr_liquido) || 0,
      perc_vr_vendido: parseFloat(record.perc_vr_vendido) || 0,
      mtc: record.mtc || '',
      created_at: record.created_at || new Date().toISOString(),
    })) as SalesRecord[]
  } catch (error) {
    console.error('Error fetching sales data:', error)
    return []
  }
}

export async function insertSalesData(records: SalesRecord[]): Promise<boolean> {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase not configured. Cannot insert data.')
    return false
  }

  try {
    const { error } = await supabase
      .from('sales_data')
      .insert(records.map(({ id, ...record }) => record))

    if (error) {
      console.error('Error inserting sales data:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error inserting sales data:', error)
    return false
  }
}

export async function deleteSalesData(id: string): Promise<boolean> {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase not configured. Cannot delete data.')
    return false
  }

  try {
    const { error } = await supabase
      .from('sales_data')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting sales data:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting sales data:', error)
    return false
  }
}

