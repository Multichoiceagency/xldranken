'use client'

import { useState, useEffect } from "react"
import ProductCard from "@/components/product-card"
import { sampleProducts } from "@/data/sample-products"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function CategoryPage({ slug }: { slug: string, id: string }) {
  const [products, setProducts] = useState(sampleProducts)
  const [sortBy, setSortBy] = useState("featured")

  useEffect(() => {
    // In a real application, you would fetch products based on the category slug
    // For now, we'll just filter the sample products based on the category name
    const categoryName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    const filteredProducts = sampleProducts.filter(product => product.category.toLowerCase() === categoryName.toLowerCase())
    setProducts(filteredProducts)
  }, [slug])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 capitalize">{slug.replace('-', ' ')}</h1>
      
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-gray-500">{products.length} producten</p>
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-center text-gray-500 mt-8">Geen producten gevonden in deze categorie.</p>
      )}
    </div>
  )
}

