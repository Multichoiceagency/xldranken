"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Plus, Minus, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { CartPopup } from "@/components/cart-popup"
import { useCart } from "@/lib/cart-context"
import type { ProductProps } from "@/types/product"
import { Spinner } from "@/components/Spinner"

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
  const router = useRouter()
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("Geen product-ID opgegeven.")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const res = await fetch(`/api/proxy?id=${productId}`)
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

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    )
  if (error) return <div className="text-center py-8 text-red-500">❌ {error}</div>
  if (!product) return <div className="text-center py-8">Geen product gevonden.</div>

  const prixVente = Number(product.prix_vente_groupe || 0)
  const prixPromo = product.prix_en_promo ? Number(product.prix_en_promo) : null
  const currentPrice = prixPromo ?? prixVente
  const discountPercentage = prixPromo
    ? Math.round(((prixVente - prixPromo) / prixVente) * 100)
    : 0

  const handleAddToCart = () => {
    if (!product) return

    addToCart({
      id: product.id_product_mysql,
      name: product.title,
      price: currentPrice,
      image: `data:image/jpeg;base64,${product.photo1_base64}`,
      volume: product.arcleunik,
      quantity,
    })
    setShowCartPopup(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const { offsetX, offsetY, currentTarget } = e.nativeEvent
    const { offsetWidth, offsetHeight } = currentTarget as HTMLDivElement
    const x = (offsetX / offsetWidth) * 100
    const y = (offsetY / offsetHeight) * 100
    setHoverPosition({ x, y })
  }

  const handleMouseLeave = () => setHoverPosition(null)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm mb-4">
        <button onClick={() => router.back()} className="text-muted-foreground hover:text-[#FF6B35]">
          ⬅ Terug
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Product Image with Magnifier */}
        <div className="md:col-span-2 relative">
          <div
            className="relative aspect-square md:aspect-[16/9] rounded-lg overflow-hidden group"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <Image
              src={`data:image/jpeg;base64,${product.photo1_base64}`}
              alt={product.title}
              fill
              className="object-contain object-center p-4 md:p-6 rounded-md"
            />
            {hoverPosition && (
              <div
                className="absolute inset-0 bg-transparent z-10"
                style={{
                  backgroundImage: `url(data:image/jpeg;base64,${product.photo1_base64})`,
                  backgroundPosition: `${hoverPosition.x}% ${hoverPosition.y}%`,
                  backgroundSize: "200%",
                  borderRadius: "8px",
                }}
              />
            )}
          </div>
        </div>

        {/* Sticky Product Price */}
        <div className="md:sticky md:top-20 self-start bg-gray-50 p-4 md:p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

          <div className="mb-6">
            {discountPercentage > 0 && (
              <div className="mb-2">
                <span className="bg-[#E31931] text-white text-sm font-medium px-2 py-1 rounded">
                  -{discountPercentage}%
                </span>
                <span className="ml-2 text-gray-500 line-through">
                  €{prixVente.toFixed(2).replace(".", ",")}
                </span>
              </div>
            )}
            <div className="text-4xl font-bold text-[#FF6B35]">
              €{currentPrice.toFixed(2).replace(".", ",")}
            </div>
            <div className="text-gray-500 text-sm mb-6">Excl. btw</div>

            {/* Accordion: Toegevoegd onder Excl. btw */}
            <Accordion type="single" collapsible className="w-full mb-6">
              <AccordionItem value="title">
                <AccordionTrigger>Productnaam</AccordionTrigger>
                <AccordionContent>
                  {product.title}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="specifications">
                <AccordionTrigger>KENMERKEN</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p><strong>Code:</strong> {product.productCode}</p>
                    <p><strong>Volume:</strong> {product.arcleunik}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Quantity Selector */}
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

          {/* Delivery Info */}
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-[#FF6B35]" />
            <span>Bestel voor 22:00 vandaag, morgen in de winkel</span>
          </div>
        </div>
      </div>

      {/* Cart Popup */}
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
