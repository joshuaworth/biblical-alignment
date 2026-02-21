import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search the Bible | Biblical Alignment',
  description: 'Search across all 31,102 verses of the Berean Standard Bible. Find any word or phrase instantly. Free, fast, and ad-free.',
  openGraph: {
    title: 'Search the Bible | Biblical Alignment',
    description: 'Search across all 31,102 verses of the Berean Standard Bible.',
    url: 'https://biblicalalignment.org/search',
  },
}

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children
}
