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
    id: 'nt-90',
    name: 'New Testament in 90 Days',
    description: 'Read through the entire New Testament — 3 chapters per day.',
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
    description: '31 days of wisdom and worship — 1 Proverb and 5 Psalms daily.',
    duration: 31,
    icon: '🎵',
    days: generatePsalmsProverbsPlan(),
  },
]

export function getPlan(id: string): ReadingPlan | undefined {
  return READING_PLANS.find(p => p.id === id)
}
