'use client'

import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import type { DailyMetric } from '@/lib/database.types'

interface DailyMetricsResponse {
  data: DailyMetric[]
  error?: string
}

export function useDailyMetrics(days: number = 30) {
  return useQuery({
    queryKey: queryKeys.metrics.daily(days),
    queryFn: async (): Promise<DailyMetric[]> => {
      const response = await fetch(`/api/metrics/daily?days=${days}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch daily metrics')
      }

      const result: DailyMetricsResponse = await response.json()
      return result.data || []
    },
  })
}
