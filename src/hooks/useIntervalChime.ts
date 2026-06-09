import { useEffect } from 'react'
import { playChime } from '../lib/notify'

/**
 * Plays the chime every `intervalSeconds` while `active` and `enabled`.
 * Works for any running timer (Pomodoro or stopwatch) — the caller just passes
 * whether something is currently running. setInterval is adequate here: the
 * interval chime tolerates small drift, unlike the countdown itself.
 */
export function useIntervalChime(active: boolean, intervalSeconds: number, enabled: boolean): void {
  useEffect(() => {
    if (!active || !enabled || intervalSeconds <= 0) return
    const id = window.setInterval(() => playChime(), intervalSeconds * 1000)
    return () => window.clearInterval(id)
  }, [active, enabled, intervalSeconds])
}
