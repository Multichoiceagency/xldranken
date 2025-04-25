"use client"

import { useState, useEffect, useRef, useCallback, type JSX } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faThLarge, faTh, faSpinner } from "@fortawesome/free-solid-svg-icons"
import ProductCard from "@/components/product-card"
import { fetchMoreProducts } from "@/actions/product-actions"
import type { ProductProps } from "@/types/product"

type SterkeDrankenPageClientProps = {
  initialProducts: ProductProps[]
  categoryId: string
}

export default function SterkeDrankenPageClient({
  initialProducts,
  categoryId,
}: SterkeDrankenPageClientProps): JSX.Element {
  const searchParams = useSearchParams()
  const [displayedProducts, setDisplayedProducts] = useState<ProductProps[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [gridView, setGridView] = useState<"grid2" | "grid4">("grid4")
  const [currentBatch, setCurrentBatch] = useState<number>(1)
  const [totalLoaded, setTotalLoaded] = useState<number>(0)
  const [totalAvailable, setTotalAvailable] = useState<number>(300) // Estimate of total products
  const loadingRef = useRef<boolean>(false) // Ref to track loading state across renders

  // Reference for intersection observer
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Set products per batch to 48 as requested
  const PRODUCTS_PER_BATCH = 48

  // Initialize with search params and products
  useEffect(() => {
    const view = searchParams.get("view") as "grid2" | "grid4" | null
    if (view) setGridView(view)

    // Filter out any duplicate products by arcleunik before setting state
    const uniqueProducts = filterDuplicateProducts(initialProducts)

    // Display initial products
    setDisplayedProducts(uniqueProducts)
    setTotalLoaded(uniqueProducts.length)
    setCurrentBatch(1)

    // Always has more initially (unless we got fewer products than expected)
    setHasMore(uniqueProducts.length >= PRODUCTS_PER_BATCH)

    console.log(`Initial display: ${uniqueProducts.length} products (first batch)`)
  }, [initialProducts, searchParams])

  // Helper function to filter out duplicate products by arcleunik
  const filterDuplicateProducts = (products: ProductProps[]): ProductProps[] => {
    const uniqueProductMap = new Map<string, ProductProps>()

    products.forEach((product) => {
      // Only add the product if it's not already in the map
      // or if it's a better version of the same product (e.g., has more data)
      if (
        !uniqueProductMap.has(product.arcleunik) ||
        (product.photo1_base64 && !uniqueProductMap.get(product.arcleunik)?.photo1_base64)
      ) {
        uniqueProductMap.set(product.arcleunik, product)
      }
    })

    return Array.from(uniqueProductMap.values())
  }

  // Debounced load function to prevent multiple rapid calls
  const loadMoreProducts = useCallback(async (): Promise<void> => {
    // Use ref to prevent multiple concurrent loads
    if (loadingRef.current || !hasMore) return

    // Set both the state and ref for loading
    setLoading(true)
    loadingRef.current = true

    console.log("Loading more products in batch...")

    try {
      // Calculate the next batch number
      const nextBatch = currentBatch + 1
      console.log(`Fetching batch ${nextBatch} with size ${PRODUCTS_PER_BATCH}`)

      // Fetch the next batch of products
      const newProducts = await fetchMoreProducts(categoryId, nextBatch, PRODUCTS_PER_BATCH)

      console.log(`Received ${newProducts.length} new products`)

      // If we received fewer products than the batch size, we've reached the end
      if (newProducts.length < PRODUCTS_PER_BATCH) {
        setHasMore(false)
        console.log("No more products to load")
      }

      // Create a Set of existing product IDs to check for duplicates
      const existingIds = new Set(displayedProducts.map((p) => p.arcleunik))

      // Filter out any duplicates from the new products
      const uniqueNewProducts = newProducts.filter((product) => !existingIds.has(product.arcleunik))

      console.log(`After filtering duplicates: ${uniqueNewProducts.length} unique new products`)

      // Add the new products to the displayed products
      setDisplayedProducts((prev) => [...prev, ...uniqueNewProducts])
      setCurrentBatch(nextBatch)
      setTotalLoaded((prev) => prev + uniqueNewProducts.length)
    } catch (error) {
      console.error("Error loading more products:", error)
    } finally {
      // Clear both the state and ref for loading
      setLoading(false)

      // Add a small delay before allowing another load
      // This prevents rapid consecutive loads
      setTimeout(() => {
        loadingRef.current = false
      }, 500)
    }
  }, [categoryId, currentBatch, displayedProducts, hasMore, PRODUCTS_PER_BATCH])

  // Setup intersection observer for the load more trigger element
  // instead of the last product
  useEffect(() => {
    // Don't set up observer if we're already loading or there are no more products
    if (loading || !hasMore) return

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // Create new observer that triggers when the load more trigger is visible
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && hasMore && !loadingRef.current) {
          loadMoreProducts()
        }
      },
      {
        rootMargin: "300px", // Start loading when 300px from viewport
        threshold: 0.1,
      },
    )

    // Observe the load more trigger element
    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    // Clean up on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, loading, loadMoreProducts])

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
              Weergegeven: {displayedProducts.length} van ongeveer {totalAvailable} producten
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
          {displayedProducts.map((product, index) => {
            // Create a truly unique key by combining arcleunik with index
            const uniqueKey = `${product.arcleunik}-${index}`
            return <ProductCard key={uniqueKey} product={product} />
          })}
        </div>
      ) : (
        <div className="col-span-full text-center py-10">
          <p className="text-lg font-medium">Geen producten gevonden</p>
        </div>
      )}

      {/* Load More Trigger - this is what the intersection observer watches */}
      <div ref={loadMoreRef} className="h-10 mt-8 mb-4" aria-hidden="true" />

      {/* Loading indicator at bottom */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <FontAwesomeIcon icon={faSpinner} spin className="text-[#E2B505] text-xl mr-2" />
          <p className="text-gray-500">Meer producten laden...</p>
        </div>
      )}

      {/* Load More Button (as fallback) */}
      {hasMore && !loading && (
        <div className="flex justify-center mt-4 mb-8">
          <button
            onClick={loadMoreProducts}
            className="px-6 py-3 bg-[#E2B505] text-white font-medium rounded-md hover:bg-[#c9a204] transition-colors"
          >
            Laad meer producten
          </button>
        </div>
      )}

      {/* End of products message */}
      {!hasMore && !loading && displayedProducts.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Alle {displayedProducts.length} producten zijn geladen</p>
        </div>
      )}
    </>
  )
}
