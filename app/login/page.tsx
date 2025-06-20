"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  // Debug logging
  console.log("🔐 Attempting login with email:", formData.email)

  try {
    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    })

    if (result?.error) {
      toast({
        title: "Inloggen mislukt",
        description: "Ongeldige e-mail of wachtwoord. Probeer het opnieuw.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Succesvol ingelogd",
        description: "Welkom terug!",
        variant: "default",
      })
      router.push("/account")
    }
  } catch (error) {
    console.error("Login error:", error)
    toast({
      title: "Inloggen mislukt",
      description: "Er is een fout opgetreden tijdens het inloggen. Probeer het opnieuw.",
      variant: "destructive",
    })
  } finally {
    setIsLoading(false)
  }
}


  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/winkel/IMG_8702.JPG"
          alt="Winkel achtergrond"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 z-10" />
      </div>

      {/* Content Container */}
      <div className="relative z-20 flex flex-col min-h-screen">
        {/* Header */}
        <header className="container px-4 py-4 flex items-center">
          <Link
            href="/"
            className="text-[#FF6B35] flex items-center gap-2 text-sm font-medium bg-white/80 px-3 py-1 rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
            TERUG
          </Link>
          <div className="flex-1"></div>
        </header>

        {/* Main Content */}
        <main className="flex-1 container flex items-center justify-center px-4 py-8">
          <Card className="mx-auto w-full max-w-md bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg">
            <CardHeader className="space-y-4 flex flex-col items-center">
              {/* Logo above the INLOGGEN text */}
              <div className="relative w-48 h-16 mb-2">
                <Image
                  src="/logos/logo-xlgroothandelbv.png"
                  alt="XL Groothandel"
                  fill
                  className="object-contain"
                />
              </div>
              <CardTitle className="text-2xl font-bold text-center">INLOGGEN</CardTitle>
              <CardDescription className="text-center">Voer uw gegevens in om toegang te krijgen tot uw account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mailadres</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="uw@email.nl"
                    required
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Wachtwoord</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Uw wachtwoord"
                      required
                      className="bg-white"
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
                  className="w-full bg-[#E2B505] hover:bg-[#C9A204] text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Bezig met inloggen..." : "INLOGGEN"}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#E2B505] hover:underline"
                >
                  Wachtwoord vergeten?
                </Link>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <h2 className="font-bold mb-2">VOOR REGISTRATIE NEEM CONTACT MET ONS OP</h2>
                <Link
                  href="/register"
                  className="text-[#FF6B35] hover:underline"
                >
                  Contact opnemen
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Footer */}
        <footer className="py-4 text-center text-sm text-white relative z-20">
          <div className="container px-4 bg-black/30 py-3 rounded-lg max-w-2xl mx-auto">
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
    </div>
  )
}