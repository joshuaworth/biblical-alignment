'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type HighlightColor = 'yellow' | 'green' | 'blue' | 'pink' | 'orange' | null

export interface Bookmark {
  id: string
  book: string
  chapter: number
  verse: number
  text: string
  createdAt: string
  color?: HighlightColor
  note?: string
}

interface BookmarkState {
  bookmarks: Bookmark[]
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => string
  removeBookmark: (id: string) => void
  updateBookmark: (id: string, updates: Partial<Pick<Bookmark, 'color' | 'note'>>) => void
  getBookmarksForChapter: (book: string, chapter: number) => Bookmark[]
  getBookmarkForVerse: (book: string, chapter: number, verse: number) => Bookmark | undefined
  isVerseBookmarked: (book: string, chapter: number, verse: number) => boolean
  toggleBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => boolean
  setHighlightColor: (book: string, chapter: number, verse: number, color: HighlightColor) => void
  getHighlightColor: (book: string, chapter: number, verse: number) => HighlightColor
  searchBookmarks: (query: string) => Bookmark[]
  exportBookmarks: () => string
}

function generateId(): string {
  return `bm_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],

      addBookmark: (bookmarkData) => {
        const id = generateId()
        const newBookmark: Bookmark = {
          ...bookmarkData,
          id,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          bookmarks: [...state.bookmarks, newBookmark],
        }))
        return id
      },

      removeBookmark: (id) => {
        set((state) => ({
          bookmarks: state.bookmarks.filter((bm) => bm.id !== id),
        }))
      },

      updateBookmark: (id, updates) => {
        set((state) => ({
          bookmarks: state.bookmarks.map((bm) =>
            bm.id === id ? { ...bm, ...updates } : bm
          ),
        }))
      },

      getBookmarksForChapter: (book, chapter) => {
        return get().bookmarks.filter(
          (bm) =>
            bm.book.toLowerCase() === book.toLowerCase() &&
            bm.chapter === chapter
        )
      },

      getBookmarkForVerse: (book, chapter, verse) => {
        return get().bookmarks.find(
          (bm) =>
            bm.book.toLowerCase() === book.toLowerCase() &&
            bm.chapter === chapter &&
            bm.verse === verse
        )
      },

      isVerseBookmarked: (book, chapter, verse) => {
        return get().bookmarks.some(
          (bm) =>
            bm.book.toLowerCase() === book.toLowerCase() &&
            bm.chapter === chapter &&
            bm.verse === verse
        )
      },

      toggleBookmark: (bookmarkData) => {
        const existing = get().getBookmarkForVerse(
          bookmarkData.book,
          bookmarkData.chapter,
          bookmarkData.verse
        )
        if (existing) {
          get().removeBookmark(existing.id)
          return false // Removed
        } else {
          get().addBookmark(bookmarkData)
          return true // Added
        }
      },

      setHighlightColor: (book, chapter, verse, color) => {
        const bookmark = get().getBookmarkForVerse(book, chapter, verse)
        if (bookmark) {
          if (color === null) {
            // Remove highlight but keep bookmark
            get().updateBookmark(bookmark.id, { color: null })
          } else {
            get().updateBookmark(bookmark.id, { color })
          }
        }
      },

      getHighlightColor: (book, chapter, verse) => {
        const bookmark = get().getBookmarkForVerse(book, chapter, verse)
        return bookmark?.color || null
      },

      searchBookmarks: (query) => {
        const lowerQuery = query.toLowerCase()
        return get().bookmarks.filter(
          (bm) =>
            bm.text.toLowerCase().includes(lowerQuery) ||
            bm.book.toLowerCase().includes(lowerQuery) ||
            bm.note?.toLowerCase().includes(lowerQuery)
        )
      },

      exportBookmarks: () => {
        const bookmarks = get().bookmarks
        return JSON.stringify(
          {
            version: 1,
            exportedAt: new Date().toISOString(),
            bookmarks,
          },
          null,
          2
        )
      },
    }),
    {
      name: 'biblical-alignment-bookmarks',
    }
  )
)

// Highlight color CSS classes
export const highlightColors: Record<NonNullable<HighlightColor>, { bg: string; bgHover: string; label: string }> = {
  yellow: {
    bg: 'bg-yellow-200/60 dark:bg-yellow-500/30',
    bgHover: 'hover:bg-yellow-300/80 dark:hover:bg-yellow-500/40',
    label: 'Yellow',
  },
  green: {
    bg: 'bg-green-200/60 dark:bg-green-500/30',
    bgHover: 'hover:bg-green-300/80 dark:hover:bg-green-500/40',
    label: 'Green',
  },
  blue: {
    bg: 'bg-blue-200/60 dark:bg-blue-500/30',
    bgHover: 'hover:bg-blue-300/80 dark:hover:bg-blue-500/40',
    label: 'Blue',
  },
  pink: {
    bg: 'bg-pink-200/60 dark:bg-pink-500/30',
    bgHover: 'hover:bg-pink-300/80 dark:hover:bg-pink-500/40',
    label: 'Pink',
  },
  orange: {
    bg: 'bg-orange-200/60 dark:bg-orange-500/30',
    bgHover: 'hover:bg-orange-300/80 dark:hover:bg-orange-500/40',
    label: 'Orange',
  },
}
