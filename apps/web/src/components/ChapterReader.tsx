'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { AudioControls } from './AudioControls'
import { FloatingActionButton } from './FloatingActionButton'
import { VerseContextMenu } from './VerseContextMenu'
import { VerseNumbers } from './VerseNumbers'
import { VerseJump } from './VerseJump'
import { DistractionFreeMode } from './DistractionFreeMode'
import { NoteEditor } from './NoteEditor'
import { NoteIndicator } from './NoteIndicator'
import { useSpeech } from '@/hooks/useSpeech'
import { useReadingPosition } from '@/hooks/useReadingPosition'
import { useDistractionFree } from '@/hooks/useDistractionFree'
import { useNotesStore, Note } from '@/stores/notesStore'

interface Verse {
  verse: number
  text: string
}

interface ChapterReaderProps {
  verses: Verse[]
  bookName: string
  bookSlug: string
  chapterNum: number
}

export function ChapterReader({ verses, bookName, bookSlug, chapterNum }: ChapterReaderProps) {
  const [currentVerse, setCurrentVerse] = useState<number | null>(null)
  const [highlightedVerse, setHighlightedVerse] = useState<number | null>(null)
  const [showVerseJump, setShowVerseJump] = useState(false)
  const [jumpPosition, setJumpPosition] = useState<{ x: number; y: number } | undefined>()
  const [noteEditorOpen, setNoteEditorOpen] = useState(false)
  const [noteEditorVerse, setNoteEditorVerse] = useState<number | undefined>()
  const [editingNote, setEditingNote] = useState<Note | undefined>()
  const contentRef = useRef<HTMLDivElement>(null)

  // Speech hook for FAB
  const speech = useSpeech(verses)

  // Reading position memory - saves/restores scroll position
  useReadingPosition(bookSlug, chapterNum)

  // Distraction-free mode
  const distractionFree = useDistractionFree()

  // Notes store
  const { getNotesForVerse, hasNoteForVerse } = useNotesStore()

  // Reset highlight when chapter changes
  useEffect(() => {
    setCurrentVerse(null)
    setHighlightedVerse(null)
  }, [bookName, chapterNum])

  const handleVerseChange = (verseNumber: number) => {
    setCurrentVerse(verseNumber)

    // Scroll the verse into view
    const verseEl = document.getElementById(`verse-${verseNumber}`)
    if (verseEl) {
      verseEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const handleJumpToVerse = useCallback((verseNumber: number) => {
    const verseEl = document.getElementById(`verse-${verseNumber}`)
    if (verseEl) {
      verseEl.scrollIntoView({ behavior: 'smooth', block: 'center' })

      // Trigger golden pulse highlight
      setHighlightedVerse(verseNumber)
      setTimeout(() => {
        setHighlightedVerse(null)
      }, 1500)
    }
  }, [])

  const handleGutterClick = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setJumpPosition({ x: rect.left + rect.width / 2, y: rect.top })
    setShowVerseJump(true)
  }, [])

  // Handle bookmark from context menu
  const handleVerseBookmark = useCallback((verseData: { verse: number; text: string; bookName: string; chapter: number }) => {
    console.log('Bookmarking verse:', verseData)
    // TODO: Implement actual bookmark functionality
  }, [])

  // Handle add note from context menu
  const handleAddNote = useCallback((verseData: { verse: number; text: string; bookName: string; chapter: number }) => {
    const existingNotes = getNotesForVerse(bookName, chapterNum, verseData.verse)
    if (existingNotes.length > 0) {
      setEditingNote(existingNotes[0])
    } else {
      setEditingNote(undefined)
    }
    setNoteEditorVerse(verseData.verse)
    setNoteEditorOpen(true)
  }, [bookName, chapterNum, getNotesForVerse])

  // Handle editing an existing note from indicator
  const handleEditNote = useCallback((note: Note) => {
    setEditingNote(note)
    setNoteEditorVerse(note.verse)
    setNoteEditorOpen(true)
  }, [])

  // Close note editor
  const handleCloseNoteEditor = useCallback(() => {
    setNoteEditorOpen(false)
    setEditingNote(undefined)
    setNoteEditorVerse(undefined)
  }, [])

  return (
    <>
      {/* Audio Controls */}
      <div className="flex justify-center mb-8">
        <AudioControls verses={verses} onVerseChange={handleVerseChange} />
      </div>

      {/* Scripture Text with Verse Number Gutter */}
      <div className="theme-surface rounded-2xl border theme-border shadow-sm overflow-hidden">
        <div className="chapter-reader-layout" ref={contentRef}>
          {/* Verse Numbers Gutter */}
          <div
            className="verse-gutter sticky left-0 top-0 select-none cursor-pointer"
            onClick={handleGutterClick}
            title="Click to jump to verse"
          >
            {verses.map(verse => (
              <div
                key={verse.verse}
                className="verse-gutter-item"
                data-verse={verse.verse}
              >
                <span className="verse-gutter-number">{verse.verse}</span>
              </div>
            ))}
          </div>

          {/* Scripture Content */}
          <div className="scripture-content p-8 md:p-12 md:pl-0">
            <div className="scripture-text theme-text">
              {verses.map(verse => (
                <span
                  key={verse.verse}
                  id={`verse-${verse.verse}`}
                  className={`verse-wrapper transition-all duration-300 ${
                    currentVerse === verse.verse
                      ? 'bg-amber-200/50 dark:bg-amber-900/30 rounded px-1 -mx-1'
                      : ''
                  } ${
                    highlightedVerse === verse.verse
                      ? 'verse-jump-highlight'
                      : ''
                  }`}
                >
                  <VerseContextMenu
                    verseData={{
                      verse: verse.verse,
                      text: verse.text,
                      bookName,
                      chapter: chapterNum,
                    }}
                    onBookmark={handleVerseBookmark}
                    onAddNote={handleAddNote}
                    isHighlighted={currentVerse === verse.verse}
                  >
                    <span className="verse-text">{verse.text}</span>
                    {hasNoteForVerse(bookName, chapterNum, verse.verse) && (
                      <NoteIndicator
                        book={bookName}
                        chapter={chapterNum}
                        verse={verse.verse}
                        onEditNote={handleEditNote}
                      />
                    )}
                    {' '}
                  </VerseContextMenu>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Verse Jump Input */}
      {showVerseJump && (
        <VerseJump
          maxVerse={verses.length}
          onJump={handleJumpToVerse}
          onClose={() => setShowVerseJump(false)}
          anchorPosition={jumpPosition}
        />
      )}

      {/* Floating Action Button (Mobile) */}
      <FloatingActionButton
        onListen={() => {
          if (speech.isPlaying) {
            speech.stop()
          } else {
            speech.play()
          }
        }}
        onBookmark={() => {
          // TODO: Implement bookmark functionality
          console.log('Bookmark clicked')
        }}
        onFocus={distractionFree.enter}
        bookName={bookName}
        chapter={chapterNum}
      />

      {/* Distraction-Free Mode Overlay */}
      <DistractionFreeMode
        isActive={distractionFree.isDistractionFree}
        onExit={distractionFree.exit}
      >
        {verses.map(verse => (
          <span key={verse.verse} className="verse-wrapper">
            <sup className="verse-number-inline opacity-40 mr-1">{verse.verse}</sup>
            <span className="verse-text">{verse.text} </span>
          </span>
        ))}
      </DistractionFreeMode>

      {/* Note Editor Modal */}
      <NoteEditor
        isOpen={noteEditorOpen}
        onClose={handleCloseNoteEditor}
        book={bookName}
        chapter={chapterNum}
        verse={noteEditorVerse}
        existingNote={editingNote}
      />
    </>
  )
}
