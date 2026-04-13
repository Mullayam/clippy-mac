import { Copy, Trash2, Check } from 'lucide-react'
import { ClipboardItem } from '../lib/idb'
import { getRelativeTime } from '../lib/utils'

interface Props {
  item: ClipboardItem
  selected: boolean
  copied: boolean
  onItemClick: (item: ClipboardItem) => void
  onCopy: (text: string, id: number) => void
  onDelete: (id: number) => void
}

export default function ClipItem({ item, selected, copied, onItemClick, onCopy, onDelete }: Props) {
  return (
    <div
      data-clipboard-item
      onClick={() => onItemClick(item)}
      className={`group flex items-start gap-3 px-3 py-2.5 cursor-pointer
        border-b border-black/5 dark:border-white/5
        transition-all duration-100
        ${selected
          ? 'bg-blue-500/10 dark:bg-blue-400/15 border-l-2 border-l-blue-500 dark:border-l-blue-400'
          : 'hover:bg-black/[0.03] dark:hover:bg-white/[0.06] border-l-2 border-l-transparent'
        }`}
    >
      <div className="flex-1 min-w-0">
        {item.type === 'text' ? (
          <p className="text-[13px] text-gray-800 dark:text-gray-200 line-clamp-3 break-all leading-snug">
            {item.content}
          </p>
        ) : (
          <img
            src={item.content}
            alt="clipboard"
            className="max-w-full h-20 object-contain rounded-md"
          />
        )}
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-[10px] uppercase font-medium text-gray-400 dark:text-gray-500 tracking-wider">
            {item.type}
          </span>
          <span className="text-[10px] text-gray-300 dark:text-gray-600">·</span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500">
            {getRelativeTime(item.time)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5">
        <button
          onClick={(e) => { e.stopPropagation(); onCopy(item.content, item.id) }}
          className="p-1 rounded-md text-gray-400 dark:text-gray-500
            hover:text-blue-600 dark:hover:text-blue-400
            hover:bg-blue-500/10 transition-colors"
          title="Copy"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(item.id) }}
          className="p-1 rounded-md text-gray-400 dark:text-gray-500
            hover:text-red-500 dark:hover:text-red-400
            hover:bg-red-500/10 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
