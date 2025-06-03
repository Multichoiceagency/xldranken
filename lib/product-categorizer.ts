// Product interface based on the actual API structure
interface Product {
  arcleunik: string
  title: string
  productCode?: string
  fam2id: string
  prix_vente_groupe?: string
  photo1_base64?: string
  guid?: string
}

// API configuration
const PRODUCT_API_URL = process.env.NEXT_PUBLIC_API_URL
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

// Cache for API results to avoid repeated calls
const productCache = new Map<string, Product>()
const titleToFam2idCache = new Map<string, string>()
const cacheExpiry = new Map<string, number>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Direct mapping from arcleunik (productId) to fam2id
const arcleunikToFam2idMap: Record<string, string> = {
  // This can still be used as a backup when API is unavailable
}

console.log(`ℹ️ Loaded ${Object.keys(arcleunikToFam2idMap).length} arcleunik to fam2id mappings.`)

// Normalize product title for consistent matching
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\+/g, " ")
    .replace(/\+\s*statie/g, " statie")
    .replace(/\+ statie/g, " statie")
}

export const fam2idMapping: Record<string, string> = {
  "1": "BIER",
  "2": "NL BIER",
  "3": "POOLSE BIER FLES",
  "4": "POOLSE BIER BLIK",
  "5": "MIX DRANK",
  "6": "FRISDRANKEN",
  "7": "WATER",
  "10": "COCKTAILS",
  "13": "WIJN",
  "16": "STERKE DRANK",
  "18": "KOFFIE THEE",
  "19": "HOUTSKOOL",
  "20": "FOOD",
  "21": "NON-FOOD",
  "22": "SCHOONMAAK",
  "23": "KRATTEN",
}

// --- GUID-based categorization ---
export async function categorizeProductByGuid(
  guid: string,
  fallbackTitle?: string,
): Promise<{
  fam2id: string
  categoryName: string
  matchType: "api_exact" | "api_error" | "smart_fallback"
  matchedProduct?: Product
  confidence: number
}> {
  console.log(`🔍 GUID CATEGORIZATION: GUID="${guid}"`)

  try {
    // Check cache first
    const cacheKey = `guid_${guid}`
    const cachedProduct = productCache.get(cacheKey)
    const cacheTime = cacheExpiry.get(cacheKey)

    if (cachedProduct && cacheTime && Date.now() < cacheTime) {
      console.log(`✅ CACHE HIT: Using cached data for GUID="${guid}"`)
      const categoryName = getCategoryName(cachedProduct.fam2id)
      return {
        fam2id: cachedProduct.fam2id,
        categoryName,
        matchType: "api_exact",
        matchedProduct: cachedProduct,
        confidence: 1.0,
      }
    }

    // Fetch from API
    if (!PRODUCT_API_URL || !API_KEY) {
      throw new Error("API configuration missing")
    }

    // Construct API URL to get product by GUID
    const url = `${PRODUCT_API_URL}?apikey=${API_KEY}&guid=${guid}`
    console.log(`🌐 Fetching product from API: ${url}`)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log(`📦 API Response for GUID="${guid}":`, data)

    // Extract product data from API response
    let product: Product | null = null

    if (data.result?.product) {
      // Handle both single product and array responses
      if (Array.isArray(data.result.product)) {
        product = data.result.product[0]
      } else {
        product = data.result.product
      }
    }

    if (!product || !product.fam2id) {
      throw new Error("Product not found or missing fam2id in API response")
    }

    // Cache the result
    productCache.set(cacheKey, product)
    cacheExpiry.set(cacheKey, Date.now() + CACHE_DURATION)

    // Also cache the title to fam2id mapping for future fallback
    if (product.title) {
      const normalizedTitle = normalizeTitle(product.title)
      titleToFam2idCache.set(normalizedTitle, product.fam2id)
      console.log(`📝 Cached title mapping: "${normalizedTitle}" -> fam2id="${product.fam2id}"`)
    }

    const categoryName = getCategoryName(product.fam2id)
    console.log(
      `✅ API SUCCESS: GUID="${guid}" -> fam2id="${product.fam2id}" -> category="${categoryName}" (title: "${product.title}")`,
    )

    return {
      fam2id: product.fam2id,
      categoryName,
      matchType: "api_exact",
      matchedProduct: product,
      confidence: 1.0,
    }
  } catch (error) {
    console.error(`❌ API ERROR for GUID="${guid}":`, error)

    // Fallback to title-based categorization if API fails
    if (fallbackTitle) {
      console.log(`🔄 Falling back to title-based categorization for: "${fallbackTitle}"`)
      const fallbackResult = categorizeByTitle(fallbackTitle)
      return {
        ...fallbackResult,
        matchType: "api_error",
        confidence: Math.max(0.1, fallbackResult.confidence - 0.2), // Lower confidence due to API error
      }
    }

    // Ultimate fallback
    return {
      fam2id: "21",
      categoryName: "NON-FOOD",
      matchType: "api_error",
      confidence: 0.05,
    }
  }
}

// --- Enhanced title-based categorization ---
export function categorizeByTitle(productTitle: string): {
  fam2id: string
  categoryName: string
  matchType: "title_exact" | "title_partial" | "smart_fallback"
  confidence: number
} {
  if (!productTitle) {
    return {
      fam2id: "21",
      categoryName: "NON-FOOD",
      matchType: "smart_fallback",
      confidence: 0.05,
    }
  }

  const normalizedTitle = normalizeTitle(productTitle)
  console.log(`🔍 SMART TITLE CATEGORIZATION: "${normalizedTitle}"`)

  // Check if we have an exact title match in our cache
  if (titleToFam2idCache.has(normalizedTitle)) {
    const fam2id = titleToFam2idCache.get(normalizedTitle)!
    const categoryName = getCategoryName(fam2id)
    console.log(`✅ TITLE EXACT MATCH: "${normalizedTitle}" -> fam2id="${fam2id}" -> category="${categoryName}"`)
    return {
      fam2id,
      categoryName,
      matchType: "title_exact",
      confidence: 0.9,
    }
  }

  // Smart categorization based on product analysis
  const smartResult = smartCategorizeByTitle(normalizedTitle)
  return {
    fam2id: smartResult.fam2id,
    categoryName: getCategoryName(smartResult.fam2id),
    matchType: "smart_fallback",
    confidence: smartResult.confidence,
  }
}

// Smart categorization function that analyzes the product title intelligently
function smartCategorizeByTitle(normalizedTitle: string): { fam2id: string; confidence: number } {
  console.log(`🧠 SMART CATEGORIZATION for: "${normalizedTitle}"`)

  // ALCOHOLIC BEVERAGES - High priority

  // Vodka brands and types
  if (
    normalizedTitle.includes("absolute") ||
    normalizedTitle.includes("smirnoff") ||
    normalizedTitle.includes("grey goose") ||
    normalizedTitle.includes("belvedere") ||
    normalizedTitle.includes("pushkin") ||
    normalizedTitle.includes("vodka") ||
    (normalizedTitle.includes("40%") && normalizedTitle.includes("0.7l"))
  ) {
    console.log(`   → fam2id: 16 (STERKE DRANK - Vodka detected)`)
    return { fam2id: "16", confidence: 0.95 }
  }

  // Whiskey/Whisky brands
  if (
    normalizedTitle.includes("jack daniels") ||
    normalizedTitle.includes("johnnie walker") ||
    normalizedTitle.includes("jameson") ||
    normalizedTitle.includes("chivas") ||
    normalizedTitle.includes("macallan") ||
    normalizedTitle.includes("whiskey") ||
    normalizedTitle.includes("whisky") ||
    normalizedTitle.includes("bourbon") ||
    (normalizedTitle.includes("single barrel") && normalizedTitle.includes("64%"))
  ) {
    console.log(`   → fam2id: 16 (STERKE DRANK - Whiskey detected)`)
    return { fam2id: "16", confidence: 0.95 }
  }

  // Ciders (Sommersby, etc.)
  if (
    normalizedTitle.includes("sommersby") ||
    normalizedTitle.includes("strongbow") ||
    normalizedTitle.includes("magners") ||
    (normalizedTitle.includes("cider") && normalizedTitle.includes("blik"))
  ) {
    console.log(`   → fam2id: 5 (MIX DRANK - Cider detected)`)
    return { fam2id: "5", confidence: 0.95 }
  }

  // Polish Beer brands
  if (
    normalizedTitle.includes("debowe") ||
    normalizedTitle.includes("zamkowe") ||
    normalizedTitle.includes("lech") ||
    normalizedTitle.includes("tyskie") ||
    normalizedTitle.includes("zywiec") ||
    normalizedTitle.includes("lomza") ||
    normalizedTitle.includes("okocim") ||
    normalizedTitle.includes("perla")
  ) {
    if (normalizedTitle.includes("fles") || normalizedTitle.includes("bottle")) {
      console.log(`   → fam2id: 3 (POOLSE BIER FLES - Polish beer bottle detected)`)
      return { fam2id: "3", confidence: 0.95 }
    } else {
      console.log(`   → fam2id: 4 (POOLSE BIER BLIK - Polish beer can detected)`)
      return { fam2id: "4", confidence: 0.95 }
    }
  }

  // Dutch Beer brands
  if (
    normalizedTitle.includes("heineken") ||
    normalizedTitle.includes("amstel") ||
    normalizedTitle.includes("grolsch") ||
    normalizedTitle.includes("hertog jan") ||
    normalizedTitle.includes("bavaria") ||
    normalizedTitle.includes("brand bier")
  ) {
    console.log(`   → fam2id: 2 (NL BIER - Dutch beer detected)`)
    return { fam2id: "2", confidence: 0.95 }
  }

  // SOFT DRINKS
  if (
    normalizedTitle.includes("coca cola") ||
    normalizedTitle.includes("pepsi") ||
    normalizedTitle.includes("fanta") ||
    normalizedTitle.includes("sprite") ||
    normalizedTitle.includes("7up") ||
    normalizedTitle.includes("red bull") ||
    normalizedTitle.includes("monster") ||
    normalizedTitle.includes("aloe drink") ||
    (normalizedTitle.includes("petfles") && !normalizedTitle.includes("water"))
  ) {
    console.log(`   → fam2id: 6 (FRISDRANKEN - Soft drink detected)`)
    return { fam2id: "6", confidence: 0.95 }
  }

  // WATER
  if (
    normalizedTitle.includes("water") ||
    normalizedTitle.includes("spa blauw") ||
    normalizedTitle.includes("spa rood") ||
    normalizedTitle.includes("chaudfontaine") ||
    normalizedTitle.includes("sourcy") ||
    normalizedTitle.includes("erikli") ||
    normalizedTitle.includes("evian")
  ) {
    console.log(`   → fam2id: 7 (WATER - Water detected)`)
    return { fam2id: "7", confidence: 0.95 }
  }

  // JUICES
  if (
    normalizedTitle.includes("appelsap") ||
    normalizedTitle.includes("sinaasappelsap") ||
    normalizedTitle.includes("druivensap") ||
    normalizedTitle.includes("sap") ||
    normalizedTitle.includes("juice")
  ) {
    console.log(`   → fam2id: 6 (FRISDRANKEN - Juice detected)`)
    return { fam2id: "6", confidence: 0.9 }
  }

  // COFFEE/TEA
  if (
    normalizedTitle.includes("koffie") ||
    normalizedTitle.includes("coffee") ||
    normalizedTitle.includes("thee") ||
    normalizedTitle.includes("tea") ||
    normalizedTitle.includes("espresso")
  ) {
    console.log(`   → fam2id: 18 (KOFFIE THEE - Coffee/Tea detected)`)
    return { fam2id: "18", confidence: 0.9 }
  }

  // NON-FOOD ITEMS
  if (
    normalizedTitle.includes("bekers") ||
    normalizedTitle.includes("doek") ||
    normalizedTitle.includes("rietjes") ||
    normalizedTitle.includes("saus bak") ||
    normalizedTitle.includes("plastic") ||
    normalizedTitle.includes("papier") ||
    normalizedTitle.includes("stk") ||
    normalizedTitle.includes("1000stk")
  ) {
    console.log(`   → fam2id: 21 (NON-FOOD - Non-food item detected)`)
    return { fam2id: "21", confidence: 0.9 }
  }

  // Generic beer detection
  if (normalizedTitle.includes("bier") || normalizedTitle.includes("beer")) {
    console.log(`   → fam2id: 1 (BIER - Generic beer detected)`)
    return { fam2id: "1", confidence: 0.7 }
  }

  // Default fallback
  console.log(`   → fam2id: 21 (NON-FOOD - No specific category detected)`)
  return { fam2id: "21", confidence: 0.1 }
}

// --- Main categorization function ---
export async function categorizeProductLive(
  productTitle: string,
  volume?: string,
  arcleunik?: string,
  existingFam2id?: string,
  guid?: string,
): Promise<{
  fam2id: string
  categoryName: string
  matchType:
    | "api_exact"
    | "existing_override"
    | "title_exact"
    | "title_partial"
    | "smart_fallback"
    | "id_match"
    | "api_error"
  matchedProduct?: Product
  confidence: number
}> {
  console.log(`🔍 LIVE CATEGORIZATION:`)
  console.log(`   Title: "${productTitle}"`)
  console.log(`   Volume: "${volume || "N/A"}"`)
  console.log(`   Arcleunik: "${arcleunik || "N/A"}"`)
  console.log(`   GUID: "${guid || "N/A"}"`)
  console.log(`   Existing fam2id: "${existingFam2id || "N/A"}"`)

  // PRIORITY 1: Try direct match with arcleunik first
  if (arcleunik && arcleunikToFam2idMap[arcleunik]) {
    const fam2id = arcleunikToFam2idMap[arcleunik]
    const categoryName = getCategoryName(fam2id)
    console.log(`✅ ARCLEUNIK MATCH: arcleunik="${arcleunik}" -> fam2id="${fam2id}" -> category="${categoryName}"`)
    return {
      fam2id,
      categoryName,
      matchType: "id_match",
      confidence: 0.95,
    }
  }

  // PRIORITY 2: Try live API lookup with GUID
  if (guid && guid !== "N/A") {
    try {
      const apiResult = await categorizeProductByGuid(guid, productTitle)
      console.log(`✅ API CATEGORIZATION SUCCESS: GUID="${guid}" -> ${apiResult.categoryName}`)
      return apiResult
    } catch (error) {
      console.warn(`⚠️ API categorization failed for GUID="${guid}", falling back to smart categorization`)
    }
  }

  // PRIORITY 3: Smart title-based categorization (ALWAYS run this, ignore existing fam2id if it's wrong)
  console.log(`🔄 Using smart title-based categorization`)
  const titleResult = categorizeByTitle(productTitle)

  // If we have an existing fam2id, check if our smart categorization is significantly different
  if (existingFam2id !== undefined && existingFam2id !== null && existingFam2id !== "") {
    const existingCategory = getCategoryName(existingFam2id)

    // If the existing category is NON-FOOD but our smart categorization found something specific, override it
    if (existingFam2id === "21" && titleResult.fam2id !== "21" && titleResult.confidence > 0.8) {
      console.log(
        `🔄 OVERRIDING EXISTING FAM2ID: "${existingCategory}" -> "${titleResult.categoryName}" (smart categorization has high confidence)`,
      )
      return {
        ...titleResult,
        matchType: "existing_override",
      }
    }

    // If existing fam2id seems reasonable, use it but with lower confidence
    console.log(
      `✅ KEEPING EXISTING FAM2ID: "${existingCategory}" (smart categorization: "${titleResult.categoryName}")`,
    )
    return {
      fam2id: existingFam2id,
      categoryName: existingCategory,
      matchType: "existing_override",
      confidence: 0.8,
    }
  }

  return titleResult
}

export function getCategoryName(fam2id: string): string {
  const categoryName = fam2idMapping[fam2id]
  if (!categoryName) {
    console.warn(`⚠️ Unknown fam2id: "${fam2id}", defaulting to NON-FOOD`)
    return "NON-FOOD"
  }
  return categoryName
}

export const categorizeProduct = categorizeProductLive
export default categorizeProductLive
