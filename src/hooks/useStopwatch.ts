import { useCallback, useEffect, useRef, useState } from 'react'
import { loadRaw, save } from '../lib/storage'

const PERSIST_KEY = 'pomodoro.stopwatch'

interface PersistedStopwatch {
  elapsedSeconds: number
}

/**
 * Count-up stopwatch. Mirrors useTimer's drift-free rAF + performance.now()
 * pattern, inverted: elapsed time is derived from a start baseline so it stays
 * accurate even if frames are dropped or the tab is backgrounded.
 */
export function useStopwatch() {
  const persisted = loadRaw<PersistedStopwatch>(PERSIST_KEY, { elapsedSeconds: 0 })

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(persisted.elapsedSeconds)
  const [isRunning, setIsRunning] = useState(false)

  // Baseline timestamp such that elapsed = now - startRef. Null while paused.
  const startRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const lastWholeRef = useRef(elapsedSeconds)

  // Persist a lightweight snapshot so a refresh resumes where you left off
  // (paused — we never persist isRunning, matching useTimer).
  useEffect(() => {
    save<PersistedStopwatch>(PERSIST_KEY, { elapsedSeconds })
  }, [elapsedSeconds])

  const stopLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  // The animation-frame loop computes elapsed time from the start baseline.
  useEffect(() => {
    if (!isRunning) {
      stopLoop()
      return
    }
    if (startRef.current == null) {
      startRef.current = performance.now() - lastWholeRef.current * 1000
    }
    const loop = () => {
      const base = startRef.current
      if (base == null) return
      const elapsed = Math.max(0, Math.floor((performance.now() - base) / 1000))
      if (elapsed !== lastWholeRef.current) {
        lastWholeRef.current = elapsed
        setElapsedSeconds(elapsed)
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return stopLoop
  }, [isRunning, stopLoop])

  const start = useCallback(() => {
    startRef.current = performance.now() - lastWholeRef.current * 1000
    setIsRunning(true)
  }, [])

  const pause = useCallback(() => {
    if (startRef.current != null) {
      const elapsed = Math.max(0, Math.floor((performance.now() - startRef.current) / 1000))
      setElapsedSeconds(elapsed)
      lastWholeRef.current = elapsed
    }
    startRef.current = null
    setIsRunning(false)
  }, [])

  const toggle = useCallback(() => {
    setIsRunning((r) => {
      if (r) {
        if (startRef.current != null) {
          const elapsed = Math.max(0, Math.floor((performance.now() - startRef.current) / 1000))
          setElapsedSeconds(elapsed)
          lastWholeRef.current = elapsed
        }
        startRef.current = null
        return false
      }
      startRef.current = performance.now() - lastWholeRef.current * 1000
      return true
    })
  }, [])

  const reset = useCallback(() => {
    startRef.current = null
    setIsRunning(false)
    setElapsedSeconds(0)
    lastWholeRef.current = 0
  }, [])

  return { elapsedSeconds, isRunning, start, pause, toggle, reset }
}
