'use client'

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Minus, Trash2, Search } from 'lucide-react'

// Mock product data
const allProducts = [
  { id: "1", name: "Tanqueray London Dry Gin", price: 17.49, image: "https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=100" },
  { id: "2", name: "Bombay Sapphire Gin", price: 19.99, image: "https://images.pexels.com/photos/5947019/pexels-photo-5947019.jpeg?auto=compress&cs=tinysrgb&w=100" },
  { id: "3", name: "Hendrick's Gin", price: 29.99, image: "https://images.pexels.com/photos/3019019/pexels-photo-3019019.jpeg?auto=compress&cs=tinysrgb&w=100" },
  { id: "4", name: "Johnnie Walker Black Label", price: 32.99, image: "https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=100" },
  { id: "5", name: "Glenfiddich 12 Year Old", price: 39.99, image: "https://images.pexels.com/photos/1089930/pexels-photo-1089930.jpeg?auto=compress&cs=tinysrgb&w=100" },
]

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export function BulkOrderPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const router = useRouter()

  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addToOrder = (product: typeof allProducts[0]) => {
    setOrderItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id)
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      } else {
        return [...prevItems, { ...product, quantity: 1 }]
      }
    })
  }

  const updateQuantity = (id: string, newQuantity: number) => {
    setOrderItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
      ).filter(item => item.quantity > 0)
    )
  }

  const removeItem = (id: string) => {
    setOrderItems(prevItems => prevItems.filter(item => item.id !== id))
  }

  const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Bulk order submitted:", orderItems)
    // Here you would typically send the order to your backend
    // For now, we'll just navigate to the cart page
    router.push('/cart')
  }

  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold mb-6">Bulkbestelling</h1>
      <div className="space-y-6">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Zoek producten..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="border rounded-md p-4">
          <h2 className="font-semibold mb-2">Snelle toevoeging</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {filteredProducts.map(product => (
              <Button
                key={product.id}
                variant="outline"
                onClick={() => addToOrder(product)}
                className="text-sm flex items-center justify-start p-2 h-auto"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={40}
                  height={40}
                  className="rounded-sm mr-2"
                />
                <span className="truncate">{product.name}</span>
              </Button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Prijs</TableHead>
                <TableHead>Aantal</TableHead>
                <TableHead>Subtotaal</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderItems.map(item => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="rounded-sm mr-2"
                      />
                      {item.name}
                    </div>
                  </TableCell>
                  <TableCell>€{item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                        className="w-16 text-center"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>€{(item.price * item.quantity).toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex justify-between items-center">
            <div className="text-xl font-bold">
              Totaal: €{totalAmount.toFixed(2)}
            </div>
            <Button type="submit" disabled={orderItems.length === 0}>
              Bestelling plaatsen
            </Button>
          </div>
        </form>
      </div>
    </Card>
  )
}

