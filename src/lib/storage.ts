import { useCallback, useEffect, useState } from "react"

const KEY = "rehab-completed"

type Stored = {
  date: string
  codes: string[]
}

function today(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function load(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw) as Stored
    if (parsed.date !== today()) return new Set()
    return new Set(parsed.codes)
  } catch {
    return new Set()
  }
}

function save(codes: Set<string>) {
  const data: Stored = { date: today(), codes: Array.from(codes) }
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function useCompleted() {
  const [completed, setCompleted] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    setCompleted(load())
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setCompleted(load())
    }
    const onFocus = () => setCompleted(load())
    window.addEventListener("storage", onStorage)
    window.addEventListener("focus", onFocus)
    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener("focus", onFocus)
    }
  }, [])

  const toggle = useCallback((code: string) => {
    setCompleted((prev) => {
      const next = new Set(prev)
      if (next.has(code)) next.delete(code)
      else next.add(code)
      save(next)
      return next
    })
  }, [])

  const markDone = useCallback((code: string) => {
    setCompleted((prev) => {
      if (prev.has(code)) return prev
      const next = new Set(prev)
      next.add(code)
      save(next)
      return next
    })
  }, [])

  const clearAll = useCallback(() => {
    const empty = new Set<string>()
    save(empty)
    setCompleted(empty)
  }, [])

  return { completed, toggle, markDone, clearAll }
}
