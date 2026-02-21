import Link from 'next/link'
import { TOPICAL_GROUPS } from '@/data/topical-index'
import { Footer } from '@/components/Footer'

export const metadata = {
  title: 'Topical Verse Index | Biblical Alignment',
  description:
    'Browse Bible verses by topic: salvation, faith, anxiety, love, hope, and more. 25 curated topics with verses from the Berean Standard Bible.',
  alternates: {
    canonical: 'https://biblicalalignment.org/topics',
  },
  openGraph: {
    title: 'Topical Verse Index | Biblical Alignment',
    description:
      'Browse Bible verses by topic: salvation, faith, anxiety, love, hope, and more.',
    url: 'https://biblicalalignment.org/topics',
  },
}

export default function TopicsPage() {
  return (
    <main id="main-content" className="min-h-screen theme-bg">
      {/* Header */}
      <section className="pt-20 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{
              backgroundColor: 'var(--theme-accent-light)',
              color: 'var(--theme-accent-text)',
            }}
          >
            <span>📚</span>
            <span>25 Topics · 200 Verses</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold theme-text mb-4">
            Topical Verse Index
          </h1>

          <p className="text-lg theme-text-muted max-w-2xl mx-auto">
            Browse Scripture by theme. Each topic contains 8 curated verses from
            the Berean Standard Bible to encourage, instruct, and strengthen.
          </p>
        </div>
      </section>

      {/* Topic Groups */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          {TOPICAL_GROUPS.map((group) => (
            <div key={group.id}>
              {/* Group Header */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{group.icon}</span>
                <h2 className="text-2xl font-bold theme-text">{group.name}</h2>
              </div>

              {/* Topic Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {group.topics.map((topic) => (
                  <Link
                    key={topic.id}
                    href={`/topics/${topic.id}`}
                    className="group p-6 rounded-2xl border transition-all hover:shadow-lg"
                    style={{
                      backgroundColor: 'var(--theme-surface)',
                      borderColor: 'var(--theme-border)',
                    }}
                  >
                    <span className="text-3xl block mb-3">{topic.icon}</span>
                    <h3 className="text-lg font-semibold theme-text group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {topic.name}
                    </h3>
                    <p className="text-sm theme-text-muted mt-1">
                      {topic.verses.length} verses
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
