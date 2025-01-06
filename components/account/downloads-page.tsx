'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from 'lucide-react'

const downloads = [
  {
    name: "Factuur #2024-001",
    date: "05-01-2024",
    type: "PDF",
  },
  {
    name: "Factuur #2023-089",
    date: "28-12-2023",
    type: "PDF",
  },
]

export function DownloadsPage() {
  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold mb-6">Downloads</h1>
      <div className="space-y-4">
        {downloads.map((download) => (
          <Card key={download.name} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{download.name}</h3>
                <p className="text-sm text-gray-500">{download.date}</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download {download.type}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  )
}

