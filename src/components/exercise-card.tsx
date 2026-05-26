import { useState } from "react"
import { Check, ChevronDown, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Timer } from "@/components/timer"
import { VariantSelector } from "@/components/variant-selector"
import type { Exercise } from "@/types/exercise"
import { cn } from "@/lib/utils"
import { MD } from "@/lib/markdown"

type Props = {
  exercise: Exercise
  expanded: boolean
  done: boolean
  onToggleExpand: () => void
  onMarkDone: () => void
  onUnmarkDone: () => void
}

export function ExerciseCard({
  exercise,
  expanded,
  done,
  onToggleExpand,
  onMarkDone,
  onUnmarkDone,
}: Props) {
  const [variantId, setVariantId] = useState<string>(
    exercise.variants?.[0]?.id ?? ""
  )

  return (
    <div
      className={cn(
        "rounded-xl border bg-card transition-colors overflow-hidden",
        done && "border-emerald-500/50 bg-emerald-500/5",
        expanded && !done && "border-primary",
      )}
    >
      <button
        type="button"
        onClick={onToggleExpand}
        className="w-full text-left p-4 flex items-start justify-between gap-3 cursor-pointer"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-muted-foreground">{exercise.code}</span>
            <h3 className={cn("font-medium leading-tight", done && "text-emerald-700 dark:text-emerald-400")}>{exercise.name}</h3>
            {exercise.pinned && (
              <Star className="h-4 w-4 text-amber-500 fill-amber-500 shrink-0" />
            )}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">{exercise.dose}</div>
          {exercise.pinned && exercise.pin_reason && (
            <div className="mt-1.5 text-xs text-amber-600 dark:text-amber-400">
              ★ {exercise.pin_reason}
            </div>
          )}
          {exercise.equipment.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {exercise.equipment.map((e) => (
                <Badge key={e} variant="secondary" className="font-normal">
                  {e}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="shrink-0 flex flex-col items-center gap-1">
          {done ? (
            <div className="h-7 w-7 rounded-full bg-emerald-500 text-white flex items-center justify-center">
              <Check className="h-4 w-4" />
            </div>
          ) : (
            <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform", expanded && "rotate-180")} />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          <Separator />

          {exercise.variants && exercise.variant_prompt && (
            <VariantSelector
              prompt={exercise.variant_prompt}
              variants={exercise.variants}
              value={variantId}
              onChange={setVariantId}
            />
          )}

          {exercise.timer_seconds && (
            <Timer
              defaultSeconds={exercise.timer_seconds}
              label={exercise.both_sides ? "jedna strona" : undefined}
            />
          )}

          <section className="space-y-1.5">
            <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Wykonanie</h4>
            <div className="text-sm leading-relaxed">
              <MD text={exercise.instruction} />
            </div>
          </section>

          {(exercise.feeling || exercise.mistake || exercise.extra) && (
            <section className="space-y-2.5 rounded-lg border bg-muted/30 p-3">
              {exercise.feeling && (
                <div>
                  <div className="text-[10px] font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-400">Czuj</div>
                  <div className="text-sm leading-relaxed"><MD text={exercise.feeling} /></div>
                </div>
              )}
              {exercise.mistake && (
                <div>
                  <div className="text-[10px] font-medium uppercase tracking-wide text-rose-700 dark:text-rose-400">Błąd</div>
                  <div className="text-sm leading-relaxed"><MD text={exercise.mistake} /></div>
                </div>
              )}
              {exercise.extra && (
                <div>
                  <div className="text-[10px] font-medium uppercase tracking-wide text-amber-700 dark:text-amber-400">Wskazówka</div>
                  <div className="text-sm leading-relaxed"><MD text={exercise.extra} /></div>
                </div>
              )}
            </section>
          )}

          <div className="pt-1">
            {done ? (
              <Button variant="outline" className="w-full" onClick={onUnmarkDone}>
                Cofnij zrobione
              </Button>
            ) : (
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={onMarkDone}>
                <Check className="mr-1 h-4 w-4" /> Zrobione
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
