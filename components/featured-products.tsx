"use client"
import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { Product } from "@/types/product" // ✅ Import Product interface


export function FeaturedProducts({ fam2ID = "6" }: { fam2ID?: string }) {
  const [products, setProducts] = React.useState<Product[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log(`Fetching products from: /api/proxy?fam2ID=${fam2ID}`) // Debug log

        const response = await fetch(`/api/proxy?fam2ID=${fam2ID}`)
        if (!response.ok) throw new Error("Failed to fetch products")

        const data = await response.json()
        console.log("API Response:", data) // Debug log

        // ✅ Extract products from data.result.product instead of data.products
        const productsArray = data?.result?.product || []
        
        if (!Array.isArray(productsArray) || productsArray.length === 0) {
          console.warn(`No products found for fam2ID: ${fam2ID}`)
        }

        setProducts(productsArray) // ✅ Ensure products exist
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [fam2ID]) // ✅ Refetch when fam2ID changes

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    dragFree: true,
  })

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])


  return (
    <div className="container mx-auto px-4 py-4 space-y-8">
      <h2 className="text-2xl font-bold mb-6 text-center">AANBEVOLEN PRODUCTEN</h2>
      <div className="relative">
        {/* Carousel wrapper */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {/* ✅ Render API-fetched products */}
            {products.map((product) => (
              <div
                key={product.id_product_mysql}
                className="flex-[0_0_100%] min-w-0 px-2 sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-white shadow-md"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous product</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 bg-white shadow-md"
          onClick={scrollNext}
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next product</span>
        </Button>
      </div>
    </div>
  )
}
