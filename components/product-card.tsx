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

  useEffect(() => {
    if (!product) return

    const inCart = isInCart(product.arcleunik)
    const quantity = inCart ? cart.find((item) => item.id === product.arcleunik)?.quantity || 0 : 0

    setInCartInfo({ inCart, quantity })
    setQuantityInput(quantity > 0 ? quantity.toString() : "0")
  }, [cart, isInCart, product])

  if (!product) return <p className="text-gray-500">Product niet beschikbaar</p>

  const imageSrc = product.photo1_base64
    ? product.photo1_base64.startsWith("data:image")
      ? product.photo1_base64
      : `data:image/jpeg;base64,${product.photo1_base64}`
    : "/placeholder.svg"

  const regularPrice = Number(product.prix_vente_groupe) || 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    const quantity = Math.max(1, parseInt(quantityInput) || 1)

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
    <div className="group relative flex flex-col bg-white rounded-lg border transition-all duration-500 h-full w-full min-w-[220px] md:min-w-[240px]">
      <div
        className="relative h-[160px] md:h-[200px] w-full overflow-hidden p-4 cursor-pointer"
        onClick={navigateToProductPage}
      >
        <Image
          src={imageSrc}
          alt={product.title}
          fill
          className={`object-contain transition-transform duration-500 ${isAnimating ? "scale-110" : "group-hover:scale-75"}`}
          unoptimized
        />
        {isAnimating && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 animate-pulse">
            <div className="bg-green-500 text-white rounded-full p-2 animate-bounce">
              <Check className="w-6 h-6" />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col p-4 pt-0">
        <h3
          className="text-left font-bold text-[#002B7F] min-h-[2.5rem] line-clamp-2 text-sm md:text-base cursor-pointer mb-2"
          onClick={navigateToProductPage}
        >
          {product.title}
        </h3>

        <div className="flex items-center justify-between mb-4">
          {loading ? (
            <span className="text-sm text-gray-400 font-medium ">Laden...</span>
          ) : isLoggedIn ? (
            <span className="text-[#E31931] text-lg md:text-xl font-bold">
              {regularPrice > 0 ? `€ ${regularPrice.toFixed(2).replace(".", ",")}` : "Prijs onbekend"}
            </span>
          ) : (
            <span className="text-gray-600 text-sm font-normal hover:font-bold hover:text-green-700">Log in om prijzen te zien</span>
          )}

          {isLoggedIn && inCartInfo.inCart && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
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
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {!loading && isLoggedIn && (
          <div className="flex items-center space-x-2">
            <Button
              className="flex-1 bg-green-500 hover:bg-green-600 text-white transition-all duration-300"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              <span className="text-sm">In winkelmand</span>
            </Button>

            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0"
                onClick={() => {
                  const val = Math.max(0, parseInt(quantityInput) - 1)
                  handleQuantityChange(val)
                }}
                disabled={parseInt(quantityInput) <= 0}
              >
                <Minus className="h-3 w-3" />
              </Button>

              <input
                ref={inputRef}
                type="text"
                value={quantityInput}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) setQuantityInput(e.target.value)
                }}
                onBlur={() => handleQuantityChange(parseInt(quantityInput))}
                onKeyDown={(e) => e.key === "Enter" && inputRef.current?.blur()}
                className="w-8 text-center text-sm font-medium border-0 focus:ring-0"
                aria-label="Aantal"
              />

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0"
                onClick={() => {
                  const val = Math.max(0, parseInt(quantityInput) + 1)
                  handleQuantityChange(val)
                }}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
