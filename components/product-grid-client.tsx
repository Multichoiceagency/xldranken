"use client"

import type React from "react"
import { useMemo, useState, useEffect, type ChangeEvent, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import type { ProductProps } from "@/types/product"
import { getProductsByFam2ID } from "@/lib/api"
import ProductCard from "./product-card"
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface Props {
  initialProducts: ProductProps[]
  fam2Id: string
  totalProductsCount: number
  basePath: string
  initialLimit: number
}

function ProductsGridClientContent({ initialProducts, fam2Id, totalProductsCount, basePath, initialLimit }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const query = useMemo(() => {
    return new URLSearchParams(searchParams?.toString())
  }, [searchParams])

  const [displayedProducts, setDisplayedProducts] = useState<ProductProps[]>(initialProducts)
  const [isLoading, setIsLoading] = useState(false)

  const productsPerPage = Number(query.get("limit")) || initialLimit
  const currentPage = Number(query.get("page")) || 1
  const currentSearchTerm = query.get("search") || ""
  const currentSortOrder = query.get("sort") || "default"

  const [searchTermInput, setSearchTermInput] = useState(currentSearchTerm)

  const totalPages = Math.max(1, Math.ceil(totalProductsCount / productsPerPage))

  useEffect(() => {
    const pageFromUrl = Number(query.get("page")) || 1
    const limitFromUrl = Number(query.get("limit")) || initialLimit
    const searchFromUrl = query.get("search") || ""
    const sortFromUrl = query.get("sort") || "default"

    // Update local input if URL search term changes (e.g. browser back/forward)
    setSearchTermInput(searchFromUrl)

    const fetchAndProcessProducts = async () => {
      setIsLoading(true)
      try {
        let fetchedProducts = await getProductsByFam2ID(fam2Id, limitFromUrl, pageFromUrl)

        if (searchFromUrl) {
          fetchedProducts = fetchedProducts.filter((p) => p.title.toLowerCase().includes(searchFromUrl.toLowerCase()))
        }

        if (sortFromUrl === "price-asc") {
          fetchedProducts.sort((a, b) => (a.price ?? 0) - (b.price ?? 0))
        } else if (sortFromUrl === "price-desc") {
          fetchedProducts.sort((a, b) => (b.price ?? 0) - (a.price ?? 0))
        } else if (sortFromUrl === "title-asc") {
          fetchedProducts.sort((a, b) => a.title.localeCompare(b.title))
        } else if (sortFromUrl === "title-desc") {
          fetchedProducts.sort((a, b) => b.title.localeCompare(a.title))
        }

        setDisplayedProducts(fetchedProducts)
      } catch (error) {
        console.error("Failed to fetch or process products:", error)
        setDisplayedProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    // Determine if we need to fetch or just process initialProducts
    const isInitialServerLoad =
      pageFromUrl === 1 && limitFromUrl === initialLimit && searchFromUrl === "" && sortFromUrl === "default"

    if (isInitialServerLoad && displayedProducts === initialProducts) {
      // This is the very first load, initialProducts are from server for page 1, no filters/sorts in URL
      // So, we use initialProducts directly.
      setDisplayedProducts(initialProducts)
      setIsLoading(false)
    } else {
      // Any other case: URL has changed (page, limit, search, sort) or it's not the initial state.
      fetchAndProcessProducts()
    }
  }, [query, fam2Id, initialLimit, initialProducts]) // query includes all relevant params

  const updateUrlParams = (newParams: Record<string, string | number>) => {
    const params = new URLSearchParams(query.toString())
    let resetPage = false
    for (const key in newParams) {
      if (key === "limit" || key === "search" || key === "sort") {
        resetPage = true
      }
      params.set(key, String(newParams[key]))
    }
    if (resetPage) {
      params.set("page", "1")
    }
    router.push(`${basePath}?${params.toString()}`)
  }

  const handleSearchSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault()
    updateUrlParams({ search: searchTermInput })
  }

  const handleSortChange = (value: string) => {
    updateUrlParams({ sort: value })
  }

  return (
    <>
      {/* Controls */}
      <div className="space-y-4 mb-6 pb-4 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="flex-grow sm:max-w-xs">
            <Input
              type="text"
              placeholder="Zoek op titel..."
              value={searchTermInput}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTermInput(e.target.value)}
              className="w-full"
            />
          </form>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-sm font-medium text-gray-700">Sorteer op:</span>
            <Select value={currentSortOrder} onValueChange={handleSortChange}>
              <SelectTrigger className="w-auto sm:w-[180px] text-xs sm:text-sm">
                <SelectValue placeholder="Standaard" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Standaard</SelectItem>
                <SelectItem value="price-asc">Prijs: Laag naar Hoog</SelectItem>
                <SelectItem value="price-desc">Prijs: Hoog naar Laag</SelectItem>
                <SelectItem value="title-asc">Titel: A-Z</SelectItem>
                <SelectItem value="title-desc">Titel: Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-start space-x-1 sm:space-x-2 text-xs sm:text-sm">
          <span className="font-medium text-gray-700">Aantal per pagina:</span>
          {[8, 12, 20, 28].map((num) => (
            <Button
              key={num}
              variant={productsPerPage === num ? "default" : "outline"}
              size="sm"
              onClick={() => updateUrlParams({ limit: num })}
              className={`px-2 sm:px-3 py-1 h-auto text-xs sm:text-sm ${
                productsPerPage === num
                  ? "bg-[#E2B505] text-white hover:bg-[#E2B505]/90 border-[#E2B505]"
                  : "text-gray-600 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {num}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20 min-h-[300px]">
          <Spinner size="large" className="text-[#E2B505]" />
        </div>
      ) : (
        <div
          className={`grid gap-2 sm:gap-4 
            grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
          `}
        >
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product) => <ProductCard key={product.arcleunik} product={product} />)
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-lg font-medium">Geen producten gevonden</p>
              <p className="text-sm text-gray-500">Pas je zoekterm of filters aan, of probeer een andere categorie.</p>
            </div>
          )}
        </div>
      )}

      {totalPages > 1 && !isLoading && displayedProducts.length > 0 && (
        <div className="flex justify-center items-center gap-2 sm:gap-4 mt-6 sm:mt-8">
          {currentPage > 1 && (
            <Button
              onClick={() => updateUrlParams({ page: currentPage - 1 })}
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
              onClick={() => updateUrlParams({ page: currentPage + 1 })}
              variant="outline"
              className="px-2 sm:px-4 py-1 sm:py-2 bg-[#E2B505] text-white font-semibold hover:bg-[#E2B505]/90 border-[#E2B505] text-xs sm:text-sm"
            >
              Volgende
            </Button>
          )}
        </div>
      )}
    </>
  )
}

export default function ProductsGridClient(props: Props) {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-20 min-h-[300px]">
          <Spinner size="large" className="text-[#E2B505]" />
        </div>
      }
    >
      <ProductsGridClientContent {...props} />
    </Suspense>
  )
}
