'use client'

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Search, Filter } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ProductCard } from "./product-card"
import { GridLayoutControls } from "./grid-layout-controls"
import { products } from "@/data/products"
import { ProductGrid } from "./product-grid"

const filters = {
  categories: [
    { id: 'wine', label: 'Wijn', count: products.filter(p => p.category === 'wine').length },
    { id: 'beer', label: 'Bier', count: products.filter(p => p.category === 'beer').length },
    { id: 'spirits', label: 'Sterke drank', count: products.filter(p => p.category === 'spirits').length },
    { id: 'soft-drinks', label: 'Frisdrank', count: products.filter(p => p.category === 'soft-drinks').length },
  ],
  price: [
    { id: 'under-10', label: 'Under €10', count: products.filter(p => parseFloat(p.prix_vente_groupe) < 10).length },
    { id: '10-20', label: '€10 - €20', count: products.filter(p => parseFloat(p.prix_vente_groupe) >= 10 && parseFloat(p.prix_vente_groupe) < 20).length },
    { id: '20-50', label: '€20 - €50', count: products.filter(p => parseFloat(p.prix_vente_groupe) >= 20 && parseFloat(p.prix_vente_groupe) < 50).length },
    { id: 'over-50', label: 'Over €50', count: products.filter(p => parseFloat(p.prix_vente_groupe) >= 50).length },
  ],
  promotions: [
    { id: 'promo', label: 'In promotie', count: products.filter(p => p.prix_en_promo === "1").length },
  ],
}

export function ShopPage({ category = "all" }) {
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("default")
  const [searchTerm, setSearchTerm] = useState("")
  const [gridSize, setGridSize] = useState(12)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  const filteredProducts = products.filter(product => 
    (category === "all" || product.category === category) &&
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getGridColumns = () => {
    switch (gridSize) {
      case 9:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      case 12:
        return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
      case 18:
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
      case 24:
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8'
      default:
        return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
    }
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Zoeken..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-4">CATEGORIEËN</h3>
        <div className="space-y-2">
          {filters.categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2">
              <Checkbox
                checked={activeFilters.includes(cat.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setActiveFilters([...activeFilters, cat.id])
                  } else {
                    setActiveFilters(activeFilters.filter(f => f !== cat.id))
                  }
                }}
              />
              <span className="flex-1">{cat.label}</span>
              <span className="text-sm text-muted-foreground">({cat.count})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <Accordion type="single" collapsible defaultValue="price">
        <AccordionItem value="price">
          <AccordionTrigger>PRIJS</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {filters.price.map((price) => (
                <label key={price.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={activeFilters.includes(price.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setActiveFilters([...activeFilters, price.id])
                      } else {
                        setActiveFilters(activeFilters.filter(f => f !== price.id))
                      }
                    }}
                  />
                  <span className="flex-1">{price.label}</span>
                  <span className="text-sm text-muted-foreground">({price.count})</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Promotions */}
      <div>
        <h3 className="font-semibold mb-4">ACTIES</h3>
        <div className="space-y-2">
          {filters.promotions.map((promo) => (
            <label key={promo.id} className="flex items-center gap-2">
              <Checkbox
                checked={activeFilters.includes(promo.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setActiveFilters([...activeFilters, promo.id])
                  } else {
                    setActiveFilters(activeFilters.filter(f => f !== promo.id))
                  }
                }}
              />
              <span className="flex-1">{promo.label}</span>
              <span className="text-sm text-muted-foreground">({promo.count})</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-8">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">
          {category === "all" ? "Alle producten" : category}
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Mobile Filters Button */}
        <div className="md:hidden">
          <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Filters Sidebar */}
        <div className="hidden md:block w-64 shrink-0">
          <FilterContent />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col gap-6">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">
                  {category === "all" ? "Alle producten" : category}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {filteredProducts.length} producten
                </p>
              </div>
              <div className="w-full sm:w-auto">
                <GridLayoutControls
                  gridSize={gridSize}
                  onGridSizeChange={setGridSize}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />
              </div>
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter) => (
                  <Button
                    key={filter}
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveFilters(activeFilters.filter(f => f !== filter))}
                  >
                    {filter}
                    <span className="ml-2">×</span>
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveFilters([])}
                >
                  Wis alles
                </Button>
              </div>
            )}

            {/* Products Grid */}
            <ProductGrid />

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-8">
              {[1, 2, 3, 4].map((page) => (
                <Button
                  key={page}
                  variant={page === 1 ? "default" : "outline"}
                  size="sm"
                >
                  {page}
                </Button>
              ))}
              <Button variant="outline" size="sm">
                Volgende
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

