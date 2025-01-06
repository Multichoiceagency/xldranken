'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function MessagesPage() {
  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold mb-6">Gesprekken</h1>
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Je hebt nog geen gesprekken.</p>
        <Button>Start een nieuw gesprek</Button>
      </div>
    </Card>
  )
}

