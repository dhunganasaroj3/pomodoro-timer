import { formatStopwatch } from '../lib/format'

interface Props {
  elapsedSeconds: number
  isRunning: boolean
  onToggle: () => void
  onReset: () => void
}

export function StopwatchView({ elapsedSeconds, isRunning, onToggle, onReset }: Props) {
  return (
    <div className="stopwatch">
      <div className="ring-center stopwatch-display">
        <span className="ring-mode">Stopwatch</span>
        <span className="ring-time" aria-live="off">
          {formatStopwatch(elapsedSeconds)}
        </span>
        <span className="ring-status">{isRunning ? 'running' : 'paused'}</span>
      </div>

      <div className="controls">
        <button className="btn btn-secondary" onClick={onReset} aria-label="Reset (R)" title="Reset (R)">
          ↺
        </button>
        <button
          className="btn btn-primary"
          onClick={onToggle}
          aria-label={isRunning ? 'Pause (Space)' : 'Start (Space)'}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
      </div>
    </div>
  )
}
