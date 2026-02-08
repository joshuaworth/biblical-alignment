'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { FloatingActionButton } from './FloatingActionButton'
import { VerseContextMenu } from './VerseContextMenu'
import { DistractionFreeMode } from './DistractionFreeMode'
import { NoteEditor } from './NoteEditor'
import { NoteIndicator } from './NoteIndicator'
import { useSpeech } from '@/hooks/useSpeech'
import { useReadingPosition } from '@/hooks/useReadingPosition'
import { useDistractionFree } from '@/hooks/useDistractionFree'
import { useNotesStore, Note } from '@/stores/notesStore'
import { useBookmarkStore } from '@/stores/bookmarkStore'
import { CrossReferencePanel } from './CrossReferencePanel'

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
  const [noteEditorOpen, setNoteEditorOpen] = useState(false)
  const [noteEditorVerse, setNoteEditorVerse] = useState<number | undefined>()
  const [editingNote, setEditingNote] = useState<Note | undefined>()
  const [crossRefVerse, setCrossRefVerse] = useState<number | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Speech hook for FAB
  const speech = useSpeech(verses)

  // Reading position memory - saves/restores scroll position
  useReadingPosition(bookSlug, chapterNum)

  // Distraction-free mode
  const distractionFree = useDistractionFree()

  // Notes store
  const { getNotesForVerse, hasNoteForVerse } = useNotesStore()

  // Bookmark store
  const { toggleBookmark } = useBookmarkStore()

  // Reset highlight when chapter changes
  useEffect(() => {
    setCurrentVerse(null)
  }, [bookName, chapterNum])

  // Handle bookmark from context menu
  const handleVerseBookmark = useCallback((verseData: { verse: number; text: string; bookName: string; chapter: number }) => {
    toggleBookmark({
      book: verseData.bookName,
      chapter: verseData.chapter,
      verse: verseData.verse,
      text: verseData.text,
    })
  }, [toggleBookmark])

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

  // Handle cross-reference request from context menu
  const handleCrossRef = useCallback((verseData: { verse: number }) => {
    setCrossRefVerse(crossRefVerse === verseData.verse ? null : verseData.verse)
  }, [crossRefVerse])

  return (
    <>
      {/* Scripture Text */}
      <div className="scripture-container" ref={contentRef}>
          <div className="scripture-content">
            <div className="scripture-text theme-text">
              {verses.map(verse => (
                <span
                  key={verse.verse}
                  id={`verse-${verse.verse}`}
                  className={`verse-wrapper transition-all duration-300 ${
                    currentVerse === verse.verse
                      ? 'bg-amber-200/50 dark:bg-amber-900/30 rounded px-1 -mx-1'
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
                    onCrossRef={handleCrossRef}
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
                  {crossRefVerse === verse.verse && (
                    <CrossReferencePanel
                      bookSlug={bookSlug}
                      bookName={bookName}
                      chapter={chapterNum}
                      verse={verse.verse}
                      onClose={() => setCrossRefVerse(null)}
                    />
                  )}
                </span>
              ))}
            </div>
          </div>
      </div>

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
          if (currentVerse) {
            const verse = verses.find(v => v.verse === currentVerse)
            if (verse) {
              toggleBookmark({
                book: bookName,
                chapter: chapterNum,
                verse: verse.verse,
                text: verse.text,
              })
            }
          }
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
