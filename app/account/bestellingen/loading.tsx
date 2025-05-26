import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="p-6 overflow-visible">
        <h1 className="text-2xl font-bold mb-6">Mijn Bestellingen</h1>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#FF6B35]" />
          <span className="ml-2 text-gray-600">Bestellingen laden...</span>
        </div>
      </Card>
    </div>
  )
}
