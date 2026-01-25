'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBookmarkStore } from '@/stores/bookmarkStore'
import { useHaptics } from '@/hooks/useHaptics'

interface BookmarkButtonProps {
  book: string
  chapter: number
  verse: number
  text: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function BookmarkButton({
  book,
  chapter,
  verse,
  text,
  size = 'md',
  showLabel = false,
  className = '',
}: BookmarkButtonProps) {
  const { isVerseBookmarked, toggleBookmark } = useBookmarkStore()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const haptics = useHaptics()

  // Sync with store (handle hydration)
  useEffect(() => {
    setIsBookmarked(isVerseBookmarked(book, chapter, verse))
  }, [book, chapter, verse, isVerseBookmarked])

  const handleToggle = () => {
    haptics.light()
    setIsAnimating(true)

    const added = toggleBookmark({
      book,
      chapter,
      verse,
      text,
    })

    setIsBookmarked(added)

    if (added) {
      haptics.success()
    }

    setTimeout(() => setIsAnimating(false), 300)
  }

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  }

  return (
    <button
      onClick={handleToggle}
      className={`
        inline-flex items-center justify-center gap-2 rounded-full
        transition-all duration-200 touch-target
        ${sizeClasses[size]}
        ${isBookmarked
          ? 'text-amber-500 dark:text-amber-400'
          : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
        }
        hover:bg-gray-100 dark:hover:bg-gray-800
        active:scale-95
        ${className}
      `}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      aria-pressed={isBookmarked}
    >
      <motion.div
        animate={isAnimating ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <AnimatePresence mode="wait">
          {isBookmarked ? (
            <motion.svg
              key="filled"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
              width={iconSizes[size]}
              height={iconSizes[size]}
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="0"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </motion.svg>
          ) : (
            <motion.svg
              key="outline"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
              width={iconSizes[size]}
              height={iconSizes[size]}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.div>
      {showLabel && (
        <span className="text-sm font-medium">
          {isBookmarked ? 'Bookmarked' : 'Bookmark'}
        </span>
      )}
    </button>
  )
}
