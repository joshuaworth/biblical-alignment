'use client'

import { useState, useEffect } from 'react'

interface ReadingProgressProps {
  bookName: string
  currentChapter: number
  totalChapters: number
}

/**
 * 📖 Reading Progress Indicator
 * Shows scroll progress through the current chapter with a subtle progress bar
 * Mobile-only (< 768px) for a premium reading experience
 */
export function ReadingProgress({
  bookName,
  currentChapter,
  totalChapters,
}: ReadingProgressProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => {
      setIsVisible(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight

      if (docHeight <= 0) {
        setScrollProgress(0)
        return
      }

      const progress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100))
      setScrollProgress(progress)
    }

    // Initial calculation
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div className="fixed top-[57px] left-0 right-0 z-40 pointer-events-none">
      {/* Progress Bar */}
      <div className="h-[3px] w-full bg-transparent">
        <div
          className="h-full transition-all duration-75 ease-out"
          style={{
            width: `${scrollProgress}%`,
            backgroundColor: 'var(--theme-accent)',
            boxShadow: scrollProgress > 0 ? '0 0 8px var(--theme-accent)' : 'none',
          }}
        />
      </div>

      {/* Chapter Info Pill */}
      <div
        className="absolute top-2 left-1/2 -translate-x-1/2 transition-all duration-300"
        style={{
          opacity: scrollProgress > 5 ? 1 : 0,
          transform: `translateX(-50%) translateY(${scrollProgress > 5 ? 0 : -8}px)`,
        }}
      >
        <div
          className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md pointer-events-auto"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--theme-surface) 90%, transparent)',
            color: 'var(--theme-text-muted)',
            border: '1px solid var(--theme-border)',
          }}
        >
          <span style={{ color: 'var(--theme-text)' }}>{bookName} {currentChapter}</span>
          <span className="mx-1.5 opacity-40">|</span>
          <span>{Math.round(scrollProgress)}% read</span>
          <span className="mx-1.5 opacity-40">|</span>
          <span>Ch {currentChapter} of {totalChapters}</span>
        </div>
      </div>
    </div>
  )
}
