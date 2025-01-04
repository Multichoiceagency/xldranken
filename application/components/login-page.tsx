'use client'

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="container px-4 py-4 flex items-center">
        <Link 
          href="/" 
          className="text-[#FF6B35] flex items-center gap-2 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          TERUG
        </Link>
        <div className="flex-1 flex justify-center">
          <Link href="/" className="relative w-32 h-12">
            <Image
              src="/placeholder.svg?height=48&width=128"
              alt="Gall & Gall"
              fill
              className="object-contain"
            />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-md px-4 py-8">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-center mb-6">INLOGGEN</h1>
          
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mailadres</Label>
              <Input
                id="email"
                type="email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Wachtwoord</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#FF6B35] hover:bg-[#E85A24] text-white"
            >
              INLOGGEN
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Link 
              href="/forgot-password" 
              className="text-sm text-[#FF6B35] hover:underline"
            >
              Wachtwoord vergeten?
            </Link>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm text-center">
          <h2 className="font-bold mb-2">NIEUW BIJ GALL & GALL?</h2>
          <Link 
            href="/register" 
            className="text-[#FF6B35] hover:underline"
          >
            Maak een account aan
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-500">
        <div className="container px-4">
          <p className="mb-2">Hoe gebruiken we je gegevens?</p>
          <p>
            Deze pagina is beveiligd met reCaptcha, het{" "}
            <Link href="/privacy" className="underline">
              Privacybeleid
            </Link>
            {" "}en de{" "}
            <Link href="/terms" className="underline">
              Servicevoorwaarden
            </Link>
            {" "}van ReCaptcha zijn van toepassing.
          </p>
        </div>
      </footer>
    </div>
  )
}

