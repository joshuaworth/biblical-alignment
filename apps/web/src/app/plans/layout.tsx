import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reading Plans | Biblical Alignment',
  description: 'Structured Bible reading plans to guide you through Scripture. New Testament in 90 days, Gospels in 30 days, Psalms & Proverbs, and more.',
  openGraph: {
    title: 'Bible Reading Plans | Biblical Alignment',
    description: 'Structured plans to guide you through Scripture. Free, no account needed.',
    url: 'https://biblicalalignment.org/plans',
  },
}

export default function PlansLayout({ children }: { children: React.ReactNode }) {
  return children
}
