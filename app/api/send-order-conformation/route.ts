import { type NextRequest, NextResponse } from "next/server"
import {
  sendOrderConfirmationEmail,
  sendCompletePackingSlipToAdmin,
  type OrderConfirmationData,
} from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    console.log("=== ORDER CONFIRMATION API STARTED ===")

    const emailData: OrderConfirmationData = await request.json()

    console.log("Received order data:", {
      orderNumber: emailData.orderNumber,
      customerEmail: emailData.customerEmail,
      itemCount: emailData.items?.length || 0,
      total: emailData.total,
      adminEmailConfigured: !!process.env.EMAIL_TO,
    })

    // Validate required fields
    if (!emailData.orderNumber || !emailData.customerEmail || !emailData.items?.length) {
      console.error("Missing required order data:", {
        hasOrderNumber: !!emailData.orderNumber,
        hasCustomerEmail: !!emailData.customerEmail,
        hasItems: !!emailData.items?.length,
      })
      return NextResponse.json({ success: false, error: "Missing required order data" }, { status: 400 })
    }

    // Check admin email configuration
    if (!process.env.EMAIL_TO) {
      console.error("EMAIL_TO not configured - admin will not receive notifications")
    }

    let emailSent = false
    let packingSlipSent = false

    // Step 1: Send confirmation email to customer
    console.log("=== STEP 1: SENDING CUSTOMER EMAIL ===")
    try {
      emailSent = await sendOrderConfirmationEmail(emailData)
      console.log(`Customer email result: ${emailSent}`)
    } catch (error) {
      console.error("Customer email failed:", error)
    }

    // Step 2: Send admin email with PDF (always attempt, even if customer email fails)
    console.log("=== STEP 2: SENDING ADMIN EMAIL WITH PDF ===")
    try {
      packingSlipSent = await sendCompletePackingSlipToAdmin(emailData)
      console.log(`Admin email with PDF result: ${packingSlipSent}`)
    } catch (error) {
      console.error("Admin email failed:", error)
    }

    // Determine overall success
    const overallSuccess = emailSent || packingSlipSent

    console.log("=== FINAL RESULTS ===")
    console.log(`Customer email sent: ${emailSent}`)
    console.log(`Admin email with PDF sent: ${packingSlipSent}`)
    console.log(`Overall success: ${overallSuccess}`)

    if (!emailSent && !packingSlipSent) {
      console.error("Both customer and admin emails failed")
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send both customer and admin emails",
          details: {
            customerEmailSent: emailSent,
            adminEmailSent: packingSlipSent,
          },
        },
        { status: 500 },
      )
    }

    if (!emailSent) {
      console.warn("Customer email failed but admin email succeeded")
    }

    if (!packingSlipSent) {
      console.warn("Admin email failed but customer email succeeded")
    }

    return NextResponse.json({
      success: overallSuccess,
      emailSent,
      packingSlipSent,
      adminNotificationSent: packingSlipSent, // Same as packingSlipSent since they're combined
      message: `Order ${emailData.orderNumber} processed - Customer: ${emailSent ? "sent" : "failed"}, Admin: ${packingSlipSent ? "sent" : "failed"}`,
      orderNumber: emailData.orderNumber,
    })
  } catch (error) {
    console.error("=== CRITICAL ERROR IN ORDER CONFIRMATION API ===")
    console.error("Error:", error)
    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
        details: "Check server logs for more information",
      },
      { status: 500 },
    )
  }
}
