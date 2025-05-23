"use client"

import { useEffect, useState, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, Truck } from "lucide-react"
import { useCart } from "@/lib/cart-context"

export default function CheckoutCompleteContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCart()

  // Get and memoize order details from URL params
  const orderNumber = searchParams.get("orderNumber") || "Unknown"
  const total = searchParams.get("total") || "0.00"

  // Initialize dates only once
  const [orderDetails] = useState(() => {
    const currentDate = new Date()

    // Calculate estimated delivery date (3 business days from now)
    const estimatedDelivery = new Date(currentDate)
    let businessDaysToAdd = 3

    while (businessDaysToAdd > 0) {
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 1)
      if (estimatedDelivery.getDay() !== 0 && estimatedDelivery.getDay() !== 6) {
        businessDaysToAdd--
      }
    }

    // Format dates
    const formattedOrderDate = currentDate.toLocaleDateString("nl-NL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })

    const formattedDeliveryDate = estimatedDelivery.toLocaleDateString("nl-NL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })

    return {
      currentDate,
      estimatedDelivery,
      formattedOrderDate,
      formattedDeliveryDate,
    }
  })

  // Memoize navigation handlers to prevent recreating on each render
  const handleNavigateHome = useCallback(() => {
    try {
      router.push("/")
    } catch (error) {
      console.error("Navigation error:", error)
      window.location.href = "/"
    }
  }, [router])

  const handleNavigateOrders = useCallback(() => {
    try {
      router.push("/account/bestellingen")
    } catch (error) {
      console.error("Navigation error:", error)
      // No fallback needed here as this is not a critical navigation
    }
  }, [router])

  // Clear cart on page load - with proper error handling
  useEffect(() => {
    const performCartClear = async () => {
      try {
        await clearCart()
      } catch (error) {
        console.error("Error clearing cart:", error)
      }
    }

    performCartClear()
    // We only want to run this once when the component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold">Bedankt voor je bestelling!</h1>
            <p className="text-gray-600 mt-2">Je bestelling is succesvol geplaatst en wordt nu verwerkt.</p>
          </div>

          {/* Order Details */}
          <div className="border rounded-lg p-6 mb-8">
            <h2 className="font-bold text-lg mb-4">Bestelgegevens</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Bestelnummer</p>
                <p className="font-medium">{orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Besteldatum</p>
                <p className="font-medium">{orderDetails.formattedOrderDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Totaalbedrag</p>
                <p className="font-medium">€ {total}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Betaalmethode</p>
                <p className="font-medium">Achteraf betalen binnen 7 dagen op factuur</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Verwachte levering</p>
                  <p className="text-gray-600">{orderDetails.formattedDeliveryDate}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Je ontvangt een e-mail met de verzendbevestiging zodra je bestelling is verzonden.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="font-bold text-lg mb-4">Wat gebeurt er nu?</h2>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <p className="font-medium">Bevestigingsmail</p>
                  <p className="text-sm text-gray-600">
                    We hebben een bevestiging van je bestelling naar je e-mailadres gestuurd.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <p className="font-medium">Verwerking</p>
                  <p className="text-sm text-gray-600">
                    We gaan je bestelling nu verwerken en klaarmaken voor verzending.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <p className="font-medium">Verzending</p>
                  <p className="text-sm text-gray-600">
                    Zodra we je bestelling hebben verzonden, ontvang je een e-mail met de verzendinformatie.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="flex-1" onClick={handleNavigateOrders}>
              <Package className="w-4 h-4 mr-2" />
              Bekijk mijn bestellingen
            </Button>
            <Button className="flex-1 bg-[#FF6B35] hover:bg-[#E85A24] text-white" onClick={handleNavigateHome}>
              Terug naar de homepage
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
