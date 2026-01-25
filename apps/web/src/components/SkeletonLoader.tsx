/**
 * Skeleton Loading Components
 * Provides visual placeholders during content loading
 */

import React from 'react'

/**
 * Base skeleton element with shimmer animation
 */
function Skeleton({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`skeleton-shimmer rounded ${className}`}
      style={{
        backgroundColor: 'var(--theme-border)',
        ...style,
      }}
    />
  )
}

/**
 * Individual verse line placeholder
 */
export function VerseLineSkeleton({ width = '100%' }: { width?: string }) {
  return (
    <div className="flex items-start gap-2 mb-3">
      {/* Verse number */}
      <Skeleton className="w-4 h-4 shrink-0 mt-1" />
      {/* Verse text */}
      <Skeleton className="h-5" style={{ width }} />
    </div>
  )
}

/**
 * Chapter skeleton - mimics the full chapter reading view
 */
export function ChapterSkeleton() {
  // Generate varied line widths for realistic appearance
  const verseWidths = [
    '100%', '95%', '88%', '100%', '72%',
    '100%', '90%', '85%', '100%', '68%',
    '92%', '100%', '78%', '95%', '100%',
    '85%', '70%', '100%', '93%', '82%',
  ]

  return (
    <main className="min-h-screen theme-bg">
      {/* NavBar skeleton */}
      <nav
        className="fixed top-0 w-full z-50 backdrop-blur-md border-b theme-border"
        style={{ backgroundColor: 'color-mix(in srgb, var(--theme-surface) 70%, transparent)' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8" />
            <Skeleton className="w-36 h-6" />
          </div>
          <div className="flex items-center gap-6">
            <Skeleton className="w-12 h-5" />
            <Skeleton className="w-14 h-5" />
            <Skeleton className="w-12 h-5" />
            <Skeleton className="w-8 h-8 rounded-lg" />
          </div>
        </div>
      </nav>

      {/* Reading Progress skeleton (mobile) */}
      <div className="md:hidden fixed top-[73px] left-0 right-0 z-40">
        <Skeleton className="h-1 w-1/3 rounded-none" />
      </div>

      {/* Content */}
      <article className="pt-24 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb skeleton */}
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="w-10 h-4" />
            <span className="theme-text-muted">›</span>
            <Skeleton className="w-16 h-4" />
            <span className="theme-text-muted">›</span>
            <Skeleton className="w-20 h-4" />
          </div>

          {/* Chapter Header skeleton */}
          <header className="text-center mb-8">
            <Skeleton className="h-12 w-48 mx-auto mb-3" />
            <Skeleton className="h-8 w-32 mx-auto" />
          </header>

          {/* Audio Controls skeleton */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3 p-3 theme-surface rounded-xl border theme-border">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="w-20 h-4 mx-2" />
            </div>
          </div>

          {/* Scripture container skeleton */}
          <div className="theme-surface rounded-2xl border theme-border p-8 md:p-12 shadow-sm">
            <div className="space-y-1">
              {verseWidths.map((width, i) => (
                <VerseLineSkeleton key={i} width={width} />
              ))}
            </div>
          </div>

          {/* Navigation skeleton */}
          <div className="mt-8 flex items-center justify-between">
            <Skeleton className="w-24 h-10 rounded-lg" />
            <Skeleton className="w-28 h-10" />
            <Skeleton className="w-24 h-10 rounded-lg" />
          </div>

          {/* Footer skeleton */}
          <footer className="mt-16 pt-8 border-t theme-border text-center">
            <Skeleton className="h-4 w-56 mx-auto" />
          </footer>
        </div>
      </article>
    </main>
  )
}

/**
 * Book list skeleton - mimics the book selection grid
 */
export function BookListSkeleton() {
  return (
    <main className="min-h-screen theme-bg">
      {/* NavBar skeleton */}
      <nav
        className="fixed top-0 w-full z-50 backdrop-blur-md border-b theme-border"
        style={{ backgroundColor: 'color-mix(in srgb, var(--theme-surface) 70%, transparent)' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8" />
            <Skeleton className="w-36 h-6" />
          </div>
          <div className="flex items-center gap-6">
            <Skeleton className="w-12 h-5" />
            <Skeleton className="w-14 h-5" />
            <Skeleton className="w-12 h-5" />
            <Skeleton className="w-8 h-8 rounded-lg" />
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header skeleton */}
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-80 mx-auto" />
          </div>

          {/* Continue Reading skeleton */}
          <div className="mb-12">
            <Skeleton className="h-24 w-full max-w-md mx-auto rounded-xl" />
          </div>

          {/* Old Testament Section */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Skeleton className="w-8 h-8" />
              <Skeleton className="h-8 w-36" />
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Array.from({ length: 39 }).map((_, i) => (
                <BookCardSkeleton key={`ot-${i}`} />
              ))}
            </div>
          </section>

          {/* New Testament Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Skeleton className="w-8 h-8" />
              <Skeleton className="h-8 w-36" />
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Array.from({ length: 27 }).map((_, i) => (
                <BookCardSkeleton key={`nt-${i}`} />
              ))}
            </div>
          </section>

          {/* Attribution skeleton */}
          <div className="mt-16 text-center">
            <Skeleton className="h-4 w-96 max-w-full mx-auto" />
          </div>
        </div>
      </div>
    </main>
  )
}

/**
 * Individual book card skeleton
 */
function BookCardSkeleton() {
  return (
    <div className="p-4 theme-surface rounded-xl border theme-border">
      <Skeleton className="h-5 w-20 mb-2" />
      <Skeleton className="h-4 w-16" />
    </div>
  )
}

/**
 * Search results skeleton
 */
export function SearchResultsSkeleton() {
  return (
    <main className="min-h-screen theme-bg">
      {/* NavBar skeleton */}
      <nav
        className="fixed top-0 w-full z-50 backdrop-blur-md border-b theme-border"
        style={{ backgroundColor: 'color-mix(in srgb, var(--theme-surface) 70%, transparent)' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8" />
            <Skeleton className="w-36 h-6" />
          </div>
          <div className="flex items-center gap-6">
            <Skeleton className="w-12 h-5" />
            <Skeleton className="w-14 h-5" />
            <Skeleton className="w-12 h-5" />
            <Skeleton className="w-8 h-8 rounded-lg" />
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header skeleton */}
          <div className="text-center mb-8">
            <Skeleton className="h-12 w-56 mx-auto mb-4" />
            <Skeleton className="h-6 w-72 mx-auto" />
          </div>

          {/* Search input skeleton */}
          <div className="mb-6">
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>

          {/* Filter buttons skeleton */}
          <div className="flex justify-center gap-2 mb-8">
            <Skeleton className="h-10 w-16 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>

          {/* Results count skeleton */}
          <div className="text-center mb-6">
            <Skeleton className="h-5 w-32 mx-auto" />
          </div>

          {/* Results list skeleton */}
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SearchResultCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

/**
 * Individual search result card skeleton
 */
function SearchResultCardSkeleton() {
  const widths = ['100%', '92%', '88%', '95%', '85%', '90%', '78%', '100%']
  const width = widths[Math.floor(Math.random() * widths.length)]

  return (
    <div className="p-4 theme-surface rounded-xl border theme-border">
      <div className="flex items-start gap-4">
        {/* Testament badge */}
        <Skeleton className="w-8 h-6 shrink-0 rounded" />
        {/* Content */}
        <div className="flex-1 min-w-0">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4" style={{ width }} />
        </div>
      </div>
    </div>
  )
}

/**
 * Inline skeleton for smaller loading states
 */
export function InlineSkeleton({ width = '100px', height = '1em' }: { width?: string; height?: string }) {
  return <Skeleton className="inline-block" style={{ width, height }} />
}
