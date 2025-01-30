import { type NextRequest, NextResponse } from "next/server"

const API_URL = process.env.NEXT_PUBLIC_API_URL as string
const API_KEY = process.env.API_KEY as string

export async function GET(req: NextRequest) {
  try {
    if (!API_URL || !API_KEY) {
      throw new Error("API URL or API Key is missing in environment variables.")
    }

    const { searchParams } = new URL(req.url)
    const params = new URLSearchParams()

    // Add API key
    params.append("apikey", API_KEY)

    // Copy all search params from the request
    for (const [key, value] of searchParams.entries()) {
      if (key !== "apikey") {
        // Don't duplicate apikey
        params.append(key, value)
      }
    }

    const fullUrl = `${API_URL}?${params.toString()}`
    console.log("Fetching from:", fullUrl)

    const response = await fetch(fullUrl, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("API response data:", JSON.stringify(data, null, 2))

    if (!data?.result?.product || !Array.isArray(data.result.product)) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(
      { product: data.result.product.length === 1 ? data.result.product[0] : data.result.product },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    )
  } catch (error) {
    console.error("Server Error:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

