'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useSettings } from '@/app/providers'
import { OfflineBadge } from './OfflineBadge'

interface NavBarProps {
  showSettingsButton?: boolean
}

export function NavBar({ showSettingsButton = true }: NavBarProps) {
  const pathname = usePathname()
  const { openSettings } = useSettings()
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  const isActive = (path: string) => {
    if (path === '/read') {
      return pathname.startsWith('/read')
    }
    return pathname === path
  }

  // Get page title for mobile header
  const getPageTitle = () => {
    if (pathname === '/') return null // Show logo on home
    if (pathname === '/search') return 'Search'
    if (pathname === '/bookmarks') return 'Bookmarks'
    if (pathname === '/notes') return 'Notes'
    if (pathname === '/about') return 'About'
    if (pathname.startsWith('/read')) return null // Chapter pages show their own header
    return null
  }

  const pageTitle = getPageTitle()

  const updateNavVisibility = useCallback(() => {
    const currentScrollY = window.scrollY

    // Only apply hide behavior on mobile (< 768px)
    if (window.innerWidth >= 768) {
      setHidden(false)
      lastScrollY.current = currentScrollY
      ticking.current = false
      return
    }

    if (currentScrollY < 50) {
      // Always show at top of page
      setHidden(false)
    } else if (currentScrollY > lastScrollY.current + 5) {
      // Scrolling down (with 5px threshold to avoid micro-movements)
      setHidden(true)
    } else if (currentScrollY < lastScrollY.current - 5) {
      // Scrolling up (with 5px threshold)
      setHidden(false)
    }

    lastScrollY.current = currentScrollY
    ticking.current = false
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      // Throttle using requestAnimationFrame
      if (!ticking.current) {
        window.requestAnimationFrame(updateNavVisibility)
        ticking.current = true
      }
    }

    // Add listener with passive for performance
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Also listen for resize to handle orientation changes
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setHidden(false)
      }
    }
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [updateNavVisibility])

  return (
    <nav
      className={`fixed top-0 w-full z-50 backdrop-blur-md border-b theme-border transition-transform duration-300 ease-in-out ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
      style={{ backgroundColor: 'color-mix(in srgb, var(--theme-surface) 85%, transparent)' }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
        {/* Mobile: Simple centered title or minimal logo */}
        {/* Desktop: Full logo */}
        <Link href="/" className="flex items-center gap-2 md:gap-3">
          <span className="text-xl md:text-2xl">📖</span>
          {/* Hide full name on mobile, show on desktop */}
          <span className="hidden md:inline font-semibold text-xl tracking-tight theme-text">
            Biblical Alignment
          </span>
        </Link>

        {/* Mobile: Page title (centered via flex) */}
        {pageTitle && (
          <span className="md:hidden font-semibold text-lg theme-text absolute left-1/2 -translate-x-1/2">
            {pageTitle}
          </span>
        )}

        {/* Desktop nav links - hidden on mobile */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/read"
            className={isActive('/read')
              ? 'text-amber-600 font-medium'
              : 'theme-text-muted hover:text-amber-600 transition-colors'
            }
          >
            Read
          </Link>
          <Link
            href="/search"
            className={isActive('/search')
              ? 'text-amber-600 font-medium'
              : 'theme-text-muted hover:text-amber-600 transition-colors'
            }
          >
            Search
          </Link>
          <Link
            href="/about"
            className={isActive('/about')
              ? 'text-amber-600 font-medium'
              : 'theme-text-muted hover:text-amber-600 transition-colors'
            }
          >
            About
          </Link>
          <OfflineBadge />
        </div>

        {/* Right side: Settings (both mobile & desktop) */}
        <div className="flex items-center gap-2">
          {/* Offline badge - mobile */}
          <div className="md:hidden">
            <OfflineBadge />
          </div>
          {showSettingsButton && (
            <button
              onClick={openSettings}
              className="p-2 -mr-2 rounded-lg theme-text-muted hover:text-amber-600 transition-colors touch-target"
              aria-label="Open settings"
            >
              <SettingsIcon />
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

function SettingsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
        clipRule="evenodd"
      />
    </svg>
  )
}
