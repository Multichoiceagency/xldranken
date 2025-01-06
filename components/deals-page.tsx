'use client'

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

interface Deal {
  id: string
  title: string
  description: string
  image: string
  discount: string
  originalPrice: number
  discountedPrice: number
}

const initialDeals: Deal[] = [
  {
    id: "1",
    title: "Premium Whiskey Collection",
    description: "Discover our finest selection of aged whiskeys",
    image: "https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    discount: "20%",
    originalPrice: 129.99,
    discountedPrice: 103.99,
  },
  {
    id: "2",
    title: "Summer Gin Bundle",
    description: "Perfect for refreshing cocktails",
    image: "https://images.pexels.com/photos/5947019/pexels-photo-5947019.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    discount: "15%",
    originalPrice: 89.99,
    discountedPrice: 76.49,
  },
  {
    id: "3",
    title: "Craft Beer Sampler",
    description: "Explore a variety of local craft beers",
    image: "https://images.pexels.com/photos/1089930/pexels-photo-1089930.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    discount: "25%",
    originalPrice: 49.99,
    discountedPrice: 37.49,
  },
]

export function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>(initialDeals)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Actuele Aanbiedingen</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal) => (
          <Card key={deal.id} className="overflow-hidden">
            <div className="relative h-48">
              <Image
                src={deal.image}
                alt={deal.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full">
                {deal.discount} korting
              </div>
            </div>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">{deal.title}</h2>
              <p className="text-muted-foreground mb-4">{deal.description}</p>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold text-primary">€{deal.discountedPrice.toFixed(2)}</span>
                  <span className="text-sm text-muted-foreground line-through ml-2">€{deal.originalPrice.toFixed(2)}</span>
                </div>
                <Link href={`/product/${deal.id}`}>
                  <Button variant="outline">Bekijk aanbieding</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

