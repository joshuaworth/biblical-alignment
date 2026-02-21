import Link from 'next/link'
import { NavBar } from '@/components/NavBar'

export const metadata = {
  title: 'About | Biblical Alignment',
  description:
    'Biblical Alignment is a free, open-source Bible platform built on Scripture-first principles using the Berean Standard Bible. No ads, no paywalls, no denomination pushed.',
  alternates: {
    canonical: 'https://biblicalalignment.org/about',
  },
  openGraph: {
    title: 'About Biblical Alignment',
    description:
      'A radically modern Bible platform built on truth. Free forever.',
    url: 'https://biblicalalignment.org/about',
  },
}

export default function AboutPage() {
  return (
    <main id="main-content" className="min-h-screen theme-bg">
      <NavBar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold theme-text mb-6 leading-tight">
            Scripture. Accessible.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-800 dark:from-amber-400 dark:to-amber-600">
              Free forever.
            </span>
          </h1>
          <p className="text-xl theme-text-muted leading-relaxed max-w-2xl mx-auto">
            Biblical Alignment exists for one purpose: to get God&apos;s Word
            into as many hands as possible, beautifully and without barriers.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-6 theme-surface">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold theme-text mb-6">
            Why We Built This
          </h2>
          <div className="space-y-4 text-lg theme-text-muted leading-relaxed">
            <p>
              Most Bible apps today are cluttered with ads, paywalled features,
              denominational bias, or AI that tells you what Scripture means
              instead of letting you read it for yourself.
            </p>
            <p>
              We believe the Bible should be radically accessible. No account
              required. No subscription. No ads. No denomination pushed. Just the
              Word — in a modern, beautiful interface that works on every device.
            </p>
            <p>
              We use the{' '}
              <strong className="theme-text">Berean Standard Bible (BSB)</strong>
              , a modern English translation released into the public domain. It&apos;s
              accurate, readable, and free for everyone — exactly as Scripture
              should be.
            </p>
          </div>
        </div>
      </section>

      {/* The Berean Standard */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <blockquote
            className="rounded-2xl border p-8 md:p-10"
            style={{
              backgroundColor: 'var(--theme-surface)',
              borderColor: 'var(--theme-border)',
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
              style={{ backgroundColor: 'var(--theme-accent)' }}
            />
            <p className="text-xl md:text-2xl leading-relaxed font-light italic theme-text">
              &ldquo;Now the Bereans were more noble-minded than the
              Thessalonians, for they received the message with great eagerness
              and examined the Scriptures every day to see if these teachings
              were true.&rdquo;
            </p>
            <footer className="mt-6 theme-text-muted">
              — Acts 17:11 (BSB)
            </footer>
          </blockquote>
          <p className="mt-6 theme-text-muted text-center">
            This verse is our namesake and our standard. We don&apos;t tell you
            what to believe — we help you examine the text for yourself.
          </p>
        </div>
      </section>

      {/* Our Principles */}
      <section className="py-16 px-6 bg-stone-900 dark:bg-slate-950 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Principles
            </h2>
            <p className="text-stone-300 text-lg">
              Every feature we build must pass these gates — or it doesn&apos;t
              ship.
            </p>
          </div>

          <div className="space-y-4">
            <PrincipleCard
              gate="A"
              title="Scripture is Final Authority"
              description="The Bible is the final court of appeal for all matters of faith and practice. No tradition, council, or AI can override what Scripture plainly teaches."
              verse="2 Timothy 3:16"
            />
            <PrincipleCard
              gate="B"
              title="Christ Alone is Mediator"
              description="Jesus Christ is the only mediator between God and humanity. Prayer is addressed to God through Christ alone."
              verse="1 Timothy 2:5"
            />
            <PrincipleCard
              gate="C"
              title="No Tradition Overrides Scripture"
              description="Human traditions are valid only when they do not contradict or nullify God's Word. Age and institutional continuity do not validate a practice."
              verse="Mark 7:8-13"
            />
            <PrincipleCard
              gate="D"
              title="Popularity Does Not Equal Truth"
              description="The number of people who believe something is irrelevant to whether it is true. The text is the test — not the crowd."
              verse="Matthew 7:13-14"
            />
            <PrincipleCard
              gate="E"
              title="Help Users Test, Don't Tell Them What to Believe"
              description="This app exists to help you test claims against the text, not to interpret Scripture for you. We show you the Word — you decide."
              verse="1 Thessalonians 5:21"
            />
          </div>
        </div>
      </section>

      {/* What We Are / Are Not */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* What We Are */}
            <div
              className="rounded-2xl border p-8"
              style={{
                backgroundColor: 'var(--theme-surface)',
                borderColor: 'var(--theme-border)',
              }}
            >
              <h3 className="text-xl font-bold theme-text mb-6">
                What We Are
              </h3>
              <ul className="space-y-4">
                <ListItem icon="📖" text="Scripture-first — the text is the test" />
                <ListItem icon="🔓" text="Transparent — show the manuscripts, show the translation choices" />
                <ListItem icon="🆓" text="Free — God's Word should never be paywalled" />
                <ListItem icon="🌍" text="Open source — MIT License, community-driven" />
                <ListItem icon="📱" text="Modern — beautiful design, works on every device" />
              </ul>
            </div>

            {/* What We Are Not */}
            <div
              className="rounded-2xl border p-8"
              style={{
                backgroundColor: 'var(--theme-surface)',
                borderColor: 'var(--theme-border)',
              }}
            >
              <h3 className="text-xl font-bold theme-text mb-6">
                What We Are Not
              </h3>
              <ul className="space-y-4">
                <ListItem icon="🚫" text="Not denominational — we don't push any label" />
                <ListItem icon="🚫" text="Not tradition-first — historical continuity doesn't prove truth" />
                <ListItem icon="🚫" text="Not AI-as-authority — the model never interprets for you" />
                <ListItem icon="🚫" text="Not ad-supported — no ads, no tracking, no data selling" />
                <ListItem icon="🚫" text="Not paywalled — every feature is free, always" />
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* About the BSB */}
      <section className="py-16 px-6 theme-surface">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold theme-text mb-6">
            About the Berean Standard Bible
          </h2>
          <div className="space-y-4 text-lg theme-text-muted leading-relaxed">
            <p>
              The BSB is a modern English translation produced by the{' '}
              <strong className="theme-text">Bible Hub</strong> team. It&apos;s
              translated from the original Hebrew, Aramaic, and Greek texts with
              a focus on accuracy and readability.
            </p>
            <p>
              What makes the BSB special is its license:{' '}
              <strong className="theme-text">public domain (CC0)</strong>. This
              means anyone can read, copy, distribute, and build upon it without
              restriction. We believe this is exactly how Scripture should be
              shared.
            </p>
          </div>

          <div
            className="mt-8 grid sm:grid-cols-3 gap-4"
          >
            <StatCard label="Books" value="66" />
            <StatCard label="Chapters" value="1,189" />
            <StatCard label="Verses" value="31,102" />
          </div>
        </div>
      </section>

      {/* Open Source */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold theme-text mb-4">
            Open Source
          </h2>
          <p className="text-lg theme-text-muted mb-8 max-w-2xl mx-auto">
            Biblical Alignment is fully open source under the MIT License. The
            code, the data, and the design are all freely available. Contributions
            are welcome.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://github.com/joshuaworth/biblical-alignment"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 theme-btn-primary rounded-xl font-semibold transition-all inline-flex items-center gap-2"
            >
              <GithubIcon />
              View on GitHub
            </a>
            <Link
              href="/read/genesis/1"
              className="px-6 py-3 theme-btn-secondary rounded-xl font-semibold transition-all"
            >
              Start Reading
            </Link>
          </div>
        </div>
      </section>

      {/* Footer verse */}
      <section className="py-12 px-6 theme-surface border-t theme-border">
        <div className="max-w-3xl mx-auto text-center">
          <p className="theme-text-muted text-sm italic">
            &ldquo;Your word is a lamp for my feet, a light on my path.&rdquo;
            — Psalm 119:105
          </p>
        </div>
      </section>
    </main>
  )
}

function PrincipleCard({
  gate,
  title,
  description,
  verse,
}: {
  gate: string
  title: string
  description: string
  verse: string
}) {
  return (
    <div className="flex items-start gap-4 p-6 bg-white/5 rounded-xl border border-white/10">
      <span className="text-2xl font-bold text-amber-400 shrink-0">
        {gate}.
      </span>
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-stone-300 mt-1 text-sm leading-relaxed">
          {description}
        </p>
        <p className="text-stone-500 mt-2 text-xs">{verse}</p>
      </div>
    </div>
  )
}

function ListItem({ icon, text }: { icon: string; text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="text-lg shrink-0">{icon}</span>
      <span className="theme-text-muted">{text}</span>
    </li>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-xl border p-6 text-center"
      style={{
        backgroundColor: 'var(--theme-surface-alt, var(--theme-surface))',
        borderColor: 'var(--theme-border)',
      }}
    >
      <p
        className="text-3xl font-bold"
        style={{ color: 'var(--theme-accent)' }}
      >
        {value}
      </p>
      <p className="text-sm theme-text-muted mt-1">{label}</p>
    </div>
  )
}

function GithubIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}
