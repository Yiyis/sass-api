'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Copy, CheckCircle, XCircle, Loader2, Code2, Zap } from "lucide-react"

export function InteractiveDemoSection() {
  const demoApiKey = process.env.NEXT_PUBLIC_DEMO_API_KEY || 'demo_key_for_testing'
  
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
      
      const res = await fetch('/api/github-summarizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apiKey': demoApiKey,
        },
        body: JSON.stringify(parsedPayload),
      })

      const result = await res.json()

      if (res.ok) {
        setResponse(result)
      } else {
        setError(result.error || 'Failed to analyze repository')
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('Invalid JSON format. Please check your request payload.')
      } else {
        setError('Network error. Please try again.')
      }
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const resetToDefault = () => {
    setRequestPayload(defaultExample)
    setResponse(null)
    setError(null)
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
            Experience our AI-powered GitHub analysis in real-time. Edit the request payload and see how our API 
            extracts insights from any public GitHub repository. Authentication is handled automatically for the demo.
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
                  Edit the JSON payload below to test different GitHub repositories
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
                    Request Payload
                  </label>
                  <textarea
                    value={requestPayload}
                    onChange={(e) => setRequestPayload(e.target.value)}
                    className="w-full h-32 px-4 py-3 glass-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder-muted-foreground font-mono text-sm transition-all duration-200 resize-none"
                    placeholder="Enter JSON payload..."
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button
                    onClick={handleSendRequest}
                    disabled={isLoading || !requestPayload.trim()}
                    className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-primary-foreground py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 glow-purple"
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
                  
                  <Button
                    onClick={resetToDefault}
                    disabled={isLoading}
                    className="px-6 py-3 glass-subtle text-foreground hover:glass-strong disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all duration-200"
                  >
                    Reset
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Use any public GitHub repository URL</p>
                  <p>• API key is automatically sent in request headers</p>
                  <p>• The API will analyze the README and extract key insights</p>
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
                  Live response from the GitHub Summarizer API
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Loading State */}
                {isLoading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center space-y-4">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                      <p className="text-muted-foreground">Analyzing repository...</p>
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
                        <h3 className="font-medium">Analysis Complete</h3>
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
                        <h4 className="font-medium text-foreground mb-3">AI-Generated Summary</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {response.aiSummary.summary}
                        </p>
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
            <h3 className="font-semibold text-foreground">Live API Testing</h3>
            <p className="text-sm text-muted-foreground">
              Test our API in real-time with any public GitHub repository URL
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
