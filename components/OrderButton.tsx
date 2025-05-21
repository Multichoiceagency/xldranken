"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { OrderDetailsModal } from "./OrderDetailsModal"

interface OrderButtonProps {
  orderGuid: string
  orderNumber: string
}

export default function OrderButton({ orderGuid, orderNumber }: OrderButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)} className="flex items-center gap-1">
        <Eye className="h-4 w-4" />
        <span>Bekijken</span>
      </Button>

      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderGuid={orderGuid}
        orderNumber={orderNumber}
      />
    </>
  )
}
