"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handler as EventListener)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler as EventListener)
    }
  }, [])

  useEffect(() => {
    if (showPrompt) {
      const timer = setTimeout(() => {
        setShowPrompt(false)
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [showPrompt])

  const handleInstallClick = async () => {
    if (deferredPrompt && "prompt" in deferredPrompt) {
      // @ts-ignore
      await deferredPrompt.prompt()
      // @ts-ignore
      const choiceResult = await deferredPrompt.userChoice
      console.log("User response to install prompt:", choiceResult.outcome)
      setDeferredPrompt(null)
      setShowPrompt(false)
    }
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:right-auto md:w-auto z-50 bg-white border border-gray-300 rounded-xl shadow-lg p-4 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-gray-800">Installeren als app?</p>
        <p className="text-xs text-gray-500">Voeg <b>XL Groothandel B.V.</b> toe aan je startscherm voor snelle toegang.</p>
      </div>
      <Button onClick={handleInstallClick}>Installeren</Button>
    </div>
  )
}
