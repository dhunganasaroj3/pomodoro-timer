import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_SETTINGS, type Settings } from '../types'
import { load, save } from '../lib/storage'

const KEY = 'pomodoro.settings'

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => load(KEY, DEFAULT_SETTINGS))

  useEffect(() => {
    save(KEY, settings)
  }, [settings])

  const update = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }))
  }, [])

  const reset = useCallback(() => setSettings(DEFAULT_SETTINGS), [])

  return { settings, update, reset }
}
