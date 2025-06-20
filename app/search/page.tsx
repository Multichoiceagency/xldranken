"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, LogIn } from "lucide-react"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import type { ProductProps } from "@/types/product"
import { useCart } from "@/lib/cart-context"
import { useAuthContext } from "@/context/AuthContext"

// Helper function to transform raw API product data (same as in lib/api.ts)
function transformApiProduct(apiProduct: any): ProductProps {
  const prixVenteNum = Number(apiProduct.prix_vente_groupe || 0)
  const prixPromoNum =
    apiProduct.prix_en_promo && !isNaN(Number(apiProduct.prix_en_promo)) ? Number(apiProduct.prix_en_promo) : null

  let currentPrice = prixVenteNum
  if (prixPromoNum !== null && prixPromoNum < prixVenteNum) {
    currentPrice = prixPromoNum
  }

  let arcleunikValue = apiProduct.arcleunik
  if (arcleunikValue === null || arcleunikValue === undefined || String(arcleunikValue).trim() === "") {
    console.warn(
      `Search result product with title "${apiProduct.title || "Unknown"}" (productCode: ${
        apiProduct.productCode || "N/A"
      }) missing 'arcleunik'. Assigning random key.`,
    )
    arcleunikValue = `search_random_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  } else {
    arcleunikValue = String(arcleunikValue)
  }

  return {
    arcleunik: arcleunikValue,
    id: apiProduct.id ? String(apiProduct.id) : undefined,
    sku: apiProduct.sku ? String(apiProduct.sku) : undefined,
    title: apiProduct.title || apiProduct.megatech_Titre_lib_web_nl || "Product",
    productCode: apiProduct.code_article || apiProduct.arcleunik || "",
    fam1ID: apiProduct.fam1ID || "",
    fam2ID: apiProduct.fam2ID || apiProduct.fam2id || "",
    prix_vente_groupe: apiProduct.prix_vente_groupe,
    prix_en_promo: apiProduct.prix_en_promo,
    price: currentPrice, // This is the calculated current price
    photo1_base64: apiProduct.photo1_base64,
  }
}

function SearchPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""
  const [searchResults, setSearchResults] = useState<ProductProps[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [localSearchQuery, setLocalSearchQuery] = useState(query)
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(query)
  const { addToCart, isInCart } = useCart()
  const { isLoggedIn, loading: authLoading } = useAuthContext()

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
          console.log("Search API Response:", data.result?.product?.[0]) // Log the first product for debugging

          // Transform API response using our standardized function
          const transformedResults = (data.result?.product || []).map((item: any) => {
            // Debug log the raw API item to see available price fields
            console.log("Raw search API item:", {
              arcleunik: item.arcleunik,
              title: item.title,
              prix_vente_groupe: item.prix_vente_groupe,
              prix_en_promo: item.prix_en_promo,
              prix_promo_ttc: item.prix_promo_ttc,
              prix_vente_ttc: item.prix_vente_ttc,
              prix_public: item.prix_public,
              prix_achat: item.prix_achat,
            })

            return transformApiProduct(item)
          })

          console.log(`Search transformed ${transformedResults.length} products`)
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

  const handleLoginRedirect = () => {
    router.push("/login")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Authentication status banner */}
      {!authLoading && !isLoggedIn && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <LogIn className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-blue-800 font-medium">Log in voor prijzen en bestellen</p>
                <p className="text-blue-600 text-sm">
                  Meld je aan om prijzen te zien en producten toe te voegen aan je winkelwagen
                </p>
              </div>
            </div>
            <Button onClick={handleLoginRedirect} className="bg-blue-600 hover:bg-blue-700 text-white">
              Inloggen
            </Button>
          </div>
        </div>
      )}

      {/* Search header with input field for updating search */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Zoekresultaten</h1>
          {!authLoading && isLoggedIn && (
            <div className="text-sm text-green-600 font-medium">✓ Ingelogd - Prijzen zichtbaar</div>
          )}
        </div>

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
      {(isLoading || authLoading) && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BEA46A]"></div>
        </div>
      )}

      {/* No results */}
      {!isLoading && !authLoading && searchResults.length === 0 && debouncedSearchQuery && (
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
      {!isLoading && !authLoading && searchResults.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600">{searchResults.length} producten gevonden</p>
            {!isLoggedIn && <p className="text-sm text-gray-500 italic">Log in om prijzen te zien en te bestellen</p>}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchResults.map((product) => (
              <ProductCard key={product.arcleunik} product={product} />
            ))}
          </div>
        </>
      )}

      {/* Empty state - no query */}
      {!isLoading && !authLoading && !debouncedSearchQuery && (
        <div className="text-center py-12">
          <div className="bg-gray-100 inline-block p-6 rounded-full mb-4">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Begin met zoeken</h2>
          <p className="text-gray-600 mb-6">
            Voer een zoekopdracht in om producten te vinden
            {!isLoggedIn && (
              <span className="block mt-2 text-sm text-blue-600">
                Log in om prijzen te zien en producten te bestellen
              </span>
            )}
          </p>

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

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BEA46A]"></div>
          </div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  )
}
