"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import ProductCard from "@/components/product-card"
import { SkeletonCard } from "@/components/SkeletonCard"
import type { ProductProps } from "@/types/product"

export default function ShopPage() {
  const searchParams = useSearchParams()
  const fam2ID = searchParams.get("fam2ID") || "6"

  const [products, setProducts] = useState<ProductProps[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("featured")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/products?fam2ID=${fam2ID}`)
        const data = await response.json()

        if (data.error) throw new Error(data.error)

        setProducts(data.products)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [fam2ID])

  // ✅ Paginering berekenen
  const totalPages = Math.ceil(products.length / itemsPerPage)
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: itemsPerPage }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">❌ {error}</div>
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ✅ Filters Links */}
          <aside className="w-full lg:w-64">
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="search">
                <AccordionTrigger>Zoeken</AccordionTrigger>
                <AccordionContent>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Zoek op naam..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="promotions">
                <AccordionTrigger>Promoties</AccordionTrigger>
                <AccordionContent>
                  <Label className="flex items-center gap-2">
                    <Checkbox />
                    Toon alleen promoties
                  </Label>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </aside>

          {/* ✅ Producten Rechts */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Shop</h1>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sorteer op" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Aanbevolen</SelectItem>
                  <SelectItem value="price-asc">Prijs laag - hoog</SelectItem>
                  <SelectItem value="price-desc">Prijs hoog - laag</SelectItem>
                  <SelectItem value="name-asc">Naam A - Z</SelectItem>
                  <SelectItem value="name-desc">Naam Z - A</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 🔹 Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id_product_mysql} product={product} />
              ))}
            </div>

            {/* ✅ Paginering onderaan */}
            <div className="mt-8 flex items-center justify-center gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          </main>
        </div>
      </div>
    </section>
  )
}
