import { Eye, EyeOff, Copy, Edit, Trash2 } from 'lucide-react'

export default function ApiKeysTable({ 
  apiKeys, 
  showApiKey, 
  copySuccess, 
  onToggleVisibility, 
  onCopy, 
  onEdit, 
  onDelete 
}) {
  return (
    <div className="overflow-hidden border border-border/30 rounded-lg glass-subtle">
      <table className="w-full">
        <thead className="bg-muted/20">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">NAME</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">TYPE</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">USAGE</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">KEY</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">OPTIONS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/30">
          {apiKeys.map((key) => (
            <tr key={key.id} className="hover:bg-muted/10 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-foreground">{key.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  key.type === 'live' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {key.type}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                {key.usage?.toLocaleString() || '0'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono text-muted-foreground">
                    {showApiKey[key.id] ? key.key : `${key.key.substring(0, 8)}••••••••••••••••••••••••`}
                  </code>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleVisibility(key.id)}
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                    title={showApiKey[key.id] ? 'Hide' : 'Show'}
                  >
                    {showApiKey[key.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    onClick={() => onCopy(key.key, key.id)}
                    className={`p-1 transition-colors ${
                      copySuccess[key.id] 
                        ? 'text-green-400' 
                        : 'text-muted-foreground hover:text-primary'
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
                    onClick={() => onEdit(key)}
                    className="p-1 text-muted-foreground hover:text-primary transition-colors"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(key.id)}
                    className="p-1 text-muted-foreground hover:text-red-400 transition-colors"
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
  )
}
