"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ShoppingCart, Check, Plus, Minus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"
import type { ProductProps } from "@/types/product"
import { useAuthContext } from "@/context/AuthContext"

export default function ProductCard({ product }: { product: ProductProps }) {
  const { addToCart, isInCart, cart, updateQuantity, removeFromCart } = useCart()
  const { toast } = useToast()
  const { isLoggedIn, loading } = useAuthContext()
  const [isAnimating, setIsAnimating] = useState(false)
  const [quantityInput, setQuantityInput] = useState("1")
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [inCartInfo, setInCartInfo] = useState({ inCart: false, quantity: 0 })
  const [imageError, setImageError] = useState(false)
  const [imageBlobUrl, setImageBlobUrl] = useState<string>("")

  useEffect(() => {
    if (!product || !product.arcleunik) return

    const inCart = isInCart(product.arcleunik)
    const itemInCart = cart.find((item) => item.arcleunik === product.arcleunik)
    const quantity = itemInCart ? itemInCart.quantity : 0

    setInCartInfo({ inCart, quantity })

    if (inCart && quantity > 0) {
      setQuantityInput(quantity.toString())
    } else if (!inCart) {
      setQuantityInput("1")
    }
  }, [cart, isInCart, product])

  useEffect(() => {
    // Early return if no base64 data
    if (!product?.photo1_base64) {
      setImageBlobUrl("")
      return
    }

    const convertBase64ToBlob = () => {
      try {
        let base64Data: string = product.photo1_base64!
        let mimeType = "image/jpeg" // default

        // Handle data URL format
        if (base64Data.startsWith("data:image")) {
          const parts = base64Data.split(",")
          if (parts.length !== 2) {
            console.warn("Invalid data URL format")
            return
          }

          const [header, data] = parts
          const mimeMatch = header.match(/data:image\/([^;]+)/)
          if (mimeMatch) {
            mimeType = `image/${mimeMatch[1]}`
          }
          base64Data = data
        }

        // Validate base64 format and ensure we have data
        if (!base64Data || !/^[A-Za-z0-9+/=]+$/.test(base64Data.substring(0, Math.min(20, base64Data.length)))) {
          console.warn("Invalid base64 format")
          return
        }

        // Convert base64 to blob
        const byteCharacters = atob(base64Data)
        const byteNumbers = new Array(byteCharacters.length)

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }

        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], { type: mimeType })
        const blobUrl = URL.createObjectURL(blob)

        setImageBlobUrl(blobUrl)
      } catch (error) {
        console.warn("Failed to convert base64 to blob:", error)
        setImageBlobUrl("")
      }
    }

    convertBase64ToBlob()

    // Cleanup function to revoke blob URL
    return () => {
      if (imageBlobUrl) {
        URL.revokeObjectURL(imageBlobUrl)
      }
    }
  }, [product?.photo1_base64]) // Remove imageBlobUrl from dependencies to avoid cleanup issues

  // Cleanup blob URL when component unmounts
  useEffect(() => {
    return () => {
      if (imageBlobUrl) {
        URL.revokeObjectURL(imageBlobUrl)
      }
    }
  }, [imageBlobUrl])

  if (!product) return <p className="text-gray-500">Product niet beschikbaar</p>

  const getImageSrc = () => {
    // Use blob URL if available
    if (imageBlobUrl) {
      return imageBlobUrl
    }

    // Fallback to placeholder
    return `/placeholder.svg?width=300&height=300&query=${encodeURIComponent(product.title)}`
  }

  const imageSrc = getImageSrc()
  const prixVente = Number(product.prix_vente_groupe || 0)
  const prixPromo = product.prix_en_promo ? Number(product.prix_en_promo) : null
  const currentPrice = prixPromo ?? prixVente

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!product.arcleunik) {
      toast({ title: "Fout", description: "Product ID ontbreekt.", variant: "destructive" })
      return
    }

    const quantity = Math.max(1, Number.parseInt(quantityInput) || 1)
    setIsAnimating(true)

    if (inCartInfo.inCart) {
      updateQuantity(product.arcleunik, quantity)
      toast({
        title: "Hoeveelheid bijgewerkt",
        description: `${product.title}: ${quantity} stuks`,
      })
    } else {
      addToCart({
        ...product,
        id: product.arcleunik!,
        name: product.title,
        price: currentPrice,
        image: imageSrc,
        volume: product.volume || "",
        productCode: product.productCode || "",
        arcleunik: product.arcleunik!,
        fam2id: product.fam2id,
      })

      if (quantity > 1) {
        setTimeout(() => {
          updateQuantity(product.arcleunik!, quantity)
        }, 100)
      }

      toast({
        title: "Product toegevoegd",
        description: `${product.title}: ${quantity} stuks toegevoegd aan je winkelwagen`,
      })
    }

    setTimeout(() => setIsAnimating(false), 1000)
  }

  const handleQuantityChange = (val: number) => {
    const newVal = Math.max(1, val)
    setQuantityInput(newVal.toString())

    if (inCartInfo.inCart && product.arcleunik) {
      updateQuantity(product.arcleunik, newVal)
      toast({
        title: "Hoeveelheid bijgewerkt",
        description: `${product.title}: ${newVal} stuks`,
      })
    }
  }

  const handleRemoveFromCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (product.arcleunik) {
      removeFromCart(product.arcleunik)
      setQuantityInput("1")
      toast({
        title: "Product verwijderd",
        description: `${product.title} is verwijderd uit je winkelwagen`,
      })
    }
  }

  const navigateToProductPage = () => {
    if (product.arcleunik) {
      router.push(`/product/${product.arcleunik}`)
    } else {
      toast({ title: "Navigatiefout", description: "Product ID niet gevonden.", variant: "destructive" })
    }
  }

  return (
    <div
      className="group relative flex flex-col bg-white rounded-2xl border-2 border-[#C6B07F]/10 hover:border-[#C6B07F]/30 transition-all duration-500 h-full w-full shadow-lg hover:shadow-2xl transform hover:-translate-y-2 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {inCartInfo.inCart && (
        <div className="absolute top-3 left-3 z-20 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
          In winkelwagen
        </div>
      )}

      {prixPromo !== null && prixPromo < prixVente && (
        <div className="absolute top-3 right-3 z-20 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          Promo!
        </div>
      )}

      <div
        className={`absolute top-3 right-3 z-20 flex flex-col gap-2 transition-all duration-300 ${isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"} ${prixPromo !== null && prixPromo < prixVente ? "pt-8" : ""}`}
      >
        {isLoggedIn && inCartInfo.inCart && (
          <button
            onClick={handleRemoveFromCart}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all duration-300 group/btn"
          >
            <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          </button>
        )}
      </div>

      <div
        className="relative h-[200px] sm:h-[220px] md:h-[240px] w-full overflow-hidden cursor-pointer bg-white"
        onClick={navigateToProductPage}
      >
        <div className="absolute inset-0 opacity-5 bg-white">
          <div className="absolute inset-0 bg-gradient-to-br bg-white"></div>
        </div>

        <Image
          src={imageError ? `/placeholder.svg?width=300&height=300&query=fallback` : imageSrc}
          alt={product.title}
          fill
          className={`object-contain p-4 transition-all duration-700 ${
            isAnimating ? "scale-110 rotate-3" : isHovered ? "scale-105" : "scale-100"
          }`}
          onError={() => setImageError(true)}
          priority={false}
          loading="lazy"
        />

        <div
          className={`absolute inset-0 bg-gradient-to-t from-[#0F3059]/20 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
        />

        {isAnimating && (
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-500/20 flex items-center justify-center z-10 animate-pulse">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full p-3 animate-bounce shadow-2xl">
              <Check className="w-6 h-6" />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col p-4 sm:p-5 flex-grow bg-gradient-to-b bg-white">
        <h3
          className="text-left font-bold text-[#0F3059] min-h-[3rem] line-clamp-2 text-sm sm:text-base cursor-pointer mb-3 hover:text-[#C6B07F] transition-colors duration-300 leading-tight"
          onClick={navigateToProductPage}
        >
          {product.title}
        </h3>

        <div className="flex items-center justify-between mb-4 mt-auto">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
              <span className="text-xs text-gray-400">Laden...</span>
            </div>
          ) : isLoggedIn ? (
            (() => {
              if (!isNaN(currentPrice) && currentPrice > 0) {
                return (
                  <div className="flex flex-col">
                    {prixPromo !== null && prixPromo < prixVente ? (
                      <>
                        <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                          €{currentPrice.toFixed(2).replace(".", ",")}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          €{prixVente.toFixed(2).replace(".", ",")}
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold bg-gradient-to-r from-[#0F3059] to-[#1a4a7a] bg-clip-text text-transparent">
                        €{currentPrice.toFixed(2).replace(".", ",")}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">per stuk</span>
                  </div>
                )
              } else {
                return (
                  <div className="bg-gray-100 px-3 py-2 rounded-lg">
                    <span className="text-gray-500 text-sm font-medium">Prijs onbekend</span>
                  </div>
                )
              }
            })()
          ) : (
            <div className="bg-white px-3 py-2 rounded-lg">
              <span className="text-gray-500 text-sm font-medium"></span>
            </div>
          )}
        </div>

        {!loading && isLoggedIn && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#0F3059]">Aantal:</span>
              <div className="flex items-center bg-white border-2 border-[#C6B07F]/30 rounded-xl overflow-hidden shadow-sm">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 hover:bg-[#C6B07F]/10 text-[#0F3059] disabled:opacity-50 transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation()
                    const val = Math.max(1, Number.parseInt(quantityInput) - 1)
                    handleQuantityChange(val)
                  }}
                  disabled={Number.parseInt(quantityInput) <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <input
                  ref={inputRef}
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={quantityInput}
                  onChange={(e) => {
                    if (/^\d*$/.test(e.target.value)) {
                      const val = e.target.value
                      setQuantityInput(val)
                    }
                  }}
                  onBlur={() => {
                    const val = Math.max(1, Number.parseInt(quantityInput) || 1)
                    handleQuantityChange(val)
                  }}
                  onKeyDown={(e) => e.key === "Enter" && inputRef.current?.blur()}
                  className="w-12 text-center font-bold border-0 focus:ring-0 text-[#0F3059] bg-[#C6B07F]/5 focus:bg-[#C6B07F]/10 transition-colors"
                  style={{ fontSize: "16px" }}
                  aria-label="Aantal"
                />

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 hover:bg-[#C6B07F]/10 text-[#0F3059] transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation()
                    const val = Number.parseInt(quantityInput) + 1
                    handleQuantityChange(val)
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-[#0F3059] to-[#1a4a7a] hover:from-[#1a4a7a] hover:to-[#0F3059] text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl transform active:scale-95 group/cart"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5 mr-2 group-hover/cart:scale-110 transition-transform duration-300" />
              <span className="text-sm">{inCartInfo.inCart ? "Bijwerken" : `Voeg ${quantityInput} toe`}</span>
            </Button>

            {currentPrice > 0 && Number.parseInt(quantityInput) >= 1 && (
              <div className="bg-gradient-to-r from-[#C6B07F]/10 to-[#d4c291]/10 border border-[#C6B07F]/20 rounded-lg p-3 text-center">
                <span className="text-xs text-gray-600">Totaal: </span>
                <span className="font-bold text-[#0F3059]">
                  €{(currentPrice * Number.parseInt(quantityInput)).toFixed(2).replace(".", ",")}
                </span>
              </div>
            )}
          </div>
        )}

        {!loading && !isLoggedIn && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 text-center">
            <Button
              onClick={() => router.push("/login")}
              className="w-full bg-gradient-to-r from-[#0F3059] to-[#1a4a7a] hover:from-[#1a4a7a] hover:to-[#0F3059] text-white font-semibold py-2 rounded-lg transition-all duration-100 hover:scale-105"
            >
              Log in om te bestellen
            </Button>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C6B07F] via-[#d4c291] to-[#C6B07F] opacity-0 group-hover:opacity-100 transition-opacity duration-100"></div>
    </div>
  )
}
