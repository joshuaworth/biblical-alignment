'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useBookmarkStore, Bookmark, highlightColors } from '@/stores/bookmarkStore'
import { useHaptics } from '@/hooks/useHaptics'

interface BookmarksListProps {
  searchQuery?: string
  onNavigate?: () => void
}

// Book order for sorting
const bookOrder = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
  'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
  'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah',
  'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel',
  'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
  'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans',
  '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
  'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
  '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews',
  'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
  'Jude', 'Revelation',
]

function getBookIndex(book: string): number {
  const index = bookOrder.findIndex(b => b.toLowerCase() === book.toLowerCase())
  return index >= 0 ? index : 999
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

function getBookSlug(bookName: string): string {
  return bookName.toLowerCase().replace(/\s+/g, '-')
}

export function BookmarksList({ searchQuery = '', onNavigate }: BookmarksListProps) {
  const { bookmarks, removeBookmark, searchBookmarks } = useBookmarkStore()
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const haptics = useHaptics()

  // Filter and group bookmarks
  const groupedBookmarks = useMemo(() => {
    const filtered = searchQuery
      ? searchBookmarks(searchQuery)
      : bookmarks

    // Sort by book order, then chapter, then verse
    const sorted = [...filtered].sort((a, b) => {
      const bookDiff = getBookIndex(a.book) - getBookIndex(b.book)
      if (bookDiff !== 0) return bookDiff
      const chapterDiff = a.chapter - b.chapter
      if (chapterDiff !== 0) return chapterDiff
      return a.verse - b.verse
    })

    // Group by book
    const groups: Record<string, Bookmark[]> = {}
    sorted.forEach((bookmark) => {
      if (!groups[bookmark.book]) {
        groups[bookmark.book] = []
      }
      groups[bookmark.book].push(bookmark)
    })

    return groups
  }, [bookmarks, searchQuery, searchBookmarks])

  const handleDelete = (id: string) => {
    haptics.light()
    if (deleteConfirm === id) {
      removeBookmark(id)
      setDeleteConfirm(null)
      haptics.success()
    } else {
      setDeleteConfirm(id)
      // Reset after 3 seconds
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  const bookNames = Object.keys(groupedBookmarks)

  if (bookNames.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-400"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--theme-text)' }}>
          {searchQuery ? 'No bookmarks found' : 'No bookmarks yet'}
        </h3>
        <p className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
          {searchQuery
            ? 'Try a different search term'
            : 'Tap the bookmark icon on any verse to save it here'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {bookNames.map((bookName) => (
        <div key={bookName}>
          {/* Book header */}
          <h3
            className="text-sm font-semibold uppercase tracking-wider mb-3 px-1"
            style={{ color: 'var(--theme-text-secondary)' }}
          >
            {bookName}
          </h3>

          {/* Bookmarks */}
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {groupedBookmarks[bookName].map((bookmark) => (
                <motion.div
                  key={bookmark.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.2 }}
                  className="group relative"
                >
                  <Link
                    href={`/read/${getBookSlug(bookmark.book)}/${bookmark.chapter}#verse-${bookmark.verse}`}
                    onClick={onNavigate}
                    className={`
                      block rounded-xl p-4 transition-all duration-200
                      hover:shadow-md active:scale-[0.99]
                      ${bookmark.color
                        ? highlightColors[bookmark.color].bg
                        : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                    style={{
                      borderLeft: bookmark.color
                        ? `4px solid var(--highlight-${bookmark.color})`
                        : '4px solid var(--theme-border)',
                    }}
                  >
                    {/* Reference and date */}
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="font-semibold text-sm"
                        style={{ color: 'var(--theme-text)' }}
                      >
                        {bookmark.book} {bookmark.chapter}:{bookmark.verse}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: 'var(--theme-text-secondary)' }}
                      >
                        {formatDate(bookmark.createdAt)}
                      </span>
                    </div>

                    {/* Verse text */}
                    <p
                      className="text-sm line-clamp-2"
                      style={{ color: 'var(--theme-text-secondary)' }}
                    >
                      {bookmark.text}
                    </p>

                    {/* Note if present */}
                    {bookmark.note && (
                      <p
                        className="text-xs mt-2 italic line-clamp-1"
                        style={{ color: 'var(--theme-text-tertiary)' }}
                      >
                        Note: {bookmark.note}
                      </p>
                    )}
                  </Link>

                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleDelete(bookmark.id)
                    }}
                    className={`
                      absolute right-2 top-2 w-8 h-8 rounded-full
                      flex items-center justify-center transition-all duration-200
                      opacity-0 group-hover:opacity-100 focus:opacity-100
                      ${deleteConfirm === bookmark.id
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500'
                      }
                    `}
                    aria-label={deleteConfirm === bookmark.id ? 'Confirm delete' : 'Delete bookmark'}
                  >
                    {deleteConfirm === bookmark.id ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    )}
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  )
}
