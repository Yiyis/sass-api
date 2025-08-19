import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * Get the authenticated user from the server session
 * @param {Request} request - The incoming request object
 * @returns {Promise<{user: Object, error: string|null}>}
 */
export async function getAuthenticatedUser(request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user || !session.user.email) {
      return {
        user: null,
        error: 'Unauthorized: No valid session found'
      }
    }

    // Get user from database using email
    const { data: user, error: dbError } = await supabaseAdmin
      .from('users')
      .select('id, email, name, image_url')
      .eq('email', session.user.email)
      .single()

    if (dbError || !user) {
      return {
        user: null,
        error: 'User not found in database'
      }
    }

    return {
      user,
      error: null
    }
  } catch (error) {
    console.error('Error getting authenticated user:', error)
    return {
      user: null,
      error: 'Internal server error'
    }
  }
}

/**
 * Middleware function to ensure authentication
 * @param {Request} request - The incoming request object
 * @returns {Promise<{userId: string, error: Response|null}>}
 */
export async function requireAuth(request) {
  const { user, error } = await getAuthenticatedUser(request)
  
  if (error || !user) {
    return {
      userId: null,
      error: Response.json(
        { error: error || 'Unauthorized' },
        { status: 401 }
      )
    }
  }

  return {
    userId: user.id,
    error: null
  }
}
