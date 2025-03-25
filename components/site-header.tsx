"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Heart, User, Menu, X } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { SideCart } from "./side-cart"

export function SiteHeader() {
  const { getCartTotal } = useCart()
  const { totalItems } = getCartTotal()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMenuClosing, setIsMenuClosing] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const lastScrollY = useRef(0)

  // Handle menu closing animation
  const handleCloseMenu = () => {
    setIsMenuClosing(true)
    // Wait for animation to complete before fully closing
    setTimeout(() => {
      setIsMobileMenuOpen(false)
      setIsMenuClosing(false)
    }, 400) // Match animation duration
  }

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  // Handle header visibility on scroll
  useEffect(() => {
    const controlHeader = () => {
      if (window.innerWidth >= 1024) {
        // Always show header on desktop
        setIsHeaderVisible(true)
        return
      }

      const currentScrollY = window.scrollY

      if (currentScrollY <= 0) {
        // Always show header at the top of the page
        setIsHeaderVisible(true)
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down - hide header
        setIsHeaderVisible(false)
      } else {
        // Scrolling up - show header
        setIsHeaderVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", controlHeader)

    // Cleanup
    return () => {
      window.removeEventListener("scroll", controlHeader)
    }
  }, [])

  return (
    <>
      {/* Header - with transition for hiding/showing */}
      <div
        className={`w-full bg-white sticky top-0 z-50 shadow-md transition-transform duration-300 ${
          isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center h-24 justify-between relative">
            {/* Hamburger menu button on mobile - left side */}
            <div className="lg:hidden">
              <button
                className="p-2 hover:text-[#E2B505] transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Logo Links - centered and larger on mobile */}
            <div className="absolute left-1/2 transform -translate-x-1/2 lg:static lg:left-auto lg:transform-none">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logos/logo-xlgroothandelbv.jpg"
                  alt="XL Groothandel B.V. logo"
                  width={700}
                  height={48}
                  className="object-contain lg:w-[250px] w-[250px]"
                  priority
                />
              </Link>
            </div>

            {/* Menu-items in het midden - desktop only */}
            <nav className="hidden lg:flex items-center gap-8 font-bold">
              <NavLink href="/shop">SHOP</NavLink>
              <NavLink href="/alcohol">ALCOHOL</NavLink>
              <NavLink href="/bier">BIER</NavLink>
              <NavLink href="/cocktails">COCKTAILS</NavLink>
              <NavLink href="/frisdranken">FRISDRANKEN</NavLink>
              <NavLink href="/mix-dranken">MIX DRANKEN</NavLink>
              <NavLink href="/acties">Acties</NavLink>
            </nav>

            {/* Icoontjes Rechts - reordered and wishlist hidden on mobile */}
            <div className="flex items-center">
              {/* Account first */}
              <Link href="/account" className="p-2 hover:text-[#E2B505] transition-colors">
                <User className="h-6 w-6" />
              </Link>

              {/* Cart second */}
              <div>
                <button className="p-2 relative" onClick={() => setIsCartOpen(true)} aria-label="Open winkelmand">
                  <ShoppingCart className="h-6 w-6" />
                  <span className="absolute -top-2 -right-2 bg-red-500 hover:bg-[#E2B505] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                </button>
              </div>

              {/* Wishlist last - hidden on mobile */}
              <Link href="/wishlist" className="hidden lg:block p-2 hover:text-[#E2B505] transition-colors">
                <Heart className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Mobile Menu with animations */}
      {(isMobileMenuOpen || isMenuClosing) && (
        <div
          className={`fixed inset-0 bg-white z-50 flex flex-col overflow-hidden transition-opacity duration-300 ${
            isMenuClosing ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="container mx-auto px-4 py-6 h-full flex flex-col">
            <div
              className={`flex justify-between items-center mb-6 ${isMenuClosing ? "animate-slide-out" : "animate-slide-in"}`}
              style={{
                animationDelay: isMenuClosing ? "0ms" : "0ms",
                animationFillMode: "both",
              }}
            >
              {/* Logo at the top of mobile menu - larger */}
              <Link href="/" className="flex items-center" onClick={handleCloseMenu}>
                <Image
                  src="/logos/logo-xlgroothandelbv.jpg"
                  alt="XL Groothandel B.V. logo"
                  width={250}
                  height={48}
                  className="object-contain"
                  priority
                />
              </Link>

              {/* Close button */}
              <button
                className="p-2 hover:text-[#E2B505] transition-colors"
                onClick={handleCloseMenu}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile menu links with staggered animation */}
            <nav className="flex flex-col space-y-3 text-base font-bold">
              <MobileNavLink
                href="/shop"
                onClick={handleCloseMenu}
                delay={isMenuClosing ? 0 : 100}
                isClosing={isMenuClosing}
              >
                SHOP
              </MobileNavLink>
              <MobileNavLink
                href="/alcohol"
                onClick={handleCloseMenu}
                delay={isMenuClosing ? 50 : 150}
                isClosing={isMenuClosing}
              >
                ALCOHOL
              </MobileNavLink>
              <MobileNavLink
                href="/bier"
                onClick={handleCloseMenu}
                delay={isMenuClosing ? 100 : 200}
                isClosing={isMenuClosing}
              >
                BIER
              </MobileNavLink>
              <MobileNavLink
                href="/cocktails"
                onClick={handleCloseMenu}
                delay={isMenuClosing ? 150 : 250}
                isClosing={isMenuClosing}
              >
                COCKTAILS
              </MobileNavLink>
              <MobileNavLink
                href="/frisdranken"
                onClick={handleCloseMenu}
                delay={isMenuClosing ? 200 : 300}
                isClosing={isMenuClosing}
              >
                FRISDRANKEN
              </MobileNavLink>
              <MobileNavLink
                href="/mix-dranken"
                onClick={handleCloseMenu}
                delay={isMenuClosing ? 250 : 350}
                isClosing={isMenuClosing}
              >
                MIX DRANKEN
              </MobileNavLink>
              <MobileNavLink
                href="/assortiment"
                onClick={handleCloseMenu}
                delay={isMenuClosing ? 300 : 400}
                isClosing={isMenuClosing}
              >
                ASSORTIMENT
              </MobileNavLink>
              <MobileNavLink
                href="/acties"
                onClick={handleCloseMenu}
                delay={isMenuClosing ? 350 : 450}
                isClosing={isMenuClosing}
              >
                Acties
              </MobileNavLink>
            </nav>

            {/* Icons in mobile menu with animation - reordered to match header */}
            <div className="mt-auto pt-4 grid grid-cols-3 gap-2">
              {/* Account first */}
              <Link
                href="/account"
                className={`flex flex-col items-center p-2 hover:text-[#E2B505] transition-colors ${
                  isMenuClosing ? "animate-slide-out" : "animate-slide-in"
                }`}
                onClick={handleCloseMenu}
                style={{
                  animationDelay: isMenuClosing ? "400ms" : "500ms",
                  animationFillMode: "both",
                }}
              >
                <User className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">Account</span>
              </Link>

              {/* Cart second */}
              <button
                className={`flex flex-col items-center p-2 hover:text-[#E2B505] transition-colors ${
                  isMenuClosing ? "animate-slide-out" : "animate-slide-in"
                }`}
                onClick={() => {
                  handleCloseMenu()
                  setTimeout(() => setIsCartOpen(true), 400)
                }}
                style={{
                  animationDelay: isMenuClosing ? "450ms" : "550ms",
                  animationFillMode: "both",
                }}
              >
                <div className="relative mb-1">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                </div>
                <span className="text-xs font-medium">Winkelwagen</span>
              </button>

              {/* Wishlist last */}
              <Link
                href="/wishlist"
                className={`flex flex-col items-center p-2 hover:text-[#E2B505] transition-colors ${
                  isMenuClosing ? "animate-slide-out" : "animate-slide-in"
                }`}
                onClick={handleCloseMenu}
                style={{
                  animationDelay: isMenuClosing ? "500ms" : "600ms",
                  animationFillMode: "both",
                }}
              >
                <Heart className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium">Wishlist</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* SideCart portal */}
      <SideCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Add animation keyframes */}
      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-30px) perspective(100px) rotateX(10deg);
          }
          to {
            opacity: 1;
            transform: translateY(0) perspective(100px) rotateX(0);
          }
        }
        
        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateY(0) perspective(100px) rotateX(0);
          }
          to {
            opacity: 0;
            transform: translateY(-30px) perspective(100px) rotateX(10deg);
          }
        }
        
        .animate-slide-in {
          animation: slideIn 0.4s ease-out forwards;
        }
        
        .animate-slide-out {
          animation: slideOut 0.4s ease-in forwards;
        }
      `}</style>
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

function MobileNavLink({
  href,
  children,
  onClick,
  delay = 0,
  isClosing = false,
}: {
  href: string
  children: React.ReactNode
  onClick?: () => void
  delay?: number
  isClosing?: boolean
}) {
  return (
    <Link
      href={href}
      className={`px-2 py-2 hover:bg-[#E2B505] rounded-md hover:text-white transition-colors w-full block text-sm ${
        isClosing ? "animate-slide-out" : "animate-slide-in"
      }`}
      onClick={onClick}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: "both",
      }}
    >
      {children}
    </Link>
  )
}