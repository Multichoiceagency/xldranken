"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartPopup } from "@/components/cart-popup"
import { useCart } from "@/lib/cart-context"
import type { Product } from "@/types/product"

function createSlug(title: string): string {
  return encodeURIComponent(
    title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-"),
  )
}

function ProductCard({ product }: { product: Product }) {
  const [showCartPopup, setShowCartPopup] = useState(false)
  const { addToCart } = useCart()

  if (!product) return <p className="text-gray-500">Product not found</p>

  const handleAddToCart = () => {
    addToCart({
      id: product.id_product_mysql,
      name: product.title,
      price: product.prix_en_promo != null ? Number(product.prix_en_promo) : Number(product.prix_vente_groupe),
      image: `data:image/jpeg;base64,${product.photo1_base64}`,
      volume: product.arcleunik,
      quantity: 1,
    })
    setShowCartPopup(true)
  }

  // Calculate prices
  const regularPrice = Number(product.prix_vente_groupe)
  const promoPrice = product.prix_en_promo != null ? Number(product.prix_en_promo) : null
  const currentPrice = Number(product.prix_vente_groupe)
  const discountPercentage = promoPrice != null ? Math.round(((regularPrice - promoPrice) / regularPrice) * 100) : 0

  return (
    <>
      <div className="group relative flex flex-col bg-white rounded-lg border hover:shadow-lg transition-all duration-300">
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-[#E31931] text-white text-sm font-medium px-2 py-1 rounded">
            -{discountPercentage}%
          </div>
        )}

        {/* Product Image */}
        <Link href={`/product/${createSlug(product.title)}`} className="relative h-[200px] w-full overflow-hidden p-4">
          <Image
            src={`data:image/jpeg;base64,${product.photo1_base64}`}
            alt={product.title}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        </Link>

        {/* Product Details */}
        <div className="flex flex-col p-4 pt-0">
          <Link href={`/product/${createSlug(product.id_product_mysql)}`}>
            <h3 className="font-medium text-[#002B7F] hover:underline min-h-[2.5rem] line-clamp-2">{product.title}</h3>
          </Link>

          {/* Delivery Status */}
          <div className="flex items-center gap-2 my-2">
            <Truck className="w-4 h-4 text-[#008A00]" />
            <span className="text-[#008A00] text-sm">Bezorgdatum</span>
          </div>

          {/* Pricing */}
          <div className="space-y-1">
            {product.prix_en_promo != null && (
              <div className="text-gray-500 line-through text-sm">€ {regularPrice.toFixed(2).replace(".", ",")}</div>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-[#E31931] text-2xl font-bold">€ {currentPrice.toFixed(2).replace(".", ",")}</span>
            </div>
            <div className="text-gray-600 text-sm">Excl. btw</div>
          </div>

          {/* Add to Cart Button */}
          <div className="mt-4">
            <Button
              className="w-full bg-[#E2B505] hover:bg-[#E2B505]/90 text-white transition-all duration-300 hover:shadow-md"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              In winkelmand
            </Button>
          </div>
        </div>
      </div>

      <CartPopup
        open={showCartPopup}
        onClose={() => setShowCartPopup(false)}
        product={{
          id: product.id_product_mysql,
          name: product.title,
          image: `data:image/jpeg;base64,${product.photo1_base64}`,
          price: Number(product.prix_vente_groupe),
          volume: product.arcleunik,
        }}
        quantity={1}
      />
    </>
  )
}

export default ProductCard

