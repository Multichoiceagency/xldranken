"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import type Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X, Search, User, ShoppingCart, LogOut, ChevronDown, ChevronUp } from "lucide-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHome,
  faWineBottle,
  faBeer,
  faGlassWater,
  faUtensils,
  faBox,
  faUser,
  faShoppingCart,
  faSignOutAlt,
  faCubes,
} from "@fortawesome/free-solid-svg-icons"
import { useCart } from "@/lib/cart-context"
import { menuItemsList } from "@/lib/api_gisteren"
import { SideCart } from "@/components/side-cart"
import { useAuthContext } from "@/context/AuthContext"
import { signOut } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { useScrollLock } from "@/lib/useScrollLock"

// Custom Link component that prevents scroll reset
const NoScrollLink = ({ href, children, className, onClick, ...props }: React.ComponentProps<typeof Link>) => {
  const router = useRouter()
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (onClick) onClick(e)
    router.push(href.toString(), { scroll: false })
  }
  return (
    <a href={href.toString()} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  )
}

// Icon mapping for menu items
const getMenuIcon = (menuName: string) => {
  switch (menuName.toLowerCase()) {
    case "alcohol":
    case "sterke drank":
      return faWineBottle
    case "wijn":
      return faWineBottle
    case "bier":
      return faBeer
    case "frisdranken":
      return faGlassWater
    case "food":
      return faUtensils
    case "non-food":
      return faBox
    default:
      return faCubes
  }
}

// Haptic feedback utility
const triggerHapticFeedback = () => {
  if (typeof window !== "undefined" && "navigator" in window && "vibrate" in navigator) {
    // Light haptic feedback - short vibration
    navigator.vibrate(50)
  }
}

export function SiteHeader() {
  const { totalItems } = useCart().getCartTotal()
  const { isLoggedIn } = useAuthContext()
  const router = useRouter()
  const pathname = usePathname()

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const mobileSearchRef = useRef<HTMLDivElement>(null)
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  useScrollLock(isCartOpen || isMobileMenuOpen)

  // --- Dropdown logic for desktop ---
  const handleDropdownToggle = useCallback((e: React.MouseEvent, menuName: string) => {
    e.preventDefault()
    e.stopPropagation()
    setOpenDropdown((prev) => (prev === menuName ? null : menuName))
  }, [])

  // --- Dropdown logic for mobile ---
  const handleMobileDropdownToggle = useCallback((menuName: string) => {
    setOpenMobileDropdown((prev) => (prev === menuName ? null : menuName))
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openDropdown &&
        dropdownRefs.current[openDropdown] &&
        !dropdownRefs.current[openDropdown]?.contains(event.target as Node)
      ) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [openDropdown])

  // Close user menu when clicking outside
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", listener)
    return () => document.removeEventListener("mousedown", listener)
  }, [])

  // --- MOBILE SEARCH: close dropdown when clicking outside
  useEffect(() => {
    if (!showMobileSearch) return
    const listener = (event: MouseEvent) => {
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setShowMobileSearch(false)
        setShowSearchResults(false)
      }
    }
    document.addEventListener("mousedown", listener)
    return () => document.removeEventListener("mousedown", listener)
  }, [showMobileSearch])

  // Search functionality (shared for desktop & mobile)
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.length > 2) {
        try {
          const res = await fetch(
            `https://api.megawin.be/product/list/?apikey=YIwYR3LZbNXllabpGviSnXBHvtqfPAIN&id_membre=1&rechercher_mot_cle=${encodeURIComponent(
              searchQuery,
            )}`,
          )
          const data = await res.json()
          setSearchResults(data.result?.product || [])
          setShowSearchResults(true)
        } catch (error) {
          console.error("Search error:", error)
          setSearchResults([])
        }
      } else {
        setSearchResults([])
        setShowSearchResults(false)
      }
    }, 300)
    return () => clearTimeout(delayDebounce)
  }, [searchQuery])

  // --- Handlers ---
  const handleButtonClick = useCallback((e: React.MouseEvent, callback: () => void) => {
    e.preventDefault()
    e.stopPropagation()
    callback()
  }, [])

  const toggleUserMenu = useCallback(() => setIsUserMenuOpen((prev) => !prev), [])
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), [])

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => {
      const newState = !prev
      // Trigger haptic feedback when opening the menu on mobile
      if (newState) {
        triggerHapticFeedback()
      }
      return newState
    })
  }, [])

  // Search submit (desktop & mobile)
  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`, { scroll: false })
        setShowSearchResults(false)
        setShowMobileSearch(false)
        setIsMobileMenuOpen(false)
      }
    },
    [router, searchQuery],
  )

  // Handle logout
  const handleLogout = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      await signOut({ redirect: false })
      router.push("/", { scroll: false })
    },
    [router],
  )

  // Handle navigation to product page from search results
  const handleProductClick = useCallback(
    (e: React.MouseEvent, productId: string) => {
      e.preventDefault()
      router.push(`/product/${productId}`, { scroll: false })
      setShowSearchResults(false)
      setShowMobileSearch(false)
    },
    [router],
  )

  return (
    <>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#C6B07F] to-[#d4c291] text-white py-2 sm:py-3 text-xs sm:text-sm px-2 sm:px-4 shadow-sm">
        <div className="container mx-auto px-2 sm:px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-semibold">Meer dan 900+ producten</span>
          </div>
          <div className="hidden sm:flex md:gap-4 lg:gap-6">
            {isLoggedIn ? (
              <>
                <NoScrollLink
                  href="/account"
                  className="hover:text-white/80 transition-colors font-medium text-xs lg:text-sm"
                >
                  Mijn account
                </NoScrollLink>
                <NoScrollLink
                  href="/account/bestellingen"
                  className="hover:text-white/80 transition-colors font-medium text-xs lg:text-sm"
                >
                  Bestellingen
                </NoScrollLink>
                <NoScrollLink
                  href="/account/adressen"
                  className="hover:text-white/80 transition-colors font-medium text-xs lg:text-sm"
                >
                  Adressen
                </NoScrollLink>
                <button
                  onClick={handleLogout}
                  className="hover:text-red-200 transition-colors font-bold text-[#0E3058] text-xs lg:text-sm"
                >
                  Uitloggen
                </button>
              </>
            ) : (
              <>
                <NoScrollLink
                  href="/login"
                  className="hover:text-white/80 transition-colors font-medium text-xs lg:text-sm"
                >
                  Inloggen
                </NoScrollLink>
                <NoScrollLink
                  href="/zakelijk"
                  className="hover:text-white/80 transition-colors font-medium text-xs lg:text-sm"
                >
                  Registreren
                </NoScrollLink>
                <NoScrollLink
                  href="/klantenservice"
                  className="hover:text-white/80 transition-colors font-medium text-xs lg:text-sm"
                >
                  Klantenservice
                </NoScrollLink>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white shadow-lg border-b border-[#C6B07F]/20">
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 flex items-center justify-between lg:justify-start gap-2 sm:gap-4 relative">
          {/* Logo Section */}
          <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-4 flex-1 lg:flex-initial">
            <button
              onClick={(e) => handleButtonClick(e, toggleMobileMenu)}
              className="lg:hidden p-1 sm:p-2 rounded-lg hover:bg-[#C6B07F]/10 transition-colors absolute left-2 sm:left-4"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-[#0F3059]" />
            </button>
            <NoScrollLink href="/" className="flex-shrink-0">
              <Image
                src="/logos/logo-xlgroothandelbv.png"
                alt="XL Logo"
                width={160}
                height={45}
                className="sm:w-[180px] sm:h-[50px] lg:w-[200px] lg:h-[56px] object-contain hover:scale-105 transition-transform duration-300"
                priority
              />
            </NoScrollLink>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 justify-center items-center gap-4 xl:gap-6 2xl:gap-8 font-semibold max-w-4xl mx-auto">
            {menuItemsList.map((item) => (
              <div
                key={item.name}
                className="relative group"
                ref={(el) => {
                  dropdownRefs.current[item.name] = el
                }}
              >
                {item.submenu?.length ? (
                  <>
                    <div className="flex items-center">
                      <NoScrollLink
                        href={item.href}
                        className="hover:text-[#C6B07F] py-3 px-2 xl:px-3 mr-1 transition-colors duration-300 relative group text-sm xl:text-base whitespace-nowrap"
                      >
                        {item.name}
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C6B07F] group-hover:w-full transition-all duration-300"></span>
                      </NoScrollLink>
                      <button
                        onClick={(e) => handleDropdownToggle(e, item.name)}
                        className="hover:text-[#C6B07F] p-1 xl:p-2 transition-colors duration-300"
                      >
                        {openDropdown === item.name ? (
                          <ChevronUp className="w-3 h-3 xl:w-4 xl:h-4" />
                        ) : (
                          <ChevronDown className="w-3 h-3 xl:w-4 xl:h-4" />
                        )}
                      </button>
                    </div>
                    {openDropdown === item.name && (
                      <div className="absolute left-0 top-full bg-white shadow-xl rounded-lg w-56 xl:w-64 mt-2 z-50 border border-[#C6B07F]/20 overflow-hidden animate-fade-in">
                        {item.submenu.map((sub) => (
                          <NoScrollLink
                            key={sub.name}
                            href={sub.href}
                            className="block px-4 xl:px-6 py-2 xl:py-3 hover:bg-gradient-to-r hover:from-[#C6B07F] hover:to-[#d4c291] hover:text-[#0F3059] transition-all duration-300 border-b border-gray-100 last:border-b-0 text-sm xl:text-base"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {sub.name}
                          </NoScrollLink>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <NoScrollLink
                    href={item.href}
                    className="hover:text-[#C6B07F] py-3 px-2 xl:px-3 block transition-colors duration-300 relative group text-sm xl:text-base whitespace-nowrap"
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C6B07F] group-hover:w-full transition-all duration-300"></span>
                  </NoScrollLink>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Search Field */}
          <div
            className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-sm xl:max-w-md mx-2 lg:mx-6 relative"
            ref={searchRef}
          >
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Zoek producten..."
                  className="pr-10 lg:pr-12 py-2 lg:py-3 text-sm lg:text-base border-2 border-[#C6B07F]/30 focus:border-[#C6B07F] rounded-lg transition-colors duration-300"
                />
                <button
                  type="submit"
                  className="absolute right-2 lg:right-3 top-1/2 transform -translate-y-1/2 text-[#C6B07F] hover:text-[#0F3059] transition-colors duration-300"
                >
                  <Search className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>
              </div>
            </form>

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div
                className="absolute top-full right-0 mt-2 w-full bg-white shadow-xl rounded-lg z-50 overflow-hidden border border-[#C6B07F]/20 animate-fade-in"
                ref={(node) => {
                  const handleClickOutside = (e: MouseEvent) => {
                    if (node && !node.contains(e.target as Node) && !searchRef.current?.contains(e.target as Node)) {
                      setShowSearchResults(false)
                    }
                  }
                  if (node) {
                    document.addEventListener("mousedown", handleClickOutside)
                  }
                  return () => {
                    document.removeEventListener("mousedown", handleClickOutside)
                  }
                }}
              >
                <div className="max-h-80 overflow-y-auto">
                  {searchResults.map((product) => (
                    <a
                      key={product.arcleunik}
                      href={`/product/${product.arcleunik}`}
                      onClick={(e) => handleProductClick(e, product.arcleunik)}
                      className="block border-b border-gray-100 px-4 py-3 text-sm hover:bg-gradient-to-r hover:from-[#C6B07F]/10 hover:to-[#d4c291]/10 transition-all duration-300"
                    >
                      {product.title || product.megatech_Titre_lib_web_nl}
                    </a>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-100 bg-gray-50">
                  <NoScrollLink
                    href={`/search?q=${encodeURIComponent(searchQuery)}`}
                    className="block text-center text-sm text-[#C6B07F] hover:text-[#0F3059] font-semibold transition-colors duration-300"
                    onClick={() => setShowSearchResults(false)}
                  >
                    Bekijk alle resultaten
                  </NoScrollLink>
                </div>
              </div>
            )}
          </div>

          {/* User & Cart Actions */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={(e) => handleButtonClick(e, toggleUserMenu)}
                className="p-1 sm:p-2 rounded-lg hover:bg-[#C6B07F]/10 text-[#0F3059] hover:text-[#C6B07F] transition-all duration-300"
              >
                <User className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white shadow-xl rounded-lg z-50 border border-[#C6B07F]/20 overflow-hidden animate-fade-in">
                  <div className="py-2">
                    {isLoggedIn ? (
                      <>
                        <NoScrollLink
                          href="/account"
                          className="block px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base hover:bg-gradient-to-r hover:from-[#C6B07F]/10 hover:to-[#d4c291]/10 transition-all duration-300"
                        >
                          Mijn account
                        </NoScrollLink>
                        <NoScrollLink
                          href="/account/bestellingen"
                          className="block px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base hover:bg-gradient-to-r hover:from-[#C6B07F]/10 hover:to-[#d4c291]/10 transition-all duration-300"
                        >
                          Bestellingen
                        </NoScrollLink>
                        <NoScrollLink
                          href="/adressen/gegevens"
                          className="block px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base hover:bg-gradient-to-r hover:from-[#C6B07F]/10 hover:to-[#d4c291]/10 transition-all duration-300"
                        >
                          Adressen
                        </NoScrollLink>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base hover:bg-red-50 text-[#0E3058] hover:text-red-600 transition-all duration-300"
                        >
                          <LogOut className="inline-block w-3 h-3 sm:w-4 sm:h-4 mr-2" /> Uitloggen
                        </button>
                      </>
                    ) : (
                      <>
                        <NoScrollLink
                          href="/login"
                          className="block px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base hover:bg-gradient-to-r hover:from-[#C6B07F]/10 hover:to-[#d4c291]/10 transition-all duration-300"
                        >
                          Inloggen
                        </NoScrollLink>
                        <NoScrollLink
                          href="/zakelijk"
                          className="block px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base hover:bg-gradient-to-r hover:from-[#C6B07F]/10 hover:to-[#d4c291]/10 transition-all duration-300"
                        >
                          Registreren
                        </NoScrollLink>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Cart */}
            <button
              onClick={(e) => handleButtonClick(e, toggleCart)}
              className="relative p-1 sm:p-2 rounded-lg hover:bg-[#C6B07F]/10 text-[#0F3059] hover:text-[#C6B07F] transition-all duration-300"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full font-bold shadow-lg animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Enhanced Mobile Menu - Left Sidebar */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[98]"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar Menu - LEFT SIDE */}
          <div className="fixed top-0 left-0 h-full w-72 sm:w-80 max-w-[85vw] bg-gradient-to-br from-[#0F3059] via-[#1a4a7a] to-[#0F3059] z-[99] shadow-2xl transform transition-transform duration-300 ease-out translate-x-0 overflow-y-auto animate-slide-in-left">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#C6B07F]/30 bg-gradient-to-r from-[#C6B07F]/10 to-[#d4c291]/10">
              <Image src="/logos/logo-wit.png" alt="XL Logo" width={140} height={40} className="object-contain" />
              <button
                onClick={(e) => handleButtonClick(e, toggleMobileMenu)}
                className="p-2 rounded-lg hover:bg-[#C6B07F]/20 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Welcome Section */}
            <div className="p-6 border-b border-[#C6B07F]/20">
              {!isLoggedIn && (
                <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 p-4 rounded-lg border border-blue-400/30">
                  <p className="text-blue-300 font-semibold text-sm">Nog geen account?</p>
                  <p className="text-white/80 text-xs mb-3">Maak direct een zakelijke account aan</p>
                  <NoScrollLink
                    href="/zakelijk"
                    className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-[#C6B07F] to-[#d4c291] text-[#0F3059] text-xs font-semibold rounded-lg hover:from-[#d4c291] hover:to-[#C6B07F] transition-all duration-300 hover:scale-105"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Account aanmaken →
                  </NoScrollLink>
                </div>
              )}
            </div>

            {/* Navigation Menu */}
            <div className="p-6">
              <div className="space-y-2">
                {/* Home Link */}
                <NoScrollLink
                  href="/"
                  className="flex items-center gap-4 font-semibold text-base py-4 px-4 text-white hover:bg-gradient-to-r hover:from-[#C6B07F] hover:to-[#d4c291] hover:text-[#0F3059] rounded-lg transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FontAwesomeIcon icon={faHome} className="w-6 h-6" />
                  <span>Home</span>
                </NoScrollLink>

                {/* Menu Items with FontAwesome Icons */}
                {menuItemsList.map((item) => (
                  <div key={item.name} className="border-b border-[#C6B07F]/10 pb-2">
                    {item.submenu?.length ? (
                      <>
                        <div className="flex items-center justify-between w-full">
                          <NoScrollLink
                            href={item.href}
                            className="flex items-center gap-4 font-semibold text-base py-4 px-4 text-white hover:bg-gradient-to-r hover:from-[#C6B07F] hover:to-[#d4c291] hover:text-[#0F3059] rounded-lg transition-all duration-300 flex-1"
                            onClick={() => {
                              setIsMobileMenuOpen(false)
                              setOpenMobileDropdown(null)
                            }}
                          >
                            <FontAwesomeIcon icon={getMenuIcon(item.name)} className="w-6 h-6" />
                            <span>{item.name}</span>
                          </NoScrollLink>
                          <button
                            onClick={() => handleMobileDropdownToggle(item.name)}
                            className="p-3 hover:bg-[#C6B07F]/20 transition-colors rounded-lg text-white"
                          >
                            {openMobileDropdown === item.name ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        {openMobileDropdown === item.name && (
                          <div className="mt-2 ml-6 space-y-1 animate-fade-in">
                            {item.submenu.map((sub) => (
                              <NoScrollLink
                                key={sub.name}
                                href={sub.href}
                                className="block text-sm font-medium text-white/80 hover:text-[#C6B07F] transition-colors py-3 px-4 rounded-lg hover:bg-[#C6B07F]/10"
                                onClick={() => {
                                  setOpenMobileDropdown(null)
                                  setIsMobileMenuOpen(false)
                                }}
                              >
                                {sub.name}
                              </NoScrollLink>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <NoScrollLink
                        href={item.href}
                        className="flex items-center gap-4 font-semibold text-base py-4 px-4 text-white hover:bg-gradient-to-r hover:from-[#C6B07F] hover:to-[#d4c291] hover:text-[#0F3059] rounded-lg transition-all duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <FontAwesomeIcon icon={getMenuIcon(item.name)} className="w-6 h-6" />
                        <span>{item.name}</span>
                      </NoScrollLink>
                    )}
                  </div>
                ))}
              </div>

              {/* Account Section */}
              <div className="border-t border-[#C6B07F]/20 pt-6 mt-6">
                <h3 className="text-[#C6B07F] font-bold text-sm uppercase tracking-wide mb-4">Account & Service</h3>
                <div className="space-y-2">
                  {isLoggedIn ? (
                    <>
                      <NoScrollLink
                        href="/account"
                        className="flex items-center gap-4 font-semibold text-sm py-3 px-4 text-white hover:bg-gradient-to-r hover:from-[#C6B07F] hover:to-[#d4c291] hover:text-[#0F3059] rounded-lg transition-all duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
                        <span>Mijn Account</span>
                      </NoScrollLink>
                      <NoScrollLink
                        href="/account/bestellingen"
                        className="flex items-center gap-4 font-semibold text-sm py-3 px-4 text-white hover:bg-gradient-to-r hover:from-[#C6B07F] hover:to-[#d4c291] hover:text-[#0F3059] rounded-lg transition-all duration-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <FontAwesomeIcon icon={faShoppingCart} className="w-5 h-5" />
                        <span>Bestellingen</span>
                      </NoScrollLink>
                      <button
                        onClick={(e) => {
                          handleButtonClick(e, () => {
                            setIsMobileMenuOpen(false)
                            handleLogout(e)
                          })
                        }}
                        className="flex items-center gap-4 font-semibold text-sm py-3 px-4 w-full text-red-300 hover:bg-red-500/20 hover:text-red-200 rounded-lg transition-all duration-300"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5" />
                        <span>Uitloggen</span>
                      </button>
                    </>
                  ) : (
                    <NoScrollLink
                      href="/login"
                      className="flex items-center gap-4 font-semibold text-sm py-3 px-4 text-white hover:bg-gradient-to-r hover:from-[#C6B07F] hover:to-[#d4c291] hover:text-[#0F3059] rounded-lg transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
                      <span>Inloggen</span>
                    </NoScrollLink>
                  )}

                  <button
                    onClick={(e) => {
                      handleButtonClick(e, () => {
                        setIsMobileMenuOpen(false)
                        setIsCartOpen(true)
                      })
                    }}
                    className="flex items-center gap-4 font-semibold text-sm py-3 px-4 w-full text-white hover:bg-gradient-to-r hover:from-[#C6B07F] hover:to-[#d4c291] hover:text-[#0F3059] rounded-lg transition-all duration-300 relative"
                  >
                    <FontAwesomeIcon icon={faShoppingCart} className="w-5 h-5" />
                    <span>Winkelwagen</span>
                    {totalItems > 0 && (
                      <span className="absolute top-2 left-7 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                        {totalItems}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Footer Info */}
              <div className="border-t border-[#C6B07F]/20 pt-6 mt-6">
                <div className="text-center">
                  <p className="text-white/60 text-xs mb-2">XL Groothandel B.V.</p>
                  <p className="text-[#C6B07F] text-xs font-semibold">900+ Producten • Snelle Levering</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <SideCart
        isOpen={isCartOpen}
        onClose={(e) => {
          if (e) {
            e.preventDefault()
            e.stopPropagation()
          }
          setIsCartOpen(false)
        }}
      />

      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.3s ease-out forwards;
        }

        /* Prevent body scroll when menu is open */
        body.mobile-menu-open {
          overflow: hidden;
        }
      `}</style>
    </>
  )
}
