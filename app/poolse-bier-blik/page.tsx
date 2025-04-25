import { getProductsByFam2ID } from "@/lib/api"
import type { ProductProps } from "@/types/product"
import Hero from "@/components/Hero"
import { Suspense } from "react"
import { Spinner } from "@/components/ui/spinner"
import PoolseBierPageClient from "./pools-page-client"

export const metadata = {
  title: "Sterke Dranken | XL Dranken",
  description: "Bekijk ons assortiment sterke dranken",
}

export default function PoolseBierPage() {
  const categoryId = "4" // Category ID for Sterke Dranken

  // Fetch products on the server - use async/await in a separate function
  const ProductGrid = async () => {
    // Use the updated getProductsByFam2ID function with the limit parameter
    const allProducts: ProductProps[] = await getProductsByFam2ID(categoryId, 700)

    console.log(`Server: Fetched ${allProducts.length} products for Sterke Dranken`)

    return <PoolseBierPageClient initialProducts={allProducts} />
  }

  return (
    <div>
      {/* Hero Section */}
      <Hero title="Pools Bier Blik" description=" " />

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
