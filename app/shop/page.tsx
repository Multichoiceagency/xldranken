"use client"
import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import ProductCard from "@/components/product-card"
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
  const [showPromotions, setShowPromotions] = useState(false)
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

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => product.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((product) => !showPromotions || product.prix_en_promo !== null)
  }, [products, searchTerm, showPromotions])

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return Number(a.prix_vente_groupe) - Number(b.prix_vente_groupe)
        case "price-desc":
          return Number(b.prix_vente_groupe) - Number(a.prix_vente_groupe)
        case "name-asc":
          return a.title.localeCompare(b.title)
        case "name-desc":
          return b.title.localeCompare(a.title)
        default:
          return 0
      }
    })
  }, [filteredProducts, sortBy])

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)
  const paginatedProducts = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">❌ {error}</div>
  }

  if (products.length === 0) {
    return <div className="text-center py-8">No products found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6 text-center">SHOP</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters */}
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
                  <Checkbox
                    checked={showPromotions}
                    onCheckedChange={(checked) => setShowPromotions(checked as boolean)}
                  />
                  Toon alleen promoties
                </Label>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </aside>

        {/* Products */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">{sortedProducts.length} producten gevonden</p>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => {
              const formattedProduct = {
                ...product,
                prix_vente_groupe: product.prix_vente_groupe?.toString() || "0",
                photo1_base64: product.photo1_base64
                  ? product.photo1_base64.startsWith("data:image")
                    ? product.photo1_base64
                    : `data:image/jpeg;base64,${product.photo1_base64}`
                  : "/placeholder.svg",
                prix_en_promo: product.prix_en_promo?.toString() || null,
              }
              return <ProductCard key={product.id_product_mysql} product={formattedProduct} />
            })}
          </div>

          {paginatedProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500">Geen producten gevonden die aan de criteria voldoen.</div>
          )}

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Vorige
            </Button>
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "default" : "outline"}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Volgende
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}

