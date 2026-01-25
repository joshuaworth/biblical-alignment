'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// 📖 Reading Position Data Structure
interface ReadingPosition {
  // Per-chapter scroll positions (key: "book-slug-chapter", value: pixels)
  positions: {
    [key: string]: number
  }
  // Last read location
  lastRead: {
    book: string // book slug
    chapter: number
    timestamp: number
  } | null
}

const STORAGE_KEY = 'biblical-alignment-reading-position'
const DEBOUNCE_MS = 1000 // Save every 1 second of no scrolling

/**
 * 📖 Get reading position data from localStorage
 */
function getStoredPosition(): ReadingPosition {
  if (typeof window === 'undefined') {
    return { positions: {}, lastRead: null }
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as ReadingPosition
    }
  } catch (e) {
    console.warn('Failed to load reading position:', e)
  }

  return { positions: {}, lastRead: null }
}

/**
 * 📖 Save reading position data to localStorage
 */
function saveStoredPosition(data: ReadingPosition): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('Failed to save reading position:', e)
  }
}

/**
 * 📖 Generate storage key for a chapter
 */
function getChapterKey(bookSlug: string, chapter: number): string {
  return `${bookSlug}-${chapter}`
}

interface UseReadingPositionReturn {
  lastRead: { book: string; chapter: number; timestamp: number } | null
  savePosition: () => void
  clearPosition: () => void
}

/**
 * 📖 Hook to manage reading position memory
 *
 * Features:
 * - Restores scroll position when returning to a chapter
 * - Saves scroll position on unmount and while scrolling (debounced)
 * - Tracks last read location globally
 *
 * @param bookSlug - URL slug of the current book (e.g., "john", "1-corinthians")
 * @param chapter - Current chapter number
 */
export function useReadingPosition(
  bookSlug: string,
  chapter: number
): UseReadingPositionReturn {
  const [lastRead, setLastRead] = useState<ReadingPosition['lastRead']>(null)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const chapterKey = getChapterKey(bookSlug, chapter)

  // Save current scroll position to storage
  const saveCurrentPosition = useCallback(() => {
    if (typeof window === 'undefined') return

    const scrollY = window.scrollY
    const data = getStoredPosition()

    // Update chapter scroll position
    data.positions[chapterKey] = scrollY

    // Update last read location
    data.lastRead = {
      book: bookSlug,
      chapter,
      timestamp: Date.now(),
    }

    saveStoredPosition(data)
    setLastRead(data.lastRead)
  }, [bookSlug, chapter, chapterKey])

  // Debounced scroll handler
  const handleScroll = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    debounceTimeoutRef.current = setTimeout(() => {
      saveCurrentPosition()
    }, DEBOUNCE_MS)
  }, [saveCurrentPosition])

  // On mount: restore scroll position and load last read
  useEffect(() => {
    const data = getStoredPosition()
    setLastRead(data.lastRead)

    // Restore scroll position for this chapter
    const savedPosition = data.positions[chapterKey]
    if (savedPosition && savedPosition > 0) {
      // Small delay to ensure DOM is ready
      requestAnimationFrame(() => {
        window.scrollTo({ top: savedPosition, behavior: 'instant' })
      })
    }

    // Update last read immediately when visiting a chapter
    data.lastRead = {
      book: bookSlug,
      chapter,
      timestamp: Date.now(),
    }
    saveStoredPosition(data)
    setLastRead(data.lastRead)
  }, [bookSlug, chapter, chapterKey])

  // Set up scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)

      // Clear debounce timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }

      // Save final position on unmount
      saveCurrentPosition()
    }
  }, [handleScroll, saveCurrentPosition])

  // Clear position for current chapter
  const clearPosition = useCallback(() => {
    const data = getStoredPosition()
    delete data.positions[chapterKey]
    saveStoredPosition(data)
  }, [chapterKey])

  return {
    lastRead,
    savePosition: saveCurrentPosition,
    clearPosition,
  }
}

/**
 * 📖 Hook to get last read location (for components that don't need position tracking)
 */
export function useLastRead(): {
  lastRead: ReadingPosition['lastRead']
  clearLastRead: () => void
} {
  const [lastRead, setLastRead] = useState<ReadingPosition['lastRead']>(null)

  useEffect(() => {
    const data = getStoredPosition()
    setLastRead(data.lastRead)
  }, [])

  const clearLastRead = useCallback(() => {
    const data = getStoredPosition()
    data.lastRead = null
    saveStoredPosition(data)
    setLastRead(null)
  }, [])

  return { lastRead, clearLastRead }
}
