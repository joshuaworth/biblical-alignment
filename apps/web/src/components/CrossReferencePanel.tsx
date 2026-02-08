'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { CrossReference, getCrossReferences, formatCrossRef } from '@/lib/cross-references'

interface CrossReferencePanelProps {
  bookSlug: string
  bookName: string
  chapter: number
  verse: number
  onClose: () => void
}

export function CrossReferencePanel({
  bookSlug,
  bookName,
  chapter,
  verse,
  onClose,
}: CrossReferencePanelProps) {
  const [crossRefs, setCrossRefs] = useState<CrossReference[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      const refs = await getCrossReferences(bookSlug, chapter, verse)
      if (!cancelled) {
        setCrossRefs(refs)
        setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [bookSlug, chapter, verse])

  const displayRefs = expanded ? crossRefs : crossRefs.slice(0, 5)
  const hasMore = crossRefs.length > 5

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  if (loading) {
    return (
      <div
        className="mt-4 p-4 theme-surface rounded-xl border theme-border animate-pulse"
        role="region"
        aria-label="Loading cross-references"
      >
        <div className="h-4 w-48 rounded theme-skeleton mb-3" />
        <div className="space-y-2">
          <div className="h-3 w-full rounded theme-skeleton" />
          <div className="h-3 w-3/4 rounded theme-skeleton" />
        </div>
      </div>
    )
  }

  if (crossRefs.length === 0) {
    return null
  }

  return (
    <div
      className="mt-4 p-4 theme-surface rounded-xl border theme-border shadow-lg"
      role="region"
      aria-label={`Cross-references for ${bookName} ${chapter}:${verse}`}
      onKeyDown={handleKeyDown}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold theme-text flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-60"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          Cross-References
          <span className="text-xs theme-text-muted font-normal">
            ({crossRefs.length})
          </span>
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          aria-label="Close cross-references"
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
            className="theme-text-muted"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Source verse label */}
      <p className="text-xs theme-text-muted mb-3">
        {bookName} {chapter}:{verse}
      </p>

      {/* Cross-reference list */}
      <div className="space-y-2">
        {displayRefs.map((ref, i) => (
          <Link
            key={`${ref.slug}-${ref.chapter}-${ref.verse}-${i}`}
            href={`/read/${ref.slug}/${ref.chapter}#verse-${ref.verse}`}
            className="block p-3 rounded-lg border theme-border hover:border-amber-400/50
              hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-all group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium theme-text group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                  {formatCrossRef(ref)}
                </span>
              </div>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="theme-text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Show more/less */}
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 w-full text-center text-sm font-medium py-2 rounded-lg
            hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          style={{ color: 'var(--theme-accent)' }}
        >
          {expanded
            ? 'Show fewer'
            : `Show ${crossRefs.length - 5} more references`}
        </button>
      )}

      {/* Attribution */}
      <p className="mt-3 text-[10px] theme-text-muted opacity-50 text-center">
        Cross-references via OpenBible.info (CC-BY)
      </p>
    </div>
  )
}
