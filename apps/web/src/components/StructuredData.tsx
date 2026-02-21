/**
 * JSON-LD Structured Data components for SEO
 * Helps search engines understand our Bible content
 */

// Website schema for homepage
export function WebsiteStructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Biblical Alignment',
    url: 'https://biblicalalignment.org',
    description: 'A modern, free Bible platform built on the Berean Standard Bible (BSB). Read, search, and study Scripture. No ads, no paywalls.',
    inLanguage: 'en',
    publisher: {
      '@type': 'Organization',
      name: 'IntentMesh',
      url: 'https://intentmesh.com',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://biblicalalignment.org/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// Breadcrumb schema for chapter pages
export function BreadcrumbStructuredData({
  bookName,
  bookSlug,
  chapter,
}: {
  bookName: string
  bookSlug: string
  chapter: number
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://biblicalalignment.org',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Read',
        item: 'https://biblicalalignment.org/read',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: bookName,
        item: `https://biblicalalignment.org/read/${bookSlug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: `Chapter ${chapter}`,
        item: `https://biblicalalignment.org/read/${bookSlug}/${chapter}`,
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// Chapter/CreativeWork schema for Bible chapter pages
export function ChapterStructuredData({
  bookName,
  bookSlug,
  chapter,
  firstVerseText,
}: {
  bookName: string
  bookSlug: string
  chapter: number
  firstVerseText: string
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Chapter',
    name: `${bookName} ${chapter}`,
    isPartOf: {
      '@type': 'Book',
      name: 'Berean Standard Bible',
      inLanguage: 'en',
      license: 'https://creativecommons.org/publicdomain/zero/1.0/',
      url: 'https://biblicalalignment.org/read',
    },
    url: `https://biblicalalignment.org/read/${bookSlug}/${chapter}`,
    description: firstVerseText,
    inLanguage: 'en',
    isAccessibleForFree: true,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
