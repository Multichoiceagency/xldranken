"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { X, ChevronDown, ChevronRight, Search, Loader2 } from "lucide-react"
import { menuItemsList, searchProducts } from "@/lib/api"
import type { ProductProps } from "@/types/product"
import ProductCard from "@/components/product-card"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isClosing, setIsClosing] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<{
    categories: Array<{ name: string; href: string; isSubmenu?: boolean }>
    products: ProductProps[]
  }>({
    categories: [],
    products: [],
  })

  const menuRef = useRef<HTMLDivElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Handle mounting state to prevent hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle body scroll locking
  useEffect(() => {
    if (!mounted) return

    if (isOpen) {
      // Store the current scroll position
      const scrollY = window.scrollY

      // Apply styles to lock the body
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = "100%"
      document.body.style.overflow = "hidden"
    } else if (!isClosing) {
      // Get the scroll position from the body's top property
      const scrollY = document.body.style.top

      // Reset the body styles
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
      document.body.style.overflow = ""

      // Restore the scroll position
      if (scrollY) {
        window.scrollTo(0, Number.parseInt(scrollY || "0", 10) * -1)
      }
    }

    return () => {
      // Clean up in case component unmounts while menu is open
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
      document.body.style.overflow = ""
    }
  }, [isOpen, mounted, isClosing])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim().length >= 2) {
      console.log(`[MobileMenu] Submitting search for: "${searchQuery}"`)
      window.location.href = `/zoeken?q=${encodeURIComponent(searchQuery)}`
      handleClose()
    }
  }

  // Handle search results
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    setSearchError(null)

    if (searchQuery.trim() === "") {
      setSearchResults({
        categories: [],
        products: [],
      })
      return
    }

    // First, search categories immediately
    const query = searchQuery.toLowerCase()
    const categoryResults: Array<{ name: string; href: string; isSubmenu?: boolean }> = []

    menuItemsList.forEach((item) => {
      // Check main menu items
      if (item.name.toLowerCase().includes(query)) {
        categoryResults.push({ name: item.name, href: item.href })
      }

      // Check submenu items
      item.submenu?.forEach((subItem) => {
        if (subItem.name.toLowerCase().includes(query)) {
          categoryResults.push({
            name: subItem.name,
            href: subItem.href,
            isSubmenu: true,
          })
        }
      })
    })

    // Update with category results immediately
    setSearchResults((prev) => ({
      ...prev,
      categories: categoryResults,
    }))

    // Then search products with a delay to prevent too many API calls
    setIsSearching(true)
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        // Only search if query is at least 2 characters
        if (query.length >= 2) {
          console.log(`[MobileMenu] Searching for: "${query}"`)
          const productResults = await searchProducts(query)
          console.log(`[MobileMenu] Found ${productResults.length} results`)

          if (productResults.length > 0) {
            console.log("[MobileMenu] First product:", JSON.stringify(productResults[0]).substring(0, 200) + "...")
            console.log("[MobileMenu] First product fields:", Object.keys(productResults[0]).join(", "))
          } else {
            console.log("[MobileMenu] No products found")
          }

          // Accept all products - we'll handle missing fields in the ProductCard component
          setSearchResults((prev) => ({
            ...prev,
            products: productResults.slice(0, 5), // Limit to 5 products for better UX
          }))
        }
      } catch (error) {
        console.error("[MobileMenu] Error searching products:", error)
        setSearchError("Er is een fout opgetreden bij het zoeken. Probeer het later opnieuw.")
      } finally {
        setIsSearching(false)
      }
    }, 300)
  }, [searchQuery])

  // Handle closing animation
  const handleClose = () => {
    setIsClosing(true)
    if (menuRef.current) {
      menuRef.current.style.transform = "translateX(100%)"
    }
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 300)
  }

  // Reset search and expanded items when menu opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("")
      setSearchResults({
        categories: [],
        products: [],
      })
      setSearchError(null)
    }
  }, [isOpen])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  const toggleSubmenu = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName) ? prev.filter((name) => name !== itemName) : [...prev, itemName],
    )
  }

  if (!mounted) return null
  if (!isOpen && !isClosing) return null

  // Determine what to show based on search state
  const showSearchResults = searchQuery.trim().length > 0
  const showMenuItems = !showSearchResults

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-[9999] ${isClosing ? "opacity-0" : "opacity-100"}`}
      style={{
        transition: "opacity 300ms ease-in-out",
        pointerEvents: isClosing ? "none" : "auto",
      }}
      onClick={handleClose}
    >
      <div
        ref={menuRef}
        className="fixed top-0 right-0 bottom-0 w-full sm:w-[400px] max-w-full bg-white h-full flex flex-col"
        style={{
          transform: isOpen && !isClosing ? "translateX(0)" : "translateX(100%)",
          transition: "transform 300ms ease-in-out",
          touchAction: "pan-y",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <Link href="/" onClick={handleClose}>
            <Image
              src="/logos/logo-xlgroothandelbv.png"
              alt="XL Groothandel B.V. logo"
              width={200}
              height={40}
              className="h-10 w-auto object-contain"
            />
          </Link>
          <button
            onClick={handleClose}
            className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100"
            aria-label="Sluit menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full py-3 pl-10 pr-10 bg-gray-100 border-0 rounded-md focus:ring-2 focus:ring-[#E2B505] focus:bg-white"
              placeholder="Zoeken naar producten..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </form>
          {!showSearchResults && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2">Populaire zoekopdrachten:</p>
              <div className="flex flex-wrap gap-2">
                {["Bier", "Wodka", "Frisdrank", "Wijn", "Poolse producten"].map((term) => (
                  <button
                    key={term}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs"
                    onClick={() => setSearchQuery(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Menu content */}
        <div className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: "touch" }}>
          {/* Search Results */}
          {showSearchResults && (
            <div className="p-4">
              {/* Loading Indicator */}
              {isSearching && (
                <div className="py-4 text-center text-gray-500">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <span className="ml-2">Zoeken...</span>
                </div>
              )}

              {/* Search Error */}
              {searchError && (
                <div className="py-4 text-center text-red-500 bg-red-50 rounded-md p-3">
                  <p>{searchError}</p>
                </div>
              )}

              {/* Categories Section */}
              {searchResults.categories.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Categorieën</h3>
                  <ul className="space-y-1 bg-gray-50 rounded-md p-2">
                    {searchResults.categories.map((result, index) => (
                      <li
                        key={`cat-${result.name}-${index}`}
                        style={{
                          opacity: 0,
                          animation: `fadeInRight 300ms ease-out forwards ${100 + index * 50}ms`,
                        }}
                      >
                        <Link
                          href={result.href}
                          className={`flex items-center py-2 px-2 hover:bg-gray-100 rounded-md ${result.isSubmenu ? "pl-6" : ""}`}
                          onClick={handleClose}
                        >
                          <ChevronRight className="mr-2 h-4 w-4 text-gray-400" />
                          <span>
                            {result.isSubmenu && <span className="text-xs text-gray-500 mr-1">Subcategorie:</span>}
                            {result.name}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Products Section */}
              {searchResults.products.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Producten</h3>
                  <div className="space-y-4">
                    {searchResults.products.map((product, index) => (
                      <div
                        key={`prod-${product.arcleunik || product.id || index}`}
                        style={{
                          opacity: 0,
                          animation: `fadeInRight 300ms ease-out forwards ${150 + index * 50}ms`,
                        }}
                        onClick={handleClose}
                      >
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>

                  {/* View All Results Link */}
                  <div
                    className="mt-4"
                    style={{
                      opacity: 0,
                      animation: "fadeInUp 300ms ease-out forwards 300ms",
                    }}
                  >
                    <Link
                      href={`/zoeken?q=${encodeURIComponent(searchQuery)}`}
                      className="block w-full py-3 text-center text-sm font-medium text-white bg-[#E2B505] rounded-md hover:bg-[#E2B505]/90"
                      onClick={handleClose}
                    >
                      Bekijk alle resultaten ({searchResults.products.length}+)
                    </Link>
                  </div>
                </div>
              )}

              {/* No Results */}
              {!isSearching &&
                searchQuery.trim().length >= 2 &&
                searchResults.categories.length === 0 &&
                searchResults.products.length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-gray-500 mb-4">Geen resultaten gevonden voor "{searchQuery}"</p>
                    <p className="text-sm text-gray-400 mb-4">
                      Probeer een andere zoekterm of blader door onze categorieën.
                    </p>

                    {/* Suggestions */}
                    <div className="mt-4 mb-6">
                      <p className="text-xs text-gray-500 mb-2">Probeer een van deze zoekopdrachten:</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {["Bier", "Wodka", "Frisdrank", "Wijn", "Poolse producten"].map((term) => (
                          <button
                            key={term}
                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs"
                            onClick={() => setSearchQuery(term)}
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Debug info */}
                    <div className="mt-4 p-3 bg-gray-100 rounded-md text-left text-xs text-gray-600 max-w-lg mx-auto">
                      <p className="font-semibold mb-1">Debug informatie:</p>
                      <p>Zoekopdracht: "{searchQuery}"</p>
                      <p>API URL: {process.env.NEXT_PUBLIC_API_URL ? "Geconfigureerd" : "Niet geconfigureerd"}</p>
                    </div>
                  </div>
                )}
            </div>
          )}

          {/* Regular Menu Items */}
          {showMenuItems && (
            <nav className="p-4">
              <ul className="space-y-1">
                {menuItemsList.map((item, index) => (
                  <li
                    key={item.name}
                    className="border-b border-gray-100 py-2"
                    style={{
                      opacity: 0,
                      animation: isOpen ? `fadeInRight 300ms ease-out forwards ${150 + index * 50}ms` : "none",
                    }}
                  >
                    {item.submenu && item.submenu.length > 0 ? (
                      <>
                        <button
                          className="flex items-center justify-between w-full py-3 px-2 text-lg font-medium"
                          onClick={() => toggleSubmenu(item.name)}
                        >
                          <span>{item.name}</span>
                          <ChevronDown
                            className={`transition-transform duration-200 ${
                              expandedItems.includes(item.name) ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {expandedItems.includes(item.name) && (
                          <ul className="pl-4 py-2 space-y-1 bg-gray-50 rounded-md mt-1 mb-2">
                            {item.submenu.map((subItem, subIndex) => (
                              <li
                                key={subItem.name}
                                style={{
                                  opacity: 0,
                                  animation: `fadeInUp 200ms ease-out forwards ${100 + subIndex * 30}ms`,
                                }}
                              >
                                <Link
                                  href={subItem.href}
                                  className="flex items-center py-2 px-2 text-gray-700 hover:text-[#E2B505]"
                                  onClick={handleClose}
                                >
                                  <ChevronRight className="mr-2 h-4 w-4 text-gray-400" />
                                  <span>{subItem.name}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className="block py-3 px-2 text-lg font-medium hover:text-[#E2B505]"
                        onClick={handleClose}
                      >
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        {/* Footer */}
        <div
          className="border-t p-4 bg-gray-50"
          style={{
            opacity: 0,
            animation: isOpen ? "fadeInUp 300ms ease-out forwards 300ms" : "none",
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/account"
              className="flex items-center justify-center py-3 bg-[#0F3059] text-white rounded-md font-medium"
              onClick={handleClose}
            >
              Mijn Account
            </Link>
            <Link
              href="/wishlist"
              className="flex items-center justify-center py-3 bg-[#E2B505] text-white rounded-md font-medium"
              onClick={handleClose}
            >
              Verlanglijst
            </Link>
          </div>
        </div>
      </div>

      {/* Add animation keyframes */}
      <style jsx global>{`
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
