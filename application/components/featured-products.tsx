'use client'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { ProductCard } from "./product-card"

const featuredProducts = [
  {
    id: "1",
    name: "Tanqueray London Dry",
    image: "/placeholder.svg?height=400&width=300",
    price: 17.49,
    originalPrice: 22.99,
    rating: 4.6,
    volume: "70CL",
    category: "Gin",
  },
  {
    id: "2",
    name: "Bombay Sapphire",
    image: "/placeholder.svg?height=400&width=300",
    price: 19.99,
    originalPrice: 24.99,
    rating: 4.8,
    volume: "70CL",
    category: "Gin",
  },
  {
    id: "3",
    name: "Hendrick's Gin",
    image: "/placeholder.svg?height=400&width=300",
    price: 29.99,
    originalPrice: 34.99,
    rating: 4.9,
    volume: "70CL",
    category: "Gin",
  },
  {
    id: "4",
    name: "Gordon's Gin",
    image: "/placeholder.svg?height=400&width=300",
    price: 15.99,
    originalPrice: 19.99,
    rating: 4.5,
    volume: "70CL",
    category: "Gin",
  },
]

export function FeaturedProducts() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Aanbevolen Producten</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {featuredProducts.map((product) => (
            <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/4">
              <ProductCard {...product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}

