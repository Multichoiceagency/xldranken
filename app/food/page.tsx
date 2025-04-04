import { getProductsByFam2ID } from "@/lib/api"
import type { ProductProps } from "@/types/product"
import Hero from "@/components/Hero"
import { Suspense } from "react"
import { Spinner } from "@/components/ui/spinner"
import FoodPageClient from "./frisdranken-page-client"

export default function FrisdrankenPage() {
  const categoryId = "14"

  // Fetch products on the server - use async/await in a separate function
  const ProductGrid = async () => {
    const allProducts: ProductProps[] = await getProductsByFam2ID(categoryId)

    return (
      <FoodPageClient initialProducts={allProducts} />
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <Hero title="Food" description="" />

      {/* Product Section */}
      <div className="container mx-auto px-8 py-8">
        {/* Product Grid */}
        <Suspense
          fallback={
            <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="text-center">
              <Spinner size="large" className="text-[#E2B505] mb-4" />
              <h2 className="text-xl font-semibold mt-4">Producten worden geladen...</h2>
              <p className="text-gray-500 mt-2">Even geduld alstublieft</p>
            </div>
          </div>
          }
        >
          <ProductGrid />
        </Suspense>
      </div>
    </div>
  )
}
