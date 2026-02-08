import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Bookmarks | Biblical Alignment',
  description: 'Your saved verses and highlights from the Berean Standard Bible.',
  robots: { index: false, follow: false },
}

export default function BookmarksLayout({ children }: { children: React.ReactNode }) {
  return children
}
