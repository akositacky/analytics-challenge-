'use client'

import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'

export interface AnalyticsSummary {
  totalEngagement: number
  averageEngagementRate: number
  topPerformingPost: {
    id: string
    caption: string | null
    engagement: number
    platform: string
  } | null
  trendPercentage: number
  trendDirection: 'up' | 'down' | 'neutral'
  postsCount: number
}

interface SummaryResponse {
  data: AnalyticsSummary
  error?: string
}

export function useAnalyticsSummary() {
  return useQuery({
    queryKey: queryKeys.analytics.summary(),
    queryFn: async (): Promise<AnalyticsSummary> => {
      const response = await fetch('/api/analytics/summary')
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch analytics summary')
      }

      const result: SummaryResponse = await response.json()
      return result.data
    },
  })
}
