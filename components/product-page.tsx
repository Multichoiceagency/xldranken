"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Plus, Minus, AlertCircle, StoreIcon, Truck, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import type { ProductProps } from "@/types/product"
import { Spinner } from "./Spinner"
import { FaSearch } from "react-icons/fa"
import { useSession } from "next-auth/react"

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
  const { addToCart } = useCart()
  const router = useRouter()
  const { data: session, status } = useSession()
  const isLoggedIn = status === "authenticated"

  const pathname = usePathname()
  const searchParams = useSearchParams()

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

        console.log("data", data.result.product[0])

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
          <p className="text-gray-600 mb-4">Het product met ID "{productId}" kon niet worden gevonden.</p>
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
      id: product.id_product_mysql || "",
      name: product.title,
      price: currentPrice,
      image: imageSrc,
      volume: product.volume || "",
      productCode: product.productCode || "",
      arcleunik: product.arcleunik || "",
      quantity,
      tauxTvaArticleEcommerce: product.tauxTvaArticleEcommerce || "21", // Default to 21% if not available
    })
  }

  // Generate breadcrumb categories based on product info
  const generateBreadcrumbs = () => {
    const breadcrumbs = [
      { name: "Home", href: "/" },
    ]

    // Add product name as the final breadcrumb (not clickable)
    breadcrumbs.push({ name: product.title, href: "#" })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <div className="container mx-auto px-4 py-4 max-w-6xl">
      {/* Breadcrumb navigation */}
      <nav className="text-sm py-4">
        <ol className="flex flex-wrap items-center">
          {breadcrumbs.map((crumb, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && <ChevronRight className="h-3 w-3 mx-1 text-gray-400" />}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-gray-600">{crumb.name}</span>
              ) : (
                <Link href={crumb.href} className="text-[#0F3059] hover:underline">
                  {crumb.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Product title */}
      <h1 className="text-2xl font-bold mb-2">{product.title}</h1>

      {/* Product ID and EAN */}
      <div className="mb-4">
        <p className="text-sm">
          Artikelnr: <span className="font-semibold text-[#0F3059]">#{product.id_product_mysql}</span>
          {product.ean && (
            <>
              <span className="mx-2">|</span>
              EAN-nummer: <span className="font-semibold text-[#0F3059]">#{product.ean}</span>
            </>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Product image */}
        <div className="border p-4 rounded-md bg-white">
          <div className="w-full aspect-square relative cursor-pointer" onClick={() => setLightboxOpen(true)}>
            <Image
              src={imageSrc || "/placeholder.svg"}
              alt={product.title}
              width={500}
              height={500}
              className="w-full h-full object-contain"
            />
            <div
              className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition"
              onClick={(e) => {
                e.stopPropagation()
                setLightboxOpen(true)
              }}
            >
              <FaSearch className="h-5 w-5 text-gray-500 hover:text-[#0F3059]" />
            </div>
          </div>
        </div>

        {/* Product info - sticky en bordered */}
        <div className="relative">
          <div className="md:sticky md:top-28 border border-[#bea46a] rounded-md p-6 bg-white shadow-sm">
            <h2 className="text-2xl font-bold mb-3">{product.title}</h2>

            <div className="mb-6">
              <p className="text-gray-700">{product.description || `${product.title} bestel deze product direct.`}</p>
            </div>

            <div className="mb-6">
              {isLoggedIn ? (
                <>
                  <div className="flex items-baseline mb-2">
                    {prixPromo !== null && prixPromo !== prixVente ? (
                      <>
                        <span className="text-2xl font-bold text-[#0A5741] mr-2">
                          € {prixPromo.toFixed(2).replace(".", ",")}
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          € {prixVente.toFixed(2).replace(".", ",")}
                        </span>
                        <span className="ml-2 bg-red-600 text-white text-sm px-2 py-0.5 rounded">
                          {Math.round(((prixVente - prixPromo) / prixVente) * 100)}% korting
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-[#0A5741]">
                        € {currentPrice.toFixed(2).replace(".", ",")}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="text-sm text-gray-600">Prijs per {product.unit || "stuk"}</span>
                    {product.price_per_unit && (
                      <span className="ml-2 text-sm text-gray-600">
                        (€ {Number(product.price_per_unit).toFixed(2).replace(".", ",")} per{" "}
                        {product.unit_type || "liter"})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center mb-4">
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {product.tax_rate ? `Excl. ${product.tax_rate}% BTW` : "Excl. BTW"}
                    </span>
                  </div>
                </>
              ) : (
                <div className="bg-gray-100 p-4 rounded-md">
                  <p className="font-medium mb-2">
                    Prijzen zijn alleen zichtbaar voor ingelogde gebruikers (excl. BTW)
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      className="bg-[#0F3059] hover:bg-[#0A2547]"
                      onClick={() =>
                        router.push("/login?redirect=" + encodeURIComponent(pathname + searchParams.toString()))
                      }
                    >
                      Inloggen
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {isLoggedIn ? (
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center border rounded">
                  <button className="px-2 py-1 border-r" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    className="w-12 text-center py-1 border-none focus:ring-0"
                  />
                  <button className="px-2 py-1 border-l" onClick={() => setQuantity((q) => q + 1)}>
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button
                  className="bg-[#0F3059] hover:bg-[#0A2547] text-white py-2 px-4 rounded"
                  onClick={handleAddToCart}
                >
                  In winkelwagen
                </Button>
              </div>
            ) : null}

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

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex border-b">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "specifications" ? "border-b-2 border-[#0F3059] text-[#0F3059]" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("specifications")}
          >
            Specificaties
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "description" ? "border-b-2 border-[#0F3059] text-[#0F3059]" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("description")}
          >
            Omschrijving
          </button>
        </div>

        <div className="py-4">
          {activeTab === "specifications" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Artikelnummer</td>
                    <td className="py-2 font-medium">{product.id_product_mysql || "-"}</td>
                  </tr>
                  <tr className="border-b"></tr>
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Productnaam</td>
                    <td className="py-2 font-medium">{product.title || "-"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "description" && (
            <div className="prose max-w-none">
              <p>{product.long_description || `${product.title} ${product.description || ""}`}</p>
            </div>
          )}
        </div>
      </div>

      {/* Questions about this product */}
      <div className="bg-gray-100 p-6 rounded-md mb-8">
        <h3 className="text-xl font-bold mb-3">Vragen over dit product?</h3>
        <p className="text-gray-700">
          Bel ons op{" "}
          <a href="tel:+31618495949" className="text-[#2e83eb] hover:underline font-bold">
            +31 6 18495949
          </a>{" "}
          of stuur een{" "}
          <a
            href="https://wa.me/31618495949"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#32ff3d] font-bold hover:underline"
          >
            WhatsApp-bericht
          </a>{" "}
          of neem contact op met onze{" "}
          <Link href="/klantenservice" className="text-[#0F3059] hover:underline">
            klantenservice
          </Link>
          .
        </p>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              className="absolute top-0 right-0 -mt-12 -mr-12 bg-white rounded-full p-2 text-gray-800 hover:text-gray-600 focus:outline-none"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
            <div className="bg-white p-2 rounded-lg">
              <div className="relative w-full" style={{ height: "calc(90vh - 4rem)" }}>
                <Image src={imageSrc || "/placeholder.svg"} alt={product.title} fill className="object-contain" />
              </div>
            </div>
            <div className="text-center mt-4 text-white">
              <h3 className="text-xl font-medium">{product.title}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
