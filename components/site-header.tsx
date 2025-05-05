"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Heart, Menu, Search, ShoppingCart, User, ArrowLeft, Loader2, ChevronRight } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { SideCart } from "./side-cart"
import { menuItemsList, searchProducts } from "@/lib/api"
import { MobileMenu } from "./mobile-menu"
import type { ProductProps } from "@/types/product"
import ProductCard from "@/components/product-card"

export function SiteHeader() {
  const { totalItems } = useCart().getCartTotal()

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isFullscreenSearchOpen, setIsFullscreenSearchOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<{
    categories: Array<{ name: string; href: string; isSubmenu?: boolean }>
    products: ProductProps[]
  }>({
    categories: [],
    products: [],
  })
  const [searchError, setSearchError] = useState<string | null>(null)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([
    "Poolse bier",
    "Wodka",
    "Frisdrank",
    "Wijn",
    "Houtskool",
    "Koffie",
  ])

  const lastScrollY = useRef(0)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const fullscreenSearchInputRef = useRef<HTMLInputElement>(null)
  const searchResultsRef = useRef<HTMLDivElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const storedSearches = localStorage.getItem("recentSearches")
    if (storedSearches) {
      try {
        const parsedSearches = JSON.parse(storedSearches)
        if (Array.isArray(parsedSearches)) {
          setRecentSearches(parsedSearches.slice(0, 5))
        }
      } catch (error) {
        console.error("Error parsing recent searches:", error)
      }
    }
  }, [])

  // Show/hide header on scroll (mobile only)
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

  // Cleanup dropdown timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current)
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    }
  }, [])

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
          console.log(`[SiteHeader] Searching for: "${query}"`)
          const productResults = await searchProducts(query)
          console.log(`[SiteHeader] Found ${productResults.length} results`)

          if (productResults.length > 0) {
            console.log("[SiteHeader] First product:", JSON.stringify(productResults[0]))
          } else {
            console.log("[SiteHeader] No products found")
          }

          setSearchResults((prev) => ({
            ...prev,
            products: productResults.slice(0, 8), // Limit to 8 products for better UX
          }))
        }
      } catch (error) {
        console.error("[SiteHeader] Error searching products:", error)
        setSearchError("Er is een fout opgetreden bij het zoeken. Probeer het later opnieuw.")
      } finally {
        setIsSearching(false)
      }
    }, 300)
  }, [searchQuery])

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setSearchResults({
          categories: [],
          products: [],
        })
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Focus search input when search is opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  // Focus fullscreen search input when opened
  useEffect(() => {
    if (isFullscreenSearchOpen && fullscreenSearchInputRef.current) {
      fullscreenSearchInputRef.current.focus()
    }
  }, [isFullscreenSearchOpen])

  // Lock body scroll when fullscreen search is open
  useEffect(() => {
    if (isFullscreenSearchOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isFullscreenSearchOpen])

  const handleDropdownEnter = (menu: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current)
    setActiveDropdown(menu)
  }

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 200)
  }

  const toggleSearch = () => {
    setIsFullscreenSearchOpen(true)
    setSearchQuery("")
    setSearchResults({
      categories: [],
      products: [],
    })
    setSearchError(null)
  }

  const closeFullscreenSearch = () => {
    setIsFullscreenSearchOpen(false)
    setSearchQuery("")
    setSearchResults({
      categories: [],
      products: [],
    })
    setSearchError(null)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim().length >= 2) {
      // Save to recent searches
      const newRecentSearches = [searchQuery.trim(), ...recentSearches.filter((s) => s !== searchQuery.trim())].slice(
        0,
        5,
      )
      setRecentSearches(newRecentSearches)
      localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches))

      // Navigate to search results page
      window.location.href = `/zoeken?q=${encodeURIComponent(searchQuery)}`
      closeFullscreenSearch()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion)

    // Save to recent searches
    const newRecentSearches = [suggestion, ...recentSearches.filter((s) => s !== suggestion)].slice(0, 5)
    setRecentSearches(newRecentSearches)
    localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches))

    // Focus the input
    if (isFullscreenSearchOpen && fullscreenSearchInputRef.current) {
      fullscreenSearchInputRef.current.focus()
    }
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
            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open mobiel menu"
                className="p-2 hover:text-[#E2B505]"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2 lg:static lg:transform-none">
              <Link href="/" className="flex items-center" aria-label="Ga naar de homepage">
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

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8 font-bold">
              {menuItemsList.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter(item.name)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    href={item.href}
                    className="px-2 py-1 hover:bg-[#E2B505] rounded-md hover:text-white transition-colors flex items-center"
                  >
                    {item.name}
                    {item.submenu?.length > 0 && <ChevronDown className="ml-1 h-4 w-4" />}
                  </Link>

                  {/* Dropdown */}
                  {item.submenu?.length > 0 && activeDropdown === item.name && (
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

            {/* User & Cart Icons */}
            <div className="flex items-center">
              <button onClick={toggleSearch} className="p-2 hover:text-[#E2B505]" aria-label="Zoeken">
                <Search className="h-6 w-6" />
              </button>
              <Link href="/account" className="p-2 hover:text-[#E2B505]" aria-label="Account">
                <User className="h-6 w-6" />
              </Link>

              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 relative hover:text-[#E2B505]"
                aria-label="Open winkelmand"
              >
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>
              <Link href="/wishlist" className="hidden lg:block p-2 hover:text-[#E2B505]" aria-label="Verlanglijst">
                <Heart className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* SideCart */}
      <SideCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Fullscreen Search Overlay */}
      {isFullscreenSearchOpen && (
        <div className="fixed inset-0 bg-white z-[9999] flex flex-col overflow-hidden">
          {/* Search Header */}
          <div className="border-b">
            <div className="container mx-auto px-4 py-4 flex items-center">
              <button
                onClick={closeFullscreenSearch}
                className="p-2 mr-4 hover:bg-gray-100 rounded-full"
                aria-label="Sluiten"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <form onSubmit={handleSearchSubmit} className="flex-1 flex">
                <div className="relative flex-1">
                  <input
                    ref={fullscreenSearchInputRef}
                    type="text"
                    placeholder="Zoeken naar producten..."
                    className="w-full py-3 pl-4 pr-4 bg-gray-100 border-0 rounded-l-md focus:ring-2 focus:ring-[#E2B505] focus:bg-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button type="submit" className="px-6 bg-[#E2B505] text-white rounded-r-md hover:bg-[#E2B505]/90">
                  Zoeken
                </button>
              </form>
            </div>
          </div>

          {/* Search Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 py-6">
              {/* Loading Indicator */}
              {isSearching && (
                <div className="py-4 text-center text-gray-500">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <span>Zoeken naar producten...</span>
                </div>
              )}

              {/* Search Error */}
              {searchError && (
                <div className="py-4 text-center text-red-500">
                  <p>{searchError}</p>
                </div>
              )}

              {/* Search Suggestions (when no query) */}
              {searchQuery.trim() === "" && (
                <>
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Recente zoekopdrachten</h3>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((search, index) => (
                          <button
                            key={`recent-${index}`}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
                            onClick={() => handleSuggestionClick(search)}
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Searches */}
                  <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Populaire zoekopdrachten</h3>
                    <div className="flex flex-wrap gap-2">
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={`suggestion-${index}`}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Popular Categories */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Populaire categorieën</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {menuItemsList.slice(0, 4).map((category) => (
                        <Link
                          key={category.name}
                          href={category.href}
                          className="p-4 bg-gray-100 hover:bg-gray-200 rounded-md text-center"
                          onClick={closeFullscreenSearch}
                        >
                          <span className="font-medium">{category.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Search Results */}
              {searchQuery.trim() !== "" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Categories Column */}
                  <div className="lg:col-span-1">
                    {searchResults.categories.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Categorieën</h3>
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
                                className={`flex items-center py-2 px-3 hover:bg-gray-100 rounded-md ${
                                  result.isSubmenu ? "pl-6" : ""
                                }`}
                                onClick={closeFullscreenSearch}
                              >
                                <ChevronRight className="mr-2 h-4 w-4 text-gray-400" />
                                <span>
                                  {result.isSubmenu && (
                                    <span className="text-xs text-gray-500 mr-1">Subcategorie:</span>
                                  )}
                                  {result.name}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Related Searches */}
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                        Gerelateerde zoekopdrachten
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {searchSuggestions
                          .filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase()) || Math.random() > 0.7)
                          .slice(0, 5)
                          .map((suggestion, index) => (
                            <button
                              key={`related-${index}`}
                              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Products Column */}
                  <div className="lg:col-span-2">
                    {searchResults.products.length > 0 ? (
                      <>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Producten</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {searchResults.products.map((product, index) => (
                            <div
                              key={`prod-${product.arcleunik}-${index}`}
                              style={{
                                opacity: 0,
                                animation: `fadeInUp 300ms ease-out forwards ${150 + index * 50}ms`,
                              }}
                              onClick={closeFullscreenSearch}
                            >
                              <ProductCard product={product} />
                            </div>
                          ))}
                        </div>

                        {/* View All Results Link */}
                        <div className="mt-6 text-center">
                          <Link
                            href={`/zoeken?q=${encodeURIComponent(searchQuery)}`}
                            className="inline-block px-6 py-3 bg-[#E2B505] text-white rounded-md hover:bg-[#E2B505]/90"
                            onClick={closeFullscreenSearch}
                          >
                            Bekijk alle resultaten
                          </Link>
                        </div>
                      </>
                    ) : (
                      !isSearching &&
                      searchQuery.trim().length >= 2 && (
                        <div className="py-12 text-center">
                          <p className="text-lg text-gray-500 mb-4">Geen resultaten gevonden voor "{searchQuery}"</p>
                          <p className="text-sm text-gray-400 mb-6">
                            Probeer een andere zoekterm of blader door onze categorieën.
                          </p>

                          {/* Debug info for developers */}
                          <div className="mt-8 p-4 bg-gray-100 rounded-md text-left text-xs text-gray-600 max-w-lg mx-auto">
                            <p className="font-semibold mb-2">Debug informatie:</p>
                            <p>Zoekopdracht: "{searchQuery}"</p>
                            <p>API URL: {process.env.NEXT_PUBLIC_API_URL ? "Geconfigureerd" : "Niet geconfigureerd"}</p>
                            <p>Zoekparameter: search={searchQuery}</p>
                            <p className="mt-2">
                              Als u verwacht dat dit product beschikbaar zou moeten zijn, neem dan contact op met de
                              beheerder.
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Animation keyframes */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
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
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-in-out;
        }
      `}</style>
    </>
  )
}
