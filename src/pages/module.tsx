import { Link, Navigate, useParams } from "react-router-dom"
import { Check, ChevronDown, ChevronRight, Star } from "lucide-react"
import {
  modules,
  getModule,
  getSectionsByCategory,
  getExercisesInSection,
  getPinnedInSection,
} from "@/lib/data"
import { Button } from "@/components/ui/button"
import { useCompleted } from "@/lib/storage"
import { cn } from "@/lib/utils"
import type { Section } from "@/types/exercise"

function SectionRow({ section, completedSet }: { section: Section; completedSet: Set<string> }) {
  const list = getExercisesInSection(section.id)
  const done = list.filter((e) => completedSet.has(e.code)).length
  const pinned = getPinnedInSection(section.id)
  const hasAny = done > 0
  const allDone = list.length > 0 && done === list.length

  return (
    <li>
      <Link
        to={`/section/${section.id}`}
        className={cn(
          "group block rounded-xl border bg-card p-5 transition-colors",
          hasAny
            ? "border-emerald-500/50 bg-emerald-500/5 hover:border-emerald-500"
            : "hover:border-primary",
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span
                className={cn(
                  section.badge
                    ? "text-xs font-semibold uppercase tracking-widest px-2 py-0.5 rounded-md self-center"
                    : "text-2xl font-mono font-semibold",
                  section.badge && (hasAny ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-primary/10 text-primary"),
                  !section.badge && (hasAny ? "text-emerald-600 dark:text-emerald-400" : "text-primary"),
                )}
              >
                {section.badge ?? section.id}
              </span>
              <h2 className="text-lg font-medium">{section.name}</h2>
              {pinned.length > 0 && (
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              )}
              {allDone && (
                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{section.goal}</p>
            <p className="mt-3 text-xs text-muted-foreground tabular-nums">
              {done}/{list.length} zrobione
            </p>
          </div>
          <ChevronRight
            className={cn(
              "h-5 w-5 text-muted-foreground shrink-0 mt-1 transition-colors",
              hasAny ? "group-hover:text-emerald-600" : "group-hover:text-primary",
            )}
          />
        </div>
      </Link>
    </li>
  )
}

export function ModulePage() {
  const { moduleId = "" } = useParams()
  const { completed, clearAll } = useCompleted()
  const activeModule = getModule(moduleId)

  if (!activeModule) {
    return <Navigate to={`/m/${modules[0].id}`} replace />
  }

  const moduleSections = getSectionsByCategory(activeModule.id)
  const totalDone = moduleSections
    .flatMap((s) => getExercisesInSection(s.id))
    .filter((e) => completed.has(e.code)).length

  return (
    <div className="space-y-8">
      <nav className="flex gap-2" aria-label="Obszary treningowe">
        {modules.map((m) => {
          const active = m.id === activeModule.id
          return (
            <Link
              key={m.id}
              to={`/m/${m.id}`}
              className={cn(
                "flex-1 rounded-xl border px-3 py-3 text-center transition-colors",
                active
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
              )}
            >
              <div className="text-xl leading-none" aria-hidden>{m.emoji}</div>
              <div className="mt-1.5 text-xs sm:text-sm">{m.label}</div>
            </Link>
          )
        })}
      </nav>

      {activeModule.hint && (
        <details className="group rounded-xl border bg-muted/30 open:bg-muted/50">
          <summary className="list-none cursor-pointer p-4 flex items-center justify-between gap-2">
            <span className="text-sm font-medium">Jak to robić</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
          </summary>
          <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
            {activeModule.hint}
          </div>
        </details>
      )}

      <section className="space-y-3">
        <ul className="space-y-3">
          {moduleSections.map((s) => (
            <SectionRow key={s.id} section={s} completedSet={completed} />
          ))}
        </ul>
      </section>

      {totalDone > 0 && (
        <div className="pt-2 flex justify-center">
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground">
            Wyczyść zaznaczenia
          </Button>
        </div>
      )}
    </div>
  )
}
