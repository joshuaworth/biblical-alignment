import { useMemo } from 'react'
import {
  detectVerseReference,
  ParsedReference,
  BookSuggestion,
} from '@/lib/verse-reference'

interface SearchEntry {
  id: string
  book: string
  abbr: string
  chapter: number
  verse: number
  text: string
  testament: 'OT' | 'NT'
}

export interface VerseReferenceResult {
  isReference: boolean
  parsedReference: ParsedReference | null
  matchedVerses: SearchEntry[]
  suggestions: BookSuggestion[]
}

export function useVerseReference(
  query: string,
  searchIndex: SearchEntry[] | null
): VerseReferenceResult {
  return useMemo(() => {
    const empty: VerseReferenceResult = {
      isReference: false,
      parsedReference: null,
      matchedVerses: [],
      suggestions: [],
    }

    if (!query.trim() || !searchIndex) return empty

    const detection = detectVerseReference(query.trim())

    if (detection.type === 'exact') {
      const ref = detection.reference

      // Book-only reference — don't filter verses, just flag it
      if (ref.chapter === null) {
        return {
          isReference: true,
          parsedReference: ref,
          matchedVerses: [],
          suggestions: [],
        }
      }

      const matchedVerses = searchIndex.filter(entry => {
        if (entry.book !== ref.bookName) return false
        if (entry.chapter !== ref.chapter) return false
        if (ref.verseStart !== null) {
          const end = ref.verseEnd ?? ref.verseStart
          if (entry.verse < ref.verseStart || entry.verse > end) return false
        }
        return true
      })

      return {
        isReference: true,
        parsedReference: ref,
        matchedVerses,
        suggestions: [],
      }
    }

    if (detection.type === 'suggestions') {
      return {
        isReference: true,
        parsedReference: null,
        matchedVerses: [],
        suggestions: detection.suggestions,
      }
    }

    return empty
  }, [query, searchIndex])
}
