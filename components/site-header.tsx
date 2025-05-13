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
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  useScrollLock(isCartOpen || searchOpen || isMobileMenuOpen)

  // Prevent default on all button clicks to avoid scroll reset
  const handleButtonClick = useCallback((e: React.MouseEvent, callback: () => void) => {
    e.preventDefault()
    e.stopPropagation()
    callback()
  }, [])

  // Toggle search overlay
  const toggleSearch = useCallback(() => {
    setSearchOpen((prev) => !prev)
  }, [])

  // Toggle user menu
  const toggleUserMenu = useCallback(() => {
    setIsUserMenuOpen((prev) => !prev)
  }, [])

  // Toggle cart
  const toggleCart = useCallback(() => {
    setIsCartOpen((prev) => !prev)
  }, [])

  // Toggle mobile menu
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev)
  }, [])

  // Toggle dropdown menu
  const toggleDropdown = useCallback((e: React.MouseEvent, menuName: string) => {
    e.preventDefault()
    e.stopPropagation()
    setOpenDropdown((prev) => (prev === menuName ? null : menuName))
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

  // Search functionality
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.length > 2) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_CUSTOMER_API_URL}/product/list?apikey=${process.env.NEXT_PUBLIC_API_KEY}&id_membre=1&rechercher_mot_cle=${encodeURIComponent(searchQuery)}&limit=10&page=1&tri_listing_article=alpha`,
          )
          const data = await res.json()
          setSearchResults(data.result?.product || [])
        } catch (error) {
          console.error("Search error:", error)
          setSearchResults([])
        }
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [searchQuery])

  // Handle search submission
  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`, { scroll: false })
        setSearchOpen(false)
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
      setSearchOpen(false)
    },
    [router],
  )

  return (
    <>
      <div className="bg-[#BEA46A] text-white py-2 text-sm px-4">
        <div className="container mx-auto flex justify-between">
          <span>✓ Meer dan 4.000 dranken</span>
          <div className="hidden md:flex gap-4">
            <NoScrollLink href="/zakelijk" className="hover:underline">
              Registreren
            </NoScrollLink>
            <NoScrollLink href="/klantenservice" className="hover:underline">
              Klantenservice
            </NoScrollLink>
            <NoScrollLink href="/over-ons" className="hover:underline">
              Over ons
            </NoScrollLink>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
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

          <nav className="hidden lg:flex flex-1 justify-center gap-10 font-semibold">
            {menuItemsList.map((item) => (
              <div key={item.name} className="relative" ref={(el) => { dropdownRefs.current[item.name] = el; }}>
                {item.submenu?.length ? (
                  <>
                    <button
                      onClick={(e) => toggleDropdown(e, item.name)}
                      className="hover:text-[#BEA46A] flex items-center gap-1 py-2"
                    >
                      {item.name}
                      {openDropdown === item.name ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
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

          <div className="flex items-center gap-4">
            <button onClick={(e) => handleButtonClick(e, toggleSearch)} className="text-[#BEA46A]">
              <Search className="w-5 h-5" />
            </button>

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
                        <NoScrollLink href="/bestellingen" className="block px-4 py-2 hover:bg-gray-100">
                          Bestellingen
                        </NoScrollLink>
                        <NoScrollLink href="/gegevens" className="block px-4 py-2 hover:bg-gray-100">
                          Gegevens
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
                        <NoScrollLink href="/register" className="block px-4 py-2 hover:bg-gray-100">
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

      {searchOpen && (
        <div className="fixed inset-0 bg-white z-[100] p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Zoeken</h2>
            <button onClick={(e) => handleButtonClick(e, toggleSearch)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSearchSubmit}>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Zoek producten..."
              className="w-full mb-4"
              autoFocus
            />
          </form>
          <div className="space-y-2">
            {searchResults.length === 0 && searchQuery.length > 2 && (
              <p className="text-gray-500">Geen resultaten gevonden.</p>
            )}
            {searchResults.map((product) => (
              <a
                key={product.arcleunik}
                href={`/product/${product.arcleunik}`}
                onClick={(e) => handleProductClick(e, product.arcleunik)}
                className="block border-b py-2 text-sm hover:bg-gray-50"
              >
                {product.title || product.megatech_Titre_lib_web_nl}
              </a>
            ))}
          </div>
        </div>
      )}

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[99] bg-white overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <Image src="/logos/logo-xlgroothandelbv.png" alt="XL Logo" width={160} height={48} />
            <button onClick={(e) => handleButtonClick(e, toggleMobileMenu)}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-4">
            <form onSubmit={handleSearchSubmit}>
              <Input
                placeholder="Zoek producten..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-4"
              />
            </form>
            <div className="space-y-4">
              {menuItemsList.map((item) => (
                <div key={item.name}>
                  {item.submenu?.length ? (
                    <>
                      <button
                        onClick={(e) => toggleDropdown(e, item.name)}
                        className="font-medium flex items-center justify-between w-full text-left"
                      >
                        <span>{item.name}</span>
                        {openDropdown === item.name ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                      {openDropdown === item.name && (
                        <div className="mt-2 ml-4 space-y-2">
                          {item.submenu.map((sub) => (
                            <NoScrollLink
                              key={sub.name}
                              href={sub.href}
                              className="block text-sm text-gray-600"
                              onClick={() => {
                                setOpenDropdown(null)
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
                      className="font-medium block"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </NoScrollLink>
                  )}
                </div>
              ))}
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
