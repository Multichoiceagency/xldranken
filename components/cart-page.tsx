"use client"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Truck, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCcVisa, faCcMastercard, faCcPaypal } from "@fortawesome/free-brands-svg-icons"
import { faCreditCard } from "@fortawesome/free-solid-svg-icons"

// Free shipping threshold and shipping cost constants
const FREE_SHIPPING_THRESHOLD = 750
const SHIPPING_COST = 69.95

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart()
  const { totalItems, totalPrice } = getCartTotal()
  const router = useRouter()

  const shippingCost = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = totalPrice + shippingCost
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - totalPrice

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-sm mb-4">
        <Link href="/" className="text-primary hover:underline">
          Verder winkelen
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-8">WINKELWAGEN</h1>

      {cart.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-medium mb-2">Uw winkelwagen is leeg</h2>
          <p className="text-gray-500 mb-6">Bekijk onze producten en voeg items toe aan uw winkelwagen</p>
          <Button onClick={() => router.push("/")} className="bg-[#FF6B35] hover:bg-[#E85A24] text-white">
            VERDER WINKELEN
          </Button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="flex-1">
            {/* Cart Items */}
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 pb-6 border-b">
                  <Link
                    href={`/product/${item.arcleunik || item.id}`}
                    className="relative w-20 h-[120px] flex-shrink-0"
                  >
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
                  </Link>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <Link href={`/product/${item.arcleunik || item.id}`} className="hover:text-primary">
                          <h3 className="font-medium">{item.name}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">{item.volume}</p>
                        {item.arcleunik && <p className="text-xs text-muted-foreground">Art.nr: {item.arcleunik}</p>}
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">€{item.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center border rounded-md">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                          className="w-16 text-center h-10 border-0"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button variant="destructive" onClick={() => removeFromCart(item.id)}>
                        VERWIJDEREN
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Sticky Overview */}
          <div className="lg:w-[380px]">
            <div className="lg:sticky lg:top-20 bg-gray-50 rounded-lg p-6">
              <h2 className="font-bold mb-4">JOUW OVERZICHT</h2>

              {/* Delivery Info */}
              <div className="flex items-start gap-2 text-sm mb-4">
                <Clock className="w-4 h-4 mt-0.5 text-green-600" />
                <div>
                  <span className="text-green-600">Bestel voor 22:00 vandaag, </span>
                  morgen in huis
                </div>
              </div>

              {/* Free Shipping Progress */}
              <div className="mb-6">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-600 transition-all duration-300"
                    style={{ width: `${Math.min((totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <div className="flex items-center gap-1 text-green-600">
                    <Truck className="w-4 h-4" />
                    <span>Gratis verzending vanaf € {FREE_SHIPPING_THRESHOLD.toFixed(2)}</span>
                  </div>
                  <span className="font-medium">
                    {totalPrice >= FREE_SHIPPING_THRESHOLD
                      ? "Behaald!"
                      : `Nog € ${remainingForFreeShipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Totaal Producten ({totalItems})</span>
                  <span>€ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Bezorgkosten</span>
                  <span className={shippingCost === 0 ? "text-green-600 font-medium" : ""}>
                    {shippingCost === 0 ? "Gratis" : `€ ${SHIPPING_COST.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Totaal</span>
                  <span>€ {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                className="w-full mt-6 bg-[#FF6B35] hover:bg-[#E85A24] text-white"
                onClick={() => router.push("/checkout")}
              >
                VERDER MET BESTELLEN
              </Button>

              {/* Payment Methods - FontAwesome Icons */}
              <div className="mt-6">
                <p className="text-xs text-center mb-3 text-muted-foreground">Veilig betalen met</p>
                <div className="flex justify-center gap-3">
                  {/* iDEAL - Dutch payment method */}
                  <div className="flex items-center justify-center w-12 h-8 bg-white rounded border">
                    <span className="text-xs font-bold text-[#0066FF]">iDEAL</span>
                  </div>

                  {/* Credit Cards */}
                  <FontAwesomeIcon icon={faCcVisa} className="w-10 h-8 text-[#1434CB]" />
                  <FontAwesomeIcon icon={faCcMastercard} className="w-10 h-8 text-[#EB001B]" />

                  {/* PayPal */}
                  <FontAwesomeIcon icon={faCcPaypal} className="w-10 h-8 text-[#003087]" />

                  {/* Generic Credit Card - for Maestro, etc. */}
                  <FontAwesomeIcon icon={faCreditCard} className="w-8 h-8 text-gray-600" />
                </div>
              </div>

              {/* Terms */}
              <p className="text-xs text-center mt-4 text-muted-foreground">
                Je kunt altijd binnen 14 dagen de koop ontbinden.{" "}
                <Link href="/meer-informatie" className="text-primary hover:underline">
                  Meer informatie
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
