/**
 * Build cross-reference data from OpenBible.info TSV
 * Source: https://www.openbible.info/labs/cross-references/ (CC-BY)
 *
 * Converts TSV format into per-book JSON files for lazy loading.
 * Input:  "Gen.1.1\tJob.26.13\t37"
 * Output: JSON grouped by book with verse-level cross-references
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

// Book abbreviation mapping (OpenBible format → our slug format)
const BOOK_ABBR_MAP: Record<string, { slug: string; name: string }> = {
  'Gen': { slug: 'genesis', name: 'Genesis' },
  'Exod': { slug: 'exodus', name: 'Exodus' },
  'Lev': { slug: 'leviticus', name: 'Leviticus' },
  'Num': { slug: 'numbers', name: 'Numbers' },
  'Deut': { slug: 'deuteronomy', name: 'Deuteronomy' },
  'Josh': { slug: 'joshua', name: 'Joshua' },
  'Judg': { slug: 'judges', name: 'Judges' },
  'Ruth': { slug: 'ruth', name: 'Ruth' },
  '1Sam': { slug: '1-samuel', name: '1 Samuel' },
  '2Sam': { slug: '2-samuel', name: '2 Samuel' },
  '1Kgs': { slug: '1-kings', name: '1 Kings' },
  '2Kgs': { slug: '2-kings', name: '2 Kings' },
  '1Chr': { slug: '1-chronicles', name: '1 Chronicles' },
  '2Chr': { slug: '2-chronicles', name: '2 Chronicles' },
  'Ezra': { slug: 'ezra', name: 'Ezra' },
  'Neh': { slug: 'nehemiah', name: 'Nehemiah' },
  'Esth': { slug: 'esther', name: 'Esther' },
  'Job': { slug: 'job', name: 'Job' },
  'Ps': { slug: 'psalms', name: 'Psalms' },
  'Prov': { slug: 'proverbs', name: 'Proverbs' },
  'Eccl': { slug: 'ecclesiastes', name: 'Ecclesiastes' },
  'Song': { slug: 'song-of-solomon', name: 'Song of Solomon' },
  'Isa': { slug: 'isaiah', name: 'Isaiah' },
  'Jer': { slug: 'jeremiah', name: 'Jeremiah' },
  'Lam': { slug: 'lamentations', name: 'Lamentations' },
  'Ezek': { slug: 'ezekiel', name: 'Ezekiel' },
  'Dan': { slug: 'daniel', name: 'Daniel' },
  'Hos': { slug: 'hosea', name: 'Hosea' },
  'Joel': { slug: 'joel', name: 'Joel' },
  'Amos': { slug: 'amos', name: 'Amos' },
  'Obad': { slug: 'obadiah', name: 'Obadiah' },
  'Jonah': { slug: 'jonah', name: 'Jonah' },
  'Mic': { slug: 'micah', name: 'Micah' },
  'Nah': { slug: 'nahum', name: 'Nahum' },
  'Hab': { slug: 'habakkuk', name: 'Habakkuk' },
  'Zeph': { slug: 'zephaniah', name: 'Zephaniah' },
  'Hag': { slug: 'haggai', name: 'Haggai' },
  'Zech': { slug: 'zechariah', name: 'Zechariah' },
  'Mal': { slug: 'malachi', name: 'Malachi' },
  'Matt': { slug: 'matthew', name: 'Matthew' },
  'Mark': { slug: 'mark', name: 'Mark' },
  'Luke': { slug: 'luke', name: 'Luke' },
  'John': { slug: 'john', name: 'John' },
  'Acts': { slug: 'acts', name: 'Acts' },
  'Rom': { slug: 'romans', name: 'Romans' },
  '1Cor': { slug: '1-corinthians', name: '1 Corinthians' },
  '2Cor': { slug: '2-corinthians', name: '2 Corinthians' },
  'Gal': { slug: 'galatians', name: 'Galatians' },
  'Eph': { slug: 'ephesians', name: 'Ephesians' },
  'Phil': { slug: 'philippians', name: 'Philippians' },
  'Col': { slug: 'colossians', name: 'Colossians' },
  '1Thess': { slug: '1-thessalonians', name: '1 Thessalonians' },
  '2Thess': { slug: '2-thessalonians', name: '2 Thessalonians' },
  '1Tim': { slug: '1-timothy', name: '1 Timothy' },
  '2Tim': { slug: '2-timothy', name: '2 Timothy' },
  'Titus': { slug: 'titus', name: 'Titus' },
  'Phlm': { slug: 'philemon', name: 'Philemon' },
  'Heb': { slug: 'hebrews', name: 'Hebrews' },
  'Jas': { slug: 'james', name: 'James' },
  '1Pet': { slug: '1-peter', name: '1 Peter' },
  '2Pet': { slug: '2-peter', name: '2 Peter' },
  '1John': { slug: '1-john', name: '1 John' },
  '2John': { slug: '2-john', name: '2 John' },
  '3John': { slug: '3-john', name: '3 John' },
  'Jude': { slug: 'jude', name: 'Jude' },
  'Rev': { slug: 'revelation', name: 'Revelation' },
}

interface CrossRef {
  book: string   // Target book name
  slug: string   // Target book slug
  chapter: number
  verse: number
  endVerse?: number
  votes: number
}

// Parse a verse reference like "Gen.1.1" or "Col.1.16-Col.1.17"
function parseRef(ref: string): { book: string; slug: string; name: string; chapter: number; verse: number; endVerse?: number } | null {
  // Handle ranges like "Col.1.16-Col.1.17"
  const parts = ref.split('-')
  const mainRef = parts[0]

  const match = mainRef.match(/^(\d?[A-Za-z]+)\.(\d+)\.(\d+)$/)
  if (!match) return null

  const [, bookAbbr, chapterStr, verseStr] = match
  const bookInfo = BOOK_ABBR_MAP[bookAbbr]
  if (!bookInfo) return null

  const result: { book: string; slug: string; name: string; chapter: number; verse: number; endVerse?: number } = {
    book: bookAbbr,
    slug: bookInfo.slug,
    name: bookInfo.name,
    chapter: parseInt(chapterStr),
    verse: parseInt(verseStr),
  }

  // Parse end verse if range
  if (parts.length > 1) {
    const endMatch = parts[1].match(/(\d+)$/)
    if (endMatch) {
      result.endVerse = parseInt(endMatch[1])
    }
  }

  return result
}

function main() {
  const inputPath = process.argv[2]
  if (!inputPath) {
    console.error('Usage: npx tsx scripts/build-cross-references.ts <path-to-cross_references.txt>')
    process.exit(1)
  }

  const outputDir = join(process.cwd(), 'apps/web/public/cross-references')

  console.log('Reading cross-reference data...')
  const raw = readFileSync(inputPath, 'utf-8')
  const lines = raw.split('\n').filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('From'))

  console.log(`Processing ${lines.length} cross-references...`)

  // Group by source book + chapter
  const byBook: Record<string, Record<string, CrossRef[]>> = {}

  let parsed = 0
  let skipped = 0

  for (const line of lines) {
    const [fromRef, toRef, votesStr] = line.split('\t')
    if (!fromRef || !toRef) { skipped++; continue }

    const from = parseRef(fromRef)
    const to = parseRef(toRef)
    const votes = parseInt(votesStr) || 0

    if (!from || !to) { skipped++; continue }

    // Only include cross-refs with reasonable community support
    if (votes < 10) { skipped++; continue }

    const bookSlug = from.slug
    const verseKey = `${from.chapter}:${from.verse}`

    if (!byBook[bookSlug]) byBook[bookSlug] = {}
    if (!byBook[bookSlug][verseKey]) byBook[bookSlug][verseKey] = []

    byBook[bookSlug][verseKey].push({
      book: to.name,
      slug: to.slug,
      chapter: to.chapter,
      verse: to.verse,
      ...(to.endVerse ? { endVerse: to.endVerse } : {}),
      votes,
    })

    parsed++
  }

  // Sort cross-refs by votes (highest first) and write per-book JSON
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  let totalRefs = 0
  const bookIndex: Record<string, number> = {}

  for (const [bookSlug, chapters] of Object.entries(byBook)) {
    // Sort refs within each verse by votes
    for (const verseKey of Object.keys(chapters)) {
      chapters[verseKey].sort((a, b) => b.votes - a.votes)
    }

    const refCount = Object.values(chapters).reduce((sum, refs) => sum + refs.length, 0)
    totalRefs += refCount
    bookIndex[bookSlug] = refCount

    const outputPath = join(outputDir, `${bookSlug}.json`)
    writeFileSync(outputPath, JSON.stringify(chapters))
  }

  // Write index file
  writeFileSync(
    join(outputDir, 'index.json'),
    JSON.stringify({
      source: 'OpenBible.info',
      license: 'CC-BY',
      totalReferences: totalRefs,
      books: bookIndex,
    })
  )

  console.log(`\nDone!`)
  console.log(`  Parsed: ${parsed} cross-references`)
  console.log(`  Skipped: ${skipped} (low votes or parse errors)`)
  console.log(`  Books: ${Object.keys(byBook).length}`)
  console.log(`  Total refs: ${totalRefs}`)
  console.log(`  Output: ${outputDir}`)
}

main()
