'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useNotesStore, Note } from '@/stores/notesStore'
import { useHaptics } from '@/hooks/useHaptics'

interface NoteEditorProps {
  isOpen: boolean
  onClose: () => void
  book: string
  chapter: number
  verse?: number
  existingNote?: Note
}

const MAX_CHARACTERS = 5000

export function NoteEditor({
  isOpen,
  onClose,
  book,
  chapter,
  verse,
  existingNote,
}: NoteEditorProps) {
  const [content, setContent] = useState('')
  const [mounted, setMounted] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const haptics = useHaptics()

  const { addNote, updateNote, deleteNote } = useNotesStore()

  // Mount check for portal
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load existing note content
  useEffect(() => {
    if (isOpen) {
      setContent(existingNote?.content || '')
      // Focus and adjust height after modal opens
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
          adjustTextareaHeight()
        }
      }, 100)
    }
  }, [isOpen, existingNote])

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 400)}px`
    }
  }, [])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length <= MAX_CHARACTERS) {
      setContent(value)
      adjustTextareaHeight()
    }
  }

  const handleSave = useCallback(() => {
    haptics.light()
    const trimmedContent = content.trim()

    if (!trimmedContent) {
      // If content is empty and there was an existing note, delete it
      if (existingNote) {
        deleteNote(existingNote.id)
        haptics.success()
      }
      onClose()
      return
    }

    if (existingNote) {
      updateNote(existingNote.id, trimmedContent)
    } else {
      addNote({
        book,
        chapter,
        verse,
        content: trimmedContent,
      })
    }

    haptics.success()
    onClose()
  }, [content, existingNote, book, chapter, verse, addNote, updateNote, deleteNote, onClose, haptics])

  const handleDelete = useCallback(() => {
    if (existingNote) {
      haptics.light()
      deleteNote(existingNote.id)
      haptics.success()
      onClose()
    }
  }, [existingNote, deleteNote, onClose, haptics])

  const handleCancel = useCallback(() => {
    haptics.light()
    onClose()
  }, [onClose, haptics])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel()
      } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        handleSave()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleCancel, handleSave])

  // Format verse reference
  const verseReference = verse
    ? `${book} ${chapter}:${verse}`
    : `${book} ${chapter}`

  const characterCount = content.length
  const isOverLimit = characterCount > MAX_CHARACTERS * 0.9 // Warn at 90%

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
            onClick={handleCancel}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
            }}
            className="fixed inset-x-4 bottom-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-[9999] rounded-2xl overflow-hidden shadow-2xl"
            style={{
              backgroundColor: 'var(--theme-surface)',
              boxShadow: '0 25px 50px -12px var(--theme-shadow-lg, rgba(0,0,0,0.4))',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{
                borderColor: 'var(--theme-border)',
                backgroundColor: 'var(--theme-surface-alt)',
              }}
            >
              <div>
                <h2
                  className="text-lg font-semibold"
                  style={{ color: 'var(--theme-text)' }}
                >
                  {existingNote ? 'Edit Note' : 'Add Note'}
                </h2>
                <p
                  className="text-sm opacity-70"
                  style={{ color: 'var(--theme-text)' }}
                >
                  {verseReference}
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={handleCancel}
                className="p-2 rounded-full transition-colors hover:bg-black/10 dark:hover:bg-white/10"
                aria-label="Close"
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
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleContentChange}
                placeholder="Write your thoughts about this passage..."
                className="w-full min-h-[150px] max-h-[400px] p-3 rounded-lg resize-none outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--theme-bg)',
                  color: 'var(--theme-text)',
                  border: '1px solid var(--theme-border)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--theme-accent)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--theme-border)'
                }}
              />

              {/* Character count */}
              <div className="flex justify-end mt-2">
                <span
                  className={`text-xs ${isOverLimit ? 'text-amber-500' : 'opacity-50'}`}
                  style={{ color: isOverLimit ? undefined : 'var(--theme-text)' }}
                >
                  {characterCount.toLocaleString()} / {MAX_CHARACTERS.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-between px-4 py-3 border-t"
              style={{ borderColor: 'var(--theme-border)' }}
            >
              <div>
                {existingNote && (
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 text-sm font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                  style={{
                    color: 'var(--theme-text)',
                    backgroundColor: 'var(--theme-surface-hover)',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                  style={{
                    backgroundColor: 'var(--theme-accent)',
                    color: 'white',
                  }}
                >
                  {existingNote ? 'Save' : 'Add Note'}
                </button>
              </div>
            </div>

            {/* Keyboard shortcut hint */}
            <div
              className="hidden md:block text-center py-2 text-xs opacity-40"
              style={{ color: 'var(--theme-text)' }}
            >
              Press Cmd/Ctrl + Enter to save
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  if (!mounted) return null

  return createPortal(modal, document.body)
}
