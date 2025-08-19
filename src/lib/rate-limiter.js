import { supabaseAdmin } from '@/lib/supabase'

/**
 * Advanced Rate Limiter for API Keys
 * 
 * Features:
 * - Atomic usage increment to prevent race conditions
 * - Automatic rate limit window reset
 * - Comprehensive rate limit information in responses
 * - Support for multiple time windows (hourly, daily, monthly, etc.)
 */

export class RateLimiter {
  /**
   * Check rate limit and increment usage atomically
   * @param {string} apiKey - The API key to check
   * @param {number} incrementBy - How much to increment usage by (default: 1)
   * @returns {Promise<{allowed: boolean, rateLimitInfo: object, apiKeyData: object}>}
   */
  static async checkAndIncrementUsage(apiKey, incrementBy = 1) {
    try {
      // First, get the current API key data
      const { data: currentApiKey, error: fetchError } = await supabaseAdmin
        .from('api_keys')
        .select('*')
        .eq('key', apiKey)
        .single()

      if (fetchError || !currentApiKey) {
        return {
          allowed: false,
          rateLimitInfo: {
            error: 'Invalid API key',
            remaining: 0,
            limit: 0,
            resetAt: null,
            window: null
          },
          apiKeyData: null
        }
      }

      // Check if rate limit window has expired and reset if needed
      const now = new Date()
      const resetTime = new Date(currentApiKey.rate_limit_reset_at)
      let shouldReset = resetTime <= now

      if (shouldReset) {
        // Reset the usage counter and set new reset time
        const newResetTime = this.calculateNextResetTime(currentApiKey.rate_limit_window)
        
        const { data: resetApiKey, error: resetError } = await supabaseAdmin
          .from('api_keys')
          .update({
            usage: 0,
            rate_limit_reset_at: newResetTime.toISOString(),
            last_used: now.toISOString()
          })
          .eq('key', apiKey)
          .select()
          .single()

        if (resetError) {
          throw new Error(`Failed to reset rate limit: ${resetError.message}`)
        }

        // Update current data with reset values
        currentApiKey.usage = 0
        currentApiKey.rate_limit_reset_at = newResetTime.toISOString()
      }

      // Check if this request would exceed the limit
      const newUsage = currentApiKey.usage + incrementBy
      const limit = currentApiKey.usage_limit || 1000
      
      if (newUsage > limit) {
        // Rate limit exceeded
        return {
          allowed: false,
          rateLimitInfo: {
            error: 'Rate limit exceeded',
            remaining: Math.max(0, limit - currentApiKey.usage),
            limit: limit,
            resetAt: currentApiKey.rate_limit_reset_at,
            window: currentApiKey.rate_limit_window,
            current: currentApiKey.usage
          },
          apiKeyData: currentApiKey
        }
      }

      // Atomically increment usage with optimistic locking
      const { data: updatedApiKey, error: updateError } = await supabaseAdmin
        .from('api_keys')
        .update({
          usage: newUsage,
          last_used: now.toISOString()
        })
        .eq('key', apiKey)
        .eq('usage', currentApiKey.usage) // Optimistic locking - only update if usage hasn't changed
        .select()
        .single()

      if (updateError || !updatedApiKey) {
        // Race condition detected or update failed
        // Retry the entire process once
        console.warn('Race condition detected in rate limiter, retrying...')
        return await this.checkAndIncrementUsage(apiKey, incrementBy)
      }

      // Success - request allowed
      return {
        allowed: true,
        rateLimitInfo: {
          remaining: Math.max(0, limit - newUsage),
          limit: limit,
          resetAt: updatedApiKey.rate_limit_reset_at,
          window: updatedApiKey.rate_limit_window,
          current: newUsage
        },
        apiKeyData: updatedApiKey
      }

    } catch (error) {
      console.error('Rate limiter error:', error)
      return {
        allowed: false,
        rateLimitInfo: {
          error: 'Rate limiting service error',
          remaining: 0,
          limit: 0,
          resetAt: null,
          window: null
        },
        apiKeyData: null
      }
    }
  }

  /**
   * Calculate the next reset time based on the rate limit window
   * @param {string} window - The rate limit window (hourly, daily, weekly, monthly, yearly)
   * @returns {Date} Next reset time
   */
  static calculateNextResetTime(window) {
    const now = new Date()
    
    switch (window) {
      case 'hourly':
        return new Date(now.getTime() + 60 * 60 * 1000) // +1 hour
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000) // +1 day
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // +1 week
      case 'monthly':
        const nextMonth = new Date(now)
        nextMonth.setMonth(nextMonth.getMonth() + 1)
        return nextMonth
      case 'yearly':
        const nextYear = new Date(now)
        nextYear.setFullYear(nextYear.getFullYear() + 1)
        return nextYear
      default:
        // Default to monthly
        const defaultNext = new Date(now)
        defaultNext.setMonth(defaultNext.getMonth() + 1)
        return defaultNext
    }
  }

  /**
   * Create a standardized rate limit response
   * @param {object} rateLimitInfo - Rate limit information from checkAndIncrementUsage
   * @param {number} status - HTTP status code (429 for rate limited, 200 for success)
   * @returns {Response} Next.js Response object
   */
  static createRateLimitResponse(rateLimitInfo, status = 429) {
    const headers = {
      'X-RateLimit-Limit': rateLimitInfo.limit?.toString() || '0',
      'X-RateLimit-Remaining': rateLimitInfo.remaining?.toString() || '0',
      'X-RateLimit-Reset': rateLimitInfo.resetAt || new Date().toISOString(),
      'X-RateLimit-Window': rateLimitInfo.window || 'monthly'
    }

    if (status === 429) {
      // Rate limit exceeded
      return Response.json(
        {
          success: false,
          error: rateLimitInfo.error || 'Rate limit exceeded',
          rateLimitInfo: {
            limit: rateLimitInfo.limit,
            remaining: rateLimitInfo.remaining,
            resetAt: rateLimitInfo.resetAt,
            window: rateLimitInfo.window,
            retryAfter: this.calculateRetryAfter(rateLimitInfo.resetAt)
          }
        },
        { 
          status: 429,
          headers
        }
      )
    }

    // Success response with rate limit headers
    return {
      headers,
      rateLimitInfo
    }
  }

  /**
   * Calculate retry-after value in seconds
   * @param {string} resetAt - ISO timestamp when rate limit resets
   * @returns {number} Seconds until reset
   */
  static calculateRetryAfter(resetAt) {
    if (!resetAt) return 3600 // Default 1 hour
    
    const resetTime = new Date(resetAt)
    const now = new Date()
    const diffMs = resetTime.getTime() - now.getTime()
    
    return Math.max(0, Math.ceil(diffMs / 1000))
  }

  /**
   * Validate API key format and permissions
   * @param {string} apiKey - The API key to validate
   * @param {string[]} requiredPermissions - Required permissions for the operation
   * @returns {Promise<{valid: boolean, apiKeyData: object, error: string}>}
   */
  static async validateApiKey(apiKey, requiredPermissions = ['read']) {
    try {
      // Check API key format
      if (!apiKey || !apiKey.startsWith('api_')) {
        return {
          valid: false,
          apiKeyData: null,
          error: 'Invalid API key format. Must start with "api_"'
        }
      }

      // Get API key from database
      const { data: apiKeyData, error } = await supabaseAdmin
        .from('api_keys')
        .select('*')
        .eq('key', apiKey)
        .single()

      if (error || !apiKeyData) {
        return {
          valid: false,
          apiKeyData: null,
          error: 'Invalid API key'
        }
      }

      // Check permissions
      let permissions = apiKeyData.permissions
      if (typeof permissions === 'string') {
        try {
          permissions = JSON.parse(permissions)
        } catch (parseError) {
          permissions = []
        }
      }

      const hasRequiredPermissions = requiredPermissions.every(permission => 
        Array.isArray(permissions) && permissions.includes(permission)
      )

      if (!hasRequiredPermissions) {
        return {
          valid: false,
          apiKeyData: apiKeyData,
          error: `Insufficient permissions. Required: ${requiredPermissions.join(', ')}`
        }
      }

      return {
        valid: true,
        apiKeyData: apiKeyData,
        error: null
      }

    } catch (error) {
      console.error('API key validation error:', error)
      return {
        valid: false,
        apiKeyData: null,
        error: 'API key validation failed'
      }
    }
  }
}
