"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CartPopup } from "@/components/cart-popup"
import { useCart } from "@/lib/cart-context"

interface ProductCardProps {
  product: {
    id_product_mysql: string
    title: string
    prix_vente_groupe: string
    photo1_base64: string
    arcleunik: string
    productCode: string
    prix_en_promo: number
  }
}

function ProductCard({ product }: ProductCardProps) {
  const [showCartPopup, setShowCartPopup] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({
      id: product.id_product_mysql,
      name: product.title,
      price: Number.parseFloat(product.prix_vente_groupe),
      image: `data:image/jpeg;base64,${product.photo1_base64}`,
      volume: product.arcleunik,
      quantity: 1,
    })
    setShowCartPopup(true)
  }

  return (
    <>
      <div className="group relative flex flex-col bg-white p-4 rounded-lg border hover:shadow-lg transition-shadow">
        <Link
          href={`/product/${product.productCode}`}
          className="relative h-[280px] w-full overflow-hidden rounded-lg mb-4"
        >
          <Image
            src={`data:image/jpeg;base64,${product.photo1_base64}`}
            alt={product.title}
            fill
            className="object-contain group-hover:scale-95 transition-transform duration-300"
            priority
          />
        </Link>
        <div className="flex flex-col flex-grow space-y-2">
          <Link href={`/product/${product.productCode}`} className="block">
            <h3 className="font-medium text-gray-900 group-hover:text-[#C6A66C] transition-colors">{product.title}</h3>
          </Link>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">
              €{Number.parseFloat(product.prix_vente_groupe).toFixed(2).replace(".", ",")}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 mt-auto pt-4">
            <div className="flex items-center border rounded-md">
              <input
                type="number"
                defaultValue={1}
                min={1}
                className="w-16 px-3 py-2 text-center border-0 rounded-md focus:outline-none"
              />
            </div>
            <Button className="flex-1 bg-[#FFA500] hover:bg-[#FF8C00] text-white" onClick={handleAddToCart}>
              Bekijk product
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-2">Levering binnen 1 werkdag</p>
        </div>
      </div>

      <CartPopup
        open={showCartPopup}
        onClose={() => setShowCartPopup(false)}
        product={{
          id: product.id_product_mysql,
          name: product.title,
          image: `data:image/jpeg;base64,${product.photo1_base64}`,
          price: Number.parseFloat(product.prix_vente_groupe),
          volume: product.arcleunik,
        }}
        quantity={1}
      />
    </>
  )
}

export default ProductCard

