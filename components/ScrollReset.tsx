"use client"

import { useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"

function ScrollResetInner() {
  const searchParams = useSearchParams()

  useEffect(() => {
    // Scroll naar boven bij elke URL parameter wijziging
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [searchParams])

  return null
}

export default function ScrollReset() {
  return (
    <Suspense fallback={null}>
      <ScrollResetInner />
    </Suspense>
  )
}
