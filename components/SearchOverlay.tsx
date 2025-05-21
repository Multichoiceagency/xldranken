"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, Search } from "lucide-react"

export default function SearchOverlay({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`, { scroll: false })
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-white/95 z-[200] flex flex-col items-center justify-center px-6 py-10">
      <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-600 hover:text-black">
        <X className="w-6 h-6" />
      </button>
      <form onSubmit={handleSearch} className="w-full max-w-2xl flex items-center gap-3">
        <input
          type="text"
          placeholder="Typ om te zoeken..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border-b-2 border-gray-400 text-xl py-2 px-3 focus:outline-none focus:border-[#BEA46A] bg-transparent"
          autoFocus
        />
        <button type="submit" className="text-[#BEA46A] hover:text-black">
          <Search className="w-6 h-6" />
        </button>
      </form>
    </div>
  )
}
