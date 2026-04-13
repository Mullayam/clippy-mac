import React from 'react'

export const Header = () => {
  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5
        backdrop-blur-xl border-b border-black/5 dark:border-white/10
        select-none"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* Traffic light buttons */}
      <div
        className="flex items-center gap-1.5"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <button
          onClick={() => window.clipboardAPI.close()}
          className="group w-3 h-3 rounded-full bg-[#FF5F57] hover:brightness-90 transition-all
            flex items-center justify-center"
          title="Close"
        >
          <span className="text-[8px] font-bold text-black/0 group-hover:text-black/60 leading-none">
            ×
          </span>
        </button>
        <button
          onClick={() => window.clipboardAPI.minimize()}
          className="group w-3 h-3 rounded-full bg-[#FEBC2E] hover:brightness-90 transition-all
            flex items-center justify-center"
          title="Minimize"
        >
          <span className="text-[8px] font-bold text-black/0 group-hover:text-black/60 leading-none">
            –
          </span>
        </button>
        <span className="w-3 h-3 rounded-full bg-[#28C840] opacity-50" />
      </div>

      {/* Title + credits */}
      <div className="flex-1 flex items-center justify-between">
        <span className="text-[13px] font-semibold text-gray-800 dark:text-gray-100">
          Clipboard
        </span>
        <span className="text-[9px] text-gray-400 dark:text-gray-500 font-medium tracking-wide">
          by Mulayam
        </span>
      </div>
    </div>
  )
}
