"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Search } from "lucide-react"
import { useCart } from "@/lib/cart-context" // Assuming this exists

// Mock product data - replace with actual API call in production
const mockProducts = [
  {
    id: 1,
    name: "Heineken Pilsener",
    price: 17.99,
    image: "/amber-beer-bottle.png",
    category: "Bier",
    description: "Krat met 24 flesjes Heineken Pilsener (0,3L)",
  },
  {
    id: 2,
    name: "Grolsch Premium Pilsner",
    price: 18.49,
    image: "/grolsch-bottle.png",
    category: "Bier",
    description: "Krat met 16 beugelflesjes Grolsch (0,45L)",
  },
  {
    id: 3,
    name: "Chardonnay Reserva",
    price: 9.95,
    image: "/white-wine-bottle.png",
    category: "Wijn",
    description: "Chileense witte wijn, volle smaak met hints van tropisch fruit",
  },
  {
    id: 4,
    name: "Coca-Cola Regular",
    price: 14.99,
    image: "/vintage-coca-cola-bottles.png",
    category: "Frisdrank",
    description: "Tray met 24 flesjes Coca-Cola (0,33L)",
  },
  {
    id: 5,
    name: "Johnnie Walker Black Label",
    price: 29.95,
    image: "/whisky-bottle.png",
    category: "Sterke Drank",
    description: "Schotse blended whisky, 12 jaar gerijpt (0,7L)",
  },
  {
    id: 6,
    name: "Bacardi Carta Blanca",
    price: 19.95,
    image: "/aged-rum-bottle.png",
    category: "Sterke Drank",
    description: "Witte rum, perfect voor cocktails (1L)",
  },
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""
  const [searchResults, setSearchResults] = useState<typeof mockProducts>([])
  const [isLoading, setIsLoading] = useState(true)
  const [localSearchQuery, setLocalSearchQuery] = useState(query)
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(query)
  const { addToCart } = useCart?.() || { addToCart: () => {} }

  // Update local search query when URL query changes
  useEffect(() => {
    setLocalSearchQuery(query)
  }, [query])

  // Debounce search input to prevent frequent URL updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(localSearchQuery)

      // Only update URL if the search query has actually changed
      if (localSearchQuery !== query) {
        // Use replaceState to avoid adding to browser history
        const newUrl = localSearchQuery ? `/search?q=${encodeURIComponent(localSearchQuery)}` : "/search"

        window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, "", newUrl)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [localSearchQuery, query, router])

  // Fetch search results based on debounced query
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      if (debouncedSearchQuery) {
        const filteredProducts = mockProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
        )
        setSearchResults(filteredProducts)
      } else {
        setSearchResults([])
      }
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [debouncedSearchQuery])

  // Handle adding product to cart without page refresh
  const handleAddToCart = useCallback(
    (product: any, e: React.MouseEvent) => {
      e.preventDefault()
      addToCart(product)

      // Show a temporary success message
      const button = e.currentTarget as HTMLButtonElement
      const originalText = button.innerText
      button.innerText = "Toegevoegd ✓"
      button.disabled = true

      setTimeout(() => {
        button.innerText = originalText
        button.disabled = false
      }, 1500)
    },
    [addToCart],
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search header with input field for updating search */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Zoekresultaten</h1>
        <div className="flex items-stretch mb-4">
          <div className="bg-[#BEA46A] text-white px-3 py-2 rounded-l-md flex items-center">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            placeholder="Zoek naar producten..."
            className="flex-1 px-4 py-2 border-y border-r border-gray-300 rounded-r-md focus:outline-none focus:ring-1 focus:ring-[#BEA46A]"
          />
        </div>
        {debouncedSearchQuery && (
          <p className="text-gray-600">
            Resultaten voor: <span className="text-[#BEA46A] font-medium">&quot;{debouncedSearchQuery}&quot;</span>
          </p>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BEA46A]"></div>
        </div>
      )}

      {/* No results */}
      {!isLoading && searchResults.length === 0 && debouncedSearchQuery && (
        <div className="text-center py-12">
          <div className="bg-gray-100 inline-block p-6 rounded-full mb-4">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Geen resultaten gevonden</h2>
          <p className="text-gray-600 mb-6">
            We konden geen producten vinden die overeenkomen met &quot;{debouncedSearchQuery}&quot;
          </p>
          <div className="max-w-md mx-auto">
            <h3 className="font-semibold mb-2 text-left">Suggesties:</h3>
            <ul className="text-left list-disc pl-5 space-y-1">
              <li>Controleer de spelling van je zoekopdracht</li>
              <li>Gebruik minder of andere zoekwoorden</li>
              <li>Zoek op een algemenere term</li>
            </ul>
          </div>
        </div>
      )}

      {/* Search results */}
      {!isLoading && searchResults.length > 0 && (
        <>
          <p className="mb-4 text-gray-600">{searchResults.length} producten gevonden</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map((product) => (
              <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/product/${product.id}`} className="block">
                  <div className="aspect-square relative bg-gray-50">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-[#BEA46A] font-medium mb-1">{product.category}</div>
                    <h3 className="font-semibold mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                    <div className="text-xl font-bold">€{product.price.toFixed(2)}</div>
                  </div>
                </Link>
                <div className="px-4 pb-4">
                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(product, e)}
                    className="w-full bg-[#BEA46A] hover:bg-[#a89055] text-white py-2 rounded-md transition-colors"
                  >
                    In winkelwagen
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty state - no query */}
      {!isLoading && !debouncedSearchQuery && (
        <div className="text-center py-12">
          <div className="bg-gray-100 inline-block p-6 rounded-full mb-4">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Begin met zoeken</h2>
          <p className="text-gray-600 mb-6">Voer een zoekopdracht in om producten te vinden</p>
          <div className="max-w-md mx-auto">
            <h3 className="font-semibold mb-2 text-left">Populaire categorieën:</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setLocalSearchQuery("bier")}
                className="px-4 py-2 bg-gray-100 hover:bg-[#BEA46A] hover:text-white rounded-full transition-colors"
              >
                Bier
              </button>
              <button
                onClick={() => setLocalSearchQuery("wijn")}
                className="px-4 py-2 bg-gray-100 hover:bg-[#BEA46A] hover:text-white rounded-full transition-colors"
              >
                Wijn
              </button>
              <button
                onClick={() => setLocalSearchQuery("sterke")}
                className="px-4 py-2 bg-gray-100 hover:bg-[#BEA46A] hover:text-white rounded-full transition-colors"
              >
                Sterke Drank
              </button>
              <button
                onClick={() => setLocalSearchQuery("frisdrank")}
                className="px-4 py-2 bg-gray-100 hover:bg-[#BEA46A] hover:text-white rounded-full transition-colors"
              >
                Frisdrank
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
