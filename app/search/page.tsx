"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search } from "lucide-react"
import ProductCard from "@/components/product-card"
import type { ProductProps } from "@/types/product"
import { useCart } from "@/lib/cart-context" // Assuming this exists

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""
  const [searchResults, setSearchResults] = useState<ProductProps[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [localSearchQuery, setLocalSearchQuery] = useState(query)
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(query)
  const { addToCart, isInCart } = useCart()

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
    const fetchSearchResults = async () => {
      setIsLoading(true)

      try {
        if (debouncedSearchQuery) {
          const response = await fetch(
            `https://api.megawin.be/product/list/?apikey=YIwYR3LZbNXllabpGviSnXBHvtqfPAIN&id_membre=1&rechercher_mot_cle=${encodeURIComponent(debouncedSearchQuery)}`,
          )

          const data = await response.json()
          console.log("API Response:", data.result?.product?.[0]) // Log the first product for debugging

          // Transform API response to match ProductProps
          const transformedResults = (data.result?.product || []).map((item: any) => ({
            arcleunik: item.arcleunik,
            title: item.title || item.megatech_Titre_lib_web_nl || "Product",
            photo1_base64: item.photo1_base64 || "", // Use photo1_base64 directly instead of image_url
            prix_vente_groupe: item.prix_promo_ttc || item.prix_vente_ttc || 0,
            productCode: item.code_article || item.arcleunik,
            // Add any other required fields for ProductProps
          }))

          setSearchResults(transformedResults)
        } else {
          setSearchResults([])
        }
      } catch (error) {
        console.error("Error fetching search results:", error)
        setSearchResults([])
      } finally {
        setIsLoading(false)
      }
    }

    // Use a small timeout to prevent API calls while typing
    const timer = setTimeout(() => {
      fetchSearchResults()
    }, 300)

    return () => clearTimeout(timer)
  }, [debouncedSearchQuery])

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchResults.map((product) => (
              <ProductCard key={product.arcleunik} product={product} />
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
