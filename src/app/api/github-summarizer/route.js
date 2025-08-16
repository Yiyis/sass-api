import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request) {
  try {
    // Check for API key in headers first (common pattern)
    const authHeader = request.headers.get('apiKey') || request.headers.get('authorization')
    let apiKey = authHeader
    
    // If not in headers, try to get from request body
    if (!apiKey) {
      try {
        const body = await request.json()
        apiKey = body.apiKey
      } catch (parseError) {
        // If body parsing fails, continue with header value
      }
    }

    // Validate input
    if (!apiKey) {
      return Response.json(
        { 
          success: false, 
          error: 'API key is required. Send it in the "apiKey" header or in the request body as {"apiKey": "your_key"}' 
        },
        { status: 400 }
      )
    }

    // Check if API key format is valid
    if (!apiKey.startsWith('api_')) {
      return Response.json(
        { 
          success: false, 
          error: 'Invalid API key format. Must start with "api_"' 
        },
        { status: 400 }
      )
    }

    // Query the database to validate the API key
    console.log('Validating API key:', apiKey)
    
    const { data: apiKeyData, error } = await supabaseAdmin
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return Response.json(
        { 
          success: false, 
          error: 'Database error during validation' 
        },
        { status: 500 }
      )
    }

    if (!apiKeyData) {
      return Response.json(
        { 
          success: false, 
          error: 'Invalid API key' 
        },
        { status: 401 }
      )
    }



    // Check if the API key has the required permissions
    const requiredPermissions = ['read']
    
    // Parse permissions if it's a string (JSON)
    let permissions = apiKeyData.permissions
    if (typeof permissions === 'string') {
      try {
        permissions = JSON.parse(permissions)
      } catch (parseError) {
        console.error('Failed to parse permissions JSON:', parseError)
        permissions = []
      }
    }
    
    const hasRequiredPermissions = requiredPermissions.every(permission => 
      Array.isArray(permissions) && 
      permissions.includes(permission)
    )

    if (!hasRequiredPermissions) {
      return Response.json(
        { 
          success: false, 
          error: 'Insufficient permissions. Requires read access.'
        },
        { status: 403 }
      )
    }

    // Check usage limits (if applicable)
    if (apiKeyData.usage_limit && apiKeyData.usage >= apiKeyData.usage_limit) {
      return Response.json(
        { 
          success: false, 
          error: 'Usage limit exceeded' 
        },
        { status: 429 }
      )
    }

    // Increment usage count
    await supabaseAdmin
      .from('api_keys')
      .update({ usage: (apiKeyData.usage || 0) + 1 })
      .eq('key', apiKey)

    // Return success response with key details
    return Response.json({
      success: true,
      message: 'API key validated successfully',
      keyDetails: {
        name: apiKeyData.name || 'N/A',
        description: apiKeyData.description || 'N/A',
        type: apiKeyData.type || 'unknown',
        permissions: Array.isArray(permissions) ? permissions : [],
        usage: apiKeyData.usage || 0,
        usage_limit: apiKeyData.usage_limit || null,
        created_at: apiKeyData.created_at || null
      }
    })

  } catch (error) {
    console.error('GitHub Summarizer API Error:', error)
    
    return Response.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// Handle other HTTP methods
export async function GET() {
  return Response.json(
    { 
      success: false, 
      error: 'Method not allowed. Use POST to validate API keys.' 
    },
    { status: 405 }
  )
}

export async function PUT() {
  return Response.json(
    { 
      success: false, 
      error: 'Method not allowed. Use POST to validate API keys.' 
    },
    { status: 405 }
  )
}

export async function DELETE() {
  return Response.json(
    { 
      success: false, 
      error: 'Method not allowed. Use POST to validate API keys.' 
    },
    { status: 405 }
  )
}
