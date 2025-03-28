import { NextResponse } from "next/server"

// Ensure this API route is dynamic
export const dynamic = "force-dynamic"

// Get environment variables
const CUSTOMER_API_URL = process.env.NEXT_PUBLIC_CUSTOMER_API_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

export async function GET(request: Request) {
  // Get the customer ID from the query string
  const { searchParams } = new URL(request.url)
  const customerId = searchParams.get("id")

  if (!customerId) {
    return NextResponse.json({ error: "Customer ID is required" }, { status: 400 })
  }

  try {
    if (!CUSTOMER_API_URL || !API_KEY) {
      throw new Error("Customer API URL or API Key is not defined")
    }

    console.log(`Fetching customer data for ID: ${customerId}`)

    // Fetch specific customer by ID
    const url = `${CUSTOMER_API_URL}?apikey=${API_KEY}&id=${customerId}`
    console.log(`Fetching from URL: ${CUSTOMER_API_URL}?apikey=HIDDEN&id=${customerId}`)

    const response = await fetch(url, {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      cache: "no-store",
    })

    console.log(`API Response status: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API Error Response: ${errorText}`)
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("API response structure:", Object.keys(data))

    if (data.success !== "true" || !data.result?.customer || !data.result.customer.length) {
      console.error("Customer not found or unexpected API response:", JSON.stringify(data, null, 2))
      throw new Error(data.message || "Customer not found")
    }

    // Get the first customer from the result (should be only one)
    const customer = data.result.customer[0]
    console.log("Customer found:", customer.customerNumber)

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
    console.error("Error fetching customer:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch customer data",
      },
      { status: 500 },
    )
  }
}

