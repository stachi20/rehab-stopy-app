import { useEffect, useRef, useState } from "react"
import { Minus, Pause, Play, Plus, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  defaultSeconds: number
  label?: string
  onFinished?: () => void
}

function format(s: number): string {
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m.toString().padStart(2, "0")}:${r.toString().padStart(2, "0")}`
}

function beep() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
    osc.start()
    osc.stop(ctx.currentTime + 0.4)
  } catch {
    /* no-op */
  }
}

function vibrate(pattern: number | number[]) {
  if ("vibrate" in navigator) navigator.vibrate(pattern)
}

const PRESETS = [60, 120, 180]

export function Timer({ defaultSeconds, label, onFinished }: Props) {
  const [target, setTarget] = useState(defaultSeconds)
  const [remaining, setRemaining] = useState(defaultSeconds)
  const [running, setRunning] = useState(false)
  const finishedRef = useRef(false)

  useEffect(() => {
    setTarget(defaultSeconds)
    setRemaining(defaultSeconds)
    setRunning(false)
    finishedRef.current = false
  }, [defaultSeconds])

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (!finishedRef.current) {
            finishedRef.current = true
            beep()
            vibrate([200, 100, 200])
            onFinished?.()
          }
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [running, onFinished])

  useEffect(() => {
    if (remaining === 0 && running) setRunning(false)
  }, [remaining, running])

  const setTo = (s: number) => {
    const clamped = Math.max(5, s)
    setTarget(clamped)
    setRemaining(clamped)
    setRunning(false)
    finishedRef.current = false
  }

  const adjust = (delta: number) => setTo(target + delta)
  const reset = () => setTo(target)

  return (
    <div className="rounded-2xl border bg-card p-5 flex flex-col items-center gap-4">
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
      <div className="text-5xl font-mono tabular-nums tracking-tight">
        {format(remaining)}
      </div>

      <div className="flex gap-2">
        <Button
          size="lg"
          onClick={() => {
            if (remaining === 0) setRemaining(target)
            setRunning((r) => !r)
            finishedRef.current = false
          }}
          className="min-w-28"
        >
          {running ? <><Pause className="mr-1 h-4 w-4" /> Pauza</> : <><Play className="mr-1 h-4 w-4" /> Start</>}
        </Button>
        <Button variant="outline" size="lg" onClick={reset} aria-label="Reset">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Button variant="ghost" size="sm" onClick={() => adjust(-30)} className="h-8 px-2" aria-label="Skróć o 30s">
          <Minus className="h-3 w-3" /> 30s
        </Button>
        {PRESETS.map((p) => (
          <Button
            key={p}
            variant={target === p ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setTo(p)}
            className="h-8 px-3"
          >
            {p / 60} min
          </Button>
        ))}
        <Button variant="ghost" size="sm" onClick={() => adjust(30)} className="h-8 px-2" aria-label="Wydłuż o 30s">
          <Plus className="h-3 w-3" /> 30s
        </Button>
      </div>
    </div>
  )
}
