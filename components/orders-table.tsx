"use client"

import React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, ChevronUp, Package, Loader2 } from "lucide-react"
import Image from "next/image"
import { Order } from "@/types/types"

interface OrdersTableProps {
  orders: Order[]
  isLoading?: boolean
  error?: string
}

export function OrdersTable({ orders, isLoading, error }: OrdersTableProps) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null)
    } else {
      setExpandedOrder(orderId)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF6B35]" />
        <span className="ml-2 text-gray-600">Bestellingen laden...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Er is een fout opgetreden: {error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Probeer opnieuw
        </Button>
      </div>
    )
  }

  return (
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
        {orders.length > 0 ? (
          orders.map((order) => (
            <React.Fragment key={order.id}>
              <TableRow>
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
            </React.Fragment>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
              Geen bestellingen gevonden
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
