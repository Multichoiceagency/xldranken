"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Heart, User } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { SideCart } from "./side-cart"

export function SiteHeader() {
  const { getCartTotal } = useCart()
  const { totalItems } = getCartTotal()
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <>
      {/* Header */}
      <div className="w-full bg-white sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-24 justify-between">
            {/* Logo Links */}
            <div className="flex justify-start">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logos/logo-xlgroothandelbv.jpg"
                  alt="XL Groothandel B.V. logo"
                  width={250}
                  height={40}
                  className="object-contain"
                  priority
                />
              </Link>
            </div>

            {/* Menu-items in het midden */}
            <nav className="hidden lg:flex items-center gap-8 font-bold">
              <NavLink href="/shop">SHOP</NavLink>
              <NavLink href="/alcohol">ALCOHOL</NavLink>
              <NavLink href="/bier">BIER</NavLink>
              <NavLink href="/cocktails">COCKTAILS</NavLink>
              <NavLink href="/frisdranken">FRISDRANKEN</NavLink>
              <NavLink href="/mix-dranken">MIX DRANKEN</NavLink>
              <NavLink href="/assortiment">ASSORTIMENT</NavLink>
              <NavLink href="/acties">Acties</NavLink>
            </nav>

            {/* Icoontjes Rechts */}
            <div className="flex items-center gap-4">
              <Link href="/wishlist" className="p-2 hover:text-[#E2B505] transition-colors">
                <Heart className="h-6 w-6" />
              </Link>
              <Link href="/account" className="p-2 hover:text-[#E2B505] transition-colors">
                <User className="h-6 w-6" />
              </Link>
              <div>
                <button className="p-2 relative" onClick={() => setIsCartOpen(true)} aria-label="Open winkelmand">
                  <ShoppingCart className="h-6 w-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 hover:bg-[#E2B505] text-white text-xs rounded-full px-1">
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SideCart portal */}
      <SideCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-2 py-1 hover:bg-[#E2B505] rounded-md hover:text-white transition-colors text-center"
    >
      {children}
    </Link>
  )
}

