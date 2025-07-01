"use client"

import { Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

interface MobileSidebarProps {
  areas: string[]
}

export function MobileSidebar({ areas }: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick)
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [isOpen])

  return (
    <>
      {/* モバイル用ハンバーガー */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-2xl hover:bg-slate-200 dark:hover:bg-gray-800">
          <Menu className="h-7 w-7" />
        </button>
      </div>
      
      {/* モバイル用スライドインサイドバー */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 md:hidden" aria-hidden="true"></div>
      )}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-gray-900 z-50 shadow-lg transform transition-transform duration-200 ease-in-out md:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* タイトル */}
        <div className="pt-6 pb-5 p-6 border-b border-gray-200 dark:border-gray-700">
          <Link href="/" onClick={() => setIsOpen(false)} className="text-xl font-bold">
            まちまど店メモ
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
                onClick={() => setIsOpen(false)} 
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
    </>
  )
} 