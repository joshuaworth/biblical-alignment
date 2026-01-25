'use client'

import { useState, useCallback } from 'react'
import { VerseJump } from './VerseJump'

interface Verse {
  verse: number
  text: string
}

interface VerseNumbersProps {
  verses: Verse[]
  onJumpToVerse: (verseNumber: number) => void
}

export function VerseNumbers({ verses, onJumpToVerse }: VerseNumbersProps) {
  const [showJump, setShowJump] = useState(false)
  const [jumpPosition, setJumpPosition] = useState<{ x: number; y: number } | undefined>()

  const handleGutterClick = useCallback((e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    setJumpPosition({ x: rect.right + 8, y: rect.top })
    setShowJump(true)
  }, [])

  const handleJump = useCallback((verseNumber: number) => {
    onJumpToVerse(verseNumber)
  }, [onJumpToVerse])

  const handleCloseJump = useCallback(() => {
    setShowJump(false)
  }, [])

  return (
    <>
      <div className="verse-numbers-gutter">
        {verses.map((verse) => (
          <div
            key={verse.verse}
            className="verse-number-item"
            data-verse={verse.verse}
            onClick={handleGutterClick}
          >
            <span className="verse-gutter-number">{verse.verse}</span>
          </div>
        ))}
      </div>

      {showJump && (
        <VerseJump
          maxVerse={verses.length}
          onJump={handleJump}
          onClose={handleCloseJump}
          anchorPosition={jumpPosition}
        />
      )}
    </>
  )
}
