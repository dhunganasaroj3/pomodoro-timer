import { formatTime } from '../lib/format'
import type { Mode } from '../types'
import { MODE_LABEL } from '../types'

interface Props {
  secondsLeft: number
  progress: number // 0..1
  mode: Mode
  isRunning: boolean
  round: number
  roundsBeforeLong: number
}

const SIZE = 280
const STROKE = 14
const R = (SIZE - STROKE) / 2
const CIRC = 2 * Math.PI * R

export function TimerRing({ secondsLeft, progress, mode, isRunning, round, roundsBeforeLong }: Props) {
  const offset = CIRC * (1 - Math.min(1, Math.max(0, progress)))
  const completedInCycle = round % roundsBeforeLong

  return (
    <div className="ring" data-mode={mode}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={`${MODE_LABEL[mode]} timer`}>
        <circle className="ring-track" cx={SIZE / 2} cy={SIZE / 2} r={R} strokeWidth={STROKE} fill="none" />
        <circle
          className="ring-progress"
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          strokeWidth={STROKE}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      </svg>
      <div className="ring-center">
        <span className="ring-mode">{MODE_LABEL[mode]}</span>
        <span className="ring-time" aria-live="off">
          {formatTime(secondsLeft)}
        </span>
        <span className="ring-status">{isRunning ? 'running' : 'paused'}</span>
        <div className="ring-dots" aria-hidden="true">
          {Array.from({ length: roundsBeforeLong }).map((_, i) => (
            <span key={i} className={`dot ${i < completedInCycle ? 'dot-on' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
