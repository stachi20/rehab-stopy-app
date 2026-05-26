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
}

export type SectionCategory = "rehab" | "running"

export type Section = {
  id: string
  name: string
  goal: string
  category: SectionCategory
}

export type ExercisesData = {
  sections: Section[]
  exercises: Exercise[]
}
