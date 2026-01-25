'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useRef, useEffect, useMemo } from 'react'

type NavigationDirection = 'forward' | 'back' | 'same'

/**
 * Parse a path to extract navigation depth and chapter info
 * Examples:
 *   /read -> { depth: 1, book: null, chapter: null }
 *   /read/genesis -> { depth: 2, book: 'genesis', chapter: null }
 *   /read/genesis/1 -> { depth: 3, book: 'genesis', chapter: 1 }
 */
function parsePath(path: string) {
  const segments = path.split('/').filter(Boolean)
  return {
    depth: segments.length,
    book: segments[1] || null,
    chapter: segments[2] ? parseInt(segments[2], 10) : null,
  }
}

/**
 * Determine navigation direction based on path changes
 */
function getNavigationDirection(prevPath: string | null, currentPath: string): NavigationDirection {
  if (!prevPath) return 'forward'

  const prev = parsePath(prevPath)
  const curr = parsePath(currentPath)

  // Different depths = forward/back navigation
  if (curr.depth > prev.depth) return 'forward'
  if (curr.depth < prev.depth) return 'back'

  // Same depth, different book = same-level navigation
  if (prev.book !== curr.book) return 'same'

  // Same book, different chapter = forward/back based on chapter number
  if (prev.chapter !== null && curr.chapter !== null) {
    if (curr.chapter > prev.chapter) return 'forward'
    if (curr.chapter < prev.chapter) return 'back'
  }

  return 'same'
}

const variants = {
  forward: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  },
  back: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30 },
  },
  same: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.02 },
  },
}

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const previousPathRef = useRef<string | null>(null)

  // Determine direction based on path change
  const direction = useMemo(() => {
    const dir = getNavigationDirection(previousPathRef.current, pathname)
    return dir
  }, [pathname])

  // Update previous path after render
  useEffect(() => {
    previousPathRef.current = pathname
  }, [pathname])

  const currentVariants = variants[direction]

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={currentVariants.initial}
        animate={currentVariants.animate}
        exit={currentVariants.exit}
        transition={{
          duration: 0.25,
          ease: [0.25, 0.1, 0.25, 1], // Custom ease-out curve
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * Simpler fade-only transition for less jarring navigation
 */
export function FadeTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.2,
          ease: 'easeOut',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
