"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faThLarge, faTh, faSpinner } from "@fortawesome/free-solid-svg-icons"
import ProductCard from "@/components/product-card"
import type { ProductProps } from "@/types/product"

type MixDrankenPageClientProps = {
  initialProducts: ProductProps[]
}

export default function MixDrankenPageClient({ initialProducts }: MixDrankenPageClientProps) {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<ProductProps[]>([])
  const [displayedProducts, setDisplayedProducts] = useState<ProductProps[]>([])
  const [productsPerPage, setProductsPerPage] = useState(24)
  const [gridView, setGridView] = useState<"grid2" | "grid4">("grid4")
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

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
        { threshold: 0.5 },
      )

      if (node) observer.current.observe(node)
    },
    [loading, hasMore],
  )

  // Initialize with search params
  useEffect(() => {
    const view = searchParams.get("view") as "grid2" | "grid4" | null
    const limit = Number(searchParams.get("limit")) || 24

    if (view) setGridView(view)
    setProductsPerPage(limit)
    setProducts(initialProducts)

    // Initialize with first batch of products
    setDisplayedProducts(initialProducts.slice(0, limit))
    setHasMore(initialProducts.length > limit)
  }, [initialProducts, searchParams])

  const loadMoreProducts = () => {
    if (!hasMore || loading) return

    setLoading(true)

    // Simulate a delay to show loading state (remove in production)
    setTimeout(() => {
      const nextPage = page + 1
      const startIndex = (nextPage - 1) * productsPerPage
      const endIndex = nextPage * productsPerPage
      const newProducts = products.slice(startIndex, endIndex)

      if (newProducts.length > 0) {
        setDisplayedProducts((prev) => [...prev, ...newProducts])
        setPage(nextPage)
        setHasMore(endIndex < products.length)
      } else {
        setHasMore(false)
      }

      setLoading(false)
    }, 800)
  }

  const createURL = (key: string, value: string | number) => {
    const params = new URLSearchParams(searchParams)
    params.set(key, value.toString())
    return `/MixDranken?${params.toString()}`
  }

  const handleProductsPerPageChange = (limit: number) => {
    setProductsPerPage(limit)
    // Reset displayed products and page when changing limit
    setDisplayedProducts(products.slice(0, limit))
    setPage(1)
    setHasMore(products.length > limit)
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

      {/* Product Grid */}
      <div
        className={`grid gap-6 ${gridView === "grid2" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"}`}
      >
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product, index) => {
            // Add ref to last product for intersection observer
            if (displayedProducts.length === index + 1) {
              return (
                <div key={product.arcleunik} ref={lastProductElementRef}>
                  <ProductCard product={product} />
                </div>
              )
            } else {
              return <ProductCard key={product.arcleunik} product={product} />
            }
          })
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-lg font-medium">Geen producten gevonden</p>
          </div>
        )}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <FontAwesomeIcon icon={faSpinner} spin className="text-[#E2B505] text-2xl mr-2" />
          <span className="font-medium">Producten laden...</span>
        </div>
      )}

      {/* End of products message */}
      {!hasMore && displayedProducts.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Alle producten zijn geladen</p>
        </div>
      )}
    </>
  )
}

