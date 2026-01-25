'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'sepia'
type FontFamily = 'default' | 'serif' | 'dyslexia'

interface Settings {
  theme: Theme
  fontSize: number // 14-24
  fontFamily: FontFamily
  lineHeight: number // 1.5-2.5
  autoTheme: boolean
}

interface SettingsContextType {
  settings: Settings
  setTheme: (theme: Theme) => void
  setFontSize: (size: number) => void
  setFontFamily: (family: FontFamily) => void
  setLineHeight: (height: number) => void
  setAutoTheme: (enabled: boolean) => void
  autoThemeStatus: { theme: 'light' | 'dark'; label: string } | null
  isSettingsOpen: boolean
  openSettings: () => void
  closeSettings: () => void
}

const defaultSettings: Settings = {
  theme: 'dark',
  fontSize: 18,
  fontFamily: 'default',
  lineHeight: 2,
  autoTheme: false,
}

const SettingsContext = createContext<SettingsContextType | null>(null)

// Helper to get theme based on time of day
function getThemeForTime(): 'light' | 'dark' {
  const hour = new Date().getHours()
  return hour >= 6 && hour < 18 ? 'light' : 'dark'
}

function getAutoThemeStatus(): { theme: 'light' | 'dark'; label: string } {
  const theme = getThemeForTime()
  return theme === 'light'
    ? { theme, label: 'Currently: Light (daytime)' }
    : { theme, label: 'Currently: Dark (night time)' }
}

// Default context value for SSR/SSG (when provider isn't mounted yet)
const defaultContextValue: SettingsContextType = {
  settings: defaultSettings,
  setTheme: () => {},
  setFontSize: () => {},
  setFontFamily: () => {},
  setLineHeight: () => {},
  setAutoTheme: () => {},
  autoThemeStatus: null,
  isSettingsOpen: false,
  openSettings: () => {},
  closeSettings: () => {},
}

export function useSettings() {
  const context = useContext(SettingsContext)
  // Return default values during SSR/SSG instead of throwing
  if (!context) {
    return defaultContextValue
  }
  return context
}

const STORAGE_KEY = 'biblical-alignment-settings'

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [autoThemeStatus, setAutoThemeStatus] = useState<{ theme: 'light' | 'dark'; label: string } | null>(null)
  const manualOverride = useRef(false)
  const lastAutoTheme = useRef<'light' | 'dark' | null>(null)

  // Load settings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setSettings({ ...defaultSettings, ...parsed })
      } catch {
        // Invalid JSON, use defaults
      }
    }
    setMounted(true)
  }, [])

  // Auto theme logic
  const checkAndApplyAutoTheme = useCallback(() => {
    if (!settings.autoTheme || manualOverride.current) return

    const status = getAutoThemeStatus()
    setAutoThemeStatus(status)

    if (status.theme !== lastAutoTheme.current) {
      lastAutoTheme.current = status.theme
      setSettings(s => ({ ...s, theme: status.theme }))
    }
  }, [settings.autoTheme])

  // Update status display and check theme every minute
  useEffect(() => {
    if (!mounted) return

    if (settings.autoTheme) {
      // Update status immediately
      setAutoThemeStatus(getAutoThemeStatus())
      // Apply theme if not overridden
      if (!manualOverride.current) {
        checkAndApplyAutoTheme()
      }

      // Check every minute
      const interval = setInterval(() => {
        const status = getAutoThemeStatus()
        setAutoThemeStatus(status)
        if (!manualOverride.current && status.theme !== lastAutoTheme.current) {
          lastAutoTheme.current = status.theme
          setSettings(s => ({ ...s, theme: status.theme }))
        }
      }, 60 * 1000)

      return () => clearInterval(interval)
    } else {
      setAutoThemeStatus(null)
      manualOverride.current = false
      lastAutoTheme.current = null
    }
  }, [mounted, settings.autoTheme, checkAndApplyAutoTheme])

  // Save settings to localStorage and apply to document
  useEffect(() => {
    if (!mounted) return

    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))

    // Apply theme to html element
    const html = document.documentElement
    html.classList.remove('theme-light', 'theme-dark', 'theme-sepia')
    html.classList.add(`theme-${settings.theme}`)

    // Apply CSS variables
    html.style.setProperty('--scripture-font-size', `${settings.fontSize}px`)
    html.style.setProperty('--scripture-line-height', `${settings.lineHeight}`)

    // Apply font family
    const fontMap: Record<FontFamily, string> = {
      default: 'var(--font-family-body)',
      serif: 'var(--font-family-display)',
      dyslexia: '"OpenDyslexic", var(--font-family-body)',
    }
    html.style.setProperty('--scripture-font-family', fontMap[settings.fontFamily])
  }, [settings, mounted])

  const setTheme = (theme: Theme) => {
    // If auto theme is on, this is a manual override
    if (settings.autoTheme) {
      manualOverride.current = true
    }
    setSettings(s => ({ ...s, theme }))
  }
  const setFontSize = (fontSize: number) => setSettings(s => ({ ...s, fontSize }))
  const setFontFamily = (fontFamily: FontFamily) => setSettings(s => ({ ...s, fontFamily }))
  const setLineHeight = (lineHeight: number) => setSettings(s => ({ ...s, lineHeight }))
  const setAutoTheme = (autoTheme: boolean) => {
    manualOverride.current = false
    lastAutoTheme.current = null
    if (autoTheme) {
      // Apply auto theme immediately when enabled
      const status = getAutoThemeStatus()
      lastAutoTheme.current = status.theme
      setSettings(s => ({ ...s, autoTheme, theme: status.theme }))
    } else {
      setSettings(s => ({ ...s, autoTheme }))
    }
  }

  const openSettings = () => setIsSettingsOpen(true)
  const closeSettings = () => setIsSettingsOpen(false)

  // Prevent flash of wrong theme
  if (!mounted) {
    return (
      <div className="opacity-0">
        {children}
      </div>
    )
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setTheme,
        setFontSize,
        setFontFamily,
        setLineHeight,
        setAutoTheme,
        autoThemeStatus,
        isSettingsOpen,
        openSettings,
        closeSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
