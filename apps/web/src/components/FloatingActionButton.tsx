'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useHaptics } from '@/hooks/useHaptics'

interface FloatingActionButtonProps {
  onListen: () => void
  onBookmark: () => void
  onFocus?: () => void
  bookName: string
  chapter: number
}

export function FloatingActionButton({
  onListen,
  onBookmark,
  onFocus,
  bookName,
  chapter,
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const fabRef = useRef<HTMLDivElement>(null)
  const haptics = useHaptics()

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Handle share action using Web Share API
  const handleShare = async () => {
    haptics.light()
    const shareData = {
      title: `${bookName} ${chapter} - Biblical Alignment`,
      text: `Read ${bookName} chapter ${chapter} on Biblical Alignment`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href)
        // Could show a toast here
      }
    } catch (err) {
      // User cancelled or error occurred
      console.log('Share cancelled or failed')
    }
    setIsOpen(false)
  }

  const handleListen = () => {
    haptics.light()
    onListen()
    setIsOpen(false)
  }

  const handleBookmark = () => {
    haptics.light()
    onBookmark()
    setIsOpen(false)
  }

  const handleFocus = () => {
    haptics.light()
    onFocus?.()
    setIsOpen(false)
  }

  // Don't render on desktop
  if (!isMobile) return null

  const actions = [
    { icon: '🎧', label: 'Listen', onClick: handleListen },
    { icon: '🔖', label: 'Bookmark', onClick: handleBookmark },
    { icon: '📤', label: 'Share', onClick: handleShare },
    ...(onFocus ? [{ icon: '🧘', label: 'Focus', onClick: handleFocus }] : []),
  ]

  return (
    <div
      ref={fabRef}
      className="fixed right-4 z-50"
      style={{ bottom: '80px' }}
    >
      {/* Action buttons that fan out */}
      <AnimatePresence>
        {isOpen && (
          <div className="absolute bottom-16 right-0 flex flex-col-reverse gap-3">
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, scale: 0.3, y: 20 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: {
                    delay: index * 0.05,
                    type: 'spring',
                    stiffness: 400,
                    damping: 25
                  }
                }}
                exit={{
                  opacity: 0,
                  scale: 0.3,
                  y: 20,
                  transition: {
                    delay: (actions.length - 1 - index) * 0.03,
                    duration: 0.15
                  }
                }}
                onClick={action.onClick}
                className="flex items-center gap-3 group touch-target"
                aria-label={action.label}
              >
                {/* Label */}
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: { delay: index * 0.05 + 0.1 }
                  }}
                  exit={{ opacity: 0, x: 10, transition: { duration: 0.1 } }}
                  className="px-3 py-2 rounded-lg text-sm font-medium shadow-lg"
                  style={{
                    backgroundColor: 'var(--theme-surface)',
                    color: 'var(--theme-text)',
                    boxShadow: '0 4px 12px var(--theme-shadow-lg, rgba(0,0,0,0.15))'
                  }}
                  aria-hidden="true"
                >
                  {action.label}
                </motion.span>

                {/* Icon button */}
                <div
                  className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-full flex items-center justify-center text-xl shadow-lg active:scale-95 transition-transform"
                  style={{
                    backgroundColor: 'var(--theme-surface)',
                    boxShadow: '0 4px 12px var(--theme-shadow-lg, rgba(0,0,0,0.15))'
                  }}
                  aria-hidden="true"
                >
                  {action.icon}
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main FAB button */}
      <motion.button
        onClick={() => {
          haptics.medium()
          setIsOpen(!isOpen)
        }}
        className="w-14 h-14 min-w-[56px] min-h-[56px] rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-colors touch-target-large"
        style={{
          backgroundColor: 'var(--theme-accent)',
          boxShadow: '0 6px 20px var(--theme-shadow-lg, rgba(0,0,0,0.25))'
        }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        aria-label={isOpen ? 'Close action menu' : 'Open action menu'}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <motion.span
          className="text-2xl"
          style={{ color: 'var(--theme-text-inverted, white)' }}
          aria-hidden="true"
        >
          {isOpen ? '✕' : '✦'}
        </motion.span>
      </motion.button>
    </div>
  )
}
