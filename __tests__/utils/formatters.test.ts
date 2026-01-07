import {
  formatNumber,
  formatDate,
  formatChartDate,
  calculateEngagement,
  calculateTrendPercentage,
  calculateAverageEngagementRate,
  truncateText,
  isValidEmail,
  validateDaysParam,
} from '@/lib/utils/formatters'

describe('formatNumber', () => {
  it('should format millions with M suffix', () => {
    expect(formatNumber(1000000)).toBe('1.0M')
    expect(formatNumber(2500000)).toBe('2.5M')
    expect(formatNumber(10000000)).toBe('10.0M')
  })

  it('should format thousands with K suffix', () => {
    expect(formatNumber(1000)).toBe('1.0K')
    expect(formatNumber(1500)).toBe('1.5K')
    expect(formatNumber(999000)).toBe('999.0K')
  })

  it('should return numbers under 1000 as-is', () => {
    expect(formatNumber(0)).toBe('0')
    expect(formatNumber(100)).toBe('100')
    expect(formatNumber(999)).toBe('999')
  })
})

describe('formatDate', () => {
  it('should format ISO date string to readable format', () => {
    const result = formatDate('2025-12-15T14:30:00Z')
    expect(result).toContain('Dec')
    expect(result).toContain('15')
    expect(result).toContain('2025')
  })

  it('should handle different date formats', () => {
    const result = formatDate('2025-01-01')
    expect(result).toContain('Jan')
    expect(result).toContain('1')
  })
})

describe('formatChartDate', () => {
  it('should format date for chart display (short format)', () => {
    const result = formatChartDate('2025-12-15')
    expect(result).toContain('Dec')
    expect(result).toContain('15')
    // Should NOT contain year
    expect(result).not.toContain('2025')
  })
})

describe('calculateEngagement', () => {
  it('should sum likes, comments, and shares', () => {
    const post = { likes: 100, comments: 50, shares: 25 }
    expect(calculateEngagement(post)).toBe(175)
  })

  it('should handle zero values', () => {
    const post = { likes: 0, comments: 0, shares: 0 }
    expect(calculateEngagement(post)).toBe(0)
  })

  it('should handle missing values (treated as 0)', () => {
    const post = { likes: 100, comments: 0, shares: 0 }
    expect(calculateEngagement(post)).toBe(100)
  })

  it('should handle large numbers', () => {
    const post = { likes: 1000000, comments: 500000, shares: 250000 }
    expect(calculateEngagement(post)).toBe(1750000)
  })
})

describe('calculateTrendPercentage', () => {
  it('should calculate positive trend (growth)', () => {
    const result = calculateTrendPercentage(150, 100)
    expect(result.percentage).toBe(50)
    expect(result.direction).toBe('up')
  })

  it('should calculate negative trend (decline)', () => {
    const result = calculateTrendPercentage(50, 100)
    expect(result.percentage).toBe(50)
    expect(result.direction).toBe('down')
  })

  it('should return neutral when values are equal', () => {
    const result = calculateTrendPercentage(100, 100)
    expect(result.percentage).toBe(0)
    expect(result.direction).toBe('neutral')
  })

  it('should handle zero previous value with current value', () => {
    const result = calculateTrendPercentage(100, 0)
    expect(result.percentage).toBe(100)
    expect(result.direction).toBe('up')
  })

  it('should handle both values being zero', () => {
    const result = calculateTrendPercentage(0, 0)
    expect(result.percentage).toBe(0)
    expect(result.direction).toBe('neutral')
  })

  it('should round to one decimal place', () => {
    const result = calculateTrendPercentage(133, 100)
    expect(result.percentage).toBe(33)
  })
})

describe('calculateAverageEngagementRate', () => {
  it('should calculate average of engagement rates', () => {
    const posts = [
      { engagement_rate: 5.0 },
      { engagement_rate: 10.0 },
      { engagement_rate: 15.0 },
    ]
    expect(calculateAverageEngagementRate(posts)).toBe(10)
  })

  it('should ignore null engagement rates', () => {
    const posts = [
      { engagement_rate: 10.0 },
      { engagement_rate: null },
      { engagement_rate: 20.0 },
    ]
    expect(calculateAverageEngagementRate(posts)).toBe(15)
  })

  it('should return 0 for empty array', () => {
    expect(calculateAverageEngagementRate([])).toBe(0)
  })

  it('should return 0 when all rates are null', () => {
    const posts = [
      { engagement_rate: null },
      { engagement_rate: null },
    ]
    expect(calculateAverageEngagementRate(posts)).toBe(0)
  })

  it('should round to 2 decimal places', () => {
    const posts = [
      { engagement_rate: 5.555 },
      { engagement_rate: 5.555 },
    ]
    expect(calculateAverageEngagementRate(posts)).toBe(5.56)
  })
})

describe('truncateText', () => {
  it('should truncate text longer than max length', () => {
    const text = 'This is a very long caption that needs to be truncated'
    expect(truncateText(text, 20)).toBe('This is a very long ...')
  })

  it('should not truncate text shorter than max length', () => {
    const text = 'Short text'
    expect(truncateText(text, 20)).toBe('Short text')
  })

  it('should handle null input', () => {
    expect(truncateText(null, 20)).toBe('')
  })

  it('should handle empty string', () => {
    expect(truncateText('', 20)).toBe('')
  })

  it('should handle text exactly at max length', () => {
    const text = '12345'
    expect(truncateText(text, 5)).toBe('12345')
  })
})

describe('isValidEmail', () => {
  it('should return true for valid emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
    expect(isValidEmail('user+tag@example.org')).toBe(true)
  })

  it('should return false for invalid emails', () => {
    expect(isValidEmail('invalid')).toBe(false)
    expect(isValidEmail('invalid@')).toBe(false)
    expect(isValidEmail('@domain.com')).toBe(false)
    expect(isValidEmail('user@')).toBe(false)
    expect(isValidEmail('user name@example.com')).toBe(false)
  })
})

describe('validateDaysParam', () => {
  it('should return default days when param is null', () => {
    const result = validateDaysParam(null)
    expect(result.valid).toBe(true)
    expect(result.days).toBe(30)
  })

  it('should parse valid number string', () => {
    const result = validateDaysParam('14')
    expect(result.valid).toBe(true)
    expect(result.days).toBe(14)
  })

  it('should reject non-numeric string', () => {
    const result = validateDaysParam('abc')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Days must be a number')
  })

  it('should reject days less than 1', () => {
    const result = validateDaysParam('0')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('between 1 and')
  })

  it('should reject days greater than max', () => {
    const result = validateDaysParam('400', 30, 365)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('between 1 and 365')
  })

  it('should accept custom default and max values', () => {
    const result = validateDaysParam(null, 7, 30)
    expect(result.valid).toBe(true)
    expect(result.days).toBe(7)
  })
})
