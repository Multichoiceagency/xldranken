'use client';

import { useEffect, useState } from 'react'
import { FeaturedProductsCarousel } from "@/components/featured-products-carousel"
import { getProductsByFam2ID } from "@/lib/api"
import type { ProductProps } from "@/types/product"

export function FeaturedProducts({ fam2ID = "" }: { fam2ID?: string }) {
  const [products, setProducts] = useState<ProductProps[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await getProductsByFam2ID(fam2ID)
        setProducts(data)
      } catch (err) {
        setError("Error fetching products")
      } finally {
        setLoading(false)
      }
    }

    if (fam2ID) {
      fetchProducts()
    }
  }, [fam2ID]) // Runs when `fam2ID` changes

  if (loading) {
    return <div className="text-center">Loading...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  if (products.length === 0) {
    return <div className="text-center">No products found</div>
  }

  return <FeaturedProductsCarousel products={products} title={''} />
}
