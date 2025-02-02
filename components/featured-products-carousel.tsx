"use client"

import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import type { ProductProps } from "@/types/product"

interface FeaturedProductsCarouselProps {
  products: ProductProps[]
}

export function FeaturedProductsCarousel({ products }: FeaturedProductsCarouselProps) {
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

  if (products.length === 0) return <div className="text-center">No products found</div>

  return (
    <div className="container mx-auto px-4 py-4 space-y-8">
      <h2 className="text-2xl font-bold mb-6 text-center">AANBEVOLEN PRODUCTEN</h2>
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
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

