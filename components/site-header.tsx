"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import type Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X, Search, User, ShoppingCart, LogOut, ChevronDown, ChevronUp } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { menuItemsList } from "@/lib/api"
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
  const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen((prev) => !prev), [])

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
      <div className="bg-[#BEA46A] text-white py-2 text-sm px-4">
        <div className="container mx-auto flex justify-between">
          <span>Meer dan 900+ producten</span>
          <div className="hidden md:flex gap-4">
            {isLoggedIn ? (
              <>
                <NoScrollLink href="/account" className="hover:underline">
                  Mijn account
                </NoScrollLink>
                <NoScrollLink href="/account/bestellingen" className="hover:underline">
                  Bestellingen
                </NoScrollLink>
                <NoScrollLink href="/account/adressen" className="hover:underline">
                  Adressen
                </NoScrollLink>
                <button onClick={handleLogout} className="hover:underline text-[#0E3159] font-bold hover:text-red-100">
                  Uitloggen
                </button>
              </>
            ) : (
              <>
                <NoScrollLink href="/login" className="hover:underline">
                  Inloggen
                </NoScrollLink>
                <NoScrollLink href="/zakelijk" className="hover:underline">
                  Registreren
                </NoScrollLink>
                <NoScrollLink href="/klantenservice" className="hover:underline">
                  Klantenservice
                </NoScrollLink>
              </>
            )}
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={(e) => handleButtonClick(e, toggleMobileMenu)} className="lg:hidden">
              <Menu className="w-6 h-6" />
            </button>
            <NoScrollLink href="/">
              <Image
                src="/logos/logo-xlgroothandelbv.png"
                alt="XL Logo"
                width={200}
                height={48}
                className="object-contain"
                priority
              />
            </NoScrollLink>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex flex-1 justify-center gap-10 font-semibold">
            {menuItemsList.map((item) => (
              <div
                key={item.name}
                className="relative"
                ref={(el) => {
                  dropdownRefs.current[item.name] = el
                }}
              >
                {item.submenu?.length ? (
                  <>
                    <div className="flex items-center">
                      <NoScrollLink href={item.href} className="hover:text-[#BEA46A] py-2 mr-1">
                        {item.name}
                      </NoScrollLink>
                      <button onClick={(e) => handleDropdownToggle(e, item.name)} className="hover:text-[#BEA46A] p-1">
                        {openDropdown === item.name ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {openDropdown === item.name && (
                      <div className="absolute left-0 top-full bg-white shadow-lg rounded-md w-64 mt-1 z-50">
                        {item.submenu.map((sub) => (
                          <NoScrollLink
                            key={sub.name}
                            href={sub.href}
                            className="block px-4 py-2 hover:bg-[#BEA46A] hover:text-white"
                            onClick={() => setOpenDropdown(null)}
                          >
                            {sub.name}
                          </NoScrollLink>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <NoScrollLink href={item.href} className="hover:text-[#BEA46A] py-2 block">
                    {item.name}
                  </NoScrollLink>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Search Field */}
          <div className="hidden md:flex items-center flex-1 max-w-sm mx-6 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Zoek producten..."
                  className="pr-8 py-2"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#BEA46A]"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full right-0 mt-2 w-full bg-white shadow-lg rounded-md z-50 overflow-hidden">
                <div className="max-h-80 overflow-y-auto">
                  {searchResults.map((product) => (
                    <a
                      key={product.arcleunik}
                      href={`/product/${product.arcleunik}`}
                      onClick={(e) => handleProductClick(e, product.arcleunik)}
                      className="block border-t border-gray-100 px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      {product.title || product.megatech_Titre_lib_web_nl}
                    </a>
                  ))}
                </div>
                <div className="p-2 border-t border-gray-100">
                  <NoScrollLink
                    href={`/search?q=${encodeURIComponent(searchQuery)}`}
                    className="block text-center text-sm text-[#BEA46A] hover:underline py-1"
                    onClick={() => setShowSearchResults(false)}
                  >
                    Bekijk alle resultaten
                  </NoScrollLink>
                </div>
              </div>
            )}
          </div>

          {/* MOBILE SEARCH ICON & DROPDOWN */}
          <div className="md:hidden relative">
            <button onClick={() => setShowMobileSearch((v) => !v)} className="text-[#BEA46A]" aria-label="Zoeken">
              <Search className="w-5 h-5" />
            </button>
            {showMobileSearch && (
              <div
                ref={mobileSearchRef}
                className="absolute top-full right-0 mt-2 w-[90vw] max-w-xs sm:max-w-sm bg-white shadow-lg rounded-md z-50 p-4"
              >
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                  <Input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Zoek producten..."
                    className="flex-1 py-2"
                  />
                  <button type="submit" className="text-gray-400 hover:text-[#BEA46A]">
                    <Search className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="ml-1 text-gray-400 hover:text-[#BEA46A]"
                    onClick={() => {
                      setShowMobileSearch(false)
                      setShowSearchResults(false)
                    }}
                    aria-label="Sluit zoekvenster"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </form>
                {showSearchResults && (
                  <div className="mt-2 max-h-60 overflow-y-auto -mx-4">
                    {searchResults.length > 0 ? (
                      searchResults.map((product) => (
                        <a
                          key={product.arcleunik}
                          href={`/product/${product.arcleunik}`}
                          onClick={(e) => handleProductClick(e, product.arcleunik)}
                          className="block border-t border-gray-100 px-4 py-2 text-sm hover:bg-gray-50"
                        >
                          {product.title || product.megatech_Titre_lib_web_nl}
                        </a>
                      ))
                    ) : searchQuery.length > 2 ? (
                      <div className="px-4 py-4 text-sm text-gray-500 text-center">Geen resultaten gevonden</div>
                    ) : null}
                    <div className="border-t border-gray-100 px-4 py-2">
                      <NoScrollLink
                        href={`/search?q=${encodeURIComponent(searchQuery)}`}
                        className="block text-center text-sm text-[#BEA46A] hover:underline py-1"
                        onClick={() => {
                          setShowSearchResults(false)
                          setShowMobileSearch(false)
                        }}
                      >
                        Bekijk alle resultaten
                      </NoScrollLink>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User & cart */}
          <div className="flex items-center gap-4">
            <div className="relative" ref={userMenuRef}>
              <button onClick={(e) => handleButtonClick(e, toggleUserMenu)}>
                <User className="w-6 h-6" />
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
                  <div className="py-2">
                    {isLoggedIn ? (
                      <>
                        <NoScrollLink href="/account" className="block px-4 py-2 hover:bg-gray-100">
                          Mijn account
                        </NoScrollLink>
                        <NoScrollLink href="/account/bestellingen" className="block px-4 py-2 hover:bg-gray-100">
                          Bestellingen
                        </NoScrollLink>
                        <NoScrollLink href="/adressen/gegevens" className="block px-4 py-2 hover:bg-gray-100">
                          Adressen
                        </NoScrollLink>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                        >
                          <LogOut className="inline-block w-4 h-4 mr-1" /> Uitloggen
                        </button>
                      </>
                    ) : (
                      <>
                        <NoScrollLink href="/login" className="block px-4 py-2 hover:bg-gray-100">
                          Inloggen
                        </NoScrollLink>
                        <NoScrollLink href="/zakelijk" className="block px-4 py-2 hover:bg-gray-100">
                          Registreren
                        </NoScrollLink>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            <button onClick={(e) => handleButtonClick(e, toggleCart)} className="relative">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[98] backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {isMobileMenuOpen && (
        <div
          className="fixed inset-y-0 left-0 z-[99] bg-white overflow-y-auto w-full md:w-3/4 shadow-xl animate-slide-in"
          style={{ width: "75%" }}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <Image src="/logos/logo-xlgroothandelbv.png" alt="XL Logo" width={160} height={48} />
            <div className="flex items-center gap-3">
              <button onClick={(e) => handleButtonClick(e, toggleMobileMenu)}>
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-6">
              {menuItemsList.map((item) => (
                <div key={item.name} className="mb-2">
                  {item.submenu?.length ? (
                    <>
                      <div className="flex items-center justify-between w-full">
                        <NoScrollLink
                          href={item.href}
                          className="font-bold text-lg py-2 hover:text-[#BEA46A] transition-colors"
                          onClick={() => {
                            setIsMobileMenuOpen(false)
                            setOpenMobileDropdown(null)
                          }}
                        >
                          {item.name}
                        </NoScrollLink>
                        <button
                          onClick={() => handleMobileDropdownToggle(item.name)}
                          className="p-2 hover:text-[#BEA46A] transition-colors"
                        >
                          {openMobileDropdown === item.name ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {openMobileDropdown === item.name && (
                        <div className="mt-2 ml-4 space-y-3">
                          {item.submenu.map((sub) => (
                            <NoScrollLink
                              key={sub.name}
                              href={sub.href}
                              className="block text-base font-semibold text-gray-600 hover:text-[#BEA46A] transition-colors py-2"
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
                      className="font-bold text-lg block py-2 hover:text-[#BEA46A] transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </NoScrollLink>
                  )}
                </div>
              ))}

              {/* Divider */}
              <div className="border-t border-gray-200 my-6"></div>

              {/* Bottom menu items moved under primary menu */}
              <div className="grid grid-cols-1 gap-4">
                {isLoggedIn ? (
                  <>
                    <NoScrollLink
                      href="/account"
                      className="flex items-center gap-3 font-bold text-lg py-3 px-4 hover:bg-[#BEA46A] hover:text-white rounded-md transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-6 h-6" />
                      <span>Mijn Account</span>
                    </NoScrollLink>
                    <NoScrollLink
                      href="/account/bestellingen"
                      className="flex items-center gap-3 font-bold text-lg py-3 px-4 hover:bg-[#BEA46A] hover:text-white rounded-md transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <ShoppingCart className="w-6 h-6" />
                      <span>Bestellingen</span>
                    </NoScrollLink>
                    <button
                      onClick={(e) => {
                        handleButtonClick(e, () => {
                          setIsMobileMenuOpen(false)
                          handleLogout(e)
                        })
                      }}
                      className="flex items-center gap-3 font-bold text-lg py-3 px-4 hover:bg-red-500 hover:text-white rounded-md transition-colors text-red-500"
                    >
                      <LogOut className="w-6 h-6" />
                      <span>Uitloggen</span>
                    </button>
                  </>
                ) : (
                  <NoScrollLink
                    href="/login"
                    className="flex items-center gap-3 font-bold text-lg py-3 px-4 hover:bg-[#BEA46A] hover:text-white rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-6 h-6" />
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
                  className="flex items-center gap-3 font-bold text-lg py-3 px-4 hover:bg-[#BEA46A] hover:text-white rounded-md transition-colors relative"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span>Winkelwagen</span>
                  {totalItems > 0 && (
                    <span className="absolute top-3 left-7 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
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
    </>
  )
}
