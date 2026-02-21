'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MAX_HISTORY = 20

export interface SearchHistoryEntry {
  query: string
  displayQuery: string
  timestamp: number
  resultCount: number
}

interface SearchHistoryState {
  history: SearchHistoryEntry[]
  addSearch: (query: string, resultCount: number) => void
  removeSearch: (query: string) => void
  clearAll: () => void
}

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set, get) => ({
      history: [],

      addSearch: (query, resultCount) => {
        const normalized = query.trim().toLowerCase()
        if (!normalized || normalized.length < 2) return

        const existing = get().history
        const filtered = existing.filter(
          e => e.query !== normalized
        )

        const entry: SearchHistoryEntry = {
          query: normalized,
          displayQuery: query.trim(),
          timestamp: Date.now(),
          resultCount,
        }

        set({
          history: [entry, ...filtered].slice(0, MAX_HISTORY),
        })
      },

      removeSearch: (query) => {
        const normalized = query.trim().toLowerCase()
        set({
          history: get().history.filter(e => e.query !== normalized),
        })
      },

      clearAll: () => {
        set({ history: [] })
      },
    }),
    {
      name: 'biblical-alignment-search-history',
    }
  )
)
