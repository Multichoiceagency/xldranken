import { NextResponse } from "next/server"

// This simulates a database or external API
// In a real application, you would fetch this data from your database
const ordersData = [
  {
    id: "ORD-2024-001",
    date: "05-01-2024",
    status: "Afgeleverd",
    total: "€156,95",
    products: [
      {
        id: "P001",
        name: "Heineken Bier",
        quantity: 2,
        price: "€24,95",
        image: "/placeholder.svg?height=50&width=50&query=beer",
      },
      {
        id: "P002",
        name: "Coca Cola 6x1.5L",
        quantity: 3,
        price: "€12,99",
        image: "/placeholder.svg?height=50&width=50&query=cola",
      },
      {
        id: "P003",
        name: "Tyskie Bier Blik 24x50cl",
        quantity: 1,
        price: "€29,95",
        image: "/placeholder.svg?height=50&width=50&query=tyskie",
      },
    ],
  },
  {
    id: "ORD-2023-089",
    date: "28-12-2023",
    status: "In behandeling",
    total: "€89,50",
    products: [
      {
        id: "P004",
        name: "Witte Wijn Chardonnay",
        quantity: 2,
        price: "€18,95",
        image: "/placeholder.svg?height=50&width=50&query=wine",
      },
      {
        id: "P005",
        name: "Chips Paprika 200g",
        quantity: 4,
        price: "€1,99",
        image: "/placeholder.svg?height=50&width=50&query=chips",
      },
    ],
  },
]

export async function GET(request: Request) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Get URL parameters
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  // In a real application, you would filter orders by userId
  // For now, we'll just return all orders

  return NextResponse.json({
    success: true,
    orders: ordersData,
  })
}

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json()

    // Find the specific order
    const order = ordersData.find((order) => order.id === orderId)

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      order,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid request",
      },
      { status: 400 },
    )
  }
}
