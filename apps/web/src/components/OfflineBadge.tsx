'use client'

import { useState } from 'react'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'

interface OfflineBadgeProps {
  className?: string
  showTooltip?: boolean
}

export function OfflineBadge({ className = '', showTooltip = true }: OfflineBadgeProps) {
  const { isOffline } = useOnlineStatus()
  const [tooltipVisible, setTooltipVisible] = useState(false)

  if (!isOffline) return null

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setTooltipVisible(true)}
      onMouseLeave={() => setTooltipVisible(false)}
      onFocus={() => setTooltipVisible(true)}
      onBlur={() => setTooltipVisible(false)}
    >
      <button
        type="button"
        className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-600 border border-amber-500/30 transition-colors hover:bg-amber-500/25"
        aria-label="Offline mode active"
        tabIndex={0}
      >
        <CloudOffIcon className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Offline</span>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 rounded-lg text-xs whitespace-nowrap z-50 transition-all duration-200 ${
            tooltipVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-1 pointer-events-none'
          }`}
          style={{
            backgroundColor: 'var(--theme-surface)',
            border: '1px solid var(--theme-border)',
            boxShadow: '0 4px 12px var(--theme-shadow-lg)',
            color: 'var(--theme-text)',
          }}
          role="tooltip"
        >
          <div className="flex items-center gap-2">
            <CloudOffIcon className="h-3.5 w-3.5 text-amber-500" />
            <span>Reading from cached content</span>
          </div>
          {/* Tooltip arrow */}
          <div
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
            style={{
              backgroundColor: 'var(--theme-surface)',
              borderTop: '1px solid var(--theme-border)',
              borderLeft: '1px solid var(--theme-border)',
            }}
          />
        </div>
      )}
    </div>
  )
}

function CloudOffIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 2l20 20" />
      <path d="M5.5 5.5A7 7 0 0 0 5 8a6 6 0 0 0 .28 1.77A5 5 0 0 0 7 19h10c.7 0 1.37-.14 2-.4" />
      <path d="M18.43 18.43A5 5 0 0 0 19 14a5 5 0 0 0-5-5 5 5 0 0 0-1.61.26" />
      <path d="M9.2 4.38A7 7 0 0 1 18 8c1.73 0 2.99 1.24 3 2.97" />
    </svg>
  )
}
