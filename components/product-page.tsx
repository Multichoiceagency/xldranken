"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Plus, Minus, AlertCircle, Heart, StoreIcon, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import type { ProductProps } from "@/types/product"
import { Spinner } from "./Spinner"

interface ProductPageProps {
  productId: string
}

export function ProductPage({ productId }: ProductPageProps) {
  const [product, setProduct] = useState<ProductProps | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const router = useRouter()

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("Geen product ID opgegeven.")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const res = await fetch(`https://api.megawin.be/product/list/?apikey=YIwYR3LZbNXllabpGviSnXBHvtqfPAIN&megatech_ARCLEUNIK=${productId}`)

        if (!res.ok) {
          const errorText = await res.text()
          throw new Error(`Product niet gevonden: ${errorText}`)
        }

        const data = await res.json()

        if (!data || !data.result.product[0] || data.result.product.length === 0) {
          throw new Error("Geen productdata ontvangen")
        }

        setProduct(data.result.product[0]) // Assuming API returns an array
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-muted-foreground">Product laden...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-sm mb-4">
          <button onClick={() => router.back()} className="text-muted-foreground hover:text-[#0F3059]">
            ⬅ Terug
          </button>
        </div>
        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            <AlertCircle className="text-red-500 h-12 w-12" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Product niet gevonden</h2>
          <p className="text-gray-600 mb-4">Het product met ID "{product}" kon niet worden gevonden.</p>
          <Button className="bg-[#0F3059] hover:bg-[#0A2547]" onClick={() => router.push("/")}>
            Terug naar de homepage
          </Button>
        </div>
      </div>
    )
  }

  const imageSrc = product.photo1_base64?.startsWith("data:image")
    ? product.photo1_base64
    : product.photo1_base64
    ? `data:image/jpeg;base64,${product.photo1_base64}`
    : "/placeholder.jpg"

  const prixVente = Number(product.prix_vente_groupe || 0)
  const prixPromo = product.prix_en_promo ? Number(product.prix_en_promo) : null
  const currentPrice = prixPromo ?? prixVente

  const handleAddToCart = () => {
    addToCart({
      id: product.id_product_mysql,
      name: product.title,
      price: currentPrice,
      image: imageSrc,
      volume: product.arcleunik,
      productCode: product.productCode,
      quantity,
    })
  }

  return (
    <div className="container mx-auto px-4 py-4 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 py-14">
        <div>
          <div className="w-full aspect-square mb-4">
            <Image
              src={imageSrc || "/placeholder.svg"}
              alt={product.title}
              width={300}
              height={300}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="bg-gray-100 px-10 py-10 rounded-xl">
          <h1 className="text-xl font-bold mb-1">{product.title}</h1>
          <div className="flex items-center mb-4">
            <div className="text-xl hover:text-green-700 font-bold text-red-600">
              € {currentPrice.toFixed(2).replace(".", ",")}
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center border rounded">
              <button className="px-2 py-1 border-r" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                <Minus className="h-4 w-4 hover:text-white" />
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                className="w-12 text-center py-1 border-none focus:ring-10 "
              />
              <button className="px-2 py-1 border-l " onClick={() => setQuantity((q) => q + 1)}>
                <Plus className="h-4 w-4 " />
              </button>
            </div>
            <Button
              className="bg-[#0F3059] hover:bg-green-700 text-white py-2 px-4 rounded w-full"
              onClick={handleAddToCart}
            >
              In winkelwagen
            </Button>
          </div>

          <Button variant="outline" className="w-full mb-4 border-gray-300 text-gray-700 hover:bg-gray-50">
            <Heart className="h-4 w-4 mr-2" />
            Aan lijst toevoegen
          </Button>

          <div className="space-y-3 text-sm">
            <div className="flex items-start">
              <Truck width={20} height={20} className="mr-2 mt-0.5" />
              <div>
                <p className="font-medium">Meestal geleverd op de 3e dag</p>
              </div>
            </div>
            <div className="flex items-center">
              <StoreIcon width={20} height={20} className="mr-2" />
              <p>
                Verkocht door: <span className="font-medium">XL GROOTHANDEL B.V.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
