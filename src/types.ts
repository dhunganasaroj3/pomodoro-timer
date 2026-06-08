export type Mode = 'work' | 'short' | 'long'

export interface Settings {
  /** durations in minutes */
  work: number
  short: number
  long: number
  /** completed work sessions before a long break */
  roundsBeforeLong: number
  autoStartBreaks: boolean
  autoStartWork: boolean
  soundEnabled: boolean
  notificationsEnabled: boolean
  tickingEnabled: boolean
}

export interface Task {
  id: string
  title: string
  done: boolean
  /** estimated pomodoros */
  estimate: number
  /** completed pomodoros */
  completed: number
}

export type Theme = 'light' | 'dark' | 'system'

export const DEFAULT_SETTINGS: Settings = {
  work: 25,
  short: 5,
  long: 15,
  roundsBeforeLong: 4,
  autoStartBreaks: true,
  autoStartWork: false,
  soundEnabled: true,
  notificationsEnabled: true,
  tickingEnabled: false,
}

export const MODE_LABEL: Record<Mode, string> = {
  work: 'Focus',
  short: 'Short Break',
  long: 'Long Break',
}
