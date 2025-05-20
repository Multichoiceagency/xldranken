"use client"

import { useMemo, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import type { ProductProps } from "@/types/product"
import ProductCard from "./product-card"
import Link from "next/link"
import { Spinner } from "@/components/ui/spinner"

interface Props {
  initialProducts: ProductProps[]
  basePath: string
}

export default function ProductsGridClient({ initialProducts, basePath }: Props) {
  const searchParams = useSearchParams()

  // Memoize URLSearchParams to avoid re-renders
  const query = useMemo(() => {
    return new URLSearchParams(searchParams?.toString())
  }, [searchParams])

  const productsPerPage = Number(query.get("limit")) || 20
  const currentPage = Number(query.get("page")) || 1
  const gridView = query.get("view") || "grid4"

  const totalPages = Math.max(1, Math.ceil(initialProducts.length / productsPerPage))

  const [paginatedProducts, setPaginatedProducts] = useState<ProductProps[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const timeout = setTimeout(() => {
      const start = (currentPage - 1) * productsPerPage
      setPaginatedProducts(initialProducts.slice(start, start + productsPerPage))
      setIsLoading(false)
    }, 300) // Simuleer laadtijd
    return () => clearTimeout(timeout)
  }, [initialProducts, currentPage, productsPerPage])

  const createURL = (key: string, value: string | number) => {
    const params = new URLSearchParams(query.toString())
    params.set(key, value.toString())
    if (key === "limit" || key === "view") {
      params.set("page", "1")
    }
    return `${basePath}?${params.toString()}`
  }

  return (
    <>
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between border-b pb-4 mb-6">
        {/* Per page selection */}
        <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
          <span className="font-medium">Aantal per pagina:</span>
          {[8, 12, 20, 28].map((num) => (
            <Link
              key={num}
              href={createURL("limit", num)}
              className={`px-1 sm:px-2 ${productsPerPage === num ? "font-bold text-black" : "text-gray-500"}`}
              scroll={false}
            >
              {num}
            </Link>
          ))}
        </div>
        {/* Grid toggle (optioneel uit te breiden) */}
        <div className="flex space-x-2" />
      </div>

      {/* Product Grid or Spinner */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner size="large" className="text-[#E2B505]" />
        </div>
      ) : (
        <div
          className={`grid gap-2 sm:gap-4 ${
            gridView === "grid2"
              ? "grid-cols-2 sm:grid-cols-2"
              : "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          }`}
        >
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => (
              <ProductCard key={product.arcleunik ?? product.id ?? product.sku} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-lg font-medium">Geen producten gevonden</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 sm:gap-4 mt-6 sm:mt-8">
        {currentPage > 1 && (
          <Link
            href={createURL("page", currentPage - 1)}
            className="px-2 sm:px-4 py-1 sm:py-2 bg-[#E2B505] text-white font-semibold hover:text-black rounded text-xs sm:text-sm"
            scroll={false}
          >
            Vorige
          </Link>
        )}
        <span className="font-medium text-xs sm:text-sm">
          Pagina {currentPage} van {totalPages}
        </span>
        {currentPage < totalPages && (
          <Link
            href={createURL("page", currentPage + 1)}
            className="px-2 sm:px-4 py-1 sm:py-2 bg-[#E2B505] text-white font-semibold hover:text-black rounded text-xs sm:text-sm"
            scroll={false}
          >
            Volgende
          </Link>
        )}
      </div>
    </>
  )
}
