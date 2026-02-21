/**
 * Pre-built Bible reading plans
 * Each plan is a sequence of daily readings (book slug + chapter)
 */

export interface ReadingDay {
  day: number
  readings: { slug: string; book: string; chapter: number }[]
}

export interface ReadingPlan {
  id: string
  name: string
  description: string
  duration: number // days
  icon: string
  days: ReadingDay[]
}

// Helper to generate sequential chapter readings
function generateSequentialPlan(
  books: { slug: string; name: string; chapters: number }[],
  chaptersPerDay: number,
): ReadingDay[] {
  const days: ReadingDay[] = []
  let day = 1
  let dayReadings: { slug: string; book: string; chapter: number }[] = []

  for (const book of books) {
    for (let ch = 1; ch <= book.chapters; ch++) {
      dayReadings.push({ slug: book.slug, book: book.name, chapter: ch })
      if (dayReadings.length >= chaptersPerDay) {
        days.push({ day, readings: dayReadings })
        dayReadings = []
        day++
      }
    }
  }

  // Flush remaining
  if (dayReadings.length > 0) {
    days.push({ day, readings: dayReadings })
  }

  return days
}

// New Testament books
const NT_BOOKS = [
  { slug: 'matthew', name: 'Matthew', chapters: 28 },
  { slug: 'mark', name: 'Mark', chapters: 16 },
  { slug: 'luke', name: 'Luke', chapters: 24 },
  { slug: 'john', name: 'John', chapters: 21 },
  { slug: 'acts', name: 'Acts', chapters: 28 },
  { slug: 'romans', name: 'Romans', chapters: 16 },
  { slug: '1-corinthians', name: '1 Corinthians', chapters: 16 },
  { slug: '2-corinthians', name: '2 Corinthians', chapters: 13 },
  { slug: 'galatians', name: 'Galatians', chapters: 6 },
  { slug: 'ephesians', name: 'Ephesians', chapters: 6 },
  { slug: 'philippians', name: 'Philippians', chapters: 4 },
  { slug: 'colossians', name: 'Colossians', chapters: 4 },
  { slug: '1-thessalonians', name: '1 Thessalonians', chapters: 5 },
  { slug: '2-thessalonians', name: '2 Thessalonians', chapters: 3 },
  { slug: '1-timothy', name: '1 Timothy', chapters: 6 },
  { slug: '2-timothy', name: '2 Timothy', chapters: 4 },
  { slug: 'titus', name: 'Titus', chapters: 3 },
  { slug: 'philemon', name: 'Philemon', chapters: 1 },
  { slug: 'hebrews', name: 'Hebrews', chapters: 13 },
  { slug: 'james', name: 'James', chapters: 5 },
  { slug: '1-peter', name: '1 Peter', chapters: 5 },
  { slug: '2-peter', name: '2 Peter', chapters: 3 },
  { slug: '1-john', name: '1 John', chapters: 5 },
  { slug: '2-john', name: '2 John', chapters: 1 },
  { slug: '3-john', name: '3 John', chapters: 1 },
  { slug: 'jude', name: 'Jude', chapters: 1 },
  { slug: 'revelation', name: 'Revelation', chapters: 22 },
]

// Old Testament books
const OT_BOOKS = [
  { slug: 'genesis', name: 'Genesis', chapters: 50 },
  { slug: 'exodus', name: 'Exodus', chapters: 40 },
  { slug: 'leviticus', name: 'Leviticus', chapters: 27 },
  { slug: 'numbers', name: 'Numbers', chapters: 36 },
  { slug: 'deuteronomy', name: 'Deuteronomy', chapters: 34 },
  { slug: 'joshua', name: 'Joshua', chapters: 24 },
  { slug: 'judges', name: 'Judges', chapters: 21 },
  { slug: 'ruth', name: 'Ruth', chapters: 4 },
  { slug: '1-samuel', name: '1 Samuel', chapters: 31 },
  { slug: '2-samuel', name: '2 Samuel', chapters: 24 },
  { slug: '1-kings', name: '1 Kings', chapters: 22 },
  { slug: '2-kings', name: '2 Kings', chapters: 25 },
  { slug: '1-chronicles', name: '1 Chronicles', chapters: 29 },
  { slug: '2-chronicles', name: '2 Chronicles', chapters: 36 },
  { slug: 'ezra', name: 'Ezra', chapters: 10 },
  { slug: 'nehemiah', name: 'Nehemiah', chapters: 13 },
  { slug: 'esther', name: 'Esther', chapters: 10 },
  { slug: 'job', name: 'Job', chapters: 42 },
  { slug: 'psalms', name: 'Psalms', chapters: 150 },
  { slug: 'proverbs', name: 'Proverbs', chapters: 31 },
  { slug: 'ecclesiastes', name: 'Ecclesiastes', chapters: 12 },
  { slug: 'song-of-solomon', name: 'Song of Solomon', chapters: 8 },
  { slug: 'isaiah', name: 'Isaiah', chapters: 66 },
  { slug: 'jeremiah', name: 'Jeremiah', chapters: 52 },
  { slug: 'lamentations', name: 'Lamentations', chapters: 5 },
  { slug: 'ezekiel', name: 'Ezekiel', chapters: 48 },
  { slug: 'daniel', name: 'Daniel', chapters: 12 },
  { slug: 'hosea', name: 'Hosea', chapters: 14 },
  { slug: 'joel', name: 'Joel', chapters: 3 },
  { slug: 'amos', name: 'Amos', chapters: 9 },
  { slug: 'obadiah', name: 'Obadiah', chapters: 1 },
  { slug: 'jonah', name: 'Jonah', chapters: 4 },
  { slug: 'micah', name: 'Micah', chapters: 7 },
  { slug: 'nahum', name: 'Nahum', chapters: 3 },
  { slug: 'habakkuk', name: 'Habakkuk', chapters: 3 },
  { slug: 'zephaniah', name: 'Zephaniah', chapters: 3 },
  { slug: 'haggai', name: 'Haggai', chapters: 2 },
  { slug: 'zechariah', name: 'Zechariah', chapters: 14 },
  { slug: 'malachi', name: 'Malachi', chapters: 4 },
]

// Whole Bible (OT + NT) in canonical order
const WHOLE_BIBLE_BOOKS = [...OT_BOOKS, ...NT_BOOKS]

// Generate a plan that evenly distributes chapters across exactly N days
function generateEvenPlan(
  books: { slug: string; name: string; chapters: number }[],
  targetDays: number,
): ReadingDay[] {
  // Flatten all chapters into a list
  const allChapters: { slug: string; book: string; chapter: number }[] = []
  for (const book of books) {
    for (let ch = 1; ch <= book.chapters; ch++) {
      allChapters.push({ slug: book.slug, book: book.name, chapter: ch })
    }
  }

  const totalChapters = allChapters.length
  const days: ReadingDay[] = []
  let chapterIndex = 0

  for (let day = 1; day <= targetDays; day++) {
    // Calculate how many chapters this day should get
    const remainingDays = targetDays - day + 1
    const remainingChapters = totalChapters - chapterIndex
    const chaptersToday = Math.ceil(remainingChapters / remainingDays)

    const readings = allChapters.slice(chapterIndex, chapterIndex + chaptersToday)
    if (readings.length > 0) {
      days.push({ day, readings })
    }
    chapterIndex += chaptersToday
  }

  return days
}

// Gospels only
const GOSPEL_BOOKS = [
  { slug: 'matthew', name: 'Matthew', chapters: 28 },
  { slug: 'mark', name: 'Mark', chapters: 16 },
  { slug: 'luke', name: 'Luke', chapters: 24 },
  { slug: 'john', name: 'John', chapters: 21 },
]

// Psalms & Proverbs 31-day plan
function generatePsalmsProverbsPlan(): ReadingDay[] {
  const days: ReadingDay[] = []

  for (let day = 1; day <= 31; day++) {
    const readings: { slug: string; book: string; chapter: number }[] = []

    // 1 Proverb per day (Proverbs has 31 chapters — perfect)
    readings.push({ slug: 'proverbs', book: 'Proverbs', chapter: day })

    // 5 Psalms per day (150 / 30 = 5, with day 31 getting the last batch)
    const psalmStart = (day - 1) * 5 + 1
    for (let i = 0; i < 5 && psalmStart + i <= 150; i++) {
      readings.push({ slug: 'psalms', book: 'Psalms', chapter: psalmStart + i })
    }

    days.push({ day, readings })
  }

  return days
}

export const READING_PLANS: ReadingPlan[] = [
  {
    id: 'bible-365',
    name: 'Bible in a Year',
    description: 'Read through the entire Bible, Genesis to Revelation, in 365 days.',
    duration: 365,
    icon: '📖',
    days: generateEvenPlan(WHOLE_BIBLE_BOOKS, 365),
  },
  {
    id: 'nt-90',
    name: 'New Testament in 90 Days',
    description: 'Read through the entire New Testament. 3 chapters per day.',
    duration: 90,
    icon: '📜',
    days: generateSequentialPlan(NT_BOOKS, 3),
  },
  {
    id: 'gospels-30',
    name: 'The Gospels in 30 Days',
    description: 'Walk through the life of Jesus in Matthew, Mark, Luke, and John.',
    duration: 30,
    icon: '✝️',
    days: generateSequentialPlan(GOSPEL_BOOKS, 3),
  },
  {
    id: 'psalms-proverbs-31',
    name: 'Psalms & Proverbs',
    description: '31 days of wisdom and worship. 1 Proverb and 5 Psalms daily.',
    duration: 31,
    icon: '🎵',
    days: generatePsalmsProverbsPlan(),
  },
]

export function getPlan(id: string): ReadingPlan | undefined {
  return READING_PLANS.find(p => p.id === id)
}
