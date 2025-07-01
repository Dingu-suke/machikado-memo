import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"

interface HeaderProps {
  breadcrumb?: React.ReactNode
}

export function Header({ breadcrumb }: HeaderProps) {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {breadcrumb}
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              ホーム
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
