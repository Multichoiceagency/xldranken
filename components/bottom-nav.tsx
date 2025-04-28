"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Grid, Heart, BeerIcon } from "lucide-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons"

export function BottomNav() {
  const pathname = usePathname()
  const [isNavVisible, setIsNavVisible] = useState(true)
  const lastScrollY = useRef(0)

  // Handle bottom nav visibility on scroll
  useEffect(() => {
    const controlNav = () => {
      if (window.innerWidth >= 768) {
        // Always hide bottom nav on desktop/tablet
        setIsNavVisible(false)
        return
      }

      const currentScrollY = window.scrollY
      const documentHeight = document.body.scrollHeight
      const windowHeight = window.innerHeight
      const scrolledToBottom = currentScrollY + windowHeight >= documentHeight - 50

      if (currentScrollY <= 0 || scrolledToBottom) {
        // Always show nav at the top of the page or near the bottom
        setIsNavVisible(true)
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down - hide nav
        setIsNavVisible(false)
      } else {
        // Scrolling up - show nav
        setIsNavVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", controlNav)

    // Initial check
    controlNav()

    // Cleanup
    return () => {
      window.removeEventListener("scroll", controlNav)
    }
  }, [])

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40 transition-transform duration-300 ${
        isNavVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex justify-around items-center h-16">
        <Link
          href="/"
          className={`flex flex-col items-center ${pathname === "/" ? "text-[#E2B505]" : "text-[#0F3059]"}`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs font-medium mt-1">Home</span>
        </Link>
        <Link
          href="/shop"
          className={`flex flex-col items-center ${pathname === "/shop" ? "text-[#E2B505]" : "text-[#0F3059]"}`}
        >
          <BeerIcon className="h-5 w-5" />
          <span className="text-xs font-medium mt-1">Shop</span>
        </Link>
        <a
          href="https://wa.me/31618495949"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center text-green-600"
        >
          <FontAwesomeIcon icon={faWhatsapp} className="h-6 w-6" />
          <span className="text-xs font-bold mt-1">WhatsApp</span>
        </a>
        <Link
          href="/wishlist"
          className={`flex flex-col items-center ${pathname === "/wishlist" ? "text-[#E2B505]" : "text-[#0F3059]"}`}
        >
          <Heart className="h-5 w-5" />
          <span className="text-xs font-medium mt-1">Wenslijst</span>
        </Link>
      </div>
    </nav>
  )
}

