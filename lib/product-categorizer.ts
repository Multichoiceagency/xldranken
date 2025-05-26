import { categoryMapping } from "./email-templates"

// Updated menu items from API.ts
export const menuItemsList = [
  {
    name: "ALCOHOL",
    href: "/categorie/sterke-drank",
    id: "16",
    submenu: [
      {
        name: "STERKE DRANK",
        href: "/categorie/sterke-drank",
        id: "16",
      },
      {
        name: "MIX DRANK",
        href: "/categorie/mix-drank",
        id: "5",
      },
      {
        name: "COCKTAILS",
        href: "/categorie/cocktails",
        id: "10",
      },
    ],
  },
  {
    name: "WIJN",
    href: "/categorie/wijn",
    id: "13",
    submenu: [],
  },
  {
    name: "BIER",
    href: "/categorie/poolse-bier-blik",
    id: "1",
    submenu: [
      {
        name: "POOLSE BIER BLIK",
        href: "/categorie/poolse-bier-blik",
        id: "4",
      },
      {
        name: "POOLSE BIER FLES",
        href: "/categorie/poolse-bier-fles",
        id: "3",
      },
      {
        name: "NL BIER",
        href: "/categorie/bier",
        id: "2",
      },
    ],
  },
  {
    name: "FRISDRANKEN",
    href: "/categorie/frisdranken",
    id: "6",
    submenu: [
      {
        name: "FRISDRANKEN",
        href: "/categorie/frisdranken",
        id: "6",
      },
      {
        name: "KRATTEN",
        href: "/categorie/krat",
        id: "23",
      },
      {
        name: "LIMONADEN",
        href: "/categorie/limonaden",
        id: "1",
      },
      {
        name: "WATER",
        href: "/categorie/water-nl",
        id: "7",
      },
      {
        name: "PETFLESSEN",
        href: "/categorie/poolse",
        id: "2",
      },
    ],
  },
  {
    name: "FOOD",
    href: "/categorie/food",
    id: "20",
    submenu: [
      {
        name: "FOOD",
        href: "/categorie/food",
        id: "20",
      },
    ],
  },
  {
    name: "NON-FOOD",
    href: "/categorie/non-food",
    id: "21",
    submenu: [
      {
        name: "NON-FOOD",
        href: "/categorie/non-food",
        id: "21",
      },
      {
        name: "KOFFIE THEE",
        href: "/categorie/koffie-thee",
        id: "18",
      },
      {
        name: "HOUTSKOOL",
        href: "/categorie/houtskool",
        id: "19",
      },
      {
        name: "SCHOONMAAK",
        href: "/categorie/schoonmaak",
        id: "22",
      },
    ],
  },
]

// Export the productCategoryRules and fam2idMapping objects so they can be imported in other files
export const productCategoryRules = {
  // BIER (fam2id: 1)
  bier: [
    "heineken",
    "amstel",
    "grolsch",
    "bavaria",
    "jupiler",
    "stella artois",
    "corona",
    "budweiser",
    "hertog jan",
    "brand",
    "pilsener",
    "pils",
    "lager",
    "weizen",
    "witbier",
    "tripel",
    "dubbel",
    "ipa",
    "ale",
    "stout",
    "porter",
    "radler",
    "shandy",
    "bier",
    "beer",
  ],

  // NL BIER (fam2id: 2)
  nl_bier: [
    "heineken",
    "amstel",
    "grolsch",
    "bavaria",
    "jupiler",
    "hertog jan",
    "brand",
    "alfa",
    "dommelsch",
    "gulpener",
  ],

  // POOLSE BIER FLES (fam2id: 3)
  poolse_bier_fles: [
    "tyskie fles",
    "zywiec fles",
    "lech fles",
    "okocim fles",
    "warka fles",
    "perla fles",
    "lomza fles",
    "zubr fles",
    "pools fles",
    "polish bottle",
    "fles",
    "bottle",
    "75cl",
    "50cl",
    "33cl",
  ],

  // POOLSE BIER BLIK / NL BIER (fam2id: 4)
  poolse_bier_blik: [
    "tyskie blik",
    "zywiec blik",
    "lech blik",
    "okocim blik",
    "warka blik",
    "perla blik",
    "lomza blik",
    "zubr blik",
    "pools blik",
    "polish can",
    "blik",
    "can",
    "33cl blik",
    "50cl blik",
    "500ml blik",
    "330ml blik",
  ],

  // MIX DRANK (fam2id: 5)
  mix_drank: [
    "mix",
    "cocktail",
    "premix",
    "alcopop",
    "breezers",
    "smirnoff ice",
    "bacardi breezer",
    "wkd",
    "sourz",
    "vodka mix",
    "rum mix",
    "gin mix",
    "whiskey mix",
  ],

  // FRISDRANKEN (fam2id: 6)
  frisdranken: [
    "coca cola",
    "pepsi",
    "fanta",
    "sprite",
    "7up",
    "dr pepper",
    "mountain dew",
    "red bull",
    "monster",
    "rockstar",
    "energy",
    "cola",
    "limonade",
    "ice tea",
    "frisdrank",
    "soda",
    "schweppes",
    "tonic",
    "bitter lemon",
    "ginger ale",
    "cassis",
    "sinas",
  ],

  // WATER (fam2id: 7)
  water: [
    "water",
    "spa",
    "evian",
    "vittel",
    "perrier",
    "san pellegrino",
    "aqua",
    "bronwater",
    "mineraalwater",
    "bruisend water",
    "plat water",
    "spring water",
  ],

  // COCKTAILS (fam2id: 10)
  cocktails: [
    "mojito",
    "pina colada",
    "margarita",
    "daiquiri",
    "cosmopolitan",
    "martini",
    "manhattan",
    "old fashioned",
    "negroni",
    "aperol spritz",
    "bloody mary",
    "long island",
    "cocktail",
  ],

  // WIJN (fam2id: 13)
  wijn: [
    "wijn",
    "wine",
    "rood",
    "wit",
    "rosé",
    "champagne",
    "prosecco",
    "cava",
    "chardonnay",
    "sauvignon",
    "merlot",
    "cabernet",
    "pinot",
    "riesling",
    "shiraz",
    "bordeaux",
    "chianti",
    "rioja",
    "porto",
    "sherry",
    "moscato",
    "lambrusco",
  ],

  // STERKE DRANK (fam2id: 16)
  sterke_drank: [
    "vodka",
    "whiskey",
    "whisky",
    "rum",
    "gin",
    "tequila",
    "brandy",
    "cognac",
    "jenever",
    "likeur",
    "absint",
    "sambuca",
    "baileys",
    "kahlua",
    "amaretto",
    "cointreau",
    "grand marnier",
    "jagermeister",
    "captain morgan",
    "jack daniels",
    "johnnie walker",
    "grey goose",
    "absolut",
  ],

  // KOFFIE THEE (fam2id: 18)
  koffie_thee: [
    "koffie",
    "coffee",
    "thee",
    "tea",
    "espresso",
    "cappuccino",
    "latte",
    "americano",
    "green tea",
    "black tea",
    "herbal tea",
    "chai",
    "earl grey",
    "english breakfast",
    "iced coffee",
    "cold brew",
    "frappuccino",
  ],

  // HOUTSKOOL (fam2id: 19)
  houtskool: ["houtskool", "charcoal", "bbq", "barbecue", "grill", "aanmaak", "briketten", "aansteker"],

  // FOOD (fam2id: 20)
  food: [
    "chips",
    "noten",
    "pinda",
    "cashew",
    "amandel",
    "pistache",
    "crackers",
    "koekjes",
    "cookies",
    "chocolade",
    "snoep",
    "candy",
    "drop",
    "winegums",
    "kauwgom",
    "pepermunt",
    "mint",
    "popcorn",
    "pretzels",
    "rijstwafel",
    "toast",
    "beschuit",
    "ontbijtkoek",
    "cake",
    "pizza",
    "pasta",
    "saus",
    "ketchup",
    "mayonaise",
    "mosterd",
    "pesto",
    "olie",
    "azijn",
    "zout",
    "peper",
    "kruiden",
    "specerijen",
    "bouillon",
    "soep",
    "conserven",
    "blik",
    "jam",
    "pindakaas",
    "nutella",
    "honing",
    "suiker",
    "meel",
    "rijst",
    "pasta",
  ],

  // NON-FOOD (fam2id: 21)
  non_food: [
    "tissues",
    "toiletpapier",
    "keukenpapier",
    "servet",
    "luiers",
    "tandenborstel",
    "tandpasta",
    "shampoo",
    "zeep",
    "douchegel",
    "deodorant",
    "parfum",
    "cosmetica",
    "make-up",
    "batterij",
    "lamp",
    "kaars",
    "aansteker",
    "sigaretten",
    "tabak",
    "pijp",
    "sigaar",
  ],

  // SCHOONMAAK (fam2id: 22)
  schoonmaak: [
    "schoonmaak",
    "cleaning",
    "afwasmiddel",
    "wasmiddel",
    "wasverzachter",
    "bleek",
    "ontkalker",
    "allesreiniger",
    "glasreiniger",
    "wc-reiniger",
    "badkamerreiniger",
    "keukenreiniger",
    "vloer",
    "dweil",
    "spons",
    "doek",
    "handschoenen",
    "vuilniszak",
    "plastic zak",
  ],

  // KRATTEN (fam2id: 23)
  kratten: ["krat", "crate", "statiegeld", "lege flessen", "retour", "depot"],
}

// Reverse mapping for quick lookup
export const fam2idMapping: Record<string, string> = {
  bier: "1",
  nl_bier: "2",
  poolse_bier_fles: "3",
  poolse_bier_blik: "4",
  mix_drank: "5",
  frisdranken: "6",
  water: "7",
  cocktails: "10",
  wijn: "13",
  sterke_drank: "16",
  koffie_thee: "18",
  houtskool: "19",
  food: "20",
  non_food: "21",
  schoonmaak: "22",
  kratten: "23",
}

// Direct mapping from API menu items
export const apiCategoryMapping: Record<string, string> = {}

// Build the apiCategoryMapping from menuItemsList
menuItemsList.forEach((category) => {
  apiCategoryMapping[category.id] = category.name

  // Add submenu items
  if (category.submenu && category.submenu.length > 0) {
    category.submenu.forEach((subcategory) => {
      apiCategoryMapping[subcategory.id] = subcategory.name
    })
  }
})

// Replace the entire categorizeProduc function with this more dynamic approach

export function categorizeProduc(productName: string, volume?: string): string {
  if (!productName) {
    console.log("No product name provided for categorization, defaulting to NON-FOOD (21)")
    return "21" // Default to NON-FOOD
  }

  const name = productName.toLowerCase()
  const vol = volume?.toLowerCase() || ""
  const fullText = `${name} ${vol}`.toLowerCase()

  console.log(`Dynamically categorizing product: "${name}" with volume "${vol}"`)

  // HIGHEST PRIORITY CHECKS - These override all other categorization

  // 1. Check for "krat" in the name - this should always go to KRATTEN category
  if (fullText.includes("krat") || fullText.includes("crate") || fullText.includes("statiegeld")) {
    console.log(`Product contains "krat" or related terms, categorizing as KRATTEN (23)`)
    return "23" // KRATTEN
  }

  // Create a scoring system for each category
  const categoryScores: Record<string, number> = {}

  // Initialize scores for all categories
  Object.keys(fam2idMapping).forEach((category) => {
    categoryScores[category] = 0
  })

  // SCORING SYSTEM: Analyze product characteristics

  // 1. Check for packaging type indicators
  if (fullText.includes("blik") || fullText.includes("can")) {
    categoryScores.poolse_bier_blik += 10
    // If it's a can but not beer, reduce the beer score
    if (!fullText.includes("bier") && !fullText.includes("beer")) {
      categoryScores.poolse_bier_blik -= 5
    }
  }

  if (fullText.includes("fles") || fullText.includes("bottle")) {
    // If it's a bottle and mentions beer, likely beer bottle
    if (fullText.includes("bier") || fullText.includes("beer")) {
      categoryScores.poolse_bier_fles += 10
    }
    // If it's a bottle with 75cl, likely wine
    else if (fullText.includes("75cl")) {
      categoryScores.wijn += 8
    }
  }

  if (fullText.includes("petfles") || fullText.includes("pet")) {
    categoryScores.frisdranken += 8
  }

  // 2. Check for alcohol percentage indicators (strong priority)
  const alcoholPercentages = ["40%", "37.5%", "32%", "30%", "25%", "45%", "64%", "70%"]
  for (const percentage of alcoholPercentages) {
    if (fullText.includes(percentage)) {
      categoryScores.sterke_drank += 15
      break
    }
  }

  // 3. Check for volume indicators
  if (
    fullText.includes("0.7l") ||
    fullText.includes("0.70ml") ||
    fullText.includes("0.75l") ||
    fullText.includes("70cl")
  ) {
    categoryScores.sterke_drank += 5
    categoryScores.wijn += 3
  }

  if (fullText.includes("1l") || fullText.includes("1.0l") || fullText.includes("100cl")) {
    categoryScores.sterke_drank += 3
  }

  if (fullText.includes("33cl") || fullText.includes("330ml")) {
    categoryScores.frisdranken += 2
    categoryScores.poolse_bier_blik += 2
  }

  if (fullText.includes("50cl") || fullText.includes("500ml")) {
    categoryScores.poolse_bier_blik += 2
  }

  // 4. Check for specific product types

  // Soft drinks
  const softDrinkBrands = [
    "coca cola",
    "cola",
    "fanta",
    "sprite",
    "pepsi",
    "7up",
    "sinas",
    "aloe",
    "chocomelk",
    "appelsap",
  ]
  for (const brand of softDrinkBrands) {
    if (fullText.includes(brand)) {
      categoryScores.frisdranken += 12
      break
    }
  }

  // Strong alcohol
  const strongAlcoholBrands = [
    "vodka",
    "whisky",
    "whiskey",
    "jack daniels",
    "johnnie walker",
    "johnny walker",
    "absolute",
    "absolut",
    "ciroc",
    "soplica",
    "pushkin",
    "tekirdag",
    "paddy",
    "chivas",
  ]
  for (const brand of strongAlcoholBrands) {
    if (fullText.includes(brand)) {
      categoryScores.sterke_drank += 12
      break
    }
  }

  // Wine
  const wineBrands = [
    "wijn",
    "wine",
    "rose",
    "rosé",
    "rood",
    "kaapse draai",
    "carlo ros",
    "martini",
    "asti",
    "prosecco",
    "brut",
    "extra dry",
  ]
  for (const brand of wineBrands) {
    if (fullText.includes(brand)) {
      categoryScores.wijn += 12
      break
    }
  }

  // Beer
  const beerBrands = [
    "heineken",
    "amstel",
    "grolsch",
    "bavaria",
    "jupiler",
    "hertog jan",
    "brand",
    "tyskie",
    "zywiec",
    "lech",
    "okocim",
    "warka",
    "perla",
    "lomza",
    "zubr",
  ]
  for (const brand of beerBrands) {
    if (fullText.includes(brand)) {
      // Dutch beer brands
      if (["heineken", "amstel", "grolsch", "bavaria", "jupiler", "hertog jan", "brand"].includes(brand)) {
        categoryScores.nl_bier += 12
      } else {
        // Polish beer brands
        if (fullText.includes("blik") || fullText.includes("can")) {
          categoryScores.poolse_bier_blik += 12
        } else {
          categoryScores.poolse_bier_fles += 12
        }
      }
      break
    }
  }

  // Generic beer indicators
  if (fullText.includes("bier") || fullText.includes("beer")) {
    categoryScores.bier += 8

    // If it's beer but packaging is not specified, make a guess based on other factors
    if (
      !fullText.includes("blik") &&
      !fullText.includes("can") &&
      !fullText.includes("fles") &&
      !fullText.includes("bottle")
    ) {
      // Default to blik for Polish beer names
      if (
        fullText.includes("debowe") ||
        fullText.includes("zamkowe") ||
        fullText.includes("mocne") ||
        fullText.includes("jasna") ||
        fullText.includes("tyskie") ||
        fullText.includes("zywiec")
      ) {
        categoryScores.poolse_bier_blik += 5
      }
    }
  }

  // Cocktails
  if (
    fullText.includes("cocktail") ||
    fullText.includes("negroni") ||
    fullText.includes("mojito") ||
    fullText.includes("totino") ||
    fullText.includes("margarita")
  ) {
    categoryScores.cocktails += 12
  }

  // Mixed drinks
  if (fullText.includes("mix") || fullText.includes("capri sun") || fullText.includes("capri-sun")) {
    categoryScores.mix_drank += 12
  }

  // Water (but be careful with "watermelon")
  if (
    (fullText.includes("water") && !fullText.includes("watermeloen") && !fullText.includes("watermelon")) ||
    fullText.includes("bar le duc") ||
    fullText.includes("spa")
  ) {
    categoryScores.water += 12
  }

  // Food
  const foodKeywords = ["saus", "chips", "noten", "koekjes", "chocolade", "snoep", "bak"]
  for (const keyword of foodKeywords) {
    if (fullText.includes(keyword)) {
      categoryScores.food += 12
      break
    }
  }

  // Cleaning products
  const cleaningKeywords = ["schoonmaak", "doek", "afwasmiddel", "wasmiddel"]
  for (const keyword of cleaningKeywords) {
    if (fullText.includes(keyword)) {
      categoryScores.schoonmaak += 12
      break
    }
  }

  // Non-food
  const nonFoodKeywords = ["bekers", "rietjes", "tissues", "koffie", "kofiie"]
  for (const keyword of nonFoodKeywords) {
    if (fullText.includes(keyword)) {
      categoryScores.non_food += 12
      break
    }
  }

  // 5. Special case handling

  // Sommersby is a cider, not water despite having "watermelon" in the name
  if (fullText.includes("sommersby")) {
    categoryScores.poolse_bier_blik += 15
    categoryScores.water -= 10
  }

  // Blue Bastard is a beer
  if (fullText.includes("blue bastard")) {
    categoryScores.poolse_bier_blik += 15
  }

  // Garden products are likely wine
  if (fullText.includes("garden cherry")) {
    categoryScores.wijn += 15
  }

  // Find the category with the highest score
  let highestScore = -1
  let bestCategory = "non_food" // Default to NON-FOOD

  for (const [category, score] of Object.entries(categoryScores)) {
    if (score > highestScore) {
      highestScore = score
      bestCategory = category
    }
  }

  // If the highest score is very low, default to NON-FOOD
  if (highestScore < 5) {
    console.log(`Low confidence score (${highestScore}), defaulting to NON-FOOD`)
    bestCategory = "non_food"
  }

  const fam2id = fam2idMapping[bestCategory] || "21"
  console.log(
    `Dynamic categorization result: "${productName}" -> ${bestCategory} (fam2id: ${fam2id}) with score ${highestScore}`,
  )

  return fam2id
}

export function getCategoryName(fam2id: string): string {
  // First try the API mapping
  if (apiCategoryMapping[fam2id]) {
    return apiCategoryMapping[fam2id]
  }

  // Fall back to our static mapping
  return categoryMapping[fam2id] || "OVERIGE PRODUCTEN"
}

// Helper function to categorize multiple products
export function categorizeProducts(
  products: Array<{ name: string; volume?: string; fam2id?: string }>,
): Array<{ name: string; volume?: string; fam2id: string }> {
  return products.map((product) => ({
    ...product,
    // Only use categorization as a fallback if fam2id is missing
    fam2id: product.fam2id || categorizeProduc(product.name, product.volume),
  }))
}

// Debug function to test categorization
export function testCategorization(productName: string, volume?: string): { fam2id: string; categoryName: string } {
  const fam2id = categorizeProduc(productName, volume)
  const categoryName = getCategoryName(fam2id)

  console.log(`Product: "${productName}" (${volume || "no volume"}) -> fam2id: ${fam2id} (${categoryName})`)

  return { fam2id, categoryName }
}

export const categorizeProduct = categorizeProduc
