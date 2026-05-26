import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { getSection, getExercisesInSection } from "@/lib/data"
import { ExerciseCard } from "@/components/exercise-card"
import { useCompleted } from "@/lib/storage"

export function SectionPage() {
  const { id = "" } = useParams()
  const section = getSection(id)
  const exercises = getExercisesInSection(id)
  const { completed, markDone, toggle } = useCompleted()
  const [expandedCode, setExpandedCode] = useState<string | null>(null)

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

  const doneCount = exercises.filter((e) => completed.has(e.code)).length

  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Sekcje
      </Link>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-mono font-semibold text-primary">{section.id}</span>
            <h1 className="text-2xl font-semibold tracking-tight">{section.name}</h1>
          </div>
          <span className="text-sm tabular-nums text-muted-foreground shrink-0">
            {doneCount}/{exercises.length}
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{section.goal}</p>
      </div>

      <ul className="space-y-3">
        {exercises.map((e) => {
          const isDone = completed.has(e.code)
          const isExpanded = expandedCode === e.code
          return (
            <li key={e.code}>
              <ExerciseCard
                exercise={e}
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
