"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface PCSidebarProps {
  areas: string[]
}

export function PCSidebar({ areas }: PCSidebarProps) {
  const pathname = usePathname()
  
  return (
    <div className="flex flex-col h-full">
      {/* タイトル */}
      <div className="pt-6 pb-5 pl-6 border-b border-gray-200 dark:border-gray-700">
        <Link href="/" className="text-xl font-bold">
          街かどメモ
        </Link>
      </div>
      {/* 街リスト */}
      <nav className="flex flex-col p-4 gap-2">
        {areas.map((area) => {
          const isActive = pathname.startsWith(`/${encodeURIComponent(area)}`)
          return (
            <Link 
              key={area} 
              href={`/${area}`} 
              className={`px-3 py-2 rounded text-base transition-colors ${
                isActive 
                  ? "bg-cyan-100 dark:bg-cyan-900 text-cyan-900 dark:text-cyan-100" 
                  : "hover:bg-slate-100 dark:hover:bg-gray-800"
              }`}
            >
              {area}
            </Link>
          )
        })}
      </nav>
    </div>
  )
} 