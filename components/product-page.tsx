"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Plus, Minus, AlertCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { CartPopup } from "@/components/cart-popup"
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
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [showCartPopup, setShowCartPopup] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const { addToCart } = useCart()
  const router = useRouter()

  // Product ophalen
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("Geen product ID opgegeven.")
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        console.log("🔎 Fetching product with ID:", productId)

        // Use the proxy API with the product ID
        const res = await fetch(`/api/proxy?id=${productId}`)

        if (!res.ok) {
          let errorData
          try {
            // Try to parse as JSON
            const errorText = await res.text()
            console.error("❌ API request failed:", errorText)

            try {
              errorData = JSON.parse(errorText)
              // Store debug info if available
              if (errorData.availableProducts) {
                setDebugInfo(errorData)
              }
            } catch (parseError) {
              // If parsing fails, use the raw text
              console.error("Failed to parse error response as JSON:", parseError)
              errorData = { error: errorText }
            }
          } catch (readError) {
            console.error("Failed to read error response:", readError)
            errorData = { error: res.statusText }
          }

          throw new Error(`Product niet gevonden: ${errorData?.error || res.statusText}`)
        }

        const data = await res.json()
        console.log("📦 API response:", data)

        if (!data?.product) {
          throw new Error("Geen productdata ontvangen")
        }

        setProduct(data.product)
      } catch (err: any) {
        console.error("❌ Error fetching product:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      // Search by ID
      router.push(`/product/${searchInput.trim()}`)
    }
  }

  // Loading & Error States
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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-sm mb-4">
          <button onClick={() => router.back()} className="text-muted-foreground hover:text-[#FF6B35]">
            ⬅ Terug
          </button>
        </div>
        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            <AlertCircle className="text-red-500 h-12 w-12" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Product niet gevonden</h2>
          <p className="text-gray-600 mb-4">Het product met ID "{productId}" kon niet worden gevonden.</p>

          {/* Product search form */}
          <div className="max-w-md mx-auto mb-8">
            <h3 className="text-lg font-medium mb-2">Zoek een ander product:</h3>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Product ID"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" className="bg-[#FF6B35] hover:bg-[#E85A24]">
                <Search className="h-4 w-4 mr-2" />
                Zoeken
              </Button>
            </form>
          </div>

          {debugInfo && debugInfo.availableProducts && (
            <div className="mt-8 max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-2">Beschikbare producten:</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-left">
                <ul className="divide-y">
                  {debugInfo.availableProducts.map((p: any) => (
                    <li key={p.id} className="py-2">
                      <p className="font-medium">{p.title}</p>
                      <p className="text-sm text-gray-500">ID: {p.id}</p>
                      <p className="text-sm text-gray-500">Code: {p.productCode || "N/A"}</p>
                      <p className="text-sm text-gray-500">Volume: {p.arcleunik || "N/A"}</p>
                      <Button
                        variant="link"
                        className="text-[#FF6B35] p-0 h-auto mt-1"
                        onClick={() => router.push(`/product/${p.id}`)}
                      >
                        Bekijk product
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="mt-6">
            <Button className="bg-[#FF6B35] hover:bg-[#E85A24] mr-4" onClick={() => router.push("/")}>
              Terug naar de homepage
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Probeer opnieuw
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-sm mb-4">
          <button onClick={() => router.back()} className="text-muted-foreground hover:text-[#FF6B35]">
            ⬅ Terug
          </button>
        </div>
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold mb-2">Geen product gevonden</h2>
          <p className="text-gray-600 mb-4">Het product met ID "{productId}" kon niet worden gevonden.</p>
          <Button className="bg-[#FF6B35] hover:bg-[#E85A24]" onClick={() => router.push("/")}>
            Terug naar de homepage
          </Button>
        </div>
      </div>
    )
  }

  // Afbeelding bepalen
  const imageSrc = product.photo1_base64?.startsWith("data:image")
    ? product.photo1_base64
    : product.photo1_base64
      ? `data:image/jpeg;base64,${product.photo1_base64}`
      : "/placeholder.jpg"

  // Prijs en eventuele korting
  const prixVente = Number(product.prix_vente_groupe || 0)
  const prixPromo = product.prix_en_promo ? Number(product.prix_en_promo) : null
  const currentPrice = prixPromo ?? prixVente
  const discountPercentage = prixPromo ? Math.round(((prixVente - prixPromo) / prixVente) * 100) : 0

  // Toevoegen aan winkelmand
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
    setShowCartPopup(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm mb-4">
        <button onClick={() => router.back()} className="text-muted-foreground hover:text-[#FF6B35]">
          ⬅ Terug
        </button>
      </div>

      {/* PRODUCT DETAIL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Linkerkolom: Hoofdafbeelding */}
        <div>
          <div className="w-full aspect-square mb-4">
            <Image
              src={imageSrc || "/placeholder.svg"}
              alt={product.title}
              width={800}
              height={800}
              className="w-full h-full object-contain rounded-lg shadow-md"
            />
          </div>
        </div>

        {/* Rechterkolom: Productdetails (sticky) */}
        <div className="flex flex-col justify-between lg:sticky lg:top-20">
          {/* Titel & Prijs */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <div className="mb-6">
              {discountPercentage > 0 && (
                <div className="mb-2">
                  <span className="bg-red-600 text-white text-sm font-medium px-2 py-1 rounded">
                    -{discountPercentage}%
                  </span>
                  <span className="ml-2 text-gray-500 line-through">€{prixVente.toFixed(2).replace(".", ",")}</span>
                </div>
              )}
              <div className="text-4xl font-bold text-[#FF6B35]">€{currentPrice.toFixed(2).replace(".", ",")}</div>
            </div>

            {/* Beschrijving */}
            <p className="text-lg text-gray-700 mb-6">{product.title || "Geen beschrijving beschikbaar."}</p>

            {/* Accordion met details en verzending */}
            <Accordion type="single" collapsible className="w-full mb-6">
              <AccordionItem value="details">
                <AccordionTrigger>Productdetails</AccordionTrigger>
                <AccordionContent>
                  <p>
                    <strong>Product ID:</strong> {product.id_product_mysql}
                  </p>
                  <p>
                    <strong>Productcode:</strong> {product.productCode || "N/A"}
                  </p>
                  <p>
                    <strong>Volume:</strong> {product.arcleunik || "N/A"}
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                <AccordionTrigger>Verzending & Retouren</AccordionTrigger>
                <AccordionContent>
                  <p>Beste klant,Bedankt voor uw interesse in onze producten! ...</p>
                  <p className="font-bold 3-xl">Retourneren binnen 30 dagen mogelijk.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Aantal + Add to Cart */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Minus />
                </Button>
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                  className="h-10 w-16 text-center"
                />
                <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setQuantity((q) => q + 1)}>
                  <Plus />
                </Button>
              </div>
              <Button
                className="bg-[#FF6B35] hover:bg-[#E85A24] text-white text-lg py-3 px-6 rounded-lg"
                onClick={handleAddToCart}
              >
                In winkelmand
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Cart Popup (indien je deze gebruikt) */}
      {showCartPopup && (
        <CartPopup
          onClose={() => setShowCartPopup(false)}
          open={showCartPopup}
          product={{
            id: product.id_product_mysql,
            name: product.title,
            image: imageSrc,
            price: currentPrice,
            volume: product.arcleunik,
          }}
          quantity={quantity}
        />
      )}
    </div>
  )
}

