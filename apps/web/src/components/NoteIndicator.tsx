'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNotesStore, Note } from '@/stores/notesStore'
import { useHaptics } from '@/hooks/useHaptics'

interface NoteIndicatorProps {
  book: string
  chapter: number
  verse: number
  onEditNote: (note: Note) => void
}

export function NoteIndicator({
  book,
  chapter,
  verse,
  onEditNote,
}: NoteIndicatorProps) {
  const [showPreview, setShowPreview] = useState(false)
  const haptics = useHaptics()

  const { getNotesForVerse } = useNotesStore()
  const notes = getNotesForVerse(book, chapter, verse)

  if (notes.length === 0) return null

  const note = notes[0] // Get the first note for this verse

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      haptics.light()
      onEditNote(note)
    },
    [note, onEditNote, haptics]
  )

  const handleMouseEnter = () => setShowPreview(true)
  const handleMouseLeave = () => setShowPreview(false)

  // Truncate preview text
  const previewText =
    note.content.length > 100
      ? note.content.slice(0, 100) + '...'
      : note.content

  return (
    <span className="note-indicator-wrapper inline relative">
      <button
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="note-indicator inline-flex items-center justify-center w-4 h-4 ml-1 rounded-full text-[10px] transition-all hover:scale-110 active:scale-95"
        style={{
          backgroundColor: 'var(--theme-accent)',
          color: 'white',
          verticalAlign: 'super',
        }}
        aria-label={`View note for verse ${verse}`}
        title="View note"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      </button>

      {/* Desktop hover preview */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="hidden md:block absolute left-0 top-full mt-2 z-50 w-64 p-3 rounded-lg shadow-lg pointer-events-none"
            style={{
              backgroundColor: 'var(--theme-surface)',
              border: '1px solid var(--theme-border)',
              boxShadow: '0 10px 25px var(--theme-shadow-lg, rgba(0,0,0,0.2))',
            }}
          >
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--theme-text)' }}
            >
              {previewText}
            </p>
            <p
              className="text-xs mt-2 opacity-50"
              style={{ color: 'var(--theme-text)' }}
            >
              Click to edit
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  )
}
