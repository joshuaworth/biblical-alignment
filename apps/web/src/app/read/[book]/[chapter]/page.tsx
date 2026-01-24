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

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 dark:from-slate-950 dark:to-slate-900">
      {/* 🔝 Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-stone-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-2xl">📖</span>
            <span className="font-semibold text-xl tracking-tight text-stone-900 dark:text-white">
              Biblical Alignment
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/read"
              className="text-amber-600 dark:text-amber-400 font-medium"
            >
              Read
            </Link>
            <Link
              href="/search"
              className="text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              Search
            </Link>
            <Link
              href="/about"
              className="text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              About
            </Link>
          </div>
        </div>
      </nav>

      {/* 📖 Scripture Content */}
      <article className="pt-24 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link
              href="/read"
              className="text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400"
            >
              Bible
            </Link>
            <span className="text-stone-400 dark:text-stone-600">›</span>
            <Link
              href={`/read/${bookToSlug(book.name)}`}
              className="text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400"
            >
              {book.name}
            </Link>
            <span className="text-stone-400 dark:text-stone-600">›</span>
            <span className="text-stone-700 dark:text-stone-200">Chapter {chapterNum}</span>
          </div>

          {/* Chapter Header */}
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-stone-900 dark:text-white mb-2">
              {book.name}
            </h1>
            <p className="text-2xl text-amber-600 dark:text-amber-400 font-medium">
              Chapter {chapterNum}
            </p>
          </header>

          {/* 📜 Scripture Text */}
          <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-stone-200 dark:border-slate-800 p-8 md:p-12 shadow-sm">
            <div className="scripture-text text-lg leading-loose text-stone-800 dark:text-stone-100">
              {verses.map(verse => (
                <span key={verse.verse} className="verse-wrapper">
                  <sup className="verse-number text-amber-600 dark:text-amber-400 font-bold text-xs mr-1 select-none">
                    {verse.verse}
                  </sup>
                  <span className="verse-text">{verse.text} </span>
                </span>
              ))}
            </div>
          </div>

          {/* ⏮️ ⏭️ Navigation */}
          <div className="mt-8 flex items-center justify-between">
            {prevChapter ? (
              <Link
                href={`/read/${bookToSlug(prevChapter.book.name)}/${prevChapter.chapter}`}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg text-stone-700 dark:text-stone-200 hover:border-amber-400 dark:hover:border-amber-500 transition-colors"
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
              className="px-4 py-2 text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              All Chapters
            </Link>

            {nextChapter ? (
              <Link
                href={`/read/${bookToSlug(nextChapter.book.name)}/${nextChapter.chapter}`}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg text-stone-700 dark:text-stone-200 hover:border-amber-400 dark:hover:border-amber-500 transition-colors"
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
          <footer className="mt-16 pt-8 border-t border-stone-200 dark:border-slate-800 text-center">
            <p className="text-stone-400 dark:text-stone-500 text-sm">
              Berean Standard Bible · Public Domain
            </p>
          </footer>
        </div>
      </article>
    </main>
  )
}
