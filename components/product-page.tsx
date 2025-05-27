"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import {
  Plus,
  Minus,
  AlertCircle,
  Store,
  Truck,
  ChevronRight,
  X,
  ShoppingCart,
  Star,
  Heart,
  Share2,
  ArrowLeft,
  Package,
  Shield,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import type { ProductProps } from "@/types/product"
import { Spinner } from "./Spinner"
import { FaSearch } from "react-icons/fa"
import { useAuthContext } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"

interface ProductPageProps {
  productId: string
}

export function ProductPage({ productId }: ProductPageProps) {
  const [product, setProduct] = useState<ProductProps | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<"specifications" | "description">("specifications")
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const { addToCart, isInCart, cart, updateQuantity } = useCart()
  const { isLoggedIn, loading: authLoading } = useAuthContext()
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const inCartInfo = isInCart(productId)
  const cartQuantity = inCartInfo ? cart.find((item) => item.id === productId)?.quantity || 0 : 0

  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [lightboxOpen])

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("Geen product ID opgegeven.")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const res = await fetch(
          `https://api.megawin.be/product/list/?apikey=YIwYR3LZbNXllabpGviSnXBHvtqfPAIN&megatech_ARCLEUNIK=${productId}`,
        )

        if (!res.ok) {
          const errorText = await res.text()
          throw new Error(`Product niet gevonden: ${errorText}`)
        }

        const data = await res.json()

        if (!data || !data.result.product[0] || data.result.product.length === 0) {
          throw new Error("Geen productdata ontvangen")
        }

        setProduct(data.result.product[0])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gradient-to-r from-[#C6B07F] to-[#d4c291] p-4 rounded-full mb-6 inline-block">
            <Spinner />
          </div>
          <h2 className="text-xl font-bold text-[#0F3059] mb-2">Product laden...</h2>
          <p className="text-gray-600">Even geduld, we halen de productinformatie op</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-[#C6B07F] hover:text-[#0F3059] hover:bg-[#C6B07F]/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Terug
            </Button>
          </div>

          <div className="max-w-md mx-auto text-center py-16">
            <div className="bg-gradient-to-br from-red-50 to-pink-50 p-8 rounded-full w-32 h-32 mx-auto mb-8 flex items-center justify-center">
              <AlertCircle className="text-red-500 h-16 w-16" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-[#0F3059]">Product niet gevonden</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Het product met ID "{productId}" kon niet worden gevonden. Mogelijk is het product niet meer beschikbaar.
            </p>
            <div className="space-y-3">
              <Button
                className="w-full bg-gradient-to-r from-[#0F3059] to-[#1a4a7a] hover:from-[#1a4a7a] hover:to-[#0F3059] text-white"
                onClick={() => router.push("/")}
              >
                Terug naar de homepage
              </Button>
              <Button
                variant="outline"
                className="w-full border-[#C6B07F] text-[#C6B07F] hover:bg-[#C6B07F] hover:text-[#0F3059]"
                onClick={() => router.back()}
              >
                Vorige pagina
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const imageSrc = product.photo1_base64?.startsWith("data:image")
    ? product.photo1_base64
    : product.photo1_base64
      ? `data:image/jpeg;base64,${product.photo1_base64}`
      : "/placeholder.svg"
  const prixVente = Number(product.prix_vente_groupe || 0)
  const prixPromo = product.prix_en_promo ? Number(product.prix_en_promo) : null
  const currentPrice = prixPromo ?? prixVente

  const handleAddToCart = () => {
    if (inCartInfo) {
      // Update quantity if already in cart
      updateQuantity(productId, quantity)
      toast({
        title: "Hoeveelheid bijgewerkt",
        description: `${product.title}: ${quantity} stuks`,
      })
    } else {
      // Add new item to cart
      addToCart({
        id: productId,
        name: product.title,
        price: currentPrice,
        image: imageSrc,
        volume: product.volume || "",
        productCode: product.productCode || "",
        arcleunik: product.arcleunik || "",
        fam2id: product.fam2id,
      })

      // Update quantity if more than 1
      if (quantity > 1) {
        setTimeout(() => {
          updateQuantity(productId, quantity)
        }, 100)
      }

      toast({
        title: "Product toegevoegd",
        description: `${product.title}: ${quantity} stuks toegevoegd aan je winkelwagen`,
      })
    }
  }

  const generateBreadcrumbs = () => {
    const breadcrumbs = [
      { name: "Home", href: "/" },
      { name: "Producten", href: "/search" },
    ]

    breadcrumbs.push({ name: product.title, href: "#" })
    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Breadcrumb navigation */}
        <nav className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-gray-600 font-medium">{crumb.name}</span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-[#C6B07F] hover:text-[#0F3059] transition-colors duration-300 font-medium"
                  >
                    {crumb.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Back button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-[#C6B07F] hover:text-[#0F3059] hover:bg-[#C6B07F]/10 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image Section */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg border border-[#C6B07F]/10 overflow-hidden group">
              <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 p-8">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C6B07F] to-[#0F3059]"></div>
                </div>

                <div className="relative w-full h-full cursor-pointer group" onClick={() => setLightboxOpen(true)}>
                  <Image
                    src={imageSrc || "/placeholder.svg"}
                    alt={product.title}
                    fill
                    className="object-contain transition-transform duration-700 group-hover:scale-105"
                    unoptimized
                  />

                  {/* Zoom overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                      <FaSearch className="h-5 w-5 text-[#0F3059]" />
                    </div>
                  </div>
                </div>

                {/* Product badges */}
                {inCartInfo && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    In winkelwagen ({cartQuantity})
                  </div>
                )}

                {prixPromo && prixPromo !== prixVente && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    {Math.round(((prixVente - prixPromo) / prixVente) * 100)}% korting
                  </div>
                )}
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-[#C6B07F]/30 text-[#C6B07F] hover:bg-[#C6B07F] hover:text-[#0F3059] transition-all duration-300"
              >
                <Heart className="w-4 h-4 mr-2" />
                Favoriet
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-[#C6B07F]/30 text-[#C6B07F] hover:bg-[#C6B07F] hover:text-[#0F3059] transition-all duration-300"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Delen
              </Button>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-[#C6B07F]/10 p-8">
              {/* Product title and rating */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-[#0F3059] mb-4 leading-tight">{product.title}</h1>

                {/* Rating stars */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#C6B07F] text-[#C6B07F]" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(4.8) • 127 beoordelingen</span>
                </div>

                {/* Product ID and EAN */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>
                    Art.nr:{" "}
                    <span className="font-semibold text-[#0F3059]">#{product.id_product_mysql || productId}</span>
                  </span>
                  {product.ean && (
                    <span>
                      EAN: <span className="font-semibold text-[#0F3059]">#{product.ean}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6 p-4 bg-gradient-to-r from-[#C6B07F]/5 to-[#d4c291]/5 rounded-xl border border-[#C6B07F]/20">
                <p className="text-gray-700 leading-relaxed">
                  {product.description || `${product.title} - Bestel dit premium product direct online.`}
                </p>
              </div>

              {/* Price section */}
              <div className="mb-8">
                {!authLoading && !isLoggedIn ? (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="text-blue-800 font-bold mb-2 flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Log in om prijzen te zien
                    </h3>
                    <p className="text-blue-600 text-sm mb-4">
                      Meld je aan om exclusieve prijzen te bekijken en dit product te bestellen
                    </p>
                    <div className="flex gap-3">
                      <Button
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white"
                        onClick={() =>
                          router.push("/login?redirect=" + encodeURIComponent(pathname + searchParams.toString()))
                        }
                      >
                        Inloggen
                      </Button>
                      <Button
                        variant="outline"
                        className="border-blue-300 text-blue-600 hover:bg-blue-50"
                        onClick={() => router.push("/zakelijk")}
                      >
                        Account aanmaken
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-baseline gap-3">
                      {prixPromo !== null && prixPromo !== prixVente ? (
                        <>
                          <span className="text-4xl font-bold bg-gradient-to-r from-[#0F3059] to-[#1a4a7a] bg-clip-text text-transparent">
                            €{prixPromo.toFixed(2).replace(".", ",")}
                          </span>
                          <span className="text-xl text-gray-500 line-through">
                            €{prixVente.toFixed(2).replace(".", ",")}
                          </span>
                        </>
                      ) : (
                        <span className="text-4xl font-bold bg-gradient-to-r from-[#0F3059] to-[#1a4a7a] bg-clip-text text-transparent">
                          €{currentPrice.toFixed(2).replace(".", ",")}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Prijs per {product.unit || "stuk"}</span>
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {product.tax_rate ? `Excl. ${product.tax_rate}% BTW` : "Excl. BTW"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity and Add to Cart */}
              {!authLoading && isLoggedIn && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#0F3059]">Aantal:</span>
                    <div className="flex items-center bg-white border-2 border-[#C6B07F]/30 rounded-xl overflow-hidden shadow-sm">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 hover:bg-[#C6B07F]/10 text-[#0F3059] disabled:opacity-50"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={quantity}
                        onChange={(e) => {
                          if (/^\d*$/.test(e.target.value)) {
                            setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))
                          }
                        }}
                        className="w-16 text-center font-bold border-0 focus:ring-0 text-[#0F3059] bg-[#C6B07F]/5 focus:bg-[#C6B07F]/10 transition-colors h-12"
                        style={{ fontSize: "16px" }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 hover:bg-[#C6B07F]/10 text-[#0F3059]"
                        onClick={() => setQuantity((q) => q + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-[#0F3059] to-[#1a4a7a] hover:from-[#1a4a7a] hover:to-[#0F3059] text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {inCartInfo ? `Bijwerken (${cartQuantity} in wagen)` : `Voeg ${quantity} toe aan winkelwagen`}
                  </Button>

                  {/* Total price preview */}
                  {quantity > 1 && (
                    <div className="bg-gradient-to-r from-[#C6B07F]/10 to-[#d4c291]/10 border border-[#C6B07F]/20 rounded-lg p-4 text-center">
                      <span className="text-sm text-gray-600">Totaalprijs: </span>
                      <span className="font-bold text-[#0F3059] text-lg">
                        €{(currentPrice * quantity).toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Delivery info */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                  <div className="bg-green-500 p-2 rounded-lg">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-800">Snelle levering</p>
                    <p className="text-sm text-green-700">Meestal geleverd binnen 2-3 werkdagen</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#C6B07F]/5 to-[#d4c291]/5 border border-[#C6B07F]/20 rounded-xl">
                  <div className="bg-gradient-to-r from-[#C6B07F] to-[#d4c291] p-2 rounded-lg">
                    <Store className="w-5 h-5 text-[#0F3059]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0F3059]">Verkocht door XL Groothandel B.V.</p>
                    <p className="text-sm text-gray-600">Betrouwbare leverancier sinds 2020</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#C6B07F]/10 overflow-hidden">
          <div className="border-b border-[#C6B07F]/20">
            <div className="flex">
              <button
                className={`py-4 px-8 font-semibold transition-all duration-300 ${
                  activeTab === "specifications"
                    ? "border-b-2 border-[#C6B07F] text-[#0F3059] bg-gradient-to-r from-[#C6B07F]/5 to-[#d4c291]/5"
                    : "text-gray-500 hover:text-[#C6B07F] hover:bg-[#C6B07F]/5"
                }`}
                onClick={() => setActiveTab("specifications")}
              >
                Specificaties
              </button>
              <button
                className={`py-4 px-8 font-semibold transition-all duration-300 ${
                  activeTab === "description"
                    ? "border-b-2 border-[#C6B07F] text-[#0F3059] bg-gradient-to-r from-[#C6B07F]/5 to-[#d4c291]/5"
                    : "text-gray-500 hover:text-[#C6B07F] hover:bg-[#C6B07F]/5"
                }`}
                onClick={() => setActiveTab("description")}
              >
                Beschrijving
              </button>
            </div>
          </div>

          <div className="p-8">
            {activeTab === "specifications" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#0F3059] mb-4">Product informatie</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600">Artikelnummer</span>
                      <span className="font-semibold text-[#0F3059]">{product.id_product_mysql || productId}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600">Productnaam</span>
                      <span className="font-semibold text-[#0F3059]">{product.title}</span>
                    </div>
                    {product.ean && (
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-600">EAN-code</span>
                        <span className="font-semibold text-[#0F3059]">{product.ean}</span>
                      </div>
                    )}
                    {product.volume && (
                      <div className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-600">Volume</span>
                        <span className="font-semibold text-[#0F3059]">{product.volume}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#0F3059] mb-4">Leveringsinformatie</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                      <Clock className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-800">Levertijd</p>
                        <p className="text-sm text-green-700">2-3 werkdagen</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-semibold text-blue-800">Garantie</p>
                        <p className="text-sm text-blue-700">Standaard garantievoorwaarden</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "description" && (
              <div className="prose max-w-none">
                <h3 className="text-lg font-bold text-[#0F3059] mb-4">Productbeschrijving</h3>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  <p>
                    {product.long_description ||
                      product.description ||
                      `${product.title} - Een premium product van hoge kwaliteit.`}
                  </p>

                  <div className="bg-gradient-to-r from-[#C6B07F]/5 to-[#d4c291]/5 border border-[#C6B07F]/20 rounded-lg p-6 mt-6">
                    <h4 className="font-semibold text-[#0F3059] mb-3">Waarom kiezen voor dit product?</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#C6B07F] rounded-full"></div>
                        <span>Premium kwaliteit en betrouwbaarheid</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#C6B07F] rounded-full"></div>
                        <span>Snelle en veilige levering</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#C6B07F] rounded-full"></div>
                        <span>Uitstekende klantenservice</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#C6B07F] rounded-full"></div>
                        <span>Concurrerende prijzen</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact section */}
        <div className="mt-12 bg-gradient-to-r from-[#0F3059] to-[#1a4a7a] text-white rounded-2xl p-8">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Vragen over dit product?</h3>
            <p className="text-[#C6B07F] mb-6 leading-relaxed">
              Ons team staat klaar om al uw vragen te beantwoorden en u te helpen bij uw keuze.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+31618495949"
                className="bg-gradient-to-r from-[#C6B07F] to-[#d4c291] hover:from-[#d4c291] hover:to-[#C6B07F] text-[#0F3059] font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
              >
                Bel ons: +31 6 18495949
              </a>
              <a
                href="https://wa.me/31618495949"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
              >
                WhatsApp bericht
              </a>
              <Link
                href="/klantenservice"
                className="border-2 border-[#C6B07F] text-[#C6B07F] hover:bg-[#C6B07F] hover:text-[#0F3059] font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
              >
                Klantenservice
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full">
            <button
              className="absolute -top-12 right-0 bg-white/10 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/20 transition-all duration-300 z-10"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>

            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative w-full h-[70vh]">
                <Image
                  src={imageSrc || "/placeholder.svg"}
                  alt={product.title}
                  fill
                  className="object-contain p-8"
                  unoptimized
                />
              </div>

              <div className="p-6 bg-gradient-to-r from-[#C6B07F]/5 to-[#d4c291]/5 border-t border-[#C6B07F]/20">
                <h3 className="text-xl font-bold text-[#0F3059] mb-2">{product.title}</h3>
                <p className="text-gray-600">Klik buiten de afbeelding om te sluiten</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        /* Mobile optimizations */
        @media (max-width: 640px) {
          .animate-fade-in {
            animation: fadeIn 0.4s ease-out forwards;
          }
        }
      `}</style>
    </div>
  )
}
