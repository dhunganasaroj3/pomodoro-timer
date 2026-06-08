interface Props {
  isRunning: boolean
  onToggle: () => void
  onReset: () => void
  onSkip: () => void
}

export function Controls({ isRunning, onToggle, onReset, onSkip }: Props) {
  return (
    <div className="controls">
      <button className="btn btn-secondary" onClick={onReset} aria-label="Reset (R)" title="Reset (R)">
        ↺
      </button>
      <button className="btn btn-primary" onClick={onToggle} aria-label={isRunning ? 'Pause (Space)' : 'Start (Space)'}>
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button className="btn btn-secondary" onClick={onSkip} aria-label="Skip (S)" title="Skip (S)">
        ⏭
      </button>
    </div>
  )
}
