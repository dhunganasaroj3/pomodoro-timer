import type { Theme } from '../types'

interface Props {
  theme: Theme
  onCycle: () => void
}

const ICON: Record<Theme, string> = { light: '☀️', dark: '🌙', system: '🖥️' }
const NEXT: Record<Theme, string> = { light: 'dark', dark: 'system', system: 'light' }

export function ThemeToggle({ theme, onCycle }: Props) {
  return (
    <button
      className="icon-btn"
      onClick={onCycle}
      aria-label={`Theme: ${theme}. Switch to ${NEXT[theme]}`}
      title={`Theme: ${theme}`}
    >
      {ICON[theme]}
    </button>
  )
}
