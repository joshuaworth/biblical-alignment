'use client'

import { useState, useEffect, useCallback } from 'react'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'

export function OfflineIndicator() {
  const { isOffline, isOnline } = useOnlineStatus()
  const [visible, setVisible] = useState(false)
  const [showReconnected, setShowReconnected] = useState(false)
  const [wasOffline, setWasOffline] = useState(false)

  // Track if we were previously offline
  useEffect(() => {
    if (isOffline) {
      setWasOffline(true)
      setVisible(true)
      setShowReconnected(false)
    } else if (wasOffline && isOnline) {
      // Just came back online
      setShowReconnected(true)
      setVisible(true)

      // Hide the reconnected message after 3 seconds
      const timer = setTimeout(() => {
        setVisible(false)
        setShowReconnected(false)
        setWasOffline(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isOffline, isOnline, wasOffline])

  // Auto-hide offline banner after 5 seconds, but show on interaction
  useEffect(() => {
    if (!isOffline) return

    const hideTimer = setTimeout(() => {
      setVisible(false)
    }, 5000)

    const showOnInteraction = () => {
      if (isOffline) {
        setVisible(true)
        // Reset the auto-hide timer on interaction
        clearTimeout(hideTimer)
      }
    }

    // Show briefly on any user interaction
    window.addEventListener('click', showOnInteraction)
    window.addEventListener('scroll', showOnInteraction)
    window.addEventListener('touchstart', showOnInteraction)

    return () => {
      clearTimeout(hideTimer)
      window.removeEventListener('click', showOnInteraction)
      window.removeEventListener('scroll', showOnInteraction)
      window.removeEventListener('touchstart', showOnInteraction)
    }
  }, [isOffline])

  const handleDismiss = useCallback(() => {
    setVisible(false)
  }, [])

  if (!visible) return null

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[100] transform transition-transform duration-300 ease-out ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
      role="status"
      aria-live="polite"
    >
      <div
        className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium ${
          showReconnected
            ? 'bg-emerald-600 text-white'
            : 'bg-amber-500 text-amber-950'
        }`}
      >
        {showReconnected ? (
          <>
            <CheckCircleIcon className="h-4 w-4 shrink-0" />
            <span>Back online</span>
          </>
        ) : (
          <>
            <CloudOffIcon className="h-4 w-4 shrink-0" />
            <span>You&apos;re offline - reading from cache</span>
          </>
        )}
        <button
          onClick={handleDismiss}
          className="ml-2 p-1 rounded hover:bg-black/10 transition-colors"
          aria-label="Dismiss"
        >
          <XIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

function CloudOffIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 2l20 20" />
      <path d="M5.5 5.5A7 7 0 0 0 5 8a6 6 0 0 0 .28 1.77A5 5 0 0 0 7 19h10c.7 0 1.37-.14 2-.4" />
      <path d="M18.43 18.43A5 5 0 0 0 19 14a5 5 0 0 0-5-5 5 5 0 0 0-1.61.26" />
      <path d="M9.2 4.38A7 7 0 0 1 18 8c1.73 0 2.99 1.24 3 2.97" />
    </svg>
  )
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
