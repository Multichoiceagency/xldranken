"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import type { ProductProps } from "@/types/product"
import { getProductsByFam2ID } from "@/lib/api"

interface ProductGridProps {
  fam2ID?: string
  initialPage?: number
  productsPerPage?: number
  totalProductsCount?: number
}

export function ProductGrid({
  fam2ID = "6",
  initialPage = 1,
  productsPerPage = 20,
  totalProductsCount = 100,
}: ProductGridProps) {
  const [products, setProducts] = React.useState<ProductProps[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [currentPage, setCurrentPage] = React.useState(initialPage)

  const totalPages = Math.max(1, Math.ceil(totalProductsCount / productsPerPage))

  // Fetch products function
  const fetchProducts = React.useCallback(
    async (page: number) => {
      try {
        setLoading(true)
        setError(null)

        console.log(`Fetching products for fam2ID: ${fam2ID}, page: ${page}, limit: ${productsPerPage}`)

        const newProducts = await getProductsByFam2ID(fam2ID, productsPerPage, page)

        console.log(`Received ${newProducts.length} products for page ${page}`)
        console.log(`First product on page ${page}:`, newProducts[0]?.title)

        setProducts(newProducts)
      } catch (err) {
        console.error("Error fetching products:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch products")
      } finally {
        setLoading(false)
      }
    },
    [fam2ID, productsPerPage],
  )

  // Initial load and when fam2ID changes
  React.useEffect(() => {
    setCurrentPage(initialPage)
    fetchProducts(initialPage)
  }, [fam2ID, fetchProducts, initialPage])

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage)
      fetchProducts(newPage)
    }
  }

  // Loading state for initial load
  if (loading && products.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        <p className="text-gray-600">Aan het laden...</p>
      </div>
    )
  }

  // Error state
  if (error && products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <Button onClick={() => fetchProducts(currentPage)} variant="outline">
          Probeer opnieuw
        </Button>
      </div>
    )
  }

  // No products found
  if (!loading && products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Geen producten gevonden voor deze categorie.</p>
        <Button onClick={() => fetchProducts(currentPage)} variant="outline">
          Ververs
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Producten</h2>
          <p className="text-sm text-gray-500 mt-1">
            {products.length} product{products.length !== 1 ? "en" : ""} op pagina {currentPage}
          </p>
        </div>
      </div>

      {/* Grid layout */}
      {loading ? (
        <div className="flex justify-center items-center py-20 min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {products.map((product, index) => (
            <ProductCard key={`${product.arcleunik}-${currentPage}-${index}`} product={product} />
          ))}
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && !loading && products.length > 0 && (
        <div className="flex justify-center items-center gap-2 sm:gap-4 mt-6 sm:mt-8">
          {currentPage > 1 && (
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              variant="outline"
              className="px-2 sm:px-4 py-1 sm:py-2 bg-[#E2B505] text-white font-semibold hover:bg-[#E2B505]/90 border-[#E2B505] text-xs sm:text-sm"
            >
              Vorige
            </Button>
          )}
          <span className="font-medium text-xs sm:text-sm text-gray-700">
            Pagina {currentPage} van {totalPages}
          </span>
          {currentPage < totalPages && (
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              variant="outline"
              className="px-2 sm:px-4 py-1 sm:py-2 bg-[#E2B505] text-white font-semibold hover:bg-[#E2B505]/90 border-[#E2B505] text-xs sm:text-sm"
            >
              Volgende
            </Button>
          )}
        </div>
      )}

      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-8 p-4 bg-gray-100 rounded text-sm">
          <p>
            <strong>Debug Info:</strong>
          </p>
          <p>fam2ID: {fam2ID}</p>
          <p>
            Current Page: {currentPage}/{totalPages}
          </p>
          <p>Products on Page: {products.length}</p>
          <p>Products Per Page: {productsPerPage}</p>
          <p>Total Products: {totalProductsCount}</p>
          <p>Loading: {loading ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  )
}

export default ProductGrid
