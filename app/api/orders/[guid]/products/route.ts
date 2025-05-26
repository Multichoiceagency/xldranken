import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getCustomerOrderDetails } from "@/lib/api"

export async function GET(request: Request, { params }: { params: { guid: string } }) {
  try {
    // Get the session to ensure the user is authenticated
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the order GUID from the URL params
    const { guid } = params

    if (!guid) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    console.log(`Fetching order details for GUID: ${guid}`)

    // Fetch real order details from the API
    const orderDetails = await getCustomerOrderDetails(guid)

    if (!orderDetails) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Extract products from the order details
    // Adjust this mapping based on your actual API response structure
    const products =
      orderDetails.lines?.map((line: any) => ({
        id: line.arcleunik || line.id,
        name: line.title || line.name,
        quantity: Number.parseInt(line.qty || "1", 10),
        price: Number.parseFloat(line.prix_vente_groupe || line.price || "0"),
        image: line.photo1_base64
          ? `data:image/jpeg;base64,${line.photo1_base64}`
          : `/placeholder.svg?height=50&width=50&query=${encodeURIComponent(line.title || "product")}`,
      })) || []

    console.log(`Found ${products.length} products for order ${guid}`)

    return NextResponse.json({
      success: true,
      products,
    })
  } catch (error) {
    console.error("Error fetching order products:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch order products",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
