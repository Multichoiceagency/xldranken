"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Info, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useCart } from "@/lib/cart-context"
import { PaymentMethodsPage } from "./payment-methods-page"
import { useToast } from "@/hooks/use-toast"
import { FaCcMastercard, FaCcVisa, FaIdeal } from "react-icons/fa"

// Define the CustomerData interface
interface CustomerData {
  clcleunik: string
  customerNumber: string
  login: string
  email: string
  firstName: string | null
  lastName: string | null
  address: string
  zipcode: string
  city: string
  country: string
  phone: string
  cellphone: string
  denomination: string
  tvaNumber: string
  isTestAccount?: boolean
}

const getDeliveryDates = () => {
  const dates = []
  const today = new Date()
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      // Skip Sunday (0) and Saturday (6)
      dates.push({
        day: date.toLocaleDateString("nl-NL", { weekday: "short" }),
        date: date.toLocaleDateString("nl-NL", { day: "numeric", month: "short" }),
      })
    }
  }
  return dates
}

const deliveryDates = getDeliveryDates()

export function CheckoutPage() {
  const { toast } = useToast()
  const [step, setStep] = useState<"delivery" | "payment">("delivery")
  const [deliveryOption, setDeliveryOption] = useState<"delivery" | "pickup">("delivery")
  const [customerData, setCustomerData] = useState<CustomerData | null>(null)
  const [isLoading, setIsLoading] = useState(true) // Start with true since we need to fetch data
  const [isSaving, setIsSaving] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState(false)
  const { cart, getCartTotal } = useCart()
  const { totalPrice } = getCartTotal()
  const shippingCost = deliveryOption === "delivery" ? 4.95 : 0
  const subtotal = totalPrice
  const total = subtotal + shippingCost

  // Initialize formData state similar to AccountDetails component
  const [formData, setFormData] = useState({
    // Customer data (read-only in this component)
    firstName: "",
    lastName: "",
    address: "",
    zipcode: "",
    city: "",
    country: "",
    phone: "",
    cellphone: "",

    // Delivery preferences (editable)
    deliveryOption: "delivery" as "delivery" | "pickup",
    bezorgdatum: "",
    selectedDate: deliveryDates[0],
    differentBillingAddress: false,
  })

  // Update formData when customerData changes
  useEffect(() => {
    if (customerData) {
      setFormData((prev) => ({
        ...prev,
        firstName: customerData.firstName || "",
        lastName: customerData.lastName || "",
        address: customerData.address || "",
        zipcode: customerData.zipcode || "",
        city: customerData.city || "",
        country: customerData.country || "",
        phone: customerData.phone || "",
        cellphone: customerData.cellphone || "",
      }))
    }
  }, [customerData])

  // Fetch customer data from API - updated to try "customers" endpoint first
  useEffect(() => {
    // Skip API call if we already know it's failing
    if (apiError) return

    const fetchCustomerData = async () => {
      setIsLoading(true)
      try {
        // Try multiple possible API endpoints - with "customers" (plural) first
        const endpoints = [
          "/api/account/customers",
        ]

        let response = null
        let succeeded = false

        // Try each endpoint until one works
        for (const endpoint of endpoints) {
          try {
            console.log(`Trying endpoint: ${endpoint}`)
            response = await fetch(endpoint)
            if (response.ok) {
              console.log(`Endpoint ${endpoint} succeeded`)
              succeeded = true
              break
            }
          } catch (err) {
            // Continue to next endpoint
            console.log(`Endpoint ${endpoint} failed, trying next...`)
          }
        }

        if (!succeeded || !response) {
          throw new Error("All API endpoints failed")
        }

        const data = await response.json()
        console.log("Customer data loaded:", data)
        setCustomerData(data)
        setApiError(false)
      } catch (error) {
        console.error("Error fetching customer data:", error)
        setApiError(true)

        toast({
          title: "Fout bij laden",
          description: "Kon klantgegevens niet laden. Probeer het later opnieuw.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomerData()
  }, [toast, apiError])

  // Format the customer name with safe access
  const customerName = `${formData.firstName || ""} ${formData.lastName || ""}`.trim() || "Niet ingesteld"

  // Handle form field changes
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Send order to checkout system
  const submitOrder = async () => {
    if (!customerData?.clcleunik) {
      toast({
        title: "Error",
        description: "Klantinformatie is niet beschikbaar. Probeer het opnieuw.",
        variant: "destructive",
      })
      return false
    }

    setIsSubmitting(true)
    try {
      // Prepare order data
      const orderData = {
        customerId: customerData.clcleunik,
        customerEmail: customerData.email,
        customerName: customerName,
        deliveryOption: formData.deliveryOption,
        deliveryAddress:
          formData.deliveryOption === "delivery"
            ? {
                address: formData.address,
                zipcode: formData.zipcode,
                city: formData.city,
                country: formData.country,
              }
            : null,
        pickupLocation: formData.deliveryOption === "pickup" ? "XL Groothandel" : null,
        deliveryDate:
          formData.deliveryOption === "delivery" ? formData.bezorgdatum || formData.selectedDate.date : null,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
        })),
        subtotal,
        shippingCost,
        total,
      }

      // Make the actual API call
      const response = await fetch("/api/checkout/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) throw new Error("Failed to submit order to checkout system")

      toast({
        title: "Bestelling geplaatst",
        description: "Uw bestelling is succesvol verzonden naar het kassasysteem.",
        variant: "default",
      })
      return true
    } catch (error) {
      console.error("Error submitting order:", error)
      toast({
        title: "Error",
        description: "Kon bestelling niet verzenden naar kassasysteem. Probeer het opnieuw.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContinue = async () => {
    // Submit order to checkout system
    const success = await submitOrder()

    // Only proceed to payment if order submission was successful
    if (success) {
      setStep("payment")
    }
  }

  const handleBack = () => {
    setStep("delivery")
  }

  const handleComplete = () => {
    // Here you would typically handle the completion of the checkout process
    console.log("Checkout completed")
  }

  if (step === "payment") {
    return <PaymentMethodsPage onBack={handleBack} onComplete={handleComplete} />
  }

  // Helper function to display field value or "Niet ingesteld" if empty
  const displayField = (value: string | null | undefined) => {
    return value ? value : "Niet ingesteld"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {isLoading && (
          <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded-md text-blue-800">
            <p className="font-medium">Gegevens laden</p>
            <p className="text-sm">Even geduld terwijl we uw gegevens ophalen...</p>
          </div>
        )}
        {apiError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md text-red-800">
            <p className="font-medium">Fout bij laden</p>
            <p className="text-sm">
              Kon klantgegevens niet laden. Probeer het later opnieuw of neem contact op met klantenservice.
            </p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Delivery Options */}
          <div className="flex-1 space-y-8">
            <nav className="flex gap-8 border-b">
              <button className="font-medium text-primary border-b-2 border-primary pb-4">Bezorging</button>
              <button className="font-medium text-gray-400 pb-4">Betaalmethode</button>
            </nav>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h1 className="text-2xl font-bold mb-6">BEZORGING</h1>

              <RadioGroup
                defaultValue={formData.deliveryOption}
                onValueChange={(value) => handleChange("deliveryOption", value as "delivery" | "pickup")}
              >
                <div className="space-y-6">
                  {/* Home Delivery Option */}
                  <div className="flex items-start">
                    <RadioGroupItem value="delivery" id="delivery" className="mt-1" />
                    <div className="ml-3 flex-1">
                      <Label htmlFor="delivery" className="font-medium">
                        Bezorgen (thuis of op een ander adres)
                      </Label>
                      <div className="text-right text-primary font-medium">€ 4,95</div>

                      {formData.deliveryOption === "delivery" && (
                        <div className="mt-4 space-y-4">
                          <div>
                            <Label className="text-lg font-medium mb-2">MIJN GEGEVENS</Label>
                            {isLoading ? (
                              <div className="flex items-center justify-center p-4">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                <span className="ml-2">Gegevens laden...</span>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <Label>Klantnummer</Label>
                                    <div className="p-2 border rounded-md bg-gray-50">
                                      {customerData?.customerNumber}
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Email</Label>
                                    <div className="p-2 border rounded-md bg-gray-50">{customerData?.email}</div>
                                  </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <Label>Voornaam</Label>
                                    <div className="p-2 border rounded-md bg-gray-50">
                                      {formData.firstName || "Niet ingesteld"}
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Achternaam</Label>
                                    <div className="p-2 border rounded-md bg-gray-50">
                                      {formData.lastName || "Niet ingesteld"}
                                    </div>
                                  </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <Label>Adres</Label>
                                    <div className="p-2 border rounded-md bg-gray-50">
                                      {formData.address || "Niet ingesteld"}
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Postcode</Label>
                                    <div className="p-2 border rounded-md bg-gray-50">
                                      {formData.zipcode || "Niet ingesteld"}
                                    </div>
                                  </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <Label>Plaats</Label>
                                    <div className="p-2 border rounded-md bg-gray-50">
                                      {formData.city || "Niet ingesteld"}
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Land</Label>
                                    <div className="p-2 border rounded-md bg-gray-50">
                                      {formData.country || "Niet ingesteld"}
                                    </div>
                                  </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <Label>Telefoon</Label>
                                    <div className="p-2 border rounded-md bg-gray-50">
                                      {formData.phone || "Niet ingesteld"}
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Mobiel</Label>
                                    <div className="p-2 border rounded-md bg-gray-50">
                                      {formData.cellphone || "Niet ingesteld"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-4 text-sm">
                            <button className="text-primary hover:underline">Wijzig mijn adres</button>
                            <button className="text-primary hover:underline">Ander bezorgadres</button>
                          </div>

                          {/* Extra field for bezorgdatum - this is editable */}
                          <div>
                            <Label htmlFor="bezorgdatum">Bezorgdatum (specifiek)</Label>
                            <Input
                              id="bezorgdatum"
                              type="date"
                              className="mt-1"
                              value={formData.bezorgdatum}
                              onChange={(e) => handleChange("bezorgdatum", e.target.value)}
                            />
                          </div>

                          <div>
                            <Label>Bezorgdag</Label>
                            <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                              {deliveryDates.map((date) => (
                                <button
                                  key={date.date}
                                  onClick={() => handleChange("selectedDate", date)}
                                  className={`flex flex-col items-center min-w-[64px] p-2 border rounded-md ${
                                    formData.selectedDate === date ? "border-primary bg-primary/5" : "border-gray-200"
                                  }`}
                                >
                                  <span className="text-sm font-medium">{date.day}</span>
                                  <span className="text-sm">{date.date}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 bg-blue-50 p-4 rounded-md">
                            <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />
                            <p className="text-sm">
                              Let op! Het is niet mogelijk om je pakket te laten leveren bij je buren
                            </p>
                          </div>

                          <div className="flex items-start gap-2">
                            <Checkbox
                              id="billing"
                              checked={formData.differentBillingAddress}
                              onCheckedChange={(checked) => handleChange("differentBillingAddress", checked as boolean)}
                            />
                            <Label htmlFor="billing" className="text-sm">
                              Afwijkend factuuradres (factuur wordt verstuurd per email)
                            </Label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Store Pickup Option */}
                  <div className="flex items-start">
                    <RadioGroupItem value="pickup" id="pickup" className="mt-1" />
                    <div className="ml-3">
                      <Label htmlFor="pickup" className="font-medium">
                        Ophalen bij XL Groothandel
                      </Label>
                      <div className="text-right text-green-600 font-medium">Gratis</div>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-[400px]">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="font-bold mb-4">JOUW OVERZICHT</h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.quantity} × {item.name}
                    </span>
                    <span>€ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-medium pt-4 border-t">
                  <span>Subtotaal</span>
                  <span>€ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Verzendkosten</span>
                  <span>€ {shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-4 border-t">
                  <span>Totaal</span>
                  <span>€ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            TERUG NAAR WINKELWAGEN
          </Button>
          <div className="flex flex-col items-center gap-4">
            <Button
              className="bg-[#FF6B35] hover:bg-[#E85A24] text-white min-w-[200px]"
              onClick={handleContinue}
              disabled={isLoading || isSubmitting}
            >
              {isLoading || isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLoading ? "LADEN..." : "BESTELLING PLAATSEN..."}
                </>
              ) : (
                "DOORGAAN"
              )}
            </Button>
            <div className="flex gap-4">
              {/* Payment method icons using React Icons */}
              <div className="flex flex-col items-center">
                <div className="h-10 w-14 flex items-center justify-center bg-white rounded border shadow-sm">
                  <FaIdeal className="h-6 w-6 text-[#0066FF]" />
                </div>
                <span className="text-xs mt-1">iDEAL</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-10 w-14 flex items-center justify-center bg-white rounded border shadow-sm">
                  <FaCcMastercard className="h-6 w-6 text-[#EB001B]" />
                </div>
                <span className="text-xs mt-1">Mastercard</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-10 w-14 flex items-center justify-center bg-white rounded border shadow-sm">
                  <FaCcVisa className="h-6 w-6 text-[#1434CB]" />
                </div>
                <span className="text-xs mt-1">Visa</span>
              </div>
            </div>
            <div className="text-sm text-center text-gray-500">
              <p>Heb je onze hulp nodig?</p>
              <div className="flex gap-2 justify-center">
                <Link href="/chat" className="text-primary hover:underline">
                  Chat met ons
                </Link>
                <span>of</span>
                <Link href="/feedback" className="text-primary hover:underline">
                  geef feedback
                </Link>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Dit formulier is beschermd met reCaptcha, het{" "}
              <Link href="/privacy" className="underline">
                privacybeleid
              </Link>{" "}
              en{" "}
              <Link href="/terms" className="underline">
                servicevoorwaarden
              </Link>{" "}
              zijn van toepassing.
            </div>
          </div>
          <div className="w-[200px]" /> {/* Spacer for layout balance */}
        </div>
      </div>
    </div>
  )
}

