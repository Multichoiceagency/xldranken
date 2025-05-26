"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { useRouter } from "next/navigation"

// Define the props interface for OrderButton
export interface OrderButtonProps {
  orderGuid: string
  // Add orderNumber to the props interface
  orderNumber?: string
}

export default function OrderButton({ orderGuid, orderNumber }: OrderButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleViewOrder = async () => {
    setLoading(true)
    try {
      // Navigate to order details page
      router.push(`/bestellingen/${orderGuid}`)
    } catch (error) {
      console.error("Error viewing order:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleViewOrder} disabled={loading}>
      <Eye className="h-4 w-4 mr-2" />
      {loading ? "Laden..." : "Bekijken"}
    </Button>
  )
}
