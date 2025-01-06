'use client'

import * as React from "react"
import Image from "next/image"
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

const brands = [
  "Brand 1",
  "Brand 2",
  "Brand 3",
  "Brand 4",
  "Brand 5",
  "Brand 6",
  "Brand 7",
  "Brand 8",
]

export function BrandsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' })

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div className="py-8 bg-gray-50">
      <div className="container px-4 relative">
        <h2 className="text-2xl font-bold mb-6">Popular Brands</h2>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {brands.map((brand, index) => (
              <div key={brand} className="flex-[0_0_50%] min-w-0 sm:flex-[0_0_33.33%] md:flex-[0_0_25%] lg:flex-[0_0_20%] px-2">
                <div className="bg-white rounded-lg p-4 flex items-center justify-center h-24">
                  <Image
                    src={`https://picsum.photos/seed/${brand}/200/100`}
                    alt={brand}
                    width={120}
                    height={60}
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous brands</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
          onClick={scrollNext}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next brands</span>
        </Button>
      </div>
    </div>
  )
}

