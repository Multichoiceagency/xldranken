import { type NextRequest, NextResponse } from "next/server"
import { sendCustomerConfirmationEmail, sendAdminNotificationEmail, generatePackingSlipPDF } from "@/lib/email-service"
import { getProductByArcleunik } from "@/lib/api"

export async function POST(request: NextRequest) {
  try {
    const { customerData, orderData, orderNumber } = await request.json()

    // Enrich order items with product details and categories
    const enrichedItems = await Promise.all(
      orderData.items.map(async (item: any) => {
        let fam2ID = item.fam2ID
        let categoryName = "Onbekend"

        // Try to get product details if fam2ID is missing
        if (!fam2ID && item.arcleunik) {
          try {
            const product = await getProductByArcleunik(item.arcleunik)
            fam2ID = product?.fam2ID
          } catch (error) {
            console.warn(`Could not fetch product details for ${item.arcleunik}:`, error)
          }
        }

        // Get category name
        if (fam2ID) {
          const categoryMap: { [key: string]: string } = {
            "1": "LIMONADEN",
            "3": "POOLSE BIER FLES",
            "4": "POOLSE BIER BLIK",
            "5": "MIX DRANK / NL BIER",
            "6": "FRISDRANKEN",
            "7": "WATER NL",
            "10": "COCKTAILS",
            "13": "WIJN",
            "16": "STERKE DRANK",
            "18": "WATER PL / NON-FOOD",
            "20": "FOOD / HOUTSKOOL",
            "22": "SCHOONMAAK",
          }
          categoryName = categoryMap[fam2ID] || `Categorie ${fam2ID}`
        }

        return {
          ...item,
          fam2ID,
          category: categoryName,
        }
      }),
    )

    // Update orderData with enriched items
    const enrichedOrderData = {
      ...orderData,
      items: enrichedItems,
    }

    // Generate packing slip PDF with categorized items
    const packingSlipData = {
      orderNumber,
      orderDate: new Date().toLocaleDateString("nl-NL"),
      customer: customerData,
      items: enrichedItems.map((item: any) => ({
        arcleunik: item.arcleunik || item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.priceExclVAT || item.price,
        total: item.quantity * (item.priceExclVAT || item.price),
        category: item.category,
        fam2ID: item.fam2ID,
      })),
      totals: {
        subtotal: orderData.subtotalExclVAT,
        vat: orderData.totalVatAmount,
        shipping: orderData.shippingCost,
        total: orderData.totalInclVAT,
      },
      deliveryInfo: {
        option: orderData.deliveryOption,
        date: orderData.deliveryDate,
        address: orderData.deliveryAddress,
        comment: orderData.deliveryComment,
      },
    }

    const packingSlipPDF = await generatePackingSlipPDF(packingSlipData)

    // Send customer confirmation email
    await sendCustomerConfirmationEmail(customerData, enrichedOrderData, orderNumber)

    // Send admin notification email with PDF
    await sendAdminNotificationEmail(customerData, enrichedOrderData, orderNumber, packingSlipPDF)

    return NextResponse.json({
      success: true,
      message: "Emails sent successfully with categorized products",
    })
  } catch (error) {
    console.error("Error sending emails:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to send emails",
      },
      { status: 500 },
    )
  }
}
