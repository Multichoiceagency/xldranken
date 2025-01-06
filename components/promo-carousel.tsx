'use client'

import * as React from "react"
import Image from "next/image"
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

const promos = [
  {
    title: "Extra Deals",
    description: "Your favorite drinks with extra discount",
    discount: "25%",
    image: "https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
  },
  {
    title: "Weekend Special",
    description: "All sparkling wines with special discount",
    discount: "20%",
    image: "https://images.pexels.com/photos/5947019/pexels-photo-5947019.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
  },
  {
    title: "Summer Cocktails",
    description: "Refresh yourself with our cocktail selection",
    discount: "15%",
    image: "https://images.pexels.com/photos/2531186/pexels-photo-2531186.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
  },
  {
    title: "Whiskey Tasting",
    description: "Discover our premium whiskey collection",
    discount: "10%",
    image: "https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
  },
  {
    title: "Craft Beer Festival",
    description: "Explore a wide range of local craft beers",
    discount: "30%",
    image: "https://images.pexels.com/photos/1089930/pexels-photo-1089930.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
  },
  {
    title: "Wine Lover's Paradise",
    description: "Indulge in our exquisite wine selection",
    discount: "20%",
    image: "https://images.pexels.com/photos/66636/pexels-photo-66636.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
  },
  {
    title: "Gin & Tonic Extravaganza",
    description: "Elevate your G&T game with premium gins",
    discount: "15%",
    image: "https://images.pexels.com/photos/616836/pexels-photo-616836.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
  },
  {
    title: "Rum Carnival",
    description: "Transport yourself to the Caribbean with our rum selection",
    discount: "25%",
    image: "https://images.pexels.com/photos/338713/pexels-photo-338713.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
  },
  {
    title: "Vodka Nights",
    description: "Explore our premium vodka collection",
    discount: "20%",
    image: "https://images.pexels.com/photos/1170599/pexels-photo-1170599.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
  },
  {
    title: "Tequila Fiesta",
    description: "Spice up your night with our tequila selection",
    discount: "30%",
    image: "https://images.pexels.com/photos/2170395/pexels-photo-2170395.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
  }
]

export function PromoCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [Autoplay()])

  useEffect(() => {
    const onResize = () => {
      if (emblaApi) emblaApi.reInit()
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [emblaApi])

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div className="container mx-auto px-4 pt-8 overflow-hidden">
      <div className="relative overflow-hidden" ref={emblaRef}>
        <div className="overflow-hidden">
          <div className="flex touch-pan-y">
            {promos.map((promo, index) => (
              <div key={index} className="relative flex-[0_0_100%] min-w-0 pl-4 h-[300px] md:h-[400px]">
                <Image
                  src={promo.image}
                  alt={promo.title}
                  fill
                  className="object-cover rounded-lg"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center max-w-lg mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                      {promo.title}
                    </h2>
                    <p className="text-xl text-white mb-6">{promo.description}</p>
                    <div className="flex items-center justify-center gap-4">
                      <span className="text-4xl font-bold text-white">
                        {promo.discount} OFF
                      </span>
                      <Button variant="secondary" size="lg">
                        Shop Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous promotion</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
          onClick={scrollNext}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next promotion</span>
        </Button>
      </div>
    </div>
  )
}

