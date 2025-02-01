import { type NextRequest, NextResponse } from "next/server"

const API_URL = process.env.API_URL as string
const API_KEY = process.env.API_KEY as string

export async function GET(req: NextRequest) {
  try {
    // Controleer of API_URL en API_KEY correct zijn ingesteld
    if (!API_URL || !API_KEY) {
      return NextResponse.json({ error: "API URL or API Key is missing." }, { status: 500 })
    }

    // Haal de queryparameters op uit de request
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    // Als er geen 'id' is, geef dan een 400-fout terug
    if (!id) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 })
    }

    // Queryparameters opbouwen (zonder API-key in de URL)
    const params = new URLSearchParams(searchParams)
    const fullUrl = `${API_URL}?${params.toString()}`

    console.log("🔗 Proxying request to:", fullUrl)

    // API-call uitvoeren
    const response = await fetch(fullUrl, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`, // Stuur API-sleutel als header
      },
    })

    // Als de API een fout terugstuurt, geef die fout dan correct door
    if (!response.ok) {
      return NextResponse.json(
        { error: `API Error: ${response.status} ${response.statusText}` },
        { status: response.status },
      )
    }

    // API-response verwerken
    const data = await response.json()
    console.log("✅ API response data:", JSON.stringify(data, null, 2))

    // Controleer of er een geldig product in de response zit
    if (!data?.result?.product || !Array.isArray(data.result.product)) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Als er één product is, stuur dat als object terug, anders als array
    return NextResponse.json(
      { product: data.result.product.length === 1 ? data.result.product[0] : data.result.product },
      {
        headers: {
          "Access-Control-Allow-Origin": process.env.NODE_ENV === "production"
            ? "https://jouwwebsite.com"
            : "http://localhost:3000",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    )
  } catch (error) {
    console.error("❌ Server Error:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
