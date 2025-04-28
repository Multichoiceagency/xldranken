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

export default function ProductCard({ product }: { product: ProductProps }) {
  const { addToCart, isInCart, cart, updateQuantity, removeFromCart } = useCart()
  const { toast } = useToast()
  const [isAnimating, setIsAnimating] = useState(false)
  const [quantityInput, setQuantityInput] = useState("0") // Initialize to "0" instead of "1"
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [inCartInfo, setInCartInfo] = useState({
    inCart: false,
    quantity: 0,
  })

  // Update cart info when cart changes
  useEffect(() => {
    if (!product) return

    const inCart = isInCart(product.arcleunik)
    let quantity = 0

    if (inCart) {
      const cartItem = cart.find((item) => item.id === product.arcleunik)
      quantity = cartItem?.quantity || 0
    }

    setInCartInfo({ inCart, quantity })
    setQuantityInput(quantity > 0 ? quantity.toString() : "0")
  }, [cart, isInCart, product])

  if (!product) return <p className="text-gray-500">Product not found</p>

  // Build the correct image URL
  const imageSrc = product.photo1_base64
    ? product.photo1_base64.startsWith("data:image")
      ? product.photo1_base64
      : `data:image/jpeg;base64,${product.photo1_base64}`
    : "/placeholder.svg"

  // Format price
  const regularPrice = Number(product.prix_vente_groupe)

  const handleAddToCart = (e: React.MouseEvent) => {
    // Prevent navigation when clicking the add to cart button
    e.stopPropagation()

    // Get quantity from input, default to 1 if it's 0 or invalid
    const quantity = Number.parseInt(quantityInput, 10)
    const finalQuantity = isNaN(quantity) || quantity <= 0 ? 1 : quantity

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
      quantity: finalQuantity,
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
    const currentValue = Number.parseInt(quantityInput, 10) || 0
    const newValue = currentValue + 1
    setQuantityInput(newValue.toString())

    if (inCartInfo.inCart) {
      updateQuantity(product.arcleunik, newValue)

      toast({
        title: "Hoeveelheid bijgewerkt",
        description: `${product.title}: ${newValue} stuks in winkelwagen`,
      })
    }
  }

  const handleDecreaseQuantity = (e: React.MouseEvent) => {
    e.stopPropagation()
    const currentValue = Number.parseInt(quantityInput, 10) || 0
    if (currentValue > 0) {
      // Allow decreasing to 0
      const newValue = currentValue - 1
      setQuantityInput(newValue.toString())

      if (inCartInfo.inCart) {
        updateQuantity(product.arcleunik, newValue)

        toast({
          title: "Hoeveelheid bijgewerkt",
          description: `${product.title}: ${newValue} stuks in winkelwagen`,
        })
      }
    }
  }

  const handleRemoveFromCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (inCartInfo.inCart) {
      // Completely remove the product from cart
      removeFromCart(product.arcleunik)

      // Reset quantity to zero
      setQuantityInput("0")

      toast({
        title: "Product verwijderd",
        description: `${product.title} is verwijderd uit je winkelwagen`,
      })
    }
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // Allow only numbers
    if (/^\d*$/.test(value)) {
      setQuantityInput(value)
    }
  }

  const handleQuantityBlur = () => {
    let quantity = Number.parseInt(quantityInput, 10)

    // Handle invalid input, but allow 0
    if (isNaN(quantity)) {
      quantity = 0
    }

    setQuantityInput(quantity.toString())

    if (inCartInfo.inCart) {
      updateQuantity(product.arcleunik, quantity)

      toast({
        title: "Hoeveelheid bijgewerkt",
        description: `${product.title}: ${quantity} stuks in winkelwagen`,
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      inputRef.current?.blur()
    }
  }

  const navigateToProductPage = () => {
    // Use the product ID for navigation
    router.push(`/product/${product.arcleunik}`)
  }

  return (
    <div className="group relative flex flex-col bg-white rounded-lg border transition-all duration-500 h-full w-full min-w-[220px] md:min-w-[240px]">
      {/* Product image - clickable */}
      <div
        className="relative h-[160px] md:h-[200px] w-full overflow-hidden p-2 md:p-4 cursor-pointer"
        onClick={navigateToProductPage}
      >
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={product.title}
          style={{ padding: "2px" }}
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
      <div className="flex flex-col p-3 md:p-4 pt-0" style={{ paddingTop: "10px" }}>
        <h3
          className="text-center font-bold text-[#002B7F] min-h-[2.5rem] line-clamp-2 text-sm md:text-base cursor-pointer mb-2"
          onClick={navigateToProductPage}
        >
          {product.title}
        </h3>

        {/* Price display with inline trash icon */}
        <div className="space-y-1 flex items-center justify-between">
          {regularPrice > 0 ? (
            <div className="text-[#E31931] text-lg md:text-2xl font-bold">
              € {regularPrice.toFixed(2).replace(".", ",")}
            </div>
          ) : (
            <div className="text-gray-500 text-sm">Prijs niet beschikbaar</div>
          )}

          {/* Trash icon with tooltip */}
          <div className="relative group/trash">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={handleRemoveFromCart}
              disabled={!inCartInfo.inCart}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Verwijderen</span>
            </Button>
            <div className="absolute right-0 bottom-full mb-1 w-auto min-w-max opacity-0 group-hover/trash:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2 pointer-events-none z-10">
              Product verwijderen
            </div>
          </div>
        </div>

        {/* Add to cart button or quantity controls */}
        <div className="mt-4" onClick={(e) => e.stopPropagation()}>
          {isAnimating ? (
            <Button className="w-full bg-green-500 scale-105 shadow-md text-white transition-all duration-300" disabled>
              <Check className="w-4 h-4 mr-2 animate-bounce" />
              Toegevoegd!
            </Button>
          ) : (
            <>
              {/* Mobile layout (stacked) */}
              <div className="flex flex-col space-y-1 md:hidden">
                {/* Quantity controls */}
                <div className="flex items-center border rounded-md justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900"
                    onClick={handleDecreaseQuantity}
                    disabled={Number.parseInt(quantityInput, 10) <= 0} // Disable at 0
                  >
                    <Minus className="h-3 w-3" />
                    <span className="sr-only">Verminderen</span>
                  </Button>

                  <input
                    ref={inputRef}
                    type="text"
                    value={quantityInput}
                    onChange={handleQuantityChange}
                    onBlur={handleQuantityBlur}
                    onKeyDown={handleKeyDown}
                    className="w-8 text-center text-sm font-medium border-0 focus:ring-0 focus:outline-none"
                    aria-label="Quantity"
                  />

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

                {/* Cart button */}
                <Button
                  className="w-full bg-green-500 hover:bg-green-600 text-white transition-all duration-300"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  <span className="whitespace-nowrap text-xs md:text-sm">
                    {inCartInfo.inCart ? "In winkelmand" : "In winkelmand"}
                  </span>
                </Button>
              </div>

              {/* Desktop layout (side by side) */}
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white transition-all duration-300"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  <span className="whitespace-nowrap text-xs md:text-sm">
                    {inCartInfo.inCart ? "In winkelmand" : "In winkelmand"}
                  </span>
                </Button>

                {/* Quantity controls */}
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900"
                    onClick={handleDecreaseQuantity}
                    disabled={Number.parseInt(quantityInput, 10) <= 0} // Disable at 0
                  >
                    <Minus className="h-3 w-3" />
                    <span className="sr-only">Verminderen</span>
                  </Button>

                  <input
                    type="text"
                    value={quantityInput}
                    onChange={handleQuantityChange}
                    onBlur={handleQuantityBlur}
                    onKeyDown={handleKeyDown}
                    className="w-8 text-center text-sm font-medium border-0 focus:ring-0 focus:outline-none"
                    aria-label="Quantity"
                  />

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
            </>
          )}
        </div>
      </div>
    </div>
  )
}

