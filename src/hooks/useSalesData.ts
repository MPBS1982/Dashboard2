import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchSalesData, insertSalesData, deleteSalesData } from '../lib/supabase'
import { SalesRecord } from '../types/sales'
import { salesData } from '../mock/data'

export function useSalesData() {
  const queryClient = useQueryClient()

  const { data, isLoading, error, refetch } = useQuery<SalesRecord[]>({
    queryKey: ['salesData'],
    queryFn: async () => {
      const data = await fetchSalesData()
      // Se não houver dados do Supabase, usa dados mockados como fallback
      if (data.length === 0) {
        return salesData
      }
      return data
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  })

  const insertMutation = useMutation({
    mutationFn: insertSalesData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salesData'] })
    },
  })

  const insertSalesDataWithCallback = (records: SalesRecord[], callback?: () => void) => {
    insertMutation.mutate(records, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['salesData'] })
        if (callback) callback()
      },
    })
  }

  const deleteMutation = useMutation({
    mutationFn: deleteSalesData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salesData'] })
    },
  })

  return {
    data: data || [],
    isLoading,
    error,
    refetch,
    insertSalesData: insertSalesDataWithCallback,
    deleteSalesData: deleteMutation.mutate,
    isInserting: insertMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}

