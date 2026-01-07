/**
 * Request logging utility for API routes
 * 
 * Logs request metadata for monitoring, debugging, and analytics.
 * In production, these logs can be sent to services like:
 * - Vercel Analytics
 * - Datadog
 * - LogRocket
 * - Sentry
 */

export interface RequestLogData {
  /** HTTP method (GET, POST, etc.) */
  method: string
  /** Request path */
  path: string
  /** Response status code */
  status: number
  /** Response time in milliseconds */
  duration: number
  /** User ID if authenticated */
  userId?: string
  /** Client IP address */
  ip?: string
  /** User agent string */
  userAgent?: string
  /** Additional metadata */
  metadata?: Record<string, unknown>
  /** Error message if request failed */
  error?: string
}

export type LogLevel = 'info' | 'warn' | 'error' | 'debug'

/**
 * Format log entry for console output
 */
function formatLogEntry(level: LogLevel, data: RequestLogData): string {
  const timestamp = new Date().toISOString()
  const statusEmoji = data.status >= 500 ? '🔴' : data.status >= 400 ? '🟡' : '🟢'
  
  return `[${timestamp}] ${statusEmoji} ${level.toUpperCase()} | ${data.method} ${data.path} | ${data.status} | ${data.duration}ms${data.userId ? ` | user:${data.userId.slice(0, 8)}...` : ''}${data.error ? ` | error: ${data.error}` : ''}`
}

/**
 * Log a request (console output)
 * In production, this could send to external logging service
 */
export function logRequest(data: RequestLogData): void {
  const level: LogLevel = data.status >= 500 ? 'error' : data.status >= 400 ? 'warn' : 'info'
  const formattedLog = formatLogEntry(level, data)
  
  // Log to console (in production, send to logging service)
  if (level === 'error') {
    console.error(formattedLog)
  } else if (level === 'warn') {
    console.warn(formattedLog)
  } else {
    console.log(formattedLog)
  }

  // In production, you might also want to:
  // - Send to Vercel Analytics
  // - Send to Datadog/New Relic
  // - Store in database for custom analytics
  // Example:
  // await sendToAnalytics(data)
}

/**
 * Create a request logger that tracks timing automatically
 */
export function createRequestLogger(request: Request) {
  const startTime = Date.now()
  const url = new URL(request.url)
  
  return {
    /**
     * Log the completed request
     */
    log(options: {
      status: number
      userId?: string
      error?: string
      metadata?: Record<string, unknown>
    }) {
      const duration = Date.now() - startTime
      
      logRequest({
        method: request.method,
        path: url.pathname,
        status: options.status,
        duration,
        userId: options.userId,
        userAgent: request.headers.get('user-agent') || undefined,
        error: options.error,
        metadata: options.metadata,
      })
    },
  }
}

/**
 * Structured log for JSON output (useful for log aggregation services)
 */
export function logStructured(data: RequestLogData): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level: data.status >= 500 ? 'error' : data.status >= 400 ? 'warn' : 'info',
    ...data,
  }
  
  // Output as JSON for log aggregation services
  console.log(JSON.stringify(logEntry))
}
