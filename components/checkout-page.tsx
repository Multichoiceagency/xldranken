"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/lib/cart-context"
import { Clock, Truck, Plus, Minus, Store } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { handleOrders } from "@/lib/api"
import { FaIdeal } from "react-icons/fa"

// Free shipping threshold and shipping cost constants
const FREE_SHIPPING_THRESHOLD = 750
const SHIPPING_COST = 69.95

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

const deliveryTimes = [
  { label: "Standaard levering (+ € 0.00)", value: "standard" },
]

export default function CheckoutPage({ customerData }: any) {
  const router = useRouter()
  const [deliveryOption, setDeliveryOption] = useState<"delivery" | "pickup">("delivery")
  const [selectedDate, setSelectedDate] = useState(deliveryDates[0])
  const [selectedTime, setSelectedTime] = useState("standard")
  const [deliveryComment, setDeliveryComment] = useState("")
  const [differentBillingAddress, setDifferentBillingAddress] = useState(false)
  const { cart, getCartTotal, updateQuantity, clearCart } = useCart()
  const { totalItems, totalPrice, totalPriceExclVAT } = getCartTotal()

  // Use the same shipping cost logic as the cart page
  const shippingCost = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = totalPrice + shippingCost
  const totalExclVAT = totalPriceExclVAT + shippingCost // Shipping has no VAT
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - totalPrice

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderStatus, setOrderStatus] = useState<{ success?: boolean; message?: string; orderNumber?: string } | null>(
    null,
  )

  const handlePlaceOrder = async () => {
    // Reset status
    setOrderStatus(null)
    setIsSubmitting(true)

    try {
      // Call the handleOrders function from the API
      await handleOrders(cart, customerData)

      // Generate a unique order number for demonstration
      const orderNumber = `ORD-${Math.floor(Math.random() * 10000)}`

      // Set success status
      setOrderStatus({
        success: true,
        message: "Bestelling succesvol geplaatst!",
        orderNumber: orderNumber,
      })

      // Clear the cart after successful order
      clearCart()

      // Redirect to thank you page with order details
      router.push(`/checkout/complete?orderNumber=${orderNumber}&total=${total.toFixed(2)}`)
    } catch (error) {
      console.error("Error placing order:", error)
      setOrderStatus({
        success: false,
        message:
          error instanceof Error ? error.message : "Er is een fout opgetreden bij het plaatsen van de bestelling.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <div className="flex-1 space-y-8">
            <nav className="flex gap-8 border-b">
              <button className="font-medium text-primary border-b-2 border-primary pb-4">Bezorging</button>
            </nav>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h1 className="text-2xl font-bold mb-6">BEZORGING</h1>

              <RadioGroup
                defaultValue="delivery"
                onValueChange={(value) => setDeliveryOption(value as "delivery" | "pickup")}
              >
                <div className="space-y-6">
                  {/* Delivery Option */}
                  <div className="flex items-start">
                    <RadioGroupItem value="delivery" id="delivery" className="mt-1" />
                    <div className="ml-3 flex-1">
                      <Label htmlFor="delivery" className="font-medium">
                        Bezorgen
                      </Label>
                      <div className="text-right text-primary font-medium">
                        {shippingCost === 0 ? "Gratis" : `€ ${shippingCost.toFixed(2)}`}
                      </div>

                      {deliveryOption === "delivery" && (
                        <div className="mt-4 space-y-4">
                          <div>
                            <Label>MIJN ADRES</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                              <Input defaultValue={customerData?.firstName || ""} placeholder="Voornaam" />
                              <Input defaultValue={customerData?.lastName || ""} placeholder="Achternaam" />
                            </div>
                            <Input
                              defaultValue={customerData?.address || ""}
                              placeholder="Straat en huisnummer"
                              className="mt-2"
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                              <Input defaultValue={customerData?.zipcode || ""} placeholder="Postcode" />
                              <Input defaultValue={customerData?.city || ""} placeholder="Plaats" />
                            </div>

                            {/* Billing Address Toggle */}
                            <div className="flex items-center space-x-2 mt-4">
                              <Checkbox
                                id="different-billing"
                                checked={differentBillingAddress}
                                onCheckedChange={(checked) => setDifferentBillingAddress(checked as boolean)}
                              />
                              <Label htmlFor="different-billing">Factuuradres is anders dan bezorgadres</Label>
                            </div>

                            {differentBillingAddress && (
                              <div className="mt-4 space-y-2 p-4 border rounded-md bg-gray-50">
                                <Label>FACTUURADRES</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                                  <Input placeholder="Voornaam" />
                                  <Input placeholder="Achternaam" />
                                </div>
                                <Input placeholder="Straat en huisnummer" className="mt-2" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                  <Input placeholder="Postcode" />
                                  <Input placeholder="Plaats" />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pickup Option */}
                  <div className="flex items-start">
                    <RadioGroupItem value="pickup" id="pickup" className="mt-1" />
                    <div className="ml-3 flex-1">
                      <Label htmlFor="pickup" className="font-medium">
                        Afhalen in de winkel
                      </Label>
                      <div className="text-right text-green-600 font-medium">Gratis</div>

                      {deliveryOption === "pickup" && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-md">
                          <div className="flex items-start gap-2">
                            <Store className="w-5 h-5 mt-0.5 text-gray-700" />
                            <div>
                              <p className="font-medium">XL Groothandel B.V.</p>
                              <p className="text-sm text-gray-600">Industrieweg 10</p>
                              <p className="text-sm text-gray-600">1234 AB Amsterdam</p>
                              <p className="text-sm text-gray-600 mt-1">Openingstijden: Ma-Vr 9:00-17:00</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </RadioGroup>

              {/* Delivery Date Selection - for both delivery and pickup */}
              <div className="mt-6">
                <Label className="mb-2 block font-medium">
                  {deliveryOption === "delivery" ? "BEZORGDATUM" : "AFHAALDATUM"}
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                  {deliveryDates.map((date, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      className={`cursor-pointer p-2 text-center border rounded hover:bg-gray-50 ${
                        selectedDate === date ? "border-primary bg-primary/10" : "border-gray-200"
                      }`}
                    >
                      <div className="font-bold">{date.day}</div>
                      <div className="text-sm">{date.date}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Time Selection - only for delivery */}
              {deliveryOption === "delivery" && (
                <div className="mt-6">
                  <Label className="mb-2 block font-medium">BEZORGTIJD</Label>
                  <Select defaultValue="standard" onValueChange={setSelectedTime}>
                    <SelectTrigger className="w-full">
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

              {/* Delivery Comments */}
              <div className="mt-6">
                <Label htmlFor="deliveryComment" className="mb-2 block font-medium">
                  {deliveryOption === "delivery" ? "BEZORGINSTRUCTIES" : "OPMERKINGEN"}
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
                  className="resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Cart Items Summary */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <h2 className="font-bold mb-4">BESTELDE PRODUCTEN</h2>

              {/* Mobile view: Grid layout (2 columns) */}
              <div className="grid grid-cols-2 gap-4 sm:hidden">
                {cart.map((item) => (
                  <div key={item.id} className="border rounded-md p-3 pb-4">
                    <div className="flex flex-col h-full">
                      <Link
                        href={`/product/${item.arcleunik || item.id}`}
                        className="relative w-full h-24 flex-shrink-0 mx-auto mb-2"
                      >
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
                      </Link>
                      <div className="flex-1 flex flex-col">
                        <div>
                          <Link href={`/product/${item.arcleunik || item.id}`}>
                            <h3 className="font-medium text-sm hover:text-orange-500 hover:font-bold line-clamp-2">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="text-xs text-muted-foreground">#{item.volume} SKU</p>
                          {item.arcleunik && <p className="text-xs text-muted-foreground">Art.nr: {item.arcleunik} </p>}
                        </div>
                        <div className="mt-2 text-right">
                          <div className="text-base font-bold hover:text-green-600">€{item.price.toFixed(2)}</div>
                          <div className="text-xs text-gray-500">per stuk</div>
                        </div>
                        <div className="mt-auto pt-2 border-t">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium">Aantal:</span>
                            <div className="flex items-center border rounded">
                              <button
                                className="px-1 py-1 border-r"
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateQuantity(item.id, Math.max(1, Number.parseInt(e.target.value) || 1))
                                }
                                className="w-8 text-center py-1 border-none focus:ring-0 text-sm"
                              />
                              <button
                                className="px-1 py-1 border-l"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                          <div className="text-right mt-2">
                            <div className="text-xs font-bold text-orange-500">
                              Subtotaal: €{(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop view: Original horizontal layout */}
              <div className="hidden sm:block space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b">
                    <Link href={`/product/${item.arcleunik || item.id}`} className="relative w-32 h-32 flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
                    </Link>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <Link href={`/product/${item.arcleunik || item.id}`}>
                            <h3 className="font-medium hover:text-orange-500 hover:font-bold">{item.name}</h3>
                          </Link>
                          <p className="text-sm text-muted-foreground">#{item.volume} SKU</p>
                          {item.arcleunik && <p className="text-xs text-muted-foreground">Art.nr: {item.arcleunik} </p>}
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold hover:text-green-600">€{item.price.toFixed(2)}</div>
                          <div className="text-xs text-gray-500">per stuk</div>
                        </div>
                      </div>
                      <div className="flex justify-between mt-2 pt-2 border-t">
                        <div className="flex items-center">
                          <span className="text-sm font-medium mr-2">Aantal:</span>
                          <div className="flex items-center border rounded">
                            <button
                              className="px-2 py-1 border-r"
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(item.id, Math.max(1, Number.parseInt(e.target.value) || 1))
                              }
                              className="w-12 text-center py-1 border-none focus:ring-0"
                            />
                            <button
                              className="px-2 py-1 border-l"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-orange-500">
                            Subtotaal: €{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sticky Overview */}
          <div className="w-full lg:w-[380px]">
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 lg:sticky lg:top-20">
              <h2 className="font-bold mb-4">JOUW OVERZICHT</h2>

              {/* Delivery Info */}
              <div className="flex items-start gap-2 text-sm mb-4">
                <Clock className="w-4 h-4 mt-0.5 text-green-600" />
                <div>
                  <span className="text-green-600">Bestel voor 22:00 vandaag, </span>
                  morgen in huis
                </div>
              </div>

              {/* Free Shipping Progress - only show for delivery option */}
              {deliveryOption === "delivery" && (
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
              )}

              {/* Selected Delivery Method */}
              <div className="mb-4 p-3 bg-white rounded-md border border-gray-200">
                <div className="flex items-center gap-2">
                  {deliveryOption === "delivery" ? (
                    <Truck className="w-4 h-4 text-primary" />
                  ) : (
                    <Store className="w-4 h-4 text-primary" />
                  )}
                  <span className="font-medium">
                    {deliveryOption === "delivery" ? "Bezorgen" : "Afhalen in de winkel"}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {selectedDate.day} {selectedDate.date}
                  {deliveryOption === "delivery" &&
                    selectedTime !== "standard" &&
                    ` - ${selectedTime === "morning" ? "Ochtend" : selectedTime === "afternoon" ? "Middag" : "Avond"}`}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 sm:space-y-3 text-sm border rounded-md p-3 sm:p-4 bg-white">
                <h3 className="font-bold text-base border-b pb-2 mb-1 sm:mb-2">Prijsoverzicht</h3>

                <div className="flex justify-between mb-1 sm:mb-2">
                  <span className="font-medium">Aantal artikelen:</span>
                  <span className="font-bold">{totalItems} stuks</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">Subtotaal:</span>
                  <span className="font-bold">€ {totalPrice.toFixed(2)}</span>
                </div>

                {deliveryOption === "delivery" && (
                  <div className="border-t border-dashed my-1 sm:my-2 pt-1 sm:pt-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Bezorgkosten:</span>
                      <span className={shippingCost === 0 ? "text-green-600 font-bold" : "font-bold"}>
                        {shippingCost === 0 ? "Gratis" : `€ ${shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                    {selectedTime !== "standard" && (
                      <div className="flex justify-between mt-1">
                        <span className="font-medium">Tijdvak toeslag:</span>
                        <span className="font-bold">€ 2.00</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="border-t pt-2 sm:pt-3 mt-1 sm:mt-2">
                  <div className="flex justify-between text-base sm:text-lg">
                    <span className="font-bold">Totaal:</span>
                    <span className="font-bold text-[#FF6B35]">
                      € {(total + (selectedTime !== "standard" && deliveryOption === "delivery" ? 2 : 0)).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 text-right mt-1">Prijzen zijn inclusief BTW</div>
                </div>
              </div>

              {/* Place Order Button */}
              <Button
                className="w-full mt-6 bg-[#FF6B35] hover:bg-[#E85A24] text-white"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? "BESTELLING WORDT GEPLAATST..." : "BESTELLING PLAATSEN"}
              </Button>

              {/* Payment Methods */}
              <div className="mt-4 sm:mt-6">
                <p className="text-xs text-center mb-2 sm:mb-3 text-muted-foreground font-bold">Veilig betalen met</p>
                <div className="flex justify-center gap-3">
                  {/* iDEAL - Dutch payment method */}
                  <div className="flex items-center justify-center w-12 h-8 bg-white rounded border">
                    <span className="text-xs font-bold text-red-600 ml-1">iDEAL</span>
                    <FaIdeal className="text-red-600 ml-1" />
                  </div>
                </div>
              </div>

              {/* Terms */}
              <p className="text-xs text-center mt-4 text-muted-foreground">
                Betaal achteraf binnen 7 dagen jou factuur!{" "}
                <Link href="/klantenservice" className="text-primary font-bold text-red-700 hover:underline">
                  Meer informatie
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
