"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { ProductProps } from "@/types/product" // ✅ Import Product interface

export function ProductGrid({ fam2ID = "6" }: { fam2ID?: string }) {
  const [products, setProducts] = React.useState<ProductProps[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [showRelevant, setShowRelevant] = React.useState(false) // ✅ Toggle state

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        <p className="flex justify-center items-center">Aan het laden..</p>
      </div>
    )

  if (error) return <p className="text-red-500">Error: {error}</p>
  if (products.length === 0) return <p className="text-gray-500 text-center">Geen producten gevonden voor deze categorie.</p>


  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{
          showRelevant ? "Relevante Producten" : "Aanbevolen Producten"
        }</h2>
        <Button variant="outline" onClick={() => setShowRelevant(!showRelevant)}>
          {showRelevant ? "Toon Aanbevolen" : "Toon Relevant"}
        </Button>
      </div>

      {/* ✅ Grid layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id_product_mysql} product={product} />
        ))}
      </div>
    </div>
  )
}
