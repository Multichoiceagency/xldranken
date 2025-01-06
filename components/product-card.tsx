'use client'

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CartPopup } from "@/components/cart-popup"
import { useCart } from "@/lib/cart-context"

interface ProductCardProps {
  id: string
  name: string
  slug: string
  image: string
  price: number
  originalPrice?: number
  volume: string
  category: string
}

export function ProductCard({
  id,
  name,
  slug,
  image,
  price,
  originalPrice,
  volume,
  category,
}: ProductCardProps) {
  const [showCartPopup, setShowCartPopup] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({
      id,
      name,
      price,
      image,
      volume,
      quantity: 1
    })
    setShowCartPopup(true)
  }

  return (
    <>
      <div className="group relative flex flex-col bg-card p-4 rounded-lg border">
        <button
          className="absolute right-2 top-2 z-10 rounded-full p-2 hover:bg-accent"
          aria-label="Add to wishlist"
        >
          <Heart className="h-5 w-5" />
        </button>
        <Link href={`/product/${slug}`} className="relative h-[300px] w-full overflow-hidden rounded-lg">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            priority
          />
        </Link>
        <div className="mt-4 flex flex-col flex-grow">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              €{price.toFixed(2).replace('.', ',')}
            </span>
            {originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                €{originalPrice.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>
          <Link href={`/product/${slug}`} className="block mt-2">
            <h3 className="font-medium hover:text-primary transition-colors">{name}</h3>
          </Link>
          <p className="text-sm text-muted-foreground">{volume}</p>
          <div className="mt-auto pt-4">
            <Button
              className="w-full bg-[#FF6B35] hover:bg-[#E85A24] text-white"
              onClick={handleAddToCart}
            >
              <span className="mr-2">Add to Cart</span>
              <ShoppingCart 
                className={cn(
                  "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                  "group-hover:animate-bounce"
                )} 
              />
            </Button>
          </div>
        </div>
      </div>

      <CartPopup
        open={showCartPopup}
        onClose={() => setShowCartPopup(false)}
        product={{
          id,
          name,
          image,
          price,
          volume
        }}
        quantity={1}
      />
    </>
  )
}

