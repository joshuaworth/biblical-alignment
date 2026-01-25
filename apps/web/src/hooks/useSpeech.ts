'use client'

import { useState, useCallback, useEffect, useRef } from 'react'

interface Verse {
  verse: number
  text: string
}

interface UseSpeechOptions {
  rate?: number // 0.5 - 2
  pitch?: number // 0 - 2
  onVerseChange?: (verseNumber: number) => void
}

interface UseSpeechReturn {
  isPlaying: boolean
  isPaused: boolean
  currentVerse: number | null
  play: () => void
  pause: () => void
  resume: () => void
  stop: () => void
  isSupported: boolean
}

export function useSpeech(
  verses: Verse[],
  options: UseSpeechOptions = {}
): UseSpeechReturn {
  const { rate = 1, pitch = 1, onVerseChange } = options

  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentVerse, setCurrentVerse] = useState<number | null>(null)
  const [isSupported, setIsSupported] = useState(false)

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const verseIndexRef = useRef(0)

  // Check for browser support
  useEffect(() => {
    setIsSupported(typeof window !== 'undefined' && 'speechSynthesis' in window)
  }, [])

  const speakVerse = useCallback((index: number) => {
    if (!isSupported || index >= verses.length) {
      setIsPlaying(false)
      setCurrentVerse(null)
      return
    }

    const verse = verses[index]
    const utterance = new SpeechSynthesisUtterance(verse.text)

    utterance.rate = rate
    utterance.pitch = pitch

    // Try to use a good voice
    const voices = speechSynthesis.getVoices()
    const preferredVoice = voices.find(
      v => v.name.includes('Samantha') || v.name.includes('Daniel') || v.lang.startsWith('en')
    )
    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    utterance.onstart = () => {
      setCurrentVerse(verse.verse)
      onVerseChange?.(verse.verse)
    }

    utterance.onend = () => {
      verseIndexRef.current = index + 1
      speakVerse(index + 1)
    }

    utterance.onerror = (event) => {
      // Ignore expected errors when user stops/cancels speech
      if (event.error !== 'canceled' && event.error !== 'interrupted') {
        console.error('Speech error:', event.error)
      }
      setIsPlaying(false)
    }

    utteranceRef.current = utterance
    speechSynthesis.speak(utterance)
  }, [isSupported, verses, rate, pitch, onVerseChange])

  const play = useCallback(() => {
    if (!isSupported) return

    speechSynthesis.cancel()
    verseIndexRef.current = 0
    setIsPlaying(true)
    setIsPaused(false)

    // Wait for voices to load on first use
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.onvoiceschanged = () => {
        speakVerse(0)
      }
    } else {
      speakVerse(0)
    }
  }, [isSupported, speakVerse])

  const pause = useCallback(() => {
    if (!isSupported) return
    speechSynthesis.pause()
    setIsPaused(true)
  }, [isSupported])

  const resume = useCallback(() => {
    if (!isSupported) return
    speechSynthesis.resume()
    setIsPaused(false)
  }, [isSupported])

  const stop = useCallback(() => {
    if (!isSupported) return
    speechSynthesis.cancel()
    setIsPlaying(false)
    setIsPaused(false)
    setCurrentVerse(null)
    verseIndexRef.current = 0
  }, [isSupported])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      speechSynthesis.cancel()
    }
  }, [])

  return {
    isPlaying,
    isPaused,
    currentVerse,
    play,
    pause,
    resume,
    stop,
    isSupported,
  }
}
