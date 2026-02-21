import Link from 'next/link'

export const metadata = {
  title: 'Page Not Found | Biblical Alignment',
  description: 'The page you are looking for could not be found.',
}

export default function NotFound() {
  return (
    <main className="min-h-screen theme-bg flex items-center justify-center px-6">
      <div className="max-w-lg mx-auto text-center">
        {/* 404 Number */}
        <p
          className="text-8xl font-bold mb-4"
          style={{ color: 'var(--theme-accent)' }}
        >
          404
        </p>

        <h1 className="text-2xl md:text-3xl font-bold theme-text mb-4">
          Page Not Found
        </h1>

        <p className="theme-text-muted mb-8 text-lg">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Scripture verse */}
        <blockquote
          className="rounded-xl border p-6 mb-10"
          style={{
            backgroundColor: 'var(--theme-surface)',
            borderColor: 'var(--theme-border)',
          }}
        >
          <p className="text-lg italic theme-text leading-relaxed">
            &ldquo;Your word is a lamp to my feet and a light to my path.&rdquo;
          </p>
          <footer className="mt-3 text-sm theme-text-muted">
            — Psalm 119:105 (BSB)
          </footer>
        </blockquote>

        {/* Navigation links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 theme-btn-primary rounded-xl font-semibold transition-all"
          >
            Go Home
          </Link>
          <Link
            href="/read"
            className="px-6 py-3 theme-btn-secondary rounded-xl font-semibold transition-all"
          >
            Browse Books
          </Link>
          <Link
            href="/search"
            className="px-6 py-3 theme-btn-secondary rounded-xl font-semibold transition-all"
          >
            Search
          </Link>
        </div>
      </div>
    </main>
  )
}
