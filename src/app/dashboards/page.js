'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Copy, Eye, EyeOff } from 'lucide-react'

export default function DashboardPage() {
  const [apiKeys, setApiKeys] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingKey, setEditingKey] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: []
  })
  const [showApiKey, setShowApiKey] = useState({})

  // Mock data - replace with actual API calls
  useEffect(() => {
    setApiKeys([
      {
        id: 1,
        name: 'Production API Key',
        description: 'Main API key for production environment',
        key: 'pk_live_1234567890abcdef',
        permissions: ['read', 'write'],
        createdAt: '2024-01-15',
        lastUsed: '2024-01-20'
      },
      {
        id: 2,
        name: 'Development API Key',
        description: 'API key for development and testing',
        key: 'pk_test_abcdef1234567890',
        permissions: ['read'],
        createdAt: '2024-01-10',
        lastUsed: '2024-01-18'
      }
    ])
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingKey) {
      // Update existing key
      setApiKeys(keys => 
        keys.map(key => 
          key.id === editingKey.id 
            ? { ...key, ...formData }
            : key
        )
      )
    } else {
      // Create new key
      const newKey = {
        id: Date.now(),
        ...formData,
        key: `pk_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString().split('T')[0],
        lastUsed: '-'
      }
      setApiKeys(keys => [...keys, newKey])
    }
    
    resetForm()
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this API key?')) {
      setApiKeys(keys => keys.filter(key => key.id !== id))
    }
  }

  const handleEdit = (key) => {
    setEditingKey(key)
    setFormData({
      name: key.name,
      description: key.description,
      permissions: key.permissions
    })
    setIsModalOpen(true)
  }

  const resetForm = () => {
    setFormData({ name: '', description: '', permissions: [] })
    setEditingKey(null)
    setIsModalOpen(false)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const toggleApiKeyVisibility = (id) => {
    setShowApiKey(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">API Keys Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your API keys and permissions</p>
        </div>

        {/* Create Button */}
        <div className="mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Create New API Key
          </button>
        </div>

        {/* API Keys Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {apiKeys.map((key) => (
            <div key={key.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{key.name}</h3>
                  <p className="text-sm text-gray-600">{key.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(key)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(key.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* API Key Display */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                    {showApiKey[key.id] ? key.key : '••••••••••••••••••••••••'}
                  </code>
                  <button
                    onClick={() => toggleApiKeyVisibility(key.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title={showApiKey[key.id] ? 'Hide' : 'Show'}
                  >
                    {showApiKey[key.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(key.key)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Copy"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              {/* Permissions */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissions
                </label>
                <div className="flex flex-wrap gap-2">
                  {key.permissions.map((permission) => (
                    <span
                      key={permission}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>

              {/* Metadata */}
              <div className="text-xs text-gray-500 space-y-1">
                <div>Created: {key.createdAt}</div>
                <div>Last used: {key.lastUsed}</div>
              </div>
            </div>
          ))}
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
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingKey ? 'Edit API Key' : 'Create New API Key'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permissions
                </label>
                <div className="space-y-2">
                  {['read', 'write', 'delete'].map((permission) => (
                    <label key={permission} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              permissions: [...prev.permissions, permission]
                            }))
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              permissions: prev.permissions.filter(p => p !== permission)
                            }))
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 capitalize">{permission}</span>
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
