"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { X, Plus, Minus } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import Link from "next/link";

interface SideCartProps {
  isOpen: boolean
  onClose: () => void
}

export function SideCart({ isOpen, onClose }: SideCartProps) {
  const { cart, getCartTotal, removeFromCart, updateQuantity } = useCart()
  const { totalItems, totalPrice } = getCartTotal()
  const overlayRef = useRef<HTMLDivElement>(null)
  const cartRef = useRef<HTMLDivElement>(null)

  // Close cart when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (overlayRef.current && event.target === overlayRef.current) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick)
      // Prevent scrolling when cart is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
      // Restore scrolling when cart is closed
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  // Handle escape key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen, onClose])

  const handleIncreaseQuantity = (id: string, currentQuantity: number) => {
    updateQuantity(id, currentQuantity + 1)
  }

  const handleDecreaseQuantity = (id: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(id, currentQuantity - 1)
    }
  }

  if (!isOpen && !cartRef.current) return null

  return (
    <div className="side-cart-wrapper">
      <div
        ref={overlayRef}
        className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      >
        <div
          ref={cartRef}
          className={`fixed top-0 right-0 h-[100svh] w-full sm:w-[400px] max-w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          aria-modal="true"
          role="dialog"
          aria-label="Winkelwagen"
        >
          {/* Header - fixed height */}
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <h2 className="text-base font-bold">Winkelwagen ({totalItems})</h2>
            <button
              onClick={onClose}
              className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Sluiten</span>
            </button>
          </div>

          {/* Cart content - flexible height with overflow */}
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-grow p-4 text-center">
              <p className="text-sm font-medium text-gray-900 mb-3">Je winkelwagen is leeg</p>
              <button
                className="bg-[#E2B505] hover:bg-[#E2B505]/90 text-white text-xs py-1.5 px-3 rounded"
                onClick={onClose}
              >
                Verder winkelen
              </button>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center py-3 px-3 border-b">
                  {/* Product image */}
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden border border-gray-200">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-contain object-center"
                      unoptimized
                    />
                  </div>

                  {/* Product details */}
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex flex-col">
                      <h3 className="text-sm font-bold text-[#0F3059] uppercase break-words">{item.name}</h3>
                      <p className="text-[10px] text-gray-500">Artikelnummer: {item.volume}</p>
                    </div>

                    {/* Quantity controls - matching the image */}
                    <div className="flex items-center mt-2">
                      <button
                        className="h-8 w-8 flex items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-50 border border-gray-300"
                        onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </button>

                      <div className="h-8 w-10 flex justify-center items-center text-center text-sm font-medium border-t border-b border-gray-300">
                        {item.quantity}
                      </div>

                      <button
                        className="h-8 w-8 flex items-center justify-center text-gray-600 hover:text-gray-900 border border-gray-300"
                        onClick={() => handleIncreaseQuantity(item.id, item.quantity)}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Price information */}
                  <div className="ml-2 text-right">
                    <p className="text-sm font-bold text-red-600">
                      €{(item.price * item.quantity).toFixed(2).replace(".", ",")}
                    </p>
                    <p className="text-[10px] text-gray-500">€{item.price.toFixed(2).replace(".", ",")} Per Tree</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer - fixed height */}
          {cart.length > 0 && (
            <div className="border-t p-3 bg-gray-50 mt-auto">
              <div className="flex justify-between text-sm font-bold mb-1">
                <p>Subtotaal</p>
                <p>€{totalPrice.toFixed(2).replace(".", ",")}</p>
              </div>
              <p className="text-[10px] text-gray-500 mb-3">Verzendkosten worden berekend bij het afrekenen.</p>
              <div>
                <Link href="/checkout">
                <button
                  className="flex items-center justify-center w-full bg-[#0F3059] text-white py-2 px-3 rounded font-bold text-sm"
                  onClick={onClose}
                >
                  Afrekenen
                </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

