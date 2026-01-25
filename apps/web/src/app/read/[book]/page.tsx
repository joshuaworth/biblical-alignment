/**
 * 📚 Chapter Selector Page
 * Select a chapter from the chosen book
 */

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { slugToBook, bookToSlug, getBibleIndex } from '@/lib/bible'
import { NavBar } from '@/components/NavBar'

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
    <main id="main-content" className="min-h-screen theme-bg">
      {/* 🔝 Navigation */}
      <NavBar />

      {/* 📖 Chapter Grid */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-8">
            <Link
              href="/read"
              className="theme-text-muted hover:text-amber-600"
            >
              Bible
            </Link>
            <span className="theme-text-muted">›</span>
            <span className="theme-text">{book.name}</span>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full text-sm font-medium mb-4">
              {book.testament === 'OT' ? '📜 Old Testament' : '✝️ New Testament'}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold theme-text mb-4">
              {book.name}
            </h1>
            <p className="theme-text-muted text-lg">
              {book.chapters} {book.chapters === 1 ? 'Chapter' : 'Chapters'}
            </p>
          </div>

          {/* Chapter Grid */}
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {chapters.map(chapter => (
              <Link
                key={chapter}
                href={`/read/${bookToSlug(book.name)}/${chapter}`}
                className="aspect-square flex items-center justify-center theme-surface rounded-lg border theme-border hover:border-amber-400 theme-text font-medium transition-all hover:shadow-md"
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
