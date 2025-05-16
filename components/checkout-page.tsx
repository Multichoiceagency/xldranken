"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCart } from "@/lib/cart-context"
import { Clock, Truck, Plus, Minus, Store } from "lucide-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCcVisa, faCcMastercard, faCcPaypal } from "@fortawesome/free-brands-svg-icons"
import { faCreditCard } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

// Free shipping threshold and shipping cost constants - same as cart page
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

export default function CheckoutPage({ customerData }: { customerData: any }) {
  const router = useRouter()
  const { toast } = useToast()
  const [deliveryOption, setDeliveryOption] = useState<"delivery" | "pickup">("delivery")
  const [selectedDate, setSelectedDate] = useState(deliveryDates[0])
  const [deliveryComment, setDeliveryComment] = useState("")
  const { cart, getCartTotal, updateQuantity, clearCart } = useCart()
  const { totalItems, totalPrice, totalPriceExclVAT } = getCartTotal()

  // Form state for customer data with better fallbacks
  const [formData, setFormData] = useState({
    firstName: customerData?.firstName || "",
    lastName: customerData?.lastName || "",
    address: customerData?.address || "",
    zipcode: customerData?.zipcode || "",
    city: customerData?.city || "",
    email: customerData?.email || "",
    phone: customerData?.phone || "",
  })

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

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
      // Validate cart
      if (cart.length === 0) {
        throw new Error("Je winkelwagen is leeg")
      }

      // Validate customer data for delivery option
      if (deliveryOption === "delivery") {
        if (!formData.address || !formData.zipcode || !formData.city) {
          throw new Error("Vul alle verplichte adresgegevens in")
        }
      }

      // Step 1: Create an empty order
      console.log("Creating empty order for customer:", customerData.clcleunik || customerData.id)
      const createOrderUrl = `${process.env.NEXT_PUBLIC_ORDERS_CREATE_BLANK_URL}apikey=${process.env.NEXT_PUBLIC_API_KEY}`

      const createOrderResponse = await fetch(createOrderUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clcleunik: customerData.clcleunik || customerData.id,
          use: "clcleunik",
        }),
      })

      if (!createOrderResponse.ok) {
        throw new Error(`Failed to create order: ${createOrderResponse.status}`)
      }

      const orderData = await createOrderResponse.json()
      if (!orderData.success) {
        throw new Error(orderData.message || "Failed to create order")
      }

      const orderGuid = orderData.result?.guid || orderData.guid
      console.log("Created empty order with GUID:", orderGuid)

      // Step 2: Add each item to the order
      for (const item of cart) {
        console.log(`Adding item ${item.id} to order ${orderGuid}`)
        const addLineUrl = `${process.env.NEXT_PUBLIC_ORDERS_ADD_LINES_TO_ORDER_URL}apikey=${process.env.NEXT_PUBLIC_API_KEY}`

        const addLineResponse = await fetch(addLineUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            guid: orderGuid,
            arcleunik: item.id,
            qty: item.quantity,
            data: `${item.id}_${item.quantity}`,
          }),
        })

        if (!addLineResponse.ok) {
          throw new Error(`Failed to add item ${item.id} to order: ${addLineResponse.status}`)
        }

        const lineData = await addLineResponse.json()
        if (!lineData.success) {
          throw new Error(lineData.message || `Failed to add item ${item.id} to order`)
        }
      }

      // Step 3: Send the order to Megawin
      console.log("Sending order to Megawin:", orderGuid)
      const sendOrderUrl = `${process.env.NEXT_PUBLIC_ORDERS_SEND_TO_MEGAWIN_URL}apikey=${process.env.NEXT_PUBLIC_API_KEY}`

      const sendOrderResponse = await fetch(sendOrderUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guid: orderGuid,
          deliveryOption: deliveryOption === "delivery" ? "1" : "2",
          deliveryDate: selectedDate.fullDate.toISOString(),
          deliveryComment,
          customerData: formData,
        }),
      })

      if (!sendOrderResponse.ok) {
        throw new Error(`Failed to send order to Megawin: ${sendOrderResponse.status}`)
      }

      const result = await sendOrderResponse.json()
      if (!result.success) {
        throw new Error(result.message || "Failed to send order to Megawin")
      }

      const orderNumber = result.result?.orderNumber || orderGuid

      // Order successfully placed
      setOrderStatus({
        success: true,
        message: "Bestelling succesvol geplaatst!",
        orderNumber: orderNumber,
      })

      // Show success toast
      toast({
        title: "Bestelling geplaatst",
        description: `Je bestelling #${orderNumber} is succesvol geplaatst.`,
      })

      // Clear the cart after successful order
      clearCart()

      // Redirect to thank you page with order details
      router.push(`/thank-you?orderNumber=${orderNumber}&total=${total.toFixed(2)}`)
    } catch (error) {
      console.error("Error placing order:", error)

      // Show error toast
      toast({
        title: "Fout bij bestellen",
        description:
          error instanceof Error ? error.message : "Er is een fout opgetreden bij het plaatsen van de bestelling.",
        variant: "destructive",
      })

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
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
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
                            <p className="text-xs text-gray-500 mb-2">Vul je adresgegevens in</p>
                            <div className="grid grid-cols-2 gap-2 mt-1">
                              <Input
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                placeholder="Voornaam"
                                required={false}
                                className="w-full"
                              />
                              <Input
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                placeholder="Achternaam"
                                required={false}
                                className="w-full"
                              />
                            </div>
                            <Input
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              placeholder="Straat en huisnummer"
                              className="mt-2"
                              required={deliveryOption === "delivery"}
                            />
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <Input
                                name="zipcode"
                                value={formData.zipcode}
                                onChange={handleInputChange}
                                placeholder="Postcode"
                                required={deliveryOption === "delivery"}
                              />
                              <Input
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                placeholder="Plaats"
                                required={deliveryOption === "delivery"}
                              />
                            </div>
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
                              <p className="text-sm text-gray-600">Turfschipper 116</p>
                              <p className="text-sm text-gray-600">2292 JB Wateringen</p>
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
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="font-bold mb-4">BESTELDE PRODUCTEN</h2>
              <div className="space-y-4">
                {cart.map((item) => {
                  // Get VAT rate from the product or default to 21%
                  const vatRate = item.tauxTvaArticleEcommerce ? Number.parseFloat(item.tauxTvaArticleEcommerce) : 21

                  return (
                    <div key={item.id} className="flex gap-4 pb-4 border-b">
                      <div className="relative w-16 h-16">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.volume}</p>
                            {item.arcleunik && (
                              <p className="text-xs text-muted-foreground">Art.nr: {item.arcleunik}</p>
                            )}
                            {/* Display VAT percentage */}
                            {item.tauxTvaArticleEcommerce ? (
                              <div className="mt-1 inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                BTW: {Number.parseFloat(item.tauxTvaArticleEcommerce)}%
                              </div>
                            ) : (
                              <div className="mt-1 inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
                                BTW is niet beschikbaar voor dit product
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">€{item.price.toFixed(2)}</div>
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
                            <div className="text-sm font-bold">
                              Subtotaal: €{(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Sticky Overview - Matching cart page design */}
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
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 text-sm border rounded-md p-4 bg-white">
                <h3 className="font-bold text-base border-b pb-2 mb-2">Prijsoverzicht</h3>

                <div className="flex justify-between mb-2">
                  <span className="font-medium">Aantal artikelen:</span>
                  <span className="font-bold">{totalItems} stuks</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium">Subtotaal:</span>
                  <span className="font-bold">€ {totalPrice.toFixed(2)}</span>
                </div>

                {deliveryOption === "delivery" && (
                  <div className="border-t border-dashed my-2 pt-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Bezorgkosten:</span>
                      <span className={shippingCost === 0 ? "text-green-600 font-bold" : "font-bold"}>
                        {shippingCost === 0 ? "Gratis" : `€ ${shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                )}

                <div className="border-t pt-3 mt-2">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Totaal:</span>
                    <span className="font-bold text-[#FF6B35]">€ {total.toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-gray-500 text-right mt-1">Prijzen zijn inclusief BTW</div>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                className="w-full mt-6 bg-[#FF6B35] hover:bg-[#E85A24] text-white"
                onClick={handlePlaceOrder}
                disabled={isSubmitting || cart.length === 0}
              >
                {isSubmitting ? "BESTELLING WORDT GEPLAATST..." : "BESTELLING PLAATSEN"}
              </Button>

              {orderStatus && (
                <div
                  className={`mt-3 p-3 rounded-md text-sm ${
                    orderStatus.success
                      ? "bg-green-50 border border-green-200 text-green-700"
                      : "bg-red-50 border border-red-200 text-red-700"
                  }`}
                >
                  {orderStatus.message}
                  {orderStatus.success && orderStatus.orderNumber && (
                    <div className="mt-1 font-bold">Bestelnummer: {orderStatus.orderNumber}</div>
                  )}
                </div>
              )}

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
      </div>
    </div>
  )
}
