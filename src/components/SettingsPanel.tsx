import type { Settings } from '../types'

interface Props {
  settings: Settings
  onUpdate: <K extends keyof Settings>(key: K, value: Settings[K]) => void
  onReset: () => void
  onClose: () => void
}

function NumberField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  onChange: (v: number) => void
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value)
          if (!Number.isNaN(n)) onChange(Math.min(max, Math.max(min, n)))
        }}
      />
    </label>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="toggle">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="switch" aria-hidden="true" />
    </label>
  )
}

export function SettingsPanel({ settings, onUpdate, onReset, onClose }: Props) {
  return (
    <div className="panel-backdrop" onClick={onClose}>
      <div className="panel" role="dialog" aria-modal="true" aria-label="Settings" onClick={(e) => e.stopPropagation()}>
        <div className="panel-head">
          <h2>Settings</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close settings">
            ✕
          </button>
        </div>

        <h3 className="panel-section">Durations (minutes)</h3>
        <div className="grid">
          <NumberField label="Focus" value={settings.work} min={1} max={180} onChange={(v) => onUpdate('work', v)} />
          <NumberField label="Short break" value={settings.short} min={1} max={60} onChange={(v) => onUpdate('short', v)} />
          <NumberField label="Long break" value={settings.long} min={1} max={90} onChange={(v) => onUpdate('long', v)} />
          <NumberField
            label="Rounds / long break"
            value={settings.roundsBeforeLong}
            min={2}
            max={12}
            onChange={(v) => onUpdate('roundsBeforeLong', v)}
          />
        </div>

        <h3 className="panel-section">Automation</h3>
        <Toggle label="Auto-start breaks" checked={settings.autoStartBreaks} onChange={(v) => onUpdate('autoStartBreaks', v)} />
        <Toggle label="Auto-start focus" checked={settings.autoStartWork} onChange={(v) => onUpdate('autoStartWork', v)} />

        <h3 className="panel-section">Alerts</h3>
        <Toggle label="Sound chime" checked={settings.soundEnabled} onChange={(v) => onUpdate('soundEnabled', v)} />
        <Toggle label="Ticking (last 3s)" checked={settings.tickingEnabled} onChange={(v) => onUpdate('tickingEnabled', v)} />
        <Toggle
          label="Interval chime"
          checked={settings.intervalChimeEnabled}
          onChange={(v) => onUpdate('intervalChimeEnabled', v)}
        />
        <div className="grid">
          <NumberField
            label="Chime every (min)"
            value={settings.intervalChimeMinutes}
            min={1}
            max={120}
            onChange={(v) => onUpdate('intervalChimeMinutes', v)}
          />
        </div>
        <Toggle
          label="Desktop notifications"
          checked={settings.notificationsEnabled}
          onChange={(v) => onUpdate('notificationsEnabled', v)}
        />

        <button className="btn btn-ghost panel-reset" onClick={onReset}>
          Reset to defaults
        </button>
      </div>
    </div>
  )
}
