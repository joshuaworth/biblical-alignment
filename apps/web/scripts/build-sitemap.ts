/**
 * Build-time sitemap.xml generator
 * Generates a static sitemap.xml in public/ for all Bible chapters and pages
 * Compatible with Next.js static export (output: 'export')
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const BASE_URL = 'https://biblicalalignment.org'
const BSB_DATA_PATH = join(process.cwd(), '../../packages/bible-data/src/data/bsb')
const OUTPUT_PATH = join(process.cwd(), 'public/sitemap.xml')

interface BookInfo {
  name: string
  abbr: string
  testament: 'OT' | 'NT'
  chapters: number
  file: string
}

interface BibleIndex {
  books: BookInfo[]
}

function bookToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-')
}

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

console.log('Building sitemap.xml...')

const index: BibleIndex = JSON.parse(readFileSync(join(BSB_DATA_PATH, 'index.json'), 'utf-8'))
const today = new Date().toISOString().split('T')[0]

const urls: string[] = []

// Static pages
const staticPages = [
  { path: '', priority: '1.0', changefreq: 'weekly' },
  { path: '/read', priority: '0.9', changefreq: 'monthly' },
  { path: '/search', priority: '0.8', changefreq: 'monthly' },
  { path: '/plans', priority: '0.7', changefreq: 'monthly' },
]

for (const page of staticPages) {
  urls.push(`  <url>
    <loc>${escapeXml(BASE_URL + page.path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`)
}

// Book pages (66 books)
for (const book of index.books) {
  const slug = bookToSlug(book.name)
  urls.push(`  <url>
    <loc>${escapeXml(`${BASE_URL}/read/${slug}`)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`)
}

// Chapter pages (1,189 chapters)
for (const book of index.books) {
  const slug = bookToSlug(book.name)
  for (let ch = 1; ch <= book.chapters; ch++) {
    urls.push(`  <url>
    <loc>${escapeXml(`${BASE_URL}/read/${slug}/${ch}`)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>`)
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`

writeFileSync(OUTPUT_PATH, sitemap, 'utf-8')

console.log(`Sitemap written to: ${OUTPUT_PATH}`)
console.log(`Total URLs: ${urls.length}`)
console.log('Done!')
