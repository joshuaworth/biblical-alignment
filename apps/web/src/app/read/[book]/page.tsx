/**
 * 📚 Chapter Selector Page
 * Select a chapter from the chosen book
 */

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { slugToBook, bookToSlug, getBibleIndex } from '@/lib/bible'

interface PageProps {
  params: Promise<{ book: string }>
}

export function generateStaticParams() {
  const index = getBibleIndex()
  return index.books.map(book => ({
    book: bookToSlug(book.name),
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const { book: bookSlug } = await params
  const book = slugToBook(bookSlug)

  if (!book) {
    return { title: 'Book Not Found | Biblical Alignment' }
  }

  return {
    title: `${book.name} | Biblical Alignment`,
    description: `Read ${book.name} from the Berean Standard Bible. ${book.chapters} chapters.`,
  }
}

export default async function BookPage({ params }: PageProps) {
  const { book: bookSlug } = await params
  const book = slugToBook(bookSlug)

  if (!book) {
    notFound()
  }

  // Generate chapter numbers
  const chapters = Array.from({ length: book.chapters }, (_, i) => i + 1)

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

      {/* 📖 Chapter Grid */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-8">
            <Link
              href="/read"
              className="text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400"
            >
              Bible
            </Link>
            <span className="text-stone-400 dark:text-stone-600">›</span>
            <span className="text-stone-700 dark:text-stone-200">{book.name}</span>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full text-sm font-medium mb-4">
              {book.testament === 'OT' ? '📜 Old Testament' : '✝️ New Testament'}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-stone-900 dark:text-white mb-4">
              {book.name}
            </h1>
            <p className="text-stone-600 dark:text-stone-300 text-lg">
              {book.chapters} {book.chapters === 1 ? 'Chapter' : 'Chapters'}
            </p>
          </div>

          {/* Chapter Grid */}
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {chapters.map(chapter => (
              <Link
                key={chapter}
                href={`/read/${bookToSlug(book.name)}/${chapter}`}
                className="aspect-square flex items-center justify-center bg-white dark:bg-slate-800/50 rounded-lg border border-stone-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-stone-700 dark:text-stone-200 font-medium transition-all hover:shadow-md"
              >
                {chapter}
              </Link>
            ))}
          </div>

          {/* Quick Navigation */}
          <div className="mt-12 flex justify-center gap-4">
            <Link
              href={`/read/${bookToSlug(book.name)}/1`}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
            >
              Start at Chapter 1 →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
