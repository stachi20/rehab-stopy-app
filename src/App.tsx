import { Routes, Route, Navigate } from "react-router-dom"
import { Layout } from "@/components/layout"
import { ModulePage } from "@/pages/module"
import { SectionPage } from "@/pages/section"
import { modules } from "@/lib/data"

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to={`/m/${modules[0].id}`} replace />} />
        <Route path="/m/:moduleId" element={<ModulePage />} />
        <Route path="/section/:id" element={<SectionPage />} />
      </Route>
    </Routes>
  )
}
