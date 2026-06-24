import { Link, Outlet } from "react-router-dom"
import { ThemeToggle } from "@/components/theme-toggle"

export function Layout() {
  return (
    <div className="min-h-svh flex flex-col bg-background text-foreground">
      <header className="border-b sticky top-0 bg-background/80 backdrop-blur z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-medium tracking-tight">
            I'm a mothafucking BEAST
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 py-6 sm:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
