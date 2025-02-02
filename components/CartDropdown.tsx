"use client"

import Link from "next/link"
import Image from "next/image"
import { Trash2 } from "lucide-react"
import { useCart } from "@/lib/cart-context"

export function CartDropdown({ isOpen }: { isOpen: boolean }) {
  const { cart, getCartTotal, removeFromCart } = useCart() // ✅ Haal data op uit de context
  const { totalItems, totalPrice } = getCartTotal() // ✅ Haal totale prijs en items op

  if (!isOpen) return null // Verberg de dropdown als deze niet open is

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50">
      <div className="p-4">
        {cart.length === 0 ? (
          <p className="text-gray-500 text-center">Je winkelmand is leeg.</p>
        ) : (
          <>
            {/* ✅ Toon alle producten in de winkelmand */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-2">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="rounded"
                  />
                  <div className="flex-1 ml-2">
                    {/* ✅ Naam en prijs per stuk */}
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">€{item.price.toFixed(2)} per stuk</p>

                    {/* ✅ Totaalprijs per item */}
                    <p className="text-sm font-bold">€{(item.price * item.quantity).toFixed(2)}</p>

                    {/* ✅ Aantal */}
                    <span className="text-xs text-gray-500">Aantal: {item.quantity}</span>
                  </div>

                  {/* ✅ Verwijderknop */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Verwijder product"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* ✅ Totale winkelmandprijs */}
            <div className="flex justify-between mt-4 text-lg font-bold">
              <span>Totaal:</span>
              <span>€{totalPrice.toFixed(2)}</span>
            </div>

            {/* ✅ Actieknoppen */}
            <div className="mt-4 space-y-2">
              <Link href="/winkelmand">
                <button className="w-full bg-[#E2B505] text-white py-2 rounded hover:bg-[#E2B505]/90">
                  Winkelmand bekijken
                </button>
              </Link>
              <Link href="/afrekenen">
                <button className="w-full bg-[#002B7F] text-white py-2 rounded hover:bg-[#002B7F]/90">
                  Afrekenen
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
