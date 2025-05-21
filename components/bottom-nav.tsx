"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, BeerIcon, Search, X } from "lucide-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons"
import { Input } from "@/components/ui/input"

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [isNavVisible, setIsNavVisible] = useState(true)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const lastScrollY = useRef(0)
  const searchRef = useRef<HTMLDivElement>(null)

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

  // Close search when clicking outside
  useEffect(() => {
    if (!showSearch) return

    const listener = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false)
        setShowSearchResults(false)
      }
    }

    document.addEventListener("mousedown", listener)
    return () => document.removeEventListener("mousedown", listener)
  }, [showSearch])

  // Search functionality
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

  // Search submit handler
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`, { scroll: false })
      setShowSearchResults(false)
      setShowSearch(false)
    }
  }

  // Handle navigation to product page from search results
  const handleProductClick = (e: React.MouseEvent, productId: string) => {
    e.preventDefault()
    router.push(`/product/${productId}`, { scroll: false })
    setShowSearchResults(false)
    setShowSearch(false)
  }

  return (
    <>
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
          <button
            onClick={() => setShowSearch(true)}
            className={`flex flex-col items-center ${pathname === "/zoeken" ? "text-[#E2B505]" : "text-[#0F3059]"}`}
          >
            <Search className="h-5 w-5" />
            <span className="text-xs font-medium mt-1">Zoeken</span>
          </button>
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-end justify-center md:hidden">
          <div ref={searchRef} className="bg-white w-full max-h-[70vh] rounded-t-xl p-4 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Zoeken</h3>
              <button
                onClick={() => {
                  setShowSearch(false)
                  setShowSearchResults(false)
                }}
                className="p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 mb-4">
              <Input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Zoek producten..."
                className="flex-1 py-2"
              />
              <button type="submit" className="bg-[#BEA46A] text-white p-2 rounded-md">
                <Search className="w-5 h-5" />
              </button>
            </form>

            {showSearchResults && (
              <div className="overflow-y-auto flex-1">
                {searchResults.length > 0 ? (
                  <>
                    <div className="divide-y">
                      {searchResults.map((product) => (
                        <a
                          key={product.arcleunik}
                          href={`/product/${product.arcleunik}`}
                          onClick={(e) => handleProductClick(e, product.arcleunik)}
                          className="block py-3 text-sm hover:bg-gray-50"
                        >
                          {product.title || product.megatech_Titre_lib_web_nl}
                        </a>
                      ))}
                    </div>
                    <div className="mt-4 border-t pt-4">
                      <Link
                        href={`/search?q=${encodeURIComponent(searchQuery)}`}
                        className="block text-center text-[#BEA46A] hover:underline py-2"
                        onClick={() => {
                          setShowSearchResults(false)
                          setShowSearch(false)
                        }}
                      >
                        Bekijk alle resultaten
                      </Link>
                    </div>
                  </>
                ) : searchQuery.length > 2 ? (
                  <div className="py-8 text-center text-gray-500">Geen resultaten gevonden</div>
                ) : (
                  <div className="py-8 text-center text-gray-500">Typ minimaal 3 tekens om te zoeken</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
