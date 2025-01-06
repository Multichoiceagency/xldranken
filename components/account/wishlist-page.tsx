'use client'

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, ShoppingCart } from 'lucide-react'

// This would typically come from an API or state management solution
const initialWishlistItems = [
  {
    id: "1",
    name: "Tanqueray London Dry Gin",
    slug: "tanqueray-london-dry-gin",
    image: "https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    price: 17.49,
    originalPrice: 22.99,
    rating: 4.6,
    volume: "70CL",
    category: "Gin",
  },
  {
    id: "2",
    name: "Bombay Sapphire Gin",
    slug: "bombay-sapphire-gin",
    image: "https://images.pexels.com/photos/5947019/pexels-photo-5947019.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    price: 19.99,
    originalPrice: 24.99,
    rating: 4.8,
    volume: "70CL",
    category: "Gin",
  },
]

export function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(initialWishlistItems)

  const removeFromWishlist = (id: string) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id))
  }

  const addToCart = (id: string) => {
    // This would typically call an API to add the item to the cart
    console.log(`Added item ${id} to cart`)
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`h-5 w-5 ${
          i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"
        }`}
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mijn Wishlist</h1>
      {wishlistItems.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Je wishlist is momenteel leeg.</p>
      ) : (
        <ul className="space-y-6">
          {wishlistItems.map((item) => (
            <li key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b pb-6">
              <div className="relative w-full sm:w-32 h-32">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex-grow">
                <Link href={`/product/${item.slug}`} className="text-lg font-semibold hover:text-[#FF6B35] transition-colors">
                  {item.name}
                </Link>
                <p className="text-sm text-gray-500">{item.category} - {item.volume}</p>
                <div className="flex items-center mt-2">
                  {renderStars(item.rating)}
                  <span className="ml-2 text-sm text-gray-500">{item.rating}</span>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-[#FF6B35]">€{item.price.toFixed(2)}</span>
                  {item.originalPrice && (
                    <span className="ml-2 text-sm text-gray-500 line-through">€{item.originalPrice.toFixed(2)}</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
                <Button
                  variant="default"
                  onClick={() => addToCart(item.id)}
                  className="w-full sm:w-auto"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  In winkelwagen
                </Button>
                <Button
                  variant="outline"
                  onClick={() => removeFromWishlist(item.id)}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Verwijderen
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

