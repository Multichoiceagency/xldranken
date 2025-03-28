import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { NextResponse } from "next/server"

// Ensure this API route is dynamic
export const dynamic = "force-dynamic"

// Get environment variables
const CUSTOMER_API_URL = process.env.NEXT_PUBLIC_CUSTOMER_API_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

export async function GET() {
  // Check if user is authenticated
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    if (!CUSTOMER_API_URL || !API_KEY) {
      throw new Error("Customer API URL or API Key is not defined")
    }

    // Get the customer ID from the session
    const customerId = session.user.clcleunik

    if (!customerId) {
      throw new Error("Customer ID not found in session")
    }

    // Fetch specific customer by ID
    const url = `${CUSTOMER_API_URL}?apikey=${API_KEY}&id=${customerId}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (data.success !== "true" || !data.result?.customer || !data.result.customer.length) {
      throw new Error(data.message || "Customer not found")
    }

    // Get the first customer from the result (should be only one)
    const customer = data.result.customer[0]

    // Return the customer data
    return NextResponse.json({
      clcleunik: customer.clcleunik,
      customerNumber: customer.customerNumber,
      login: customer.login || customer.email,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      address: customer.address,
      zipcode: customer.zipcode,
      city: customer.city,
      country: customer.country,
      phone: customer.phone,
      cellphone: customer.cellphone,
      denomination: customer.denomination,
      tvaNumber: customer.tvaNumber,
      isTestAccount: customer.email?.includes("test") || customer.customerNumber?.toLowerCase().includes("test"),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch customer data",
      },
      { status: 500 },
    )
  }
}

