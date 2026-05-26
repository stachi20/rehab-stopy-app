import data from "../../public/data/exercises.json"
import type { ExercisesData, Exercise, Section, SectionCategory } from "@/types/exercise"

const typed = data as ExercisesData

export const sections: Section[] = typed.sections
export const exercises: Exercise[] = typed.exercises

export function getSection(id: string): Section | undefined {
  return sections.find((s) => s.id === id.toUpperCase())
}

export function getSectionsByCategory(category: SectionCategory): Section[] {
  return sections.filter((s) => s.category === category)
}

export function getExercisesInSection(id: string): Exercise[] {
  return exercises.filter((e) => e.section === id.toUpperCase())
}

export function getExercise(code: string): Exercise | undefined {
  return exercises.find((e) => e.code.toLowerCase() === code.toLowerCase())
}

export function getPinnedInSection(id: string): Exercise[] {
  return exercises.filter((e) => e.section === id.toUpperCase() && e.pinned)
}
