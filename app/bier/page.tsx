import { getProductsByFam2ID } from "@/lib/api"
import type { ProductProps } from "@/types/product"
import Hero from "@/components/Hero"
import { Suspense } from "react"
import { Spinner } from "@/components/ui/spinner"
import BierPageClient from "./bier-page-client"

export default function BierPage() {
  const categoryId = "5"

  // Fetch products on the server - use async/await in a separate function
  const ProductGrid = async () => {
    const allProducts: ProductProps[] = await getProductsByFam2ID(categoryId)

    return (
      <BierPageClient initialProducts={allProducts} />
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <Hero title="Bier Assortiment" description="Bekijk meer dan 100 diverse alcohol soorten" />

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
