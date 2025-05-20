"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ShoppingCart, Check, Plus, Minus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"
import type { ProductProps } from "@/types/product"
import { useAuthContext } from "@/context/AuthContext"

export default function ProductCard({ product }: { product: ProductProps }) {
  const { addToCart, isInCart, cart, updateQuantity, removeFromCart } = useCart()
  const { toast } = useToast()
  const { isLoggedIn, loading } = useAuthContext()
  const [isAnimating, setIsAnimating] = useState(false)
  const [quantityInput, setQuantityInput] = useState("0")
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [inCartInfo, setInCartInfo] = useState({ inCart: false, quantity: 0 })
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    if (!product) return

    const inCart = isInCart(product.arcleunik)
    const quantity = inCart ? cart.find((item) => item.id === product.arcleunik)?.quantity || 0 : 0

    setInCartInfo({ inCart, quantity })
    setQuantityInput(quantity > 0 ? quantity.toString() : "0")
  }, [cart, isInCart, product])

  if (!product) return <p className="text-gray-500">Product niet beschikbaar</p>

  // Replace the getImageSrc function with this simpler version that focuses on base64 handling
  const getImageSrc = () => {
    // If we have a photo1_base64 field
    if (product.photo1_base64) {
      // Check if it's already a complete data URL
      if (product.photo1_base64.startsWith("data:image")) {
        return product.photo1_base64
      }

      // Otherwise, assume it's a base64 string without the prefix
      return `data:image/jpeg;base64,${product.photo1_base64}`
    }

    // Fallback to placeholder
    return "/placeholder.svg"
  }

  const imageSrc = getImageSrc()
  const regularPrice = Number(product.prix_vente_groupe) || 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    const quantity = Math.max(1, Number.parseInt(quantityInput) || 1)

    setIsAnimating(true)
    addToCart({
      id: product.arcleunik,
      name: product.title,
      price: regularPrice,
      image: imageSrc,
      volume: product.arcleunik,
      productCode: product.productCode || "",
      quantity,
    })

    toast({
      title: "Product toegevoegd",
      description: `${product.title} is toegevoegd aan je winkelwagen`,
    })

    setTimeout(() => setIsAnimating(false), 1000)
  }

  const handleQuantityChange = (val: number) => {
    setQuantityInput(val.toString())
    if (inCartInfo.inCart) {
      updateQuantity(product.arcleunik, val)
      toast({
        title: "Hoeveelheid bijgewerkt",
        description: `${product.title}: ${val} stuks`,
      })
    }
  }

  const navigateToProductPage = () => {
    router.push(`/product/${product.arcleunik}`)
  }

  return (
    <div className="group relative flex flex-col bg-white rounded-lg border transition-all duration-500 h-full w-full">
      <div
        className="relative h-[120px] sm:h-[160px] md:h-[200px] w-full overflow-hidden p-2 sm:p-4 cursor-pointer"
        onClick={navigateToProductPage}
      >
        <Image
          src={imageError ? "/placeholder.svg" : imageSrc}
          alt={product.title}
          fill
          className={`object-contain transition-transform duration-500 ${isAnimating ? "scale-110" : "group-hover:scale-75"}`}
          unoptimized
          onError={() => setImageError(true)}
        />
        {isAnimating && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 animate-pulse">
            <div className="bg-green-500 text-white rounded-full p-1 sm:p-2 animate-bounce">
              <Check className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col p-2 sm:p-4 pt-0 flex-grow">
        <h3
          className="text-left font-bold text-[#002B7F] min-h-[2.5rem] line-clamp-2 text-xs sm:text-sm md:text-base cursor-pointer mb-1 sm:mb-2"
          onClick={navigateToProductPage}
        >
          {product.title}
        </h3>

        <div className="flex items-center justify-between mb-2 sm:mb-4 mt-auto">
          {loading ? (
            <span className="text-xs sm:text-sm text-gray-400 font-medium">Laden...</span>
          ) : isLoggedIn ? (
            <span className="text-[#E31931] text-sm sm:text-lg md:text-xl font-bold">
              {regularPrice > 0 ? `€ ${regularPrice.toFixed(2).replace(".", ",")}` : "Prijs onbekend"}
            </span>
          ) : (
            <span className="text-gray-600 text-xs sm:text-sm font-normal hover:font-bold hover:text-green-700">
              Log in voor prijzen
            </span>
          )}

          {isLoggedIn && inCartInfo.inCart && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-red-500 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation()
                removeFromCart(product.arcleunik)
                setQuantityInput("0")
                toast({
                  title: "Product verwijderd",
                  description: `${product.title} is verwijderd uit je winkelwagen`,
                })
              }}
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          )}
        </div>

        {!loading && isLoggedIn && (
          <div className="flex flex-col space-y-2">
            {/* Quantity Selector - Now above the button */}
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium">Aantal:</span>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    const val = Math.max(0, Number.parseInt(quantityInput) - 1)
                    handleQuantityChange(val)
                  }}
                  disabled={Number.parseInt(quantityInput) <= 0}
                >
                  <Minus className="h-3 w-3" />
                </Button>

                <input
                  ref={inputRef}
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={quantityInput}
                  onChange={(e) => {
                    if (/^\d*$/.test(e.target.value)) setQuantityInput(e.target.value)
                  }}
                  onBlur={() => handleQuantityChange(Number.parseInt(quantityInput) || 0)}
                  onKeyDown={(e) => e.key === "Enter" && inputRef.current?.blur()}
                  className="w-10 text-center text-xs sm:text-sm font-medium border-0 focus:ring-0"
                  aria-label="Aantal"
                />

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    const val = Math.max(0, Number.parseInt(quantityInput) + 1)
                    handleQuantityChange(val)
                  }}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              className="w-full bg-green-500 hover:bg-green-600 text-white transition-all duration-300 h-8 px-2 sm:px-3"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-6 h-6 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">In winkelmand</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
