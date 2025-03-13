import type { ProductProps } from "@/types/product"

const API_URL = process.env.NEXT_PUBLIC_API_URL as string
const API_KEY = process.env.API_KEY as string

export async function getProductsByFam2ID(fam2ID: string): Promise<ProductProps[]> {
  try {
    const params = new URLSearchParams({
      apikey: API_KEY,
      fam2ID: fam2ID,
    })

    const response = await fetch(`${API_URL}/product/list/?${params.toString()}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.status != 200) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    return data.result.product
  }

  catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}
