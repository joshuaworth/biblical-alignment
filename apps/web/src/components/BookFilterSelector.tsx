'use client'

import { useState, useRef, useEffect } from 'react'
import { BIBLE_BOOKS, BookFilterItem } from '@/lib/book-list'

type TestamentFilter = 'all' | 'OT' | 'NT'

interface BookFilterSelectorProps {
  testamentFilter: TestamentFilter
  selectedBooks: string[]
  onSelectedBooksChange: (books: string[]) => void
}

export function BookFilterSelector({
  testamentFilter,
  selectedBooks,
  onSelectedBooksChange,
}: BookFilterSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const filteredBooks = testamentFilter === 'all'
    ? BIBLE_BOOKS
    : BIBLE_BOOKS.filter(b => b.testament === testamentFilter)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  // Prune selections when testament filter changes
  useEffect(() => {
    if (testamentFilter === 'all') return
    const validBooks = new Set(filteredBooks.map(b => b.name))
    const pruned = selectedBooks.filter(b => validBooks.has(b))
    if (pruned.length !== selectedBooks.length) {
      onSelectedBooksChange(pruned)
    }
  }, [testamentFilter, filteredBooks, selectedBooks, onSelectedBooksChange])

  const toggleBook = (bookName: string) => {
    if (selectedBooks.includes(bookName)) {
      onSelectedBooksChange(selectedBooks.filter(b => b !== bookName))
    } else {
      onSelectedBooksChange([...selectedBooks, bookName])
    }
  }

  return (
    <div ref={panelRef} className="relative">
      {/* Selected book chips */}
      {selectedBooks.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {selectedBooks.map(book => (
            <button
              key={book}
              onClick={() => toggleBook(book)}
              className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors"
              style={{
                backgroundColor: 'var(--theme-accent)',
                color: 'white',
              }}
            >
              {book}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          ))}
          <button
            onClick={() => onSelectedBooksChange([])}
            className="px-3 py-1 rounded-full text-xs font-medium theme-text-muted hover:text-red-500 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
        style={{
          backgroundColor: selectedBooks.length > 0 ? 'var(--theme-surface-alt)' : 'var(--theme-surface)',
          borderColor: 'var(--theme-border)',
          border: '1px solid var(--theme-border)',
          color: 'var(--theme-text-secondary)',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M3 6h18M7 12h10M10 18h4" />
        </svg>
        {selectedBooks.length > 0
          ? `${selectedBooks.length} book${selectedBooks.length > 1 ? 's' : ''} selected`
          : 'Filter by book'}
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute z-50 mt-2 w-72 max-h-64 overflow-y-auto rounded-xl shadow-lg border"
          style={{
            backgroundColor: 'var(--theme-surface)',
            borderColor: 'var(--theme-border)',
          }}
        >
          <div className="p-2">
            {filteredBooks.map(book => {
              const selected = selectedBooks.includes(book.name)
              return (
                <button
                  key={book.name}
                  onClick={() => toggleBook(book.name)}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-left transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                      selected ? 'border-green-500 bg-green-500' : ''
                    }`}
                    style={!selected ? { borderColor: 'var(--theme-border)' } : {}}
                  >
                    {selected && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm theme-text">{book.name}</span>
                  <span className="text-xs theme-text-muted ml-auto">{book.testament}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
