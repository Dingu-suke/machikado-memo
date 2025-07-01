import { MobileSidebar } from "@/components/mobile-sidebar"
import { PCSidebar } from "@/components/pc-sidebar"
import { getAllAreas } from "@/lib/markdown"
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "街かどメモ",
  description: "街ごとのお店・レストランのメモなど",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const areas = getAllAreas()

  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen">
            {/* PC用サイドバー */}
            <aside className="hidden md:block w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 min-h-screen flex-shrink-0">
              <PCSidebar areas={areas} />
            </aside>
            {/* モバイル用サイドバー */}
            <MobileSidebar areas={areas} />
            <main className="flex-1 min-w-0">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
