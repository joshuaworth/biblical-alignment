'use client'

/**
 * Search Page
 *
 * Full-text search across the entire Bible using Fuse.js
 * Features: instant results, verse reference parsing, OT/NT filtering,
 * book filtering, search history, highlighted matches, load more
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import Link from 'next/link'
import Fuse from 'fuse.js'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { BookFilterSelector } from '@/components/BookFilterSelector'
import { useVerseReference } from '@/hooks/useVerseReference'
import { useSearchHistoryStore } from '@/stores/searchHistoryStore'
import type { ParsedReference, BookSuggestion } from '@/lib/verse-reference'

// Types for search entries
interface SearchEntry {
  id: string
  book: string
  abbr: string
  chapter: number
  verse: number
  text: string
  testament: 'OT' | 'NT'
}

interface FuseResult {
  item: SearchEntry
  matches?: {
    indices: [number, number][]
    key?: string
    value?: string
  }[]
}

type TestamentFilter = 'all' | 'OT' | 'NT'

const RESULTS_PER_PAGE = 50

// Book name to URL slug
function bookToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-')
}

// Highlight matching text
function HighlightedText({
  text,
  matches,
}: {
  text: string
  matches?: { indices: [number, number][]; key?: string; value?: string }[]
}) {
  const textMatch = matches?.find(m => m.key === 'text' || !m.key)
  if (!textMatch) {
    return <span>{text}</span>
  }

  const parts: React.ReactElement[] = []
  let lastIndex = 0

  const sortedIndices = [...textMatch.indices].sort((a, b) => a[0] - b[0])

  for (const [start, end] of sortedIndices) {
    if (start > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`}>{text.slice(lastIndex, start)}</span>
      )
    }
    parts.push(
      <mark
        key={`match-${start}`}
        className="theme-accent-light px-0.5 rounded"
        style={{ color: 'inherit' }}
      >
        {text.slice(start, end + 1)}
      </mark>
    )
    lastIndex = end + 1
  }

  if (lastIndex < text.length) {
    parts.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>)
  }

  return <>{parts}</>
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<TestamentFilter>('all')
  const [selectedBooks, setSelectedBooks] = useState<string[]>([])
  const [searchIndex, setSearchIndex] = useState<SearchEntry[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [displayLimit, setDisplayLimit] = useState(RESULTS_PER_PAGE)
  const [mounted, setMounted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const queryRef = useRef(query)
  queryRef.current = query

  // Verse reference detection
  const verseRef = useVerseReference(query, searchIndex)

  // Search history
  const { history, addSearch, removeSearch, clearAll } = useSearchHistoryStore()

  useEffect(() => { setMounted(true) }, [])

  // Load search index on mount
  useEffect(() => {
    async function loadIndex() {
      try {
        const response = await fetch('/search-index.json')
        if (!response.ok) throw new Error('Failed to load search index')
        const data = await response.json()
        setSearchIndex(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load search index')
      } finally {
        setLoading(false)
      }
    }
    loadIndex()
  }, [])

  // Focus input on load
  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus()
    }
  }, [loading])

  // Reset display limit when query or filters change
  useEffect(() => {
    setDisplayLimit(RESULTS_PER_PAGE)
  }, [query, filter, selectedBooks])

  // Create Fuse instance with filtered data
  const fuse = useMemo(() => {
    if (!searchIndex) return null

    let filteredData = searchIndex

    if (filter !== 'all') {
      filteredData = filteredData.filter(entry => entry.testament === filter)
    }

    if (selectedBooks.length > 0) {
      const bookSet = new Set(selectedBooks)
      filteredData = filteredData.filter(entry => bookSet.has(entry.book))
    }

    return new Fuse(filteredData, {
      keys: ['text'],
      threshold: 0.3,
      distance: 100,
      minMatchCharLength: 2,
      includeMatches: true,
      ignoreLocation: true,
    })
  }, [searchIndex, filter, selectedBooks])

  // All Fuse.js results (up to 500)
  const allResults = useMemo(() => {
    if (!fuse || !query.trim() || verseRef.isReference) return []
    return fuse.search(query, { limit: 500 }) as FuseResult[]
  }, [fuse, query, verseRef.isReference])

  // Paginated display
  const results = allResults.slice(0, displayLimit)
  const hasMore = displayLimit < allResults.length

  // Debounced search history recording
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) return
    if (verseRef.isReference) return

    const timeout = setTimeout(() => {
      if (queryRef.current === query && allResults.length > 0) {
        addSearch(query, allResults.length)
      }
    }, 1000)

    return () => clearTimeout(timeout)
  }, [query, allResults.length, verseRef.isReference, addSearch])

  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value)
    },
    []
  )

  const handleBookSuggestionClick = useCallback((suggestion: BookSuggestion) => {
    setQuery(suggestion.name + ' ')
    inputRef.current?.focus()
  }, [])

  // Loading state
  if (loading) {
    return (
      <main id="main-content" className="min-h-screen theme-bg">
        <NavBar />
        <div className="pt-24 pb-12 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-pulse">
              <div className="h-12 theme-surface rounded-xl mb-8"></div>
              <p className="theme-text-muted">Loading search index...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Error state
  if (error) {
    return (
      <main id="main-content" className="min-h-screen theme-bg">
        <NavBar />
        <div className="pt-24 pb-12 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-red-500 mb-4">Error: {error}</p>
            <p className="theme-text-muted">Try refreshing the page.</p>
          </div>
        </div>
      </main>
    )
  }

  const showHistory = mounted && !query.trim() && isFocused && history.length > 0

  return (
    <main id="main-content" className="min-h-screen theme-bg">
      <NavBar />

      <div className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold theme-text mb-4">
              Search the Bible
            </h1>
            <p className="theme-text-muted text-lg">
              Find any word, phrase, or verse reference across all 66 books
            </p>
          </div>

          {/* Search Input */}
          <div className="mb-6">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleQueryChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                placeholder="Search verses or go to a reference (e.g., John 3:16)..."
                className="w-full px-6 py-4 text-lg rounded-xl theme-input transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <SearchIcon />
              </div>
            </div>
          </div>

          {/* Recent Searches */}
          {showHistory && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider theme-text-muted">
                  Recent Searches
                </span>
                <button
                  onClick={clearAll}
                  className="text-xs theme-text-muted hover:text-red-500 transition-colors"
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-1">
                {history.map(entry => (
                  <div
                    key={entry.query}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg theme-surface border theme-border hover:border-amber-400 transition-all cursor-pointer"
                    onClick={() => setQuery(entry.displayQuery)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="theme-text-muted shrink-0">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span className="flex-1 text-sm theme-text">{entry.displayQuery}</span>
                    <span className="text-xs theme-text-muted">{entry.resultCount} results</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeSearch(entry.query) }}
                      className="theme-text-muted hover:text-red-500 transition-colors p-1"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filter Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <FilterButton label="All" active={filter === 'all'} onClick={() => setFilter('all')} />
            <FilterButton label="Old Testament" active={filter === 'OT'} onClick={() => setFilter('OT')} />
            <FilterButton label="New Testament" active={filter === 'NT'} onClick={() => setFilter('NT')} />
          </div>

          {/* Book Filter */}
          <div className="flex justify-center mb-8">
            <BookFilterSelector
              testamentFilter={filter}
              selectedBooks={selectedBooks}
              onSelectedBooksChange={setSelectedBooks}
            />
          </div>

          {/* Direct Reference Result */}
          {verseRef.isReference && verseRef.parsedReference && (
            <ReferenceResult
              reference={verseRef.parsedReference}
              verses={verseRef.matchedVerses}
            />
          )}

          {/* Book Suggestions */}
          {verseRef.isReference && verseRef.suggestions.length > 0 && (
            <BookSuggestions
              suggestions={verseRef.suggestions}
              onSelect={handleBookSuggestionClick}
            />
          )}

          {/* Results Count */}
          {query.trim() && !verseRef.isReference && (
            <div className="text-center mb-6">
              <p className="theme-text-muted">
                {allResults.length === 0
                  ? 'No results found'
                  : `Showing ${results.length} of ${allResults.length}${allResults.length === 500 ? '+' : ''} results`}
              </p>
            </div>
          )}

          {/* Results List */}
          {!verseRef.isReference && (
            <div className="space-y-4">
              {results.map(result => (
                <SearchResult key={result.item.id} result={result} />
              ))}
            </div>
          )}

          {/* Load More */}
          {hasMore && (
            <div className="text-center mt-6">
              <button
                onClick={() => setDisplayLimit(prev => prev + RESULTS_PER_PAGE)}
                className="px-6 py-3 rounded-xl font-medium text-sm transition-all theme-surface border theme-border hover:border-amber-400 hover:shadow-md"
              >
                Show more results ({Math.min(RESULTS_PER_PAGE, allResults.length - displayLimit)} more)
              </button>
            </div>
          )}

          {/* Empty State */}
          {!query.trim() && !showHistory && (
            <div className="text-center py-12">
              <p className="theme-text-muted mb-4">
                Start typing to search the entire Bible
              </p>
              <div className="theme-text-muted text-sm space-y-1 opacity-60">
                <p>Try searching for:</p>
                <p className="font-mono">&quot;John 3:16&quot;</p>
                <p className="font-mono">&quot;Psalm 23&quot;</p>
                <p className="font-mono">&quot;love&quot;</p>
                <p className="font-mono">&quot;in the beginning&quot;</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}

// Direct Reference Card
function ReferenceResult({
  reference,
  verses,
}: {
  reference: ParsedReference
  verses: SearchEntry[]
}) {
  const slug = reference.bookSlug

  // Book-only reference
  if (reference.chapter === null) {
    return (
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--theme-accent)' }}>
          Direct Reference
        </div>
        <Link
          href={`/read/${slug}`}
          className="block p-5 theme-surface rounded-xl border-2 hover:shadow-md transition-all"
          style={{ borderColor: 'var(--theme-accent)' }}
        >
          <div className="font-bold theme-text text-lg mb-1">{reference.bookName}</div>
          <div className="theme-text-muted text-sm">Tap to browse all chapters</div>
        </Link>
      </div>
    )
  }

  // Chapter-only reference (no specific verse)
  if (reference.verseStart === null) {
    const href = `/read/${slug}/${reference.chapter}`
    return (
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--theme-accent)' }}>
          Direct Reference
        </div>
        <Link
          href={href}
          className="block p-5 theme-surface rounded-xl border-2 hover:shadow-md transition-all"
          style={{ borderColor: 'var(--theme-accent)' }}
        >
          <div className="font-bold theme-text text-lg mb-1">
            {reference.bookName} {reference.chapter}
          </div>
          <div className="theme-text-muted text-sm">
            {verses.length} verses · tap to read the full chapter
          </div>
          {verses[0] && (
            <div className="mt-3 theme-text-muted text-sm italic leading-relaxed">
              &ldquo;{verses[0].text.slice(0, 150)}{verses[0].text.length > 150 ? '...' : ''}&rdquo;
            </div>
          )}
        </Link>
      </div>
    )
  }

  // Specific verse(s)
  const verseLabel = reference.verseEnd
    ? `${reference.bookName} ${reference.chapter}:${reference.verseStart}-${reference.verseEnd}`
    : `${reference.bookName} ${reference.chapter}:${reference.verseStart}`

  const href = `/read/${slug}/${reference.chapter}#verse-${reference.verseStart}`

  return (
    <div className="mb-6">
      <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--theme-accent)' }}>
        Direct Reference
      </div>
      <Link
        href={href}
        className="block p-5 theme-surface rounded-xl border-2 hover:shadow-md transition-all"
        style={{ borderColor: 'var(--theme-accent)' }}
      >
        <div className="font-bold theme-text text-lg mb-1">{verseLabel}</div>
        <div className="space-y-2 mt-3">
          {verses.map(v => (
            <div key={v.id} className="theme-text text-sm leading-relaxed">
              <sup className="text-xs theme-text-muted mr-1">{v.verse}</sup>
              {v.text}
            </div>
          ))}
        </div>
        {verses.length === 0 && (
          <div className="theme-text-muted text-sm mt-2">Verse not found · tap to open the chapter</div>
        )}
      </Link>
    </div>
  )
}

// Book Suggestions Grid
function BookSuggestions({
  suggestions,
  onSelect,
}: {
  suggestions: BookSuggestion[]
  onSelect: (suggestion: BookSuggestion) => void
}) {
  return (
    <div className="mb-6">
      <div className="text-xs font-semibold uppercase tracking-wider theme-text-muted mb-3">
        Did you mean...
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {suggestions.map(book => (
          <button
            key={book.abbr}
            onClick={() => onSelect(book)}
            className="p-3 theme-surface rounded-xl border theme-border hover:border-amber-400 text-left transition-all hover:shadow-md"
          >
            <div className="font-medium theme-text text-sm">{book.name}</div>
            <div className="text-xs theme-text-muted mt-0.5">
              {book.chapters} chapters · {book.testament}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// Search Result Card
function SearchResult({ result }: { result: FuseResult }) {
  const { item, matches } = result
  const slug = bookToSlug(item.book)
  const href = `/read/${slug}/${item.chapter}#verse-${item.verse}`

  return (
    <Link
      href={href}
      className="block p-4 theme-surface rounded-xl border theme-border hover:border-amber-400 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-4">
        <div
          className={`shrink-0 px-2 py-1 rounded text-xs font-medium ${
            item.testament === 'OT' ? 'theme-badge-ot' : 'theme-badge-nt'
          }`}
        >
          {item.testament}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium theme-text mb-1">
            {item.book} {item.chapter}:{item.verse}
          </div>
          <div className="theme-text-muted text-sm leading-relaxed">
            <HighlightedText text={item.text} matches={matches} />
          </div>
        </div>
      </div>
    </Link>
  )
}

// Filter Button Component
function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-all ${
        active ? 'theme-accent-bg' : 'theme-btn-secondary theme-border-hover'
      }`}
    >
      {label}
    </button>
  )
}

// Search Icon
function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 theme-text-muted"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  )
}
