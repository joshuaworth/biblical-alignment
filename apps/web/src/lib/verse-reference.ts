/**
 * Verse Reference Parser
 *
 * Parses Bible references like "John 3:16", "Gen 1:1-3", "Psalm 23"
 * into structured data. Supports 200+ aliases for all 66 books.
 */

export interface ParsedReference {
  bookName: string
  bookSlug: string
  chapter: number | null
  verseStart: number | null
  verseEnd: number | null
  testament: 'OT' | 'NT'
}

export interface BookSuggestion {
  name: string
  abbr: string
  testament: 'OT' | 'NT'
  chapters: number
  slug: string
}

export type ReferenceDetectionResult =
  | { type: 'exact'; reference: ParsedReference }
  | { type: 'suggestions'; suggestions: BookSuggestion[] }
  | { type: 'none' }

// Canonical book data (from index.json)
interface BookCanonical {
  name: string
  abbr: string
  testament: 'OT' | 'NT'
  chapters: number
}

const BOOKS: BookCanonical[] = [
  { name: 'Genesis', abbr: 'Gen', testament: 'OT', chapters: 50 },
  { name: 'Exodus', abbr: 'Exod', testament: 'OT', chapters: 40 },
  { name: 'Leviticus', abbr: 'Lev', testament: 'OT', chapters: 27 },
  { name: 'Numbers', abbr: 'Num', testament: 'OT', chapters: 36 },
  { name: 'Deuteronomy', abbr: 'Deut', testament: 'OT', chapters: 34 },
  { name: 'Joshua', abbr: 'Josh', testament: 'OT', chapters: 24 },
  { name: 'Judges', abbr: 'Judg', testament: 'OT', chapters: 21 },
  { name: 'Ruth', abbr: 'Ruth', testament: 'OT', chapters: 4 },
  { name: '1 Samuel', abbr: '1Sam', testament: 'OT', chapters: 31 },
  { name: '2 Samuel', abbr: '2Sam', testament: 'OT', chapters: 24 },
  { name: '1 Kings', abbr: '1Kgs', testament: 'OT', chapters: 22 },
  { name: '2 Kings', abbr: '2Kgs', testament: 'OT', chapters: 25 },
  { name: '1 Chronicles', abbr: '1Chr', testament: 'OT', chapters: 29 },
  { name: '2 Chronicles', abbr: '2Chr', testament: 'OT', chapters: 36 },
  { name: 'Ezra', abbr: 'Ezra', testament: 'OT', chapters: 10 },
  { name: 'Nehemiah', abbr: 'Neh', testament: 'OT', chapters: 13 },
  { name: 'Esther', abbr: 'Esth', testament: 'OT', chapters: 10 },
  { name: 'Job', abbr: 'Job', testament: 'OT', chapters: 42 },
  { name: 'Psalms', abbr: 'Ps', testament: 'OT', chapters: 150 },
  { name: 'Proverbs', abbr: 'Prov', testament: 'OT', chapters: 31 },
  { name: 'Ecclesiastes', abbr: 'Eccl', testament: 'OT', chapters: 12 },
  { name: 'Song of Solomon', abbr: 'Song', testament: 'OT', chapters: 8 },
  { name: 'Isaiah', abbr: 'Isa', testament: 'OT', chapters: 66 },
  { name: 'Jeremiah', abbr: 'Jer', testament: 'OT', chapters: 52 },
  { name: 'Lamentations', abbr: 'Lam', testament: 'OT', chapters: 5 },
  { name: 'Ezekiel', abbr: 'Ezek', testament: 'OT', chapters: 48 },
  { name: 'Daniel', abbr: 'Dan', testament: 'OT', chapters: 12 },
  { name: 'Hosea', abbr: 'Hos', testament: 'OT', chapters: 14 },
  { name: 'Joel', abbr: 'Joel', testament: 'OT', chapters: 3 },
  { name: 'Amos', abbr: 'Amos', testament: 'OT', chapters: 9 },
  { name: 'Obadiah', abbr: 'Obad', testament: 'OT', chapters: 1 },
  { name: 'Jonah', abbr: 'Jonah', testament: 'OT', chapters: 4 },
  { name: 'Micah', abbr: 'Mic', testament: 'OT', chapters: 7 },
  { name: 'Nahum', abbr: 'Nah', testament: 'OT', chapters: 3 },
  { name: 'Habakkuk', abbr: 'Hab', testament: 'OT', chapters: 3 },
  { name: 'Zephaniah', abbr: 'Zeph', testament: 'OT', chapters: 3 },
  { name: 'Haggai', abbr: 'Hag', testament: 'OT', chapters: 2 },
  { name: 'Zechariah', abbr: 'Zech', testament: 'OT', chapters: 14 },
  { name: 'Malachi', abbr: 'Mal', testament: 'OT', chapters: 4 },
  { name: 'Matthew', abbr: 'Matt', testament: 'NT', chapters: 28 },
  { name: 'Mark', abbr: 'Mark', testament: 'NT', chapters: 16 },
  { name: 'Luke', abbr: 'Luke', testament: 'NT', chapters: 24 },
  { name: 'John', abbr: 'John', testament: 'NT', chapters: 21 },
  { name: 'Acts', abbr: 'Acts', testament: 'NT', chapters: 28 },
  { name: 'Romans', abbr: 'Rom', testament: 'NT', chapters: 16 },
  { name: '1 Corinthians', abbr: '1Cor', testament: 'NT', chapters: 16 },
  { name: '2 Corinthians', abbr: '2Cor', testament: 'NT', chapters: 13 },
  { name: 'Galatians', abbr: 'Gal', testament: 'NT', chapters: 6 },
  { name: 'Ephesians', abbr: 'Eph', testament: 'NT', chapters: 6 },
  { name: 'Philippians', abbr: 'Phil', testament: 'NT', chapters: 4 },
  { name: 'Colossians', abbr: 'Col', testament: 'NT', chapters: 4 },
  { name: '1 Thessalonians', abbr: '1Thess', testament: 'NT', chapters: 5 },
  { name: '2 Thessalonians', abbr: '2Thess', testament: 'NT', chapters: 3 },
  { name: '1 Timothy', abbr: '1Tim', testament: 'NT', chapters: 6 },
  { name: '2 Timothy', abbr: '2Tim', testament: 'NT', chapters: 4 },
  { name: 'Titus', abbr: 'Titus', testament: 'NT', chapters: 3 },
  { name: 'Philemon', abbr: 'Phlm', testament: 'NT', chapters: 1 },
  { name: 'Hebrews', abbr: 'Heb', testament: 'NT', chapters: 13 },
  { name: 'James', abbr: 'Jas', testament: 'NT', chapters: 5 },
  { name: '1 Peter', abbr: '1Pet', testament: 'NT', chapters: 5 },
  { name: '2 Peter', abbr: '2Pet', testament: 'NT', chapters: 3 },
  { name: '1 John', abbr: '1John', testament: 'NT', chapters: 5 },
  { name: '2 John', abbr: '2John', testament: 'NT', chapters: 1 },
  { name: '3 John', abbr: '3John', testament: 'NT', chapters: 1 },
  { name: 'Jude', abbr: 'Jude', testament: 'NT', chapters: 1 },
  { name: 'Revelation', abbr: 'Rev', testament: 'NT', chapters: 22 },
]

// Extra aliases beyond what the canonical names/abbrs already provide
const EXTRA_ALIASES: Record<string, string> = {
  // OT
  'ge': 'Genesis', 'gn': 'Genesis',
  'ex': 'Exodus', 'exo': 'Exodus',
  'le': 'Leviticus', 'lv': 'Leviticus',
  'nu': 'Numbers', 'nm': 'Numbers',
  'dt': 'Deuteronomy', 'deu': 'Deuteronomy',
  'jos': 'Joshua',
  'jdg': 'Judges', 'jg': 'Judges',
  'ru': 'Ruth', 'rth': 'Ruth',
  '1 sam': '1 Samuel', '1sam': '1 Samuel', '1 sa': '1 Samuel', '1sa': '1 Samuel',
  '2 sam': '2 Samuel', '2sam': '2 Samuel', '2 sa': '2 Samuel', '2sa': '2 Samuel',
  '1 ki': '1 Kings', '1ki': '1 Kings', '1 kgs': '1 Kings', '1kgs': '1 Kings',
  '2 ki': '2 Kings', '2ki': '2 Kings', '2 kgs': '2 Kings', '2kgs': '2 Kings',
  '1 chr': '1 Chronicles', '1chr': '1 Chronicles', '1 ch': '1 Chronicles',
  '2 chr': '2 Chronicles', '2chr': '2 Chronicles', '2 ch': '2 Chronicles',
  'ne': 'Nehemiah',
  'est': 'Esther',
  'jb': 'Job',
  'ps': 'Psalms', 'psa': 'Psalms', 'psalm': 'Psalms',
  'pr': 'Proverbs', 'pro': 'Proverbs',
  'ecc': 'Ecclesiastes', 'eccles': 'Ecclesiastes',
  'song': 'Song of Solomon', 'sos': 'Song of Solomon', 'sg': 'Song of Solomon',
  'songs': 'Song of Solomon', 'song of songs': 'Song of Solomon',
  'is': 'Isaiah',
  'je': 'Jeremiah',
  'la': 'Lamentations',
  'eze': 'Ezekiel', 'ez': 'Ezekiel',
  'da': 'Daniel',
  'ho': 'Hosea',
  'jl': 'Joel',
  'am': 'Amos',
  'ob': 'Obadiah',
  'jon': 'Jonah',
  'mi': 'Micah',
  'na': 'Nahum',
  'zep': 'Zephaniah',
  'zec': 'Zechariah',
  // NT
  'mt': 'Matthew',
  'mk': 'Mark', 'mr': 'Mark',
  'lk': 'Luke', 'lu': 'Luke',
  'jn': 'John', 'jhn': 'John',
  'ac': 'Acts',
  'ro': 'Romans',
  '1 cor': '1 Corinthians', '1cor': '1 Corinthians', '1 co': '1 Corinthians', '1co': '1 Corinthians',
  '2 cor': '2 Corinthians', '2cor': '2 Corinthians', '2 co': '2 Corinthians', '2co': '2 Corinthians',
  'ga': 'Galatians',
  'php': 'Philippians',
  '1 thess': '1 Thessalonians', '1thess': '1 Thessalonians', '1 th': '1 Thessalonians', '1th': '1 Thessalonians',
  '2 thess': '2 Thessalonians', '2thess': '2 Thessalonians', '2 th': '2 Thessalonians', '2th': '2 Thessalonians',
  '1 tim': '1 Timothy', '1tim': '1 Timothy', '1 ti': '1 Timothy', '1ti': '1 Timothy',
  '2 tim': '2 Timothy', '2tim': '2 Timothy', '2 ti': '2 Timothy', '2ti': '2 Timothy',
  'tit': 'Titus',
  'phlm': 'Philemon', 'phm': 'Philemon', 'philem': 'Philemon',
  'heb': 'Hebrews',
  'jas': 'James', 'jm': 'James',
  '1 pet': '1 Peter', '1pet': '1 Peter', '1 pe': '1 Peter', '1pe': '1 Peter',
  '2 pet': '2 Peter', '2pet': '2 Peter', '2 pe': '2 Peter', '2pe': '2 Peter',
  '1 jn': '1 John', '1jn': '1 John', '1 john': '1 John', '1john': '1 John',
  '2 jn': '2 John', '2jn': '2 John', '2 john': '2 John', '2john': '2 John',
  '3 jn': '3 John', '3jn': '3 John', '3 john': '3 John', '3john': '3 John',
  're': 'Revelation',
}

// Build the lookup map: alias → BookCanonical
const ALIAS_MAP = new Map<string, BookCanonical>()

for (const book of BOOKS) {
  // Register canonical name and abbreviation (lowercase)
  ALIAS_MAP.set(book.name.toLowerCase(), book)
  ALIAS_MAP.set(book.abbr.toLowerCase(), book)
  // Without spaces for numbered books: "1samuel" etc
  ALIAS_MAP.set(book.name.toLowerCase().replace(/\s+/g, ''), book)
}

for (const [alias, bookName] of Object.entries(EXTRA_ALIASES)) {
  const book = BOOKS.find(b => b.name === bookName)
  if (book) ALIAS_MAP.set(alias.toLowerCase(), book)
}

function bookToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-')
}

function normalize(input: string): string {
  return input.trim().replace(/\s+/g, ' ').replace(/\./g, '')
}

// Regex to find the location part at the end: chapter, optional :verse, optional -verse
const LOCATION_REGEX = /\s+(\d{1,3})(?:\s*:\s*(\d{1,3})(?:\s*[-–—]\s*(\d{1,3}))?)?\s*$/

function lookupBook(bookPart: string): BookCanonical | null {
  const key = bookPart.toLowerCase().trim()
  return ALIAS_MAP.get(key) || null
}

export function parseVerseReference(input: string): ParsedReference | null {
  const normalized = normalize(input)
  if (!normalized) return null

  const locationMatch = normalized.match(LOCATION_REGEX)

  if (locationMatch) {
    const bookPart = normalized.slice(0, locationMatch.index!).trim()
    const chapter = parseInt(locationMatch[1], 10)
    const verseStart = locationMatch[2] ? parseInt(locationMatch[2], 10) : null
    const verseEnd = locationMatch[3] ? parseInt(locationMatch[3], 10) : null

    const book = lookupBook(bookPart)
    if (!book) return null

    // Single-chapter book handling: "Jude 4" → chapter 1, verse 4
    if (book.chapters === 1 && verseStart === null && chapter > 1) {
      return {
        bookName: book.name,
        bookSlug: bookToSlug(book.name),
        chapter: 1,
        verseStart: chapter,
        verseEnd: null,
        testament: book.testament,
      }
    }

    return {
      bookName: book.name,
      bookSlug: bookToSlug(book.name),
      chapter,
      verseStart,
      verseEnd,
      testament: book.testament,
    }
  }

  // No location part — might be just a book name
  const book = lookupBook(normalized)
  if (book) {
    return {
      bookName: book.name,
      bookSlug: bookToSlug(book.name),
      chapter: null,
      verseStart: null,
      verseEnd: null,
      testament: book.testament,
    }
  }

  return null
}

export function suggestBooks(partial: string): BookSuggestion[] {
  const key = partial.toLowerCase().trim()
  if (!key) return []

  const matches: BookSuggestion[] = []
  const seen = new Set<string>()

  for (const book of BOOKS) {
    if (seen.has(book.name)) continue

    const nameLower = book.name.toLowerCase()
    const abbrLower = book.abbr.toLowerCase()

    if (nameLower.startsWith(key) || abbrLower.startsWith(key)) {
      seen.add(book.name)
      matches.push({
        name: book.name,
        abbr: book.abbr,
        testament: book.testament,
        chapters: book.chapters,
        slug: bookToSlug(book.name),
      })
    }
  }

  // Also check aliases for prefix match
  for (const [alias, book] of ALIAS_MAP) {
    if (seen.has(book.name)) continue
    if (alias.startsWith(key)) {
      seen.add(book.name)
      matches.push({
        name: book.name,
        abbr: book.abbr,
        testament: book.testament,
        chapters: book.chapters,
        slug: bookToSlug(book.name),
      })
    }
  }

  return matches.slice(0, 8)
}

export function detectVerseReference(input: string): ReferenceDetectionResult {
  const normalized = normalize(input)
  if (!normalized || normalized.length < 2) return { type: 'none' }

  // Try exact parse first
  const ref = parseVerseReference(normalized)
  if (ref) {
    return { type: 'exact', reference: ref }
  }

  // Try suggestions for partial book names
  const suggestions = suggestBooks(normalized)
  if (suggestions.length > 0) {
    return { type: 'suggestions', suggestions }
  }

  return { type: 'none' }
}
