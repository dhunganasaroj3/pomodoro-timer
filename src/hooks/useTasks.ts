import { useCallback, useEffect, useState } from 'react'
import type { Task } from '../types'
import { loadRaw, save } from '../lib/storage'

const KEY = 'pomodoro.tasks'
const ACTIVE_KEY = 'pomodoro.activeTask'

function uid(): string {
  // Date/crypto-free-ish unique id; crypto.randomUUID is fine in the browser.
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + performance.now().toString(36)
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => loadRaw<Task[]>(KEY, []))
  const [activeId, setActiveId] = useState<string | null>(() => loadRaw<string | null>(ACTIVE_KEY, null))

  useEffect(() => save(KEY, tasks), [tasks])
  useEffect(() => save(ACTIVE_KEY, activeId), [activeId])

  const addTask = useCallback((title: string, estimate = 1) => {
    const trimmed = title.trim()
    if (!trimmed) return
    setTasks((t) => {
      const task: Task = { id: uid(), title: trimmed, done: false, estimate, completed: 0 }
      // First task added becomes active automatically.
      if (t.length === 0) setActiveId(task.id)
      return [...t, task]
    })
  }, [])

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setTasks((t) => t.map((task) => (task.id === id ? { ...task, ...patch } : task)))
  }, [])

  const removeTask = useCallback((id: string) => {
    setTasks((t) => t.filter((task) => task.id !== id))
    setActiveId((curr) => (curr === id ? null : curr))
  }, [])

  const toggleDone = useCallback((id: string) => {
    setTasks((t) => t.map((task) => (task.id === id ? { ...task, done: !task.done } : task)))
  }, [])

  const clearCompleted = useCallback(() => {
    setTasks((t) => t.filter((task) => !task.done))
  }, [])

  /** Increment the active task's completed-pomodoro count. */
  const incrementActive = useCallback(() => {
    setActiveId((id) => {
      if (id) setTasks((t) => t.map((task) => (task.id === id ? { ...task, completed: task.completed + 1 } : task)))
      return id
    })
  }, [])

  const activeTask = tasks.find((t) => t.id === activeId) ?? null

  return {
    tasks,
    activeId,
    activeTask,
    setActiveId,
    addTask,
    updateTask,
    removeTask,
    toggleDone,
    clearCompleted,
    incrementActive,
  }
}
