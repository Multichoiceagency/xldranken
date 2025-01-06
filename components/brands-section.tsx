'use client'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const brands = [
  "Brand 1",
  "Brand 2",
  "Brand 3",
  "Brand 4",
  "Brand 5",
  "Brand 6",
]

export function BrandsSection() {
  return (
    <div className="py-8 bg-gray-50">
      <div className="container px-4">
        <h2 className="text-2xl font-bold mb-6">Popular Brands</h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {brands.map((brand, index) => (
              <CarouselItem key={brand} className="pl-2 md:pl-4 basis-1/2 md:basis-1/6">
                <div className="bg-white rounded-lg p-4 flex items-center justify-center">
                  <img
                    src="/placeholder.svg?height=80&width=120"
                    alt={brand}
                    className="w-[120px] h-[80px] object-contain"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  )
}

