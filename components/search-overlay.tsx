'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ProductCard } from "./product-card"
import { sampleProducts } from "@/data/sample-products"
import { cn } from "@/lib/utils"

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredProducts, setFilteredProducts] = useState(sampleProducts)
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    if (searchTerm) {
      const filtered = sampleProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      const uniqueCategories = Array.from(new Set(filtered.map(p => p.category)))
      setFilteredProducts(filtered)
      setCategories(uniqueCategories)
    } else {
      setFilteredProducts([])
      setCategories([])
    }
  }, [searchTerm])

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] bg-black/50 transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl transition-transform duration-300 ease-in-out overflow-auto",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="sticky top-0 z-10 bg-white border-b">
          <div className="flex items-center p-4 gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                type="search"
                placeholder="Zoek naar..."
                className="pl-10 pr-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="shrink-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex gap-4 px-4 pb-4">
            <Button
              variant="secondary"
              className={cn(
                "rounded-full",
                !searchTerm && "bg-[#C1A770] text-white hover:bg-[#A08C5B]"
              )}
              onClick={() => setSearchTerm('')}
            >
              Alles
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant="secondary"
                className="rounded-full"
                onClick={() => setSearchTerm(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="p-4">
          {searchTerm && filteredProducts.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Geen producten gevonden voor "{searchTerm}"
            </p>
          ) : (
            <div className="space-y-8">
              {categories.map((category) => {
                const categoryProducts = filteredProducts.filter(
                  (p) => p.category === category
                )
                return (
                  categoryProducts.length > 0 && (
                    <div key={category}>
                      <h2 className="text-xl font-bold mb-4">{category}</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {categoryProducts.map((product) => (
                          <ProductCard key={product.id} {...product} />
                        ))}
                      </div>
                    </div>
                  )
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

