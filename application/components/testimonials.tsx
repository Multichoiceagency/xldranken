'use client'

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Star } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: "Emma V.",
    rating: 5,
    text: "XL Dranken heeft een geweldige selectie en uitstekende klantenservice. Ik ben erg tevreden met mijn aankopen!",
  },
  {
    id: 2,
    name: "Thomas D.",
    rating: 4,
    text: "Snelle levering en goede prijzen. De website is gemakkelijk te navigeren. Zeker een aanrader!",
  },
  {
    id: 3,
    name: "Sophie L.",
    rating: 5,
    text: "Ik ben onder de indruk van de kwaliteit van de producten en de deskundige adviezen. XL Dranken is mijn go-to voor alle drankjes.",
  },
  {
    id: 4,
    name: "Martijn B.",
    rating: 4,
    text: "Grote verscheidenheid aan producten en regelmatige aanbiedingen. Ik kom zeker terug voor meer!",
  },
]

export function Testimonials() {
  return (
    <section className="py-12 bg-white">
      <div className="container">
        <h2 className="text-3xl font-bold mb-8 text-center">What Our Customers Say</h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mb-4 italic">"{testimonial.text}"</p>
                    <p className="font-semibold">{testimonial.name}</p>
                  </CardContent>
                </Card>
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

