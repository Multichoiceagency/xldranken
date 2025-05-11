"use client"

import type React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Menu, Search, ShoppingCart, User, X, LogOut } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { SideCart } from "./side-cart"
import { menuItemsList } from "@/lib/api"
import { useRouter, usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"

export function SiteHeader() {
  const { totalItems } = useCart().getCartTotal()
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMenuClosing, setIsMenuClosing] = useState(false)
  const [expandedMobileMenus, setExpandedMobileMenus] = useState<string[]>([])
  const [isScrollingDown, setIsScrollingDown] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileSearchQuery, setMobileSearchQuery] = useState("")
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const lastScrollY = useRef(0)
  const ticking = useRef(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const mobileSearchInputRef = useRef<HTMLInputElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Handle logout
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      await signOut({ redirect: false })
      // Force a hard refresh to clear any cached state
      window.location.href = "/"
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Prevent body scroll when mobile menu is open
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

  // Show/hide header on scroll (mobile only)
  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          if (window.innerWidth < 1024) {
            const currentScrollY = window.scrollY
            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
              setIsScrollingDown(true)
            } else {
              setIsScrollingDown(false)
            }
            lastScrollY.current = currentScrollY > 0 ? currentScrollY : 0
          } else {
            setIsScrollingDown(false)
          }
          ticking.current = false
        })
        ticking.current = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Focus search input when mobile menu opens
  useEffect(() => {
    if (isMobileMenuOpen && mobileSearchInputRef.current) {
      // Short delay to ensure the animation completes first
      setTimeout(() => {
        mobileSearchInputRef.current?.focus()
      }, 300)
    }
  }, [isMobileMenuOpen])

  // Clear search input when navigating away from search page
  useEffect(() => {
    if (!pathname?.includes("/search")) {
      setSearchQuery("")
      setMobileSearchQuery("")
    }
  }, [pathname])

  const handleCloseMenu = useCallback(() => {
    setIsMenuClosing(true)
    setTimeout(() => {
      setIsMobileMenuOpen(false)
      setIsMenuClosing(false)
      setExpandedMobileMenus([])
    }, 300)
  }, [])

  const toggleMobileSubmenu = useCallback((menuName: string, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setExpandedMobileMenus((prev) =>
      prev.includes(menuName) ? prev.filter((item) => item !== menuName) : [...prev, menuName],
    )
  }, [])

  const openMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(true)
  }, [])

  const handleSearch = useCallback(
    (e: React.FormEvent, query: string) => {
      e.preventDefault()
      if (query.trim()) {
        // If already on search page, use history.replaceState to avoid scroll reset
        if (pathname?.includes("/search")) {
          const newUrl = `/search?q=${encodeURIComponent(query.trim())}`
          window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, "", newUrl)
          // Dispatch a custom event that the search page can listen for
          window.dispatchEvent(
            new CustomEvent("urlQueryUpdated", {
              detail: { query: query.trim() },
            }),
          )
        } else {
          // Navigate to search page if not already there
          router.push(`/search?q=${encodeURIComponent(query.trim())}`)
        }

        if (isMobileMenuOpen) {
          handleCloseMenu()
        }
      }
    },
    [router, isMobileMenuOpen, handleCloseMenu, pathname],
  )

  const toggleUserMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsUserMenuOpen((prev) => !prev)
  }

  return (
    <>
      {/* Top bar - NOT sticky */}
      <div className="bg-[#BEA46A] text-white py-2 px-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <span>✓ Meer dan 4.000 verschillende dranken</span>
            <span>✓ Dé drankengroothandel van Nederland</span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/zakelijk" className="hover:underline">
              Registreren
            </Link>
            <Link href="/klantenservice" className="hover:underline">
              Klantenservice
            </Link>
            <Link href="/over-ons" className="hover:underline">
              Over ons
            </Link>
            <Link href="/werken-bij" className="hover:underline">
              Werken bij
            </Link>
          </div>
        </div>
      </div>

      {/* Main header - sticky */}
      <header
        className={`sticky top-0 bg-white z-50 shadow-md transition-transform duration-300 will-change-transform ${
          isScrollingDown ? "lg:translate-y-0 -translate-y-full" : ""
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center h-24 justify-between relative">
            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={openMobileMenu}
                aria-label="Open mobiel menu"
                className="p-2 hover:text-[#BEA46A]"
                type="button"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Logo */}
            <div className="lg:mr-8">
              <Link href="/" className="flex items-center" aria-label="Ga naar de homepage">
                <Image
                  src="/logos/logo-xlgroothandelbv.png"
                  alt="XL Groothandel B.V. logo"
                  width={700}
                  height={48}
                  className="object-contain w-[200px]"
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 font-bold">
              {menuItemsList.map((item) => (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className="px-2 py-1 hover:bg-[#BEA46A] rounded-md hover:text-white transition-colors flex items-center"
                  >
                    {item.name}
                    {item.submenu?.length > 0 && <ChevronDown className="ml-1 h-4 w-4" />}
                  </Link>

                  {/* CSS-only dropdown */}
                  {item.submenu?.length > 0 && (
                    <div className="absolute left-0 top-full w-64 bg-white shadow-lg rounded-md overflow-hidden z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
                      <div className="py-2">
                        {item.submenu.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className="block px-4 py-2 text-sm hover:bg-[#BEA46A] hover:text-white transition-colors"
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

            {/* Desktop Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-md mx-4 rounded-md">
              <form onSubmit={(e) => handleSearch(e, searchQuery)} className="w-full relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Zoek naar het gewenste product..."
                  className="w-full py-2 px-4 pr-10 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#BEA46A]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#BEA46A]"
                >
                  <Search className="h-5 w-5" />
                </button>
              </form>
            </div>

            {/* User & Cart Icons */}
            <div className="flex items-center gap-2">
              <div className="relative group" ref={userMenuRef}>
                <button
                  className="p-2 hover:text-[#BEA46A]"
                  aria-label="Account"
                  type="button"
                  onClick={toggleUserMenu}
                >
                  <User className="h-6 w-6" />
                </button>

                {/* User Dropdown with explicit open/close state */}
                <div
                  className={`absolute right-0 top-full w-48 bg-white shadow-lg rounded-md overflow-hidden z-50 transition-all duration-200 ${
                    isUserMenuOpen
                      ? "opacity-100 visible pointer-events-auto"
                      : "opacity-0 invisible pointer-events-none"
                  }`}
                >
                  <div className="py-2">
                    {status === "authenticated" ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium">{session?.user?.name || session?.user?.email}</p>
                          <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
                        </div>
                        <Link
                          href="/account"
                          className="block px-4 py-2 text-sm hover:bg-[#BEA46A] hover:text-white transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Mijn Account
                        </Link>
                        <Link
                          href="/bestellingen"
                          className="block px-4 py-2 text-sm hover:bg-[#BEA46A] hover:text-white transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Mijn Bestellingen
                        </Link>
                        <Link
                          href="/gegevens"
                          className="block px-4 py-2 text-sm hover:bg-[#BEA46A] hover:text-white transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Instellingen
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-[#BEA46A] hover:text-white transition-colors flex items-center"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Uitloggen
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="block px-4 py-2 text-sm hover:bg-[#BEA46A] hover:text-white transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Inloggen
                        </Link>
                        <Link
                          href="/register"
                          className="block px-4 py-2 text-sm hover:bg-[#BEA46A] hover:text-white transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Registreren
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 relative"
                aria-label="Open winkelmand"
                type="button"
              >
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Menu - Optimized for better fit */}
      <div
        className={`fixed inset-0 bg-white z-[100] transition-all duration-300 ${
          isMobileMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <div className="flex items-center">
            <Image
              src="/logos/logo-xlgroothandelbv.png"
              alt="XL Groothandel B.V. logo"
              width={220}
              height={44}
              className="object-contain"
            />
          </div>
          <button
            onClick={handleCloseMenu}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Sluit menu"
            type="button"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Search - Compact */}
        <div className="px-3 py-2 border-b border-gray-200">
          <form onSubmit={(e) => handleSearch(e, mobileSearchQuery)} className="relative">
            <input
              ref={mobileSearchInputRef}
              type="text"
              placeholder="Zoek naar het gewenste product..."
              className="w-full py-2 px-3 pr-10 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#BEA46A] bg-gray-50 text-sm"
              value={mobileSearchQuery}
              onChange={(e) => setMobileSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#BEA46A] text-white p-1.5 rounded-md"
              aria-label="Zoeken"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Mobile Menu Content - Compact Grid Layout */}
        <div className="h-[calc(100%-120px)] overflow-hidden">
          <div className="grid grid-cols-2 gap-x-2 h-full">
            {/* Main Menu Column */}
            <div className="overflow-y-auto py-2 px-3">
              <nav>
                <ul className="space-y-1">
                  {menuItemsList.map((item) => (
                    <li key={item.name} className="border-b border-gray-100 pb-1">
                      {item.submenu?.length ? (
                        <>
                          <button
                            className="flex justify-between items-center w-full text-left py-1.5"
                            onClick={(e) => toggleMobileSubmenu(item.name, e)}
                            type="button"
                          >
                            <span className="text-base font-medium">{item.name}</span>
                            <ChevronDown
                              className={`h-4 w-4 text-[#BEA46A] transition-transform ${
                                expandedMobileMenus.includes(item.name) ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          <div
                            className={`overflow-hidden transition-all duration-200 ${
                              expandedMobileMenus.includes(item.name) ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                            }`}
                          >
                            <ul className="pl-3 space-y-0.5 py-1">
                              {item.submenu.map((sub) => (
                                <li key={sub.name}>
                                  <Link
                                    href={sub.href}
                                    className="text-gray-600 hover:text-[#BEA46A] block py-1 text-sm"
                                    onClick={handleCloseMenu}
                                  >
                                    {sub.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          className="text-base font-medium hover:text-[#BEA46A] block py-1.5"
                          onClick={handleCloseMenu}
                        >
                          {item.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Secondary Links Column */}
            <div className="overflow-y-auto border-l border-gray-100 py-2 px-3">
              {/* Customer Service Links */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Klantenservice</h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/klantenservice"
                      className="text-gray-600 hover:text-[#BEA46A] block py-1 text-sm"
                      onClick={handleCloseMenu}
                    >
                      Klantenservice
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/over-ons"
                      className="text-gray-600 hover:text-[#BEA46A] block py-1 text-sm"
                      onClick={handleCloseMenu}
                    >
                      Over ons
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/werken-bij"
                      className="text-gray-600 hover:text-[#BEA46A] block py-1 text-sm"
                      onClick={handleCloseMenu}
                    >
                      Werken bij
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://wa.me/31618495949"
                      className="text-gray-600 hover:text-[#BEA46A] block py-1 text-sm"
                      onClick={handleCloseMenu}
                    >
                      Contact via WhatsApp
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Account Links */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Mijn Account</h3>
                <ul className="space-y-1">
                  {status === "authenticated" ? (
                    <>
                      <li>
                        <Link
                          href="/account"
                          className="text-gray-600 hover:text-[#BEA46A] block py-1 text-sm"
                          onClick={handleCloseMenu}
                        >
                          Mijn Account
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/bestellingen"
                          className="text-gray-600 hover:text-[#BEA46A] block py-1 text-sm"
                          onClick={handleCloseMenu}
                        >
                          Mijn Bestellingen
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/gegevens"
                          className="text-gray-600 hover:text-[#BEA46A] block py-1 text-sm"
                          onClick={handleCloseMenu}
                        >
                          Instellingen
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={(e) => {
                            handleCloseMenu()
                            handleLogout(e)
                          }}
                          className="text-gray-600 hover:text-[#BEA46A] block py-1 text-sm w-full text-left"
                        >
                          Uitloggen
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link
                          href="/login"
                          className="text-gray-600 hover:text-[#BEA46A] block py-1 text-sm"
                          onClick={handleCloseMenu}
                        >
                          Inloggen
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/register"
                          className="text-gray-600 hover:text-[#BEA46A] block py-1 text-sm"
                          onClick={handleCloseMenu}
                        >
                          Registreren
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Popular Categories */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Populaire Categorieën
                </h3>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/categorie/bier"
                      className="text-gray-600 hover:text-[#BEA46A] block py-1 text-sm"
                      onClick={handleCloseMenu}
                    >
                      Bier
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categorie/wijn"
                      className="text-gray-600 hover:text-[#BEA46A] block py-1 text-sm"
                      onClick={handleCloseMenu}
                    >
                      Wijn
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categorie/sterke-drank"
                      className="text-gray-600 hover:text-[#BEA46A] block py-1 text-sm"
                      onClick={handleCloseMenu}
                    >
                      Sterke Drank
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categorie/frisdrank"
                      className="text-gray-600 hover:text-[#BEA46A] block py-1 text-sm"
                      onClick={handleCloseMenu}
                    >
                      Frisdrank
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            <p>© {new Date().getFullYear()} XL Groothandel B.V.</p>
          </div>
          <div className="flex space-x-4">
            <Link href="/account" className="text-[#BEA46A]" onClick={handleCloseMenu}>
              <User className="h-5 w-5" />
            </Link>
            <button
              onClick={() => {
                handleCloseMenu()
                setTimeout(() => setIsCartOpen(true), 300)
              }}
              className="text-[#BEA46A] relative"
              aria-label="Open winkelmand"
              type="button"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* SideCart */}
      <SideCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
