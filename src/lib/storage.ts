/** Tiny typed localStorage helpers with safe fallback. */

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null) return fallback
    return { ...fallback, ...(JSON.parse(raw) as Partial<T>) } as T
  } catch {
    return fallback
  }
}

export function loadRaw<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore quota / private-mode errors */
  }
}

/** YYYY-MM-DD for "today" bucketing of stats. */
export function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}
