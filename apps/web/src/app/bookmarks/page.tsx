'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { BookmarksList } from '@/components/BookmarksList'
import { useBookmarkStore } from '@/stores/bookmarkStore'
import { useHaptics } from '@/hooks/useHaptics'

export default function BookmarksPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showExportSuccess, setShowExportSuccess] = useState(false)
  const { bookmarks, exportBookmarks } = useBookmarkStore()
  const haptics = useHaptics()
  const router = useRouter()

  const handleExport = useCallback(() => {
    haptics.light()
    const data = exportBookmarks()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `biblical-alignment-bookmarks-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    haptics.success()
    setShowExportSuccess(true)
    setTimeout(() => setShowExportSuccess(false), 2000)
  }, [exportBookmarks, haptics])

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-xl"
        style={{
          backgroundColor: 'var(--theme-surface-transparent)',
          borderColor: 'var(--theme-border)',
        }}
      >
        <div className="max-w-2xl mx-auto px-4 py-4">
          {/* Title row */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full
                hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Go back"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
            </button>

            <h1
              className="text-xl font-bold"
              style={{ color: 'var(--theme-text)' }}
            >
              Bookmarks
            </h1>

            {/* Export button */}
            <button
              onClick={handleExport}
              disabled={bookmarks.length === 0}
              className={`
                w-10 h-10 -mr-2 flex items-center justify-center rounded-full
                transition-colors
                ${bookmarks.length === 0
                  ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                }
              `}
              aria-label="Export bookmarks"
            >
              {showExportSuccess ? (
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-500"
                >
                  <polyline points="20 6 9 17 4 12" />
                </motion.svg>
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              )}
            </button>
          </div>

          {/* Search input */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              width="20"
              height="20"
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
            <input
              type="text"
              placeholder="Search bookmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              style={{
                backgroundColor: 'var(--theme-surface-alt)',
                borderColor: 'var(--theme-border)',
                color: 'var(--theme-text)',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full
                  bg-gray-200 dark:bg-gray-700 flex items-center justify-center
                  hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* Stats and Notes Link */}
          <div className="flex items-center justify-between mt-3">
            {bookmarks.length > 0 ? (
              <p
                className="text-sm"
                style={{ color: 'var(--theme-text-secondary)' }}
              >
                {bookmarks.length} bookmark{bookmarks.length !== 1 ? 's' : ''}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            ) : (
              <span />
            )}

            <Link
              href="/notes"
              className="flex items-center gap-1.5 text-sm font-medium transition-colors"
              style={{ color: 'var(--theme-accent)' }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              My Notes
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <BookmarksList searchQuery={searchQuery} />
      </main>
    </div>
  )
}
