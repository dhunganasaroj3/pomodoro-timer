import { useCallback, useEffect, useState } from 'react'
import { TimerRing } from './components/TimerRing'
import { ModeTabs } from './components/ModeTabs'
import { Controls } from './components/Controls'
import { SettingsPanel } from './components/SettingsPanel'
import { TaskList } from './components/TaskList'
import { StatsBar } from './components/StatsBar'
import { ThemeToggle } from './components/ThemeToggle'
import { useSettings } from './hooks/useSettings'
import { useTheme } from './hooks/useTheme'
import { useTasks } from './hooks/useTasks'
import { useStats } from './hooks/useStats'
import { useTimer } from './hooks/useTimer'
import {
  SESSION_DONE_MESSAGE,
  ensureNotificationPermission,
  playChime,
  playTick,
  sendNotification,
  unlockAudio,
} from './lib/notify'
import { formatTime } from './lib/format'
import { MODE_LABEL, type Mode } from './types'

export default function App() {
  const { settings, update, reset: resetSettings } = useSettings()
  const { theme, cycle } = useTheme()
  const tasks = useTasks()
  const stats = useStats()
  const [settingsOpen, setSettingsOpen] = useState(false)

  const handleComplete = useCallback(
    (completed: Mode) => {
      if (settings.soundEnabled) playChime()
      if (settings.notificationsEnabled) {
        sendNotification(`${MODE_LABEL[completed]} done`, SESSION_DONE_MESSAGE[completed])
      }
      if (completed === 'work') {
        stats.recordFocus(settings.work)
        tasks.incrementActive()
      }
    },
    [settings.soundEnabled, settings.notificationsEnabled, settings.work, stats, tasks],
  )

  const handleTick = useCallback(
    (s: number) => {
      if (settings.tickingEnabled && settings.soundEnabled && s > 0) playTick()
    },
    [settings.tickingEnabled, settings.soundEnabled],
  )

  const timer = useTimer({ settings, onComplete: handleComplete, onTick: handleTick })

  const onToggle = useCallback(() => {
    unlockAudio()
    if (settings.notificationsEnabled) void ensureNotificationPermission()
    timer.toggle()
  }, [settings.notificationsEnabled, timer])

  // Live countdown in the tab title.
  useEffect(() => {
    const label = MODE_LABEL[timer.mode]
    document.title = timer.isRunning
      ? `${formatTime(timer.secondsLeft)} · ${label}`
      : `${label} · Pomodoro`
  }, [timer.secondsLeft, timer.isRunning, timer.mode])

  // Keyboard shortcuts: Space=toggle, R=reset, S=skip.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return
      if (e.code === 'Space') {
        e.preventDefault()
        onToggle()
      } else if (e.key.toLowerCase() === 'r') {
        timer.reset()
      } else if (e.key.toLowerCase() === 's') {
        timer.skip()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onToggle, timer])

  return (
    <div className="app" data-mode={timer.mode}>
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">🍅</span>
          <span className="brand-name">Pomodoro</span>
        </div>
        <div className="topbar-actions">
          <ThemeToggle theme={theme} onCycle={cycle} />
          <button className="icon-btn" onClick={() => setSettingsOpen(true)} aria-label="Open settings">
            ⚙️
          </button>
        </div>
      </header>

      <main className="main">
        <ModeTabs mode={timer.mode} onSwitch={timer.switchMode} />

        <TimerRing
          secondsLeft={timer.secondsLeft}
          progress={timer.progress}
          mode={timer.mode}
          isRunning={timer.isRunning}
          round={timer.round}
          roundsBeforeLong={settings.roundsBeforeLong}
        />

        {tasks.activeTask && (
          <p className="now-focus">
            Focusing on <strong>{tasks.activeTask.title}</strong>
          </p>
        )}

        <Controls isRunning={timer.isRunning} onToggle={onToggle} onReset={timer.reset} onSkip={timer.skip} />

        <StatsBar today={stats.today} allTime={stats.allTime} totalMinutes={stats.totalMinutes} />

        <TaskList
          tasks={tasks.tasks}
          activeId={tasks.activeId}
          onAdd={tasks.addTask}
          onToggleDone={tasks.toggleDone}
          onRemove={tasks.removeTask}
          onSetActive={tasks.setActiveId}
          onClearCompleted={tasks.clearCompleted}
        />
      </main>

      <footer className="footer">
        <span>Space: start/pause · R: reset · S: skip</span>
      </footer>

      {settingsOpen && (
        <SettingsPanel
          settings={settings}
          onUpdate={update}
          onReset={resetSettings}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  )
}
