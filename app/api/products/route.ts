import { NextResponse } from "next/server"

const API_URL = "https://api.megawin.be/product/list/"
const API_KEY = "YIwYR3LZbNXllabpGviSnXBHvtqfPAIN"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const fam2ID = searchParams.get("fam2ID") || "6" // Standaard categorie ID = 6

  try {
    const response = await fetch(`${API_URL}?apikey=${API_KEY}&fam2ID=${fam2ID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) throw new Error(`API Error: ${response.status}`)

    const data = await response.json()

    if (!data.result || !data.result.product) {
      return NextResponse.json({ error: "Geen producten gevonden" }, { status: 404 })
    }

    // Producten formatteren
    const products = data.result.product.map((p: any) => ({
      id: p.id_product_mysql,
      title: p.title,
      price: parseFloat(p.prix_vente_groupe),
      image: `data:image/jpeg;base64,${p.photo1_base64}`,
      category: p.fam2ID,
    }))

    return NextResponse.json({ products })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
