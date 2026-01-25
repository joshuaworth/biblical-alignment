'use client'

import Link from 'next/link'
import { useLastRead } from '@/hooks/useReadingPosition'

/**
 * 📖 Format relative time (e.g., "2 hours ago", "Yesterday")
 */
function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) {
    return 'Just now'
  } else if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  } else if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`
  } else if (days === 1) {
    return 'Yesterday'
  } else if (days < 7) {
    return `${days} days ago`
  } else if (days < 30) {
    const weeks = Math.floor(days / 7)
    return `${weeks} week${weeks === 1 ? '' : 's'} ago`
  } else {
    const months = Math.floor(days / 30)
    return `${months} month${months === 1 ? '' : 's'} ago`
  }
}

/**
 * 📖 Convert book slug to display name (e.g., "1-corinthians" -> "1 Corinthians")
 */
function slugToDisplayName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

interface ContinueReadingProps {
  className?: string
}

/**
 * 📖 Continue Reading Component
 *
 * Shows on homepage or /read page to help users resume where they left off
 */
export function ContinueReading({ className = '' }: ContinueReadingProps) {
  const { lastRead } = useLastRead()

  // Don't render if no reading history
  if (!lastRead) {
    return null
  }

  const bookDisplayName = slugToDisplayName(lastRead.book)
  const relativeTime = formatRelativeTime(lastRead.timestamp)
  const readUrl = `/read/${lastRead.book}/${lastRead.chapter}`

  return (
    <div
      className={`theme-surface border theme-border rounded-2xl p-6 hover:border-amber-400 transition-colors ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">📖</span>
            <h3 className="font-semibold theme-text">Continue Reading</h3>
          </div>

          <p className="theme-text-muted">
            <span className="theme-text font-medium">
              {bookDisplayName} {lastRead.chapter}
            </span>
            <span className="mx-2">·</span>
            <span>Last read {relativeTime}</span>
          </p>
        </div>

        <Link
          href={readUrl}
          className="flex-shrink-0 px-5 py-2.5 theme-accent-bg rounded-xl font-medium transition-colors hover:opacity-90"
        >
          Continue →
        </Link>
      </div>
    </div>
  )
}

/**
 * 📖 Compact Continue Reading Component
 *
 * Smaller variant for tighter layouts
 */
export function ContinueReadingCompact({ className = '' }: ContinueReadingProps) {
  const { lastRead } = useLastRead()

  if (!lastRead) {
    return null
  }

  const bookDisplayName = slugToDisplayName(lastRead.book)
  const relativeTime = formatRelativeTime(lastRead.timestamp)
  const readUrl = `/read/${lastRead.book}/${lastRead.chapter}`

  return (
    <Link
      href={readUrl}
      className={`group flex items-center gap-3 p-4 theme-surface border theme-border rounded-xl hover:border-amber-400 transition-colors ${className}`}
    >
      <span className="text-lg">📖</span>
      <div className="flex-1 min-w-0">
        <span className="theme-text font-medium group-hover:text-amber-600 transition-colors">
          {bookDisplayName} {lastRead.chapter}
        </span>
        <span className="theme-text-muted text-sm ml-2">
          · {relativeTime}
        </span>
      </div>
      <span className="theme-text-muted group-hover:text-amber-600 transition-colors">
        →
      </span>
    </Link>
  )
}
