'use client'

import * as React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

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

export function PromotionalGrid() {
  return (
    <div className="container mx-auto px-4 py-4 space-y-8">
      <div className="flex flex-col md:flex-row gap-6">
        {topBanners.map((banner, index) => (
          <Card key={index} className={`${banner.bgColor} border-0 flex-1`}>
            <CardContent className="relative h-[200px] md:h-[300px] p-0 rounded-md overflow-hidden">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 p-8 flex flex-col justify-center z-10">
                <div className="space-y-2">
                  <h2 className="text-xl md:text-2xl lg:text-4xl font-bold text-white">
                    {banner.title}
                  </h2>
                  <p className="text-sm md:text-lg text-white">{banner.description}</p>
                  <Button variant="secondary" className="mt-4">
                    SHOP NU
                  </Button>
                </div>
              </div>
              <div className="absolute top-4 right-4 bg-white rounded-full p-4 shadow-lg">
                <span className="font-bold text-[#C1A770]">
                  {banner.discount}
                </span>
                <span className="block text-xs text-[#C1A770]">
                  KORTING
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

