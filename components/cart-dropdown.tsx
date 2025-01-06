'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useCart } from '@/contexts/cart-context'

export function CartDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const total = getCartTotal()

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        className="relative bg-gray-200 rounded-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ShoppingCart className="h-5 w-5" />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#FF6B35] text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
            {cart.reduce((total, item) => total + item.quantity, 0)}
          </span>
        )}
      </Button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50">
          <div className="p-4">
            <h3 className="font-bold mb-2">Winkelwagen</h3>
            {cart.length === 0 ? (
              <p>Je winkelwagen is leeg</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        €{item.price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="mt-4 pt-2 border-t">
                  <p className="font-bold">Totaal: €{total.toFixed(2)}</p>
                </div>
                <Button className="w-full mt-4 bg-[#FF6B35] hover:bg-[#E85A24] text-white" asChild>
                  <Link href="/cart-page">Naar winkelwagen</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

