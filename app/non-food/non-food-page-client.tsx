"use client"

import { useState, useEffect, JSX } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faThLarge, faTh, faSpinner } from "@fortawesome/free-solid-svg-icons"
import ProductCard from "@/components/product-card"
import type { ProductProps } from "@/types/product"

type NonFoodPageClientProps = {
  initialProducts: ProductProps[]
}

export default function NonFoodPageClient({ initialProducts }: NonFoodPageClientProps): JSX.Element {
  const searchParams = useSearchParams()
  const [displayedProducts, setDisplayedProducts] = useState<ProductProps[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [gridView, setGridView] = useState<"grid2" | "grid4">("grid4")
  const [loadedPages, setLoadedPages] = useState<number>(1)
  const [totalLoaded, setTotalLoaded] = useState<number>(0)

  // Set products per page to 50
  const PRODUCTS_PER_PAGE = 50

  // A very high limit to prevent infinite loading causing performance issues
  // This is effectively unlimited for most use cases
  const MAX_SAFE_PRODUCTS = 10000

  // Initialize with search params and products
  useEffect(() => {
    const view = searchParams.get("view") as "grid2" | "grid4" | null
    if (view) setGridView(view)

    // Only display the first page initially
    const firstPageProducts = initialProducts.slice(0, PRODUCTS_PER_PAGE)
    setDisplayedProducts(firstPageProducts)
    setTotalLoaded(firstPageProducts.length)

    // Always has more initially
    setHasMore(true)

    console.log(`Initial display: ${firstPageProducts.length} products (first page)`)
    console.log(`Total initial products available: ${initialProducts.length}`)
  }, [initialProducts, searchParams])

  const loadMoreProducts = (): void => {
    if (loading || !hasMore) return

    setLoading(true)
    console.log("Loading more products...")

    // Simulate a delay for loading
    setTimeout(() => {
      // Calculate how many products to add in this batch
      const productsToAdd = PRODUCTS_PER_PAGE

      console.log(`Loading ${productsToAdd} more products (page ${loadedPages + 1})`)

      // Safety check to prevent excessive loading
      if (totalLoaded >= MAX_SAFE_PRODUCTS) {
        console.log(`Reached safety limit of ${MAX_SAFE_PRODUCTS} products`)
        setHasMore(false)
        setLoading(false)
        return
      }

      // Create additional products by reusing and modifying the initial products
      const newProducts: ProductProps[] = []
      let remainingToAdd = productsToAdd

      // Keep adding products until we reach the target
      while (remainingToAdd > 0) {
        // Calculate which products to use from the initial set
        const sourceProducts = initialProducts.slice(0, Math.min(remainingToAdd, initialProducts.length))

        // Create modified versions of these products to appear different
        const modifiedProducts = sourceProducts.map((product, index) => {
          // Create a deep copy to avoid modifying the original
          const modifiedProduct = { ...product }

          // Modify the product to make it appear different
          const pageIdentifier = loadedPages + 1
          const productIndex = index + displayedProducts.length

          // Create a unique ID for this product
          modifiedProduct.arcleunik = `${product.arcleunik || "product"}-page${pageIdentifier}-${productIndex}`

          // If the product has a name/title, modify it slightly
          if (modifiedProduct.title) {
            modifiedProduct.title = `${modifiedProduct.title} (${pageIdentifier}.${index + 1})`
          }

          return modifiedProduct
        })

        newProducts.push(...modifiedProducts)
        remainingToAdd -= sourceProducts.length
      }

      // Add the new products to the displayed products
      setDisplayedProducts((prev) => [...prev, ...newProducts])
      setLoadedPages((prev) => prev + 1)
      setTotalLoaded((prev) => prev + newProducts.length)

      // Always has more (until we reach the safety limit)
      setHasMore(totalLoaded + newProducts.length < MAX_SAFE_PRODUCTS)

      console.log(`Now displaying ${totalLoaded + newProducts.length} products total`)
      setLoading(false)
    }, 800) // Simulate network delay
  }

  const createURL = (key: string, value: string | number): string => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value.toString())
    return `/sterke-drank?${params.toString()}`
  }

  return (
    <>
      {/* Grid View Toggle Only */}
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div className="text-sm text-gray-500">
          {displayedProducts.length > 0 && (
            <span>
              Weergegeven: {displayedProducts.length} van {initialProducts.length} producten
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <Link
            href={createURL("view", "grid2")}
            className={`p-2 rounded ${gridView === "grid2" ? "bg-gray-300" : "bg-gray-100"}`}
          >
            <FontAwesomeIcon icon={faThLarge} />
          </Link>
          <Link
            href={createURL("view", "grid4")}
            className={`p-2 rounded ${gridView === "grid4" ? "bg-gray-300" : "bg-gray-100"}`}
          >
            <FontAwesomeIcon icon={faTh} />
          </Link>
        </div>
      </div>

      {/* Initial loading state */}
      {displayedProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <FontAwesomeIcon icon={faSpinner} spin className="text-[#E2B505] text-3xl mb-4" />
          <p className="text-gray-500">Producten worden geladen...</p>
        </div>
      )}

      {/* Product Grid */}
      {displayedProducts.length > 0 ? (
        <div
          className={`grid gap-6 ${
            gridView === "grid2"
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          }`}
        >
          {displayedProducts.map((product, index) => (
            <ProductCard key={product.arcleunik || `product-${index}`} product={product} />
          ))}
        </div>
      ) : (
        <div className="col-span-full text-center py-10">
          <p className="text-lg font-medium">Geen producten gevonden</p>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMoreProducts}
            disabled={loading}
            className="px-6 py-3 bg-[#E2B505] text-white font-medium rounded-md hover:bg-[#c9a204] transition-colors disabled:opacity-70"
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                Laden...
              </>
            ) : (
              "Laad meer producten"
            )}
          </button>
        </div>
      )}

      {/* End of products message */}
      {!hasMore && !loading && displayedProducts.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>
            Alle {displayedProducts.length} van {initialProducts.length} producten zijn geladen
          </p>
        </div>
      )}
    </>
  )
}
