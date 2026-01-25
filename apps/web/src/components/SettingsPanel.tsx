'use client'

import { useEffect, useRef } from 'react'
import { useSettings } from '../app/providers'
import { CacheStatus } from './CacheStatus'

type Theme = 'light' | 'dark' | 'sepia'
type FontFamily = 'default' | 'serif' | 'dyslexia'

const themeOptions: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'sepia', label: 'Sepia' },
]

const fontFamilyOptions: { value: FontFamily; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'serif', label: 'Serif' },
  { value: 'dyslexia', label: 'Dyslexia-friendly' },
]

// Clock icon for auto theme toggle
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
        clipRule="evenodd"
      />
    </svg>
  )
}

// Sun icon for daytime
function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
        clipRule="evenodd"
      />
    </svg>
  )
}

// Moon icon for nighttime
function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>
  )
}

export function SettingsPanel() {
  const {
    settings,
    setTheme,
    setFontSize,
    setFontFamily,
    setLineHeight,
    setAutoTheme,
    autoThemeStatus,
    isSettingsOpen,
    closeSettings,
  } = useSettings()

  const panelRef = useRef<HTMLDivElement>(null)

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSettingsOpen) {
        closeSettings()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isSettingsOpen, closeSettings])

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node) && isSettingsOpen) {
        closeSettings()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isSettingsOpen, closeSettings])

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isSettingsOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isSettingsOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isSettingsOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        className={`fixed top-0 right-0 h-full w-full max-w-md theme-surface border-l theme-border theme-shadow-lg z-50 transform transition-transform duration-300 ease-out ${
          isSettingsOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b theme-border">
          <h2 className="text-lg font-semibold theme-text">Settings</h2>
          <button
            onClick={closeSettings}
            className="p-2 rounded-lg theme-text-muted hover:theme-text transition-colors"
            style={{ backgroundColor: 'var(--theme-surface-hover)' }}
            aria-label="Close settings"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 overflow-y-auto h-[calc(100%-65px)]">
          {/* Auto Theme Toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClockIcon className="h-4 w-4 theme-text-muted" />
                <label className="text-sm font-medium theme-text-muted">Auto Theme</label>
              </div>
              <button
                role="switch"
                aria-checked={settings.autoTheme}
                onClick={() => setAutoTheme(!settings.autoTheme)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2`}
                style={{
                  backgroundColor: settings.autoTheme ? 'var(--theme-accent)' : 'var(--theme-surface-alt)',
                }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out ${
                    settings.autoTheme ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            {settings.autoTheme && autoThemeStatus && (
              <div
                className="flex items-center gap-2 text-xs theme-text-muted px-3 py-2 rounded-lg"
                style={{ backgroundColor: 'var(--theme-surface-alt)' }}
              >
                {autoThemeStatus.theme === 'light' ? (
                  <SunIcon className="h-4 w-4 text-amber-500" />
                ) : (
                  <MoonIcon className="h-4 w-4 text-indigo-400" />
                )}
                <span>{autoThemeStatus.label}</span>
                <span className="ml-auto opacity-60">6am-6pm light, 6pm-6am dark</span>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <div className="space-y-3">
            <label className="block text-sm font-medium theme-text-muted">
              Theme {settings.autoTheme && <span className="text-xs opacity-60">(preview)</span>}
            </label>
            <div
              className={`flex rounded-lg p-1 transition-opacity duration-200 ${
                settings.autoTheme ? 'opacity-60' : ''
              }`}
              style={{ backgroundColor: 'var(--theme-surface-alt)' }}
            >
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${
                    settings.theme === option.value
                      ? 'theme-accent-bg shadow-sm'
                      : 'theme-text-muted'
                  }`}
                  style={settings.theme !== option.value ? { backgroundColor: 'transparent' } : {}}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {settings.autoTheme && (
              <p className="text-xs theme-text-muted opacity-60">
                Tap a theme to override auto-switching temporarily
              </p>
            )}
          </div>

          {/* Font Size Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium theme-text-muted">Font Size</label>
              <span className="text-sm theme-text-muted">{settings.fontSize}px</span>
            </div>
            <input
              type="range"
              min="14"
              max="24"
              step="1"
              value={settings.fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{ backgroundColor: 'var(--theme-input-border)', accentColor: 'var(--theme-accent)' }}
            />
            <div className="flex justify-between text-xs theme-text-muted">
              <span>14px</span>
              <span>24px</span>
            </div>
          </div>

          {/* Font Family Selector */}
          <div className="space-y-3">
            <label className="block text-sm font-medium theme-text-muted">Font Family</label>
            <div className="flex rounded-lg p-1" style={{ backgroundColor: 'var(--theme-surface-alt)' }}>
              {fontFamilyOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFontFamily(option.value)}
                  className={`flex-1 py-2 px-2 text-sm font-medium rounded-md transition-all ${
                    settings.fontFamily === option.value
                      ? 'theme-accent-bg shadow-sm'
                      : 'theme-text-muted'
                  }`}
                  style={settings.fontFamily !== option.value ? { backgroundColor: 'transparent' } : {}}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Line Height Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium theme-text-muted">Line Height</label>
              <span className="text-sm theme-text-muted">{settings.lineHeight.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="1.5"
              max="2.5"
              step="0.1"
              value={settings.lineHeight}
              onChange={(e) => setLineHeight(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{ backgroundColor: 'var(--theme-input-border)', accentColor: 'var(--theme-accent)' }}
            />
            <div className="flex justify-between text-xs theme-text-muted">
              <span>Compact</span>
              <span>Spacious</span>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-3 pt-4 border-t theme-border">
            <label className="block text-sm font-medium theme-text-muted">Preview</label>
            <div
              className="p-4 rounded-lg border theme-border"
              style={{
                fontSize: `${settings.fontSize}px`,
                lineHeight: settings.lineHeight,
                fontFamily:
                  settings.fontFamily === 'default'
                    ? 'inherit'
                    : settings.fontFamily === 'serif'
                    ? 'Georgia, serif'
                    : '"OpenDyslexic", sans-serif',
                backgroundColor: 'var(--theme-surface-alt)',
              }}
            >
              <p className="theme-text">
                In the beginning God created the heavens and the earth.
              </p>
              <p className="theme-text-muted text-sm mt-2" style={{ fontSize: '0.875rem' }}>
                — Genesis 1:1 (BSB)
              </p>
            </div>
          </div>

          {/* Offline Storage */}
          <div className="pt-4 border-t theme-border">
            <CacheStatus />
          </div>
        </div>
      </div>
    </>
  )
}
