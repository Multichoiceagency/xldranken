"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Menu, X, Heart, User, Trash2, Minus, Plus } from "lucide-react"
import { useCart } from "@/lib/cart-context"

export function SiteHeader() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart()
  const { totalItems, totalPrice } = getCartTotal()
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <>
      {/* ✅ Header */}
      <div className="w-full bg-white sticky top-0 py-8 z-50 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16 gap-4">
            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2" onClick={() => setIsCartOpen(true)} aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image src="/logos/logo-xlgroothandelbv.jpg" alt="Makro Logo" width={250} height={40} className="object-contain" priority />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 ml-8">
              <NavLink href="/webshop">Webshop</NavLink>
              <NavLink href="/assortiment">Assortiment & acties</NavLink>
              <NavLink href="/horeca">Horeca Bezorgservice</NavLink>
              <NavLink href="/info">Informatie & services</NavLink>
            </nav>

            {/* ✅ User, Wishlist & Shopping Cart Icons */}
            <div className="ml-auto flex items-center gap-4">
              <Link href="/wishlist" className="p-2 hover:text-[#E2B505] transition-colors">
                <Heart className="h-6 w-6" />
              </Link>
              <Link href="/account" className="p-2 hover:text-[#E2B505] transition-colors">
                <User className="h-6 w-6" />
              </Link>

              {/* ✅ Desktop Winkelmand Hover */}
              <div className="relative hidden lg:block">
                <Link href="#" className="p-2 hover:text-[#E2B505] transition-colors group">
                  <ShoppingCart className="h-6 w-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                      {totalItems}
                    </span>
                  )}
                </Link>

                {/* Hover Box */}
                {cart.length > 0 && (
                  <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg border rounded-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between border-b py-2">
                        <Image src={item.image} alt={item.name} width={40} height={40} className="rounded" />
                        <div className="flex-1 ml-2">
                          <p className="text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.volume}</p>
                          <p className="text-sm font-bold">€{item.price.toFixed(2)}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <p className="text-sm font-semibold mt-2">Totaal: €{totalPrice.toFixed(2)}</p>
                  </div>
                )}
              </div>

              {/* ✅ Mobiele Winkelmand Drawer */}
              <button className="p-2 lg:hidden" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Mobiele Sidecart Drawer */}
      <div className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isCartOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={() => setIsCartOpen(false)} />
      <aside className={`fixed right-0 top-0 w-72 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Winkelmand</h2>
          <button className="p-2" onClick={() => setIsCartOpen(false)} aria-label="Close cart">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Winkelmand Items */}
        <div className="p-4 flex flex-col gap-4">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center">Je winkelmand is leeg.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-2">
                <Image src={item.image} alt={item.name} width={40} height={40} className="rounded" />
                <div className="flex-1 ml-2">
                  <p className="text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.volume}</p>
                  <p className="text-sm font-bold">€{item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1">
                    <Plus className="h-4 w-4" />
                  </button>
                  <button onClick={() => removeFromCart(item.id)} className="ml-2 text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="px-4 py-3 hover:bg-[#E2B505] hover:text-white transition-colors">
      {children}
    </Link>
  )
}
