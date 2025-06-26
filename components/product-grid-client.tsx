"use client"

import { useMemo, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import type { ProductProps } from "@/types/product"
import ProductCard from "./product-card"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faThLarge, faTh } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"

interface Props {
  initialProducts: ProductProps[]
  fam2id: string
  basePath: string
  initialLimit: number
  totalProductsCount: number
}

export default function ProductsGridClient({ initialProducts, basePath }: Props) {
  const searchParams = useSearchParams()
  const query = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams])

  const productsPerPage = Number(query.get("limit")) || 20
  const currentPage = Number(query.get("page")) || 1
  const gridView = query.get("view") || "grid4"

  const [isLoading, setIsLoading] = useState(false)

  const totalPages = Math.ceil(initialProducts.length / productsPerPage)

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * productsPerPage
    return initialProducts.slice(start, start + productsPerPage)
  }, [initialProducts, currentPage, productsPerPage])

  // Handle scroll reset and loading state
  useEffect(() => {
    // Reset scroll position when search params change
    window.scrollTo({ top: 0, behavior: "smooth" })

    // Reset loading state after a short delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchParams])

  const createURL = (key: string, value: string | number) => {
    const params = new URLSearchParams(query.toString())
    params.set(key, value.toString())

    // Reset page when changing limit or view
    if (key === "limit" || key === "view") {
      params.set("page", "1")
    }

    return `${basePath}?${params.toString()}`
  }

  const handlePaginationClick = () => {
    setIsLoading(true)
  }

  return (
    <div className="relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#E2B505] border-solid"></div>
            <p className="text-gray-600 font-medium">De producten worden ingeladen...</p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        {/* Per page selection */}
        <div className="flex items-center space-x-2 text-sm">
          <span className="font-medium">Aantal producten per pagina:</span>
          {[8, 12, 20, 28].map((num) => (
            <Link
              key={num}
              href={createURL("limit", num)}
              className={`px-2 ${productsPerPage === num ? "font-bold text-black" : "text-gray-500"}`}
            >
              {num}
            </Link>
          ))}
        </div>

        {/* Grid toggle */}
        <div className="flex space-x-2">
          <Link
            href={createURL("view", "grid2")}
            className={`p-2 rounded ${gridView === "grid2" ? "bg-gray-300" : "bg-gray-100"}`}
            aria-label="2-kolommen weergave"
          >
            <FontAwesomeIcon icon={faThLarge} />
          </Link>
          <Link
            href={createURL("view", "grid4")}
            className={`p-2 rounded ${gridView === "grid4" ? "bg-gray-300" : "bg-gray-100"}`}
            aria-label="4-kolommen weergave"
          >
            <FontAwesomeIcon icon={faTh} />
          </Link>
        </div>
      </div>

      {/* Product Grid */}
      <div
        className={`grid gap-6 ${
          gridView === "grid2"
            ? "grid-cols-1 sm:grid-cols-2"
            : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        }`}
      >
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => <ProductCard key={product.arcleunik} product={product} />)
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-lg font-medium">Geen producten gevonden</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
        {currentPage > 1 && (
          <Link
            href={createURL("page", currentPage - 1)}
            onClick={handlePaginationClick}
            className="px-4 py-2 bg-[#E2B505] text-white font-semibold hover:text-black rounded transition-colors"
          >
            Vorige
          </Link>
        )}
        <span className="font-medium">
          Pagina {currentPage} van {totalPages}
        </span>
        {currentPage < totalPages && (
          <Link
            href={createURL("page", currentPage + 1)}
            onClick={handlePaginationClick}
            className="px-4 py-2 bg-[#E2B505] text-white font-semibold hover:text-black rounded transition-colors"
          >
            Volgende
          </Link>
        )}
      </div>
    </div>
  )
}
