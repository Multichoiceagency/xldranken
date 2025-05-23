"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { getCustomerById, updateCustomer } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuthContext } from "@/context/AuthContext"

// Define address type
interface Address {
  id: string
  type: string
  firstName: string
  lastName: string
  street: string
  postal: string
  city: string
  isDefault?: boolean
}

export function AddressesPage() {
  const { toast } = useToast()
  const { user } = useAuthContext()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<Omit<Address, "id">>({
    type: "Bezorgadres",
    firstName: "",
    lastName: "",
    street: "",
    postal: "",
    city: "",
    isDefault: false,
  })

  // Fetch addresses when component mounts
  useEffect(() => {
    async function fetchAddresses() {
      if (!user?.id) {
        setLoading(false)
        setError("Gebruiker niet ingelogd")
        return
      }

      try {
        setLoading(true)
        setError(null)

        console.log("Fetching customer data for user ID:", user.id)
        const customerData = await getCustomerById(user.id)
        console.log("Customer data received:", customerData)

        // Extract addresses from customer data
        const addressesFromApi = extractAddressesFromCustomerData(customerData)
        console.log("Extracted addresses:", addressesFromApi)

        setAddresses(addressesFromApi)
      } catch (err) {
        console.error("Error fetching addresses:", err)
        setError("Er is een fout opgetreden bij het ophalen van adressen")

        // Fallback to sample data if API fails
        setAddresses([
          {
            id: "1",
            type: "Factuuradres",
            firstName: "XL",
            lastName: "Groothandel",
            street: "Testadres",
            postal: "1234 AB",
            city: "Amsterdam",
            isDefault: true,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchAddresses()
  }, [user])

  // Helper function to extract addresses from customer data based on API documentation
  function extractAddressesFromCustomerData(customerData: any): Address[] {
    const addresses: Address[] = []

    console.log("Extracting addresses from customer data:", customerData)

    // Extract main address (factuuradres)
    if (customerData.address) {
      addresses.push({
        id: "billing",
        type: "Factuuradres",
        firstName: customerData.firstName || "",
        lastName: customerData.lastName || "",
        street: customerData.address || "",
        postal: customerData.zipcode || "",
        city: customerData.city || "",
        isDefault: true,
      })
    }

    // If no addresses found, create a placeholder
    if (addresses.length === 0 && (customerData.firstName || customerData.lastName)) {
      addresses.push({
        id: "default",
        type: "Factuuradres",
        firstName: customerData.firstName || "",
        lastName: customerData.lastName || "",
        street: "Geen adres opgegeven",
        postal: "",
        city: "",
        isDefault: true,
      })
    }

    return addresses
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle address type selection
  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }))
  }

  // Open dialog for adding new address
  const handleAddAddress = () => {
    setFormData({
      type: "Bezorgadres",
      firstName: "",
      lastName: "",
      street: "",
      postal: "",
      city: "",
      isDefault: false,
    })
    setIsDialogOpen(true)
  }

  // Handle saving address
  const handleSaveAddress = async () => {
    if (!user?.id) {
      toast({
        title: "Fout",
        description: "Je moet ingelogd zijn om adressen te beheren",
        variant: "destructive",
      })
      return
    }

    try {
      // Validate form data
      if (!formData.firstName || !formData.lastName || !formData.street || !formData.postal || !formData.city) {
        toast({
          title: "Fout",
          description: "Vul alle verplichte velden in",
          variant: "destructive",
        })
        return
      }

      setIsSaving(true)

      // Create address data for API based on the API documentation
      const addressData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.street,
        zipcode: formData.postal,
        city: formData.city,
      }

      console.log("Updating customer with address data:", addressData)

      // Call the API to update the customer
      await updateCustomer(user.id, addressData)

      // Add new address to local state
      const newAddress: Address = {
        id: Date.now().toString(), // Generate temporary ID
        ...formData,
      }
      setAddresses((prev) => [...prev, newAddress])

      // Close dialog and show success message
      setIsDialogOpen(false)
      toast({
        title: "Adres toegevoegd",
        description: "Het nieuwe adres is succesvol toegevoegd",
      })
    } catch (err) {
      console.error("Error saving address:", err)
      toast({
        title: "API Fout",
        description: "Er is een fout opgetreden bij het opslaan van het adres. Probeer het later opnieuw.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Adressen</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Adressen laden...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-600 mb-4">
            <p>{error}</p>
            <p className="text-sm mt-2">Hieronder worden voorbeeldadressen getoond.</p>
          </div>
        ) : null}

        {addresses.length === 0 && !loading ? (
          <div className="text-center py-8 bg-gray-50 rounded-md">
            <p className="text-gray-500">Je hebt nog geen adressen toegevoegd.</p>
            <Button onClick={handleAddAddress} variant="outline" className="mt-4" disabled={isSaving}>
              <Plus className="h-4 w-4 mr-2" />
              Adres toevoegen
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <Card key={address.id} className="p-4">
                <div className="mb-2">
                  <h3 className="font-semibold">{address.type}</h3>
                </div>
                <div className="text-sm text-gray-600">
                  <p>
                    {address.firstName} {address.lastName}
                  </p>
                  <p>{address.street}</p>
                  <p>
                    {address.postal} {address.city}
                  </p>
                </div>
                {address.isDefault && (
                  <div className="mt-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Standaard adres</span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Add Address Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => !isSaving && setIsDialogOpen(open)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nieuw adres toevoegen</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Type adres</Label>
              <Select value={formData.type} onValueChange={handleTypeChange} disabled={isSaving}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Factuuradres">Factuuradres</SelectItem>
                  <SelectItem value="Bezorgadres">Bezorgadres</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">Voornaam</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Voornaam"
                  disabled={isSaving}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Achternaam</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Achternaam"
                  disabled={isSaving}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="street">Straat en huisnummer</Label>
              <Input
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                placeholder="Straat en huisnummer"
                disabled={isSaving}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="postal">Postcode</Label>
                <Input
                  id="postal"
                  name="postal"
                  value={formData.postal}
                  onChange={handleInputChange}
                  placeholder="Postcode"
                  disabled={isSaving}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">Plaats</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Plaats"
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
              Annuleren
            </Button>
            <Button onClick={handleSaveAddress} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Bezig...
                </>
              ) : (
                "Toevoegen"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
