'use client'

import { useState } from 'react'
import { Play, CheckCircle, XCircle, Loader2, Github, Star, Tag, Calendar, Code2, FileText } from 'lucide-react'

export default function ApiPlaygroundClient() {
  const [apiKey, setApiKey] = useState('')
  const [githubUrl, setGithubUrl] = useState('https://github.com/facebook/react')
  const [isValidating, setIsValidating] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [validationResult, setValidationResult] = useState(null)
  const [testResult, setTestResult] = useState(null)
  const [error, setError] = useState(null)
  const [testError, setTestError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!apiKey.trim()) {
      setError('Please enter an API key')
      setValidationResult(null)
      return
    }

    setIsValidating(true)
    setError(null)
    setValidationResult(null)

    try {
      // Call the API to validate the key
      const response = await fetch('/api/validate-api-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      })

      const result = await response.json()

      if (response.ok) {
        setValidationResult({
          isValid: result.isValid,
          message: result.message,
          keyDetails: result.keyDetails
        })
      } else {
        setError(result.error || 'Failed to validate API key')
      }
    } catch (err) {
      setError('Network error. Please try again.')
      console.error('Error validating API key:', err)
    } finally {
      setIsValidating(false)
    }
  }

  const handleReset = () => {
    setApiKey('')
    setValidationResult(null)
    setError(null)
  }

  const handleGitHubTest = async (e) => {
    e.preventDefault()
    
    if (!apiKey.trim()) {
      setTestError('Please enter an API key first')
      setTestResult(null)
      return
    }

    if (!githubUrl.trim()) {
      setTestError('Please enter a GitHub URL')
      setTestResult(null)
      return
    }

    // Validate GitHub URL format
    const githubUrlPattern = /^https:\/\/github\.com\/[^\/]+\/[^\/]+\/?$/
    if (!githubUrlPattern.test(githubUrl.trim())) {
      setTestError('Please enter a valid GitHub URL (e.g., https://github.com/facebook/react)')
      setTestResult(null)
      return
    }

    setIsTesting(true)
    setTestError(null)
    setTestResult(null)

    try {
      const startTime = Date.now()
      
      // Call the GitHub summarizer API
      const response = await fetch('/api/github-summarizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apiKey': apiKey.trim(),
        },
        body: JSON.stringify({ 
          githubUrl: githubUrl.trim() 
        }),
      })

      const endTime = Date.now()
      const responseTime = endTime - startTime
      const result = await response.json()

      if (response.ok) {
        setTestResult({
          success: true,
          responseTime,
          data: result,
          rateLimitHeaders: {
            limit: response.headers.get('X-RateLimit-Limit'),
            remaining: response.headers.get('X-RateLimit-Remaining'),
            reset: response.headers.get('X-RateLimit-Reset'),
            window: response.headers.get('X-RateLimit-Window')
          }
        })
      } else {
        setTestError(`API Error (${response.status}): ${result.error || 'Unknown error'}`)
        if (result.rateLimitInfo && response.status === 429) {
          setTestResult({
            success: false,
            responseTime,
            rateLimitExceeded: true,
            rateLimitInfo: result.rateLimitInfo
          })
        }
      }
    } catch (err) {
      setTestError('Network error. Please try again.')
      console.error('Error testing GitHub API:', err)
    } finally {
      setIsTesting(false)
    }
  }

  const handleResetTest = () => {
    setGithubUrl('https://github.com/facebook/react')
    setTestResult(null)
    setTestError(null)
  }

  return (
    <div className="space-y-8 mt-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 glass-subtle rounded-full mb-4 glow-purple">
          <Play className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">API Playground</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Test and validate your API keys, then try the GitHub Summarizer API. Enter an API key below to get started.
        </p>
      </div>

      {/* API Key Validation Form */}
      <div className="max-w-2xl mx-auto">
        <div className="glass rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-foreground mb-2">
                API Key
              </label>
              <input
                id="apiKey"
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key (e.g., api_live_1234567890abcdef)"
                className="w-full px-4 py-3 glass-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder-muted-foreground font-mono text-sm transition-all duration-200"
                disabled={isValidating}
              />
              <p className="mt-2 text-sm text-muted-foreground">
                Your API key should start with &quot;api_&quot; followed by a unique identifier
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isValidating || !apiKey.trim()}
                className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-primary-foreground py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 glow-purple hover:glow-purple"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Validate Key
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleReset}
                disabled={isValidating}
                className="px-6 py-3 glass-subtle text-foreground hover:glass-strong disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all duration-200"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-2xl mx-auto">
          <div className="glass-subtle rounded-lg p-4 border border-destructive/20 bg-destructive/5">
            <div className="flex items-center gap-3 text-destructive">
              <XCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Validation Error</h3>
                <p className="text-sm text-destructive/80 mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Validation Result */}
      {validationResult && (
        <div className="max-w-2xl mx-auto">
          <div className={`glass rounded-lg p-6 border ${
            validationResult.isValid 
              ? 'border-green-500/20 bg-green-500/5' 
              : 'border-destructive/20 bg-destructive/5'
          }`}>
            <div className="flex items-start gap-3">
              {validationResult.isValid ? (
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
              )}
              
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${
                  validationResult.isValid ? 'text-green-300' : 'text-destructive'
                }`}>
                  {validationResult.isValid ? 'Valid API Key' : 'Invalid API Key'}
                </h3>
                
                <p className={`mt-2 ${
                  validationResult.isValid ? 'text-green-400/80' : 'text-destructive/80'
                }`}>
                  {validationResult.message}
                </p>

                                 {/* Key Details */}
                 {validationResult.isValid && validationResult.keyDetails && (
                   <div className="mt-4 p-4 glass-subtle rounded-lg border border-green-500/20">
                     <h4 className="font-medium text-green-300 mb-3">Key Details</h4>
                     <div className="space-y-2 text-sm">
                       <div className="flex justify-between">
                         <span className="text-muted-foreground">Name:</span>
                         <span className="font-medium text-foreground">{validationResult.keyDetails.name || 'N/A'}</span>
                       </div>
                       {validationResult.keyDetails.description && (
                         <div className="flex justify-between">
                           <span className="text-muted-foreground">Description:</span>
                           <span className="font-medium text-foreground">{validationResult.keyDetails.description}</span>
                         </div>
                       )}
                       <div className="flex justify-between">
                         <span className="text-muted-foreground">Type:</span>
                         <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                           validationResult.keyDetails.type === 'live' 
                             ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                             : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                         }`}>
                           {validationResult.keyDetails.type || 'unknown'}
                         </span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-muted-foreground">Usage:</span>
                         <span className="font-medium text-foreground">
                           {typeof validationResult.keyDetails.usage === 'number' 
                             ? validationResult.keyDetails.usage.toLocaleString() 
                             : '0'
                           }
                         </span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-muted-foreground">Permissions:</span>
                         <span className="font-medium text-foreground">
                           {Array.isArray(validationResult.keyDetails.permissions) && validationResult.keyDetails.permissions.length > 0 
                             ? validationResult.keyDetails.permissions.join(', ')
                             : 'None'
                           }
                         </span>
                       </div>
                       {validationResult.keyDetails.created_at && (
                         <div className="flex justify-between">
                           <span className="text-muted-foreground">Created:</span>
                           <span className="font-medium text-foreground">
                             {new Date(validationResult.keyDetails.created_at).toLocaleDateString()}
                           </span>
                         </div>
                       )}
                     </div>
                   </div>
                 )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GitHub Summarizer Test Section */}
      <div className="max-w-2xl mx-auto">
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Github className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Test GitHub Summarizer API</h2>
          </div>
          
          <p className="text-muted-foreground mb-6">
            Test the GitHub Summarizer API with a repository URL. This will analyze the repository and return detailed information including stars, latest version, and AI-generated summary.
          </p>
          
          <form onSubmit={handleGitHubTest} className="space-y-6">
            <div>
              <label htmlFor="githubUrl" className="block text-sm font-medium text-foreground mb-2">
                GitHub Repository URL
              </label>
              <input
                id="githubUrl"
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/facebook/react"
                className="w-full px-4 py-3 glass-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder-muted-foreground font-mono text-sm transition-all duration-200"
                disabled={isTesting}
              />
              <p className="mt-2 text-sm text-muted-foreground">
                Enter a public GitHub repository URL (e.g., https://github.com/owner/repo)
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isTesting || !apiKey.trim() || !githubUrl.trim()}
                className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-primary-foreground py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 glow-purple hover:glow-purple"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Repository...
                  </>
                ) : (
                  <>
                    <Github className="w-5 h-5" />
                    Test API
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleResetTest}
                disabled={isTesting}
                className="px-6 py-3 glass-subtle text-foreground hover:glass-strong disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all duration-200"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* GitHub Test Error Display */}
      {testError && (
        <div className="max-w-2xl mx-auto">
          <div className="glass-subtle rounded-lg p-4 border border-destructive/20 bg-destructive/5">
            <div className="flex items-center gap-3 text-destructive">
              <XCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <h3 className="font-medium">API Test Error</h3>
                <p className="text-sm text-destructive/80 mt-1">{testError}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GitHub Test Results */}
      {testResult && (
        <div className="max-w-4xl mx-auto">
          <div className={`glass rounded-lg p-6 border ${
            testResult.success 
              ? 'border-green-500/20 bg-green-500/5' 
              : 'border-destructive/20 bg-destructive/5'
          }`}>
            <div className="flex items-start gap-3 mb-4">
              {testResult.success ? (
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
              )}
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-lg font-semibold ${
                    testResult.success ? 'text-green-300' : 'text-destructive'
                  }`}>
                    {testResult.success ? 'API Test Successful' : 'API Test Failed'}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    Response time: {testResult.responseTime}ms
                  </span>
                </div>

                {testResult.success && testResult.data && (
                  <div className="space-y-6">
                    {/* Repository Information */}
                    <div className="glass-subtle rounded-lg p-4 border border-green-500/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Code2 className="w-5 h-5 text-green-400" />
                        <h4 className="font-medium text-green-300">Repository Information</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Repository:</span>
                            <span className="font-medium text-foreground">{testResult.data.repository}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Description:</span>
                            <span className="font-medium text-foreground text-right max-w-48 truncate" title={testResult.data.repositoryData?.description}>
                              {testResult.data.repositoryData?.description || 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Stars:</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400" />
                              <span className="font-medium text-foreground">
                                {testResult.data.repositoryData?.stars?.toLocaleString() || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Language:</span>
                            <span className="font-medium text-foreground">{testResult.data.repositoryData?.language || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Forks:</span>
                            <span className="font-medium text-foreground">
                              {testResult.data.repositoryData?.forks?.toLocaleString() || 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Latest Version:</span>
                            <div className="flex items-center gap-1">
                              <Tag className="w-4 h-4 text-blue-400" />
                              <span className="font-medium text-foreground">
                                {testResult.data.latestRelease?.tag_name || 'No releases'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Summary */}
                    {testResult.data.aiSummary && (
                      <div className="glass-subtle rounded-lg p-4 border border-green-500/20">
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="w-5 h-5 text-green-400" />
                          <h4 className="font-medium text-green-300">AI Summary</h4>
                        </div>
                        {testResult.data.aiSummary.summary && (
                          <div className="mb-4">
                            <h5 className="font-medium text-foreground mb-2">Summary:</h5>
                            <p className="text-sm text-foreground/80 leading-relaxed">
                              {testResult.data.aiSummary.summary}
                            </p>
                          </div>
                        )}
                        {testResult.data.aiSummary.cool_facts && testResult.data.aiSummary.cool_facts.length > 0 && (
                          <div>
                            <h5 className="font-medium text-foreground mb-2">Cool Facts:</h5>
                            <ul className="text-sm text-foreground/80 space-y-1">
                              {testResult.data.aiSummary.cool_facts.map((fact, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-green-400 mt-1">•</span>
                                  <span>{fact}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* API Key Usage */}
                    <div className="glass-subtle rounded-lg p-4 border border-green-500/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-5 h-5 text-green-400" />
                        <h4 className="font-medium text-green-300">API Key Usage</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Key Name:</span>
                            <span className="font-medium text-foreground">{testResult.data.keyDetails?.name || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Usage:</span>
                            <span className="font-medium text-foreground">
                              {testResult.data.keyDetails?.usage || 0} / {testResult.data.keyDetails?.usage_limit || 'N/A'}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Remaining:</span>
                            <span className="font-medium text-foreground">{testResult.data.keyDetails?.remaining || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Rate Limit:</span>
                            <span className="font-medium text-foreground">
                              {testResult.rateLimitHeaders?.remaining || 'N/A'} / {testResult.rateLimitHeaders?.limit || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rate Limit Exceeded */}
                {testResult.rateLimitExceeded && testResult.rateLimitInfo && (
                  <div className="mt-4 p-4 glass-subtle rounded-lg border border-destructive/20">
                    <h4 className="font-medium text-destructive mb-3">Rate Limit Exceeded</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Limit:</span>
                        <span className="font-medium text-foreground">{testResult.rateLimitInfo.limit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current Usage:</span>
                        <span className="font-medium text-foreground">{testResult.rateLimitInfo.current}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reset Time:</span>
                        <span className="font-medium text-foreground">
                          {new Date(testResult.rateLimitInfo.resetAt).toLocaleString()}
                        </span>
                      </div>
                      {testResult.rateLimitInfo.retryAfter && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Retry After:</span>
                          <span className="font-medium text-foreground">{testResult.rateLimitInfo.retryAfter}s</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Usage Instructions */}
      <div className="max-w-2xl mx-auto">
        <div className="glass rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-3">How to use the API Playground</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>1. <strong className="text-foreground">Enter your API key</strong> and validate it first</p>
            <p>2. <strong className="text-foreground">Enter a GitHub repository URL</strong> to test the summarizer API</p>
            <p>3. <strong className="text-foreground">Click &quot;Test API&quot;</strong> to analyze the repository</p>
            <p>4. <strong className="text-foreground">View comprehensive results</strong> including stars, version, and AI summary</p>
            <p>5. <strong className="text-foreground">Monitor usage</strong> and rate limit information</p>
          </div>
          
          <div className="mt-4 p-4 glass-subtle rounded-lg border border-primary/20 bg-primary/5">
            <h4 className="font-medium text-primary mb-2">API Key Format</h4>
            <p className="text-sm text-foreground/80">
              Valid API keys follow this pattern: <code className="glass-subtle px-2 py-1 rounded text-primary font-mono">api_[type]_[identifier]</code>
            </p>
            <p className="text-sm text-foreground/80 mt-1">
              Example: <code className="glass-subtle px-2 py-1 rounded text-primary font-mono">api_live_1234567890abcdef</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
