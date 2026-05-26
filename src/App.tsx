import { Routes, Route } from "react-router-dom"
import { Layout } from "@/components/layout"
import { HomePage } from "@/pages/home"
import { SectionPage } from "@/pages/section"

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/section/:id" element={<SectionPage />} />
      </Route>
    </Routes>
  )
}
