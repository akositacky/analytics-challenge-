export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          user_id: string
          platform: 'instagram' | 'tiktok'
          caption: string | null
          thumbnail_url: string | null
          media_type: 'image' | 'video' | 'carousel'
          posted_at: string
          likes: number
          comments: number
          shares: number
          saves: number
          reach: number
          impressions: number
          engagement_rate: number | null
          permalink: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: 'instagram' | 'tiktok'
          caption?: string | null
          thumbnail_url?: string | null
          media_type: 'image' | 'video' | 'carousel'
          posted_at: string
          likes?: number
          comments?: number
          shares?: number
          saves?: number
          reach?: number
          impressions?: number
          engagement_rate?: number | null
          permalink?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          platform?: 'instagram' | 'tiktok'
          caption?: string | null
          thumbnail_url?: string | null
          media_type?: 'image' | 'video' | 'carousel'
          posted_at?: string
          likes?: number
          comments?: number
          shares?: number
          saves?: number
          reach?: number
          impressions?: number
          engagement_rate?: number | null
          permalink?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      daily_metrics: {
        Row: {
          id: string
          user_id: string
          date: string
          engagement: number
          reach: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          engagement?: number
          reach?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          engagement?: number
          reach?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_metrics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Post = Database['public']['Tables']['posts']['Row']
export type PostInsert = Database['public']['Tables']['posts']['Insert']
export type PostUpdate = Database['public']['Tables']['posts']['Update']

export type DailyMetric = Database['public']['Tables']['daily_metrics']['Row']
export type DailyMetricInsert = Database['public']['Tables']['daily_metrics']['Insert']
export type DailyMetricUpdate = Database['public']['Tables']['daily_metrics']['Update']
