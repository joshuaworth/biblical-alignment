'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { useNotesStore } from '@/stores/notesStore'
import { NotesList } from '@/components/NotesList'
import { useHaptics } from '@/hooks/useHaptics'

// Get unique books from notes
function getUniqueBooks(notes: { book: string }[]): string[] {
  const books = new Set<string>()
  notes.forEach((note) => books.add(note.book))
  return Array.from(books).sort()
}

export default function NotesPage() {
  const [filterBook, setFilterBook] = useState<string>('')
  const [mounted, setMounted] = useState(false)
  const haptics = useHaptics()

  const { notes } = useNotesStore()

  // Mount check to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get unique books for filter
  const uniqueBooks = useMemo(() => getUniqueBooks(notes), [notes])

  // Export notes as JSON
  const handleExport = useCallback(() => {
    haptics.light()

    const exportData = {
      exportedAt: new Date().toISOString(),
      source: 'Biblical Alignment',
      noteCount: notes.length,
      notes: notes,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `biblical-alignment-notes-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    haptics.success()
  }, [notes, haptics])

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <main className="min-h-screen pb-24" style={{ backgroundColor: 'var(--theme-bg)' }}>
        <header
          className="sticky top-0 z-20 border-b"
          style={{
            backgroundColor: 'var(--theme-bg)',
            borderColor: 'var(--theme-border)',
          }}
        >
          <div className="max-w-2xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link
                  href="/read"
                  className="p-2 -ml-2 rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                  aria-label="Back to reading"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: 'var(--theme-text)' }}
                  >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                </Link>
                <h1
                  className="text-xl font-semibold"
                  style={{ color: 'var(--theme-text)' }}
                >
                  My Notes
                </h1>
              </div>
            </div>
          </div>
        </header>
      </main>
    )
  }

  return (
    <main className="min-h-screen pb-24" style={{ backgroundColor: 'var(--theme-bg)' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-20 border-b"
        style={{
          backgroundColor: 'var(--theme-bg)',
          borderColor: 'var(--theme-border)',
        }}
      >
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/read"
                className="p-2 -ml-2 rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                aria-label="Back to reading"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: 'var(--theme-text)' }}
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1
                className="text-xl font-semibold"
                style={{ color: 'var(--theme-text)' }}
              >
                My Notes
              </h1>
            </div>

            {/* Export button */}
            {notes.length > 0 && (
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                style={{
                  backgroundColor: 'var(--theme-surface)',
                  color: 'var(--theme-text)',
                  border: '1px solid var(--theme-border)',
                }}
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
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export
              </button>
            )}
          </div>

          {/* Stats and filter */}
          <div className="flex items-center justify-between mt-4 gap-4">
            <div className="flex items-center gap-4">
              {notes.length > 0 && (
                <p
                  className="text-sm opacity-60"
                  style={{ color: 'var(--theme-text)' }}
                >
                  {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                </p>
              )}

              <Link
                href="/bookmarks"
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
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                Bookmarks
              </Link>
            </div>

            {/* Book filter */}
            {uniqueBooks.length > 1 && (
              <select
                value={filterBook}
                onChange={(e) => setFilterBook(e.target.value)}
                className="px-3 py-1.5 text-sm rounded-lg outline-none cursor-pointer"
                style={{
                  backgroundColor: 'var(--theme-surface)',
                  color: 'var(--theme-text)',
                  border: '1px solid var(--theme-border)',
                }}
              >
                <option value="">All books</option>
                {uniqueBooks.map((book) => (
                  <option key={book} value={book}>
                    {book}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </header>

      {/* Notes list */}
      <div className="max-w-2xl mx-auto">
        <NotesList
          filterBook={filterBook || undefined}
          showSearch={notes.length >= 5}
          emptyMessage="You haven't written any notes yet"
        />
      </div>
    </main>
  )
}
