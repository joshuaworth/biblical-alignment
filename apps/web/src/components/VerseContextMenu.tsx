'use client'

import { useState, useEffect, useRef, useCallback, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useHaptics } from '@/hooks/useHaptics'
import { useBookmarkStore, highlightColors } from '@/stores/bookmarkStore'
import { HighlightMenu } from './HighlightMenu'

interface VerseData {
  verse: number
  text: string
  bookName: string
  chapter: number
}

interface VerseContextMenuProps {
  children: ReactNode
  verseData: VerseData
  onBookmark?: (verseData: VerseData) => void
  onAddNote?: (verseData: VerseData) => void
  isHighlighted?: boolean
}

interface MenuPosition {
  x: number
  y: number
}

interface MenuAction {
  icon: string
  label: string
  onClick: () => void
  active?: boolean
}

export function VerseContextMenu({ children, verseData, onBookmark, onAddNote, isHighlighted }: VerseContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<MenuPosition>({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)
  const [showHighlightMenu, setShowHighlightMenu] = useState(false)
  const [highlightMenuPosition, setHighlightMenuPosition] = useState<MenuPosition>({ x: 0, y: 0 })
  const triggerRef = useRef<HTMLSpanElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStartPos = useRef<{ x: number; y: number } | null>(null)
  const isLongPressTriggered = useRef(false)
  const haptics = useHaptics()

  // Bookmark store
  const { isVerseBookmarked, toggleBookmark, getHighlightColor } = useBookmarkStore()
  const isBookmarked = isVerseBookmarked(verseData.bookName, verseData.chapter, verseData.verse)
  const highlightColor = getHighlightColor(verseData.bookName, verseData.chapter, verseData.verse)

  // Ensure portal only renders on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate menu position to stay within viewport
  const calculatePosition = useCallback((x: number, y: number) => {
    const menuWidth = 200
    const menuHeight = 280
    const padding = 16
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let adjustedX = x
    let adjustedY = y

    // Prevent menu from going off right edge
    if (x + menuWidth + padding > viewportWidth) {
      adjustedX = viewportWidth - menuWidth - padding
    }

    // Prevent menu from going off left edge
    if (x < padding) {
      adjustedX = padding
    }

    // Prevent menu from going off bottom edge
    if (y + menuHeight + padding > viewportHeight) {
      adjustedY = y - menuHeight - 10
    }

    // Prevent menu from going off top edge
    if (adjustedY < padding) {
      adjustedY = padding
    }

    return { x: adjustedX, y: adjustedY }
  }, [])

  // Open menu at position
  const openMenu = useCallback((clientX: number, clientY: number) => {
    const pos = calculatePosition(clientX, clientY)
    setPosition(pos)
    setIsOpen(true)

    // Haptic feedback on native
    haptics.medium()
  }, [calculatePosition, haptics])

  // Close menu
  const closeMenu = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Handle long press start on verse text
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStartPos.current = { x: touch.clientX, y: touch.clientY }
    isLongPressTriggered.current = false

    longPressTimer.current = setTimeout(() => {
      isLongPressTriggered.current = true
      openMenu(touch.clientX, touch.clientY)
    }, 500)
  }, [openMenu])

  // Handle touch move - cancel long press if moved too much
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartPos.current || !longPressTimer.current) return

    const touch = e.touches[0]
    const deltaX = Math.abs(touch.clientX - touchStartPos.current.x)
    const deltaY = Math.abs(touch.clientY - touchStartPos.current.y)

    // Cancel if moved more than 10px
    if (deltaX > 10 || deltaY > 10) {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
        longPressTimer.current = null
      }
    }
  }, [])

  // Handle touch end - cancel long press timer
  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
    touchStartPos.current = null
  }, [])

  // Handle verse number tap - opens menu immediately
  const handleVerseNumberClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    openMenu(e.clientX, e.clientY)
  }, [openMenu])

  // Handle verse number touch
  const handleVerseNumberTouch = useCallback((e: React.TouchEvent) => {
    // Only handle if it's a tap, not part of a scroll
    e.preventDefault()
    e.stopPropagation()

    if (e.touches.length > 0) {
      const touch = e.touches[0]
      openMenu(touch.clientX, touch.clientY)
    }
  }, [openMenu])

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu()
      }
    }

    // Delay to prevent immediate close on mobile
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }, 100)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isOpen, closeMenu])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeMenu])

  // Generate verse reference string
  const verseReference = `${verseData.bookName} ${verseData.chapter}:${verseData.verse}`

  // Copy verse text to clipboard
  const handleCopyText = useCallback(async () => {
    haptics.light()
    const text = `"${verseData.text.trim()}" - ${verseReference} (BSB)`
    try {
      await navigator.clipboard.writeText(text)
      haptics.success()
    } catch (err) {
      console.error('Failed to copy:', err)
      haptics.error()
    }
    closeMenu()
  }, [verseData.text, verseReference, closeMenu, haptics])

  // Share verse using Web Share API
  const handleShare = useCallback(async () => {
    haptics.light()
    const shareData = {
      title: verseReference,
      text: `"${verseData.text.trim()}" - ${verseReference} (BSB)`,
      url: `${window.location.origin}/read/${encodeURIComponent(verseData.bookName.toLowerCase().replace(/\s+/g, '-'))}/${verseData.chapter}#verse-${verseData.verse}`,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`)
      }
    } catch (err) {
      // User cancelled or error occurred
      console.log('Share cancelled or failed')
    }
    closeMenu()
  }, [verseData, verseReference, closeMenu, haptics])

  // Bookmark verse using the store
  const handleBookmark = useCallback(() => {
    haptics.light()
    const added = toggleBookmark({
      book: verseData.bookName,
      chapter: verseData.chapter,
      verse: verseData.verse,
      text: verseData.text,
    })
    if (added) {
      haptics.success()
    }
    onBookmark?.(verseData)
    closeMenu()
  }, [toggleBookmark, verseData, onBookmark, closeMenu, haptics])

  // Open highlight menu
  const handleHighlight = useCallback(() => {
    haptics.light()
    setHighlightMenuPosition({ x: position.x + 100, y: position.y })
    setShowHighlightMenu(true)
    closeMenu()
  }, [position, closeMenu, haptics])

  // Add note to verse
  const handleAddNote = useCallback(() => {
    haptics.light()
    onAddNote?.(verseData)
    closeMenu()
  }, [onAddNote, verseData, closeMenu, haptics])

  // Copy link to verse
  const handleCopyLink = useCallback(async () => {
    haptics.light()
    const url = `${window.location.origin}/read/${encodeURIComponent(verseData.bookName.toLowerCase().replace(/\s+/g, '-'))}/${verseData.chapter}#verse-${verseData.verse}`
    try {
      await navigator.clipboard.writeText(url)
      haptics.success()
    } catch (err) {
      console.error('Failed to copy link:', err)
      haptics.error()
    }
    closeMenu()
  }, [verseData, closeMenu, haptics])

  const actions: MenuAction[] = [
    { icon: '📝', label: 'Add note', onClick: handleAddNote },
    { icon: '🎨', label: highlightColor ? 'Change highlight' : 'Highlight', onClick: handleHighlight, active: !!highlightColor },
    { icon: '🔖', label: isBookmarked ? 'Remove bookmark' : 'Bookmark', onClick: handleBookmark, active: isBookmarked },
    { icon: '📋', label: 'Copy verse text', onClick: handleCopyText },
    { icon: '📤', label: 'Share verse', onClick: handleShare },
    { icon: '🔗', label: 'Copy link', onClick: handleCopyLink },
  ]

  // Menu component
  const menu = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Invisible backdrop for click outside */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[9998]"
            aria-hidden="true"
          />

          {/* Menu */}
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
              mass: 0.8,
            }}
            className="fixed z-[9999] min-w-[200px] rounded-xl overflow-hidden shadow-2xl"
            style={{
              left: position.x,
              top: position.y,
              backgroundColor: 'var(--theme-surface)',
              boxShadow: '0 10px 40px var(--theme-shadow-lg, rgba(0,0,0,0.25)), 0 0 0 1px var(--theme-border)',
            }}
            role="menu"
            aria-label="Verse actions"
          >
            {/* Header - Verse reference */}
            <div
              className="px-4 py-3 border-b"
              style={{
                borderColor: 'var(--theme-border)',
                backgroundColor: 'var(--theme-surface-alt)',
              }}
            >
              <p
                className="text-sm font-semibold"
                style={{ color: 'var(--theme-text)' }}
              >
                {verseReference}
              </p>
            </div>

            {/* Actions */}
            <div className="py-1" role="group">
              {actions.map((action, index) => (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: { delay: index * 0.03 + 0.1 }
                  }}
                  onClick={action.onClick}
                  className="w-full flex items-center gap-3 px-4 py-3 min-h-[44px] text-left transition-colors active:scale-[0.98] touch-target"
                  style={{
                    color: action.active ? 'var(--theme-accent)' : 'var(--theme-text)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--theme-surface-hover)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                  role="menuitem"
                  aria-label={action.label}
                >
                  <span className="text-lg" aria-hidden="true">{action.icon}</span>
                  <span className="text-sm font-medium">{action.label}</span>
                  {action.active && (
                    <svg
                      className="ml-auto"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  // Get highlight background class
  const getHighlightClass = () => {
    if (!highlightColor) return ''
    return highlightColors[highlightColor].bg
  }

  return (
    <>
      <span
        ref={triggerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className={`verse-context-trigger inline ${getHighlightClass()} ${highlightColor ? 'rounded px-1 -mx-1' : ''}`}
        data-verse={verseData.verse}
      >
        {/* Verse number - tappable to open menu */}
        <sup
          onClick={handleVerseNumberClick}
          onTouchStart={(e) => {
            e.stopPropagation() // Prevent long-press on verse text
            handleVerseNumberTouch(e)
          }}
          className={`verse-number font-bold text-xs mr-1 select-none cursor-pointer
            hover:text-amber-600 dark:hover:text-amber-400 transition-colors
            ${isHighlighted ? 'text-amber-600 dark:text-amber-400' : ''}
            ${isBookmarked ? 'text-amber-500 dark:text-amber-400' : ''}`}
          role="button"
          aria-label={`Verse ${verseData.verse} options`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              const rect = e.currentTarget.getBoundingClientRect()
              openMenu(rect.left + rect.width / 2, rect.bottom)
            }
          }}
        >
          {verseData.verse}
        </sup>
        {/* Verse text */}
        {children}
      </span>

      {/* Render menu in portal */}
      {mounted && createPortal(menu, document.body)}

      {/* Highlight menu */}
      {mounted && (
        <HighlightMenu
          book={verseData.bookName}
          chapter={verseData.chapter}
          verse={verseData.verse}
          text={verseData.text}
          isOpen={showHighlightMenu}
          onClose={() => setShowHighlightMenu(false)}
          anchorPosition={highlightMenuPosition}
        />
      )}
    </>
  )
}
