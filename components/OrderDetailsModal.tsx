"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Download, Printer } from "lucide-react"

// Update this interface to match your actual API response structure
interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  total: number
}

// Update this interface to match your actual API response structure
interface OrderDetails {
  orderNumber: string
  date: string
  status: string
  shippingAddress: {
    name: string
    street: string
    city: string
    postalCode: string
    country: string
  }
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  paymentMethod: string
}

interface OrderDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  orderGuid: string
  orderNumber: string
}

export function OrderDetailsModal({ isOpen, onClose, orderGuid, orderNumber }: OrderDetailsModalProps) {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && orderGuid) {
      fetchOrderDetails()
    }

    // Reset state when modal closes
    if (!isOpen) {
      setOrderDetails(null)
      setError(null)
    }
  }, [isOpen, orderGuid])

  const fetchOrderDetails = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/orders/${orderGuid}`)

      if (!response.ok) {
        throw new Error("Kon de bestelgegevens niet ophalen")
      }

      const data = await response.json()
      setOrderDetails(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er is een fout opgetreden")
      console.error("Error fetching order details:", err)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadInvoice = async () => {
    try {
      const response = await fetch(`/api/orders/${orderGuid}/invoice`)

      if (!response.ok) {
        throw new Error("Kon de factuur niet downloaden")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `factuur-${orderNumber}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er is een fout opgetreden bij het downloaden van de factuur")
      console.error("Error downloading invoice:", err)
    }
  }

  // Function to safely access nested properties
  const safeGet = (obj: any, path: string, fallback: any = null) => {
    return path.split(".").reduce((prev, curr) => {
      return prev && prev[curr] !== undefined ? prev[curr] : fallback
    }, obj)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Bestelling #{orderNumber}</DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <Spinner size="large" className="text-[#E2B505]" />
            <span className="ml-3 text-gray-600">Bestelgegevens laden...</span>
          </div>
        )}

        {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">{error}</div>}

        {orderDetails && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Bestelgegevens</h3>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-medium">Datum:</span> {formatDate(safeGet(orderDetails, "date", ""))}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span> {safeGet(orderDetails, "status", "Onbekend")}
                  </p>
                  <p>
                    <span className="font-medium">Betaalmethode:</span>{" "}
                    {safeGet(orderDetails, "paymentMethod", "Onbekend")}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Verzendadres</h3>
                <div className="text-sm space-y-1">
                  <p>{safeGet(orderDetails, "shippingAddress.name", "")}</p>
                  <p>{safeGet(orderDetails, "shippingAddress.street", "")}</p>
                  <p>
                    {safeGet(orderDetails, "shippingAddress.postalCode", "")}{" "}
                    {safeGet(orderDetails, "shippingAddress.city", "")}
                  </p>
                  <p>{safeGet(orderDetails, "shippingAddress.country", "")}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Bestelde producten</h3>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Aantal</TableHead>
                      <TableHead className="text-right">Prijs</TableHead>
                      <TableHead className="text-right">Totaal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {safeGet(orderDetails, "items", []).map((item: OrderItem) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Subtotaal</span>
                <span>{formatCurrency(safeGet(orderDetails, "subtotal", 0))}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span>Verzendkosten</span>
                <span>{formatCurrency(safeGet(orderDetails, "shipping", 0))}</span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span>BTW</span>
                <span>{formatCurrency(safeGet(orderDetails, "tax", 0))}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Totaal</span>
                <span>{formatCurrency(safeGet(orderDetails, "total", 0))}</span>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between items-center gap-2 sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Sluiten
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePrint}
              disabled={loading || !orderDetails}
              className="flex items-center gap-1"
            >
              <Printer className="h-4 w-4" />
              <span>Afdrukken</span>
            </Button>
            <Button
              onClick={handleDownloadInvoice}
              disabled={loading || !orderDetails}
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              <span>Factuur</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
