"use client"

import { use, Suspense } from "react"
import { CheckCircle, Package, Mail, Home, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface CheckoutCompleteProps {
  searchParams: Promise<{
    orderNumber?: string
    total?: string
    emailSent?: string
  }>
}

function CheckoutCompleteWrapper({ searchParams }: CheckoutCompleteProps) {
  // Use React.use() to unwrap the searchParams Promise
  const params = use(searchParams)
  const { orderNumber, total, emailSent } = params

  if (!orderNumber) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <Package className="w-16 h-16 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Bestelling niet gevonden</h1>
            <p className="text-gray-600 mb-6">Er is een probleem opgetreden bij het laden van uw bestelling.</p>
            <Link href="/">
              <Button className="w-full bg-[#FF6B35] hover:bg-[#E85A24]">Terug naar home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bestelling Geplaatst!</h1>
            <p className="text-lg text-gray-600">Bedankt voor uw bestelling bij XL Groothandel</p>
          </div>

          {/* Order Details Card */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Bestelnummer</h3>
                  <p className="text-2xl font-bold text-[#FF6B35]">{orderNumber}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Totaalbedrag</h3>
                  <p className="text-2xl font-bold text-gray-900">€{total}</p>
                </div>
              </div>

              <div className="border-t pt-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Wat gebeurt er nu?</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Bestelling ontvangen</p>
                      <p className="text-sm text-gray-600">Uw bestelling is succesvol geplaatst en wordt verwerkt</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        emailSent === "true" ? "bg-green-100" : "bg-yellow-100"
                      }`}
                    >
                      <Mail className={`w-5 h-5 ${emailSent === "true" ? "text-green-600" : "text-yellow-600"}`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {emailSent === "true" ? "Bevestiging verzonden" : "Bevestiging wordt verzonden"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {emailSent === "true"
                          ? "Een gedetailleerde orderbevestiging is naar uw e-mailadres verzonden"
                          : "Een orderbevestiging wordt binnenkort naar uw e-mailadres verzonden"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Bestelling wordt voorbereid</p>
                      <p className="text-sm text-gray-600">Wij bereiden uw bestelling voor en houden u op de hoogte</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Confirmation Notice */}
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Mail className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Orderbevestiging per e-mail</h3>
                  <p className="text-blue-800 text-sm mb-3">
                    U ontvangt een gedetailleerde orderbevestiging met alle producten georganiseerd per categorie. Deze
                    e-mail bevat alle informatie die u nodig heeft over uw bestelling.
                  </p>
                  <div className="text-xs text-blue-700">
                    <strong>Let op:</strong> Controleer ook uw spam/ongewenste e-mail map als u de bevestiging niet
                    binnen 10 minuten ontvangt.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/">
              <Button variant="outline" className="w-full h-12">
                <Home className="w-5 h-5 mr-2" />
                Terug naar home
              </Button>
            </Link>
            <Link href="/categorie">
              <Button className="w-full h-12 bg-[#FF6B35] hover:bg-[#E85A24]">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Verder winkelen
              </Button>
            </Link>
          </div>

          {/* Contact Information */}
          <Card className="mt-8">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Vragen over uw bestelling?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Neem contact met ons op voor vragen over uw bestelling {orderNumber}
              </p>
              <div className="text-sm text-gray-500">
                <p>XL Groothandel B.V.</p>
                <p>Turfschipper 116, 2292 JB Wateringen</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutCompletePage({ searchParams }: CheckoutCompleteProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
            <p className="text-gray-600">Bestelling wordt verwerkt...</p>
          </div>
        </div>
      }
    >
      <CheckoutCompleteWrapper searchParams={searchParams} />
    </Suspense>
  )
}
