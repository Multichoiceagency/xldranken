"use server"

import { getProductsBatch } from "@/lib/api"
import type { ProductProps } from "@/types/product"

// Helper function to create a delay
const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Server action to fetch more products in batches
export async function fetchMoreProducts(
  categoryId: string,
  batchNumber: number,
  batchSize = 48,
): Promise<ProductProps[]> {
  try {
    console.log(`Fetching batch ${batchNumber} of products for category ${categoryId}`)

    // Add a small delay to prevent overwhelming the server
    await sleep(300)

    // Use the batch function to get products
    const products = await getProductsBatch(categoryId, batchSize, batchNumber)

    console.log(`Fetched ${products.length} products in batch ${batchNumber}`)

    return products
  } catch (error) {
    console.error("Error in fetchMoreProducts:", error)
    return []
  }
}
