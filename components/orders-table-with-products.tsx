"use client"

import React, { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, ChevronUp, Package, Loader2 } from "lucide-react"
import Image from "next/image"
import { formatDate, formatCurrency } from "@/lib/utils"
import OrderButton from "@/components/account/OrderButton"

interface Order {
  clcleunik: string
  date: string
  confirmation_date: string
  totalTVAC: string
  guid: string
}

interface OrderProduct {
  id: string
  name: string
  quantity: number
  price: number
  image?: string
}

interface OrdersTableWithProductsProps {
  orders: Order[]
}

export function OrdersTableWithProducts({ orders }: OrdersTableWithProductsProps) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [loadingProducts, setLoadingProducts] = useState<string | null>(null)
  const [orderProducts, setOrderProducts] = useState<Record<string, OrderProduct[]>>({})

  const toggleOrderDetails = async (orderGuid: string) => {
    if (expandedOrder === orderGuid) {
      setExpandedOrder(null)
    } else {
      setExpandedOrder(orderGuid)

      // If we haven't loaded products for this order yet, fetch them
      if (!orderProducts[orderGuid]) {
        await fetchOrderProducts(orderGuid)
      }
    }
  }

  const fetchOrderProducts = async (orderGuid: string) => {
    setLoadingProducts(orderGuid)

    try {
      // Call your API to get order details/products
      const response = await fetch(`/api/orders/${orderGuid}/products`)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Error response:", errorData)
        throw new Error(errorData.error || "Failed to fetch order products")
      }

      const data = await response.json()

      if (!data.success || !data.products) {
        console.error("Invalid response format:", data)
        throw new Error("Invalid response format")
      }

      console.log(`Received ${data.products.length} products for order ${orderGuid}`)

      setOrderProducts((prev) => ({
        ...prev,
        [orderGuid]: data.products || [],
      }))
    } catch (error) {
      console.error("Error fetching order products:", error)
      // Show an error message to the user
      setOrderProducts((prev) => ({
        ...prev,
        [orderGuid]: [], // Set empty array for this order
      }))
    } finally {
      setLoadingProducts(null)
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Bestelnummer</TableHead>
          <TableHead>Datum</TableHead>
          <TableHead>Bevestigingsdatum</TableHead>
          <TableHead>Totaal</TableHead>
          <TableHead>Producten</TableHead>
          <TableHead className="text-right">Actie</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <React.Fragment key={order.guid}>
            <TableRow>
              <TableCell className="font-medium">{order.clcleunik}</TableCell>
              <TableCell>{order.date ? formatDate(order.date) : "-"}</TableCell>
              <TableCell>
                {order.confirmation_date ? formatDate(order.confirmation_date) : "Geen bevestiging"}
              </TableCell>
              <TableCell>{formatCurrency(Number.parseFloat(order.totalTVAC || "0"))}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleOrderDetails(order.guid)}
                  className="flex items-center"
                >
                  {expandedOrder === order.guid ? (
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
              <TableCell className="text-right">
                <OrderButton orderGuid={order.guid} />
              </TableCell>
            </TableRow>

            {/* Expanded product details */}
            {expandedOrder === order.guid && (
              <TableRow className="bg-gray-50">
                <TableCell colSpan={6} className="p-0">
                  <div className="p-4">
                    <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                      <Package className="h-4 w-4 mr-2 text-[#FF6B35]" />
                      Bestelde Producten
                    </h3>

                    {loadingProducts === order.guid ? (
                      <div className="flex justify-center items-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-[#FF6B35]" />
                        <span className="ml-2 text-gray-600">Producten laden...</span>
                      </div>
                    ) : (
                      <div className="bg-white rounded-md border">
                        {orderProducts[order.guid] && orderProducts[order.guid].length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[80px]">Afbeelding</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead className="text-center">Aantal</TableHead>
                                <TableHead className="text-right">Prijs</TableHead>
                                <TableHead className="text-right">Subtotaal</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {orderProducts[order.guid].map((product) => (
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
                                  <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
                                  <TableCell className="text-right font-medium">
                                    {formatCurrency(product.price * product.quantity)}
                                  </TableCell>
                                </TableRow>
                              ))}
                              <TableRow>
                                <TableCell colSpan={4} className="text-right font-bold">
                                  Totaal:
                                </TableCell>
                                <TableCell className="text-right font-bold text-[#FF6B35]">
                                  {formatCurrency(Number.parseFloat(order.totalTVAC || "0"))}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            Geen producten gevonden voor deze bestelling
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  )
}
