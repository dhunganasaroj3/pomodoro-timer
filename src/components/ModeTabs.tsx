import type { Mode } from '../types'
import { MODE_LABEL } from '../types'

const MODES: Mode[] = ['work', 'short', 'long']

interface Props {
  mode: Mode
  onSwitch: (mode: Mode) => void
}

export function ModeTabs({ mode, onSwitch }: Props) {
  return (
    <div className="mode-tabs" role="tablist" aria-label="Timer mode">
      {MODES.map((m) => (
        <button
          key={m}
          role="tab"
          aria-selected={mode === m}
          className={`mode-tab ${mode === m ? 'active' : ''}`}
          onClick={() => onSwitch(m)}
        >
          {MODE_LABEL[m]}
        </button>
      ))}
    </div>
  )
}
