'use client'

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/cart-context"
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useRouter } from 'next/navigation'

const recommendedProducts = [
  {
    id: "2",
    name: "Singleton of Dufftown 12Y",
    price: 39.99,
    image: "https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    rating: 4.5,
    category: "Whisky",
    status: "Online op voorraad"
  },
  {
    id: "3",
    name: "Vaco Vin Kurkentrekker 15T",
    price: 6.99,
    image: "https://images.pexels.com/photos/1089930/pexels-photo-1089930.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    rating: 4.0,
    category: "Accessoires",
    status: "Online op voorraad"
  },
  {
    id: "4",
    name: "Grolsch Blik 6X33CL",
    price: 6.49,
    image: "https://images.pexels.com/photos/5947019/pexels-photo-5947019.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    rating: 4.3,
    category: "Bier",
    status: "Online op voorraad"
  },
  {
    id: "5",
    name: "Hendrick's Gin",
    price: 32.99,
    image: "https://images.pexels.com/photos/3019019/pexels-photo-3019019.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    rating: 4.7,
    category: "Gin",
    status: "Online op voorraad"
  },
  {
    id: "6",
    name: "Moët & Chandon Brut Impérial",
    price: 49.99,
    image: "https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    rating: 4.8,
    category: "Champagne",
    status: "Online op voorraad"
  }
]

export function CartPage() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()])
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart()
  const { totalItems, totalPrice } = getCartTotal()
  const router = useRouter()

  const shippingCost = totalPrice >= 55 ? 0 : 4.95
  const total = totalPrice + shippingCost

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-sm mb-4">
        <Link href="/" className="text-primary hover:underline">
          Verder winkelen
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-8">WINKELWAGEN</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column */}
        <div className="flex-1">
          {/* Cart Items */}
          <div className="space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4 pb-6 border-b">
                <div className="relative w-20 h-[120px]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.volume}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">€{item.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border rounded-md">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="w-16 text-center h-10 border-0"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button variant="destructive" onClick={() => removeFromCart(item.id)}>VERWIJDEREN</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recommendations Carousel */}
          <div className="mt-12">
            <h2 className="font-bold mb-4">HEB JE HIER AL AAN GEDACHT?</h2>
            <div className="relative">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                  {recommendedProducts.map((product) => (
                    <div key={product.id} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] md:flex-[0_0_33.33%] p-2">
                      <div className="border rounded-lg p-4 h-full flex flex-col">
                        <div className="relative h-40 mb-4">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="space-y-2 flex-grow flex flex-col justify-between">
                          <div>
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">{product.category}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">{product.status}</p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold">€{product.price.toFixed(2)}</span>
                              <Button variant="default" size="sm">TOEVOEGEN</Button>
                            </div>
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
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
                onClick={scrollPrev}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10"
                onClick={scrollNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column - Sticky Overview */}
        <div className="lg:w-[380px]">
          <div className="lg:sticky lg:top-20 bg-gray-50 rounded-lg p-6">
            <h2 className="font-bold mb-4">JOUW OVERZICHT</h2>
            
            {/* Delivery Info */}
            <div className="flex items-start gap-2 text-sm mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mt-0.5 text-green-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <span className="text-green-600">Bestel voor 22:00 vandaag, </span>
                morgen in huis
              </div>
            </div>

            {/* Free Shipping Progress */}
            <div className="mb-6">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-600 transition-all duration-300"
                  style={{ width: `${Math.min((totalPrice / 55) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="text-green-600">Gratis verzending vanaf € 55</span>
                <span className="font-medium">
                  {totalPrice >= 55 ? "Behaald!" : `Nog € ${(55 - totalPrice).toFixed(2)}`}
                </span>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Totaal Producten ({totalItems})</span>
                <span>€ {totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Bezorgkosten</span>
                <span>{shippingCost === 0 ? "Gratis" : `€ ${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t">
                <span>Totaal</span>
                <span>€ {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button 
              className="w-full mt-6 bg-[#FF6B35] hover:bg-[#E85A24] text-white"
              onClick={() => router.push('/checkout')}
            >
              VERDER MET BESTELLEN
            </Button>

            {/* Payment Methods */}
            <div className="mt-4 flex justify-center gap-2">
              <Image
                src="/placeholder.svg?height=24&width=38"
                alt="iDEAL"
                width={38}
                height={24}
              />
              <Image
                src="/placeholder.svg?height=24&width=38"
                alt="Mastercard"
                width={38}
                height={24}
              />
              <Image
                src="/placeholder.svg?height=24&width=38"
                alt="Visa"
                width={38}
                height={24}
              />
            </div>

            {/* Terms */}
            <p className="text-xs text-center mt-4 text-muted-foreground">
              Je kunt altijd binnen 14 dagen de koop ontbinden.{" "}
              <Link href="/meer-informatie" className="text-primary hover:underline">
                Meer informatie
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

