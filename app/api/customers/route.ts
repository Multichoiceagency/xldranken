import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "../auth/[...nextauth]/route"

// Get environment variables
const CUSTOMER_API_URL = process.env.NEXT_PUBLIC_CUSTOMER_API_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

export async function GET() {
  // Check if user is authenticated
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    if (!CUSTOMER_API_URL || !API_KEY) {
      throw new Error("Customer API URL or API Key is not defined")
    }

    // Fetch all customers
    const url = `${CUSTOMER_API_URL}?apikey=${API_KEY}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (data.success !== "true") {
      throw new Error(data.message || "Failed to fetch customers")
    }

    // Filter out sensitive information before sending to client
    const customers = data.result.customer.map((customer: any) => ({
      id: customer.clcleunik,
      customerNumber: customer.customerNumber,
      name:
        `${customer.firstName || ""} ${customer.lastName || ""}`.trim() ||
        customer.denomination ||
        customer.customerNumber,
      email: customer.email,
      city: customer.city,
      country: customer.country,
      addedDate: customer.addedDate,
      isTestUser: customer.email.includes("test") || customer.customerNumber.toLowerCase().includes("test"),
    }))

    return NextResponse.json({ customers })
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}

