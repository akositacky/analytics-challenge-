import type { Platform } from './stores/ui-store'

// Query key factory pattern for TanStack Query
export const queryKeys = {
  posts: {
    all: ['posts'] as const,
    list: (filters: { platform?: Platform }) => 
      [...queryKeys.posts.all, 'list', filters] as const,
    detail: (id: string) => 
      [...queryKeys.posts.all, 'detail', id] as const,
  },
  metrics: {
    all: ['metrics'] as const,
    daily: (days?: number) => 
      [...queryKeys.metrics.all, 'daily', days ?? 30] as const,
  },
  analytics: {
    all: ['analytics'] as const,
    summary: () => 
      [...queryKeys.analytics.all, 'summary'] as const,
  },
} as const
