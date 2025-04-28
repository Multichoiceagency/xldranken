"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Heart, User, Menu, X, ChevronDown, ChevronRight } from 'lucide-react'
import { useCart } from "@/lib/cart-context"
import { SideCart } from "./side-cart"

export function SiteHeader() {
  const { getCartTotal } = useCart()
  const { totalItems } = getCartTotal()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMenuClosing, setIsMenuClosing] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [expandedMobileMenus, setExpandedMobileMenus] = useState<string[]>([])
  const lastScrollY = useRef(0)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Handle menu closing animation
  const handleCloseMenu = () => {
    setIsMenuClosing(true)
    // Wait for animation to complete before fully closing
    setTimeout(() => {
      setIsMobileMenuOpen(false)
      setIsMenuClosing(false)
      setExpandedMobileMenus([]) // Reset expanded menus when closing
    }, 400) // Match animation duration
  }

  // Toggle mobile submenu
  const toggleMobileSubmenu = (menuName: string, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    setExpandedMobileMenus(prev => {
      if (prev.includes(menuName)) {
        return prev.filter(item => item !== menuName)
      } else {
        return [...prev, menuName]
      }
    })
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

  // Handle dropdown menu
  const handleDropdownEnter = (menu: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
    }
    setActiveDropdown(menu)
  }

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 200)
  }

  // Menu structure with submenus
  const menuItems = [
    {
      name: "ALCOHOL",
      href: "/alcohol",
      submenu: [
        { name: "STERKE DRANK", href: "/sterke-drank", id: "16" },
        { name: "MIX DRANK", href: "/mix-drank", id: "5" },
        { name: "COCKTAILS", href: "/cocktails", id: "10" },
      ],
    },
    {
      name: "WIJN",
      href: "/wijn",
      submenu: [
      ],
    },
    {
      name: "BIER",
      href: "/bier",
      submenu: [
        { name: "POOLSE BIER BLIK", href: "/poolse-bier-blik", id: "4" },
        { name: "POOLSE BIER FLES", href: "/poolse-bier-fles", id: "3" },
        { name: "NL BIER", href: "/nl-bier", id: "5" },
      ],
    },
    {
      name: "FRISDRANKEN",
      href: "/frisdranken",
      submenu: [
        { name: "FRISDRANKEN", href: "/frisdranken", id: "6" },
        { name: "LIMONADEN", href: "/limonaden", id: "1" },
        { name: "WATER NL", href: "/water-nl", id: "7" },
        { name: "WATER PL", href: "/water-pl", id: "12" },
        { name: "KOFFIE THEE", href: "/koffie-thee", id: "18" },
      ],
    },
    {
      name: "FOOD",
      href: "/food",
      submenu: [
      ],
    },
    {
      name: "NON-FOOD",
      href: "/non-food",
      submenu: [
        { name: "SCHOONMAAK", href: "/schoonmaak", id: "6" },
        { name: "HOUTSKOOL", href: "/houtskool", id: "6" },

      ],
    },
    {
      name: "ACTIES",
      href: "/acties",
      submenu: [],
    },
  ]

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
                  src="/logos/logo-xlgroothandelbv.png"
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
              {menuItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter(item.name)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    href={item.href}
                    className="px-2 py-1 hover:bg-[#E2B505] rounded-md hover:text-white transition-colors text-center flex items-center"
                  >
                    {item.name}
                    {item.submenu.length > 0 && (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </Link>
                  
                  {/* Dropdown menu */}
                  {item.submenu.length > 0 && activeDropdown === item.name && (
                    <div className="absolute left-0 mt-1 w-64 bg-white shadow-lg rounded-md overflow-hidden z-50 animate-fadeIn">
                      <div className="py-2">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="block px-4 py-2 text-sm hover:bg-[#E2B505] hover:text-white transition-colors"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
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
          className={`fixed inset-0 bg-white z-50 flex flex-col overflow-auto transition-opacity duration-300 ${
            isMenuClosing ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="container mx-auto px-4 py-6 min-h-full flex flex-col">
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
                  src="/logos/logo-xlgroothandelbv.png"
                  alt="XL Groothandel B.V. logo"
                  width={300}
                  height={65}
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

            {/* Mobile menu links with accordion-style submenus */}
            <nav className="flex flex-col space-y-1 text-base font-bold">
              {menuItems.map((item, index) => (
                <div key={item.name} className="border-b border-gray-100 last:border-b-0">
                  {item.submenu.length > 0 ? (
                    <div
                      className={`${isMenuClosing ? "animate-slide-out" : "animate-slide-in"}`}
                      style={{
                        animationDelay: isMenuClosing ? index * 50 + "ms" : 100 + index * 50 + "ms",
                        animationFillMode: "both",
                      }}
                    >
                      {/* Parent menu item with toggle button */}
                      <div className="flex items-center justify-between">
                        <Link
                          href={item.href}
                          className="px-2 py-3 hover:text-[#E2B505] transition-colors w-full block text-sm"
                          onClick={(e) => {
                            if (item.submenu.length > 0) {
                              e.preventDefault()
                            } else {
                              handleCloseMenu()
                            }
                          }}
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={(e) => toggleMobileSubmenu(item.name, e)}
                          className="p-2 hover:text-[#E2B505] transition-colors"
                          aria-label={expandedMobileMenus.includes(item.name) ? "Collapse menu" : "Expand menu"}
                        >
                          {expandedMobileMenus.includes(item.name) ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronRight className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      
                      {/* Submenu with slide animation */}
                      {expandedMobileMenus.includes(item.name) && (
                        <div className="pl-4 overflow-hidden animate-slideDown">
                          {item.submenu.map((subItem, subIndex) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="px-2 py-2 hover:text-[#E2B505] transition-colors w-full block text-sm border-l-2 border-gray-200 mb-1"
                              onClick={handleCloseMenu}
                              style={{
                                animationDelay: `${subIndex * 50}ms`,
                              }}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`px-2 py-3 hover:text-[#E2B505] transition-colors w-full block text-sm ${
                        isMenuClosing ? "animate-slide-out" : "animate-slide-in"
                      }`}
                      onClick={handleCloseMenu}
                      style={{
                        animationDelay: isMenuClosing ? index * 50 + "ms" : 100 + index * 50 + "ms",
                        animationFillMode: "both",
                      }}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
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
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideDown {
          from { max-height: 0; opacity: 0; }
          to { max-height: 500px; opacity: 1; }
        }
        
        .animate-slide-in {
          animation: slideIn 0.4s ease-out forwards;
        }
        
        .animate-slide-out {
          animation: slideOut 0.4s ease-in forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>
    </>
  )
}