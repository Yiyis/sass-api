import { summarizeGitHubRepo } from '@/lib/langchain-chain'
import { RateLimiter } from '@/lib/rate-limiter'

export async function POST(request) {
  try {
    // Extract API key from headers or body
    const authHeader = request.headers.get('apiKey') || request.headers.get('authorization')
    let apiKey = authHeader
    let requestBody
    
    // Parse request body first to get apiKey if not in headers
    try {
      requestBody = await request.json()
      if (!apiKey) {
        apiKey = requestBody.apiKey
      }
    } catch (parseError) {
      if (!apiKey) {
        return Response.json(
          { 
            success: false, 
            error: 'Invalid JSON in request body' 
          },
          { status: 400 }
        )
      }
    }

    // Validate API key presence
    if (!apiKey) {
      return Response.json(
        { 
          success: false, 
          error: 'API key is required. Send it in the "apiKey" header or in the request body as {"apiKey": "your_key"}' 
        },
        { status: 400 }
      )
    }

    // Validate API key format and permissions
    const validation = await RateLimiter.validateApiKey(apiKey, ['read'])
    if (!validation.valid) {
      return Response.json(
        { 
          success: false, 
          error: validation.error 
        },
        { status: validation.error.includes('Invalid API key') ? 401 : 403 }
      )
    }

    // Extract GitHub repository details from request body (already parsed above)
    const { owner, repo, githubUrl } = requestBody || {}

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

    // Start all operations in parallel for maximum performance
    try {
      // Execute rate limiting check and GitHub API calls in parallel
      const [rateLimitResult, readme, repoData, latestRelease] = await Promise.all([
        RateLimiter.checkAndIncrementUsage(apiKey, 1),
        fetchGitHubReadme(targetOwner, targetRepo, githubToken),
        fetchRepositoryData(targetOwner, targetRepo, githubToken),
        fetchLatestRelease(targetOwner, targetRepo, githubToken)
      ])

      // Check rate limits after parallel execution
      if (!rateLimitResult.allowed) {
        // Rate limit exceeded - return 429 with detailed information
        return RateLimiter.createRateLimitResponse(rateLimitResult.rateLimitInfo, 429)
      }

      const apiKeyData = rateLimitResult.apiKeyData

      // Generate AI summary using LangChain
      const aiSummary = await summarizeGitHubRepo(readme.content)

      // Get rate limit headers for successful response
      const rateLimitHeaders = RateLimiter.createRateLimitResponse(rateLimitResult.rateLimitInfo, 200).headers

      // Return success response with AI summary, repository data, and rate limit headers
      return Response.json({
        success: true,
        message: 'GitHub repository analyzed and summarized successfully',
        repository: `${targetOwner}/${targetRepo}`,
        extractedFrom: githubUrl ? { githubUrl, owner: targetOwner, repo: targetRepo } : { owner: targetOwner, repo: targetRepo },
        repositoryData: {
          name: repoData.name,
          full_name: repoData.full_name,
          description: repoData.description,
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          watchers: repoData.watchers_count,
          language: repoData.language,
          size: repoData.size,
          created_at: repoData.created_at,
          updated_at: repoData.updated_at,
          pushed_at: repoData.pushed_at,
          default_branch: repoData.default_branch,
          topics: repoData.topics || [],
          license: repoData.license ? repoData.license.name : null,
          is_private: repoData.private,
          html_url: repoData.html_url
        },
        latestRelease: latestRelease ? {
          tag_name: latestRelease.tag_name,
          name: latestRelease.name,
          published_at: latestRelease.published_at,
          prerelease: latestRelease.prerelease,
          draft: latestRelease.draft,
          html_url: latestRelease.html_url
        } : null,
        aiSummary: aiSummary.success ? {
          summary: aiSummary.summary,
          cool_facts: aiSummary.cool_facts
        } : {
          error: aiSummary.error
        },
        keyDetails: {
          name: apiKeyData.name || 'N/A',
          description: apiKeyData.description || 'N/A',
          type: apiKeyData.type || 'unknown',
          permissions: apiKeyData.permissions || [],
          usage: rateLimitResult.rateLimitInfo.current,
          usage_limit: rateLimitResult.rateLimitInfo.limit,
          remaining: rateLimitResult.rateLimitInfo.remaining,
          rate_limit_reset_at: rateLimitResult.rateLimitInfo.resetAt,
          created_at: apiKeyData.created_at || null
        }
      }, {
        headers: rateLimitHeaders
      })
    } catch (githubError) {
      return Response.json(
        { 
          success: false, 
          error: `Failed to fetch repository data: ${githubError.message}` 
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

// Create shared GitHub API headers factory
function createGitHubHeaders(token) {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'SaaS-API-System',
    'X-GitHub-Api-Version': '2022-11-28'
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  return headers
}

// GitHub README fetcher function
async function fetchGitHubReadme(owner, repo, token) {
  try {
    const headers = createGitHubHeaders(token)
    const baseUrl = `https://api.github.com/repos/${owner}/${repo}`

    // Try to fetch README.md first, with optimized error handling
    let readmeResponse = await fetch(`${baseUrl}/readme`, { 
      headers,
      signal: AbortSignal.timeout(10000) // 10 second timeout
    })
    
    if (!readmeResponse.ok) {
      // If README.md not found, try README (without extension)
      readmeResponse = await fetch(`${baseUrl}/contents/README`, { 
        headers,
        signal: AbortSignal.timeout(10000)
      })
    }

    if (!readmeResponse.ok) {
      throw new Error(`README not found: ${readmeResponse.status === 404 ? 'No README file found' : `GitHub API error ${readmeResponse.status}`}`)
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

// GitHub repository data fetcher function
async function fetchRepositoryData(owner, repo, token) {
  try {
    const headers = createGitHubHeaders(token)

    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { 
      headers,
      signal: AbortSignal.timeout(8000) // 8 second timeout
    })
    
    if (!repoResponse.ok) {
      throw new Error(`Repository not found: ${repoResponse.status === 404 ? 'Repository does not exist or is private' : `GitHub API error ${repoResponse.status}`}`)
    }

    const repoData = await repoResponse.json()
    return repoData

  } catch (error) {
    console.error('GitHub Repository API Error:', error)
    throw new Error(`Failed to fetch repository data: ${error.message}`)
  }
}

// GitHub latest release fetcher function
async function fetchLatestRelease(owner, repo, token) {
  try {
    const headers = createGitHubHeaders(token)

    const releaseResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`, { 
      headers,
      signal: AbortSignal.timeout(6000) // 6 second timeout
    })
    
    if (!releaseResponse.ok) {
      if (releaseResponse.status === 404) {
        // No releases found - this is common and not an error
        console.log(`No releases found for ${owner}/${repo}`)
        return null
      }
      throw new Error(`Failed to fetch latest release: GitHub API error ${releaseResponse.status}`)
    }

    const releaseData = await releaseResponse.json()
    return releaseData

  } catch (error) {
    console.error('GitHub Release API Error:', error)
    // Don't throw error for releases - just return null if not available
    console.log(`Latest release not available for ${owner}/${repo}: ${error.message}`)
    return null
  }
}
