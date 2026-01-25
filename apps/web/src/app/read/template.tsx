/**
 * 📖 Read Section Template
 *
 * Using template.tsx instead of layout.tsx so that animations
 * trigger on every navigation within the /read section.
 *
 * In Next.js App Router:
 * - layout.tsx: Persists between navigations (doesn't remount)
 * - template.tsx: Remounts on every navigation (triggers animations)
 */

import { PageTransition } from '@/components/PageTransition'

export default function ReadTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  return <PageTransition>{children}</PageTransition>
}
