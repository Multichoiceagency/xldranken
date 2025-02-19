'use client';

import { FeaturedProductsCarousel } from "@/components/featured-products-carousel"
import { getProductsByFam2ID } from "@/lib/api"

export async function FeaturedProducts({ fam2ID = "" }: { fam2ID?: string }) {
  const products = await getProductsByFam2ID(fam2ID)

  if (!products || products.length === 0) {
    return <div className="text-center">No products found</div>
  }

  return <FeaturedProductsCarousel products={products} />
}

