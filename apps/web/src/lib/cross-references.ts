/**
 * Cross-reference lookup utility
 * Lazy-loads per-book cross-reference data from public/cross-references/
 * Source: OpenBible.info (CC-BY)
 */

export interface CrossReference {
  book: string
  slug: string
  chapter: number
  verse: number
  endVerse?: number
  votes: number
}

// Cache loaded book data in memory
const cache: Map<string, Record<string, CrossReference[]>> = new Map()

/**
 * Get cross-references for a specific verse
 * Lazy-loads the book's cross-reference file on first access
 */
export async function getCrossReferences(
  bookSlug: string,
  chapter: number,
  verse: number
): Promise<CrossReference[]> {
  const bookData = await loadBookCrossRefs(bookSlug)
  if (!bookData) return []

  const key = `${chapter}:${verse}`
  return bookData[key] || []
}

/**
 * Check if a verse has cross-references (without loading full data)
 * Uses the cached data if available
 */
export function hasCrossReferences(
  bookSlug: string,
  chapter: number,
  verse: number
): boolean {
  const bookData = cache.get(bookSlug)
  if (!bookData) return false
  return `${chapter}:${verse}` in bookData
}

/**
 * Get all cross-references for a chapter (for showing indicators)
 */
export async function getChapterCrossRefs(
  bookSlug: string,
  chapter: number
): Promise<Map<number, number>> {
  const bookData = await loadBookCrossRefs(bookSlug)
  if (!bookData) return new Map()

  const result = new Map<number, number>()
  const prefix = `${chapter}:`

  for (const [key, refs] of Object.entries(bookData)) {
    if (key.startsWith(prefix)) {
      const verse = parseInt(key.split(':')[1])
      result.set(verse, refs.length)
    }
  }

  return result
}

/**
 * Load cross-reference data for a single book
 */
async function loadBookCrossRefs(
  bookSlug: string
): Promise<Record<string, CrossReference[]> | null> {
  if (cache.has(bookSlug)) {
    return cache.get(bookSlug)!
  }

  try {
    const response = await fetch(`/cross-references/${bookSlug}.json`)
    if (!response.ok) return null

    const data = await response.json()
    cache.set(bookSlug, data)
    return data
  } catch {
    return null
  }
}

/**
 * Format a cross-reference as a readable string
 */
export function formatCrossRef(ref: CrossReference): string {
  if (ref.endVerse) {
    return `${ref.book} ${ref.chapter}:${ref.verse}-${ref.endVerse}`
  }
  return `${ref.book} ${ref.chapter}:${ref.verse}`
}
