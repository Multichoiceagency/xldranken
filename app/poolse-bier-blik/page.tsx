import { getProductsByFam2ID } from "@/lib/api"
import type { ProductProps } from "@/types/product"
import Hero from "@/components/Hero"
import { Suspense } from "react"
import { Spinner } from "@/components/ui/spinner"
import PoolsPageClient from "./pools-page-client"

export default function BierPage() {
  const categoryId = "4"

  // Fetch products on the server - use async/await in a separate function
  const ProductGrid = async () => {
    const allProducts: ProductProps[] = await getProductsByFam2ID(categoryId)

    return (
      <PoolsPageClient initialProducts={allProducts} />
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <Hero title="Poolse bier blik" description=" " />

      {/* Product Section */}
      <div className="container mx-auto px-8 py-8">
        {/* Product Grid */}
        <Suspense
          fallback={
            <div className="flex justify-center items-center py-20">
              <Spinner size="large" className="text-[#E2B505]" />
            </div>
          }
        >
          <ProductGrid />
        </Suspense>
      </div>
    </div>
  )
}
