"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, ShoppingBag, FileText, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"

export default function ThankYouPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCart()

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  })


  // Get order details from URL parameters
  const orderNumber = searchParams.get("orderNumber")
  const totalAmount = searchParams.get("total")

  useEffect(() => {
    // Clear the cart when the thank you page loads
    clearCart()

    // Update window size for confetti
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    
    return () => window.removeEventListener("resize", handleResize)
  }, [clearCart])

  // If no order number is provided, redirect to home
  useEffect(() => {
    if (!orderNumber) {
      const timer = setTimeout(() => {
        router.push("/")
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [orderNumber, router])

  if (!orderNumber) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Geen bestelgegevens gevonden</h1>
          <p className="mb-6 text-gray-600">U wordt doorgestuurd naar de homepage...</p>
          <Button onClick={() => router.push("/")}>Ga naar homepage</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2">Bedankt voor uw bestelling!</h1>
          <p className="text-center text-gray-600 mb-8">Uw bestelling is succesvol ontvangen en wordt nu verwerkt.</p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Bestelgegevens</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Bestelnummer</p>
                <p className="font-medium">{orderNumber}</p>
              </div>
              {totalAmount && (
                <div>
                  <p className="text-sm text-gray-500">Totaalbedrag</p>
                  <p className="font-medium">€ {totalAmount}</p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-center text-gray-600 mb-6">
              Een bevestigingsmail is verzonden naar uw e-mailadres met alle details van uw bestelling.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/account/bestellingen" className="w-full">
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Bekijk mijn bestellingen
                </Button>
              </Link>
              <Link href="/" className="w-full">
                <Button className="w-full bg-[#BEA46A] hover:bg-[#A89050] text-white">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Terug naar de winkel
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Wat gebeurt er nu?</h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-[#BEA46A] rounded-full h-6 w-6 flex items-center justify-center text-white font-medium">
                  1
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">Orderverwerking</h3>
                  <p className="text-sm text-gray-600">Uw bestelling wordt verwerkt en voorbereid voor verzending.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-[#BEA46A] rounded-full h-6 w-6 flex items-center justify-center text-white font-medium">
                  2
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">Verzending</h3>
                  <p className="text-sm text-gray-600">
                    Zodra uw bestelling is verzonden, ontvangt u een e-mail met de verzendgegevens.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-[#BEA46A] rounded-full h-6 w-6 flex items-center justify-center text-white font-medium">
                  3
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">Levering</h3>
                  <p className="text-sm text-gray-600">
                    Uw bestelling wordt geleverd volgens de gekozen leveringsmethode.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <Link href="/klantenservice" className="flex items-center text-[#BEA46A] hover:underline">
                <span>Heeft u vragen? Neem contact op met onze klantenservice</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
