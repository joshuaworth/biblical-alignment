/**
 * 📖 Book Selector Page
 * Browse all 66 books of the Bible
 */

import Link from 'next/link'
import { getBooksByTestament, bookToSlug } from '@/lib/bible'

export const metadata = {
  title: 'Read the Bible | Biblical Alignment',
  description: 'Browse and read all 66 books of the Berean Standard Bible. Old and New Testament.',
}

export default function ReadPage() {
  const { OT, NT } = getBooksByTestament()

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

      {/* 📚 Book Grid */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-stone-900 dark:text-white mb-4">
              Read the Bible
            </h1>
            <p className="text-stone-600 dark:text-stone-300 text-lg">
              Berean Standard Bible · 66 Books · Public Domain
            </p>
          </div>

          {/* 📜 Old Testament */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">📜</span>
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white">
                Old Testament
              </h2>
              <span className="text-stone-500 dark:text-stone-400 text-sm">
                39 Books
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {OT.map(book => (
                <Link
                  key={book.abbr}
                  href={`/read/${bookToSlug(book.name)}`}
                  className="group p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-stone-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md transition-all"
                >
                  <div className="text-stone-900 dark:text-white font-medium group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {book.name}
                  </div>
                  <div className="text-stone-400 dark:text-stone-500 text-sm mt-1">
                    {book.chapters} {book.chapters === 1 ? 'chapter' : 'chapters'}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ✝️ New Testament */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">✝️</span>
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white">
                New Testament
              </h2>
              <span className="text-stone-500 dark:text-stone-400 text-sm">
                27 Books
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {NT.map(book => (
                <Link
                  key={book.abbr}
                  href={`/read/${bookToSlug(book.name)}`}
                  className="group p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-stone-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md transition-all"
                >
                  <div className="text-stone-900 dark:text-white font-medium group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {book.name}
                  </div>
                  <div className="text-stone-400 dark:text-stone-500 text-sm mt-1">
                    {book.chapters} {book.chapters === 1 ? 'chapter' : 'chapters'}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* 📜 Attribution */}
          <div className="mt-16 text-center">
            <p className="text-stone-400 dark:text-stone-500 text-sm max-w-2xl mx-auto">
              The Holy Bible, Berean Standard Bible, BSB is produced in cooperation with
              Bible Hub, Discovery Bible, OpenBible.com, and the Berean Bible Translation Committee.
              This text of God's Word has been dedicated to the public domain.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
