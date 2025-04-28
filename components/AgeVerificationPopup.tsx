"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export function AgeVerificationPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [isBlocked, setIsBlocked] = useState(false)

  useEffect(() => {
    // Check if user has been blocked due to age
    const isAgeBlocked = localStorage.getItem("ageBlocked") === "true"

    if (isAgeBlocked) {
      setIsBlocked(true)
      return
    }

    // Check if user has already verified age
    const hasVerifiedAge = localStorage.getItem("ageVerified")

    if (!hasVerifiedAge) {
      // If not verified, show the popup immediately
      setIsOpen(true)
    }
  }, [])

  const handleVerify = () => {
    // Store verification in localStorage
    localStorage.setItem("ageVerified", "true")
    localStorage.removeItem("ageBlocked") // Clear any previous blocks
    setIsOpen(false)
    setIsBlocked(false)
  }

  const handleDeny = () => {
    // Block access to the site
    localStorage.setItem("ageBlocked", "true")
    localStorage.removeItem("ageVerified") // Clear any previous verifications
    setIsOpen(false)
    setIsBlocked(true)
  }

  // If blocked, show blocking message
  if (isBlocked) {
    return (
      <div className="fixed inset-0 bg-red-900 z-50 flex flex-col items-center justify-center p-4 text-white">
        <AlertTriangle className="w-16 h-16 mb-6 text-white animate-pulse" />
        <h1 className="text-3xl font-bold mb-4 text-center">Toegang Geweigerd</h1>
        <p className="text-xl mb-8 text-center max-w-md">Je moet 18 jaar of ouder zijn om deze website te bezoeken.</p>
        <div className="max-w-md text-center mb-8">
          <p className="text-sm opacity-80 mb-4">
            Deze website bevat informatie over alcoholische dranken en is alleen toegankelijk voor personen van 18 jaar
            en ouder.
          </p>
        </div>
        <Button onClick={handleVerify} className="bg-white text-red-900 hover:bg-gray-200 px-8 py-4 text-lg">
          Ik ben toch 18 jaar of ouder
        </Button>
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-[#0F3059] to-[#0a1f3a] rounded-lg shadow-2xl max-w-lg w-full mx-auto overflow-hidden animate-fadeIn">
        <div className="relative h-40 bg-gradient-to-r bg-white">
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <h2 className="text-3xl font-bold text-white text-center drop-shadow-lg">Leeftijdsverificatie</h2>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="mb-6 text-center">
            <p className="text-white text-lg mb-4">
              Welkom bij XL Dranken. Om onze website te bezoeken moet je 18 jaar of ouder zijn.
            </p>
            <p className="text-white text-sm mb-2">Ben je 18 jaar of ouder?</p>
            <div className="w-16 h-1 bg-[#E2B505] mx-auto"></div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button
              onClick={handleVerify}
              className="bg-[#E2B505] hover:bg-[#E2B505]/90 text-white px-8 py-6 text-lg transform hover:scale-105 transition-all duration-300"
            >
              Ja, ik ben 18+
            </Button>
            <Button
              onClick={handleDeny}
              variant="outline"
              className="border-white bg-red-700 hover:text-white hover:border-red-700 text-white hover:bg-red-700 px-8 py-6 text-lg transform hover:scale-105 transition-all duration-300"
            >
              Nee, ik ben jonger
            </Button>
          </div>

          <p className="text-white/70 text-xs text-center mt-6">
            Door op "Ja, ik ben 18+" te klikken, bevestig je dat je 18 jaar of ouder bent en ga je akkoord met onze
            algemene voorwaarden en privacybeleid.
          </p>
        </div>
      </div>
    </div>
  )
}

