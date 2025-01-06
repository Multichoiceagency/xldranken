'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash } from 'lucide-react'

const addresses = [
  {
    type: "Factuuradres",
    name: "Sydney Dranken",
    street: "Hoofdstraat 123",
    postal: "1234 AB",
    city: "Amsterdam",
  },
  {
    type: "Bezorgadres",
    name: "Sydney Dranken",
    street: "Magazijnweg 45",
    postal: "1234 CD",
    city: "Amsterdam",
  },
]

export function AddressesPage() {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Adressen</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nieuw adres
        </Button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <Card key={address.type} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{address.type}</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>{address.name}</p>
              <p>{address.street}</p>
              <p>{address.postal} {address.city}</p>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  )
}

