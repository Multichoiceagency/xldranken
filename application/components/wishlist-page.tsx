'use client'

import { useState } from "react"
import Link from "next/link"
import { ChevronRight } from 'lucide-react'
import { useWishlist } from '@/contexts/wishlist-context'
import { ProductCard } from "./product-card"
import { GridLayoutControls } from "./grid-layout-controls"

export function WishlistPage() {
  const { wishlist } = useWishlist()
  const [gridSize, setGridSize] = useState(12)
  const [sortBy, setSortBy] = useState("default")

  const getGridColumns = () => {
    switch (gridSize) {
      case 9:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case 12:
        return 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4'
      case 18:
        return 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6'
      case 24:
        return 'grid-cols-2 md:grid-cols-4 lg:grid-cols-8'
      default:
        return 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-8">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">Mijn Favorieten</span>
      </div>

      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">MIJN FAVORIETEN</h1>
            <p className="text-sm text-muted-foreground">
              {wishlist.length} producten
            </p>
          </div>
          <GridLayoutControls
            gridSize={gridSize}
            onGridSizeChange={setGridSize}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {/* Products Grid */}
        {wishlist.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Je favorietenlijst is leeg</p>
            <Button asChild>
              <Link href="/shop">Bekijk onze producten</Link>
            </Button>
          </div>
        ) : (
          <div className={`grid ${getGridColumns()} gap-6`}>
            {wishlist.map((product) => (
              <ProductCard
                key={product.id}
                id_product_mysql={product.id}
                arcleunik={product.id}
                title={product.name}
                photo1_base64={product.image}
                prix_vente_groupe={product.price.toString()}
                promoPrice={product.originalPrice?.toString() || "0"}
                prix_en_promo={product.originalPrice ? "1" : "0"}
                unite_full_name={product.volume}
                qtyByBox="1"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

