/**
 * 📖 Book Selector Page
 * Browse all 66 books of the Bible
 */

import Link from 'next/link'
import { getBooksByTestament, bookToSlug } from '@/lib/bible'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { ContinueReading } from '@/components/ContinueReading'

export const metadata = {
  title: 'Read the Bible | Biblical Alignment',
  description: 'Browse and read all 66 books of the Berean Standard Bible. Old and New Testament.',
}

export default function ReadPage() {
  const { OT, NT } = getBooksByTestament()

  return (
    <main id="main-content" className="min-h-screen theme-bg">
      {/* 🔝 Navigation */}
      <NavBar />

      {/* 📚 Book Grid */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold theme-text mb-4">
              Read the Bible
            </h1>
            <p className="theme-text-muted text-lg">
              Berean Standard Bible · 66 Books · Public Domain
            </p>
          </div>

          {/* 📖 Continue Reading */}
          <ContinueReading className="mb-12" />

          {/* 📜 Old Testament */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">📜</span>
              <h2 className="text-2xl font-bold theme-text">
                Old Testament
              </h2>
              <span className="theme-text-muted text-sm">
                39 Books
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {OT.map(book => (
                <Link
                  key={book.abbr}
                  href={`/read/${bookToSlug(book.name)}`}
                  className="group p-4 theme-surface rounded-xl border theme-border hover:border-amber-400 hover:shadow-md transition-all"
                >
                  <div className="theme-text font-medium group-hover:text-amber-600 transition-colors">
                    {book.name}
                  </div>
                  <div className="theme-text-muted text-sm mt-1">
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
              <h2 className="text-2xl font-bold theme-text">
                New Testament
              </h2>
              <span className="theme-text-muted text-sm">
                27 Books
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {NT.map(book => (
                <Link
                  key={book.abbr}
                  href={`/read/${bookToSlug(book.name)}`}
                  className="group p-4 theme-surface rounded-xl border theme-border hover:border-amber-400 hover:shadow-md transition-all"
                >
                  <div className="theme-text font-medium group-hover:text-amber-600 transition-colors">
                    {book.name}
                  </div>
                  <div className="theme-text-muted text-sm mt-1">
                    {book.chapters} {book.chapters === 1 ? 'chapter' : 'chapters'}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* 📜 Attribution */}
          <div className="mt-16 text-center">
            <p className="theme-text-muted text-sm max-w-2xl mx-auto">
              The Holy Bible, Berean Standard Bible, BSB is produced in cooperation with
              Bible Hub, Discovery Bible, OpenBible.com, and the Berean Bible Translation Committee.
              This text of God's Word has been dedicated to the public domain.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
