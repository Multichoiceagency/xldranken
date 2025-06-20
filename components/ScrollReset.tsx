"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function ScrollReset() {
  const searchParams = useSearchParams()

  useEffect(() => {
    // Scroll naar boven bij elke URL parameter wijziging
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [searchParams])

  return null
}
