'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Copy, CheckCircle, XCircle, Loader2, Code2, Zap } from "lucide-react"

export function InteractiveDemoSection() {
  
  const defaultExample = JSON.stringify({
    githubUrl: "https://github.com/assafelovic/gpt-researcher"
  }, null, 2)
  
  const [requestPayload, setRequestPayload] = useState(defaultExample)
  const [response, setResponse] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleSendRequest = async () => {
    setIsLoading(true)
    setError(null)
    setResponse(null)

    try {
      // Parse the JSON to validate it
      const parsedPayload = JSON.parse(requestPayload)
      
      // Validate required fields
      if (!parsedPayload.githubUrl) {
        setError('githubUrl is required in the request payload')
        setIsLoading(false)
        return
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Generate dummy response based on the GitHub URL
      const urlMatch = parsedPayload.githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
      
      if (!urlMatch) {
        setError('Invalid GitHub URL format. Expected: https://github.com/owner/repo')
        setIsLoading(false)
        return
      }

      const owner = urlMatch[1]
      const repo = urlMatch[2].replace(/\.git$/, '')

      // Create dummy response with realistic data
      const dummyResponse = {
        success: true,
        message: 'GitHub repository analyzed and summarized successfully',
        repository: `${owner}/${repo}`,
        extractedFrom: {
          githubUrl: parsedPayload.githubUrl,
          owner: owner,
          repo: repo
        },
        repositoryData: {
          name: repo,
          full_name: `${owner}/${repo}`,
          description: getDummyDescription(repo),
          stars: getDummyStars(repo),
          forks: Math.floor(getDummyStars(repo) * 0.2),
          watchers: getDummyStars(repo),
          language: getDummyLanguage(repo),
          size: Math.floor(Math.random() * 50000) + 5000,
          created_at: '2021-03-15T08:30:00Z',
          updated_at: '2024-01-15T14:22:00Z',
          pushed_at: '2024-01-14T16:45:30Z',
          default_branch: 'main',
          topics: getDummyTopics(repo),
          license: 'MIT License',
          is_private: false,
          html_url: parsedPayload.githubUrl
        },
        latestRelease: getDummyRelease(repo),
        aiSummary: {
          summary: getDummySummary(repo, owner),
          cool_facts: getDummyCoolFacts(repo)
        },
        keyDetails: {
          name: 'Demo API Key',
          description: 'Interactive demo key for testing',
          type: 'demo',
          permissions: ['read'],
          usage: Math.floor(Math.random() * 45) + 5,
          usage_limit: 1000,
          remaining: 1000 - (Math.floor(Math.random() * 45) + 5),
          rate_limit_reset_at: '2024-02-01T00:00:00Z',
          created_at: '2024-01-01T00:00:00Z'
        }
      }

      setResponse(dummyResponse)
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('Invalid JSON format. Please check your request payload.')
      } else {
        setError('Demo error: Please check your GitHub URL format.')
      }
      console.error('Demo error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Helper functions to generate realistic dummy data
  const getDummyDescription = (repo) => {
    const descriptions = {
      'react': 'The library for web and native user interfaces',
      'vue': 'The progressive JavaScript framework',
      'angular': 'The modern web developer\'s platform',
      'nextjs': 'The React Framework for Production',
      'typescript': 'TypeScript is a superset of JavaScript that compiles to clean JavaScript output',
      'express': 'Fast, unopinionated, minimalist web framework for Node.js',
      'django': 'The Web framework for perfectionists with deadlines',
      'flask': 'A simple framework for building complex web applications'
    }
    return descriptions[repo.toLowerCase()] || `${repo} is an innovative open-source project that provides powerful tools and utilities for modern development workflows.`
  }

  const getDummyStars = (repo) => {
    const popularRepos = {
      'react': 195000,
      'vue': 195000,
      'angular': 88000,
      'nextjs': 105000,
      'typescript': 91000,
      'express': 60000,
      'django': 70000,
      'flask': 62000
    }
    return popularRepos[repo.toLowerCase()] || Math.floor(Math.random() * 10000) + 500
  }

  const getDummyLanguage = (repo) => {
    const languages = {
      'react': 'JavaScript',
      'vue': 'TypeScript',
      'angular': 'TypeScript',
      'nextjs': 'JavaScript',
      'typescript': 'TypeScript',
      'express': 'JavaScript',
      'django': 'Python',
      'flask': 'Python'
    }
    return languages[repo.toLowerCase()] || ['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust'][Math.floor(Math.random() * 5)]
  }

  const getDummyTopics = (repo) => {
    const topicSets = {
      'react': ['react', 'javascript', 'library', 'frontend', 'ui'],
      'vue': ['vue', 'javascript', 'framework', 'frontend', 'spa'],
      'angular': ['angular', 'typescript', 'framework', 'frontend', 'web'],
      'nextjs': ['nextjs', 'react', 'framework', 'ssr', 'vercel'],
      'typescript': ['typescript', 'javascript', 'compiler', 'types'],
      'express': ['express', 'nodejs', 'web', 'framework', 'api'],
      'django': ['django', 'python', 'web', 'framework', 'mvc'],
      'flask': ['flask', 'python', 'web', 'micro-framework', 'api']
    }
    return topicSets[repo.toLowerCase()] || ['opensource', 'development', 'tools', 'software']
  }

  const getDummyRelease = (repo) => {
    const versions = ['v2.1.4', 'v1.8.3', 'v3.0.1', 'v4.2.0', 'v1.15.2']
    const randomVersion = versions[Math.floor(Math.random() * versions.length)]
    
    return {
      tag_name: randomVersion,
      name: randomVersion,
      published_at: '2024-01-10T15:30:00Z',
      prerelease: false,
      draft: false,
      html_url: `https://github.com/example/${repo}/releases/tag/${randomVersion}`
    }
  }

  const getDummySummary = (repo, owner) => {
    return `${repo} is a well-maintained open-source project by ${owner} that demonstrates excellent code quality and comprehensive documentation. The repository features a clean architecture, extensive test coverage, and follows modern development best practices. It includes detailed setup instructions, contribution guidelines, and maintains an active community of developers. The project showcases innovative solutions and provides valuable resources for developers working in this domain.`
  }

  const getDummyCoolFacts = (repo) => {
    const factSets = {
      'react': [
        'Originally created by Facebook in 2013',
        'Powers over 8 million websites worldwide',
        'Has one of the largest developer communities',
        'Introduces the concept of Virtual DOM'
      ],
      'vue': [
        'Created by Evan You as a personal project',
        'Combines the best of React and Angular',
        'Has excellent documentation and learning curve',
        'Widely adopted in Asia and Europe'
      ]
    }
    
    return factSets[repo.toLowerCase()] || [
      'Actively maintained with regular updates',
      'Has a growing community of contributors',
      'Features comprehensive documentation',
      'Implements modern development patterns'
    ]
  }

  const handleCopyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }



  return (
    <section id="demo" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 glass-subtle rounded-full mb-4 glow-accent">
            <Zap className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Try the GitHub Summarizer API
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience a realistic demonstration of our AI-powered GitHub analysis. View the API request structure 
            and see how our API would extract insights from GitHub repositories. This demo uses simulated data 
            to show the API's capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Request Panel */}
          <div className="space-y-6">
            <Card className="glass">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Code2 className="w-5 h-5 text-primary" />
                    <CardTitle className="text-foreground">API Request</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs glass-subtle px-2 py-1 rounded font-mono text-muted-foreground border border-border/50">
                      POST
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      /api/github-summarizer
                    </span>
                  </div>
                </div>
                <CardDescription>
                  View the JSON payload structure for the GitHub Summarizer API (demo mode)
                </CardDescription>
                
                {/* Headers Display */}
                <div className="mt-4 p-3 glass-subtle rounded-lg border border-border/50">
                  <h5 className="text-xs font-medium text-foreground mb-2">Request Headers (Auto-included)</h5>
                  <div className="space-y-1 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Content-Type:</span>
                      <span className="text-foreground">application/json</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">apiKey:</span>
                      <span className="text-green-400">●●●●●●●●●●●●</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Request Payload (Read-only)
                  </label>
                  <textarea
                    value={requestPayload}
                    readOnly
                    className="w-full h-32 px-4 py-3 glass-subtle rounded-lg text-foreground font-mono text-sm resize-none cursor-default bg-muted/20 border border-border/50"
                    placeholder="Request payload will be shown here..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    The request payload is automatically generated for demo purposes
                  </p>
                </div>
                
                <Button
                  onClick={handleSendRequest}
                  disabled={isLoading || !requestPayload.trim()}
                  className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-primary-foreground py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 glow-purple"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Send Request
                    </>
                  )}
                </Button>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Request payload shows the expected JSON structure</p>
                  <p>• Demo API key is automatically included in headers</p>
                  <p>• Simulated analysis shows realistic API response structure</p>
                  <p>• Response includes repository details and AI-generated summary</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Response Panel */}
          <div className="space-y-6">
            <Card className="glass">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      response ? 'bg-green-400' : error ? 'bg-red-400' : 'bg-gray-400'
                    }`} />
                    <CardTitle className="text-foreground">API Response</CardTitle>
                  </div>
                  {response && (
                    <Button
                      onClick={handleCopyResponse}
                      className="px-3 py-1 glass-subtle text-muted-foreground hover:text-foreground transition-colors"
                      size="sm"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  )}
                </div>
                <CardDescription>
                  Simulated response from the GitHub Summarizer API
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Loading State */}
                {isLoading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center space-y-4">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                      <p className="text-muted-foreground">Generating demo analysis...</p>
                    </div>
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="glass-subtle rounded-lg p-4 border border-destructive/20 bg-destructive/5">
                    <div className="flex items-center gap-3 text-destructive">
                      <XCircle className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">Request Failed</h3>
                        <p className="text-sm text-destructive/80 mt-1">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Success State */}
                {response && (
                  <div className="space-y-4">
                    <div className="glass-subtle rounded-lg p-4 border border-green-500/20 bg-green-500/5">
                      <div className="flex items-center gap-3 text-green-400 mb-3">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        <h3 className="font-medium">Demo Analysis Complete</h3>
                      </div>
                      
                      {response.repository && (
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Repository:</span>
                            <span className="font-medium text-foreground">{response.repository}</span>
                          </div>
                          {response.extractedFrom?.owner && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Owner:</span>
                              <span className="font-medium text-foreground">{response.extractedFrom.owner}</span>
                            </div>
                          )}
                          {response.extractedFrom?.repo && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Repo:</span>
                              <span className="font-medium text-foreground">{response.extractedFrom.repo}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {response.aiSummary?.summary && (
                      <div className="glass-subtle rounded-lg p-4">
                        <h4 className="font-medium text-foreground mb-3">AI-Generated Summary (Demo)</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {response.aiSummary.summary}
                        </p>
                      </div>
                    )}

                    {response.aiSummary?.cool_facts && response.aiSummary.cool_facts.length > 0 && (
                      <div className="glass-subtle rounded-lg p-4">
                        <h4 className="font-medium text-foreground mb-3">Cool Facts</h4>
                        <ul className="space-y-2">
                          {response.aiSummary.cool_facts.map((fact, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-accent mt-1">•</span>
                              <span>{fact}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {response.repositoryData && (
                      <div className="glass-subtle rounded-lg p-4">
                        <h4 className="font-medium text-foreground mb-3">Repository Details</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Stars:</span>
                              <span className="font-medium text-foreground">{response.repositoryData.stars?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Forks:</span>
                              <span className="font-medium text-foreground">{response.repositoryData.forks?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Language:</span>
                              <span className="font-medium text-foreground">{response.repositoryData.language}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Latest:</span>
                              <span className="font-medium text-foreground">{response.latestRelease?.tag_name || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">License:</span>
                              <span className="font-medium text-foreground">{response.repositoryData.license}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Size:</span>
                              <span className="font-medium text-foreground">{Math.floor(response.repositoryData.size / 1024)} KB</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="glass-subtle rounded-lg p-4">
                      <h4 className="font-medium text-foreground mb-2">Full Response</h4>
                      <pre className="text-xs text-muted-foreground bg-black/20 p-3 rounded overflow-x-auto font-mono">
                        {JSON.stringify(response, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Default State */}
                {!response && !error && !isLoading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 glass-subtle rounded-full flex items-center justify-center mx-auto">
                        <Play className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">Send a request to see the API response</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 glass-subtle rounded-full flex items-center justify-center mx-auto">
              <Code2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Interactive Demo</h3>
            <p className="text-sm text-muted-foreground">
              Test our API interface with realistic simulated responses
            </p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="w-12 h-12 glass-subtle rounded-full flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold text-foreground">AI-Powered Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Get intelligent insights and summaries from repository documentation
            </p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="w-12 h-12 glass-subtle rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="font-semibold text-foreground">Instant Results</h3>
            <p className="text-sm text-muted-foreground">
              Receive structured data and summaries in seconds
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
