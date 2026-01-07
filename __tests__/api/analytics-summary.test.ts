/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server'

// Mock data
const mockUser = { id: 'test-user-id', email: 'test@example.com' }

// Mock summary data that the database function would return
const mockSummaryData = {
  total_engagement: 710,
  average_engagement_rate: 10.25,
  posts_count: 2,
  top_post_id: 'post-2',
  top_post_caption: 'Test post 2',
  top_post_engagement: 580,
  top_post_platform: 'tiktok',
  trend_percentage: 5.5,
  trend_direction: 'up',
}

// Create mock Supabase client
// RPC now returns array directly (no .single()) to handle empty results
const createMockSupabase = (options: {
  user?: typeof mockUser | null
  authError?: Error | null
  summaryData?: typeof mockSummaryData | null
  summaryError?: Error | null
}) => ({
  auth: {
    getUser: jest.fn().mockResolvedValue({
      data: { user: options.user ?? null },
      error: options.authError ?? null,
    }),
  },
  rpc: jest.fn().mockResolvedValue({
    // Return as array - empty array for no data, single-item array for data
    data: options.summaryData ? [options.summaryData] : [],
    error: options.summaryError ?? null,
  }),
})

// Mock the server client
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

import { GET } from '@/app/api/analytics/summary/route'
import { createClient } from '@/lib/supabase/server'

describe('GET /api/analytics/summary', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 401 when user is not authenticated', async () => {
    // Mock: No user
    ;(createClient as jest.Mock).mockResolvedValue(
      createMockSupabase({ user: null })
    )

    const mockRequest = new NextRequest('http://localhost:3000/api/analytics/summary')
    const response = await GET(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('should return 401 when there is an auth error', async () => {
    // Mock: Auth error
    ;(createClient as jest.Mock).mockResolvedValue(
      createMockSupabase({ 
        user: null, 
        authError: new Error('Auth failed') 
      })
    )

    const mockRequest = new NextRequest('http://localhost:3000/api/analytics/summary')
    const response = await GET(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('should return empty state when user has no posts (empty array)', async () => {
    // Mock: Authenticated user with no posts - RPC returns empty array
    ;(createClient as jest.Mock).mockResolvedValue(
      createMockSupabase({ 
        user: mockUser, 
        summaryData: null  // This will result in empty array
      })
    )

    const mockRequest = new NextRequest('http://localhost:3000/api/analytics/summary')
    const response = await GET(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.data.totalEngagement).toBe(0)
    expect(data.data.averageEngagementRate).toBe(0)
    expect(data.data.topPerformingPost).toBeNull()
    expect(data.data.postsCount).toBe(0)
    expect(data.data.trendDirection).toBe('neutral')
  })

  it('should return empty state when posts_count is 0', async () => {
    // Mock: Authenticated user with posts_count = 0
    ;(createClient as jest.Mock).mockResolvedValue(
      createMockSupabase({ 
        user: mockUser, 
        summaryData: { ...mockSummaryData, posts_count: 0 } 
      })
    )

    const mockRequest = new NextRequest('http://localhost:3000/api/analytics/summary')
    const response = await GET(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.data.totalEngagement).toBe(0)
    expect(data.data.averageEngagementRate).toBe(0)
    expect(data.data.topPerformingPost).toBeNull()
    expect(data.data.postsCount).toBe(0)
    expect(data.data.trendDirection).toBe('neutral')
  })

  it('should return calculated analytics from database function', async () => {
    // Mock: Authenticated user with summary data from database function
    ;(createClient as jest.Mock).mockResolvedValue(
      createMockSupabase({ user: mockUser, summaryData: mockSummaryData })
    )

    const mockRequest = new NextRequest('http://localhost:3000/api/analytics/summary')
    const response = await GET(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(200)
    
    // Verify data from database function
    expect(data.data.totalEngagement).toBe(710)
    expect(data.data.averageEngagementRate).toBe(10.25)
    
    // Top post from database function
    expect(data.data.topPerformingPost.id).toBe('post-2')
    expect(data.data.topPerformingPost.caption).toBe('Test post 2')
    expect(data.data.topPerformingPost.engagement).toBe(580)
    expect(data.data.topPerformingPost.platform).toBe('tiktok')
    
    // Trend data
    expect(data.data.trendPercentage).toBe(5.5)
    expect(data.data.trendDirection).toBe('up')
    
    // Posts count
    expect(data.data.postsCount).toBe(2)
  })

  it('should return 500 when database function fails', async () => {
    // Mock: Database error from RPC call
    ;(createClient as jest.Mock).mockResolvedValue(
      createMockSupabase({ 
        user: mockUser, 
        summaryError: new Error('Database function error') 
      })
    )

    const mockRequest = new NextRequest('http://localhost:3000/api/analytics/summary')
    const response = await GET(mockRequest)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to fetch analytics summary')
  })

  it('should call RPC with correct user ID', async () => {
    const mockSupabase = createMockSupabase({ 
      user: mockUser, 
      summaryData: mockSummaryData 
    })
    ;(createClient as jest.Mock).mockResolvedValue(mockSupabase)

    const mockRequest = new NextRequest('http://localhost:3000/api/analytics/summary')
    await GET(mockRequest)

    // Verify RPC was called with the correct function name and user ID
    expect(mockSupabase.rpc).toHaveBeenCalledWith('get_user_summary', { 
      user_uuid: mockUser.id 
    })
  })
})
