'use client'

/**
 * 📖 Chapter Picker Overlay
 * Full-screen overlay for quick chapter navigation
 * Triggered by tapping the chapter title in the header
 */

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useHaptics } from '@/hooks/useHaptics'

interface ChapterPickerProps {
  isOpen: boolean
  onClose: () => void
  bookName: string
  bookSlug: string
  totalChapters: number
  currentChapter: number
}

export function ChapterPicker({
  isOpen,
  onClose,
  bookName,
  bookSlug,
  totalChapters,
  currentChapter,
}: ChapterPickerProps) {
  const router = useRouter()
  const haptics = useHaptics()

  // Handle escape key to close
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  // Add/remove escape key listener
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      // Prevent body scroll when overlay is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  // Navigate to chapter and close
  const handleChapterSelect = (chapter: number) => {
    haptics.light()
    router.push(`/read/${bookSlug}/${chapter}`)
    onClose()
  }

  // Generate chapter numbers
  const chapters = Array.from({ length: totalChapters }, (_, i) => i + 1)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 backdrop-blur-md"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Overlay Panel */}
          <motion.div
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
            }}
            className="fixed inset-x-0 top-0 z-50 max-h-[85vh] overflow-y-auto theme-surface rounded-b-3xl shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label={`Select chapter from ${bookName}`}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 theme-surface border-b theme-border px-6 py-4">
              <div className="flex items-center justify-between max-w-4xl mx-auto">
                <div>
                  <h2 className="text-xl font-bold theme-text">{bookName}</h2>
                  <p className="text-sm theme-text-muted">
                    {totalChapters} {totalChapters === 1 ? 'chapter' : 'chapters'}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-3 rounded-full theme-surface-alt hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors touch-target-large"
                  aria-label="Close chapter picker"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            {/* Chapter Grid */}
            <div className="px-6 py-6">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
                  {chapters.map(chapter => (
                    <motion.button
                      key={chapter}
                      onClick={() => handleChapterSelect(chapter)}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        min-h-[48px] min-w-[48px] flex items-center justify-center rounded-lg font-medium transition-all touch-target-large
                        ${
                          chapter === currentChapter
                            ? 'bg-amber-600 text-white shadow-md'
                            : 'theme-surface border theme-border hover:border-amber-400 theme-text hover:shadow-md'
                        }
                      `}
                      aria-label={`Go to chapter ${chapter}`}
                      aria-current={chapter === currentChapter ? 'page' : undefined}
                    >
                      {chapter}
                    </motion.button>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-6 flex justify-center gap-3">
                  {currentChapter > 1 && (
                    <button
                      onClick={() => handleChapterSelect(1)}
                      className="px-4 py-3 min-h-[44px] text-sm theme-text-muted hover:text-amber-600 transition-colors touch-target"
                    >
                      Go to Chapter 1
                    </button>
                  )}
                  {currentChapter < totalChapters && (
                    <button
                      onClick={() => handleChapterSelect(totalChapters)}
                      className="px-4 py-3 min-h-[44px] text-sm theme-text-muted hover:text-amber-600 transition-colors touch-target"
                    >
                      Go to Chapter {totalChapters}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Pull indicator (visual hint) */}
            <div className="flex justify-center pb-4">
              <div className="w-12 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 theme-text"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
