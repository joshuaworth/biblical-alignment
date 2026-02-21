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
import { ChapterReader } from '@/components/ChapterReader'
import { SwipeableChapter } from '@/components/SwipeableChapter'
import { CompactChapterNav } from '@/components/CompactChapterNav'
import { BreadcrumbStructuredData, ChapterStructuredData } from '@/components/StructuredData'

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

  // Get first verse for description preview
  const verses = getChapter(book.abbr, chapter)
  const firstVerse = verses?.[0]?.text || ''
  const description = firstVerse
    ? `${book.name} ${chapter} (BSB): "${firstVerse.slice(0, 140)}${firstVerse.length > 140 ? '...' : ''}"`
    : `Read ${book.name} chapter ${chapter} from the Berean Standard Bible.`

  const url = `https://biblicalalignment.org/read/${bookSlug}/${chapter}`

  return {
    title: `${book.name} ${chapter} (BSB) | Biblical Alignment`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${book.name} ${chapter} | Berean Standard Bible`,
      description,
      url,
      type: 'article',
    },
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
    <BreadcrumbStructuredData bookName={book.name} bookSlug={bookSlug} chapter={chapterNum} />
    <ChapterStructuredData
      bookName={book.name}
      bookSlug={bookSlug}
      chapter={chapterNum}
      firstVerseText={verses[0]?.text || ''}
    />
    <main id="main-content" className="min-h-screen theme-bg">
      {/* Compact Navigation Header */}
      <CompactChapterNav
        bookName={book.name}
        bookSlug={bookSlug}
        chapterNum={chapterNum}
        totalChapters={book.chapters}
        prevUrl={prevUrl}
        nextUrl={nextUrl}
      />

      {/* 📖 Scripture Content */}
      <article className="pt-20 pb-24 px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          {/* 📜 Scripture */}
          <ChapterReader
            verses={verses}
            bookName={book.name}
            bookSlug={bookSlug}
            chapterNum={chapterNum}
          />

          {/* 📜 Attribution Footer */}
          <footer className="mt-12 pt-6 border-t theme-border text-center">
            <p className="theme-text-muted text-xs">
              Berean Standard Bible · Public Domain
            </p>
          </footer>
        </div>
      </article>
    </main>
    </SwipeableChapter>
  )
}
