import { useState } from 'react'
import type { Task } from '../types'

interface Props {
  tasks: Task[]
  activeId: string | null
  onAdd: (title: string, estimate: number) => void
  onToggleDone: (id: string) => void
  onRemove: (id: string) => void
  onSetActive: (id: string) => void
  onClearCompleted: () => void
}

export function TaskList({
  tasks,
  activeId,
  onAdd,
  onToggleDone,
  onRemove,
  onSetActive,
  onClearCompleted,
}: Props) {
  const [title, setTitle] = useState('')
  const [estimate, setEstimate] = useState(1)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(title, estimate)
    setTitle('')
    setEstimate(1)
  }

  const hasDone = tasks.some((t) => t.done)

  return (
    <section className="tasks" aria-label="Tasks">
      <div className="tasks-head">
        <h2>Tasks</h2>
        {hasDone && (
          <button className="btn btn-ghost btn-sm" onClick={onClearCompleted}>
            Clear done
          </button>
        )}
      </div>

      <form className="task-add" onSubmit={submit}>
        <input
          type="text"
          placeholder="What are you working on?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Task name"
        />
        <input
          type="number"
          min={1}
          max={20}
          value={estimate}
          onChange={(e) => setEstimate(Math.max(1, Number(e.target.value) || 1))}
          aria-label="Estimated pomodoros"
          title="Estimated pomodoros"
        />
        <button className="btn btn-primary btn-sm" type="submit" aria-label="Add task">
          +
        </button>
      </form>

      <ul className="task-items">
        {tasks.length === 0 && <li className="task-empty">No tasks yet — add one to track pomodoros.</li>}
        {tasks.map((t) => (
          <li key={t.id} className={`task-item ${t.id === activeId ? 'active' : ''} ${t.done ? 'done' : ''}`}>
            <input
              type="checkbox"
              checked={t.done}
              onChange={() => onToggleDone(t.id)}
              aria-label={`Mark ${t.title} done`}
            />
            <button className="task-title" onClick={() => onSetActive(t.id)} title="Set as active task">
              {t.title}
            </button>
            <span className="task-count" title="Completed / estimated">
              {t.completed}/{t.estimate}
            </span>
            <button className="task-remove" onClick={() => onRemove(t.id)} aria-label={`Remove ${t.title}`}>
              ✕
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
