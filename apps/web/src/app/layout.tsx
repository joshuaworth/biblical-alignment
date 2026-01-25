import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { SettingsProvider } from './providers'
import { SettingsPanel } from '@/components/SettingsPanel'
import { BottomNav } from '@/components/BottomNav'
import { SkipToContent } from '@/components/SkipToContent'
import { OfflineIndicator } from '@/components/OfflineIndicator'
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration'

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

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: 'Biblical Alignment | Modern Bible Study Platform',
  description: 'A radically modern, AI-assisted Bible platform built on Scripture-first principles. Free forever, open source, using the Berean Standard Bible.',
  keywords: ['Bible', 'Scripture', 'Bible Study', 'Berean Standard Bible', 'BSB', 'Christian', 'Free Bible'],
  authors: [{ name: 'IntentMesh' }],
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Biblical Alignment',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
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
    <html lang="en" className={`${inter.variable} ${playfair.variable} theme-dark`} suppressHydrationWarning>
      <body className="antialiased">
        <SettingsProvider>
          <ServiceWorkerRegistration />
          <SkipToContent />
          <OfflineIndicator />
          {children}
          <SettingsPanel />
          <BottomNav />
        </SettingsProvider>
      </body>
    </html>
  )
}
