'use client'

import { useState, useEffect, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface DistractionFreeModeProps {
  isActive: boolean
  onExit: () => void
  children: ReactNode
}

/**
 * Distraction-free reading mode overlay
 * - Hides all UI except Scripture text
 * - Pure black/white background for maximum contrast
 * - Subtle exit button (top-right, appears on hover/tap)
 * - Escape key exits mode (desktop)
 * - Slight text zoom for readability
 */
export function DistractionFreeMode({ isActive, onExit, children }: DistractionFreeModeProps) {
  const [showExitButton, setShowExitButton] = useState(false)
  const [isDark, setIsDark] = useState(true)

  // Detect current theme
  useEffect(() => {
    if (!isActive) return

    const checkDarkMode = () => {
      const html = document.documentElement
      setIsDark(
        html.classList.contains('theme-dark') ||
        html.classList.contains('dark') ||
        (!html.classList.contains('theme-light') && !html.classList.contains('theme-sepia'))
      )
    }

    checkDarkMode()
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [isActive])

  // Show exit button on any tap/interaction
  const handleInteraction = useCallback(() => {
    setShowExitButton(true)

    // Auto-hide after 3 seconds
    const timer = setTimeout(() => {
      setShowExitButton(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Reset exit button visibility when mode changes
  useEffect(() => {
    if (isActive) {
      setShowExitButton(true)
      const timer = setTimeout(() => setShowExitButton(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isActive])

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] overflow-auto"
          style={{
            backgroundColor: isDark ? '#000000' : '#ffffff',
          }}
          onClick={handleInteraction}
          onMouseMove={handleInteraction}
          onTouchStart={handleInteraction}
        >
          {/* Exit button - subtle, top-right */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: showExitButton ? 0.6 : 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              e.stopPropagation()
              onExit()
            }}
            className="fixed top-4 right-4 z-[101] px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
              pointerEvents: showExitButton ? 'auto' : 'none',
            }}
            aria-label="Exit distraction-free mode"
          >
            Exit Focus Mode
          </motion.button>

          {/* Hint text - shows briefly */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showExitButton ? 0.4 : 0 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[101] text-xs pointer-events-none"
            style={{
              color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
            }}
          >
            Press ESC or tap to exit
          </motion.div>

          {/* Scripture content - zoomed slightly for readability */}
          <div
            className="min-h-full flex items-start justify-center p-8 md:p-16"
            style={{
              color: isDark ? '#ffffff' : '#000000',
            }}
          >
            <div
              className="max-w-3xl w-full"
              style={{
                fontSize: 'calc(var(--scripture-font-size, 18px) * 1.15)',
                lineHeight: 'var(--scripture-line-height, 2)',
                fontFamily: 'var(--scripture-font-family, var(--font-family-body))',
              }}
            >
              {children}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
