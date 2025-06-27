import { getProductsByFam2ID } from "@/lib/api_gisteren"
import type { ProductProps } from "@/types/product"
import { Suspense } from "react"
import { Spinner } from "@/components/ui/spinner"
import ProductsPageClient from "./products-page-client"

export default function ProductsPage() {
  // Fetch products on the server - use async/await in a separate function
  const ProductGrid = async () => {
    // Fetch products from multiple categories
    // You can add more category IDs or modify this to fetch all products
    const categoryIds = ["23", "6", "2", "7" , "12" , "18" , "4" , "5"] // Example category IDs

    let allProducts: ProductProps[] = []

    // Fetch products from each category
    await Promise.all(
      categoryIds.map(async (id) => {
        const products = await getProductsByFam2ID(id)
        allProducts = [...allProducts, ...products]
      }),
    )

    // Remove duplicates if needed (based on id_product_mysql)
    const uniqueProducts = Array.from(new Map(allProducts.map((item) => [item.id_product_mysql, item])).values())

    return <ProductsPageClient initialProducts={uniqueProducts} />
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-[#E2B505] text-white">
        <div className="container mx-auto px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Alle Producten</h1>
          <p className="text-white/90 max-w-2xl">
            Bekijk ons volledige assortiment van hoogwaardige dranken en producten.
          </p>
        </div>
      </div>

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

