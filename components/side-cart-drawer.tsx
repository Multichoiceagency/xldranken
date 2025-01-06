'use client'

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useCart } from "@/lib/cart-context"
import { ScrollArea } from "@/components/ui/scroll-area"

export function SideCartDrawer() {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart()
  const { totalItems, totalPrice } = getCartTotal()

  const VAT_RATE = 0.21; // 21% VAT rate for the Netherlands
  const subtotalWithoutVAT = useMemo(() => totalPrice / (1 + VAT_RATE), [totalPrice]);
  const vatAmount = useMemo(() => totalPrice - subtotalWithoutVAT, [totalPrice, subtotalWithoutVAT]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingBag className="h-6 w-6" />
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
            {totalItems}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>Uw Winkelwagen ({totalItems})</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-grow">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Uw winkelwagen is leeg</p>
              <p className="text-sm text-muted-foreground mb-4">Voeg enkele items toe om te beginnen!</p>
              <Button asChild>
                <Link href="/shop">Begin met Winkelen</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 rounded overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.volume}</p>
                    <div className="flex items-center mt-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="mx-2 text-sm">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">€{(item.price * item.quantity).toFixed(2)}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="border-t pt-4 mt-4">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>Subtotaal (excl. BTW)</span>
              <span>€{subtotalWithoutVAT.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>BTW (21%)</span>
              <span>€{vatAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Subtotaal (incl. BTW)</span>
              <span>€{totalPrice.toFixed(2)}</span>
            </div>
          </div>
          <Button className="w-full" asChild>
            <Link href="/cart">Bekijk Winkelwagen</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

