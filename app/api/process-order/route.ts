import { type NextRequest, NextResponse } from "next/server"
import { handleOrders } from "@/lib/api"
import type { CartItem } from "@/lib/cart-context"
import type { OrderConfirmationData } from "@/lib/email-service"
import { categorizeProduc } from "@/lib/product-categorizer"
import { categoryMapping } from "@/lib/email-templates"

interface ProcessOrderRequest {
  cart: CartItem[]
  customerData: any
  deliveryOption: "delivery" | "pickup"
  deliveryDate: string
  deliveryAddress?: string
  deliveryInstructions?: string
}

export async function POST(request: NextRequest) {
  try {
    console.log("=== PROCESS ORDER API STARTED ===")

    const orderData: ProcessOrderRequest = await request.json()

    console.log("Processing order with data:", {
      cartItems: orderData.cart?.length || 0,
      customerEmail: orderData.customerData?.email,
      deliveryOption: orderData.deliveryOption,
      deliveryDate: orderData.deliveryDate,
      hasDeliveryAddress: !!orderData.deliveryAddress,
    })

    // Validate required fields
    if (!orderData.cart?.length || !orderData.customerData) {
      console.error("Missing required order data")
      return NextResponse.json({ success: false, error: "Missing required order data" }, { status: 400 })
    }

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    console.log(`Generated order number: ${orderNumber}`)

    // Process the order with Megawin API
    console.log("Processing order with Megawin API...")
    try {
      await handleOrders(orderData.cart, orderData.customerData)
      console.log("Megawin API processing completed")
    } catch (apiError) {
      console.error("Megawin API error:", apiError)
      // Continue with email sending even if API fails
    }

    // Calculate totals
    const subtotal = orderData.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const total = subtotal // No shipping costs

    console.log(`Order totals - Subtotal: €${subtotal.toFixed(2)}, Total: €${total.toFixed(2)}`)

    // Log the categoryMapping to see what mappings are available
    console.log("Category Mapping in API:", categoryMapping)

    // Log each item with its fam2id for debugging
    console.log("Cart items with fam2id:")
    orderData.cart.forEach((item, index) => {
      console.log(`Item ${index}: ${item.name}, fam2id: ${item.fam2id || "undefined"}, volume: ${item.volume}`)
    })

    // Update the email data preparation to preserve original fam2id values
    // Prepare email data - preserve original fam2id values
    const emailData: OrderConfirmationData = {
      orderNumber,
      customerName:
        `${orderData.customerData.firstname || ""} ${orderData.customerData.lastname || ""}`.trim() || "Klant",
      customerEmail: orderData.customerData.email || "customer@example.com",
      orderDate: new Date().toLocaleDateString("nl-NL", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      deliveryDate: orderData.deliveryDate,
      deliveryOption: orderData.deliveryOption,
      deliveryAddress: orderData.deliveryAddress,
      items: orderData.cart.map((item) => {
        // Log the original fam2id for debugging
        console.log(`Processing item for email: ${item.name}, original fam2id: ${item.fam2id || "undefined"}`)

        // Only categorize if fam2id is completely missing
        if (item.fam2id === undefined) {
          const fam2id = categorizeProduc(item.name, item.volume)
          console.log(
            `API categorized (fallback): ${item.name} -> fam2id: ${fam2id} -> category: ${categoryMapping[fam2id] || "UNKNOWN"}`,
          )
          return { ...item, fam2id }
        }

        console.log(
          `Preserving original fam2id: ${item.name} -> ${item.fam2id} -> category: ${categoryMapping[item.fam2id] || "UNKNOWN"}`,
        )
        return item
      }),
      subtotal,
      total,
      deliveryInstructions: orderData.deliveryInstructions,
    }

    console.log("Prepared email data:", {
      orderNumber: emailData.orderNumber,
      customerName: emailData.customerName,
      customerEmail: emailData.customerEmail,
      itemCount: emailData.items.length,
      deliveryAddress: emailData.deliveryAddress,
    })

    // Log each item with its category for debugging
    console.log("Email items with categories:")
    emailData.items.forEach((item, index) => {
      console.log(
        `Item ${index}: ${item.name}, fam2id: ${item.fam2id || "undefined"}, category: ${categoryMapping[item.fam2id || "21"] || "UNKNOWN"}`,
      )
    })

    // Send emails via API route - DIRECT CALL
    console.log("=== CALLING EMAIL API DIRECTLY ===")

    // Import the email functions directly to avoid HTTP call issues
    const { sendOrderConfirmationEmail, sendCompletePackingSlipToAdmin } = await import("@/lib/email-service")

    let emailSent = false
    let adminEmailSent = false

    // Send customer email
    console.log("Sending customer email...")
    try {
      emailSent = await sendOrderConfirmationEmail(emailData)
      console.log(`Customer email result: ${emailSent}`)
    } catch (error) {
      console.error("Customer email error:", error)
    }

    // Send admin email with PDF
    console.log("Sending admin email with PDF...")
    try {
      adminEmailSent = await sendCompletePackingSlipToAdmin(emailData)
      console.log(`Admin email result: ${adminEmailSent}`)
    } catch (error) {
      console.error("Admin email error:", error)
    }

    // Return success with order details
    const result = {
      success: true,
      orderNumber,
      total: total.toFixed(2),
      emailSent,
      adminEmailSent,
      message: `Order processed - Customer: ${emailSent ? "sent" : "failed"}, Admin: ${adminEmailSent ? "sent" : "failed"}`,
    }

    console.log("=== PROCESS ORDER COMPLETED ===")
    console.log("Final result:", result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("=== ERROR IN PROCESS ORDER API ===")
    console.error("Error:", error)
    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Er is een fout opgetreden bij het verwerken van de bestelling.",
        details: "Check server logs for more information",
      },
      { status: 500 },
    )
  }
}
