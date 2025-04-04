import { getProductsByFam2ID } from "@/lib/api"
import type { ProductProps } from "@/types/product"
import Hero from "@/components/Hero"
import { Suspense } from "react"
import { Spinner } from "@/components/ui/spinner"
import WaterNlPageClient from "./water-nl-page-client"

export default function BierPage() {
  const categoryId = "7"

  // Fetch products on the server - use async/await in a separate function
  const ProductGrid = async () => {
    const allProducts: ProductProps[] = await getProductsByFam2ID(categoryId)

    return (
      <WaterNlPageClient initialProducts={allProducts} />
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <Hero title="Water NL" description=" " />

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
