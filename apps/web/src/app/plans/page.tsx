'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { NavBar } from '@/components/NavBar'
import { READING_PLANS, ReadingPlan } from '@/data/reading-plans'
import { useReadingPlanStore } from '@/stores/readingPlanStore'

export default function PlansPage() {
  const [mounted, setMounted] = useState(false)
  const { activePlan, startPlan, completeDay, uncompleteDay, isDayCompleted, resetPlan } = useReadingPlanStore()

  useEffect(() => { setMounted(true) }, [])

  const currentPlan = activePlan
    ? READING_PLANS.find(p => p.id === activePlan.planId)
    : null

  return (
    <main id="main-content" className="min-h-screen theme-bg">
      <NavBar />

      <div className="pt-24 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold theme-text mb-4">
              Reading Plans
            </h1>
            <p className="theme-text-muted text-lg">
              Structured plans to guide you through Scripture
            </p>
          </div>

          {/* Active Plan */}
          {mounted && currentPlan && activePlan && (
            <div className="mb-12">
              <h2 className="text-sm font-semibold uppercase tracking-wider theme-text-muted mb-4">
                Your Active Plan
              </h2>
              <ActivePlanCard
                plan={currentPlan}
                activePlan={activePlan}
                onCompleteDay={completeDay}
                onUncompleteDay={uncompleteDay}
                isDayCompleted={isDayCompleted}
                onReset={resetPlan}
              />
            </div>
          )}

          {/* Available Plans */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider theme-text-muted mb-4">
              {currentPlan ? 'Other Plans' : 'Choose a Plan'}
            </h2>
            <div className="space-y-4">
              {READING_PLANS.filter(p => p.id !== activePlan?.planId).map(plan => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onStart={() => startPlan(plan.id)}
                  hasActivePlan={!!activePlan}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function ActivePlanCard({
  plan,
  activePlan,
  onCompleteDay,
  onUncompleteDay,
  isDayCompleted,
  onReset,
}: {
  plan: ReadingPlan
  activePlan: { completedDays: number[]; currentStreak: number }
  onCompleteDay: (day: number) => void
  onUncompleteDay: (day: number) => void
  isDayCompleted: (day: number) => boolean
  onReset: () => void
}) {
  const [showAllDays, setShowAllDays] = useState(false)
  const completedCount = activePlan.completedDays.length
  const totalDays = plan.days.length
  const percent = Math.round((completedCount / totalDays) * 100)

  // Find next uncompleted day
  const nextDay = plan.days.find(d => !isDayCompleted(d.day))

  const displayDays = showAllDays ? plan.days : plan.days.slice(0, 7)

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        backgroundColor: 'var(--theme-surface)',
        borderColor: 'var(--theme-border)',
      }}
    >
      {/* Progress header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--theme-border)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{plan.icon}</span>
            <div>
              <h3 className="text-lg font-bold theme-text">{plan.name}</h3>
              <p className="text-sm theme-text-muted">
                {completedCount} of {totalDays} days complete
                {activePlan.currentStreak > 1 && ` · ${activePlan.currentStreak} day streak`}
              </p>
            </div>
          </div>
          <button
            onClick={onReset}
            className="text-xs theme-text-muted hover:text-red-500 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--theme-border)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${percent}%`,
              backgroundColor: 'var(--theme-accent)',
            }}
          />
        </div>
        <p className="text-xs theme-text-muted mt-1 text-right">{percent}%</p>
      </div>

      {/* Today's reading / next day */}
      {nextDay && (
        <div className="p-4 border-b" style={{ borderColor: 'var(--theme-border)', backgroundColor: 'var(--theme-surface-alt)' }}>
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--theme-accent)' }}>
            Next: Day {nextDay.day}
          </p>
          <div className="flex flex-wrap gap-2">
            {nextDay.readings.map((r, i) => (
              <Link
                key={i}
                href={`/read/${r.slug}/${r.chapter}`}
                className="text-sm font-medium px-3 py-1.5 rounded-lg border transition-colors hover:border-amber-400"
                style={{
                  borderColor: 'var(--theme-border)',
                  color: 'var(--theme-text)',
                }}
              >
                {r.book} {r.chapter}
              </Link>
            ))}
          </div>
          <button
            onClick={() => onCompleteDay(nextDay.day)}
            className="mt-3 w-full py-2.5 rounded-lg font-medium text-sm transition-all"
            style={{
              backgroundColor: 'var(--theme-accent)',
              color: 'white',
            }}
          >
            Mark Day {nextDay.day} Complete
          </button>
        </div>
      )}

      {/* Day list */}
      <div className="p-4">
        <div className="space-y-1">
          {displayDays.map(day => {
            const completed = isDayCompleted(day.day)
            return (
              <div
                key={day.day}
                className="flex items-center gap-3 py-2 px-3 rounded-lg transition-colors"
                style={{
                  opacity: completed ? 0.6 : 1,
                }}
              >
                <button
                  onClick={() => completed ? onUncompleteDay(day.day) : onCompleteDay(day.day)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                    completed ? 'border-green-500 bg-green-500' : ''
                  }`}
                  style={!completed ? { borderColor: 'var(--theme-border)' } : {}}
                  aria-label={completed ? `Unmark day ${day.day}` : `Complete day ${day.day}`}
                >
                  {completed && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>

                <span className="text-xs font-medium theme-text-muted w-12">Day {day.day}</span>

                <div className="flex flex-wrap gap-1.5 flex-1">
                  {day.readings.map((r, i) => (
                    <Link
                      key={i}
                      href={`/read/${r.slug}/${r.chapter}`}
                      className="text-xs theme-text hover:underline"
                      style={{ color: completed ? 'var(--theme-text-secondary)' : 'var(--theme-text)' }}
                    >
                      {r.book} {r.chapter}{i < day.readings.length - 1 ? ',' : ''}
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {plan.days.length > 7 && (
          <button
            onClick={() => setShowAllDays(!showAllDays)}
            className="mt-3 w-full text-center text-sm font-medium py-2 rounded-lg
              hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            style={{ color: 'var(--theme-accent)' }}
          >
            {showAllDays ? 'Show less' : `Show all ${plan.days.length} days`}
          </button>
        )}
      </div>
    </div>
  )
}

function PlanCard({
  plan,
  onStart,
  hasActivePlan,
}: {
  plan: ReadingPlan
  onStart: () => void
  hasActivePlan: boolean
}) {
  return (
    <div
      className="p-6 rounded-2xl border transition-all hover:shadow-md"
      style={{
        backgroundColor: 'var(--theme-surface)',
        borderColor: 'var(--theme-border)',
      }}
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl">{plan.icon}</span>
        <div className="flex-1">
          <h3 className="text-lg font-bold theme-text mb-1">{plan.name}</h3>
          <p className="text-sm theme-text-muted mb-3">{plan.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs theme-text-muted">{plan.duration} days</span>
            <button
              onClick={onStart}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-all"
              style={{
                backgroundColor: hasActivePlan ? 'var(--theme-surface-alt)' : 'var(--theme-accent)',
                color: hasActivePlan ? 'var(--theme-text)' : 'white',
                border: hasActivePlan ? '1px solid var(--theme-border)' : 'none',
              }}
            >
              {hasActivePlan ? 'Switch to this' : 'Start Plan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
