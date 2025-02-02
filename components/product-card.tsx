"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import type { ProductProps } from "@/types/product"

function ProductCard({ product }: { product: ProductProps }) {
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
  }

  // Define prices
  const regularPrice = Number(product.prix_vente_groupe) // Reguliere prijs
  const promoPrice = product.prix_en_promo != null ? Number(product.prix_en_promo) : null // Promotieprijs

  return (
    <div className="group relative flex flex-col bg-white rounded-lg border hover:shadow-lg transition-all duration-300">
      {/* Product Image */}
      <Link
        href={`/product/${encodeURIComponent(product.id_product_mysql)}`}
        className="relative h-[200px] w-full overflow-hidden p-4"
      >
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
        <Link href={`/product/${encodeURIComponent(product.id_product_mysql)}`}>
          <h3 className="font-medium text-[#002B7F] hover:underline min-h-[2.5rem] line-clamp-2">{product.title}</h3>
        </Link>

        {/* Delivery Status */}
        <div className="flex items-center gap-2 my-2">
          <Truck className="w-4 h-4 text-[#008A00]" />
          <span className="text-[#008A00] text-sm">Bezorgdatum</span>
        </div>

{/* Pricing */}
<div className="space-y-1">
  {regularPrice > 0 || promoPrice ? (
    promoPrice ? (
      <>
        {/* Regular Price (strikethrough) */}
        <div className="text-gray-500 line-through text-sm">
          € {regularPrice.toFixed(2).replace(".", ",")}
        </div>
        {/* Promo Price */}
        <div className="text-[#E31931] text-2xl font-bold">
          € {promoPrice.toFixed(2).replace(".", ",")}
        </div>
      </>
    ) : (
      // Only Regular Price
      <div className="text-[#E31931] text-2xl font-bold">
        € {regularPrice.toFixed(2).replace(".", ",")}
      </div>
    )
  ) : (
    // Fallback als prijzen ontbreken
    <div className="text-gray-500 text-sm">Prijs niet beschikbaar</div>
  )}
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
  )
}

export default ProductCard
