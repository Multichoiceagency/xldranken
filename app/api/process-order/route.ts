import { type NextRequest, NextResponse } from "next/server"
import { handleOrders } from "@/lib/api"
import type { CartItem } from "@/lib/cart-context"
import type { OrderConfirmationData } from "@/lib/email-service"
import { categorizeProduct, getCategoryName } from "@/lib/product-categorizer"

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

    // Log detailed cart information
    console.log("=== CART ITEMS WITH GUID INFO ===")
    orderData.cart?.forEach((item, index) => {
      console.log(`Item ${index + 1}:`, {
        id: item.id,
        name: item.name,
        guid: item.guid || "NO GUID",
        volume: item.volume,
        productCode: item.productCode,
        arcleunik: item.arcleunik,
        existingFam2id: item.fam2id,
        price: item.price,
        quantity: item.quantity,
      })
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
    }

    // Calculate totals
    const subtotal = orderData.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const total = subtotal

    console.log(`Order totals - Subtotal: €${subtotal.toFixed(2)}, Total: €${total.toFixed(2)}`)

    // Live API-based categorization
    console.log("=== LIVE API CATEGORIZATION PROCESS ===")

    const categorizedItems = await Promise.all(
      orderData.cart.map(async (item, index) => {
        console.log(`\n--- Processing item ${index + 1}: "${item.name}" ---`)
        console.log(`    GUID: "${item.guid || "N/A"}"`)
        console.log(`    Volume (arcleunik): "${item.volume}"`)
        console.log(`    Existing fam2id: "${item.fam2id || "N/A"}"`)

        try {
          const actualArcleunik = item.arcleunik || item.volume

          // Use live categorization with GUID
          const result = await categorizeProduct(
            item.name,
            item.volume,
            actualArcleunik,
            item.fam2id,
            item.guid, // Pass GUID for live API lookup
          )

          const fam2id = typeof result === "string" ? result : result.fam2id
          const categoryName = getCategoryName(fam2id)
          const matchType = typeof result === "string" ? "fallback" : result.matchType
          const confidence = typeof result === "string" ? 0.1 : result.confidence

          console.log(
            `📋 LIVE CATEGORIZATION RESULT: "${item.name}" -> fam2id="${fam2id}" -> category="${categoryName}" [${matchType}, confidence: ${confidence.toFixed(3)}]`,
          )

          // Log API success
          if (matchType === "api_exact") {
            console.log(`🎯 API EXACT MATCH: Got perfect categorization from live API!`)
          } else if (matchType === "api_error") {
            console.warn(`⚠️ API ERROR: Fell back to local categorization`)
          }

          return {
            ...item,
            arcleunik: actualArcleunik,
            fam2id,
            category: categoryName,
            matchType: matchType as "api_exact" | "existing" | "exact" | "partial" | "fallback" | "id_match" | "api_error" | undefined,
            confidence,
          }
        } catch (error) {
          console.error(`❌ Error categorizing item "${item.name}":`, error)
          return {
            ...item,
            arcleunik: item.arcleunik || item.volume,
            fam2id: "21",
            category: "NON-FOOD",
            matchType: "api_error" as const,
            confidence: 0.05,
          }
        }
      }),
    )

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
      items: categorizedItems,
      subtotal,
      total,
      deliveryInstructions: orderData.deliveryInstructions,
    }

    // Enhanced categorization summary
    console.log("=== LIVE CATEGORIZATION SUMMARY ===")
    const categorySummary: Record<string, number> = {}
    const matchTypeSummary: Record<string, number> = {}
    const confidenceSummary: Record<string, number> = {}
    let apiExactMatches = 0
    let apiErrors = 0
    let totalLowConfidence = 0

    emailData.items.forEach((item) => {
      const category = item.category || "UNKNOWN"
      const matchType = (item as any).matchType || "unknown"
      const confidence = (item as any).confidence || 0

      categorySummary[category] = (categorySummary[category] || 0) + item.quantity
      matchTypeSummary[matchType] = (matchTypeSummary[matchType] || 0) + 1

      if (matchType === "api_exact") apiExactMatches++
      if (matchType === "api_error") apiErrors++

      if (confidence >= 0.9) confidenceSummary["high"] = (confidenceSummary["high"] || 0) + 1
      else if (confidence >= 0.7) confidenceSummary["medium"] = (confidenceSummary["medium"] || 0) + 1
      else confidenceSummary["low"] = (confidenceSummary["low"] || 0) + 1

      if (confidence < 0.7) totalLowConfidence++
    })

    console.log("Categories found:", categorySummary)
    console.log("Match types:", matchTypeSummary)
    console.log("Confidence distribution:", confidenceSummary)
    console.log(`API exact matches: ${apiExactMatches}/${emailData.items.length}`)
    console.log(`API errors: ${apiErrors}/${emailData.items.length}`)
    console.log(`Low confidence items: ${totalLowConfidence}/${emailData.items.length}`)

    // Send emails
    console.log("=== SENDING EMAILS ===")
    const { sendOrderConfirmationEmail, sendCompletePackingSlipToAdmin } = await import("@/lib/email-service")

    const adminEmailPromise = sendCompletePackingSlipToAdmin(emailData).catch((error) => {
      console.error("Admin email error (background):", error)
      return false
    })

    let emailSent = false
    try {
      emailSent = await sendOrderConfirmationEmail(emailData)
      console.log(`Customer email result: ${emailSent}`)
    } catch (error) {
      console.error("Customer email error:", error)
    }

    // Enhanced result with live API stats
    const result = {
      success: true,
      orderNumber,
      total: total.toFixed(2),
      emailSent,
      message: `Order processed - Customer email: ${emailSent ? "sent" : "failed"}, Admin email: sending in background`,
      categorization: {
        categories: categorySummary,
        matchTypes: matchTypeSummary,
        confidenceDistribution: confidenceSummary,
        apiStats: {
          exactMatches: apiExactMatches,
          errors: apiErrors,
          successRate: ((apiExactMatches / emailData.items.length) * 100).toFixed(1),
        },
        lowConfidenceCount: totalLowConfidence,
        totalItems: emailData.items.length,
        averageConfidence:
          emailData.items.reduce((sum, item) => sum + ((item as any).confidence || 0), 0) / emailData.items.length,
      },
    }

    console.log("=== PROCESS ORDER COMPLETED ===")
    console.log("Final result:", result)

    adminEmailPromise.then((adminEmailSent) => {
      console.log(`Admin email result (background): ${adminEmailSent}`)
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("=== ERROR IN PROCESS ORDER API ===")
    console.error("Error:", error)

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
