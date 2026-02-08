'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ActivePlan {
  planId: string
  startedAt: string
  completedDays: number[] // Array of day numbers completed
  currentStreak: number
  lastReadDate: string // ISO date string (YYYY-MM-DD)
}

interface ReadingPlanState {
  activePlan: ActivePlan | null
  startPlan: (planId: string) => void
  completeDay: (day: number) => void
  uncompleteDay: (day: number) => void
  isDayCompleted: (day: number) => boolean
  resetPlan: () => void
  getProgress: () => { completed: number; total: number; percent: number } | null
}

function getTodayStr(): string {
  return new Date().toISOString().split('T')[0]
}

export const useReadingPlanStore = create<ReadingPlanState>()(
  persist(
    (set, get) => ({
      activePlan: null,

      startPlan: (planId) => {
        set({
          activePlan: {
            planId,
            startedAt: new Date().toISOString(),
            completedDays: [],
            currentStreak: 0,
            lastReadDate: '',
          },
        })
      },

      completeDay: (day) => {
        const plan = get().activePlan
        if (!plan) return

        const today = getTodayStr()
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split('T')[0]

        const newStreak = plan.lastReadDate === yesterdayStr || plan.lastReadDate === today
          ? plan.currentStreak + (plan.lastReadDate === today ? 0 : 1)
          : 1

        set({
          activePlan: {
            ...plan,
            completedDays: plan.completedDays.includes(day)
              ? plan.completedDays
              : [...plan.completedDays, day].sort((a, b) => a - b),
            currentStreak: newStreak,
            lastReadDate: today,
          },
        })
      },

      uncompleteDay: (day) => {
        const plan = get().activePlan
        if (!plan) return

        set({
          activePlan: {
            ...plan,
            completedDays: plan.completedDays.filter(d => d !== day),
          },
        })
      },

      isDayCompleted: (day) => {
        return get().activePlan?.completedDays.includes(day) ?? false
      },

      resetPlan: () => {
        set({ activePlan: null })
      },

      getProgress: () => {
        const plan = get().activePlan
        if (!plan) return null

        // We need total from the plan data, use completedDays length for now
        const completed = plan.completedDays.length
        return { completed, total: 0, percent: 0 }
      },
    }),
    {
      name: 'biblical-alignment-reading-plan',
    }
  )
)
