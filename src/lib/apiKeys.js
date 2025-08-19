// Client-side API keys service using authenticated REST endpoints

// Create a new API key
export async function createApiKey(apiKeyData) {
  try {
    console.log('createApiKey: Starting...')
    
    const response = await fetch('/api/user/api-keys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiKeyData),
    })

    const result = await response.json()
    console.log('createApiKey: Response:', result)

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create API key')
    }

    return result
  } catch (error) {
    console.error('createApiKey: Exception caught:', error)
    return { data: null, error }
  }
}

// Get all API keys
export async function getApiKeys() {
  try {
    console.log('getApiKeys: Starting...')
    
    const response = await fetch('/api/user/api-keys')
    const result = await response.json()

    console.log('getApiKeys: Response:', result)

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch API keys')
    }

    return result
  } catch (error) {
    console.error('getApiKeys: Exception caught:', error)
    return { data: null, error }
  }
}

// Get a single API key by ID
export async function getApiKeyById(id) {
  try {
    const response = await fetch(`/api/user/api-keys/${id}`)
    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch API key')
    }

    return result
  } catch (error) {
    console.error('Error fetching API key:', error)
    return { data: null, error }
  }
}

// Update an API key
export async function updateApiKey(id, updateData) {
  try {
    const response = await fetch(`/api/user/api-keys/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update API key')
    }

    return result
  } catch (error) {
    console.error('Error updating API key:', error)
    return { data: null, error }
  }
}

// Delete an API key
export async function deleteApiKey(id) {
  try {
    const response = await fetch(`/api/user/api-keys/${id}`, {
      method: 'DELETE',
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to delete API key')
    }

    return result
  } catch (error) {
    console.error('Error deleting API key:', error)
    return { error }
  }
}

// Update API key usage
export async function updateApiKeyUsage(keyId, incrementUsage = 1) {
  try {
    const response = await fetch('/api/user/api-keys/usage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keyId, incrementUsage }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update API key usage')
    }

    return result
  } catch (error) {
    console.error('Error updating API key usage:', error)
    return { error }
  }
}

// Get total usage across all API keys
export async function getTotalUsage() {
  try {
    const response = await fetch('/api/user/api-keys/usage')
    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to get total usage')
    }

    // Extract totalUsage from the analytics response
    return { data: result.data?.totalUsage || 0, error: null }
  } catch (error) {
    console.error('Error calculating total usage:', error)
    return { data: 0, error }
  }
}
