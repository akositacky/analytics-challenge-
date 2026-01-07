/**
 * Format a number for display (e.g., 1500 -> "1.5K", 2000000 -> "2M")
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

/**
 * Format a date string for display
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format a date for chart display (shorter format)
 */
export function formatChartDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/**
 * Calculate total engagement from a post
 */
export function calculateEngagement(post: {
  likes: number
  comments: number
  shares: number
}): number {
  return (post.likes || 0) + (post.comments || 0) + (post.shares || 0)
}

/**
 * Calculate trend percentage between two periods
 * Returns positive for growth, negative for decline
 */
export function calculateTrendPercentage(
  currentValue: number,
  previousValue: number
): { percentage: number; direction: 'up' | 'down' | 'neutral' } {
  // Handle edge case: no previous data
  if (previousValue === 0) {
    if (currentValue > 0) {
      return { percentage: 100, direction: 'up' }
    }
    return { percentage: 0, direction: 'neutral' }
  }

  const change = ((currentValue - previousValue) / previousValue) * 100
  const percentage = Math.round(Math.abs(change) * 10) / 10

  if (change > 0) {
    return { percentage, direction: 'up' }
  } else if (change < 0) {
    return { percentage, direction: 'down' }
  }
  return { percentage: 0, direction: 'neutral' }
}

/**
 * Calculate average engagement rate from an array of posts
 */
export function calculateAverageEngagementRate(
  posts: Array<{ engagement_rate: number | null }>
): number {
  const validRates = posts
    .map((p) => p.engagement_rate)
    .filter((rate): rate is number => rate !== null)

  if (validRates.length === 0) {
    return 0
  }

  const sum = validRates.reduce((acc, rate) => acc + rate, 0)
  return Math.round((sum / validRates.length) * 100) / 100
}

/**
 * Truncate text to a maximum length with ellipsis
 */
export function truncateText(text: string | null, maxLength: number): string {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Parse and validate days parameter for API routes
 */
export function validateDaysParam(
  daysParam: string | null,
  defaultDays: number = 30,
  maxDays: number = 365
): { valid: boolean; days: number; error?: string } {
  if (!daysParam) {
    return { valid: true, days: defaultDays }
  }

  const parsed = parseInt(daysParam, 10)
  
  if (isNaN(parsed)) {
    return { valid: false, days: defaultDays, error: 'Days must be a number' }
  }

  if (parsed < 1 || parsed > maxDays) {
    return {
      valid: false,
      days: defaultDays,
      error: `Days must be between 1 and ${maxDays}`,
    }
  }

  return { valid: true, days: parsed }
}
