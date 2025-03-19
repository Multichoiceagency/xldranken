"use client"

import * as React from "react"
import { useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight, ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import type { ProductProps } from "@/types/product"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"

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
  const { addToCart, isInCart } = useCart()
  const { toast } = useToast()
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    dragFree: true,
    containScroll: "trimSnaps",
  })

  // Track animation states for each product
  const [animatingProducts, setAnimatingProducts] = useState<Record<string, boolean>>({})

  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(true)

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  React.useEffect(() => {
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
      <div className="mx-auto" style={{ maxWidth: "1440px" }}>
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
              {products.map((product) => {
                // Format prices
                const regularPrice = Number(product.prix_vente_groupe)

                // Build image source with proper handling
                const imageSrc = product.photo1_base64
                  ? product.photo1_base64.startsWith("data:image")
                    ? product.photo1_base64
                    : `data:image/jpeg;base64,${product.photo1_base64}`
                  : "/placeholder.svg"

                const isAnimating = animatingProducts[product.id_product_mysql] || false
                const productInCart = isInCart(product.id_product_mysql)

                const handleAddToCart = () => {
                  // Set animation state for this product
                  setAnimatingProducts((prev) => ({
                    ...prev,
                    [product.id_product_mysql]: true,
                  }))

                  // Create cart item
                  const cartItem = {
                    id: product.id_product_mysql,
                    name: product.title,
                    price: regularPrice,
                    image: imageSrc,
                    volume: product.arcleunik,
                    productCode: product.productCode || "",
                    quantity: 1,
                  }

                  // Add to cart
                  addToCart(cartItem)

                  // Show toast notification
                  toast({
                    title: "Product toegevoegd",
                    description: `${product.title} is toegevoegd aan je winkelwagen`,
                  })

                  // Reset animation state after animation completes
                  setTimeout(() => {
                    setAnimatingProducts((prev) => ({
                      ...prev,
                      [product.id_product_mysql]: false,
                    }))
                  }, 1000)
                }

                return (
                  <div
                    key={product.id_product_mysql}
                    className="flex-[0_0_auto] min-w-0 pl-0 pr-6 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
                  >
                    <div
                      className={`group relative flex flex-col bg-white rounded-lg border transition-all duration-300 h-full ${
                        isAnimating ? "shadow-lg scale-[1.02]" : "hover:shadow-lg"
                      }`}
                    >
                      {/* Product image */}
                      <div className="relative h-[200px] w-full overflow-hidden p-4">
                        <Image
                          src={imageSrc || "/placeholder.svg"}
                          alt={product.title}
                          style={{ padding: "10px" }}
                          fill
                          className={`object-contain transition-transform duration-500 ${
                            isAnimating ? "scale-110" : "group-hover:scale-105"
                          }`}
                          unoptimized
                        />

                        {/* Animation overlay when adding to cart */}
                        {isAnimating && (
                          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 animate-pulse">
                            <div className="bg-green-500 text-white rounded-full p-2 animate-bounce">
                              <Check className="w-6 h-6" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Product details */}
                      <div className="flex flex-col p-4 pt-0" style={{ paddingTop: "15px" }}>
                        <h3 className="font-medium text-[#002B7F] hover:underline min-h-[2.5rem] line-clamp-2">
                          {product.title}
                        </h3>

                        {/* Price display */}
                        <div className="space-y-1">
                          {regularPrice > 0 ? (
                            <div className="text-[#E31931] text-2xl font-bold">
                              € {regularPrice.toFixed(2).replace(".", ",")}
                            </div>
                          ) : (
                            <div className="text-gray-500 text-sm">Prijs niet beschikbaar</div>
                          )}
                        </div>

                        {/* Add to cart button */}
                        <div className="mt-4">
                          <Button
                            className={`w-full transition-all duration-300 ${
                              isAnimating
                                ? "bg-green-500 scale-105 shadow-md"
                                : productInCart
                                  ? "bg-green-600 hover:bg-green-700 hover:shadow-md"
                                  : "bg-[#E2B505] hover:bg-[#E2B505]/90 hover:shadow-md"
                            } text-white`}
                            onClick={handleAddToCart}
                            disabled={isAnimating}
                          >
                            {isAnimating ? (
                              <>
                                <Check className="w-4 h-4 mr-2 animate-bounce" />
                                Toegevoegd!
                              </>
                            ) : (
                              <>
                                <ShoppingCart className={`w-4 h-4 mr-2 ${isAnimating ? "animate-spin" : ""}`} />
                                In winkelmand
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
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

