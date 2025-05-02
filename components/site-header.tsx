"use client"

import React, {useEffect, useRef, useState} from "react"
import Link from "next/link"
import Image from "next/image"
import {ChevronDown, Heart, Menu, ShoppingCart, User} from "lucide-react"
import {useCart} from "@/lib/cart-context"
import {SideCart} from "./side-cart"
import {menuItemsList} from "@/lib/api";

export function SiteHeader() {
  const { totalItems } = useCart().getCartTotal()

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMenuClosing, setIsMenuClosing] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [expandedMobileMenus, setExpandedMobileMenus] = useState<string[]>([])

  const lastScrollY = useRef(0)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleCloseMenu = () => {
    setIsMenuClosing(true)
    setTimeout(() => {
      setIsMobileMenuOpen(false)
      setIsMenuClosing(false)
      setExpandedMobileMenus([])
    }, 400)
  }

  const toggleMobileSubmenu = (menuName: string, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setExpandedMobileMenus((prev) =>
      prev.includes(menuName) ? prev.filter((item) => item !== menuName) : [...prev, menuName]
    )
  }

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 1024) {
        setIsHeaderVisible(true)
        return
      }

      const currentScrollY = window.scrollY
      setIsHeaderVisible(currentScrollY <= 0 || currentScrollY < lastScrollY.current)
      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleDropdownEnter = (menu: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current)
    setActiveDropdown(menu)
  }

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 200)
  }

  return (
    <>
      <header
        className={`w-full bg-white sticky top-0 z-50 shadow-md transition-transform duration-300 ${
          isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center h-24 justify-between relative">
            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu" className="p-2 hover:text-[#E2B505]">
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2 lg:static lg:transform-none">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logos/logo-xlgroothandelbv.png"
                  alt="XL Groothandel B.V. logo"
                  width={700}
                  height={48}
                  className="object-contain w-[250px]"
                  priority
                />
              </Link>
            </div>

            {/* Desktop menu */}
            <nav className="hidden lg:flex items-center gap-8 font-bold">
              {menuItemsList.map((item) => (
                <div key={item.name} className="relative" onMouseEnter={() => handleDropdownEnter(item.name)} onMouseLeave={handleDropdownLeave}>
                  <Link href={item.href} className="px-2 py-1 hover:bg-[#E2B505] rounded-md hover:text-white transition-colors flex items-center">
                    {item.name}
                    {item.submenu.length > 0 && <ChevronDown className="ml-1 h-4 w-4" />}
                  </Link>
                  {item.submenu.length > 0 && activeDropdown === item.name && (
                    <div className="absolute left-0 mt-1 w-64 bg-white shadow-lg rounded-md overflow-hidden z-50 animate-fadeIn">
                      <div className="py-2">
                        {item.submenu.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className="block px-4 py-2 text-sm hover:bg-[#E2B505] hover:text-white transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center">
              <Link href="/account" className="p-2 hover:text-[#E2B505]">
                <User className="h-6 w-6" />
              </Link>
              <button onClick={() => setIsCartOpen(true)} className="p-2 relative" aria-label="Open winkelmand">
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              </button>
              <Link href="/wishlist" className="hidden lg:block p-2 hover:text-[#E2B505]">
                <Heart className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* SideCart */}
      <SideCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
