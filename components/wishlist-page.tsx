'use client'

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Trash2, ShoppingCart } from 'lucide-react'

const wishlistItems = [
  {
    id: 1,
    name: "Premium Whiskey",
    price: 59.99,
    image: "https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 2,
    name: "Craft Gin",
    price: 39.99,
    image: "https://images.pexels.com/photos/5947019/pexels-photo-5947019.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: 3,
    name: "Aged Rum",
    price: 44.99,
    image: "https://images.pexels.com/photos/3019019/pexels-photo-3019019.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
]

export function WishlistPage() {
  const [items, setItems] = useState(wishlistItems)

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>
      {items.length === 0 ? (
        <p className="text-center text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="relative h-48 mb-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-xl font-bold mt-2">${item.price.toFixed(2)}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => removeItem(item.id)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
                <Button variant="default" className="bg-[#FFD700] hover:bg-[#B8860B] text-white">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

