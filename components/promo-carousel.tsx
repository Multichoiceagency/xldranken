'use client'

import * as React from "react"
import Link from "next/link"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"

const promos = [
  {
    title: "Summer Wine Collection",
    description: "Discover our refreshing selection of summer wines",
    discount: "20%",
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    bgColor: "bg-[#4A69BD]",
    link: "/summer-wines",
  },
  {
    title: "Whisky Wonderland",
    description: "Explore our premium whisky selection",
    discount: "15%",
    image: "https://images.unsplash.com/photo-1582819509237-d6c339d72860?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    bgColor: "bg-[#D84315]",
    link: "/whisky-collection",
  },
  {
    title: "Craft Beer Bonanza",
    description: "Discover unique flavors from local breweries",
    discount: "10%",
    image: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    bgColor: "bg-[#388E3C]",
    link: "/craft-beers",
  },
]

export function PromoCarousel() {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {promos.map((promo, index) => (
          <CarouselItem key={index}>
            <div className={`${promo.bgColor} relative h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden`}>
              <img
                src={promo.image}
                alt={promo.title}
                className="absolute inset-0 w-full h-full object-cover opacity-75"
              />
              <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-12 lg:p-24">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  {promo.title}
                </h2>
                <p className="text-xl md:text-2xl text-white mb-6">
                  {promo.description}
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-2xl md:text-3xl font-bold text-white bg-black bg-opacity-50 px-4 py-2 rounded-full">
                    {promo.discount} OFF
                  </span>
                  <Button asChild size="lg" className="bg-white text-black hover:bg-gray-200">
                    <Link href={promo.link}>
                      Shop Now
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

