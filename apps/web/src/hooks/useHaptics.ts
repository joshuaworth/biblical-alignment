'use client'

/**
 * Haptic feedback hook for Capacitor/native environments
 * Falls back gracefully to no-op on web
 */

import { useCallback, useEffect, useRef } from 'react'

// Types matching @capacitor/haptics
type ImpactStyle = 'Heavy' | 'Medium' | 'Light'
type NotificationType = 'Success' | 'Warning' | 'Error'

interface HapticsPlugin {
  impact: (options: { style: ImpactStyle }) => Promise<void>
  notification: (options: { type: NotificationType }) => Promise<void>
  vibrate: (options?: { duration?: number }) => Promise<void>
  selectionStart: () => Promise<void>
  selectionChanged: () => Promise<void>
  selectionEnd: () => Promise<void>
}

interface CapacitorGlobal {
  isNativePlatform: () => boolean
  Plugins: {
    Haptics?: HapticsPlugin
  }
}

declare global {
  interface Window {
    Capacitor?: CapacitorGlobal
  }
}

// Check if running in native Capacitor environment
function isNative(): boolean {
  return typeof window !== 'undefined' &&
         window.Capacitor?.isNativePlatform?.() === true
}

// Get the Haptics plugin if available
function getHapticsPlugin(): HapticsPlugin | null {
  if (!isNative()) return null
  return window.Capacitor?.Plugins?.Haptics ?? null
}

export function useHaptics() {
  const hapticsRef = useRef<HapticsPlugin | null>(null)
  const isNativeRef = useRef<boolean>(false)

  // Initialize on mount
  useEffect(() => {
    isNativeRef.current = isNative()
    if (isNativeRef.current) {
      // Try to dynamically import @capacitor/haptics if available
      // Using eval to avoid TypeScript module resolution errors when package isn't installed
      const loadHaptics = async () => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-implied-eval
          const module = await (new Function('return import("@capacitor/haptics")'))() as { Haptics: HapticsPlugin }
          hapticsRef.current = module.Haptics
        } catch {
          // Fall back to Plugins.Haptics from window.Capacitor
          hapticsRef.current = getHapticsPlugin()
        }
      }
      loadHaptics()
    }
  }, [])

  // Light impact - for UI feedback like button taps
  const light = useCallback(async () => {
    try {
      if (hapticsRef.current) {
        await hapticsRef.current.impact({ style: 'Light' })
      }
    } catch {
      // Silently fail on web
    }
  }, [])

  // Medium impact - for selections and confirmations
  const medium = useCallback(async () => {
    try {
      if (hapticsRef.current) {
        await hapticsRef.current.impact({ style: 'Medium' })
      }
    } catch {
      // Silently fail on web
    }
  }, [])

  // Heavy impact - for significant actions
  const heavy = useCallback(async () => {
    try {
      if (hapticsRef.current) {
        await hapticsRef.current.impact({ style: 'Heavy' })
      }
    } catch {
      // Silently fail on web
    }
  }, [])

  // Success notification - for successful operations
  const success = useCallback(async () => {
    try {
      if (hapticsRef.current) {
        await hapticsRef.current.notification({ type: 'Success' })
      }
    } catch {
      // Silently fail on web
    }
  }, [])

  // Warning notification
  const warning = useCallback(async () => {
    try {
      if (hapticsRef.current) {
        await hapticsRef.current.notification({ type: 'Warning' })
      }
    } catch {
      // Silently fail on web
    }
  }, [])

  // Error notification
  const error = useCallback(async () => {
    try {
      if (hapticsRef.current) {
        await hapticsRef.current.notification({ type: 'Error' })
      }
    } catch {
      // Silently fail on web
    }
  }, [])

  // Selection feedback for scrolling through items
  const selectionStart = useCallback(async () => {
    try {
      if (hapticsRef.current) {
        await hapticsRef.current.selectionStart()
      }
    } catch {
      // Silently fail on web
    }
  }, [])

  const selectionChanged = useCallback(async () => {
    try {
      if (hapticsRef.current) {
        await hapticsRef.current.selectionChanged()
      }
    } catch {
      // Silently fail on web
    }
  }, [])

  const selectionEnd = useCallback(async () => {
    try {
      if (hapticsRef.current) {
        await hapticsRef.current.selectionEnd()
      }
    } catch {
      // Silently fail on web
    }
  }, [])

  return {
    light,
    medium,
    heavy,
    success,
    warning,
    error,
    selectionStart,
    selectionChanged,
    selectionEnd,
    isNative: isNativeRef.current,
  }
}
