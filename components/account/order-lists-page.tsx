'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'

export function OrderListsPage() {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bestellijsten</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nieuwe lijst
        </Button>
      </div>
      <div className="text-center py-8">
        <p className="text-gray-500">Je hebt nog geen bestellijsten aangemaakt.</p>
      </div>
    </Card>
  )
}

