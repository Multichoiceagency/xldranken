import { NextResponse } from "next/server"
import { testCategorization } from "@/lib/product-categorizer"

export async function GET() {
  const testProducts = [
    { name: "Heineken Bier 24x33cl", volume: "24x33cl" },
    { name: "Coca Cola 6x1.5L", volume: "6x1.5L" },
    { name: "Chips Paprika", volume: "200g" },
    { name: "Vodka Absolut", volume: "70cl" },
    { name: "Spa Rood Water", volume: "6x1.5L" },
    { name: "Witte Wijn Chardonnay", volume: "75cl" },
    { name: "Koffie Douwe Egberts", volume: "500g" },
    { name: "Schoonmaakmiddel Allesreiniger", volume: "1L" },
    { name: "Houtskool BBQ", volume: "3kg" },
    { name: "Tissues", volume: "10 stuks" },
  ]

  const results = testProducts.map((product) => ({
    ...product,
    ...testCategorization(product.name, product.volume),
  }))

  return NextResponse.json({
    message: "Product categorization test results",
    results,
    totalProducts: results.length,
  })
}
