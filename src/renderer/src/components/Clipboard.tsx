import { useEffect, useState, useRef, useCallback } from 'react'
import { db, ClipboardItem } from '../lib/idb'
import SearchBar from './SearchBar'
import ClipItem from './ClipItem'
import EmptyState from './EmptyState'

export default function Clipboard() {
  const [history, setHistory] = useState<ClipboardItem[]>([])
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const listRef = useRef<HTMLDivElement>(null)

  const handleCopy = useCallback((text: string, id: number) => {
    window.clipboardAPI.copyToClipboard(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }, [])

  const handleItemClick = useCallback((item: ClipboardItem) => {
    window.clipboardAPI.copyAndHide(item.content)
  }, [])

  const handleDelete = useCallback(async (id: number) => {
    await db.deleteItem(id)
    setHistory((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const handleClear = useCallback(async () => {
    await db.clearHistory()
    setHistory([])
  }, [])

  const filtered = search
    ? history.filter(
        (item) => item.type === 'text' && item.content.toLowerCase().includes(search.toLowerCase())
      )
    : history

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter' && selectedIndex >= 0 && selectedIndex < filtered.length) {
        e.preventDefault()
        handleItemClick(filtered[selectedIndex])
      } else if (e.key === 'Escape') {
        window.clipboardAPI.close()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [filtered, selectedIndex, handleItemClick])

  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-clipboard-item]')
      items[selectedIndex]?.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  useEffect(() => setSelectedIndex(-1), [search])

  useEffect(() => {
    db.getHistory().then(setHistory)
    const cleanup = window.clipboardAPI.onUpdate(async (items: ClipboardItem[]) => {
      const latest = items[0]
      if (latest) {
        await db.addItem(latest)
        const updated = await db.getHistory()
        setHistory(updated)
      }
    })
    return cleanup
  }, [])

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <SearchBar value={search} onChange={setSearch} />

      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5
        border-b border-black/5 dark:border-white/10 backdrop-blur-sm">
        <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
          {filtered.length} item{filtered.length !== 1 ? 's' : ''}
        </span>
        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="text-[11px] text-gray-400 dark:text-gray-500
              hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* List */}
      <div ref={listRef} className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <EmptyState hasSearch={!!search} />
        ) : (
          filtered.map((item, index) => (
            <ClipItem
              key={item.id}
              item={item}
              selected={selectedIndex === index}
              copied={copiedId === item.id}
              onItemClick={handleItemClick}
              onCopy={handleCopy}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}
