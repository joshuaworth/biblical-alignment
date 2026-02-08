import Link from 'next/link'
import { NavBar } from '@/components/NavBar'
import { ContinueReadingCompact } from '@/components/ContinueReading'
import { WebsiteStructuredData } from '@/components/StructuredData'
import { VerseOfTheDay } from '@/components/VerseOfTheDay'

export default function HomePage() {
  return (
    <main id="main-content" className="min-h-screen theme-bg">
      <WebsiteStructuredData />
      {/* 🔝 Navigation */}
      <NavBar />

      {/* 🌟 Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 theme-accent-light rounded-full text-sm font-medium mb-8">
            <span>✨</span>
            <span>100% Free · Open Source · No Ads</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold theme-text mb-6 leading-tight">
            Align your life with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-800 dark:from-amber-400 dark:to-amber-600">
              Scripture
            </span>
          </h1>

          <p className="text-xl theme-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
            A radically modern Bible platform built on truth. No denomination pushed.
            No tradition over Scripture. Just the Word — beautifully accessible to everyone.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/read/genesis/1"
              className="px-8 py-4 theme-btn-primary rounded-xl font-semibold text-lg transition-all theme-shadow-lg"
            >
              Start Reading →
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 theme-btn-secondary rounded-xl font-semibold text-lg transition-all"
            >
              Learn More
            </Link>
          </div>

          {/* 📖 Continue Reading (if user has history) */}
          <div className="mt-10 max-w-md mx-auto">
            <ContinueReadingCompact />
          </div>
        </div>
      </section>

      {/* 📖 Verse of the Day */}
      <VerseOfTheDay />

      {/* 📜 Featured Verse */}
      <section className="py-16 px-6 theme-surface">
        <div className="max-w-3xl mx-auto">
          <blockquote className="text-center">
            <p className="text-2xl md:text-3xl theme-text leading-relaxed font-light italic">
              "Now the Bereans were more noble-minded than the Thessalonians, for they received the message with great eagerness and{' '}
              <span className="text-amber-700 dark:text-amber-400 font-medium not-italic">
                examined the Scriptures every day
              </span>{' '}
              to see if these teachings were true."
            </p>
            <footer className="mt-6 theme-text-muted">
              — Acts 17:11 (BSB)
            </footer>
          </blockquote>
        </div>
      </section>

      {/* 🎯 Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold theme-text mb-4">
              Built Different
            </h2>
            <p className="theme-text-muted text-lg max-w-2xl mx-auto">
              Modern technology meets timeless truth. No compromise on either.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 theme-surface rounded-2xl border theme-border hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-xl font-semibold theme-text mb-2">
                Scripture First
              </h3>
              <p className="theme-text-muted">
                The Bible is the final authority. No tradition, no AI, no popularity contest overrides the text.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 theme-surface rounded-2xl border theme-border hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold theme-text mb-2">
                Transparent Translation
              </h3>
              <p className="theme-text-muted">
                See manuscript variants. Know where translations differ. The Berean Standard Bible shows its work.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 theme-surface rounded-2xl border theme-border hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🆓</div>
              <h3 className="text-xl font-semibold theme-text mb-2">
                Free Forever
              </h3>
              <p className="theme-text-muted">
                No paywalls. No subscriptions. No ads. God's Word should be accessible to everyone.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 theme-surface rounded-2xl border theme-border hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🚫</div>
              <h3 className="text-xl font-semibold theme-text mb-2">
                No Denominational Push
              </h3>
              <p className="theme-text-muted">
                We don't tell you what to believe. We show you the text and let you study for yourself.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 theme-surface rounded-2xl border theme-border hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold theme-text mb-2">
                AI That Assists
              </h3>
              <p className="theme-text-muted">
                AI helps you find and cross-reference. It never interprets for you. Scripture decides.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 theme-surface rounded-2xl border theme-border hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold theme-text mb-2">
                Modern Experience
              </h3>
              <p className="theme-text-muted">
                Beautiful design. Works on every device. Offline support. The Bible experience you deserve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🚪 The Gate System */}
      <section className="py-20 px-6 bg-stone-900 dark:bg-slate-950 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Principles
            </h2>
            <p className="text-stone-300 text-lg">
              Every feature passes these gates or it doesn't ship.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-6 bg-white/5 rounded-xl border border-white/10">
              <span className="text-2xl">🅰️</span>
              <div>
                <h3 className="font-semibold text-lg">Scripture is Final Authority</h3>
                <p className="text-stone-400 mt-1">2 Timothy 3:16-17</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white/5 rounded-xl border border-white/10">
              <span className="text-2xl">🅱️</span>
              <div>
                <h3 className="font-semibold text-lg">Christ Alone is Mediator</h3>
                <p className="text-stone-400 mt-1">1 Timothy 2:5</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white/5 rounded-xl border border-white/10">
              <span className="text-2xl">🅲</span>
              <div>
                <h3 className="font-semibold text-lg">No Tradition Overrides Scripture</h3>
                <p className="text-stone-400 mt-1">Mark 7:8-13</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white/5 rounded-xl border border-white/10">
              <span className="text-2xl">🅳</span>
              <div>
                <h3 className="font-semibold text-lg">Popularity ≠ Truth</h3>
                <p className="text-stone-400 mt-1">Matthew 7:13-14</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white/5 rounded-xl border border-white/10">
              <span className="text-2xl">🅴</span>
              <div>
                <h3 className="font-semibold text-lg">Help Users Test, Don't Tell Them What to Believe</h3>
                <p className="text-stone-400 mt-1">Acts 17:11</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📚 CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold theme-text mb-6">
            Ready to study Scripture?
          </h2>
          <p className="theme-text-muted text-lg mb-8">
            No account needed. No download required. Start reading right now.
          </p>
          <Link
            href="/read/genesis/1"
            className="inline-flex items-center gap-2 px-8 py-4 theme-accent-bg rounded-xl font-semibold text-lg transition-colors theme-shadow-lg"
          >
            <span>📖</span>
            <span>Begin with Genesis</span>
          </Link>
        </div>
      </section>

      {/* 🦶 Footer */}
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
                href="https://github.com/intentmesh/biblical-alignment"
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
              "Your word is a lamp for my feet, a light on my path." — Psalm 119:105
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
