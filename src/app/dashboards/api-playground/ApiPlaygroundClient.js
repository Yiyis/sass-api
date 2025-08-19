'use client'

import { useState } from 'react'
import { Play, CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function ApiPlaygroundClient() {
  const [apiKey, setApiKey] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState(null)
  const [error, setError] = useState(null)

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

  return (
    <div className="space-y-8 mt-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 glass-subtle rounded-full mb-4 glow-purple">
          <Play className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">API Playground</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Test and validate your API keys. Enter an API key below to check if it&apos;s valid and see its details.
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

      {/* Usage Instructions */}
      <div className="max-w-2xl mx-auto">
        <div className="glass rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-3">How to use the API Playground</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>1. <strong className="text-foreground">Enter your API key</strong> in the form above</p>
            <p>2. <strong className="text-foreground">Click &quot;Validate Key&quot;</strong> to check if the key is valid</p>
            <p>3. <strong className="text-foreground">View the results</strong> to see key details and permissions</p>
            <p>4. <strong className="text-foreground">Use valid keys</strong> in your API requests</p>
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
