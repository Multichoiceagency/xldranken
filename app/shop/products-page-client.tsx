"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faThLarge, faTh } from "@fortawesome/free-solid-svg-icons"
import ProductCard from "@/components/product-card"
import type { ProductProps } from "@/types/product"
import { Spinner } from "@/components/ui/spinner"

type ProductsPageClientProps = {
  initialProducts: ProductProps[]
}

export default function ProductsPageClient({ initialProducts }: ProductsPageClientProps) {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<ProductProps[]>(initialProducts)
  const [visibleProducts, setVisibleProducts] = useState<ProductProps[]>([])
  const [gridView, setGridView] = useState<"grid2" | "grid4">("grid4")
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  // Number of products to load at once
  const productsPerLoad = 12

  // Reference to the loading element
  const observer = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement>(null)

  // Initialize grid view from URL
  useEffect(() => {
    const view = searchParams.get("view") as "grid2" | "grid4" | null
    if (view) setGridView(view)
  }, [searchParams])

  // Initialize visible products
  useEffect(() => {
    setVisibleProducts(products.slice(0, productsPerLoad))
    setHasMore(products.length > productsPerLoad)
  }, [products])

  // Load more products when scrolling
  const loadMoreProducts = useCallback(() => {
    if (isLoading) return

    setIsLoading(true)

    // Simulate loading delay
    setTimeout(() => {
      const currentLength = visibleProducts.length
      const nextProducts = products.slice(currentLength, currentLength + productsPerLoad)

      if (nextProducts.length > 0) {
        setVisibleProducts((prev) => [...prev, ...nextProducts])
        setHasMore(currentLength + nextProducts.length < products.length)
      } else {
        setHasMore(false)
      }

      setIsLoading(false)
    }, 500) // Simulate network delay
  }, [isLoading, products, visibleProducts])

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    if (loadingRef.current) {
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMoreProducts()
          }
        },
        { threshold: 1.0 },
      )

      observer.current.observe(loadingRef.current)
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [loadMoreProducts, hasMore])

  const createURL = (key: string, value: string | number) => {
    const params = new URLSearchParams(searchParams)
    params.set(key, value.toString())
    return `/products?${params.toString()}`
  }

  return (
    <>
      {/* Product count and filters */}
      <div className="mb-6">
        <p className="text-gray-600">
          Totaal aantal producten: <span className="font-semibold">{products.length}</span>
        </p>
      </div>

      {/* Grid View Toggle */}
      <div className="flex items-center justify-end border-b pb-4 mb-6">
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
        {visibleProducts.length > 0 ? (
          visibleProducts.map((product) => <ProductCard key={product.id_product_mysql} product={product} />)
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-lg font-medium">Geen producten gevonden</p>
          </div>
        )}
      </div>

      {/* Loading indicator for infinite scroll */}
      {(hasMore || isLoading) && (
        <div ref={loadingRef} className="flex justify-center items-center py-8 mt-4">
          <Spinner size="medium" className="text-[#E2B505] mr-3" />
          <span className="text-gray-600">Meer producten laden...</span>
        </div>
      )}

      {/* End of products message */}
      {!hasMore && visibleProducts.length > 0 && (
        <div className="text-center py-8 text-gray-500">U heeft alle producten bekeken</div>
      )}
    </>
  )
}

