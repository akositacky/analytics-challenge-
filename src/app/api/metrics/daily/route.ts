import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit, getRateLimitHeaders, rateLimitConfigs } from '@/lib/utils/rate-limiter'

// Edge runtime for low latency
// NOTE: For production edge deployments, use Upstash Redis for rate limiting
// as in-memory storage doesn't persist across edge locations
export const runtime = 'edge'

/**
 * Simple request logger for Edge runtime
 * (Full logger uses Node.js APIs not available in Edge)
 */
function logEdgeRequest(data: {
  method: string
  path: string
  status: number
  duration: number
  userId?: string
  error?: string
}) {
  const timestamp = new Date().toISOString()
  const statusEmoji = data.status >= 500 ? '🔴' : data.status >= 400 ? '🟡' : '🟢'
  console.log(
    `[${timestamp}] ${statusEmoji} EDGE | ${data.method} ${data.path} | ${data.status} | ${data.duration}ms${data.userId ? ` | user:${data.userId.slice(0, 8)}...` : ''}${data.error ? ` | error: ${data.error}` : ''}`
  )
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const path = request.nextUrl.pathname

  try {
    const supabase = await createClient()

    // Validate authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      logEdgeRequest({
        method: 'GET',
        path,
        status: 401,
        duration: Date.now() - startTime,
        error: 'Unauthorized'
      })
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check rate limit using user ID as identifier
    const rateLimitResult = checkRateLimit(
      `metrics:${user.id}`,
      rateLimitConfigs.standard
    )

    if (!rateLimitResult.allowed) {
      logEdgeRequest({
        method: 'GET',
        path,
        status: 429,
        duration: Date.now() - startTime,
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

    // Parse and validate query params
    const searchParams = request.nextUrl.searchParams
    const daysParam = searchParams.get('days')
    
    // Validate days parameter
    let days = 30 // default
    if (daysParam) {
      const parsedDays = parseInt(daysParam, 10)
      if (isNaN(parsedDays) || parsedDays < 1 || parsedDays > 365) {
        logEdgeRequest({
          method: 'GET',
          path,
          status: 400,
          duration: Date.now() - startTime,
          userId: user.id,
          error: 'Invalid days parameter'
        })
        return NextResponse.json(
          { error: 'Invalid days parameter. Must be between 1 and 365.' },
          { 
            status: 400,
            headers: getRateLimitHeaders(rateLimitResult)
          }
        )
      }
      days = parsedDays
    }

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000)

    // Fetch daily metrics for the user
    const { data: metrics, error: metricsError } = await supabase
      .from('daily_metrics')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date', { ascending: true })

    if (metricsError) {
      logEdgeRequest({
        method: 'GET',
        path,
        status: 500,
        duration: Date.now() - startTime,
        userId: user.id,
        error: metricsError.message
      })
      return NextResponse.json(
        { error: 'Failed to fetch daily metrics' },
        { 
          status: 500,
          headers: getRateLimitHeaders(rateLimitResult)
        }
      )
    }

    // Log successful request
    logEdgeRequest({
      method: 'GET',
      path,
      status: 200,
      duration: Date.now() - startTime,
      userId: user.id
    })

    // Return empty array if no data (handled gracefully)
    return NextResponse.json({
      data: metrics || []
    }, {
      headers: getRateLimitHeaders(rateLimitResult)
    })
  } catch (error) {
    logEdgeRequest({
      method: 'GET',
      path,
      status: 500,
      duration: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
