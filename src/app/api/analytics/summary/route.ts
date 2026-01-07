import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit, getRateLimitHeaders, rateLimitConfigs } from '@/lib/utils/rate-limiter'
import { createRequestLogger } from '@/lib/utils/request-logger'

// Type for the database function response
interface UserSummaryResult {
  total_engagement: number
  average_engagement_rate: number
  posts_count: number
  top_post_id: string | null
  top_post_caption: string | null
  top_post_engagement: number
  top_post_platform: string | null
  trend_percentage: number
  trend_direction: 'up' | 'down' | 'neutral'
}

export async function GET(request: NextRequest) {
  // Initialize request logger
  const logger = createRequestLogger(request)
  
  try {
    const supabase = await createClient()

    // Validate authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      logger.log({ status: 401, error: 'Unauthorized' })
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check rate limit using user ID as identifier
    const rateLimitResult = checkRateLimit(
      `analytics:${user.id}`,
      rateLimitConfigs.analytics
    )

    if (!rateLimitResult.allowed) {
      logger.log({ 
        status: 429, 
        userId: user.id, 
        error: 'Rate limit exceeded' 
      })
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult)
        }
      )
    }

    // Call the database helper function - single optimized query!
    // Don't use .single() because empty result (no posts) returns 0 rows
    const { data: summaryData, error: summaryError } = await supabase
      .rpc('get_user_summary', { user_uuid: user.id })

    if (summaryError) {
      logger.log({ 
        status: 500, 
        userId: user.id, 
        error: summaryError.message 
      })
      return NextResponse.json(
        { error: 'Failed to fetch analytics summary' },
        { 
          status: 500,
          headers: getRateLimitHeaders(rateLimitResult)
        }
      )
    }

    // Handle empty state - user has no posts (function returns empty array)
    const firstRow = Array.isArray(summaryData) ? summaryData[0] : summaryData
    if (!firstRow || firstRow.posts_count === 0) {
      logger.log({ 
        status: 200, 
        userId: user.id, 
        metadata: { postsCount: 0 } 
      })
      return NextResponse.json({
        data: {
          totalEngagement: 0,
          averageEngagementRate: 0,
          topPerformingPost: null,
          trendPercentage: 0,
          trendDirection: 'neutral' as const,
          postsCount: 0,
        }
      }, {
        headers: getRateLimitHeaders(rateLimitResult)
      })
    }

    // Type cast the result
    const summary = firstRow as UserSummaryResult

    // Log successful request
    logger.log({ 
      status: 200, 
      userId: user.id, 
      metadata: { 
        postsCount: summary.posts_count, 
        totalEngagement: summary.total_engagement 
      } 
    })

    // Transform database response to API response format
    return NextResponse.json({
      data: {
        totalEngagement: summary.total_engagement,
        averageEngagementRate: Number(summary.average_engagement_rate),
        topPerformingPost: summary.top_post_id ? {
          id: summary.top_post_id,
          caption: summary.top_post_caption,
          engagement: summary.top_post_engagement,
          platform: summary.top_post_platform,
        } : null,
        trendPercentage: Number(summary.trend_percentage),
        trendDirection: summary.trend_direction,
        postsCount: summary.posts_count,
      }
    }, {
      headers: getRateLimitHeaders(rateLimitResult)
    })
  } catch (error) {
    logger.log({ 
      status: 500, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
