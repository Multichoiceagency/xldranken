"use client"

import { useSession } from "next-auth/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect, type FormEvent } from "react"
import { toast } from "@/hooks/use-toast"

export function AccountDetailsPage() {
  const { data: session, status } = useSession()
  // Uncomment the line above and remove this mock when ready to use real authentication
  // const session: any = "yes";

  // Lokale state voor de formuliervelden
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  // Wachtwoordvelden
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Loading state
  const [isLoading, setIsLoading] = useState(false)

  // Load user data when session is available
  useEffect(() => {
    if (session?.user) {
      // In a real app, you might want to fetch more detailed user data from your API
      // For now, we'll just use what's available in the session
      setEmail(session.user.email || "")

      // If you have these fields in your session
      if (session.user.name) {
        const nameParts = session.user.name.split(" ")
        setFirstName(nameParts[0] || "")
        setLastName(nameParts.slice(1).join(" ") || "")
      }

      // You might fetch additional user data from your API here
      const fetchUserDetails = async () => {
        try {
          const response = await fetch("/api/account/details")
          if (response.ok) {
            const userData = await response.json()
            // Update state with additional user data
            setFirstName(userData.firstName || firstName)
            setLastName(userData.lastName || lastName)
            setPhone(userData.phone || "")
          }
        } catch (error) {
          console.error("Error fetching user details:", error)
        }
      }

      // Uncomment this when your API is ready
      // fetchUserDetails()
    }
  }, [session])

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#E2B505]"></div>
        <span className="ml-3">Laden...</span>
      </div>
    )
  }

  // Als de gebruiker niet is ingelogd
  if (!session) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-4">Je bent niet ingelogd</h2>
          <p className="mb-6 text-gray-600">Log in om je accountgegevens te bekijken en te bewerken.</p>
          <Button onClick={() => (window.location.href = "/login")} className="bg-[#E2B505] hover:bg-[#E2B505]/90">
            Inloggen
          </Button>
        </div>
      </Card>
    )
  }

  // Functie voor het verwerken van de formulierinzending
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Password validation
    if (newPassword && newPassword !== confirmPassword) {
      toast({
        title: "Wachtwoorden komen niet overeen",
        description: "Het nieuwe wachtwoord en de bevestiging moeten hetzelfde zijn.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/account/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      })

      if (response.ok) {
        toast({
          title: "Gegevens bijgewerkt",
          description: "Je accountgegevens zijn succesvol bijgewerkt.",
        })

        // Reset password fields
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        const errorData = await response.json()
        toast({
          title: "Fout bij bijwerken",
          description: errorData.message || "Er is een fout opgetreden bij het bijwerken van je gegevens.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating account:", error)
      toast({
        title: "Fout bij bijwerken",
        description: "Er is een fout opgetreden bij het bijwerken van je gegevens.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold mb-6">Accountgegevens</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">Voornaam</Label>
            <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Achternaam</Label>
            <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mailadres</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefoonnummer</Label>
            <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Wachtwoord wijzigen</h2>
          <p className="text-sm text-gray-500 mb-4">Laat deze velden leeg als je je wachtwoord niet wilt wijzigen.</p>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Huidig wachtwoord</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nieuw wachtwoord</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Bevestig nieuw wachtwoord</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Button type="submit" className="bg-[#E2B505] hover:bg-[#E2B505]/90" disabled={isLoading}>
          {isLoading ? "Bezig met opslaan..." : "Wijzigingen opslaan"}
        </Button>
      </form>
    </Card>
  )
}

