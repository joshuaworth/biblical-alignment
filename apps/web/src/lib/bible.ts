/**
 * 📖 Bible Data Utilities
 * Functions to load and navigate BSB data
 */

import { readFileSync } from 'fs'
import { join } from 'path'

// 📚 Types
export interface Verse {
  verse: number
  text: string
}

export interface BookData {
  name: string
  abbr: string
  testament: 'OT' | 'NT'
  chapters: number
  data: Record<string, Verse[]>
}

export interface BookInfo {
  name: string
  abbr: string
  testament: 'OT' | 'NT'
  chapters: number
  file: string
}

export interface BibleIndex {
  translation: string
  name: string
  license: string
  licenseDate: string
  source: string
  attribution: string
  links: {
    homepage: string
    interlinear: string
    literal: string
    standard: string
  }
  books: BookInfo[]
}

// 📂 Path to BSB data
const BSB_DATA_PATH = join(process.cwd(), '../../packages/bible-data/src/data/bsb')

// 🔄 Cache for loaded data
let indexCache: BibleIndex | null = null
const bookCache: Map<string, BookData> = new Map()

/**
 * 📖 Get the Bible index with all books
 */
export function getBibleIndex(): BibleIndex {
  if (indexCache) return indexCache

  const indexPath = join(BSB_DATA_PATH, 'index.json')
  const data = readFileSync(indexPath, 'utf-8')
  indexCache = JSON.parse(data) as BibleIndex
  return indexCache
}

/**
 * 📚 Get all books grouped by testament
 */
export function getBooksByTestament(): { OT: BookInfo[]; NT: BookInfo[] } {
  const index = getBibleIndex()
  return {
    OT: index.books.filter(b => b.testament === 'OT'),
    NT: index.books.filter(b => b.testament === 'NT'),
  }
}

/**
 * 📖 Get a single book's data
 */
export function getBook(abbr: string): BookData | null {
  // Check cache
  const cached = bookCache.get(abbr.toLowerCase())
  if (cached) return cached

  // Find book info
  const index = getBibleIndex()
  const bookInfo = index.books.find(
    b => b.abbr.toLowerCase() === abbr.toLowerCase() ||
         b.name.toLowerCase() === abbr.toLowerCase() ||
         b.name.toLowerCase().replace(/\s+/g, '') === abbr.toLowerCase()
  )

  if (!bookInfo) return null

  // Load book data
  const bookPath = join(BSB_DATA_PATH, bookInfo.file)
  const data = readFileSync(bookPath, 'utf-8')
  const bookData = JSON.parse(data) as BookData

  // Cache it
  bookCache.set(abbr.toLowerCase(), bookData)
  bookCache.set(bookInfo.abbr.toLowerCase(), bookData)
  bookCache.set(bookInfo.name.toLowerCase(), bookData)

  return bookData
}

/**
 * 📜 Get a specific chapter
 */
export function getChapter(bookAbbr: string, chapter: number): Verse[] | null {
  const book = getBook(bookAbbr)
  if (!book) return null

  const chapterData = book.data[chapter.toString()]
  return chapterData || null
}

/**
 * 🔗 Get URL-friendly slug for a book name
 */
export function bookToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-')
}

/**
 * 🔗 Get book from URL slug
 */
export function slugToBook(slug: string): BookInfo | null {
  const index = getBibleIndex()
  return index.books.find(
    b => bookToSlug(b.name) === slug ||
         b.abbr.toLowerCase() === slug ||
         b.name.toLowerCase() === slug
  ) || null
}

/**
 * ⏮️ Get previous chapter info
 */
export function getPreviousChapter(bookAbbr: string, chapter: number): { book: BookInfo; chapter: number } | null {
  const index = getBibleIndex()
  const currentBookIndex = index.books.findIndex(
    b => b.abbr.toLowerCase() === bookAbbr.toLowerCase()
  )

  if (currentBookIndex === -1) return null

  const currentBook = index.books[currentBookIndex]

  // Previous chapter in same book
  if (chapter > 1) {
    return { book: currentBook, chapter: chapter - 1 }
  }

  // Last chapter of previous book
  if (currentBookIndex > 0) {
    const prevBook = index.books[currentBookIndex - 1]
    return { book: prevBook, chapter: prevBook.chapters }
  }

  return null
}

/**
 * ⏭️ Get next chapter info
 */
export function getNextChapter(bookAbbr: string, chapter: number): { book: BookInfo; chapter: number } | null {
  const index = getBibleIndex()
  const currentBookIndex = index.books.findIndex(
    b => b.abbr.toLowerCase() === bookAbbr.toLowerCase()
  )

  if (currentBookIndex === -1) return null

  const currentBook = index.books[currentBookIndex]

  // Next chapter in same book
  if (chapter < currentBook.chapters) {
    return { book: currentBook, chapter: chapter + 1 }
  }

  // First chapter of next book
  if (currentBookIndex < index.books.length - 1) {
    const nextBook = index.books[currentBookIndex + 1]
    return { book: nextBook, chapter: 1 }
  }

  return null
}
