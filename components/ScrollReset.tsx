// components/ScrollReset.tsx
"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function ScrollReset() {
  const pathname = usePathname()

  useEffect(() => {
    // Scroll direct naar boven bij route change
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
