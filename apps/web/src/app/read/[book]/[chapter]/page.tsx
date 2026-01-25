/**
 * 📖 Scripture Reader Page
 * The main reading experience - displays verses for a chapter
 */

import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  slugToBook,
  bookToSlug,
  getChapter,
  getPreviousChapter,
  getNextChapter,
  getBibleIndex,
} from '@/lib/bible'
import { NavBar } from '@/components/NavBar'
import { ChapterReader } from '@/components/ChapterReader'
import { SwipeableChapter } from '@/components/SwipeableChapter'
import { ReadingProgress } from '@/components/ReadingProgress'
import { ChapterHeader } from '@/components/ChapterHeader'

interface PageProps {
  params: Promise<{ book: string; chapter: string }>
}

export function generateStaticParams() {
  const index = getBibleIndex()
  const params: { book: string; chapter: string }[] = []

  for (const book of index.books) {
    for (let ch = 1; ch <= book.chapters; ch++) {
      params.push({
        book: bookToSlug(book.name),
        chapter: ch.toString(),
      })
    }
  }

  return params
}

export async function generateMetadata({ params }: PageProps) {
  const { book: bookSlug, chapter: chapterStr } = await params
  const book = slugToBook(bookSlug)
  const chapter = parseInt(chapterStr)

  if (!book || isNaN(chapter)) {
    return { title: 'Not Found | Biblical Alignment' }
  }

  return {
    title: `${book.name} ${chapter} | Biblical Alignment`,
    description: `Read ${book.name} chapter ${chapter} from the Berean Standard Bible.`,
  }
}

export default async function ChapterPage({ params }: PageProps) {
  const { book: bookSlug, chapter: chapterStr } = await params
  const book = slugToBook(bookSlug)
  const chapterNum = parseInt(chapterStr)

  if (!book || isNaN(chapterNum) || chapterNum < 1 || chapterNum > book.chapters) {
    notFound()
  }

  const verses = getChapter(book.abbr, chapterNum)

  if (!verses) {
    notFound()
  }

  const prevChapter = getPreviousChapter(book.abbr, chapterNum)
  const nextChapter = getNextChapter(book.abbr, chapterNum)

  // Build navigation URLs for swipe gestures
  const prevUrl = prevChapter
    ? `/read/${bookToSlug(prevChapter.book.name)}/${prevChapter.chapter}`
    : null
  const nextUrl = nextChapter
    ? `/read/${bookToSlug(nextChapter.book.name)}/${nextChapter.chapter}`
    : null

  return (
    <SwipeableChapter prevUrl={prevUrl} nextUrl={nextUrl}>
    <main id="main-content" className="min-h-screen theme-bg">
      {/* 🔝 Navigation */}
      <NavBar />

      {/* 📊 Reading Progress (Mobile Only) */}
      <ReadingProgress
        bookName={book.name}
        currentChapter={chapterNum}
        totalChapters={book.chapters}
      />

      {/* 📖 Scripture Content */}
      <article className="pt-24 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link
              href="/read"
              className="theme-text-muted hover:text-amber-600"
            >
              Bible
            </Link>
            <span className="theme-text-muted">›</span>
            <Link
              href={`/read/${bookToSlug(book.name)}`}
              className="theme-text-muted hover:text-amber-600"
            >
              {book.name}
            </Link>
            <span className="theme-text-muted">›</span>
            <span className="theme-text">Chapter {chapterNum}</span>
          </div>

          {/* Chapter Header - Clickable for quick chapter navigation */}
          <ChapterHeader
            bookName={book.name}
            bookSlug={bookSlug}
            chapterNum={chapterNum}
            totalChapters={book.chapters}
          />

          {/* 🎧 Audio + 📜 Scripture */}
          <ChapterReader
            verses={verses}
            bookName={book.name}
            bookSlug={bookSlug}
            chapterNum={chapterNum}
          />

          {/* ⏮️ ⏭️ Navigation */}
          <div className="mt-8 flex items-center justify-between">
            {prevChapter ? (
              <Link
                href={`/read/${bookToSlug(prevChapter.book.name)}/${prevChapter.chapter}`}
                className="flex items-center gap-2 px-4 py-2 theme-surface border theme-border rounded-lg theme-text hover:border-amber-400 transition-colors"
              >
                <span>←</span>
                <span className="hidden sm:inline">
                  {prevChapter.book.name} {prevChapter.chapter}
                </span>
                <span className="sm:hidden">Prev</span>
              </Link>
            ) : (
              <div />
            )}

            <Link
              href={`/read/${bookToSlug(book.name)}`}
              className="px-4 py-2 theme-text-muted hover:text-amber-600 transition-colors"
            >
              All Chapters
            </Link>

            {nextChapter ? (
              <Link
                href={`/read/${bookToSlug(nextChapter.book.name)}/${nextChapter.chapter}`}
                className="flex items-center gap-2 px-4 py-2 theme-surface border theme-border rounded-lg theme-text hover:border-amber-400 transition-colors"
              >
                <span className="hidden sm:inline">
                  {nextChapter.book.name} {nextChapter.chapter}
                </span>
                <span className="sm:hidden">Next</span>
                <span>→</span>
              </Link>
            ) : (
              <div />
            )}
          </div>

          {/* 📜 Attribution Footer */}
          <footer className="mt-16 pt-8 border-t theme-border text-center">
            <p className="theme-text-muted text-sm">
              Berean Standard Bible · Public Domain
            </p>
          </footer>
        </div>
      </article>
    </main>
    </SwipeableChapter>
  )
}
