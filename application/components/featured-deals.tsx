'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"
import { useState } from "react"
import { useCart } from "./cart-context"
import { AddToCartAnimation } from "./add-to-cart-animation"

const deals = [
  {
    id: 1,
    name: "Premium Whiskey Set",
    price: 89.99,
    originalPrice: 129.99,
    image: "https://images.unsplash.com/photo-1582819509237-d6c339d72860?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
  },
  {
    id: 2,
    name: "Craft Bier Proefpakket",
    price: 34.99,
    originalPrice: 49.99,
    image: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
  },
  {
    id: 3,
    name: "Wijnproeverij Kit",
    price: 59.99,
    originalPrice: 79.99,
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
  },
  {
    id: 4,
    name: "Cocktail Mixer Set",
    price: 44.99,
    originalPrice: 64.99,
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
  },
]

export function FeaturedDeals() {
  const [showAnimation, setShowAnimation] = useState<string | null>(null)
  const { addToCart } = useCart()
  return (
    <section className="py-12 bg-gray-50">
      <div className="container">
        <h2 className="text-3xl font-bold mb-8">Aanbiedingen</h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {deals.map((deal) => (
              <CarouselItem key={deal.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
                <Card>
                  <CardContent className="p-4">
                    <div className="aspect-square relative mb-4">
                      <Image
                        src={deal.image}
                        alt={deal.name}
                        fill
                        className="object-cover rounded-md"
                      />
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                        {Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100)}% KORTING
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2">{deal.name}</h3>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-bold text-[#FF6B35]">€{deal.price.toFixed(2).replace('.', ',')}</span>
                      <span className="text-sm text-gray-500 line-through">€{deal.originalPrice.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <Button 
                      className="w-full bg-[#FF6B35] hover:bg-[#E85A24]" 
                      onClick={() => {
                        addToCart({
                          id: deal.id.toString(),
                          name: deal.name,
                          price: deal.price,
                          quantity: 1,
                          image: deal.image,
                        })
                        setShowAnimation(deal.id.toString())
                      }}
                    >
                      In winkelwagen
                    </Button>
                  </CardContent>
                </Card>
                <AddToCartAnimation
                  isVisible={showAnimation === deal.id.toString()}
                  onAnimationComplete={() => setShowAnimation(null)}
                  productName={deal.name}
                  productPrice={deal.price}
                  productImage={deal.image}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  )
}

