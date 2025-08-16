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

    // Get request body for GitHub repository details
    let requestBody
    try {
      requestBody = await request.json()
    } catch (parseError) {
      return Response.json(
        { 
          success: false, 
          error: 'Invalid JSON in request body' 
        },
        { status: 400 }
      )
    }

    const { owner, repo, githubUrl } = requestBody

    let targetOwner, targetRepo

    if (githubUrl) {
      // Extract owner and repo from GitHub URL
      const urlMatch = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
      if (!urlMatch) {
        return Response.json(
          { 
            success: false, 
            error: 'Invalid GitHub URL format. Expected: https://github.com/owner/repo' 
          },
          { status: 400 }
        )
      }
      targetOwner = urlMatch[1]
      targetRepo = urlMatch[2].replace(/\.git$/, '') // Remove .git if present
    } else if (owner && repo) {
      // Use direct owner and repo parameters
      targetOwner = owner
      targetRepo = repo
    } else {
      return Response.json(
        { 
          success: false, 
          error: 'Either provide githubUrl or both owner and repo. Examples: {"githubUrl": "https://github.com/owner/repo"} or {"owner": "username", "repo": "repository-name"}' 
        },
        { status: 400 }
      )
    }

    // GitHub API token (optional - will work without it but with rate limits)
    const githubToken = process.env.GITHUB_TOKEN
    
    if (!githubToken) {
      console.log('Warning: No GitHub token provided. Using unauthenticated requests with rate limits.')
    }

    // Fetch README from GitHub
    try {
      const readme = await fetchGitHubReadme(targetOwner, targetRepo, githubToken)

      // Return success response with README
      return Response.json({
        success: true,
        message: 'GitHub README fetched successfully',
        repository: `${targetOwner}/${targetRepo}`,
        extractedFrom: githubUrl ? { githubUrl, owner: targetOwner, repo: targetRepo } : { owner: targetOwner, repo: targetRepo },
        readme,
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
    } catch (githubError) {
      return Response.json(
        { 
          success: false, 
          error: `Failed to fetch README: ${githubError.message}` 
        },
        { status: 500 }
      )
    }

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
      error: 'Method not allowed. Use POST to summarize GitHub repositories.' 
    },
    { status: 405 }
  )
}

export async function PUT() {
  return Response.json(
    { 
      success: false, 
      error: 'Method not allowed. Use POST to summarize GitHub repositories.' 
    },
    { status: 405 }
  )
}

export async function DELETE() {
  return Response.json(
    { 
      success: false, 
      error: 'Method not allowed. Use POST to summarize GitHub repositories.' 
    },
    { status: 405 }
  )
}

// GitHub README fetcher function
async function fetchGitHubReadme(owner, repo, token) {
  try {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'SaaS-API-System'
    }
    
    // Add authorization header only if token is provided
    if (token) {
      headers['Authorization'] = `token ${token}`
    }

    // Try to fetch README.md first
    let readmeResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers })
    
    if (!readmeResponse.ok) {
      // If README.md not found, try README (without extension)
      readmeResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/README`, { headers })
    }

    if (!readmeResponse.ok) {
      throw new Error(`README not found: ${readmeResponse.status === 404 ? 'No README file found' : 'GitHub API error'}`)
    }

    const readmeData = await readmeResponse.json()
    
    // Decode content from base64
    const content = Buffer.from(readmeData.content, 'base64').toString('utf-8')
    
    return {
      filename: readmeData.name,
      path: readmeData.path,
      size: readmeData.size,
      sha: readmeData.sha,
      content: content,
      encoding: readmeData.encoding,
      download_url: readmeData.download_url
    }

  } catch (error) {
    console.error('GitHub README API Error:', error)
    throw new Error(`Failed to fetch README: ${error.message}`)
  }
}
