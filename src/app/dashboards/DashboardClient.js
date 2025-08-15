'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Copy, Eye, EyeOff, CreditCard, Info, ExternalLink, ArrowLeft } from 'lucide-react'
import { createApiKey, getApiKeys, updateApiKey, deleteApiKey, getTotalUsage } from '@/lib/apiKeys'

export default function DashboardClient() {
  const [apiKeys, setApiKeys] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingKey, setEditingKey] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: []
  })
  const [showApiKey, setShowApiKey] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalUsage, setTotalUsage] = useState(0)
  const [copySuccess, setCopySuccess] = useState({})
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Fetch API keys from database
  useEffect(() => {
    if (isClient) {
      fetchApiKeys()
      fetchTotalUsage()
    }
  }, [isClient])

  const fetchApiKeys = async () => {
    try {
      setIsLoading(true)
      setError(null) // Clear any previous errors
      
      console.log('Fetching API keys...')
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      
      const { data, error } = await getApiKeys()
      
      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      console.log('API keys fetched successfully:', data)
      setApiKeys(data || [])
    } catch (err) {
      console.error('Error fetching API keys:', err)
      setError(`Failed to fetch API keys: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTotalUsage = async () => {
    try {
      const { data, error } = await getTotalUsage()
      if (error) throw error
      setTotalUsage(data || 0)
    } catch (err) {
      console.error('Error fetching total usage:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingKey) {
        // Update existing key
        const { data, error } = await updateApiKey(editingKey.id, formData)
        if (error) throw error
        
        // Update local state
        setApiKeys(keys => 
          keys.map(key => 
            key.id === editingKey.id 
              ? { ...key, ...data }
              : key
          )
        )
      } else {
        // Create new key
        const { data, error } = await createApiKey(formData)
        if (error) throw error
        
        // Add to local state
        setApiKeys(keys => [data, ...keys])
        
        // Refresh total usage
        fetchTotalUsage()
      }
      
      resetForm()
    } catch (err) {
      setError('Failed to save API key')
      console.error('Error saving API key:', err)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this API key?')) {
      try {
        const { error } = await deleteApiKey(id)
        if (error) throw error
        
        // Remove from local state
        setApiKeys(keys => keys.filter(key => key.id !== id))
        
        // Refresh total usage
        fetchTotalUsage()
      } catch (err) {
        setError('Failed to delete API key')
        console.error('Error deleting API key:', err)
      }
    }
  }

  const handleEdit = (key) => {
    setEditingKey(key)
    setFormData({
      name: key.name || '',
      description: key.description || '',
      permissions: Array.isArray(key.permissions) ? key.permissions : []
    })
    setIsModalOpen(true)
  }

  const resetForm = () => {
    setFormData({ name: '', description: '', permissions: [] })
    setEditingKey(null)
    setIsModalOpen(false)
  }

  const copyToClipboard = async (text, keyId) => {
    try {
      // Try the modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
        // Show success feedback
        setError(null)
        setCopySuccess(prev => ({ ...prev, [keyId]: true }))
        // Hide success message after 2 seconds
        setTimeout(() => {
          setCopySuccess(prev => ({ ...prev, [keyId]: false }))
        }, 2000)
        console.log('Copied to clipboard successfully')
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        
        try {
          document.execCommand('copy')
          textArea.remove()
          setError(null)
          setCopySuccess(prev => ({ ...prev, [keyId]: true }))
          // Hide success message after 2 seconds
          setTimeout(() => {
            setCopySuccess(prev => ({ ...prev, [keyId]: false }))
          }, 2000)
          console.log('Copied to clipboard using fallback method')
        } catch (err) {
          textArea.remove()
          throw new Error('Fallback copy method failed')
        }
      }
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
      setError('Failed to copy to clipboard. Please copy manually.')
    }
  }

  const toggleApiKeyVisibility = (id) => {
    setShowApiKey(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const totalCredits = 10000 // Mock total credits

  // Don't render anything until we're on the client
  if (!isClient) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-blue-500 transition ease-in-out duration-150">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading dashboard...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Back to Home Link */}
      <div className="mb-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
      
      {/* Current Plan Section */}
      <div className="bg-gradient-to-r from-pink-500 via-red-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-sm font-medium text-pink-100 mb-1">CURRENT PLAN</div>
            <h2 className="text-3xl font-bold">Professional</h2>
          </div>
          <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <CreditCard size={16} />
            Manage Plan
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">API Usage</span>
            <Info size={16} className="text-pink-200" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Plan</span>
              <span>{totalUsage.toLocaleString()}/{totalCredits.toLocaleString()} Credits</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((totalUsage / totalCredits) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <input type="checkbox" id="payAsYouGo" className="sr-only" />
              <label htmlFor="payAsYouGo" className="flex items-center cursor-pointer">
                <div className="w-11 h-6 bg-white/20 rounded-full p-1 transition-colors">
                  <div className="w-4 h-4 bg-white rounded-full transition-transform transform translate-x-0"></div>
                </div>
                <span className="ml-3 text-sm">Pay as you go</span>
              </label>
            </div>
            <Info size={16} className="text-pink-200" />
          </div>
        </div>
      </div>

      {/* API Keys Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">API Keys</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          The key is used to authenticate your requests to the API. To learn more, see the{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700 underline">documentation page</a>.
        </p>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-blue-500 hover:bg-blue-400 transition ease-in-out duration-150 cursor-not-allowed">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading API keys...
            </div>
          </div>
        ) : (
          <>
            {/* API Keys Table */}
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TYPE</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USAGE</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KEY</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OPTIONS</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {apiKeys.map((key) => (
                    <tr key={key.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{key.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          key.type === 'live' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {key.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {key.usage?.toLocaleString() || '0'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono text-gray-600">
                            {showApiKey[key.id] ? key.key : `${key.key.substring(0, 8)}••••••••••••••••••••••••`}
                          </code>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleApiKeyVisibility(key.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title={showApiKey[key.id] ? 'Hide' : 'Show'}
                          >
                            {showApiKey[key.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                          <button
                            onClick={() => copyToClipboard(key.key, key.id)}
                            className={`p-1 transition-colors ${
                              copySuccess[key.id] 
                                ? 'text-green-600' 
                                : 'text-gray-400 hover:text-blue-600'
                            }`}
                            title={copySuccess[key.id] ? 'Copied!' : 'Copy'}
                          >
                            {copySuccess[key.id] ? (
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <Copy size={16} />
                            )}
                          </button>
                          <button
                            onClick={() => handleEdit(key)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(key.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {apiKeys.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No API keys yet</h3>
                <p className="text-gray-600 mb-4">Get started by creating your first API key</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Create API Key
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span className="text-blue-600 font-medium">SaaS API Pro</span>
        <span>Powered by Next.js</span>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              {editingKey ? 'Edit API Key' : 'Create New API Key'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="Enter API key name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="Enter API key description (optional)"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Permissions
                </label>
                <div className="space-y-2">
                  {['read', 'write', 'delete'].map((permission) => (
                    <label key={permission} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={Array.isArray(formData.permissions) && formData.permissions.includes(permission)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              permissions: [...(Array.isArray(prev.permissions) ? prev.permissions : []), permission]
                            }))
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              permissions: (Array.isArray(prev.permissions) ? prev.permissions : []).filter(p => p !== permission)
                            }))
                          }
                        }}
                        className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-sm text-gray-900 capitalize">{permission}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  {editingKey ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
