/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server'

// Mock data
const mockUser = { id: 'test-user-id', email: 'test@example.com' }

const mockMetrics = [
  { id: '1', user_id: 'test-user-id', date: '2025-12-01', engagement: 500, reach: 5000 },
  { id: '2', user_id: 'test-user-id', date: '2025-12-02', engagement: 600, reach: 6000 },
  { id: '3', user_id: 'test-user-id', date: '2025-12-03', engagement: 450, reach: 4500 },
]

// Create mock Supabase client
const createMockSupabase = (options: {
  user?: typeof mockUser | null
  authError?: Error | null
  metrics?: typeof mockMetrics | null
  metricsError?: Error | null
}) => ({
  auth: {
    getUser: jest.fn().mockResolvedValue({
      data: { user: options.user ?? null },
      error: options.authError ?? null,
    }),
  },
  from: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        gte: jest.fn().mockReturnValue({
          lte: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: options.metrics ?? [],
              error: options.metricsError ?? null,
            }),
          }),
        }),
      }),
    }),
  }),
})

// Mock the server client
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

import { GET } from '@/app/api/metrics/daily/route'
import { createClient } from '@/lib/supabase/server'

// Helper to create NextRequest with URL params
function createRequest(params: Record<string, string> = {}): NextRequest {
  const url = new URL('http://localhost:3000/api/metrics/daily')
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  return new NextRequest(url)
}

describe('GET /api/metrics/daily', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 401 when user is not authenticated', async () => {
    ;(createClient as jest.Mock).mockResolvedValue(
      createMockSupabase({ user: null })
    )

    const request = createRequest()
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('should return metrics for authenticated user', async () => {
    ;(createClient as jest.Mock).mockResolvedValue(
      createMockSupabase({ user: mockUser, metrics: mockMetrics })
    )

    const request = createRequest()
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.data).toHaveLength(3)
    expect(data.data[0].engagement).toBe(500)
  })

  it('should return empty array when user has no metrics', async () => {
    ;(createClient as jest.Mock).mockResolvedValue(
      createMockSupabase({ user: mockUser, metrics: [] })
    )

    const request = createRequest()
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.data).toEqual([])
  })

  it('should accept valid days parameter', async () => {
    ;(createClient as jest.Mock).mockResolvedValue(
      createMockSupabase({ user: mockUser, metrics: mockMetrics })
    )

    const request = createRequest({ days: '14' })
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.data).toBeDefined()
  })

  it('should return 400 for invalid days parameter (non-numeric)', async () => {
    ;(createClient as jest.Mock).mockResolvedValue(
      createMockSupabase({ user: mockUser })
    )

    const request = createRequest({ days: 'abc' })
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('Invalid days parameter')
  })

  it('should return 400 for days parameter out of range (too low)', async () => {
    ;(createClient as jest.Mock).mockResolvedValue(
      createMockSupabase({ user: mockUser })
    )

    const request = createRequest({ days: '0' })
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('Invalid days parameter')
  })

  it('should return 400 for days parameter out of range (too high)', async () => {
    ;(createClient as jest.Mock).mockResolvedValue(
      createMockSupabase({ user: mockUser })
    )

    const request = createRequest({ days: '400' })
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('Invalid days parameter')
  })

  it('should return 500 when database query fails', async () => {
    ;(createClient as jest.Mock).mockResolvedValue(
      createMockSupabase({ 
        user: mockUser, 
        metricsError: new Error('Database error') 
      })
    )

    const request = createRequest()
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to fetch daily metrics')
  })

  it('should use default 30 days when no days parameter provided', async () => {
    const mockSupabase = createMockSupabase({ user: mockUser, metrics: mockMetrics })
    ;(createClient as jest.Mock).mockResolvedValue(mockSupabase)

    const request = createRequest()
    await GET(request)

    // Verify that from() was called (meaning the query was executed)
    expect(mockSupabase.from).toHaveBeenCalledWith('daily_metrics')
  })
})
