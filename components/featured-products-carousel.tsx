"use client"
import { useState, useEffect, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ProductCard from "@/components/product-card"
import type { ProductProps } from "@/types/product"

interface FeaturedProductsCarouselProps {
  title: string
  subtitle?: string
  products: ProductProps[]
  viewAllLink?: string
  backgroundColor?: string
  titleColor?: string
  subtitleColor?: string
  linkColor?: string
}

export function FeaturedProductsCarousel({
  title,
  subtitle,
  products,
  viewAllLink = "/products",
  backgroundColor = "#002B7F",
  titleColor = "#D0C298",
  subtitleColor = "white",
  linkColor = "#D0C298",
}: FeaturedProductsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    dragFree: true,
    containScroll: "trimSnaps",
  })

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)

    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect])

  if (!products || products.length === 0) return null

  return (
    <div className="w-full py-8" style={{ backgroundColor }}>
      <div className="mx-auto w-[1700px]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 px-6">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: titleColor }}>
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm mt-1" style={{ color: subtitleColor }}>
                {subtitle}
              </p>
            )}
          </div>
          {viewAllLink && (
            <Link href={viewAllLink} className="text-sm font-medium hover:underline" style={{ color: linkColor }}>
              Alles bekijken
            </Link>
          )}
        </div>

        {/* Carousel */}
        <div className="relative px-6">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {products.map((product) => (
                <div
                  key={product.id_product_mysql}
                  className="flex-[0_0_auto] min-w-0 pl-0 pr-6 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          {canScrollPrev && (
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full h-10 w-10"
              onClick={scrollPrev}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Vorige producten</span>
            </Button>
          )}

          {canScrollNext && (
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full h-10 w-10"
              onClick={scrollNext}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Volgende producten</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

