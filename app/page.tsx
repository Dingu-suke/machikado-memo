import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Page() {
  return (
    <div className="min-h-svh">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl font-bold">Next.js ブログスターター</h1>
          <p className="text-xl text-muted-foreground text-center max-w-2xl">
            マークダウンで書けるモダンなブログシステム
          </p>
          <div className="text-sm text-center">
            Get started by editing{" "}
            <code className="rounded bg-black/[.05] px-1 py-0.5 font-semibold dark:bg-white/[.06]">app/page.tsx</code>
          </div>
          <div className="flex gap-4 mt-6">
            <Link href="/blog">
              <Button size="lg">ブログを見る</Button>
            </Link>
            <Button variant="outline" size="lg">
              GitHub
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
