import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Notes | Biblical Alignment',
  description: 'Your personal study notes from the Berean Standard Bible.',
  robots: { index: false, follow: false },
}

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return children
}
