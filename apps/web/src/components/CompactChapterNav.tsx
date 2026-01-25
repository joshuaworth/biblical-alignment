'use client'

/**
 * Compact Chapter Navigation
 * A minimal, modern header for the reading experience
 */

import { useState } from 'react'
import Link from 'next/link'
import { useSettings } from '@/app/providers'
import { ChapterPicker } from './ChapterPicker'

interface CompactChapterNavProps {
  bookName: string
  bookSlug: string
  chapterNum: number
  totalChapters: number
  prevUrl: string | null
  nextUrl: string | null
}

export function CompactChapterNav({
  bookName,
  bookSlug,
  chapterNum,
  totalChapters,
  prevUrl,
  nextUrl,
}: CompactChapterNavProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const { openSettings } = useSettings()

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 theme-surface/95 backdrop-blur-md border-b theme-border">
        <div className="flex items-center justify-between h-14 px-4 max-w-2xl mx-auto">
          {/* Left: Back to book */}
          <Link
            href={`/read/${bookSlug}`}
            className="p-2 -ml-2 theme-text-muted hover:theme-text transition-colors"
            aria-label={`Back to ${bookName}`}
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </Link>

          {/* Center: Book + Chapter (tappable) */}
          <button
            onClick={() => setIsPickerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors"
            style={{ ['--hover-bg' as string]: 'var(--theme-accent-light)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--theme-accent-light)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            aria-label={`${bookName} ${chapterNum}. Tap to change chapter`}
          >
            <span className="font-semibold theme-text">{bookName}</span>
            <span className="font-medium" style={{ color: 'var(--theme-accent)' }}>{chapterNum}</span>
            <ChevronDownIcon className="w-4 h-4 opacity-60" style={{ color: 'var(--theme-accent)' }} />
          </button>

          {/* Right: Settings */}
          <button
            onClick={openSettings}
            className="p-2 -mr-2 theme-text-muted hover:theme-text transition-colors"
            aria-label="Settings"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Chapter navigation arrows (subtle, below main nav) */}
        <div className="flex items-center justify-between px-4 pb-2 max-w-2xl mx-auto">
          {prevUrl ? (
            <Link
              href={prevUrl}
              className="text-xs theme-text-muted transition-colors flex items-center gap-1 hover-accent"
            >
              <span>←</span>
              <span>Previous</span>
            </Link>
          ) : (
            <div />
          )}

          <span className="text-xs theme-text-muted">
            {chapterNum} of {totalChapters}
          </span>

          {nextUrl ? (
            <Link
              href={nextUrl}
              className="text-xs theme-text-muted transition-colors flex items-center gap-1 hover-accent"
            >
              <span>Next</span>
              <span>→</span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </nav>

      <ChapterPicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        bookName={bookName}
        bookSlug={bookSlug}
        totalChapters={totalChapters}
        currentChapter={chapterNum}
      />
    </>
  )
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function ChevronDownIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
        clipRule="evenodd"
      />
    </svg>
  )
}
