import { useCallback, useEffect, useRef, useState } from 'react'
import type { Mode, Settings } from '../types'
import { loadRaw, save } from '../lib/storage'

const PERSIST_KEY = 'pomodoro.timer'

interface PersistedTimer {
  mode: Mode
  round: number
  secondsLeft: number
}

interface UseTimerOptions {
  settings: Settings
  /** Called when a session reaches zero. `completedMode` is the mode that just ended. */
  onComplete: (completedMode: Mode, nextMode: Mode) => void
  /** Called once per second during the final 3s, for ticking sound. */
  onTick?: (secondsLeft: number) => void
}

function durationFor(mode: Mode, s: Settings): number {
  return (mode === 'work' ? s.work : mode === 'short' ? s.short : s.long) * 60
}

/**
 * Decide the next mode given the mode that just finished.
 * After every `roundsBeforeLong` work sessions, take a long break.
 */
function nextMode(completed: Mode, round: number, s: Settings): { mode: Mode; round: number } {
  if (completed === 'work') {
    const newRound = round + 1
    if (newRound % s.roundsBeforeLong === 0) return { mode: 'long', round: newRound }
    return { mode: 'short', round: newRound }
  }
  return { mode: 'work', round }
}

export function useTimer({ settings, onComplete, onTick }: UseTimerOptions) {
  const persisted = loadRaw<PersistedTimer | null>(PERSIST_KEY, null)

  const [mode, setMode] = useState<Mode>(persisted?.mode ?? 'work')
  const [round, setRound] = useState<number>(persisted?.round ?? 0)
  const [secondsLeft, setSecondsLeft] = useState<number>(
    persisted?.secondsLeft ?? durationFor('work', settings),
  )
  const [isRunning, setIsRunning] = useState(false)

  // Target end timestamp for drift-free countdown.
  const targetRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  // Keep latest callbacks/state without re-arming the loop each tick.
  const cbRef = useRef({ onComplete, onTick })
  cbRef.current = { onComplete, onTick }
  const modeRef = useRef(mode)
  modeRef.current = mode
  const roundRef = useRef(round)
  roundRef.current = round
  const lastWholeRef = useRef(secondsLeft)

  const totalSeconds = durationFor(mode, settings)

  // Persist a lightweight snapshot so a refresh resumes where you left off.
  useEffect(() => {
    save<PersistedTimer>(PERSIST_KEY, { mode, round, secondsLeft })
  }, [mode, round, secondsLeft])

  const stopLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const advance = useCallback(
    (completed: Mode) => {
      const { mode: next, round: nextRound } = nextMode(completed, roundRef.current, settings)
      setRound(nextRound)
      setMode(next)
      setSecondsLeft(durationFor(next, settings))
      lastWholeRef.current = durationFor(next, settings)
      cbRef.current.onComplete(completed, next)
      // Auto-start the next session if configured.
      const shouldAuto = next === 'work' ? settings.autoStartWork : settings.autoStartBreaks
      if (shouldAuto) {
        targetRef.current = performance.now() + durationFor(next, settings) * 1000
        setIsRunning(true)
      } else {
        targetRef.current = null
        setIsRunning(false)
      }
    },
    [settings],
  )

  // The animation-frame loop computes remaining time from the target timestamp.
  useEffect(() => {
    if (!isRunning) {
      stopLoop()
      return
    }
    if (targetRef.current == null) {
      targetRef.current = performance.now() + secondsLeft * 1000
    }
    const loop = () => {
      const target = targetRef.current
      if (target == null) return
      const remainingMs = target - performance.now()
      const remaining = Math.max(0, Math.ceil(remainingMs / 1000))
      if (remaining !== lastWholeRef.current) {
        lastWholeRef.current = remaining
        setSecondsLeft(remaining)
        if (remaining > 0 && remaining <= 3) cbRef.current.onTick?.(remaining)
      }
      if (remainingMs <= 0) {
        stopLoop()
        advance(modeRef.current)
        return
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return stopLoop
    // secondsLeft intentionally omitted: target drives the countdown.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, advance, stopLoop])

  const start = useCallback(() => {
    targetRef.current = performance.now() + secondsLeft * 1000
    setIsRunning(true)
  }, [secondsLeft])

  const pause = useCallback(() => {
    // Freeze remaining time so resume is exact.
    if (targetRef.current != null) {
      const remaining = Math.max(0, Math.ceil((targetRef.current - performance.now()) / 1000))
      setSecondsLeft(remaining)
      lastWholeRef.current = remaining
    }
    targetRef.current = null
    setIsRunning(false)
  }, [])

  const toggle = useCallback(() => {
    setIsRunning((r) => {
      if (r) {
        if (targetRef.current != null) {
          const remaining = Math.max(0, Math.ceil((targetRef.current - performance.now()) / 1000))
          setSecondsLeft(remaining)
          lastWholeRef.current = remaining
        }
        targetRef.current = null
        return false
      }
      targetRef.current = performance.now() + lastWholeRef.current * 1000
      return true
    })
  }, [])

  const reset = useCallback(() => {
    targetRef.current = null
    setIsRunning(false)
    const d = durationFor(mode, settings)
    setSecondsLeft(d)
    lastWholeRef.current = d
  }, [mode, settings])

  /** Skip to the next session without recording the current one as a focus completion. */
  const skip = useCallback(() => {
    targetRef.current = null
    setIsRunning(false)
    const { mode: next, round: nextRound } = nextMode(mode, round, settings)
    setRound(nextRound)
    setMode(next)
    const d = durationFor(next, settings)
    setSecondsLeft(d)
    lastWholeRef.current = d
  }, [mode, round, settings])

  /** Manually jump to a specific mode (used by the mode tabs). */
  const switchMode = useCallback(
    (target: Mode) => {
      targetRef.current = null
      setIsRunning(false)
      setMode(target)
      const d = durationFor(target, settings)
      setSecondsLeft(d)
      lastWholeRef.current = d
    },
    [settings],
  )

  // When durations change in settings and the timer is idle, reflect the new length.
  useEffect(() => {
    if (!isRunning && targetRef.current == null) {
      const d = durationFor(mode, settings)
      setSecondsLeft(d)
      lastWholeRef.current = d
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.work, settings.short, settings.long])

  return {
    mode,
    round,
    secondsLeft,
    totalSeconds,
    isRunning,
    progress: totalSeconds > 0 ? 1 - secondsLeft / totalSeconds : 0,
    start,
    pause,
    toggle,
    reset,
    skip,
    switchMode,
  }
}
