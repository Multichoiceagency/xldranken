'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faHeart, faClock, faTruck, faStore, faUser } from '@fortawesome/free-solid-svg-icons'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchOverlay } from "./search-overlay"
import { useAuth } from "@/lib/auth"
import { useCart } from "@/lib/cart-context"
import { SideCartDrawer } from "./side-cart-drawer"
import { Menu } from 'lucide-react'
import { MobileMenu } from "./mobile-menu"

export function SiteHeader() {
  const { isLoggedIn, username } = useAuth()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { getCartTotal } = useCart()
  const { totalPrice } = getCartTotal()

  return (
    <header className="w-full sticky top-0 z-50 bg-background">
      {/* Top Banner - Always visible on desktop, hidden on mobile */}
      <div className="w-full bg-primary/10 py-2 hidden md:block">
        <div className="container mx-auto flex items-center justify-between text-sm px-4">
          <div className="flex items-center gap-1">
            <FontAwesomeIcon icon={faClock} className="h-4 w-4 text-primary" />
            <span>Bestel voor 22:00 vandaag, morgen in huis</span>
          </div>
          <div className="flex items-center gap-1">
            <FontAwesomeIcon icon={faTruck} className="h-4 w-4 text-primary" />
            <span>Gratis bezorging vanaf € 55,-</span>
          </div>
          <div className="flex items-center gap-1">
            <FontAwesomeIcon icon={faStore} className="h-4 w-4 text-primary" />
            <span>Gratis ophalen in een XL Dranken winkel</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b">
        <div className="container mx-auto flex h-16 items-center gap-4 px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-bold text-primary">XL Dranken</span>
            <span className="text-xs text-muted-foreground hidden md:inline">SINDS 1884</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/assortiment" className="font-medium">
              ASSORTIMENT
            </Link>
            <Link href="/acties" className="font-medium">
              <span className="text-primary">ACTIES</span>
            </Link>
          </nav>

          <div className="flex-1 flex items-center gap-4">
            <Button
              variant="ghost"
              className="flex-1 justify-start text-muted-foreground hidden md:flex"
              onClick={() => setIsSearchOpen(true)}
            >
              <FontAwesomeIcon icon={faSearch} className="h-4 w-4 mr-2" />
              Waar ben je naar op zoek?
            </Button>

            <div className="flex items-center gap-4 ml-auto">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              {isLoggedIn ? (
                <div className="hidden md:flex items-center gap-1">
                  <span className="text-sm">Welkom</span>
                  <Link href="/account" className="text-sm font-medium">
                    {username}
                  </Link>
                </div>
              ) : (
                <Link href="/login" className="hidden md:block text-sm">
                  Inloggen
                </Link>
              )}
              <Button variant="ghost" size="icon" asChild className="hidden md:inline-flex">
                <Link href="/wishlist">
                  <FontAwesomeIcon icon={faHeart} className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild className="hidden md:inline-flex">
                <Link href="/account">
                  <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
                </Link>
              </Button>
              <SideCartDrawer />
              <div className="hidden md:flex items-center">
                <span className="text-sm font-medium">€ {totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <SearchOverlay 
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      )}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  )
}

