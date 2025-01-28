"use client"
import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import productsData from "@/data/product.json"

// Ensure productsData is an array
const featuredProducts = Array.isArray(productsData) ? productsData : [productsData]

// Function to duplicate products
const duplicateProducts = (products: any[], count: number) => {
  const duplicated = []
  for (let i = 0; i < count; i++) {
    duplicated.push(...products.map((product) => ({ ...product, key: `${product.id_product_mysql}-${i}` })))
  }
  return duplicated
}

// Duplicate the products to have at least 20 items
const duplicatedProducts = duplicateProducts(featuredProducts, Math.ceil(20 / featuredProducts.length))

export function FeaturedProducts() {
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
      <h2 className="text-2xl font-bold mb-6">AANBEVOLEN PRODUCTEN</h2>
      <div className="relative">
        {/* Carousel wrapper */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {/* Render duplicated products */}
            {duplicatedProducts.map((product) => (
              <div
                key={product.key}
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
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous product</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10"
          onClick={scrollNext}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next product</span>
        </Button>
      </div>
    </div>
  )
}

