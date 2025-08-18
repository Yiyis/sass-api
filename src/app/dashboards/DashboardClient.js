'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { createApiKey, getApiKeys, updateApiKey, deleteApiKey, getTotalUsage } from '@/lib/apiKeys'

// Import components
import BackToHome from './components/BackToHome'
import CurrentPlan from './components/CurrentPlan'
import ApiKeysTable from './components/ApiKeysTable'
import EmptyState from './components/EmptyState'
import ApiKeyModal from './components/ApiKeyModal'
import ErrorDisplay from './components/ErrorDisplay'
import LoadingSpinner from './components/LoadingSpinner'

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
      setError(null)
      
      const { data, error } = await getApiKeys()
      
      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
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
        setError(null)
        setCopySuccess(prev => ({ ...prev, [keyId]: true }))
        setTimeout(() => {
          setCopySuccess(prev => ({ ...prev, [keyId]: false }))
        }, 2000)
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
          setTimeout(() => {
            setCopySuccess(prev => ({ ...prev, [keyId]: false }))
          }, 2000)
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

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Don't render anything until we're on the client
  if (!isClient) {
    return <LoadingSpinner message="Loading dashboard..." />
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <BackToHome />
      
      <CurrentPlan totalUsage={totalUsage} />

      {/* API Keys Section */}
      <div className="glass rounded-xl border border-border/30 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground">API Keys</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
        
        <p className="text-muted-foreground mb-6 text-sm sm:text-base">
          The key is used to authenticate your requests to the API. To learn more, see the{' '}
          <a href="#" className="text-primary hover:text-primary/90 underline">documentation page</a>.
        </p>

        <ErrorDisplay error={error} />

        {isLoading ? (
          <LoadingSpinner message="Loading API keys..." />
        ) : (
          <>
            {apiKeys.length > 0 ? (
              <ApiKeysTable
                apiKeys={apiKeys}
                showApiKey={showApiKey}
                copySuccess={copySuccess}
                onToggleVisibility={toggleApiKeyVisibility}
                onCopy={copyToClipboard}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <EmptyState onCreateClick={() => setIsModalOpen(true)} />
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground text-center sm:text-left">
        <span className="text-primary font-medium">GitHub Analyzer Pro</span>
        <span>Powered by Next.js</span>
      </div>

      {/* Modal */}
      <ApiKeyModal
        isOpen={isModalOpen}
        editingKey={editingKey}
        formData={formData}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
        onClose={resetForm}
      />
    </div>
  )
}
