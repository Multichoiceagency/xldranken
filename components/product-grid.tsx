'use client'

import { useState } from "react"
import { ProductCard } from "./product-card"
import { GridLayoutControls } from "./grid-layout-controls"
import { products } from "@/data/products"

export function ProductGrid() {
  const [gridSize, setGridSize] = useState(12)
  const [sortBy, setSortBy] = useState("default")

  const getGridColumns = () => {
    switch (gridSize) {
      case 9:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      case 12:
        return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
      case 18:
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
      case 24:
        return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8'
      default:
        return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
    }
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <GridLayoutControls
          gridSize={gridSize}
          onGridSizeChange={setGridSize}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>
      <div className={`grid ${getGridColumns()} gap-4 sm:gap-6`}>
        {products.map((product) => (
          <ProductCard key={product.id_product_mysql} id={product.id_product_mysql} />
        ))}
      </div>
    </div>
  )
}

