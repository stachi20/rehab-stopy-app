import { Link } from "react-router-dom"
import { Check, ChevronDown, ChevronRight, Star } from "lucide-react"
import { getSectionsByCategory, getExercisesInSection, getPinnedInSection, exercises } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { useCompleted } from "@/lib/storage"
import { cn } from "@/lib/utils"
import type { Section } from "@/types/exercise"

function SectionRow({ section, completedSet }: { section: Section; completedSet: Set<string> }) {
  const list = getExercisesInSection(section.id)
  const done = list.filter((e) => completedSet.has(e.code)).length
  const pinned = getPinnedInSection(section.id)
  const hasAny = done > 0
  const allDone = done === list.length

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

export function HomePage() {
  const { completed, clearAll } = useCompleted()
  const totalDone = completed.size
  const totalAll = exercises.length
  const rehabSections = getSectionsByCategory("rehab")
  const runningSections = getSectionsByCategory("running")

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">REHAB</h1>
        <p className="text-muted-foreground">
          {totalDone === 0
            ? `${totalAll} ćwiczeń w ${rehabSections.length + runningSections.length} sekcjach. Zacznij od A.`
            : `Zrobione dzisiaj: ${totalDone}/${totalAll}. Reset o północy.`}
        </p>
      </div>

      <details className="group rounded-xl border bg-muted/30 open:bg-muted/50">
        <summary className="list-none cursor-pointer p-4 flex items-center justify-between gap-2">
          <span className="text-sm font-medium">Jak robić sesję</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
        </summary>
        <div className="px-4 pb-4 text-sm text-muted-foreground space-y-2 leading-relaxed">
          <p>
            <strong className="text-foreground">Codziennie (~15 min):</strong> wybierz 1 ćwiczenie z <strong>A → B → C</strong>, plus 1 z <strong>E</strong> (pośladki).
          </p>
          <p>
            <strong className="text-foreground">Sekcja D — Odporność ścięgien</strong> (po C): wzmacnianie pod bieganie, 3-4× w tygodniu, na rozgrzanej stopie. Dwa ★ (strzałkowe + wspięcia HSR) to baza, rotuj je dzień po dniu.
          </p>
          <p>
            <strong className="text-foreground">Co 2-3 dni dodaj 1 z F</strong> (wzorzec ruchu, sesja pełna ~25 min).
          </p>
          <p>
            <strong className="text-foreground">W dni biegania:</strong> przed biegiem sekcja <strong>PRZED</strong> (rozgrzewka), po biegu sekcja <strong>PO</strong> (rozciąganie). Niezależnie od reszty.
          </p>
          <p>
            <Star className="inline h-3 w-3 text-amber-500 fill-amber-500 mb-0.5" /> oznacza <strong className="text-amber-600 dark:text-amber-400">priorytet trenera</strong> — jeśli wahasz się którego wybrać w sekcji, bierz te.
          </p>
        </div>
      </details>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Rehab codzienny</h2>
          <span className="text-xs text-muted-foreground">A → B → C → D → E → F</span>
        </div>
        <ul className="space-y-3">
          {rehabSections.map((s) => (
            <SectionRow key={s.id} section={s} completedSet={completed} />
          ))}
        </ul>
      </section>

      {runningSections.length > 0 && (
        <section className="space-y-3 border-t-2 border-dashed pt-8 mt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide flex items-center gap-2">
              <span aria-hidden>🏃</span> Bieganie
            </h2>
            <span className="text-xs text-muted-foreground">tylko w dni biegania</span>
          </div>
          <ul className="space-y-3">
            {runningSections.map((s) => (
              <SectionRow key={s.id} section={s} completedSet={completed} />
            ))}
          </ul>
        </section>
      )}

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
