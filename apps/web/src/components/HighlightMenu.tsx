'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useBookmarkStore, HighlightColor, highlightColors } from '@/stores/bookmarkStore'
import { useHaptics } from '@/hooks/useHaptics'

interface HighlightMenuProps {
  book: string
  chapter: number
  verse: number
  text: string
  isOpen: boolean
  onClose: () => void
  anchorPosition: { x: number; y: number }
}

const colorOptions: { color: HighlightColor; hex: string; label: string }[] = [
  { color: 'yellow', hex: '#fef08a', label: 'Yellow' },
  { color: 'green', hex: '#bbf7d0', label: 'Green' },
  { color: 'blue', hex: '#bfdbfe', label: 'Blue' },
  { color: 'pink', hex: '#fbcfe8', label: 'Pink' },
  { color: 'orange', hex: '#fed7aa', label: 'Orange' },
]

export function HighlightMenu({
  book,
  chapter,
  verse,
  text,
  isOpen,
  onClose,
  anchorPosition,
}: HighlightMenuProps) {
  const [mounted, setMounted] = useState(false)
  const [position, setPosition] = useState(anchorPosition)
  const menuRef = useRef<HTMLDivElement>(null)
  const { getBookmarkForVerse, addBookmark, updateBookmark, setHighlightColor, getHighlightColor } = useBookmarkStore()
  const currentColor = getHighlightColor(book, chapter, verse)
  const haptics = useHaptics()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate position to stay within viewport
  useEffect(() => {
    if (!isOpen) return

    const menuWidth = 220
    const menuHeight = 60
    const padding = 16
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let x = anchorPosition.x - menuWidth / 2
    let y = anchorPosition.y - menuHeight - 10

    // Keep within horizontal bounds
    if (x < padding) x = padding
    if (x + menuWidth > viewportWidth - padding) x = viewportWidth - menuWidth - padding

    // If would go above viewport, show below instead
    if (y < padding) y = anchorPosition.y + 10

    // Keep within vertical bounds
    if (y + menuHeight > viewportHeight - padding) y = viewportHeight - menuHeight - padding

    setPosition({ x, y })
  }, [anchorPosition, isOpen])

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }, 100)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isOpen, onClose])

  // Close on escape
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const handleColorSelect = (color: HighlightColor) => {
    haptics.light()

    // Ensure verse is bookmarked first
    const bookmark = getBookmarkForVerse(book, chapter, verse)
    if (!bookmark) {
      // Create bookmark with highlight
      addBookmark({ book, chapter, verse, text, color })
    } else {
      // Update existing bookmark
      setHighlightColor(book, chapter, verse, color)
    }

    haptics.success()
    onClose()
  }

  const handleRemoveHighlight = () => {
    haptics.light()
    setHighlightColor(book, chapter, verse, null)
    onClose()
  }

  if (!mounted) return null

  const menu = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 z-[9998]"
            aria-hidden="true"
          />

          {/* Menu */}
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
              mass: 0.8,
            }}
            className="fixed z-[9999] rounded-2xl p-2 shadow-2xl"
            style={{
              left: position.x,
              top: position.y,
              backgroundColor: 'var(--theme-surface)',
              boxShadow: '0 10px 40px var(--theme-shadow-lg, rgba(0,0,0,0.25)), 0 0 0 1px var(--theme-border)',
            }}
            role="menu"
            aria-label="Highlight colors"
          >
            <div className="flex items-center gap-1">
              {/* Color options */}
              {colorOptions.map(({ color, hex, label }) => (
                <motion.button
                  key={color}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleColorSelect(color)}
                  className={`
                    w-9 h-9 rounded-full transition-all duration-150
                    ${currentColor === color ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-500' : ''}
                  `}
                  style={{
                    backgroundColor: hex,
                    '--tw-ring-offset-color': 'var(--theme-surface)',
                  } as React.CSSProperties}
                  aria-label={`Highlight ${label}`}
                  aria-pressed={currentColor === color}
                  role="menuitem"
                />
              ))}

              {/* Remove highlight */}
              {currentColor && (
                <>
                  <div
                    className="w-px h-6 mx-1"
                    style={{ backgroundColor: 'var(--theme-border)' }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRemoveHighlight}
                    className="w-9 h-9 rounded-full flex items-center justify-center
                      bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400
                      hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Remove highlight"
                    role="menuitem"
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
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  return createPortal(menu, document.body)
}
