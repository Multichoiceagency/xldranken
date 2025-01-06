'use client'

import { useCart } from '@/contexts/cart-context'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Plus, Minus } from 'lucide-react'
import { useState } from "react"
import { AddToCartAnimation } from "./add-to-cart-animation"

const SHIPPING_COST = 5.00;

export function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart()
  const [showAnimation, setShowAnimation] = useState<string | null>(null)

  const subtotal = getCartTotal();
  const total = subtotal + SHIPPING_COST;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center border-b pb-4">
                <div className="relative w-24 h-24 mr-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-xl font-bold">€{item.price.toFixed(2).replace('.', ',')}</p>
                  <div className="flex items-center mt-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        updateQuantity(item.id, item.quantity - 1)
                        if (item.quantity > 1) {
                          setShowAnimation(item.id)
                        }
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value)
                        updateQuantity(item.id, newQuantity)
                        if (newQuantity > item.quantity) {
                          setShowAnimation(item.id)
                        }
                      }}
                      className="w-16 mx-2 text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        updateQuantity(item.id, item.quantity + 1)
                        setShowAnimation(item.id)
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => removeFromCart(item.id)}>
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
          <div>
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>€{subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>€{SHIPPING_COST.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>€{total.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
              <Button className="w-full mt-6">Proceed to Checkout</Button>
            </div>
          </div>
        </div>
      )}
      {cart.map((item) => (
        <AddToCartAnimation
          key={item.id}
          isVisible={showAnimation === item.id}
          onAnimationComplete={() => setShowAnimation(null)}
          productName={item.name}
          productPrice={item.price}
          productImage={item.image}
        />
      ))}
    </div>
  )
}

