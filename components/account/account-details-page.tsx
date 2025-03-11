'use client'

import { useSession } from "next-auth/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect, FormEvent } from "react"

export function AccountDetailsPage() {
  const { data: session, status } = useSession()
  
  // Lokale state voor de formuliervelden
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  // Wachtwoordvelden
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Laden van gebruikersgegevens uit de sessie (indien beschikbaar)
  useEffect(() => {
    if (session?.user) {
      // Pas aan op basis van de velden die je via NextAuth meegeeft
      setFirstName((session.user as any).firstName || "")
      setLastName((session.user as any).lastName || "")
      setEmail(session.user.email || "")
      setPhone((session.user as any).phone || "")
    }
  }, [session])

  if (status === "loading") {
    return <p>Loading...</p>
  }

  // Als de gebruiker niet is ingelogd
  if (!session) {
    return <p>Je bent niet ingelogd.</p>
  }

  // Functie voor het verwerken van de formulierinzending
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

     let response = await fetch("/api/account/update", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
         firstName,
         lastName,
         email,
         phone,
         currentPassword,
         newPassword,
         confirmPassword,
       }),
     })
    const result = await response.json()
     console.log(result)

    alert("Wijzigingen zijn verzonden (mock).")
  }

  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold mb-6">Accountgegevens</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">Voornaam</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Achternaam</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mailadres</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefoonnummer</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Wachtwoord wijzigen</h2>
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

        <Button type="submit">Wijzigingen opslaan</Button>
      </form>
    </Card>
  )
}
