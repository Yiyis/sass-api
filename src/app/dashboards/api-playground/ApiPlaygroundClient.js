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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Play className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">API Playground</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Test and validate your API keys. Enter an API key below to check if it's valid and see its details.
        </p>
      </div>

      {/* API Key Validation Form */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-900 mb-2">
                API Key
              </label>
              <input
                id="apiKey"
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key (e.g., api_live_1234567890abcdef)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 font-mono text-sm"
                disabled={isValidating}
              />
              <p className="mt-2 text-sm text-gray-500">
                Your API key should start with "api_" followed by a unique identifier
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isValidating || !apiKey.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
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
                className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3 text-red-800">
              <XCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Validation Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Validation Result */}
      {validationResult && (
        <div className="max-w-2xl mx-auto">
          <div className={`border rounded-lg p-6 ${
            validationResult.isValid 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start gap-3">
              {validationResult.isValid ? (
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${
                  validationResult.isValid ? 'text-green-800' : 'text-red-800'
                }`}>
                  {validationResult.isValid ? 'Valid API Key' : 'Invalid API Key'}
                </h3>
                
                <p className={`mt-2 ${
                  validationResult.isValid ? 'text-green-700' : 'text-red-700'
                }`}>
                  {validationResult.message}
                </p>

                                 {/* Key Details */}
                 {validationResult.isValid && validationResult.keyDetails && (
                   <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
                     <h4 className="font-medium text-green-800 mb-3">Key Details</h4>
                     <div className="space-y-2 text-sm">
                       <div className="flex justify-between">
                         <span className="text-gray-600">Name:</span>
                         <span className="font-medium text-gray-900">{validationResult.keyDetails.name || 'N/A'}</span>
                       </div>
                       {validationResult.keyDetails.description && (
                         <div className="flex justify-between">
                           <span className="text-gray-600">Description:</span>
                           <span className="font-medium text-gray-900">{validationResult.keyDetails.description}</span>
                         </div>
                       )}
                       <div className="flex justify-between">
                         <span className="text-gray-600">Type:</span>
                         <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                           validationResult.keyDetails.type === 'live' 
                             ? 'bg-green-100 text-green-800' 
                             : 'bg-yellow-100 text-yellow-800'
                         }`}>
                           {validationResult.keyDetails.type || 'unknown'}
                         </span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-gray-600">Usage:</span>
                         <span className="font-medium text-gray-900">
                           {typeof validationResult.keyDetails.usage === 'number' 
                             ? validationResult.keyDetails.usage.toLocaleString() 
                             : '0'
                           }
                         </span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-gray-600">Permissions:</span>
                         <span className="font-medium text-gray-900">
                           {Array.isArray(validationResult.keyDetails.permissions) && validationResult.keyDetails.permissions.length > 0 
                             ? validationResult.keyDetails.permissions.join(', ')
                             : 'None'
                           }
                         </span>
                       </div>
                       {validationResult.keyDetails.created_at && (
                         <div className="flex justify-between">
                           <span className="text-gray-600">Created:</span>
                           <span className="font-medium text-gray-900">
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
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">How to use the API Playground</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>1. <strong>Enter your API key</strong> in the form above</p>
            <p>2. <strong>Click "Validate Key"</strong> to check if the key is valid</p>
            <p>3. <strong>View the results</strong> to see key details and permissions</p>
            <p>4. <strong>Use valid keys</strong> in your API requests</p>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">API Key Format</h4>
            <p className="text-sm text-blue-700">
              Valid API keys follow this pattern: <code className="bg-blue-100 px-2 py-1 rounded text-blue-800">api_[type]_[identifier]</code>
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Example: <code className="bg-blue-100 px-2 py-1 rounded text-blue-800">api_live_1234567890abcdef</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
