import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

// Get environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

export async function POST(request: Request) {
  try {
    // Parse the request body first
    const orderData = await request.json()

    // Check if this is a test order
    const isTestOrder = orderData.customerId?.toString().startsWith("TEST") || orderData.customerEmail?.includes("test")

    let session

    // For regular orders, check authentication
    if (!isTestOrder) {
      // Check if user is authenticated
      session = await getServerSession(authOptions)

      if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      // Ensure the customer ID from the session matches the order data
      if (!orderData.customerId || orderData.customerId !== session.user.clcleunik) {
        return NextResponse.json({ error: "Invalid customer ID" }, { status: 400 })
      }
    }

    // Check if this is a test order
    const isTestOrder2 =
      orderData.customerId?.toString().startsWith("TEST") ||
      orderData.customerEmail?.includes("test") ||
      session?.user?.clcleunik?.toString().startsWith("TEST")

    // For test orders, we can either:
    // 1. Return a mock success response without calling the external API
    // 2. Add a test flag to the order data
    // 3. Call a test endpoint instead

    if (isTestOrder) {
      console.log("Processing test order:", orderData.customerId)

      // Generate a test GUID
      const timestamp = new Date().getTime().toString().slice(-4)
      const guid = `TEST-${generateUUID()}-${timestamp}`

      // Return a mock success response
      return NextResponse.json({
        success: true,
        message: "Test order processed successfully (not sent to Megawin)",
        guid,
        result: {
          guid,
          file: `TEST_${guid}.xml`,
          orderNumber: guid.substring(0, 8),
        },
        isTestOrder: true,
      })
    }

    // Generate a unique GUID for the order
    // Format: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX-YYYY where YYYY is a timestamp
    const timestamp = new Date().getTime().toString().slice(-4)
    const guid = `${generateUUID()}-${timestamp}`

    // Format delivery date in YYYY-MM-DD format
    const deliveryDate = orderData.deliveryDate
      ? new Date(orderData.deliveryDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]

    // Determine delivery mode (1 = delivery, 2 = pickup)
    const modeLivraison = orderData.deliveryOption === "delivery" ? "1" : "2"

    // Format delivery address if available
    const deliveryAddress = orderData.deliveryAddress
      ? encodeURIComponent(
          `${orderData.deliveryAddress.address}, ${orderData.deliveryAddress.zipcode} ${orderData.deliveryAddress.city}`,
        )
      : ""

    // Construct the URL for sending the order to the external API with required query parameters
    const sendOrderUrl = `${API_URL}/order/sendtomegawin/?apikey=${API_KEY}&guid=${guid}&modeLivraison=${modeLivraison}&deliverydate=${deliveryDate}${deliveryAddress ? `&adresseLivraison=${deliveryAddress}` : ""}`

    // Prepare the data to be sent to the external API
    const externalOrderData = {
      guid,
      customerId: orderData.customerId,
      customerEmail: orderData.customerEmail,
      customerName: orderData.customerName,
      items: orderData.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
        productCode: item.productCode,
        volume: item.volume,
      })),
      subtotal: orderData.subtotal,
      shippingCost: orderData.shippingCost,
      total: orderData.total,
    }

    // Send the order to the external API
    const response = await fetch(sendOrderUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ guid }),
    })

    if (!response.ok) {
      // Try to get more error details
      let errorDetails = ""
      try {
        const errorData = await response.text()
        errorDetails = ` Details: ${errorData}`
      } catch (e) {
        // Ignore error parsing error
      }

      throw new Error(`API Error: ${response.status} ${response.statusText}${errorDetails}`)
    }

    const result = await response.json()

    // Return the result with the generated GUID
    return NextResponse.json({
      success: true,
      message: "Order successfully sent to Megawin",
      guid,
      result,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to send order to Megawin",
      },
      { status: 500 },
    )
  }
}

// Helper function to generate a UUID
function generateUUID() {
  return "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".replace(/[x]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return r.toString(16)
  })
}

