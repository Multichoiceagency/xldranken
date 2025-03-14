import type { ProductProps } from "@/types/product"

const API_URL = process.env.NEXT_PUBLIC_API_URL as string
const API_KEY = process.env.NEXT_PUBLIC_API_KEY as string

// Utility function to build URL query params
const buildQueryParams = (params: Record<string, string>): string => {
  return new URLSearchParams(params).toString()
}

export async function getProductsByFam2ID(fam2ID: string): Promise<ProductProps[]> {
  try {
    const queryParams = new URLSearchParams({
      apikey: API_KEY,
      fam2ID: fam2ID,
    })

    const response = await fetch(`${API_URL}/product/list/?${queryParams}`)

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Ensure products is always an array
    return Array.isArray(data.result?.product) ? data.result.product : []
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

