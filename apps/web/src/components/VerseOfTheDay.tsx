'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { getVerseOfTheDay, DailyVerse } from '@/lib/verse-of-the-day'

export function VerseOfTheDay() {
  const [verse, setVerse] = useState<DailyVerse | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setVerse(getVerseOfTheDay())
  }, [])

  const handleShare = useCallback(async () => {
    if (!verse) return

    const text = `"${verse.text}" — ${verse.reference} (BSB)`
    const url = `https://biblicalalignment.org/read/${verse.slug}/${verse.chapter}#verse-${verse.verse}`

    try {
      if (navigator.share) {
        await navigator.share({ title: verse.reference, text, url })
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      // User cancelled share
    }
  }, [verse])

  if (!verse) return null

  return (
    <section className="py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div
          className="relative overflow-hidden rounded-2xl border p-8 md:p-10"
          style={{
            backgroundColor: 'var(--theme-surface)',
            borderColor: 'var(--theme-border)',
          }}
        >
          {/* Decorative accent */}
          <div
            className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
            style={{ backgroundColor: 'var(--theme-accent)' }}
          />

          {/* Label */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-lg">📖</span>
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'var(--theme-accent)' }}
              >
                Verse of the Day
              </span>
            </div>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg
                transition-all hover:scale-105 active:scale-95"
              style={{
                backgroundColor: 'var(--theme-surface-alt)',
                color: 'var(--theme-text-secondary)',
                border: '1px solid var(--theme-border)',
              }}
              aria-label="Share verse"
            >
              {copied ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                  Share
                </>
              )}
            </button>
          </div>

          {/* Verse text */}
          <blockquote className="mb-6">
            <p
              className="text-xl md:text-2xl leading-relaxed font-light italic"
              style={{ color: 'var(--theme-text)' }}
            >
              &ldquo;{verse.text}&rdquo;
            </p>
          </blockquote>

          {/* Reference + read in context */}
          <div className="flex items-center justify-between">
            <p
              className="text-sm font-medium"
              style={{ color: 'var(--theme-text-secondary)' }}
            >
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
      </div>
    </section>
  )
}
