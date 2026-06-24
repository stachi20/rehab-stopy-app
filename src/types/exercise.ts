export type Variant = {
  id: string
  label: string
}

export type Exercise = {
  code: string
  section: string
  name: string
  dose: string
  timer_seconds: number | null
  both_sides: boolean
  equipment: string[]
  variant_prompt: string | null
  variants: Variant[] | null
  instruction: string
  feeling: string | null
  mistake: string | null
  extra: string | null
  pinned?: boolean
  pin_reason?: string
  /** Tryby sekcji, w których to ćwiczenie jest widoczne (np. ["10","5"]). Brak = zawsze. */
  modes?: string[]
  /** Nadpisanie `dose` per tryb sekcji (np. { "10": "1 × 15", "5": "1 × 10" }). */
  mode_dose?: Record<string, string>
  /** Link do nagrania instruktażowego (opcjonalny). */
  video?: string
}

/** id modułu = wartość `category` na sekcji (np. "rehab", "running", "calisthenics"). */
export type SectionCategory = string

export type SectionMode = {
  id: string
  label: string
}

export type Section = {
  id: string
  name: string
  goal: string
  category: SectionCategory
  badge?: string
  /** Tryby sekcji (np. rozgrzewka 10/5 min). Gdy ustawione — pokazuje przełącznik. */
  modes?: SectionMode[]
}

/** Obszar treningowy grupujący sekcje, przełączany tabem. */
export type Module = {
  id: string
  label: string
  emoji: string
  hint?: string
  order: number
}

export type ExercisesData = {
  modules: Module[]
  sections: Section[]
  exercises: Exercise[]
}
