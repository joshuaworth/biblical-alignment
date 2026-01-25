/**
 * Build Search Index Script
 *
 * Reads all BSB Bible book files and creates a compact search index
 * for client-side fuzzy search with Fuse.js
 *
 * Run: pnpm build:search
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

// Types matching the BSB data structure
interface Verse {
  verse: number
  text: string
}

interface BookData {
  name: string
  abbr: string
  testament: 'OT' | 'NT'
  chapters: number
  data: Record<string, Verse[]>
}

interface BookInfo {
  name: string
  abbr: string
  testament: 'OT' | 'NT'
  chapters: number
  file: string
}

interface BibleIndex {
  translation: string
  name: string
  books: BookInfo[]
}

interface SearchEntry {
  /** Unique ID: abbr-chapter-verse (e.g., "Gen-1-1") */
  id: string
  /** Book name for display */
  book: string
  /** Book abbreviation */
  abbr: string
  /** Chapter number */
  chapter: number
  /** Verse number */
  verse: number
  /** Verse text */
  text: string
  /** Testament: OT or NT */
  testament: 'OT' | 'NT'
}

// Paths
const BSB_DATA_PATH = join(process.cwd(), '../../packages/bible-data/src/data/bsb')
const OUTPUT_PATH = join(process.cwd(), 'public/search-index.json')

console.log('Building search index...')
console.log(`Source: ${BSB_DATA_PATH}`)
console.log(`Output: ${OUTPUT_PATH}`)

// Read the Bible index
const indexPath = join(BSB_DATA_PATH, 'index.json')
const bibleIndex: BibleIndex = JSON.parse(readFileSync(indexPath, 'utf-8'))

console.log(`Found ${bibleIndex.books.length} books`)

// Build the search entries
const searchEntries: SearchEntry[] = []

for (const bookInfo of bibleIndex.books) {
  const bookPath = join(BSB_DATA_PATH, bookInfo.file)
  const bookData: BookData = JSON.parse(readFileSync(bookPath, 'utf-8'))

  // Iterate through all chapters
  for (const [chapterNum, verses] of Object.entries(bookData.data)) {
    for (const verse of verses) {
      searchEntries.push({
        id: `${bookInfo.abbr}-${chapterNum}-${verse.verse}`,
        book: bookInfo.name,
        abbr: bookInfo.abbr,
        chapter: parseInt(chapterNum),
        verse: verse.verse,
        text: verse.text,
        testament: bookInfo.testament,
      })
    }
  }

  process.stdout.write(`  Processed ${bookInfo.name}...\n`)
}

console.log(`\nTotal verses: ${searchEntries.length}`)

// Write the search index
writeFileSync(OUTPUT_PATH, JSON.stringify(searchEntries))

// Calculate file size
const stats = readFileSync(OUTPUT_PATH)
const sizeMB = (stats.length / (1024 * 1024)).toFixed(2)

console.log(`Search index written to: ${OUTPUT_PATH}`)
console.log(`File size: ${sizeMB} MB`)
console.log('\nDone!')
