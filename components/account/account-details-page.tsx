'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AccountDetailsPage() {
  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold mb-6">Accountgegevens</h1>
      <form className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">Voornaam</Label>
            <Input id="firstName" defaultValue="Sydney" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Achternaam</Label>
            <Input id="lastName" defaultValue="Dranken" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mailadres</Label>
            <Input id="email" type="email" defaultValue="info@sydneydranken.nl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefoonnummer</Label>
            <Input id="phone" type="tel" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Wachtwoord wijzigen</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Huidig wachtwoord</Label>
              <Input id="currentPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nieuw wachtwoord</Label>
              <Input id="newPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Bevestig nieuw wachtwoord</Label>
              <Input id="confirmPassword" type="password" />
            </div>
          </div>
        </div>

        <Button type="submit">Wijzigingen opslaan</Button>
      </form>
    </Card>
  )
}

