"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, User } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/context/AuthContext"

interface SideCartProps {
  isOpen: boolean
  onClose: (e?: React.MouseEvent) => void
}

export function SideCart({ isOpen, onClose }: SideCartProps) {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart()
  const { totalItems, totalPrice } = getCartTotal()
  const { isLoggedIn, loading: authLoading } = useAuthContext()
  const cartRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // State for quantity inputs
  const [quantityInputs, setQuantityInputs] = useState<{ [key: string]: string }>({})

  // Initialize quantity inputs when cart changes
  useEffect(() => {
    const newInputs: { [key: string]: string } = {}
    cart.forEach((item) => {
      newInputs[item.id] = item.quantity.toString()
    })
    setQuantityInputs(newInputs)
  }, [cart])

  // Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Handle checkout navigation
  const handleCheckout = (e: React.MouseEvent) => {
    e.preventDefault()
    onClose()
    router.push("/checkout", { scroll: false })
  }

  // Handle continue shopping
  const handleContinueShopping = (e: React.MouseEvent) => {
    e.preventDefault()
    onClose()
  }

  // Handle product click
  const handleProductClick = (e: React.MouseEvent, productId: string) => {
    e.preventDefault()
    onClose()
    router.push(`/product/${productId}`, { scroll: false })
  }

  // Handle quantity change
  const handleQuantityChange = (id: string, newQuantity: number) => {
    const validQuantity = Math.max(1, newQuantity)
    updateQuantity(id, validQuantity)
    setQuantityInputs((prev) => ({
      ...prev,
      [id]: validQuantity.toString(),
    }))
  }

  // Handle quantity input change with real-time updates
  const handleQuantityInputChange = (id: string, value: string) => {
    // Only allow numeric input
    if (/^\d*$/.test(value)) {
      setQuantityInputs((prev) => ({
        ...prev,
        [id]: value,
      }))

      // Real-time update: if value is valid number > 0, update cart immediately
      const numValue = Number.parseInt(value)
      if (!isNaN(numValue) && numValue > 0) {
        updateQuantity(id, numValue)
      }
    }
  }

  // Handle quantity input blur/enter
  const handleQuantityInputBlur = (id: string) => {
    const value = quantityInputs[id]
    const numValue = Math.max(1, Number.parseInt(value) || 1)

    // Ensure the final value is valid and update both input and cart
    setQuantityInputs((prev) => ({
      ...prev,
      [id]: numValue.toString(),
    }))
    updateQuantity(id, numValue)
  }

  // Handle remove item
  const handleRemoveItem = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    removeFromCart(id)
  }

  // Get current quantity for price calculation (from input or cart)
  const getCurrentQuantity = (itemId: string, cartQuantity: number) => {
    const inputValue = quantityInputs[itemId]
    if (inputValue && inputValue !== "") {
      const numValue = Number.parseInt(inputValue)
      return !isNaN(numValue) && numValue > 0 ? numValue : cartQuantity
    }
    return cartQuantity
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] overflow-hidden backdrop-blur-sm">
      <div
        ref={cartRef}
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-all duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#C6B07F]/20 bg-gradient-to-r from-[#C6B07F]/5 to-[#d4c291]/5">
          <h2 className="text-xl font-bold flex items-center text-[#0F3059]">
            <div className="bg-gradient-to-r from-[#C6B07F] to-[#d4c291] p-2 rounded-lg mr-3">
              <ShoppingBag className="h-5 w-5 text-[#0F3059]" />
            </div>
            Winkelwagen ({totalItems})
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#C6B07F]/10 text-[#0F3059] hover:text-[#C6B07F] transition-all duration-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Authentication Status */}
        {!authLoading && !isLoggedIn && cart.length > 0 && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <User className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-blue-800 font-medium text-sm">Log in om af te rekenen</p>
                <p className="text-blue-600 text-xs">Uw winkelwagen wordt bewaard</p>
              </div>
            </div>
          </div>
        )}

        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-gradient-to-br from-[#C6B07F]/10 to-[#d4c291]/10 p-8 rounded-full mb-6">
              <ShoppingBag className="h-16 w-16 text-[#C6B07F]" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-[#0F3059]">Uw winkelwagen is leeg</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Ontdek ons uitgebreide assortiment van meer dan 900 producten
            </p>
            {!authLoading && !isLoggedIn && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6 w-full">
                <p className="text-blue-800 font-medium mb-2">Log in om te bestellen</p>
                <p className="text-blue-600 text-sm mb-4">
                  Meld je aan om prijzen te zien en producten toe te voegen aan je winkelwagen
                </p>
                <button
                  onClick={() => {
                    onClose()
                    router.push("/login")
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white font-semibold py-2 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  Inloggen
                </button>
              </div>
            )}
            <button
              onClick={handleContinueShopping}
              className="bg-gradient-to-r from-[#C6B07F] to-[#d4c291] hover:from-[#d4c291] hover:to-[#C6B07F] text-[#0F3059] font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2"
            >
              Start met winkelen
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.map((item, index) => {
                const currentQuantity = getCurrentQuantity(item.id, item.quantity)
                const currentPrice = item.price * currentQuantity

                return (
                  <div
                    key={item.id}
                    className={`flex border border-[#C6B07F]/10 rounded-lg p-4 bg-gradient-to-r from-white to-[#C6B07F]/5 hover:shadow-md transition-all duration-300 animate-fade-in`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <button
                      onClick={(e) => handleProductClick(e, item.id)}
                      className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex-shrink-0 relative overflow-hidden hover:scale-105 transition-transform duration-300"
                    >
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                        unoptimized
                      />
                    </button>

                    <div className="ml-4 flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <button
                          onClick={(e) => handleProductClick(e, item.id)}
                          className="font-semibold text-[#0F3059] hover:text-[#C6B07F] transition-colors duration-300 text-left line-clamp-2 flex-1 min-w-0 mr-2"
                        >
                          {item.name}
                        </button>
                        <button
                          onClick={(e) => handleRemoveItem(e, item.id)}
                          className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-all duration-300 flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {item.volume && <div className="text-sm text-gray-500 mb-3">{item.volume}</div>}

                      <div className="flex justify-between items-center gap-3">
                        {/* Quantity Controls - Fixed Width */}
                        <div className="flex items-center border border-[#C6B07F]/30 rounded-lg overflow-hidden bg-white flex-shrink-0">
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleQuantityChange(item.id, item.quantity - 1)
                            }}
                            className="w-10 h-10 sm:w-8 sm:h-8 text-[#0F3059] hover:bg-[#C6B07F]/10 active:bg-[#C6B07F]/20 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation flex items-center justify-center flex-shrink-0"
                            disabled={item.quantity <= 1}
                            type="button"
                          >
                            <Minus className="h-4 w-4 sm:h-3 sm:w-3" />
                          </button>

                          {/* Quantity Input Field - Fixed Width */}
                          <input
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={quantityInputs[item.id] || item.quantity.toString()}
                            onChange={(e) => handleQuantityInputChange(item.id, e.target.value)}
                            onBlur={() => handleQuantityInputBlur(item.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.currentTarget.blur()
                              }
                            }}
                            className="w-12 h-10 sm:w-10 sm:h-8 text-base sm:text-sm font-semibold text-[#0F3059] bg-[#C6B07F]/5 text-center border-0 focus:outline-none focus:bg-[#C6B07F]/10 transition-colors flex-shrink-0"
                            style={{ fontSize: "16px" }} // Prevent mobile zoom
                            aria-label="Aantal"
                          />

                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleQuantityChange(item.id, item.quantity + 1)
                            }}
                            className="w-10 h-10 sm:w-8 sm:h-8 text-[#0F3059] hover:bg-[#C6B07F]/10 active:bg-[#C6B07F]/20 transition-colors duration-300 touch-manipulation flex items-center justify-center flex-shrink-0"
                            type="button"
                          >
                            <Plus className="h-4 w-4 sm:h-3 sm:w-3" />
                          </button>
                        </div>

                        {/* Price - Real-time Updated */}
                        <div className="font-bold text-[#0F3059] text-lg flex-shrink-0 text-right">
                          €{currentPrice.toFixed(2).replace(".", ",")}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Cart Summary & Actions */}
            <div className="border-t border-[#C6B07F]/20 bg-gradient-to-r from-[#C6B07F]/5 to-[#d4c291]/5 p-6 space-y-4">
              {/* Summary */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotaal ({totalItems} items)</span>
                  <span className="font-semibold text-[#0F3059]">€{totalPrice.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Verzendkosten</span>
                  <span className="font-medium text-[#C6B07F]">Berekend bij checkout</span>
                </div>
                <div className="border-t border-[#C6B07F]/20 pt-3">
                  <div className="flex justify-between font-bold text-xl">
                    <span className="text-[#0F3059]">Totaal</span>
                    <span className="text-[#0F3059]">€{totalPrice.toFixed(2).replace(".", ",")}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={(e) => {
                    if (!isLoggedIn) {
                      e.preventDefault()
                      onClose()
                      router.push("/login")
                      return
                    }
                    handleCheckout(e)
                  }}
                  className="w-full bg-gradient-to-r from-[#0F3059] to-[#1a4a7a] hover:from-[#1a4a7a] hover:to-[#0F3059] text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                >
                  {!isLoggedIn ? "Inloggen om af te rekenen" : "Afrekenen"}
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleContinueShopping}
                    className="border-2 border-[#C6B07F] text-[#C6B07F] hover:bg-[#C6B07F] hover:text-[#0F3059] font-semibold px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
                  >
                    Verder winkelen
                  </button>
                  <a
                    href="/winkelmand"
                    onClick={(e) => {
                      e.preventDefault()
                      onClose()
                      router.push("/winkelmand", { scroll: false })
                    }}
                    className="bg-gradient-to-r from-[#C6B07F] to-[#d4c291] hover:from-[#d4c291] hover:to-[#C6B07F] text-[#0F3059] font-semibold px-4 py-2 rounded-lg text-center transition-all duration-300 hover:scale-105"
                  >
                    Bekijk winkelmand
                  </a>
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Veilig afrekenen met SSL-beveiliging</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Mobile touch optimization */
        .touch-manipulation {
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        /* Input field styling */
        input[type="tel"] {
          -webkit-appearance: none;
          -moz-appearance: textfield;
        }

        input[type="tel"]::-webkit-outer-spin-button,
        input[type="tel"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </div>
  )
}
