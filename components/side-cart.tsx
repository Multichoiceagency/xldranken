"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { X, ShoppingBag, Trash2, Plus, Minus } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"

interface SideCartProps {
  isOpen: boolean
  onClose: (e?: React.MouseEvent) => void
}

export function SideCart({ isOpen, onClose }: SideCartProps) {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart()
  const { totalItems, totalPrice } = getCartTotal()
  const cartRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

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
    updateQuantity(id, newQuantity)
  }

  // Handle remove item
  const handleRemoveItem = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    removeFromCart(id)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] overflow-hidden">
      <div
        ref={cartRef}
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col transform transition-transform duration-300"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Winkelwagen ({totalItems})
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="h-6 w-6" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">Uw winkelwagen is leeg</h3>
            <p className="text-gray-500 mb-6">Voeg producten toe om te bestellen</p>
            <a href="/winkelmand" className="bg-[#BEA46A] hover:bg-[#a89055] px-4 py-2 rounded text-white text-center">
              Bekijk winkelmand
            </a>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              {cart.map((item) => (
                <div key={item.id} className="flex border-b border-gray-100 py-4 last:border-0">
                  <a
                    href={`/product/${item.id}`}
                    onClick={(e) => handleProductClick(e, item.id)}
                    className="w-20 h-20 bg-gray-50 rounded flex-shrink-0 relative"
                  >
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                      unoptimized
                    />
                  </a>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <a
                        href={`/product/${item.id}`}
                        onClick={(e) => handleProductClick(e, item.id)}
                        className="font-medium hover:text-[#BEA46A]"
                      >
                        {item.name}
                      </a>
                      <button
                        onClick={(e) => handleRemoveItem(e, item.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-500 mb-2">{item.volume}</div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center border rounded">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleQuantityChange(item.id, item.quantity - 1)
                          }}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 py-1 text-sm">{item.quantity}</span>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleQuantityChange(item.id, item.quantity + 1)
                          }}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="font-medium">€{(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 p-4 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotaal</span>
                <span className="font-medium">€{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Verzendkosten</span>
                <span className="font-medium">Berekend bij checkout</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Totaal</span>
                <span>€{totalPrice.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="/winkelmand"
                  className="border border-[#BEA46A] text-[#BEA46A] hover:bg-[#BEA46A]/10 px-4 py-2 rounded text-center"
                >
                  Bekijk winkelmand
                </a>
                <Button onClick={handleCheckout} className="bg-[#BEA46A] hover:bg-[#a89055]">
                  Afrekenen
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
