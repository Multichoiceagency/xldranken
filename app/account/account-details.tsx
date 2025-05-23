"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { signOut } from "next-auth/react"
import { Trash2, Edit, Save, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CustomerData {
  clcleunik: string
  customerNumber: string
  login: string
  email: string
  firstName: string | null
  lastName: string | null
  address: string
  zipcode: string
  city: string
  country: string
  phone: string
  cellphone: string
  denomination: string
  tvaNumber: string
  isTestAccount?: boolean
}

export default function AccountDetails({ customerData }: { customerData: CustomerData }) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: customerData.firstName || "",
    lastName: customerData.lastName || "",
    address: customerData.address || "",
    zipcode: customerData.zipcode || "",
    city: customerData.city || "",
    country: customerData.country || "",
    phone: customerData.phone || "",
    cellphone: customerData.cellphone || "",
  })

  const isTestAccount =
    customerData.email.includes("test") ||
    customerData.login.includes("test") ||
    customerData.customerNumber.toLowerCase().includes("test")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      const response = await fetch("/api/account/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: customerData.clcleunik,
          ...formData,
        }),
      })

      if (!response.ok) throw new Error("Failed to update account")

      toast({
        title: "Success",
        description: "Accountinformatie is succesvol bijgewerkt.",
        variant: "default",
      })

      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Fout",
        description: "Bijwerken mislukt. Probeer het opnieuw.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm("Weet je zeker dat je dit account wilt verwijderen?")) return

    try {
      const response = await fetch(`/api/account/delete?id=${customerData.clcleunik}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Verwijderen mislukt")

      toast({
        title: "Verwijderd",
        description: "Account is verwijderd.",
      })

      await signOut({ callbackUrl: "/" })
    } catch (error) {
      toast({
        title: "Fout",
        description: "Account verwijderen mislukt.",
        variant: "destructive",
      })
    }
  }

  const handleCleanTestData = async () => {
    if (!confirm("Testdata van dit account verwijderen?")) return

    try {
      const response = await fetch(`/api/account/clean-test-data?id=${customerData.clcleunik}`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Cleanen mislukt")

      toast({
        title: "Success",
        description: "Testdata verwijderd.",
      })

      window.location.reload()
    } catch (error) {
      toast({
        title: "Fout",
        description: "Verwijderen van testdata is mislukt.",
        variant: "destructive",
      })
    }
  }

  const handleLogout = async () => {
    toast({ title: "Je wordt uitgelogd..." })
    await signOut({ callbackUrl: "/" })
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-[#D0C298]">Account Informatie</CardTitle>
          <div className="flex gap-2">
            {isEditing ? (
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Bewerken
              </Button>
            )}
            {isTestAccount && (
              <Button variant="destructive" onClick={handleCleanTestData}>
                <Trash2 className="h-4 w-4 mr-2" />
                Verwijder Testdata
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {isTestAccount && (
            <div className="mb-4 p-3 bg-amber-100 border border-amber-300 rounded-md text-amber-800">
              Dit lijkt een testaccount. Je kunt testdata verwijderen of bewerken.
            </div>
          )}

          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Klantnummer</Label>
                <div className="p-2 border rounded-md bg-gray-50">{customerData.clcleunik}</div>
              </div>
              <div>
                <Label>Email</Label>
                <div className="p-2 border rounded-md bg-gray-50">{customerData.email}</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {isEditing ? (
                <>
                  <div>
                    <Label htmlFor="address">Adres</Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="zipcode">Postcode</Label>
                    <Input id="zipcode" name="zipcode" value={formData.zipcode} onChange={handleChange} />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label>Adres</Label>
                    <div className="p-2 border rounded-md bg-gray-50">{formData.address || "Niet ingesteld"}</div>
                  </div>
                  <div>
                    <Label>Postcode</Label>
                    <div className="p-2 border rounded-md bg-gray-50">{formData.zipcode || "Niet ingesteld"}</div>
                  </div>
                </>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {isEditing ? (
                <>
                  <div>
                    <Label htmlFor="city">Plaats</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="country">Land</Label>
                    <Input id="country" name="country" value={formData.country} onChange={handleChange} />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label>Plaats</Label>
                    <div className="p-2 border rounded-md bg-gray-50">{formData.city || "Niet ingesteld"}</div>
                  </div>
                  <div>
                    <Label>Land</Label>
                    <div className="p-2 border rounded-md bg-gray-50">{formData.country || "Niet ingesteld"}</div>
                  </div>
                </>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {isEditing ? (
                <>
                  <div>
                    <Label htmlFor="phone">Telefoon</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="cellphone">Mobiel</Label>
                    <Input id="cellphone" name="cellphone" value={formData.cellphone} onChange={handleChange} />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label>Telefoon</Label>
                    <div className="p-2 border rounded-md bg-gray-50">{formData.phone || "Niet ingesteld"}</div>
                  </div>
                  <div>
                    <Label>Mobiel</Label>
                    <div className="p-2 border rounded-md bg-gray-50">{formData.cellphone || "Niet ingesteld"}</div>
                  </div>
                </>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>BTW Nummer</Label>
                <div className="p-2 border rounded-md bg-gray-50">{customerData.tvaNumber || "Niet ingesteld"}</div>
              </div>
              <div>
                <Label>Bedrijfsnaam</Label>
                <div className="p-2 border rounded-md bg-gray-50">{customerData.denomination || "Niet ingesteld"}</div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsEditing(false)}>Annuleren</Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Opslaan
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Button variant="destructive" onClick={handleLogout}>
        <LogOut className="h-4 w-4 mr-2" />
        Uitloggen
      </Button>
    </div>
  )
}
