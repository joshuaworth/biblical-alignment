import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Biblical Alignment | Modern Bible Study Platform',
  description: 'A radically modern, AI-assisted Bible platform built on Scripture-first principles. Free forever, open source, using the Berean Standard Bible.',
  keywords: ['Bible', 'Scripture', 'Bible Study', 'Berean Standard Bible', 'BSB', 'Christian', 'Free Bible'],
  authors: [{ name: 'IntentMesh' }],
  openGraph: {
    title: 'Biblical Alignment',
    description: 'Align your life with Scripture. A modern, free Bible platform.',
    url: 'https://biblicalalignment.org',
    siteName: 'Biblical Alignment',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Biblical Alignment',
    description: 'Align your life with Scripture. A modern, free Bible platform.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
