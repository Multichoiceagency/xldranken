import type { ProductProps } from "@/types/product"

// Get environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

export async function getProductsByFam2ID(fam2ID: string): Promise<ProductProps[]> {
  try {
    // Validate environment variables before making the request
    if (!API_URL) {
      console.error("NEXT_PUBLIC_API_URL is not defined")
      return []
    }

    if (!API_KEY) {
      console.error("NEXT_PUBLIC_API_KEY is not defined")
      return []
    }

    // Create the URL - note that the API_URL already includes "/product/list/"
    // so we need to make sure we're not duplicating that path
    const baseUrl = API_URL.endsWith("/") ? API_URL : `${API_URL}/`

    const queryParams = new URLSearchParams({
      apikey: API_KEY,
      fam2ID: fam2ID,
    })

    // Remove the "/product/list/" from the URL if it's already included in API_URL
    const url = `${baseUrl}?${queryParams}`
    console.log("Fetching from URL:", url) // Debug log to see the constructed URL

    const response = await fetch(url)

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

