import { useEffect, useState } from 'react'
import { Copy, Trash2, Check } from 'lucide-react'
import { db, ClipboardItem } from '../lib/idb'

function Clipboard() {
  const [history, setHistory] = useState<ClipboardItem[]>([])

  const [copiedId, setCopiedId] = useState<string | null>(null)
  const getRelativeTime = (timestamp: number) => {
    const now = Date.now()
    const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'url':
        return 'bg-blue-100 text-blue-700'
      case 'code':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleDelete = (index: string) => {
    setHistory((history) => history.filter((item) => item.id.toString() !== index))
  }
 const handleClear = () => {
    setHistory([])
    db.clearHistory().catch((err) => console.error('Failed to clear history:', err))
  }
  const handleItemClick = (item: ClipboardItem) => {
    handleCopy(item.content, item.id.toString())
  }
  useEffect(() => {
    db.getHistory().then(setHistory)
    window.clipboardAPI.onUpdate(async (items: ClipboardItem[]) => {

      const latest = items[0]
      if (latest) {
        await db.addItem(latest)
        const updated = await db.getHistory()
        setHistory(updated)
      }
    })
  }, [])
  return (
    <div className="max-w-2xl mx-auto flex-1">
      {/* Clipboard Items Container */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-900">Recent Items ({history.length})</h2>
        <p className="text-xs text-gray-500 cursor-pointer" onClick={handleClear}> Clear All</p>
        </div>

        {/* Scrollable Items List */}
        <div className="max-h-full overflow-y-auto">
          {history.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-2">
                <Copy className="w-8 h-8 mx-auto" />
              </div>
              <p className="text-gray-500">No clipboard items yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {history.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleItemClick(item)}
                  className="group p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Type and Time */}
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(item.type)}`}
                        >
                          {item.type}
                        </span>
                        <span className="text-xs text-gray-500">{getRelativeTime(item.time)}</span>
                      </div>

                      {/* Content */}
                      <div className="text-sm text-gray-900">
                        {item.type === 'text' ? (
                          <p className="text-gray-800">{item.content}</p>
                        ) : (
                          <img
                            src={item.content}
                            alt="clipboard-img"
                            className="max-w-full h-48 object-contain rounded"
                          />
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCopy(item.content, item.id.toString())
                        }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                        title="Copy"
                      >
                        {copiedId === item.id.toString() ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(item.id.toString())
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Clipboard
