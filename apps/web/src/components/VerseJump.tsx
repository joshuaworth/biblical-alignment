'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface VerseJumpProps {
  maxVerse: number
  onJump: (verseNumber: number) => void
  onClose: () => void
  anchorPosition?: { x: number; y: number }
}

export function VerseJump({ maxVerse, onJump, onClose, anchorPosition }: VerseJumpProps) {
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = useCallback(() => {
    const verseNum = parseInt(inputValue, 10)
    if (verseNum >= 1 && verseNum <= maxVerse) {
      onJump(verseNum)
      onClose()
    } else {
      setError(true)
      setTimeout(() => setError(false), 500)
    }
  }, [inputValue, maxVerse, onJump, onClose])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setInputValue(value)
    setError(false)
  }

  return (
    <div
      className="verse-jump-container fixed z-50"
      style={anchorPosition ? { left: anchorPosition.x, top: anchorPosition.y } : {}}
    >
      <div
        className={`
          verse-jump-input-wrapper
          flex items-center gap-2 px-3 py-2
          theme-surface rounded-lg shadow-lg border theme-border
          animate-scale-in
          ${error ? 'animate-shake border-red-500' : ''}
        `}
      >
        <span className="text-xs theme-text-muted font-medium">Go to verse</span>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={onClose}
          placeholder={`1-${maxVerse}`}
          className="
            w-16 px-2 py-1 text-sm text-center
            theme-input rounded-md border
            focus:outline-none focus:ring-2 focus:ring-amber-500/50
          "
          aria-label={`Enter verse number between 1 and ${maxVerse}`}
        />
      </div>
    </div>
  )
}
