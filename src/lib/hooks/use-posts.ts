'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { queryKeys } from '@/lib/query-keys'
import type { Post } from '@/lib/database.types'
import type { Platform } from '@/lib/stores/ui-store'

export function usePosts(platform: Platform = 'all') {
  const supabase = createClient()

  return useQuery({
    queryKey: queryKeys.posts.list({ platform }),
    queryFn: async (): Promise<Post[]> => {
      let query = supabase
        .from('posts')
        .select('*')
        .order('posted_at', { ascending: false })

      if (platform !== 'all') {
        query = query.eq('platform', platform)
      }

      const { data, error } = await query

      if (error) {
        throw new Error(error.message)
      }

      return data || []
    },
  })
}

export function usePost(postId: string | null) {
  const supabase = createClient()

  return useQuery({
    queryKey: queryKeys.posts.detail(postId ?? ''),
    queryFn: async (): Promise<Post | null> => {
      if (!postId) return null

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
    enabled: !!postId,
  })
}
