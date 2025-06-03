// Debug script to analyze what's happening with categorization

interface DebugItem {
  name: string
  guid?: string
  volume?: string
  arcleunik?: string
  fam2id?: string
}

// Test items - voeg hier je echte product data toe
const testItems: DebugItem[] = [
  {
    name: "COCA+COLA+12X50CL+PETFLES+%2B+STATIE",
    guid: "F4AD9879-51B1-4502-2E02-769F82F89EB0",
    volume: "12345",
    fam2id: undefined,
  },
  // Voeg hier meer test items toe
]

async function debugCategorization() {
  console.log("=== CATEGORIZATION DEBUG ANALYSIS ===")

  // Check environment variables
  console.log("\n1. ENVIRONMENT VARIABLES CHECK:")
  console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL ? "SET" : "NOT SET")
  console.log("NEXT_PUBLIC_API_KEY:", process.env.NEXT_PUBLIC_API_KEY ? "SET" : "NOT SET")

  if (!process.env.NEXT_PUBLIC_API_URL || !process.env.NEXT_PUBLIC_API_KEY) {
    console.error("❌ API configuration missing!")
    return
  }

  // Test API connectivity
  console.log("\n2. API CONNECTIVITY TEST:")
  try {
    const testGuid = "F4AD9879-51B1-4502-2E02-769F82F89EB0"
    const url = `${process.env.NEXT_PUBLIC_API_URL}?apikey=${process.env.NEXT_PUBLIC_API_KEY}&guid=${testGuid}`
    console.log("Testing URL:", url)

    const response = await fetch(url)
    console.log("Response status:", response.status)
    console.log("Response headers:", Object.fromEntries(response.headers.entries()))

    if (response.ok) {
      const data = await response.json()
      console.log("Response data structure:", JSON.stringify(data, null, 2))
    } else {
      console.error("API Error:", response.status, response.statusText)
      const errorText = await response.text()
      console.error("Error response:", errorText)
    }
  } catch (error) {
    console.error("Network error:", error)
  }

  // Test categorization function
  console.log("\n3. CATEGORIZATION FUNCTION TEST:")

  for (const item of testItems) {
    console.log(`\n--- Testing: ${item.name} ---`)
    console.log("Input data:", {
      name: item.name,
      guid: item.guid,
      volume: item.volume,
      arcleunik: item.arcleunik,
      existingFam2id: item.fam2id,
    })

    try {
      // Import the categorization function
      const { categorizeProduct } = await import("../lib/product-categorizer")

      const result = await categorizeProduct(item.name, item.volume, item.arcleunik, item.fam2id, item.guid)

      console.log("Categorization result:", {
        fam2id: result.fam2id,
        categoryName: result.categoryName,
        matchType: result.matchType,
        confidence: result.confidence,
        matchedProduct: result.matchedProduct ? "YES" : "NO",
      })

      if (result.matchedProduct) {
        console.log("Matched product details:", {
          title: result.matchedProduct.title,
          arcleunik: result.matchedProduct.arcleunik,
          fam2id: result.matchedProduct.fam2id,
        })
      }
    } catch (error) {
      console.error("Categorization error:", error)
    }
  }

  // Check what's in the cart context
  console.log("\n4. CART CONTEXT ANALYSIS:")
  console.log("Check if items in cart have the correct structure:")
  console.log("Expected fields: id, name, guid, volume, arcleunik, fam2id")

  // Check email and PDF generation
  console.log("\n5. EMAIL/PDF GENERATION CHECK:")
  console.log("When processing orders, check if:")
  console.log("- Items have GUID field populated")
  console.log("- API calls are being made")
  console.log("- Categorization results are being used")

  console.log("\n=== DEBUG COMPLETE ===")
  console.log("Next steps:")
  console.log("1. Check console logs during actual order processing")
  console.log("2. Verify product data structure when adding to cart")
  console.log("3. Test with real product data from your API")
}

// Run the debug analysis
debugCategorization().catch(console.error)
