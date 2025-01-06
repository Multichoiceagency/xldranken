'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faShoppingCart, faHeart, faClock, faTruck, faStore } from '@fortawesome/free-solid-svg-icons'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY) {
          setIsVisible(false)
        } else {
          setIsVisible(true)
        }
        setLastScrollY(window.scrollY)
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar)
      return () => {
        window.removeEventListener('scroll', controlNavbar)
      }
    }
  }, [lastScrollY])

  return (
    <header className="w-full">
      {/* Top Banner - Always visible */}
      <div className="w-full bg-gray-100 py-2">
        <div className="container flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <FontAwesomeIcon icon={faClock} className="h-4 w-4" />
            <span>Bestel voor 22:00 vandaag, morgen in huis</span>
          </div>
          <div className="flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            <FontAwesomeIcon icon={faTruck} className="h-4 w-4" />
            <span>Gratis bezorging vanaf € 55,-</span>
          </div>
          <div className="flex items-center gap-1">
            <FontAwesomeIcon icon={faStore} className="h-4 w-4" />
            <span>Gratis ophalen in een XL Dranken winkel</span>
          </div>
        </div>
      </div>

      {/* Main Header - Sticky and hideable */}
      <div 
        className={`sticky top-0 z-50 w-full bg-background border-b transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="container flex h-16 items-center gap-6 px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#FF6B35]">XL Dranken</span>
            <span className="text-xs text-muted-foreground">SINDS 1884</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/assortiment" className="font-medium">
              ASSORTIMENT
            </Link>
            <Link href="/wijn" className="font-medium">
              WIJN
            </Link>
            <Link href="/cadeau" className="font-medium">
              CADEAU
            </Link>
            <Link href="/acties" className="font-medium">
              <span className="text-[#FF6B35]">ACTIES</span>
            </Link>
          </nav>

          <div className="flex-1 flex items-center gap-4">
            <form className="hidden md:flex-1 md:flex max-w-xl">
              <div className="relative w-full">
                <FontAwesomeIcon icon={faSearch} className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Waar ben je naar op zoek?"
                  className="pl-8 w-full"
                />
              </div>
            </form>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-sm">Welkom</span>
                <Link href="/account" className="text-sm font-medium">
                  Enes
                </Link>
              </div>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/wishlist">
                  <FontAwesomeIcon icon={faHeart} className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link href="/cart">
                  <FontAwesomeIcon icon={faShoppingCart} className="h-5 w-5" />
                  <span className="absolute -top-2 -right-2 bg-[#FF6B35] text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    0
                  </span>
                </Link>
              </Button>
              <div className="flex items-center">
                <span className="text-sm font-medium">€ 0.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

