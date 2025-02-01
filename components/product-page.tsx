"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Plus, Minus, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { CartPopup } from "@/components/cart-popup"
import { useCart } from "@/lib/cart-context"
import type { ProductProps } from "@/types/product"

interface ProductPageProps {
  productId: string
}

export function ProductPage({ productId }: ProductPageProps) {
  const [product, setProduct] = useState<ProductProps | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [showCartPopup, setShowCartPopup] = useState(false)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`/api/products/${productId}`)
        if (!res.ok) throw new Error("Product niet gevonden")

        const data = await res.json()
        if (!data?.product) throw new Error("Geen productdata ontvangen")

        setProduct(data.product)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  if (loading) return <div className="text-center py-8">Product wordt geladen...</div>
  if (error) return <div className="text-center py-8 text-red-500">Fout: {error}</div>
  if (!product) return <div className="text-center py-8">Geen product gevonden.</div>

  const handleAddToCart = () => {
    addToCart({
      id: product.id_product_mysql,
      name: product.title,
      price: Number.parseFloat(product.prix_vente_groupe),
      image: `data:image/jpeg;base64,${product.photo1_base64}`,
      volume: product.arcleunik,
      quantity,
    })
    setShowCartPopup(true)
  }

  const currentPrice = product.prix_en_promo
    ? Number.parseFloat(product.prix_en_promo)
    : Number.parseFloat(product.prix_vente_groupe)
  const regularPrice = Number.parseFloat(product.prix_vente_groupe)
  const discountPercentage = product.prix_en_promo
    ? Math.round(((regularPrice - Number.parseFloat(product.prix_en_promo)) / regularPrice) * 100)
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-sm mb-4">
        <Link href="/" className="text-muted-foreground hover:text-[#FF6B35]">
          Home
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="text-foreground">{product.title}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="relative aspect-square md:aspect-[3/4] rounded-lg overflow-hidden">
          <Image
            src={`data:image/jpeg;base64,${product.photo1_base64}`}
            alt={product.title}
            fill
            className="object-contain object-center p-4 md:p-8 mix-blend-multiply rounded-md"
          />
        </div>

        <div className="md:sticky md:top-20 self-start bg-gray-50 p-4 md:p-6 rounded-lg">
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <div className="text-4xl font-bold mb-6">€{currentPrice.toFixed(2).replace(".", ",")}</div>

          {discountPercentage > 0 && (
            <div className="mb-4">
              <span className="bg-[#E31931] text-white text-sm font-medium px-2 py-1 rounded">
                -{discountPercentage}%
              </span>
              <span className="ml-2 text-gray-500 line-through">€{regularPrice.toFixed(2).replace(".", ",")}</span>
            </div>
          )}

          <Accordion type="single" collapsible className="w-full mb-6">
            <AccordionItem value="description">
              <AccordionTrigger>PRODUCTINFORMATIE</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p>
                    <strong>Code:</strong> {product.productCode}
                  </p>
                  <p>
                    <strong>Volume:</strong> {product.arcleunik}
                  </p>
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
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus />
              </Button>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                className="h-11 w-16 text-center"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-11 w-11"
                onClick={() => setQuantity((q) => q + 1)}
              >
                <Plus />
              </Button>
            </div>
            <Button
              className="flex-1 bg-[#FF6B35] hover:bg-[#E85A24] text-white text-lg py-6"
              onClick={handleAddToCart}
            >
              IN WINKELMAND
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-[#FF6B35]" />
            <span>Bestel voor 22:00 vandaag, morgen in huis</span>
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
          price: currentPrice,
          volume: product.arcleunik,
        }}
        quantity={quantity}
      />
    </div>
  )
}
