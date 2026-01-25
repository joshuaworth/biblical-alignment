'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useNotesStore, Note } from '@/stores/notesStore'
import { useHaptics } from '@/hooks/useHaptics'
import { NoteEditor } from './NoteEditor'

interface NotesListProps {
  filterBook?: string
  showSearch?: boolean
  emptyMessage?: string
}

// Helper to create URL-safe book slug
function bookToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-')
}

// Group notes by book and chapter
function groupNotes(notes: Note[]): Map<string, Map<number, Note[]>> {
  const grouped = new Map<string, Map<number, Note[]>>()

  // Sort notes by book, chapter, verse
  const sorted = [...notes].sort((a, b) => {
    if (a.book !== b.book) return a.book.localeCompare(b.book)
    if (a.chapter !== b.chapter) return a.chapter - b.chapter
    return (a.verse || 0) - (b.verse || 0)
  })

  for (const note of sorted) {
    if (!grouped.has(note.book)) {
      grouped.set(note.book, new Map())
    }
    const bookMap = grouped.get(note.book)!
    if (!bookMap.has(note.chapter)) {
      bookMap.set(note.chapter, [])
    }
    bookMap.get(note.chapter)!.push(note)
  }

  return grouped
}

export function NotesList({
  filterBook,
  showSearch = true,
  emptyMessage = 'No notes yet',
}: NotesListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const haptics = useHaptics()

  const { notes, searchNotes, deleteNote } = useNotesStore()

  // Filter and search notes
  const filteredNotes = useMemo(() => {
    let result = notes

    // Apply book filter
    if (filterBook) {
      result = result.filter(
        (note) => note.book.toLowerCase() === filterBook.toLowerCase()
      )
    }

    // Apply search
    if (searchQuery.trim()) {
      result = searchNotes(searchQuery)
      if (filterBook) {
        result = result.filter(
          (note) => note.book.toLowerCase() === filterBook.toLowerCase()
        )
      }
    }

    return result
  }, [notes, filterBook, searchQuery, searchNotes])

  // Group notes for display
  const groupedNotes = useMemo(() => groupNotes(filteredNotes), [filteredNotes])

  const handleEditNote = useCallback(
    (note: Note) => {
      haptics.light()
      setEditingNote(note)
    },
    [haptics]
  )

  const handleDeleteClick = useCallback(
    (noteId: string) => {
      haptics.light()
      setConfirmDelete(noteId)
    },
    [haptics]
  )

  const handleConfirmDelete = useCallback(
    (noteId: string) => {
      haptics.light()
      deleteNote(noteId)
      haptics.success()
      setConfirmDelete(null)
    },
    [deleteNote, haptics]
  )

  const handleCancelDelete = useCallback(() => {
    setConfirmDelete(null)
  }, [])

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    })
  }

  // Truncate content for preview
  const truncateContent = (content: string, maxLength = 150): string => {
    if (content.length <= maxLength) return content
    return content.slice(0, maxLength).trim() + '...'
  }

  if (filteredNotes.length === 0 && !searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: 'var(--theme-surface-hover)' }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: 'var(--theme-text)', opacity: 0.4 }}
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
        <p
          className="text-center opacity-60"
          style={{ color: 'var(--theme-text)' }}
        >
          {emptyMessage}
        </p>
        <p
          className="text-sm text-center mt-2 opacity-40"
          style={{ color: 'var(--theme-text)' }}
        >
          Tap on a verse number and select &quot;Add Note&quot; to start writing
        </p>
      </div>
    )
  }

  return (
    <div className="notes-list">
      {/* Search */}
      {showSearch && (
        <div className="sticky top-0 z-10 px-4 py-3" style={{ backgroundColor: 'var(--theme-bg)' }}>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: 'var(--theme-surface)',
              border: '1px solid var(--theme-border)',
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: 'var(--theme-text)', opacity: 0.4 }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: 'var(--theme-text)' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
                aria-label="Clear search"
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
                  style={{ color: 'var(--theme-text)' }}
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* No search results */}
      {filteredNotes.length === 0 && searchQuery && (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <p
            className="text-center opacity-60"
            style={{ color: 'var(--theme-text)' }}
          >
            No notes found for &quot;{searchQuery}&quot;
          </p>
        </div>
      )}

      {/* Notes grouped by book/chapter */}
      <div className="px-4 pb-4">
        {Array.from(groupedNotes.entries()).map(([book, chapters]) => (
          <div key={book} className="mb-6">
            {/* Book header */}
            <h3
              className="text-lg font-semibold mb-3"
              style={{ color: 'var(--theme-text)' }}
            >
              {book}
            </h3>

            {Array.from(chapters.entries()).map(([chapter, chapterNotes]) => (
              <div key={`${book}-${chapter}`} className="mb-4">
                {/* Chapter header */}
                <Link
                  href={`/read/${bookToSlug(book)}/${chapter}`}
                  className="inline-flex items-center gap-1 text-sm font-medium mb-2 opacity-70 hover:opacity-100 transition-opacity"
                  style={{ color: 'var(--theme-accent)' }}
                >
                  Chapter {chapter}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>

                {/* Notes */}
                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {chapterNotes.map((note) => (
                      <motion.div
                        key={note.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="rounded-lg p-3 transition-colors"
                        style={{
                          backgroundColor: 'var(--theme-surface)',
                          border: '1px solid var(--theme-border)',
                        }}
                      >
                        {/* Verse reference and date */}
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: 'var(--theme-surface-hover)',
                              color: 'var(--theme-text)',
                            }}
                          >
                            {note.verse ? `v. ${note.verse}` : 'Chapter note'}
                          </span>
                          <span
                            className="text-xs opacity-50"
                            style={{ color: 'var(--theme-text)' }}
                          >
                            {formatDate(note.updatedAt)}
                          </span>
                        </div>

                        {/* Note content preview */}
                        <p
                          className="text-sm leading-relaxed mb-3"
                          style={{ color: 'var(--theme-text)' }}
                        >
                          {truncateContent(note.content)}
                        </p>

                        {/* Actions */}
                        {confirmDelete === note.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <span
                              className="text-sm mr-2"
                              style={{ color: 'var(--theme-text)' }}
                            >
                              Delete this note?
                            </span>
                            <button
                              onClick={handleCancelDelete}
                              className="px-3 py-1 text-sm rounded-lg transition-colors"
                              style={{
                                backgroundColor: 'var(--theme-surface-hover)',
                                color: 'var(--theme-text)',
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleConfirmDelete(note.id)}
                              className="px-3 py-1 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditNote(note)}
                              className="px-3 py-1 text-sm rounded-lg transition-colors"
                              style={{
                                backgroundColor: 'var(--theme-surface-hover)',
                                color: 'var(--theme-text)',
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClick(note.id)}
                              className="px-3 py-1 text-sm rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Edit modal */}
      {editingNote && (
        <NoteEditor
          isOpen={!!editingNote}
          onClose={() => setEditingNote(null)}
          book={editingNote.book}
          chapter={editingNote.chapter}
          verse={editingNote.verse}
          existingNote={editingNote}
        />
      )}
    </div>
  )
}
