import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            My Blog
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              ホーム
            </Link>
            <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
              ブログ
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
