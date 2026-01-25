'use client'

/**
 * 👆 Swipeable Chapter Wrapper
 * Adds swipe gesture navigation for mobile readers
 * Swipe LEFT = next chapter, Swipe RIGHT = previous chapter
 */

import { useRouter } from 'next/navigation'
import { useSwipeable } from 'react-swipeable'
import { ReactNode } from 'react'

interface SwipeableChapterProps {
  children: ReactNode
  prevUrl: string | null
  nextUrl: string | null
}

export function SwipeableChapter({ children, prevUrl, nextUrl }: SwipeableChapterProps) {
  const router = useRouter()

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      // Swipe left = go to next chapter
      if (nextUrl) {
        router.push(nextUrl)
      }
    },
    onSwipedRight: () => {
      // Swipe right = go to previous chapter
      if (prevUrl) {
        router.push(prevUrl)
      }
    },
    trackMouse: false, // Only track touch, not mouse drags
    trackTouch: true,
    delta: 50, // Minimum swipe distance in pixels
    preventScrollOnSwipe: false, // Allow normal scrolling
    swipeDuration: 500, // Max time for a swipe gesture
  })

  return (
    <div {...handlers} className="min-h-screen">
      {children}
    </div>
  )
}
