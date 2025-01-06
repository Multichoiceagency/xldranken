'use client'

import { Card } from "@/components/ui/card"
import { Tag } from 'lucide-react'

const deals = [
  {
    title: "10% korting op whisky",
    code: "WHISKY10",
    validUntil: "31-01-2024",
  },
  {
    title: "Gratis verzending",
    code: "FREESHIP",
    validUntil: "15-01-2024",
  },
]

export function DealsPage() {
  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold mb-6">Aanbiedingen</h1>
      <div className="grid gap-4">
        {deals.map((deal) => (
          <Card key={deal.code} className="p-4">
            <div className="flex items-start gap-4">
              <Tag className="h-6 w-6 text-[#FF6B35]" />
              <div>
                <h3 className="font-semibold">{deal.title}</h3>
                <p className="text-sm text-gray-500">Code: {deal.code}</p>
                <p className="text-sm text-gray-500">
                  Geldig tot: {deal.validUntil}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  )
}

