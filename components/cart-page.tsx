"use client"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Truck, Clock, ShoppingBag, Trash2, ArrowLeft, Shield, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/cart-context"
import { useRouter } from "next/navigation"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCcVisa, faCcMastercard, faCcPaypal } from "@fortawesome/free-brands-svg-icons"
import { faCreditCard } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import { useAuthContext } from "@/context/AuthContext"

// Free shipping threshold and shipping cost constants
const FREE_SHIPPING_THRESHOLD = 750
const SHIPPING_COST = 69.95

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart()
  const { totalItems, totalPrice } = getCartTotal()
  const { isLoggedIn, loading: authLoading } = useAuthContext()
  const router = useRouter()
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())

  const shippingCost = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = totalPrice + shippingCost
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - totalPrice

  const handleRemoveItem = (itemId: string) => {
    setRemovingItems((prev) => new Set(prev).add(itemId))
    setTimeout(() => {
      removeFromCart(itemId)
      setRemovingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(itemId)
        return newSet
      })
    }, 300)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#0F3059] to-[#1a4a7a] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-[#C6B07F] hover:text-white transition-colors duration-300 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Verder winkelen</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-[#C6B07F] to-[#d4c291] p-3 rounded-xl">
              <ShoppingBag className="w-8 h-8 text-[#0F3059]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Winkelwagen</h1>
              <p className="text-[#C6B07F] text-lg">
                {totalItems > 0
                  ? `${totalItems} ${totalItems === 1 ? "product" : "producten"} in uw winkelwagen`
                  : "Uw winkelwagen is leeg"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Authentication Status Banner */}
        {!authLoading && !isLoggedIn && cart.length > 0 && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-blue-800 font-medium">Log in om af te rekenen</p>
                  <p className="text-blue-600 text-sm">
                    Uw winkelwagen wordt bewaard. Log in om uw bestelling te voltooien.
                  </p>
                </div>
              </div>
              <Button onClick={() => router.push("/login")} className="bg-blue-600 hover:bg-blue-700 text-white">
                Inloggen
              </Button>
            </div>
          </div>
        )}
        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-[#C6B07F]/10 to-[#d4c291]/10 p-12 rounded-full w-32 h-32 mx-auto mb-8 flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-[#C6B07F]" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-[#0F3059]">Uw winkelwagen is leeg</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Ontdek ons uitgebreide assortiment van meer dan 900 producten en voeg uw favorieten toe aan de winkelwagen
            </p>
            {!authLoading && !isLoggedIn && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-8 max-w-md mx-auto">
                <h3 className="text-blue-800 font-bold mb-2">Log in om te bestellen</h3>
                <p className="text-blue-600 text-sm mb-4">
                  Meld je aan om prijzen te zien en producten toe te voegen aan je winkelwagen
                </p>
                <Button
                  onClick={() => router.push("/login")}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white font-semibold py-2 rounded-lg transition-all duration-300 hover:scale-105 mb-4"
                >
                  Inloggen
                </Button>
              </div>
            )}
            <Button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-[#0F3059] to-[#1a4a7a] hover:from-[#1a4a7a] hover:to-[#0F3059] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Ontdek ons assortiment
            </Button>
          </div>
        ) : (
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Left Column - Cart Items */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-lg border border-[#C6B07F]/10 overflow-hidden">
                <div className="bg-gradient-to-r from-[#C6B07F]/5 to-[#d4c291]/5 p-6 border-b border-[#C6B07F]/10">
                  <h2 className="text-xl font-bold text-[#0F3059] flex items-center gap-3">
                    <span>Uw producten</span>
                    <span className="bg-gradient-to-r from-[#C6B07F] to-[#d4c291] text-[#0F3059] px-3 py-1 rounded-full text-sm font-semibold">
                      {totalItems}
                    </span>
                  </h2>
                </div>

                <div className="divide-y divide-[#C6B07F]/10">
                  {cart.map((item, index) => (
                    <div
                      key={item.id}
                      className={`p-6 transition-all duration-300 hover:bg-gradient-to-r hover:from-[#C6B07F]/5 hover:to-transparent animate-fade-in ${
                        removingItems.has(item.id) ? "opacity-50 scale-95" : ""
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <Link
                          href={`/product/${item.arcleunik || item.id}`}
                          className="relative w-24 h-32 flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden group"
                        >
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-contain p-3 group-hover:scale-110 transition-transform duration-300"
                            unoptimized
                          />
                        </Link>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1 min-w-0 mr-4">
                              <Link
                                href={`/product/${item.arcleunik || item.id}`}
                                className="hover:text-[#C6B07F] transition-colors duration-300 group"
                              >
                                <h3 className="font-semibold text-[#0F3059] text-lg mb-2 line-clamp-2 group-hover:text-[#C6B07F]">
                                  {item.name}
                                </h3>
                              </Link>
                              {item.volume && <p className="text-gray-600 text-sm mb-1">{item.volume}</p>}
                              {item.arcleunik && <p className="text-gray-500 text-xs">Art.nr: {item.arcleunik}</p>}
                            </div>

                            {/* Price per unit */}
                            <div className="text-right flex-shrink-0">
                              <div className="text-2xl font-bold text-[#0F3059]">
                                €{item.price.toFixed(2).replace(".", ",")}
                              </div>
                              <div className="text-sm text-gray-500">per stuk</div>
                            </div>
                          </div>

                          {/* Quantity Controls and Actions */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              {/* Quantity Controls */}
                              <div className="flex items-center border-2 border-[#C6B07F]/30 rounded-xl overflow-hidden bg-white">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-12 w-12 hover:bg-[#C6B07F]/10 text-[#0F3059] disabled:opacity-50"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <Input
                                  type="tel"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => {
                                    const value = e.target.value
                                    if (/^\d*$/.test(value)) {
                                      updateQuantity(item.id, Math.max(1, Number.parseInt(value) || 1))
                                    }
                                  }}
                                  className="w-16 text-center h-12 border-0 font-semibold text-[#0F3059] bg-[#C6B07F]/5 focus:bg-[#C6B07F]/10"
                                  style={{ fontSize: "16px" }}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-12 w-12 hover:bg-[#C6B07F]/10 text-[#0F3059]"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>

                              {/* Total Price for this item */}
                              <div className="bg-gradient-to-r from-[#C6B07F]/10 to-[#d4c291]/10 px-4 py-2 rounded-lg border border-[#C6B07F]/20">
                                <div className="text-sm text-gray-600">Totaal</div>
                                <div className="font-bold text-[#0F3059] text-lg">
                                  €{(item.price * item.quantity).toFixed(2).replace(".", ",")}
                                </div>
                              </div>
                            </div>

                            {/* Remove Button */}
                            <Button
                              variant="ghost"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-3 rounded-lg transition-all duration-300 group"
                            >
                              <Trash2 className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="xl:w-[420px]">
              <div className="xl:sticky xl:top-24">
                <div className="bg-white rounded-2xl shadow-lg border border-[#C6B07F]/10 overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-[#0F3059] to-[#1a4a7a] text-white p-6">
                    <h2 className="text-xl font-bold flex items-center gap-3">
                      <div className="bg-gradient-to-r from-[#C6B07F] to-[#d4c291] p-2 rounded-lg">
                        <ShoppingBag className="w-5 h-5 text-[#0F3059]" />
                      </div>
                      Bestelling overzicht
                    </h2>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Delivery Info */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-green-500 p-2 rounded-lg">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-green-800 mb-1">Snelle levering</div>
                          <div className="text-sm text-green-700">
                            <span className="font-medium">Bestel voor 22:00 vandaag,</span>
                            <br />
                            morgen in huis
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Free Shipping Progress */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-[#C6B07F] to-[#d4c291] p-2 rounded-lg">
                          <Truck className="w-5 h-5 text-[#0F3059]" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-[#0F3059]">Gratis verzending</div>
                          <div className="text-sm text-gray-600">vanaf €{FREE_SHIPPING_THRESHOLD}</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#C6B07F] to-[#d4c291] transition-all duration-500 ease-out"
                            style={{ width: `${Math.min((totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            €{totalPrice.toFixed(2)} van €{FREE_SHIPPING_THRESHOLD}
                          </span>
                          <span className="font-semibold text-[#C6B07F]">
                            {totalPrice >= FREE_SHIPPING_THRESHOLD
                              ? "🎉 Behaald!"
                              : `Nog €${remainingForFreeShipping.toFixed(2)}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="bg-gradient-to-r from-[#C6B07F]/5 to-[#d4c291]/5 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between text-lg">
                        <span className="text-gray-700">
                          Subtotaal ({totalItems} {totalItems === 1 ? "product" : "producten"})
                        </span>
                        <span className="font-semibold text-[#0F3059]">€{totalPrice.toFixed(2).replace(".", ",")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Verzendkosten</span>
                        <span className={`font-semibold ${shippingCost === 0 ? "text-green-600" : "text-[#0F3059]"}`}>
                          {shippingCost === 0 ? "Gratis" : `€${SHIPPING_COST.toFixed(2).replace(".", ",")}`}
                        </span>
                      </div>
                      <div className="border-t border-[#C6B07F]/20 pt-3">
                        <div className="flex justify-between text-xl font-bold">
                          <span className="text-[#0F3059]">Totaal</span>
                          <span className="text-[#0F3059]">€{total.toFixed(2).replace(".", ",")}</span>
                        </div>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <Button
                      className="w-full bg-gradient-to-r from-[#0F3059] to-[#1a4a7a] hover:from-[#1a4a7a] hover:to-[#0F3059] text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      onClick={() => {
                        if (!isLoggedIn) {
                          router.push("/login")
                          return
                        }
                        router.push("/checkout")
                      }}
                    >
                      {!isLoggedIn ? "Inloggen om af te rekenen" : "Verder naar bestellen"}
                    </Button>

                    {/* Security Badge */}
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-green-50 border border-green-200 rounded-lg p-3">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span>Veilig en vertrouwd afrekenen</span>
                    </div>

                    {/* Payment Methods */}
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-center text-[#0F3059]">Betaalmethoden</p>
                      <div className="flex justify-center gap-3 flex-wrap">
                        <div className="flex items-center justify-center w-14 h-10 bg-white rounded-lg border-2 border-[#C6B07F]/20 hover:border-[#C6B07F] transition-colors">
                          <span className="text-xs font-bold text-[#0066FF]">iDEAL</span>
                        </div>
                        <div className="w-14 h-10 flex items-center justify-center bg-white rounded-lg border-2 border-[#C6B07F]/20 hover:border-[#C6B07F] transition-colors">
                          <FontAwesomeIcon icon={faCcVisa} className="w-8 h-6 text-[#1434CB]" />
                        </div>
                        <div className="w-14 h-10 flex items-center justify-center bg-white rounded-lg border-2 border-[#C6B07F]/20 hover:border-[#C6B07F] transition-colors">
                          <FontAwesomeIcon icon={faCcMastercard} className="w-8 h-6 text-[#EB001B]" />
                        </div>
                        <div className="w-14 h-10 flex items-center justify-center bg-white rounded-lg border-2 border-[#C6B07F]/20 hover:border-[#C6B07F] transition-colors">
                          <FontAwesomeIcon icon={faCcPaypal} className="w-8 h-6 text-[#003087]" />
                        </div>
                        <div className="w-14 h-10 flex items-center justify-center bg-white rounded-lg border-2 border-[#C6B07F]/20 hover:border-[#C6B07F] transition-colors">
                          <FontAwesomeIcon icon={faCreditCard} className="w-6 h-6 text-gray-600" />
                        </div>
                      </div>
                    </div>

                    {/* Terms */}
                    <p className="text-xs text-center text-gray-500 leading-relaxed">
                      Je kunt altijd binnen 14 dagen de koop ontbinden.{" "}
                      <Link
                        href="/meer-informatie"
                        className="text-[#C6B07F] hover:text-[#0F3059] font-medium transition-colors"
                      >
                        Meer informatie
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
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
