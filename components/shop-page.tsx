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

  const [products, setProducts] = useState<ProductProps[]>([]) // ✅ Correct getypeerd
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("featured")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/products?fam2ID=${fam2ID}`)
        const data = await response.json()

        console.log("📦 API Response:", data.products) // 🔥 Debugging

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

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
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
          {products.map((product) => (
            <ProductCard key={product.id_product_mysql} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
