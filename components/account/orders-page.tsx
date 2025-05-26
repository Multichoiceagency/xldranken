"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, ChevronUp, Package } from "lucide-react"
import Image from "next/image"

// Enhanced order data with products
const orders = [
  {
    id: "ORD-2024-001",
    date: "05-01-2024",
    status: "Afgeleverd",
    total: "€156,95",
    products: [
      {
        id: "P001",
        name: "Heineken Bier",
        quantity: 2,
        price: "€24,95",
        image: "/placeholder.svg?height=50&width=50&query=beer",
      },
      {
        id: "P002",
        name: "Coca Cola 6x1.5L",
        quantity: 3,
        price: "€12,99",
        image: "/placeholder.svg?height=50&width=50&query=cola",
      },
      {
        id: "P003",
        name: "Tyskie Bier Blik 24x50cl",
        quantity: 1,
        price: "€29,95",
        image: "/placeholder.svg?height=50&width=50&query=tyskie",
      },
    ],
  },
  {
    id: "ORD-2023-089",
    date: "28-12-2023",
    status: "In behandeling",
    total: "€89,50",
    products: [
      {
        id: "P004",
        name: "Witte Wijn Chardonnay",
        quantity: 2,
        price: "€18,95",
        image: "/placeholder.svg?height=50&width=50&query=wine",
      },
      {
        id: "P005",
        name: "Chips Paprika 200g",
        quantity: 4,
        price: "€1,99",
        image: "/placeholder.svg?height=50&width=50&query=chips",
      },
    ],
  },
]

export default function OrdersPage() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null)
    } else {
      setExpandedOrder(orderId)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="p-6 overflow-visible">
        <h1 className="text-2xl font-bold mb-6">Bestellingen</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bestelnummer</TableHead>
              <TableHead>Datum</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Totaal</TableHead>
              <TableHead>Actie</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <>
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "Afgeleverd" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{order.total}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleOrderDetails(order.id)}
                      className="flex items-center"
                    >
                      {expandedOrder === order.id ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-2" />
                          Verbergen
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Bekijken
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>

                {/* Expanded product details */}
                {expandedOrder === order.id && (
                  <TableRow className="bg-gray-50">
                    <TableCell colSpan={5} className="p-0">
                      <div className="p-4">
                        <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                          <Package className="h-4 w-4 mr-2 text-[#FF6B35]" />
                          Bestelde Producten
                        </h3>
                        <div className="bg-white rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[80px]">Afbeelding</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead className="text-center">Aantal</TableHead>
                                <TableHead className="text-right">Prijs</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {order.products.map((product) => (
                                <TableRow key={product.id}>
                                  <TableCell>
                                    <div className="relative h-12 w-12">
                                      <Image
                                        src={product.image || "/placeholder.svg"}
                                        alt={product.name}
                                        fill
                                        className="object-contain"
                                      />
                                    </div>
                                  </TableCell>
                                  <TableCell className="font-medium">{product.name}</TableCell>
                                  <TableCell className="text-center">{product.quantity}x</TableCell>
                                  <TableCell className="text-right">{product.price}</TableCell>
                                </TableRow>
                              ))}
                              <TableRow>
                                <TableCell colSpan={3} className="text-right font-bold">
                                  Totaal:
                                </TableCell>
                                <TableCell className="text-right font-bold text-[#FF6B35]">{order.total}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>

        {orders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Geen bestellingen gevonden</p>
          </div>
        )}
      </Card>
    </div>
  )
}
