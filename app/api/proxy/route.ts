import { type NextRequest, NextResponse } from "next/server"

const API_URL = "https://api.megawin.be/product/list/"
const API_KEY = process.env.API_KEY as string

export async function GET(req: NextRequest) {
  try {
    if (!API_KEY) {
      return NextResponse.json({ error: "API Key is missing." }, { status: 500 })
    }

    const { searchParams } = new URL(req.url)
    const productId = searchParams.get("id") // Haal `id` uit de querystring

    console.log("🔎 Ontvangen product ID in API:", productId) // Debugging log

    if (!productId) {
      console.error("❌ Geen product-ID opgegeven in de request.")
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 })
    }

    // 🔗 Bouw de URL voor de externe API-aanroep
    const apiUrl = `${API_URL}?apikey=${API_KEY}`
    console.log("🔗 API-aanroep naar:", apiUrl)

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      console.error(`❌ API Fout: ${response.status} ${response.statusText}`)
      return NextResponse.json(
        { error: `API Error: ${response.status} ${response.statusText}` },
        { status: response.status },
      )
    }

    const data = await response.json()

    if (!data?.result?.product || !Array.isArray(data.result.product)) {
      console.error("❌ Fout: Geen producten ontvangen uit de API.")
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // 🔎 Zoek het juiste product op basis van `id_product_mysql`
    const product = data.result.product.find((p: any) => p.id_product_mysql === productId)

    if (!product) {
      console.error(`❌ Product met ID ${productId} niet gevonden in API-response.`)
      return NextResponse.json({ error: "Product ID not found" }, { status: 404 })
    }

    console.log("✅ Product succesvol geladen:", product.title)
    return NextResponse.json({ product })
  } catch (error) {
    console.error("❌ Server Error:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
