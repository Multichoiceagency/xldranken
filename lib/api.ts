import type { ProductProps } from "@/types/product"

const API_URL = process.env.NEXT_PUBLIC_API_URL as string
const API_KEY = process.env.API_KEY as string

export async function getProductsByFam2ID(fam2ID: string): Promise<ProductProps[]> {
  try {
    const params = new URLSearchParams({
      apikey: API_KEY,
      fam2ID: fam2ID,
    })

    console.log(`${API_URL}/product/list/?${params.toString()}`)
    const response = await fetch(`${API_URL}/product/list/?${params.toString()}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (!data?.result?.product || !Array.isArray(data.result.product)) {
      console.warn(`No products found for fam2ID: ${fam2ID}`)
      return []
    }

    return data.result.product
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export async function getProductById(id: string): Promise<ProductProps | null> {
  try {
    const params = new URLSearchParams({
      apikey: API_KEY,
      id_product: id,
    })

    const response = await fetch(`${API_URL}?${params.toString()}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (!data?.result?.product || !Array.isArray(data.result.product) || data.result.product.length === 0) {
      return null
    }

    return data.result.product[0]
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

