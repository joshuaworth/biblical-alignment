'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'biblical-alignment-distraction-free'

interface UseDistractionFreeReturn {
  isDistractionFree: boolean
  toggle: () => void
  enter: () => void
  exit: () => void
}

/**
 * Hook for managing distraction-free reading mode
 * - Persists preference in localStorage
 * - Handles escape key to exit mode on desktop
 */
export function useDistractionFree(): UseDistractionFreeReturn {
  const [isDistractionFree, setIsDistractionFree] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Load preference from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'true') {
      setIsDistractionFree(true)
    }
    setMounted(true)
  }, [])

  // Save preference to localStorage
  useEffect(() => {
    if (!mounted) return
    localStorage.setItem(STORAGE_KEY, String(isDistractionFree))
  }, [isDistractionFree, mounted])

  // Handle escape key to exit mode
  useEffect(() => {
    if (!isDistractionFree) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDistractionFree(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDistractionFree])

  // Lock body scroll when in distraction-free mode
  useEffect(() => {
    if (!mounted) return

    if (isDistractionFree) {
      // Store current scroll position
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1)
      }
    }
  }, [isDistractionFree, mounted])

  const toggle = useCallback(() => {
    setIsDistractionFree(prev => !prev)
  }, [])

  const enter = useCallback(() => {
    setIsDistractionFree(true)
  }, [])

  const exit = useCallback(() => {
    setIsDistractionFree(false)
  }, [])

  return {
    isDistractionFree,
    toggle,
    enter,
    exit,
  }
}
