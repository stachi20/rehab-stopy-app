import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { getSection, getExercisesInSection, getModuleOfSection } from "@/lib/data"
import { ExerciseCard } from "@/components/exercise-card"
import { useCompleted } from "@/lib/storage"
import { cn } from "@/lib/utils"

export function SectionPage() {
  const { id = "" } = useParams()
  const section = getSection(id)
  const parentModule = getModuleOfSection(id)
  const allExercises = getExercisesInSection(id)
  const { completed, markDone, toggle } = useCompleted()
  const [expandedCode, setExpandedCode] = useState<string | null>(null)
  const [activeMode, setActiveMode] = useState<string>(section?.modes?.[0]?.id ?? "")

  const backTo = parentModule ? `/m/${parentModule.id}` : "/"

  if (!section) {
    return (
      <div className="space-y-4">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> Wstecz
        </Link>
        <p>Nie znaleziono sekcji.</p>
      </div>
    )
  }

  const hasModes = !!section.modes && section.modes.length > 0
  const exercises = allExercises.filter((e) => !hasModes || !e.modes || e.modes.includes(activeMode))
  const doneCount = exercises.filter((e) => completed.has(e.code)).length

  return (
    <div className="space-y-6">
      <Link to={backTo} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> {parentModule ? parentModule.label : "Sekcje"}
      </Link>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <span
              className={
                section.badge
                  ? "text-xs font-semibold uppercase tracking-widest px-2 py-0.5 rounded-md bg-primary/10 text-primary self-center"
                  : "text-3xl font-mono font-semibold text-primary"
              }
            >
              {section.badge ?? section.id}
            </span>
            <h1 className="text-2xl font-semibold tracking-tight">{section.name}</h1>
          </div>
          <span className="text-sm tabular-nums text-muted-foreground shrink-0">
            {doneCount}/{exercises.length}
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{section.goal}</p>
      </div>

      {hasModes && (
        <div className="flex gap-1 rounded-lg border bg-muted/30 p-1">
          {section.modes!.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setActiveMode(m.id)}
              className={cn(
                "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                activeMode === m.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}

      <ul className="space-y-3">
        {exercises.map((e) => {
          const isDone = completed.has(e.code)
          const isExpanded = expandedCode === e.code
          const shown = hasModes ? { ...e, dose: e.mode_dose?.[activeMode] ?? e.dose } : e
          return (
            <li key={e.code}>
              <ExerciseCard
                exercise={shown}
                expanded={isExpanded}
                done={isDone}
                onToggleExpand={() => setExpandedCode(isExpanded ? null : e.code)}
                onMarkDone={() => {
                  markDone(e.code)
                  setExpandedCode(null)
                }}
                onUnmarkDone={() => toggle(e.code)}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
