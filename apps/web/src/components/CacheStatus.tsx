'use client'

import { useState, useEffect } from 'react'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'

interface CacheInfo {
  booksAvailable: number
  totalBooks: number
  searchIndexCached: boolean
  lastUpdated: Date | null
  estimatedSize: string
}

export function CacheStatus() {
  const { isOffline, isOnline } = useOnlineStatus()
  const [cacheInfo, setCacheInfo] = useState<CacheInfo>({
    booksAvailable: 0,
    totalBooks: 66,
    searchIndexCached: false,
    lastUpdated: null,
    estimatedSize: '0 MB',
  })
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    async function checkCache() {
      setIsChecking(true)

      try {
        // Check if service worker is available and caches exist
        if ('caches' in window) {
          const cacheNames = await caches.keys()
          let totalSize = 0
          let booksFound = 0
          let searchIndexFound = false
          let latestDate: Date | null = null

          for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName)
            const requests = await cache.keys()

            for (const request of requests) {
              const url = request.url

              // Check for Bible chapter pages
              if (url.includes('/read/') && !url.endsWith('/read/') && !url.endsWith('/read')) {
                booksFound++
              }

              // Check for search index
              if (url.includes('search-index.json')) {
                searchIndexFound = true
              }

              // Estimate size from response
              try {
                const response = await cache.match(request)
                if (response) {
                  const blob = await response.clone().blob()
                  totalSize += blob.size
                }
              } catch {
                // Ignore errors from specific cache items
              }
            }
          }

          // Get last updated from localStorage
          const lastUpdate = localStorage.getItem('bible-cache-last-updated')
          if (lastUpdate) {
            latestDate = new Date(lastUpdate)
          }

          // Format size
          let sizeStr = '0 MB'
          if (totalSize > 0) {
            if (totalSize < 1024 * 1024) {
              sizeStr = `${Math.round(totalSize / 1024)} KB`
            } else {
              sizeStr = `${(totalSize / (1024 * 1024)).toFixed(1)} MB`
            }
          }

          setCacheInfo({
            booksAvailable: Math.min(booksFound, 66),
            totalBooks: 66,
            searchIndexCached: searchIndexFound,
            lastUpdated: latestDate,
            estimatedSize: sizeStr,
          })
        }
      } catch (error) {
        console.error('Error checking cache:', error)
      }

      setIsChecking(false)
    }

    checkCache()
  }, [])

  const handleRefreshCache = async () => {
    if (!isOnline) return

    setIsChecking(true)

    try {
      // Trigger service worker to cache all content
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CACHE_ALL_CONTENT',
        })
      }

      // Update last cached timestamp
      localStorage.setItem('bible-cache-last-updated', new Date().toISOString())

      // Re-check cache after a brief delay
      setTimeout(async () => {
        // Trigger a re-check
        window.location.reload()
      }, 2000)
    } catch (error) {
      console.error('Error refreshing cache:', error)
      setIsChecking(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium theme-text">Offline Storage</h3>
        {isOffline && (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 text-amber-600">
            Offline Mode
          </span>
        )}
      </div>

      {isChecking ? (
        <div className="flex items-center gap-2 text-sm theme-text-muted">
          <LoadingSpinner className="h-4 w-4" />
          <span>Checking cache...</span>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Cache Stats */}
          <div
            className="grid grid-cols-2 gap-3 p-3 rounded-lg"
            style={{ backgroundColor: 'var(--theme-surface-alt)' }}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <BookIcon className="h-4 w-4 theme-text-muted" />
                <span className="text-xs theme-text-muted">Content</span>
              </div>
              <p className="text-sm font-medium theme-text">
                {cacheInfo.booksAvailable > 0
                  ? `${cacheInfo.booksAvailable} pages`
                  : 'Not cached'}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <SearchIcon className="h-4 w-4 theme-text-muted" />
                <span className="text-xs theme-text-muted">Search</span>
              </div>
              <p className="text-sm font-medium theme-text">
                {cacheInfo.searchIndexCached ? 'Available' : 'Not cached'}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <DatabaseIcon className="h-4 w-4 theme-text-muted" />
                <span className="text-xs theme-text-muted">Size</span>
              </div>
              <p className="text-sm font-medium theme-text">{cacheInfo.estimatedSize}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4 theme-text-muted" />
                <span className="text-xs theme-text-muted">Updated</span>
              </div>
              <p className="text-sm font-medium theme-text">
                {cacheInfo.lastUpdated
                  ? formatRelativeTime(cacheInfo.lastUpdated)
                  : 'Never'}
              </p>
            </div>
          </div>

          {/* Status Message */}
          <div
            className="flex items-start gap-2 p-3 rounded-lg text-sm"
            style={{ backgroundColor: 'var(--theme-surface-alt)' }}
          >
            {cacheInfo.booksAvailable > 0 ? (
              <>
                <CheckIcon className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <span className="theme-text-muted">
                  Bible content is cached for offline reading. Search{' '}
                  {cacheInfo.searchIndexCached ? 'is' : 'is not'} available offline.
                </span>
              </>
            ) : (
              <>
                <InfoIcon className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                <span className="theme-text-muted">
                  No content cached yet. Browse chapters to cache them for offline use.
                </span>
              </>
            )}
          </div>

          {/* Refresh Cache Button */}
          <button
            onClick={handleRefreshCache}
            disabled={isOffline || isChecking}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
              isOffline
                ? 'opacity-50 cursor-not-allowed'
                : 'theme-btn-secondary hover:theme-btn-secondary'
            }`}
            style={{
              backgroundColor: 'var(--theme-btn-secondary-bg)',
              color: 'var(--theme-btn-secondary-text)',
              border: '1px solid var(--theme-border)',
            }}
          >
            <RefreshIcon className="h-4 w-4" />
            <span>{isOffline ? 'Go online to refresh' : 'Refresh Cache'}</span>
          </button>
        </div>
      )}
    </div>
  )
}

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

function BookIcon({ className }: { className?: string }) {
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
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

function SearchIcon({ className }: { className?: string }) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function DatabaseIcon({ className }: { className?: string }) {
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
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  )
}

function ClockIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function InfoIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )
}

function RefreshIcon({ className }: { className?: string }) {
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
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  )
}
