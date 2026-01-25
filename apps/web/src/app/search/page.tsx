'use client'

/**
 * Search Page
 *
 * Full-text search across the entire Bible using Fuse.js
 * Features: instant results, OT/NT filtering, highlighted matches
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import Link from 'next/link'
import Fuse from 'fuse.js'
import { NavBar } from '@/components/NavBar'

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
  // Find text matches
  const textMatch = matches?.find(m => m.key === 'text' || !m.key)
  if (!textMatch) {
    return <span>{text}</span>
  }

  const parts: React.ReactElement[] = []
  let lastIndex = 0

  // Sort indices to handle them in order
  const sortedIndices = [...textMatch.indices].sort((a, b) => a[0] - b[0])

  for (const [start, end] of sortedIndices) {
    // Add non-highlighted text before this match
    if (start > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`}>{text.slice(lastIndex, start)}</span>
      )
    }
    // Add highlighted match
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

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>)
  }

  return <>{parts}</>
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<TestamentFilter>('all')
  const [searchIndex, setSearchIndex] = useState<SearchEntry[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load search index on mount
  useEffect(() => {
    async function loadIndex() {
      try {
        const response = await fetch('/search-index.json')
        if (!response.ok) {
          throw new Error('Failed to load search index')
        }
        const data = await response.json()
        setSearchIndex(data)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load search index'
        )
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

  // Create Fuse instance with filtered data
  const fuse = useMemo(() => {
    if (!searchIndex) return null

    // Filter by testament if needed
    const filteredData =
      filter === 'all'
        ? searchIndex
        : searchIndex.filter(entry => entry.testament === filter)

    return new Fuse(filteredData, {
      keys: ['text'],
      threshold: 0.3,
      distance: 100,
      minMatchCharLength: 2,
      includeMatches: true,
      ignoreLocation: true,
    })
  }, [searchIndex, filter])

  // Search results
  const results = useMemo(() => {
    if (!fuse || !query.trim()) return []

    const searchResults = fuse.search(query, { limit: 50 })
    return searchResults as FuseResult[]
  }, [fuse, query])

  // Debounced query handler
  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value)
    },
    []
  )

  // Loading state
  if (loading) {
    return (
      <main id="main-content" className="min-h-screen theme-bg">
        <NavBar />
        <div className="pt-24 pb-12 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-pulse">
              <div className="h-12 theme-surface rounded-xl mb-8"></div>
              <p className="theme-text-muted">
                Loading search index...
              </p>
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
            <p className="text-red-500 mb-4">
              Error: {error}
            </p>
            <p className="theme-text-muted">
              Try refreshing the page or building the search index.
            </p>
          </div>
        </div>
      </main>
    )
  }

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
              Find any word or phrase across all 66 books
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
                placeholder="Search for words or phrases..."
                className="w-full px-6 py-4 text-lg rounded-xl theme-input transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <SearchIcon />
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex justify-center gap-2 mb-8">
            <FilterButton
              label="All"
              active={filter === 'all'}
              onClick={() => setFilter('all')}
            />
            <FilterButton
              label="Old Testament"
              active={filter === 'OT'}
              onClick={() => setFilter('OT')}
            />
            <FilterButton
              label="New Testament"
              active={filter === 'NT'}
              onClick={() => setFilter('NT')}
            />
          </div>

          {/* Results Count */}
          {query.trim() && (
            <div className="text-center mb-6">
              <p className="theme-text-muted">
                {results.length === 0
                  ? 'No results found'
                  : `Found ${results.length}${results.length === 50 ? '+' : ''} results`}
              </p>
            </div>
          )}

          {/* Results List */}
          <div className="space-y-4">
            {results.map(result => (
              <SearchResult key={result.item.id} result={result} />
            ))}
          </div>

          {/* Empty State */}
          {!query.trim() && (
            <div className="text-center py-12">
              <p className="theme-text-muted mb-4">
                Start typing to search the entire Bible
              </p>
              <div className="theme-text-muted text-sm space-y-1 opacity-60">
                <p>Try searching for:</p>
                <p className="font-mono">&quot;love&quot;</p>
                <p className="font-mono">&quot;in the beginning&quot;</p>
                <p className="font-mono">&quot;faith hope&quot;</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
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
        {/* Testament Badge */}
        <div
          className={`shrink-0 px-2 py-1 rounded text-xs font-medium ${
            item.testament === 'OT'
              ? 'theme-badge-ot'
              : 'theme-badge-nt'
          }`}
        >
          {item.testament}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Reference */}
          <div className="font-medium theme-text mb-1">
            {item.book} {item.chapter}:{item.verse}
          </div>

          {/* Text with highlights */}
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
        active
          ? 'theme-accent-bg'
          : 'theme-btn-secondary theme-border-hover'
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
