// Script to analyze the categorization results and suggest improvements

interface CategoryAnalysis {
  productName: string
  volume: string
  arcleunik?: string
  currentCategory: string
  confidence: number
  matchType: string
  suggestions: string[]
}

function analyzeCategorizationResults() {
  console.log("=== CATEGORIZATION ANALYSIS ===")

  // Based on your result, let's analyze the patterns
  const results = {
    categories: {
      "STERKE DRANK": 5,
      "POOLSE BIER BLIK": 2,
      FRISDRANKEN: 7,
      "NON-FOOD": 4,
      SCHOONMAAK: 1,
    },
    matchTypes: { exact: 11, partial: 4, fallback: 4 },
    lowConfidenceCount: 19,
    totalItems: 19,
  }

  console.log("Current Results Analysis:")
  console.log("- Total Items:", results.totalItems)
  console.log(
    "- Low Confidence Items:",
    results.lowConfidenceCount,
    `(${((results.lowConfidenceCount / results.totalItems) * 100).toFixed(1)}%)`,
  )
  console.log("- Categories Distribution:", results.categories)
  console.log("- Match Types:", results.matchTypes)

  console.log("\n=== RECOMMENDATIONS ===")

  // Recommendations based on the data
  const recommendations = [
    "1. URGENT: All 19 items have low confidence - check if arcleunikToFam2idMap is populated",
    "2. 11 'exact' matches with low confidence suggests threshold issues",
    "3. 4 fallback matches indicate products not in database",
    "4. Consider lowering confidence thresholds temporarily for debugging",
    "5. Check if product names in cart match database format exactly",
  ]

  recommendations.forEach((rec) => console.log(rec))

  console.log("\n=== NEXT STEPS ===")
  console.log("1. Enable detailed logging in product-categorizer.ts")
  console.log("2. Check the actual product names being processed")
  console.log("3. Verify arcleunik values are being passed correctly")
  console.log("4. Consider adding sample products to arcleunikToFam2idMap")
  console.log("5. Test with a single product first")

  // Sample arcleunikToFam2idMap entries based on common categories
  console.log("\n=== SAMPLE ARCLEUNIK MAPPINGS TO ADD ===")
  const sampleMappings = {
    // Sterke Drank examples
    VODKA001: "16",
    WHISKY001: "16",
    GIN001: "16",

    // Frisdranken examples
    COLA001: "6",
    FANTA001: "6",
    SPRITE001: "6",

    // Poolse Bier Blik examples
    LECH001: "4",
    TYSKIE001: "4",

    // Non-Food examples
    PLASTIC001: "21",
    PAPER001: "21",

    // Schoonmaak examples
    AJAX001: "22",
  }

  console.log("Add these to arcleunikToFam2idMap in product-categorizer.ts:")
  Object.entries(sampleMappings).forEach(([arcleunik, fam2id]) => {
    console.log(`  "${arcleunik}": "${fam2id}",`)
  })
}

// Run the analysis
analyzeCategorizationResults()
