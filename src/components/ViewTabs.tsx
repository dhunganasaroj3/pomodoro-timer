export type View = 'pomodoro' | 'stopwatch'

const VIEWS: { id: View; label: string }[] = [
  { id: 'pomodoro', label: '🍅 Pomodoro' },
  { id: 'stopwatch', label: '⏱️ Stopwatch' },
]

interface Props {
  view: View
  onSwitch: (view: View) => void
}

export function ViewTabs({ view, onSwitch }: Props) {
  return (
    <div className="mode-tabs" role="tablist" aria-label="Timer view">
      {VIEWS.map((v) => (
        <button
          key={v.id}
          role="tab"
          aria-selected={view === v.id}
          className={`mode-tab ${view === v.id ? 'active' : ''}`}
          onClick={() => onSwitch(v.id)}
        >
          {v.label}
        </button>
      ))}
    </div>
  )
}
