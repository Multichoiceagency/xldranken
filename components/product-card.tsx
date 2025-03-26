"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ShoppingCart, Check, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"
import type { ProductProps } from "@/types/product"

export default function ProductCard({ product }: { product: ProductProps }) {
  const { addToCart, isInCart, cart, updateQuantity } = useCart()
  const { toast } = useToast()
  const [isAnimating, setIsAnimating] = useState(false)
  const router = useRouter()

  if (!product) return <p className="text-gray-500">Product not found</p>

  // Build the correct image URL
  const imageSrc = product.photo1_base64
    ? product.photo1_base64.startsWith("data:image")
      ? product.photo1_base64
      : `data:image/jpeg;base64,${product.photo1_base64}`
    : "/placeholder.svg"

  // Format price
  const regularPrice = Number(product.prix_vente_groupe)
  const productInCart = isInCart(product.arcleunik)

  // Get current quantity if product is in cart
  const currentQuantity = productInCart ? cart.find((item) => item.id === product.arcleunik)?.quantity || 0 : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    // Prevent navigation when clicking the add to cart button
    e.stopPropagation()

    // Set animation state
    setIsAnimating(true)

    // Create cart item
    addToCart({
      id: product.arcleunik,
      name: product.title,
      price: regularPrice,
      image: imageSrc,
      volume: product.arcleunik,
      productCode: product.productCode || "",
      quantity: 1,
    })

    // Show toast notification
    toast({
      title: "Product toegevoegd",
      description: `${product.title} is toegevoegd aan je winkelwagen`,
    })

    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false)
    }, 1000)
  }

  const handleIncreaseQuantity = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateQuantity(product.arcleunik, currentQuantity + 1)

    toast({
      title: "Hoeveelheid bijgewerkt",
      description: `${product.title}: ${currentQuantity + 1} stuks in winkelwagen`,
    })
  }

  const handleDecreaseQuantity = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (currentQuantity > 1) {
      updateQuantity(product.arcleunik, currentQuantity - 1)

      toast({
        title: "Hoeveelheid bijgewerkt",
        description: `${product.title}: ${currentQuantity - 1} stuks in winkelwagen`,
      })
    }
  }

  const navigateToProductPage = () => {
    // Use the product ID for navigation
    router.push(`/product/${product.arcleunik}`)
  }

  return (
    <div
      onClick={navigateToProductPage}
      className={`group relative flex flex-col bg-white rounded-lg border transition-all duration-500 h-full cursor-pointer ${
        isAnimating ? "shadow-lg scale-[1.02]" : "hover:shadow-lg"
      }`}
    >
      {/* Product image */}
      <div className="relative h-[200px] w-full overflow-hidden p-4">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={product.title}
          style={{ padding: "10px" }}
          fill
          className={`object-contain transition-transform duration-500 ${
            isAnimating ? "scale-110" : "group-hover:scale-105"
          }`}
          unoptimized
        />

        {/* Animation overlay when adding to cart */}
        {isAnimating && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 animate-pulse">
            <div className="bg-green-500 text-white rounded-full p-2 animate-bounce">
              <Check className="w-6 h-6" />
            </div>
          </div>
        )}
      </div>

      {/* Product details */}
      <div className="flex flex-col p-4 pt-0" style={{ paddingTop: "15px" }}>
        <h3 className="font-bold text-[#002B7F] hover:underline min-h-[2.5rem] line-clamp-2">{product.title}</h3>

        {/* Price display */}
        <div className="space-y-1">
          {regularPrice > 0 ? (
            <div className="text-[#E31931] text-2xl font-bold">€ {regularPrice.toFixed(2).replace(".", ",")}</div>
          ) : (
            <div className="text-gray-500 text-sm">Prijs niet beschikbaar</div>
          )}
        </div>

        {/* Add to cart button or quantity controls */}
        <div className="mt-4" onClick={(e) => e.stopPropagation()}>
          {isAnimating ? (
            <Button className="w-full bg-green-500 scale-105 shadow-md text-white transition-all duration-300" disabled>
              <Check className="w-4 h-4 mr-2 animate-bounce" />
              Toegevoegd!
            </Button>
          ) : productInCart ? (
            <div className="flex items-center space-x-2">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white transition-all duration-300 hover:shadow-md"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                <span className="whitespace-nowrap ">In winkelmand</span>
              </Button>

              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900"
                  onClick={handleDecreaseQuantity}
                  disabled={currentQuantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                  <span className="sr-only">Verminderen</span>
                </Button>

                <span className="w-8 text-center text-sm font-medium">{currentQuantity}</span>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900"
                  onClick={handleIncreaseQuantity}
                >
                  <Plus className="h-3 w-3" />
                  <span className="sr-only">Vermeerderen</span>
                </Button>
              </div>
            </div>
          ) : (
            <Button
              className="w-full bg-[#002B7F] hover:bg-green-700/90 text-white transition-all duration-300 hover:shadow-md"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              In winkelmand
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

