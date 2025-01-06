'use client'

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const topBanners = [
  {
    title: "NU EXTRA Voordelig",
    description: "Jouw favoriete smaken met veel voordeel",
    discount: "25%",
    bgColor: "bg-[#D84315]",
    image: "https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    title: "GENIET VAN EEN Procentje minder",
    description: "Alle alcoholvrije dranken met korting!",
    discount: "25%",
    bgColor: "bg-[#4A69BD]",
    image: "https://images.pexels.com/photos/5947019/pexels-photo-5947019.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
]

const smallBanners = [
  {
    title: "PREMIUM DEALS",
    description: "Speciaal uitgeprijs voor Ball & Gall Premium",
    discount: "25%",
    bgColor: "bg-[#F5F5DC]",
    textColor: "text-[#B8860B]",
    discountBgColor: "bg-[#FF6B35]",
    image: "https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    title: "WHISKY DEALS",
    description: "De beste whisky aanbiedingen",
    discount: "25%",
    bgColor: "bg-[#FFF8DC]",
    textColor: "text-[#8B4513]",
    discountBgColor: "bg-[#FF6B35]",
    image: "https://images.pexels.com/photos/3019019/pexels-photo-3019019.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    title: "ACTIE KNALLERS",
    description: "De beste aanbiedingen van deze week",
    discount: "25%",
    bgColor: "bg-[#F0FFF0]",
    textColor: "text-[#228B22]",
    discountBgColor: "bg-[#FF6B35]",
    image: "https://images.pexels.com/photos/1089930/pexels-photo-1089930.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    title: "WEEKENDDEAL",
    description: "Cava & prosecco met korting!",
    discount: "50%",
    bgColor: "bg-[#FFE4E1]",
    textColor: "text-[#FF1493]",
    discountBgColor: "bg-[#FF1493]",
    image: "https://images.pexels.com/photos/2912108/pexels-photo-2912108.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
]

export function PromotionalGrid() {
  return (
    <div className="space-y-6">
      {/* Top Banners Carousel */}
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {topBanners.map((banner, index) => (
            <CarouselItem key={index} className="md:basis-1/2">
              <Card className={`${banner.bgColor} border-0`}>
                <CardContent className="relative h-[200px] md:h-[300px] p-0">
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 p-8 flex flex-col justify-center z-10">
                    <div className="space-y-2">
                      <h2 className="text-2xl md:text-4xl font-bold text-white">
                        {banner.title}
                      </h2>
                      <p className="text-lg text-white">{banner.description}</p>
                      <Button variant="secondary" className="mt-4">
                        SHOP NU
                      </Button>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-white rounded-full p-4 shadow-lg">
                    <span className="font-bold text-[#D84315]">
                      {banner.discount}
                    </span>
                    <span className="block text-xs text-[#D84315]">
                      KORTING
                    </span>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {/* Small Banners Carousel */}
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {smallBanners.map((banner, index) => (
            <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 md:basis-1/4">
              <Link href={`/${banner.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <Card className={`${banner.bgColor} border-0`}>
                  <CardContent className="relative h-[200px] p-0 overflow-hidden">
                    <Image
                      src={banner.image}
                      alt={banner.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 p-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className={`text-xl font-bold text-white`}>
                          {banner.title}
                        </h3>
                        <p className="text-sm text-white">{banner.description}</p>
                      </div>
                      <div className={`self-start ${banner.discountBgColor} rounded-full p-2 shadow-lg`}>
                        <span className="text-white text-sm font-bold">
                          {banner.discount}
                        </span>
                        <span className="block text-[10px] text-white">
                          KORTING
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4">
                    <Button variant="secondary" size="sm" className="w-full">
                      SHOP NU
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}

