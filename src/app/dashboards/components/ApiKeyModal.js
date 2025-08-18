export default function ApiKeyModal({ 
  isOpen, 
  editingKey, 
  formData, 
  onFormChange, 
  onSubmit, 
  onClose 
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50">
      <div className="glass-strong rounded-lg max-w-md w-full p-4 sm:p-6 border border-border/30">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-foreground">
          {editingKey ? 'Edit API Key' : 'Create New API Key'}
        </h2>
        
        <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onFormChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-border/50 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground placeholder-muted-foreground"
              placeholder="Enter API key name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => onFormChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-border/50 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground placeholder-muted-foreground"
              placeholder="Enter API key description (optional)"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
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
                        onFormChange('permissions', [...(Array.isArray(formData.permissions) ? formData.permissions : []), permission])
                      } else {
                        onFormChange('permissions', (Array.isArray(formData.permissions) ? formData.permissions : []).filter(p => p !== permission))
                      }
                    }}
                    className="mr-2 w-4 h-4 text-primary bg-card border-border/50 rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="text-sm text-foreground capitalize">{permission}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              className="w-full sm:flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-md transition-colors"
            >
              {editingKey ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 bg-muted hover:bg-muted/80 text-muted-foreground py-2 px-4 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
