import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  TOPICAL_GROUPS,
  getTopicById,
  getAllTopics,
} from '@/data/topical-index'
import { Footer } from '@/components/Footer'

interface PageProps {
  params: Promise<{ topic: string }>
}

export function generateStaticParams() {
  return getAllTopics().map((topic) => ({
    topic: topic.id,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const { topic: topicId } = await params
  const topic = getTopicById(topicId)

  if (!topic) {
    return { title: 'Topic Not Found | Biblical Alignment' }
  }

  return {
    title: `${topic.name} | Bible Verses | Biblical Alignment`,
    description: `${topic.description}. ${topic.verses.length} curated verses from the Berean Standard Bible.`,
    alternates: {
      canonical: `https://biblicalalignment.org/topics/${topic.id}`,
    },
    openGraph: {
      title: `${topic.name} | Bible Verses`,
      description: topic.description,
      url: `https://biblicalalignment.org/topics/${topic.id}`,
    },
  }
}

export default async function TopicPage({ params }: PageProps) {
  const { topic: topicId } = await params
  const topic = getTopicById(topicId)

  if (!topic) {
    notFound()
  }

  // Find which group this topic belongs to
  const group = TOPICAL_GROUPS.find((g) =>
    g.topics.some((t) => t.id === topicId)
  )

  return (
    <main id="main-content" className="min-h-screen theme-bg">
      {/* Header */}
      <section className="pt-20 pb-10 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm theme-text-muted mb-6">
            <Link
              href="/topics"
              className="hover:underline transition-colors"
              style={{ color: 'var(--theme-accent)' }}
            >
              Topics
            </Link>
            <span>/</span>
            {group && (
              <>
                <span>{group.name}</span>
                <span>/</span>
              </>
            )}
            <span className="theme-text font-medium">{topic.name}</span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{topic.icon}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold theme-text">
                {topic.name}
              </h1>
              <p className="theme-text-muted mt-1">{topic.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Verses */}
      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {topic.verses.map((verse, index) => (
            <div
              key={`${verse.slug}-${verse.chapter}-${verse.verse}`}
              className="relative overflow-hidden rounded-2xl border p-6 md:p-8"
              style={{
                backgroundColor: 'var(--theme-surface)',
                borderColor: 'var(--theme-border)',
              }}
            >
              {/* Verse number badge */}
              <div
                className="absolute top-0 left-0 w-8 h-8 flex items-center justify-center rounded-br-xl text-xs font-bold"
                style={{
                  backgroundColor: 'var(--theme-accent)',
                  color: 'var(--theme-text-inverted, white)',
                }}
              >
                {index + 1}
              </div>

              {/* Verse text */}
              <blockquote className="mt-2">
                <p className="text-lg md:text-xl leading-relaxed font-light italic theme-text">
                  &ldquo;{verse.text}&rdquo;
                </p>
              </blockquote>

              {/* Reference + link */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm font-medium theme-text-muted">
                  — {verse.reference} (BSB)
                </p>
                <Link
                  href={`/read/${verse.slug}/${verse.chapter}#verse-${verse.verse}`}
                  className="text-sm font-medium transition-colors hover:underline"
                  style={{ color: 'var(--theme-accent)' }}
                >
                  Read in context →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Navigation */}
      <section className="pb-16 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            href="/topics"
            className="text-sm font-medium transition-colors hover:underline"
            style={{ color: 'var(--theme-accent)' }}
          >
            ← All Topics
          </Link>

          {/* Next/prev topics from same group */}
          {group && (() => {
            const topicIndex = group.topics.findIndex((t) => t.id === topicId)
            const nextTopic = group.topics[topicIndex + 1]
            return nextTopic ? (
              <Link
                href={`/topics/${nextTopic.id}`}
                className="text-sm font-medium transition-colors hover:underline"
                style={{ color: 'var(--theme-accent)' }}
              >
                {nextTopic.name} →
              </Link>
            ) : null
          })()}
        </div>
      </section>

      <Footer />
    </main>
  )
}
