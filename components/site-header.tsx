"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Heart, User } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { CartDropdown } from "./CartDropdown"

export function SiteHeader() {
  const { getCartTotal } = useCart()
  const { totalItems } = getCartTotal() // ✅ HAALT HET CORRECT OP!
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <>
      {/* ✅ Header */}
      <div className="w-full bg-white sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16 justify-between">
            {/* ✅ Logo Links */}
            <div className="flex justify-start">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logos/logo-xlgroothandelbv.jpg"
                  alt="Makro Logo"
                  width={150}
                  height={40}
                  className="object-contain"
                  priority
                />
              </Link>
            </div>

            {/* ✅ Menu-items in het midden */}
            <nav className="hidden lg:flex items-center gap-8">
              <NavLink href="/webshop">Webshop</NavLink>
              <NavLink href="/assortiment">Assortiment & acties</NavLink>
              <NavLink href="/horeca">Horeca Bezorgservice</NavLink>
              <NavLink href="/info">Informatie & services</NavLink>
            </nav>

            {/* ✅ Icoontjes Rechts */}
            <div className="flex items-center gap-4">
              <Link href="/wishlist" className="p-2 hover:text-[#E2B505] transition-colors">
                <Heart className="h-6 w-6" />
              </Link>
              <Link href="/account" className="p-2 hover:text-[#E2B505] transition-colors">
                <User className="h-6 w-6" />
              </Link>
              <div className="relative">
                <button
                  className="p-2 relative"
                  onClick={() => setIsCartOpen((prev) => !prev)}
                  aria-label="Open winkelmand"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                      {totalItems}
                    </span>
                  )}
                </button>

                {/* ✅ Gebruik de nieuwe `CartDropdown` component */}
                <CartDropdown isOpen={isCartOpen} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="px-4 py-3 hover:bg-[#E2B505] hover:text-white transition-colors text-center">
      {children}
    </Link>
  )
}
