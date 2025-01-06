'use client'

import { useState, useEffect, useCallback } from "react"
import { useMediaQuery } from 'react-responsive'
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Heart, Clock, Truck, Lock, ChevronDown, ChevronLeft, Plus, Minus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductCard } from "./product-card"
import { sampleProducts } from "@/data/sample-products"
import useEmblaCarousel from 'embla-carousel-react'
import { Input } from "@/components/ui/input"
import { CartPopup } from "./cart-popup"
import { useCart } from "@/lib/cart-context"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'

export function ProductPage({ product }: { product: typeof sampleProducts[0] }) {
  const [quantity, setQuantity] = useState(1)
  const [showCartPopup, setShowCartPopup] = useState(false)
  const incrementQuantity = () => setQuantity(prev => prev + 1)
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1)
  const [recentlyViewed, setRecentlyViewed] = useState<typeof sampleProducts>([])
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start', dragFree: true })
  const [recentEmblaRef, recentEmblaApi] = useEmblaCarousel({ loop: false, align: 'start' })
  const { addToCart } = useCart()
  const isMobile = useMediaQuery({ maxWidth: 767 })

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      volume: product.volume,
      quantity: quantity
    })
    setShowCartPopup(true)
  }

  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]')
    if (!viewed.includes(product.slug)) {
      const newViewed = [product.slug, ...viewed.slice(0, 3)]
      localStorage.setItem('recentlyViewed', JSON.stringify(newViewed))
      setRecentlyViewed(sampleProducts.filter(p => newViewed.includes(p.slug)))
    } else {
      setRecentlyViewed(sampleProducts.filter(p => viewed.includes(p.slug)))
    }
  }, [product])


  return (
    <div className="container mx-auto px-4 py-8">
      {/* Rich Snippet Information */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": product.name,
          "image": product.image,
          "description": "In deze speciale kadoverpakking van Hertog Jan vind je 5 flessen van Hertog Jan: De Tripel, Grand Prestige, Weizener, Karakter en de gewone Hertog Jan.",
          "brand": {
            "@type": "Brand",
            "name": "Hertog Jan"
          },
          "offers": {
            "@type": "Offer",
            "url": `https://example.com/product/${product.slug}`,
            "priceCurrency": "EUR",
            "price": product.price,
            "availability": "https://schema.org/InStock"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.7",
            "reviewCount": "22"
          }
        })
      }} />

      {/* Breadcrumb */}
      <div className="text-sm mb-4">
        <Link href="/" className="text-muted-foreground hover:text-[#FF6B35]">
          Home
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <Link href="/assortiment" className="text-muted-foreground hover:text-[#FF6B35]">
          Assortiment
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <Link href={`/categorie/${product.category.toLowerCase()}`} className="text-muted-foreground hover:text-[#FF6B35]">
          {product.category}
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      {/* Product Overview */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="relative aspect-square md:aspect-[3/4] rounded-lg overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain object-center p-4 md:p-8 mix-blend-multiply rounded-md"
          />
        </div>

        {/* Product Info */}
        <div className="md:sticky md:top-20 self-start bg-gray-50 p-4 md:p-6 rounded-lg">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <Link 
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mb-4 bg-[#25D366] text-white py-2 px-4 rounded-md hover:bg-[#128C7E] transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faWhatsapp} className="h-5 w-5" />
            <span className="font-medium">Chatten</span>
          </Link>
          <div className="text-4xl font-bold mb-6">
            €{product.price.toFixed(2).replace('.', ',')}
            <span className="text-xs align-top">{99}</span>
          </div>

          {/* Product Information */}
          <Accordion type="single" collapsible className="w-full mb-6">
            <AccordionItem value="description">
              <AccordionTrigger>PRODUCTINFORMATIE</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p><strong>Land:</strong> Nederland</p>
                  <p><strong>Type:</strong> {product.category}</p>
                  <p><strong>Inhoud:</strong> {product.volume}</p>
                  <p><strong>Alcoholpercentage:</strong> 8%</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded-md">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-11 w-11"
                onClick={decrementQuantity}
              >
                -
              </Button>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="h-11 w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-11 w-11"
                onClick={incrementQuantity}
              >
                +
              </Button>
            </div>
            <Button
              className="flex-1 bg-[#FF6B35] hover:bg-[#E85A24] text-white text-lg py-6"
              onClick={handleAddToCart}
            >
              IN WINKELMAND
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-green-500 font-medium">Online op voorraad</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-[#FF6B35]" />
                <span>Bestel voor 22:00 vandaag, morgen in huis</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Slider */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">GERELATEERDE PRODUCTEN</h2>
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {sampleProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] px-2">
                  <ProductCard {...relatedProduct} />
                </div>
              ))}
            </div>
          </div>
          {!isMobile && (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Recently Viewed Products Slider */}
      {recentlyViewed.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">RECENT BEKEKEN</h2>
          <div className="relative" ref={recentEmblaRef}>
            <div className="flex">
              {recentlyViewed.map((viewedProduct) => (
                <div key={viewedProduct.id} className="flex-[0_0_50%] min-w-0 sm:flex-[0_0_33.33%] md:flex-[0_0_25%] px-2">
                  <ProductCard {...viewedProduct} />
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2"
              onClick={() => recentEmblaApi?.scrollPrev()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
              onClick={() => recentEmblaApi?.scrollNext()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Sticky Add to Cart */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex-1 mr-4">
            <h3 className="font-bold text-sm md:text-base truncate">{product.name}</h3>
            <p className="text-lg md:text-2xl font-bold text-[#FF6B35]">
              €{product.price.toFixed(2).replace('.', ',')}
              <span className="text-xs align-top">{99}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!isMobile && (
              <div className="flex items-center border rounded-md mr-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={decrementQuantity}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="h-10 w-12 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={incrementQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
            <Button 
              className="bg-[#FF6B35] hover:bg-[#E85A24] text-white" 
              onClick={handleAddToCart}
            >
              {isMobile ? 'IN WINKELMAND' : 'TOEVOEGEN'}
            </Button>
          </div>
        </div>
      </div>
      <CartPopup
        open={showCartPopup}
        onClose={() => setShowCartPopup(false)}
        product={{
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          volume: product.volume
        }}
        quantity={quantity}
      />
    </div>
  )
}

