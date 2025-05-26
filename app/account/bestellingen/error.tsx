"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-bold text-red-600 mb-4">Er is iets misgegaan!</h2>
        <p className="text-gray-700 mb-6">We konden uw bestellingen niet laden. Probeer het later opnieuw.</p>
        <Button onClick={reset} className="bg-[#FF6B35] hover:bg-[#E85A24]">
          Probeer opnieuw
        </Button>
      </div>
    </div>
  )
}
