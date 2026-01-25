'use client'

import { useSpeech } from '@/hooks/useSpeech'

interface Verse {
  verse: number
  text: string
}

interface AudioControlsProps {
  verses: Verse[]
  onVerseChange?: (verseNumber: number) => void
}

export function AudioControls({ verses, onVerseChange }: AudioControlsProps) {
  const { isPlaying, isPaused, currentVerse, play, pause, resume, stop, isSupported } = useSpeech(
    verses,
    { onVerseChange }
  )

  if (!isSupported) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      {!isPlaying ? (
        <button
          onClick={play}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
          aria-label="Read chapter aloud"
        >
          <PlayIcon />
          <span className="hidden sm:inline">Listen</span>
        </button>
      ) : (
        <>
          {isPaused ? (
            <button
              onClick={resume}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
              aria-label="Resume reading"
            >
              <PlayIcon />
            </button>
          ) : (
            <button
              onClick={pause}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
              aria-label="Pause reading"
            >
              <PauseIcon />
            </button>
          )}
          <button
            onClick={stop}
            className="flex items-center gap-2 px-3 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded-lg transition-colors"
            aria-label="Stop reading"
          >
            <StopIcon />
          </button>
          {currentVerse && (
            <span className="text-sm text-stone-400 ml-2">
              Verse {currentVerse}
            </span>
          )}
        </>
      )}
    </div>
  )
}

function PlayIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  )
}

function StopIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 6h12v12H6z" />
    </svg>
  )
}
