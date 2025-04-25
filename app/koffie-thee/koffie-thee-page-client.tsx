"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faThLarge, faTh } from "@fortawesome/free-solid-svg-icons"
import ProductCard from "@/components/product-card"
import type { ProductProps } from "@/types/product"

type KoffieTheePageClientProps = {
  initialProducts: ProductProps[]
}

export default function KoffieTheePageClient({ initialProducts }: KoffieTheePageClientProps) {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<ProductProps[]>([])
  const [displayedProducts, setDisplayedProducts] = useState<ProductProps[]>([])
  const [productsPerPage, setProductsPerPage] = useState(24)
  const [gridView, setGridView] = useState<"grid2" | "grid4">("grid4")
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  // Initialize with search params and products
  useEffect(() => {
    const view = searchParams.get("view") as "grid2" | "grid4" | null
    const limit = Number(searchParams.get("limit")) || 24

    if (view) setGridView(view)
    if (limit) setProductsPerPage(limit)

    // Store all products
    setProducts(initialProducts)

    // Reset pagination when initialProducts change
    setPage(1)

    // Initialize with first batch of products
    const initialDisplayed = initialProducts.slice(0, limit)
    setDisplayedProducts(initialDisplayed)

    // Set hasMore based on whether there are more products than what's initially displayed
    setHasMore(initialProducts.length > initialDisplayed.length)
  }, [initialProducts, searchParams])

  // Function to load more products
  const loadMoreProducts = useCallback(() => {
    if (!hasMore || loading) return

    setLoading(true)

    // Calculate next batch of products
    const nextPage = page + 1
    const startIndex = displayedProducts.length
    const endIndex = startIndex + productsPerPage
    const newProducts = products.slice(startIndex, endIndex)

    // Short timeout to prevent UI freezing
    setTimeout(() => {
      if (newProducts.length > 0) {
        setDisplayedProducts((prev) => [...prev, ...newProducts])
        setPage(nextPage)

        // Check if we have more products to load
        setHasMore(endIndex < products.length)
      } else {
        setHasMore(false)
      }

      setLoading(false)
    }, 100)
  }, [hasMore, loading, page, products, productsPerPage, displayedProducts.length])

  // Final check to ensure all products are loaded
  useEffect(() => {
    // If we think we're done but the counts don't match, load any remaining products
    if (!hasMore && !loading && displayedProducts.length < products.length) {
      // Load all remaining products at once
      setDisplayedProducts(products)
    }
  }, [hasMore, loading, displayedProducts.length, products])

  // Intersection Observer setup
  const observer = useRef<IntersectionObserver | null>(null)
  const lastProductElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMoreProducts()
          }
        },
        {
          rootMargin: "200px", // Load more before reaching the end
          threshold: 0.1, // Trigger when 10% of the element is visible
        },
      )

      if (node) observer.current.observe(node)
    },
    [loading, hasMore, loadMoreProducts],
  )

  const createURL = (key: string, value: string | number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value.toString())
    return `/KoffieThee?${params.toString()}`
  }

  const handleProductsPerPageChange = (limit: number) => {
    setProductsPerPage(limit)

    // Reset displayed products and page when changing limit
    setDisplayedProducts(products.slice(0, limit))
    setPage(1)
    setHasMore(products.length > limit)
  }

  // Loading skeleton component
  const LoadingSkeleton = () => {
    const skeletonCount = productsPerPage > 8 ? 8 : productsPerPage
    return (
      <div
        className={`grid gap-6 ${
          gridView === "grid2"
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        }`}
      >
        {Array(skeletonCount)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg"></div>
              <div className="mt-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
      </div>
    )
  }

  return (
    <>
      {/* Show per page & Grid View Controls */}
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div className="flex items-center space-x-2 text-sm">
          <span className="font-medium">Aantal producten per pagina:</span>
          {[8, 12, 20, 28].map((num) => (
            <button
              key={num}
              onClick={() => handleProductsPerPageChange(num)}
              className={`px-2 ${productsPerPage === num ? "font-bold text-black" : "text-gray-500"}`}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Grid View Toggle */}
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
      {displayedProducts.length === 0 && loading && <LoadingSkeleton />}

      {/* Product Grid */}
      {displayedProducts.length > 0 && (
        <div
          className={`grid gap-6 ${
            gridView === "grid2"
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          }`}
        >
          {displayedProducts.map((product, index) => {
            // Add ref to last product for intersection observer
            if (displayedProducts.length === index + 1) {
              return (
                <div key={product.arcleunik || index} ref={lastProductElementRef}>
                  <ProductCard product={product} />
                </div>
              )
            } else {
              return <ProductCard key={product.arcleunik || index} product={product} />
            }
          })}
        </div>
      )}

      {/* No products found message */}
      {displayedProducts.length === 0 && !loading && (
        <div className="col-span-full text-center py-10">
          <p className="text-lg font-medium">Geen producten gevonden</p>
        </div>
      )}

      {/* Loading indicator - now using skeleton UI */}
      {loading && displayedProducts.length > 0 && (
        <div className="mt-8">
          <LoadingSkeleton />
        </div>
      )}

      {/* End of products message */}
      {!hasMore && !loading && displayedProducts.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>
            Alle producten zijn geladen ({displayedProducts.length} van {products.length})
          </p>
        </div>
      )}
    </>
  )
}
