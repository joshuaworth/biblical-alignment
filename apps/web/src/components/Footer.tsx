import Link from 'next/link'

export function Footer() {
  return (
    <footer className="py-12 px-6 theme-surface border-t theme-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📖</span>
            <span className="font-semibold theme-text">Biblical Alignment</span>
          </div>

          <p className="theme-text-muted text-sm text-center">
            Open source · MIT License · Bible text: Public Domain (BSB)
          </p>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/joshuaworth/biblical-alignment"
              target="_blank"
              rel="noopener noreferrer"
              className="theme-text-muted hover:text-amber-600 transition-colors"
            >
              GitHub
            </a>
            <Link
              href="/about"
              className="theme-text-muted hover:text-amber-600 transition-colors"
            >
              About
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t theme-border text-center">
          <p className="theme-text-muted text-sm italic">
            &ldquo;Your word is a lamp for my feet, a light on my path.&rdquo;
            — Psalm 119:105
          </p>
        </div>
      </div>
    </footer>
  )
}
