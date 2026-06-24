import data from "../../public/data/exercises.json"
import type { ExercisesData, Exercise, Module, Section, SectionCategory } from "@/types/exercise"

const typed = data as ExercisesData

export const modules: Module[] = [...typed.modules].sort((a, b) => a.order - b.order)
export const sections: Section[] = typed.sections
export const exercises: Exercise[] = typed.exercises

export function getModule(id: string): Module | undefined {
  return modules.find((m) => m.id === id)
}

export function getModuleOfSection(sectionId: string): Module | undefined {
  const section = getSection(sectionId)
  return section ? getModule(section.category) : undefined
}

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
