'use client'

/**
 * Skip to Content Link
 * Accessibility feature for keyboard users to skip navigation
 * and jump directly to main content
 */

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="skip-to-content"
      aria-label="Skip to main content"
    >
      Skip to content
    </a>
  )
}
