"use server"

import type { CartItem } from "@/lib/cart-context"

export interface ProcessOrderData {
  cart: CartItem[]
  customerData: any
  deliveryOption: "delivery" | "pickup"
  deliveryDate: string
  deliveryAddress?: string
  deliveryInstructions?: string
}

export async function processOrderAndSendConfirmation(orderData: ProcessOrderData) {
  try {
    console.log("=== SERVER ACTION: processOrderAndSendConfirmation ===")
    console.log("Order data received:", {
      cartItems: orderData.cart?.length || 0,
      customerEmail: orderData.customerData?.email,
      deliveryOption: orderData.deliveryOption,
    })

    // Call the API route to process the order
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    const apiUrl = `${baseUrl}/api/process-order`

    console.log(`Calling API: ${apiUrl}`)

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })

    console.log(`API response status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API error response:", errorText)
      throw new Error(`API failed with status ${response.status}: ${errorText}`)
    }

    const result = await response.json()
    console.log("API result:", result)

    return result
  } catch (error) {
    console.error("=== ERROR IN SERVER ACTION ===")
    console.error("Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Er is een fout opgetreden bij het verwerken van de bestelling.",
    }
  }
}
