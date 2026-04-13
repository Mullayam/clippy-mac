import { ClipboardList } from 'lucide-react'

interface Props {
  hasSearch: boolean
}

export default function EmptyState({ hasSearch }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
      <ClipboardList className="w-10 h-10 mb-3 opacity-50" />
      <p className="text-sm font-medium">
        {hasSearch ? 'No matching items' : 'Nothing here yet'}
      </p>
      <p className="text-xs mt-1 opacity-70">
        {hasSearch ? 'Try a different search' : 'Copy something to get started'}
      </p>
    </div>
  )
}
