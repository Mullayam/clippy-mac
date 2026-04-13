import { useRef, useEffect } from 'react'
import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    ref.current?.focus()
  }, [])

  return (
    <div className="px-3 py-2 backdrop-blur-sm border-b border-black/5 dark:border-white/10">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
        <input
          ref={ref}
          type="text"
          placeholder="Search clipboard..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg
            bg-black/5 dark:bg-white/10
            border border-black/5 dark:border-white/10
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500/40
            transition-colors"
        />
      </div>
    </div>
  )
}
