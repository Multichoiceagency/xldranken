"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/lib/cart-context"
import { useAuthContext } from "@/context/AuthContext"
import {
  Clock,
  Plus,
  Minus,
  Store,
  Mail,
  CheckCircle,
  Truck,
  MapPin,
  Calendar,
  ShoppingBag,
  Shield,
  CreditCard,
  Package,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { FaIdeal } from "react-icons/fa"
import { processOrderAndSendConfirmation } from "@/actions/order-actions"

const getDeliveryDates = () => {
  const dates = []
  const today = new Date()
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      // Skip Sundays & Saturdays
      dates.push({
        day: date.toLocaleDateString("nl-NL", { weekday: "short" }),
        date: date.toLocaleDateString("nl-NL", { day: "numeric", month: "short" }),
        fullDate: date,
      })
    }
  }
  return dates
}

const deliveryDates = getDeliveryDates()

const deliveryTimes = [{ label: "Standaard levering", value: "standard" }]

export default function UpdatedCheckoutPage({ customerData }: any) {
  const router = useRouter()
  const { isLoggedIn, loading: authLoading } = useAuthContext()
  const [deliveryOption, setDeliveryOption] = useState<"delivery" | "pickup">("delivery")
  const [selectedDate, setSelectedDate] = useState(deliveryDates[0])
  const [selectedTime, setSelectedTime] = useState("standard")
  const [deliveryComment, setDeliveryComment] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const { cart, getCartTotal, updateQuantity, clearCart } = useCart()
  const { totalItems, totalPrice, totalPriceExclVAT } = getCartTotal()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderStatus, setOrderStatus] = useState<{
    success?: boolean
    message?: string
    orderNumber?: string
    emailSent?: boolean
  } | null>(null)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push("/login?redirect=/checkout")
    }
  }, [authLoading, isLoggedIn, router])

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C6B07F] mx-auto mb-4"></div>
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    )
  }

  // Don't render checkout if not logged in
  if (!isLoggedIn) {
    return null
  }

  // No shipping costs - total is just the cart total
  const total = totalPrice

  const handlePlaceOrder = async () => {
    // Reset status
    setOrderStatus(null)
    setIsSubmitting(true)

    try {
      // Prepare delivery address
      const address =
        deliveryOption === "delivery"
          ? deliveryAddress ||
            `${customerData?.address || ""}, ${customerData?.zipcode || ""} ${customerData?.city || ""}`.trim()
          : "XL Groothandel B.V., Turfschipper 116, 2292 JB Wateringen"

      // Prepare order data
      const orderData = {
        cart,
        customerData,
        deliveryOption,
        deliveryDate: `${selectedDate.day} ${selectedDate.date}`,
        deliveryAddress: address,
        deliveryInstructions: deliveryComment,
      }

      // Process order and send confirmation email
      const result = await processOrderAndSendConfirmation(orderData)

      if (result.success) {
        // Set success status
        setOrderStatus({
          success: true,
          message: "Bestelling succesvol geplaatst en bevestiging verzonden!",
          orderNumber: result.orderNumber,
          emailSent: result.emailSent,
        })

        // Clear the cart after successful order
        clearCart()

        // Redirect to thank you page with order details
        router.push(
          `/checkout/complete?orderNumber=${result.orderNumber}&total=${result.total}&emailSent=${result.emailSent}`,
        )
      } else {
        setOrderStatus({
          success: false,
          message: result.error || "Er is een fout opgetreden bij het plaatsen van de bestelling.",
        })
      }
    } catch (error) {
      console.error("Error placing order:", error)
      setOrderStatus({
        success: false,
        message: error instanceof Error ? error.message : "Er is een onverwachte fout opgetreden.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#0F3059] to-[#1a4a7a] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-[#C6B07F] to-[#d4c291] p-3 rounded-xl">
              <CreditCard className="w-8 h-8 text-[#0F3059]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Afrekenen</h1>
              <p className="text-[#C6B07F] text-lg">
                Voltooi uw bestelling van {totalItems} {totalItems === 1 ? "product" : "producten"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Authentication Confirmation */}
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 p-2 rounded-lg">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-green-800 font-medium">✓ Ingelogd en klaar om te bestellen</p>
              <p className="text-green-600 text-sm">Uw accountgegevens worden gebruikt voor deze bestelling</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Left Column */}
          <div className="flex-1 space-y-8">
            {/* Progress Steps */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#C6B07F]/10 p-6">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-[#C6B07F] to-[#d4c291] text-[#0F3059] w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <span className="font-semibold text-[#0F3059] border-b-2 border-[#C6B07F] pb-1">Bezorging</span>
                <div className="flex-1 h-px bg-gray-200"></div>
                <div className="bg-gray-200 text-gray-500 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <span className="text-gray-500">Betaling</span>
              </div>
            </div>

            {/* Order Status Display */}
            {orderStatus && (
              <div
                className={`p-6 rounded-2xl border-2 shadow-lg animate-fade-in ${
                  orderStatus.success
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                    : "bg-gradient-to-r from-red-50 to-pink-50 border-red-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  {orderStatus.success ? (
                    <div className="bg-green-500 p-2 rounded-full">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  ) : (
                    <div className="bg-red-500 p-2 rounded-full">
                      <span className="text-white text-lg font-bold">!</span>
                    </div>
                  )}
                  <div>
                    <span
                      className={`font-semibold text-lg ${orderStatus.success ? "text-green-800" : "text-red-800"}`}
                    >
                      {orderStatus.message}
                    </span>
                    {orderStatus.orderNumber && (
                      <p className={`mt-1 ${orderStatus.success ? "text-green-700" : "text-red-700"}`}>
                        Bestelnummer: <strong>{orderStatus.orderNumber}</strong>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Options */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#C6B07F]/10 overflow-hidden">
              <div className="bg-gradient-to-r from-[#C6B07F]/5 to-[#d4c291]/5 p-6 border-b border-[#C6B07F]/10">
                <h2 className="text-2xl font-bold text-[#0F3059] flex items-center gap-3">
                  <Truck className="w-7 h-7 text-[#C6B07F]" />
                  Bezorging
                </h2>
              </div>

              <div className="p-6">
                <RadioGroup
                  defaultValue="delivery"
                  onValueChange={(value) => setDeliveryOption(value as "delivery" | "pickup")}
                  className="space-y-6"
                >
                  {/* Delivery Option */}
                  <div
                    className={`border-2 rounded-xl p-6 transition-all duration-300 ${
                      deliveryOption === "delivery"
                        ? "border-[#C6B07F] bg-gradient-to-r from-[#C6B07F]/5 to-[#d4c291]/5"
                        : "border-gray-200 hover:border-[#C6B07F]/50"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <RadioGroupItem value="delivery" id="delivery" className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <Label
                            htmlFor="delivery"
                            className="font-semibold text-lg text-[#0F3059] flex items-center gap-2"
                          >
                            <Truck className="w-5 h-5 text-[#C6B07F]" />
                            Thuisbezorging
                          </Label>
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                            Gratis
                          </span>
                        </div>

                        {deliveryOption === "delivery" && (
                          <div className="space-y-4 animate-fade-in">
                            <div className="bg-white rounded-lg p-4 border border-[#C6B07F]/20">
                              <Label className="font-semibold text-[#0F3059] flex items-center gap-2 mb-3">
                                <MapPin className="w-4 h-4 text-[#C6B07F]" />
                                Bezorgadres
                              </Label>
                              <Input
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                placeholder={`${customerData?.address || "Straat en huisnummer"}`}
                                className="mb-3 border-[#C6B07F]/30 focus:border-[#C6B07F]"
                              />
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Input
                                  defaultValue={customerData?.zipcode || ""}
                                  placeholder="Postcode"
                                  className="border-[#C6B07F]/30 focus:border-[#C6B07F]"
                                />
                                <Input
                                  defaultValue={customerData?.city || ""}
                                  placeholder="Plaats"
                                  className="border-[#C6B07F]/30 focus:border-[#C6B07F]"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Pickup Option */}
                  <div
                    className={`border-2 rounded-xl p-6 transition-all duration-300 ${
                      deliveryOption === "pickup"
                        ? "border-[#C6B07F] bg-gradient-to-r from-[#C6B07F]/5 to-[#d4c291]/5"
                        : "border-gray-200 hover:border-[#C6B07F]/50"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <RadioGroupItem value="pickup" id="pickup" className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <Label
                            htmlFor="pickup"
                            className="font-semibold text-lg text-[#0F3059] flex items-center gap-2"
                          >
                            <Store className="w-5 h-5 text-[#C6B07F]" />
                            Afhalen in de winkel
                          </Label>
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                            Gratis
                          </span>
                        </div>

                        {deliveryOption === "pickup" && (
                          <div className="bg-white rounded-lg p-4 border border-[#C6B07F]/20 animate-fade-in">
                            <div className="flex items-start gap-3">
                              <div className="bg-gradient-to-r from-[#C6B07F] to-[#d4c291] p-2 rounded-lg">
                                <Store className="w-5 h-5 text-[#0F3059]" />
                              </div>
                              <div>
                                <p className="font-semibold text-[#0F3059]">XL Groothandel B.V.</p>
                                <p className="text-gray-600">Turfschipper 116</p>
                                <p className="text-gray-600">2292 JB Wateringen</p>
                                <p className="text-sm text-[#C6B07F] mt-2">Openingstijden: Ma-Vr 9:00-17:00</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </RadioGroup>

                {/* Date Selection */}
                <div className="mt-8">
                  <Label className="font-semibold text-[#0F3059] flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-[#C6B07F]" />
                    {deliveryOption === "delivery" ? "Bezorgdatum" : "Afhaaldatum"}
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {deliveryDates.map((date, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedDate(date)}
                        className={`cursor-pointer p-4 text-center border-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                          selectedDate === date
                            ? "border-[#C6B07F] bg-gradient-to-r from-[#C6B07F]/10 to-[#d4c291]/10 shadow-lg"
                            : "border-gray-200 hover:border-[#C6B07F]/50"
                        }`}
                      >
                        <div className="font-bold text-[#0F3059]">{date.day}</div>
                        <div className="text-sm text-gray-600">{date.date}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Time - only for delivery */}
                {deliveryOption === "delivery" && (
                  <div className="mt-6">
                    <Label className="font-semibold text-[#0F3059] flex items-center gap-2 mb-3">
                      <Clock className="w-5 h-5 text-[#C6B07F]" />
                      Bezorgtijd
                    </Label>
                    <Select defaultValue="standard" onValueChange={setSelectedTime}>
                      <SelectTrigger className="border-[#C6B07F]/30 focus:border-[#C6B07F]">
                        <SelectValue placeholder="Selecteer bezorgtijd" />
                      </SelectTrigger>
                      <SelectContent>
                        {deliveryTimes.map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Comments */}
                <div className="mt-6">
                  <Label
                    htmlFor="deliveryComment"
                    className="font-semibold text-[#0F3059] flex items-center gap-2 mb-3"
                  >
                    <Mail className="w-5 h-5 text-[#C6B07F]" />
                    {deliveryOption === "delivery" ? "Bezorginstructies" : "Opmerkingen"}
                  </Label>
                  <Textarea
                    id="deliveryComment"
                    placeholder={
                      deliveryOption === "delivery"
                        ? "Bijv. aanbellen bij de buren, achterdeur gebruiken, etc."
                        : "Bijv. specifieke tijd van afhalen, etc."
                    }
                    value={deliveryComment}
                    onChange={(e) => setDeliveryComment(e.target.value)}
                    className="resize-none border-[#C6B07F]/30 focus:border-[#C6B07F]"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Cart Items */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#C6B07F]/10 overflow-hidden">
              <div className="bg-gradient-to-r from-[#C6B07F]/5 to-[#d4c291]/5 p-6 border-b border-[#C6B07F]/10">
                <h2 className="text-2xl font-bold text-[#0F3059] flex items-center gap-3">
                  <Package className="w-7 h-7 text-[#C6B07F]" />
                  Bestelde producten
                  <span className="bg-gradient-to-r from-[#C6B07F] to-[#d4c291] text-[#0F3059] px-3 py-1 rounded-full text-sm font-semibold">
                    {totalItems}
                  </span>
                </h2>
              </div>

              {/* Mobile Grid Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4 p-6">
                {cart.map((item, index) => (
                  <div
                    key={item.id}
                    className="border border-[#C6B07F]/20 rounded-xl p-4 bg-gradient-to-r from-white to-[#C6B07F]/5 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Link
                      href={`/product/${item.arcleunik || item.id}`}
                      className="relative w-full h-24 block mb-3 bg-gray-50 rounded-lg overflow-hidden group"
                    >
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                        unoptimized
                      />
                    </Link>
                    <div className="space-y-2">
                      <Link href={`/product/${item.arcleunik || item.id}`}>
                        <h3 className="font-semibold text-sm text-[#0F3059] hover:text-[#C6B07F] transition-colors line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-gray-500">{item.volume}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#0F3059]">€{item.price.toFixed(2)}</span>
                        <div className="flex items-center border border-[#C6B07F]/30 rounded-lg overflow-hidden">
                          <button
                            className="px-2 py-1 hover:bg-[#C6B07F]/10 transition-colors"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <input
                            type="tel"
                            inputMode="numeric"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = e.target.value
                              if (/^\d*$/.test(value)) {
                                updateQuantity(item.id, Math.max(1, Number.parseInt(value) || 1))
                              }
                            }}
                            className="w-8 text-center py-1 border-0 focus:ring-0 text-sm font-semibold"
                            style={{ fontSize: "16px" }}
                          />
                          <button
                            className="px-2 py-1 hover:bg-[#C6B07F]/10 transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-[#C6B07F]">
                          Totaal: €{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop List Layout */}
              <div className="hidden lg:block divide-y divide-[#C6B07F]/10">
                {cart.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-6 hover:bg-gradient-to-r hover:from-[#C6B07F]/5 hover:to-transparent transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex gap-6">
                      <Link
                        href={`/product/${item.arcleunik || item.id}`}
                        className="relative w-24 h-32 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden group"
                      >
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-contain p-3 group-hover:scale-110 transition-transform duration-300"
                          unoptimized
                        />
                      </Link>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <Link href={`/product/${item.arcleunik || item.id}`}>
                              <h3 className="font-semibold text-lg text-[#0F3059] hover:text-[#C6B07F] transition-colors">
                                {item.name}
                              </h3>
                            </Link>
                            <p className="text-gray-600">{item.volume}</p>
                            {item.arcleunik && <p className="text-sm text-gray-500">Art.nr: {item.arcleunik}</p>}
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-[#0F3059]">€{item.price.toFixed(2)}</div>
                            <div className="text-sm text-gray-500">per stuk</div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-[#0F3059]">Aantal:</span>
                            <div className="flex items-center border-2 border-[#C6B07F]/30 rounded-xl overflow-hidden">
                              <button
                                className="px-3 py-2 hover:bg-[#C6B07F]/10 transition-colors"
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <input
                                type="tel"
                                inputMode="numeric"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => {
                                  const value = e.target.value
                                  if (/^\d*$/.test(value)) {
                                    updateQuantity(item.id, Math.max(1, Number.parseInt(value) || 1))
                                  }
                                }}
                                className="w-12 text-center py-2 border-0 focus:ring-0 font-semibold"
                                style={{ fontSize: "16px" }}
                              />
                              <button
                                className="px-3 py-2 hover:bg-[#C6B07F]/10 transition-colors"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-[#C6B07F]">
                              Subtotaal: €{(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
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

                  {/* Selected Delivery Method */}
                  <div className="bg-gradient-to-r from-[#C6B07F]/5 to-[#d4c291]/5 border border-[#C6B07F]/20 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      {deliveryOption === "delivery" ? (
                        <Truck className="w-5 h-5 text-[#C6B07F]" />
                      ) : (
                        <Store className="w-5 h-5 text-[#C6B07F]" />
                      )}
                      <span className="font-semibold text-[#0F3059]">
                        {deliveryOption === "delivery" ? "Thuisbezorging" : "Afhalen in de winkel"}
                      </span>
                      <span className="ml-auto bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                        Gratis
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedDate.day} {selectedDate.date}
                    </div>
                  </div>

                  {/* Email Confirmation */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-blue-500 p-2 rounded-lg">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold text-blue-900">Orderbevestiging</span>
                    </div>
                    <p className="text-sm text-blue-800">
                      Na het plaatsen van uw bestelling ontvangt u automatisch een gedetailleerde bevestiging per
                      e-mail.
                    </p>
                  </div>

                  {/* Price Breakdown */}
                  <div className="bg-gradient-to-r from-[#C6B07F]/5 to-[#d4c291]/5 rounded-xl p-4 space-y-3">
                    <h3 className="font-bold text-lg text-[#0F3059] border-b border-[#C6B07F]/20 pb-2">
                      Prijsoverzicht
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-700">
                          Subtotaal ({totalItems} {totalItems === 1 ? "product" : "producten"})
                        </span>
                        <span className="font-semibold text-[#0F3059]">€{totalPrice.toFixed(2).replace(".", ",")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Verzendkosten</span>
                        <span className="font-semibold text-green-600">Gratis</span>
                      </div>
                      <div className="border-t border-[#C6B07F]/20 pt-3">
                        <div className="flex justify-between text-xl font-bold">
                          <span className="text-[#0F3059]">Totaal</span>
                          <span className="text-[#0F3059]">€{total.toFixed(2).replace(".", ",")}</span>
                        </div>
                        <div className="text-xs text-gray-500 text-right mt-1">Prijzen zijn inclusief BTW</div>
                      </div>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <Button
                    className="w-full bg-gradient-to-r from-[#0F3059] to-[#1a4a7a] hover:from-[#1a4a7a] hover:to-[#0F3059] text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Bestelling wordt geplaatst...
                      </div>
                    ) : (
                      "Bestelling plaatsen"
                    )}
                  </Button>

                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-green-50 border border-green-200 rounded-lg p-3">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>Veilig en vertrouwd afrekenen</span>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-center text-[#0F3059]">Betaalmethoden</p>
                    <div className="flex justify-center">
                      <div className="flex items-center justify-center w-20 h-12 bg-white rounded-lg border-2 border-[#C6B07F]/20 hover:border-[#C6B07F] transition-colors">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-bold text-red-600">iDEAL</span>
                          <FaIdeal className="text-red-600" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <p className="text-xs text-center text-gray-500 leading-relaxed">
                    Betaal achteraf binnen 7 dagen jouw factuur!{" "}
                    <Link
                      href="/klantenservice"
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

        /* Loading spinner animation */
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
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
