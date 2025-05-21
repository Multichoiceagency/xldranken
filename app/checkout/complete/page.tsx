"use client"

import CheckoutCompleteContent from "@/components/checkout-complete-content"
import { Suspense } from "react"

export default function CheckoutCompletePage() {
  return (
    <Suspense fallback={<CheckoutCompleteLoading />}>
      <CheckoutCompleteContent />
    </Suspense>
  )
}

function CheckoutCompleteLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <div className="w-8 h-8 animate-pulse bg-gray-300 rounded-full" />
            </div>
            <h1 className="text-2xl font-bold">Bestelling verwerken...</h1>
            <p className="text-gray-600 mt-2">Een moment geduld alstublieft.</p>
          </div>

          <div className="border rounded-lg p-6 mb-8">
            <h2 className="font-bold text-lg mb-4">Bestelgegevens</h2>
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
