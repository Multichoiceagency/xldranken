"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Plus } from "lucide-react"
import type { ProductProps } from "@/types/product"

interface ProductCarouselProps {
  title: string
  subtitle?: string
  products: ProductProps[]
  viewAllLink?: string
  backgroundColor?: string
}

export default function ProductCarousel({
  title,
  subtitle,
  products,
  viewAllLink = "/products",
  backgroundColor = "#FFF1F5", // Pink background like in the image
}: ProductCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Check if we can scroll right
  useEffect(() => {
    const checkScroll = () => {
      if (!scrollContainerRef.current) return

      const { scrollWidth, scrollLeft, clientWidth } = scrollContainerRef.current
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 20)
    }

    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      checkScroll()
      scrollContainer.addEventListener("scroll", checkScroll)
      return () => scrollContainer.removeEventListener("scroll", checkScroll)
    }
  }, [products])

  // Scroll right function
  const scrollRight = () => {
    if (!scrollContainerRef.current) return

    scrollContainerRef.current.scrollBy({
      left: 300,
      behavior: "smooth",
    })
  }

  // Format price with comma as decimal separator (European style)
  const formatPrice = (price: number) => {
    return price.toFixed(2).replace(".", ",")
  }

  // Calculate discount percentage
  const calculateDiscount = (originalPrice: number, salePrice: number | null | undefined) => {
    if (!originalPrice || !salePrice || originalPrice <= salePrice) return null
    const discount = Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    return discount > 0 ? discount : null
  }

  return (
    <div className="w-full py-6" style={{ backgroundColor }}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </div>
          <Link href={viewAllLink} className="text-sm font-medium text-pink-600 hover:underline">
            Alles bekijken
          </Link>
        </div>

        {/* Carousel container */}
        <div className="relative">
          {/* Products row with overflow - using Tailwind classes instead of custom CSS */}
          <div
            ref={scrollContainerRef}
            className="flex space-x-4 overflow-x-auto pb-6 -mx-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {products.map((product) => {
              const isOnSale =
                product.prix_en_promo !== null && product.prix_en_promo !== undefined && product.prix_en_promo > 0
              const discount = isOnSale ? calculateDiscount(product.prix_vente_groupe, product.prix_en_promo) : null

              // Safe price to display - handle null/undefined values
              const displayPrice =
                isOnSale && product.prix_en_promo
                  ? formatPrice(product.prix_en_promo)
                  : formatPrice(product.prix_vente_groupe)

              return (
                <div
                  key={product.id_product_mysql}
                  className="flex-shrink-0 w-[180px] bg-white rounded-lg overflow-hidden shadow-sm"
                >
                  {/* Product image and add button */}
                  <div className="relative h-[180px] bg-white p-2">
                    {product.photo1_base64 ? (
                      <Image
                        src={`data:image/jpeg;base64,${product.photo1_base64}`}
                        alt={product.title}
                        width={160}
                        height={160}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <span className="text-gray-400 text-sm">Geen afbeelding</span>
                      </div>
                    )}

                    {/* Discount badge */}
                    {discount && (
                      <div className="absolute top-2 right-2 bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded">
                        -{discount}%
                      </div>
                    )}

                    {/* Add to cart button */}
                    <button
                      className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-pink-600 text-white flex items-center justify-center shadow-md hover:bg-pink-700 transition-colors"
                      aria-label="Add to cart"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Product info */}
                  <div className="p-3">
                    <div className="flex items-baseline mb-1">
                      <span className="text-lg font-bold text-gray-900">€ {displayPrice}</span>
                      {isOnSale && (
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          € {formatPrice(product.prix_vente_groupe)}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{product.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">€ {formatPrice(product.prix_vente_groupe)} / st</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right scroll button */}
          {canScrollRight && (
            <button
              onClick={scrollRight}
              className="absolute top-1/2 right-0 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center z-10"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

