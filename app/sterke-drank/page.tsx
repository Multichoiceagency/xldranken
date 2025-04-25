import { getProductsBatch } from "@/lib/api"
import type { ProductProps } from "@/types/product"
import Hero from "@/components/Hero"
import { Suspense } from "react"
import { Spinner } from "@/components/ui/spinner"
import SterkeDrankenPageClient from "./sterke-dranken-page-client"

export const metadata = {
  title: "Sterke Dranken | XL Dranken",
  description: "Bekijk ons assortiment sterke dranken",
}

// Make the page dynamic to ensure it re-renders with new search params
export const dynamic = "force-dynamic"

export default function SterkeDrankenPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const categoryId = "16" // Category ID for Sterke Dranken
  // In Next.js 14+, searchParams is a dynamic API that needs to be properly handled
  // Convert searchParams to a regular object first
  const pageParam = searchParams?.page
  const page = Number(pageParam) || 1

  // Fetch products on the server - use async/await in a separate function
  const ProductGrid = async () => {
    // Fetch products for the current page
    const initialProducts: ProductProps[] = await getProductsBatch(categoryId, 48, page)

    console.log(`Server: Fetched ${initialProducts.length} products for Sterke Dranken (page ${page})`)

    return <SterkeDrankenPageClient initialProducts={initialProducts} categoryId={categoryId} />
  }

  return (
    <div>
      {/* Hero Section */}
      <Hero title="Sterke Dranken" description=" " />

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
