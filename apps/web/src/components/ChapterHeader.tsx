'use client'

/**
 * 📖 Clickable Chapter Header
 * Displays the book name and chapter number with a clickable chapter picker trigger
 */

import { useState } from 'react'
import { ChapterPicker } from './ChapterPicker'

interface ChapterHeaderProps {
  bookName: string
  bookSlug: string
  chapterNum: number
  totalChapters: number
}

export function ChapterHeader({
  bookName,
  bookSlug,
  chapterNum,
  totalChapters,
}: ChapterHeaderProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  return (
    <>
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold theme-text mb-2">
          {bookName}
        </h1>
        <button
          onClick={() => setIsPickerOpen(true)}
          className="group inline-flex items-center gap-2 text-2xl text-amber-600 font-medium hover:text-amber-700 transition-colors cursor-pointer"
          aria-label={`Open chapter picker. Currently on chapter ${chapterNum} of ${totalChapters}`}
        >
          <span>Chapter {chapterNum}</span>
          <ChevronDownIcon className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
        </button>
      </header>

      <ChapterPicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        bookName={bookName}
        bookSlug={bookSlug}
        totalChapters={totalChapters}
        currentChapter={chapterNum}
      />
    </>
  )
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}
