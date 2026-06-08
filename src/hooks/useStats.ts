import { useCallback, useEffect, useState } from 'react'
import { loadRaw, save, todayKey } from '../lib/storage'

const KEY = 'pomodoro.stats'

interface StatsState {
  /** date string -> completed focus sessions that day */
  byDay: Record<string, number>
  /** total focus minutes, all time */
  totalMinutes: number
}

const EMPTY: StatsState = { byDay: {}, totalMinutes: 0 }

export function useStats() {
  const [stats, setStats] = useState<StatsState>(() => loadRaw<StatsState>(KEY, EMPTY))

  useEffect(() => save(KEY, stats), [stats])

  /** Record a completed focus session of `minutes` length. */
  const recordFocus = useCallback((minutes: number) => {
    const day = todayKey()
    setStats((s) => ({
      byDay: { ...s.byDay, [day]: (s.byDay[day] ?? 0) + 1 },
      totalMinutes: s.totalMinutes + minutes,
    }))
  }, [])

  const today = stats.byDay[todayKey()] ?? 0
  const allTime = Object.values(stats.byDay).reduce((a, b) => a + b, 0)

  return { today, allTime, totalMinutes: stats.totalMinutes, recordFocus }
}
