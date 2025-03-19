'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faThLarge, faTh } from "@fortawesome/free-solid-svg-icons"
import ProductCard from "@/components/product-card"
import type { ProductProps } from "@/types/product"

type AlcoholPageClientProps = {
  initialProducts: ProductProps[]
}

export default function AlcoholPageClient({ initialProducts }: AlcoholPageClientProps) {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState(initialProducts)
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage, setProductsPerPage] = useState(24)
  const [gridView, setGridView] = useState<'grid2' | 'grid4'>('grid4')

  useEffect(() => {
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 24
    const view = searchParams.get('view') as 'grid2' | 'grid4' | null

    setCurrentPage(page)
    setProductsPerPage(limit)
    if (view) setGridView(view)
  }, [searchParams])

  const totalPages = Math.ceil(products.length / productsPerPage)
  const paginatedProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  )

  const createURL = (key: string, value: string | number) => {
    const params = new URLSearchParams(searchParams)
    params.set(key, value.toString())
    return `/alcohol?${params.toString()}`
  }

  return (
    <>
      {/* Show per page & Grid View Controls */}
      <div className="flex items-center justify-between border-b pb-4 mb-6">
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
      <div className={`grid gap-6 ${gridView === "grid2" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"}`}>
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => <ProductCard key={product.id_product_mysql} product={product} />)
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
            className="px-4 py-2 bg-[#E2B505] text-white font-semibold hover:text-black rounded"
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
            className="px-4 py-2 bg-[#E2B505] text-white font-semibold hover:text-black rounded"
          >
            Volgende
          </Link>
        )}
      </div>
    </>
  )
}
