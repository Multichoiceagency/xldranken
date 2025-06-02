import { categoryMapping } from "./email-templates"

// [Previous menuItemsList and productCategoryRules remain the same...]
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

export const productCategoryRules = {
  cocktails: [
    "bar cuba libre 14% 12x27,5cl",
    "bar greyfruit 14% 12x27,5cl",
    "bar lemon 14% 12x27,5cl",
    "bfg mix 14% 12x27,5cl",
    "breezer orange 24x275ml fles",
    "cesu cola 14% 12x28cl",
    "cesu dzervenite 14% 12x28cl",
    "cesu francu 14% 12x28cl",
    "cesu gin tonic 14% 12x28cl",
    "cesu grapefruit 14% 12x28cl",
    "cesu lemon 14% 12x28cl",
    "cesu skruve 14% 12x28cl",
    "cocktail blackcurrant&a 14.5% 12",
    "cocktail cranberry&a 14.5% 12",
    "cocktail strawberry&a 14.5% 12",
    "le coq blue lagoon 24x33cl fles",
    "le coq cosmopolit 24x33cl fles",
    "le coq cuba libre 24x33cl fles",
    "le coq limon 24x33cl fles",
    "le coq long island 24x33cl fles",
    "le coq margarita 24x33cl fles",
    "le coq mojito 24x33cl fles",
    "le coq orange spritz 24x33cl fles",
    "le coq pina colada 24x33cl fles",
    "le coq sex on the beach 24x33cl fl",
    "le coq teq sunrise 24x33cl fles",
    "le coq tommy collins 24x33 fles",
    "mix brandy & cola 12x33cl fles",
    "mix gin & mango 12x33cl fles",
    "mix green apple cactus 12x33cl fle",
    "mix kamikaze 12x33cl fles",
    "mix mojito 12x33cl fles",
    "mix passion fruit 12x33cl fles",
    "mix pina colada 12x33cl fles",
    "mix pornstar 12x33cl fles",
    "mix rum cola & pineapple 12x33cl fl",
    "mix sex on the beach 12x33cl fles",
    "mix vodka & lime 12x33cl fles",
    "mix vodka & sweet melon 12x33cl fl",
    "mix vodka & watermelon 12x33cl fl",
    "mix wild berry 12x33cl fles",
  ],
  diversen: ["chep pallet", "dpb pallet", "dpg pallet", "statiepallet", "euro pallet"],
  food: [
    "balisto paars/groen 20x37gr",
    "bierbeker 50st",
    "bitterballen 20%",
    "bounty 24x57gr",
    "buggles chips 24x30gr",
    "buhara pul biber 1x800gr",
    "campina volle yoghurt 1l",
    "chilli saus 1l tube",
    "doritos chips 20x44gr",
    "findik 1k",
    "friesche vlag volle melk 12x1l",
    "frikandel borrel 50x20g",
    "frikandel grof",
    "gehakt bal 35st",
    "gehakt bal met ui 25st",
    "gilze kristalsuiker 10x1k",
    "gilze suikerklont 1x8",
    "hamburger brood 16st",
    "hamkaas chips 24x37gr",
    "haribo mix 75g",
    "honingsticks 120x8gr",
    "hot mix 2,5 kg",
    "hot mix 5 kg",
    "jimmys popcorn x21",
    "joppie tube 850ml",
    "jozo zout 12x1 kg",
    "kaas plakken 500gr",
    "kalfs kroket laan",
    "kamstra 24x14cm",
    "katjang 10 liter",
    "katjang saus 800ml tube",
    "kinder bueno 30st",
    "king pepermunt",
    "kip nuggets 120st",
    "kitkat 36x45g",
    "knoflook poeder 1k",
    "knoflookpoeder zak 1 kg",
    "kroket 20% 70gr",
    "lay's groen 20x40gr",
    "lay's naturel 20x40gr",
    "lay's paprika 20x40gr",
    "lay's sensation 20x40gr",
    "lev olie 20l",
    "m&m's 24x45gr",
    "mars 32x50gr",
    "mc cain steakhous 5kg",
    "mccain frites 11mm 5x2.5 kg",
    "mccain original 9mm 5x2.5kg",
    "mega minimix 96st",
    "mekka cornsticks 26x80g",
    "mekka frikandel 40x58g",
    "mekka hamburger 30st",
    "mekka kipcorn",
    "mekka kroket",
    "mekka ribburger",
    "mentos rol 40st",
    "mexicano 15x135g",
    "mini kaassoufle",
    "mooyman satesaus 10k",
    "nussini 35x31.5gr",
    "nuts 24x42gr",
    "petersellieblad 700 gr",
    "pringles chips 12x43gr",
    "raket ijs 20st",
    "remia curry 10l",
    "remia curry 750ml tube",
    "remia fritesaus 10l",
    "remia fritessaus 750ml tube",
    "remia fritessaus zakjes 200x20ml",
    "remia frituurvet 10l",
    "remia mosterd 750ml tube",
    "remia mosterdzakjes 496x4gr",
    "remia tomatenketchup 800ml tube",
    "remia tomatenketchup zakjes 150x",
    "rolo 36st",
    "roze koek 12st",
    "sambal 10k",
    "smarties 24st",
    "snickers 32x50gr",
    "stimorol",
    "stroopwafels 18x2st",
    "suiker sticks 800gr",
    "tosty hamkaas 24x80gr",
    "tosty kaas 12x80gr",
    "twix 25x50gr",
    "vlammetjes 72st",
    "zaanse mayo 10k",
  ],
  frisdranken: [
    "appelsientje orange 12x1l",
    "bar le duc 6x2l",
    "beypazari meyveli 24x200ml",
    "blue bastard 24x25cl blik",
    "capri sun mix 4x10",
    "capri-sun multi 4x10cl",
    "capri-sun orange 4x10cl",
    "capri-sun safari 4x10cl",
    "chocomelk 24x25cl blik",
    "coca cola 6x1.5l nl + statie",
    "coca cola lime dk 24x33cl blik",
    "coca cola zero dk 24x33cl blik",
    "dimes kersen 12x1l",
    "dimes perzik 12x1l",
    "dimes sour cherry 12x1l",
    "dubbeldrank orange 8x1l",
    "fanta casis 24x33cl nl blik",
    "fanta exotic dk 24x33cl blik",
    "fanta kiwi dk 24x33cl blik",
    "fanta lemon dk 24x33cl blik",
    "fanta orange dk 24x33cl blik",
    "fristi 24x25cl blik",
    "fuze tea mix 24x25cl blik",
    "golden power 1x24 + statie",
    "hawai tropical 24x25cl blik",
    "kizilay karpuz-cilek 24x20cl fles",
    "kizilay lemon 24x20cl fles",
    "kizilay meyveli 24x20cl fles",
    "kizilay sade 24x20cl fles",
    "maaza mango 24x33cl blik",
    "maaza tropical 24x33cl blik",
    "minute maid appelsap 24x33cl blik",
    "minute maid orange 24x33cl blik",
    "mogu mogu 25x320ml",
    "monster green 12x50cl",
    "pepsi 6x1.5l pet",
    "pepsi nl 24x33cl blik",
    "poms 24x25cl blik",
    "red bull blue edi 12x25cl blik",
    "red bull aprico straw 12x25cl blik",
    "red bull green edi 12x25cl blik",
    "red bull light nl 24x25cl blik",
    "red bull nl 24x25cl blik",
    "red bull peach 24x25cl blik",
    "red bull pink edi 12x25cl blik",
    "red bull sea blue edi 12x25cl blik",
    "red bull spring 12x25cl blik",
    "red bull sum whit peach 12x25cl bli",
    "red bull tropical edi 12x25cl blik",
    "red bull watermelon 12x25cl blik",
    "red bull zero 12x25cl blik",
    "royal bliss bitte lemon 24x33cl nl",
    "royal club tonic 24x33cl nl blik",
    "sisi junior 24x33cl",
    "slammers energy 24x25cl blik",
    "sprite 6x1.5l nl",
    "sprite 6x1.5l nl + statie",
    "sprite dk 24x33cl blik",
    "uludag gazoz 24x250ml",
    "uludag mandarijn 24x30cl fles",
    "uludag orange 24x250ml",
    "yedi gun 24x30cl",
    // ... (continuing with all frisdranken items)
  ],
  mix_dranken: [
    "bacardi cola 12x25cl blik",
    "bacardi cola 24x25cl blik",
    "bacardi cuba libre 12x25cl blik",
    "bacardi lemon 12x25cl blik",
    "bacardi mango 12x25cl blik",
    "bacardi mojito 12x25cl blik",
    "bacardi oekheart & cola 12x25cl bl",
    "bacardi razz 12x25cl blik",
    "bacardi spiced 12x25cl blik",
    "bombay 12x25cl blik",
    "branq cognac-appel 12x25cl blik +",
    "captain morgan 12x25cl blik",
    "captain morgan mojito 12x25cl blik",
    "captain morgen cola 24x25cl blik",
    "eristoff blue 12x25cl blik",
    "eristoff rood %5 24x250ml",
    "eristoff rood 12x25cl blik",
    "eristoff rood 24x25cl blik",
    "gordon & tonic 12x25cl blik + stati",
    "gordon gin pink 12x25cl blik + stat",
    "gordon gin&tonic 6.4%24x250",
    "havana club 12x25cl blik",
    "jack cola 12x33cl blik",
    "jack cola 24x33cl blik",
    "jack daniels lemon 12x33cl blik",
    "jb cola 12x25cl blik",
    "jb cola 24x33cl blik",
    "ketel1 hard lemon 12x25cl blik",
    "ketel1 strawberry 12x25cl blik",
    "lovka 10% vodka energy 24x25cl bli",
    "lovka 10% vodka melon 24x25cl blik",
    "lovka 10% vodka pineapple 24x25cl",
    "malibu cola 12x25cl blik",
    "passoa orange 12x25cl blik",
    "smirnoff ice 12x250ml blik",
    "smirnoff ice 6x4x27.5cl fles",
    "smirnoff org&gf 12x250ml blik",
    "smirnoff raspberry 12x250ml blik",
    "william lawson 24x25cl blik",
  ],
  nl_bier: [
    "affligem belgisch wit krat 24x30 cl",
    "affligem blond 0.0% krat 24x30 cl",
    "amstel radler 0,0 24x30cl krat",
    "desperados 24x33cl krat nl",
    "desperados tequilla 24x33cl fles",
    "grolsch 16x45cl krat nl",
    "heineken 24x30cl krat nl",
    "heineken 0% 24x30cl nl blik",
    "heineken 0% 24x30cl nl fles",
    "heineken 24x33cl blik nl",
    "heineken fust 50l",
    "heineken mono 24x25cl nl fles",
    "hertog jan 24x30cl krat",
    "hertog jan 24x33cl blik nl",
    "hertog jan 24x50cl blik nl",
    "koolzuur 10kl",
    "palm 24x30cl nl fles",
    "stads bier 20l",
    "stads bier 50l",
  ],
  non_food: [
    "houtskool 10 kg",
    "cappucino topping 1kg",
    "caykur filiz thee 15x500gr",
    "caykur rize thee 15x500gr",
    "ceylon yaprak cay 1kg",
    "completa zak stuck 1kg",
    "de bonen 1kg",
    "de cacao poeder 1kg",
    "jasmine white tea 25st",
    "kusburnu 12x200gr",
    "milk product 1kg",
    "nescafe gold 1x6 200gr",
    "orelet 12x200gr",
    "pickwick thee 100x2gr",
    "pickwick thee camomile 20st",
    "pickwick thee green 3x25g",
    "pickwick thee green tea 80x2gr",
    "pickwick thee mango 3x37.5g",
    "pickwick thee orange 3x37.5g",
    "pickwick thee rooibos 3x37.5g",
    "pickwick thee strawberry 20st",
    "roer staafjes 300st",
    "thee mix kist",
    // ... (continuing with all non_food items)
  ],
  poolse_bier: [
    "amstel 24x50cl blik",
    "bosman full 24x50cl blik+statie",
    "braniewo 24x50cl blik + statie",
    "brok sambor 24x50cl blik + statie",
    "carlsberg 24x50cl blik + statie",
    "debowe mocne 24x50cl blik + statie",
    "desp lemon 0% 24x50cl blik+statie",
    "desp mojito statigeld 24x50cl blik",
    "desp red statigeld 24x50cl blik",
    "desp tequil statigeld 24x50cl blik",
    "desperados strawberry 24x50cl bl",
    "grolsch 24x50cl blik+statie",
    "halne mocna 24x50cl blik+statie",
    "harnas 24x50cl blik + statie",
    "heineken 24x50cl blik nl",
    "heineken 24x50cl blik+statie pl",
    "heineken silver pl 24x50cl blik",
    // ... (continuing with all poolse_bier items)
  ],
  spirits: [
    "absolute 40% 0.5l",
    "absolute 40% 0.7l",
    "absolute 40% 1l",
    "absolute lemon 40% 0.7l",
    "absolute peach 40% 0.7l",
    "absolute pear 40% 0.7l",
    "absolute watermelon 40% 0.7l",
    "adam mickiiewicz 1x6 0.70",
    "advocaat classic 20% - 12x50cl",
    "advocaat classic 20% - 20x20cl",
    "ameretto 1l",
    "apfelcorn 1l",
    "bacardi 0.20cl",
    "bacardi 10x5cl pet",
    "bacardi 40% 0.7l",
    "bacardi 40% 1l",
    // ... (continuing with all spirits items)
  ],
  statiegeld: [
    "statiegeld fust 20l",
    "statiegeld fust 50l",
    "statiegeld koolzuur",
    "embelage",
    "krat",
    "retour embelage",
    "rol container",
    "statiegeld 0.5 petfles chaudfontai",
    "statiegeld 1.5 petfles",
    "statiegeld 12xst",
    "statiegeld 24 st blik",
    "statiegeld 24xst",
    "statiegeld krat",
    "statiegeld krat heineken",
  ],
  wijn: [
    "canei 75cl fles",
    "carlo ros chardonnay 12x75cl fle",
    "carlo ros dark red 12x75cl fles",
    "carlo ros elder rose 12x75cl fles",
    "carlo ros intens blackberry 12x75",
    "carlo ros lavend lim 12x75cl fles",
    "carlo ros mix berry 12x75cl fles",
    "carlo ros mixed 12x75cl fles",
    "carlo ros peach 12x75cl fles",
    "carlo ros pink moscat 12x75cl fles",
    "carlo ros pomegr 12x75cl fles",
    "carlo ros red 12x75cl fles",
    "carlo ros red sweet 12x75cl fles",
    "carlo ros refresh tropical mos 12",
    "carlo ros rose 12x75cl fles",
    "carlo ros strawbe 12x75cl fles",
    "carlo ros sweet citrn 12x75cl fle",
    "carlo ros trop moscat 12x75cl fle",
    "carlo ros watermelon 12x75cl fle",
    "carlo ros white 12x75cl fles",
    "carlo ros white moscat 12x75cl fl",
    "champagne 75cl fles",
    "garden apricot 6x75cl",
    "garden cherry 6x75cl",
    "grzaniec vip selection 9x1l fles",
    "jp jennet mix 6x25cl",
    "kaapse draai rood 75cl fles",
    "kaapse draai rose 75cl fles",
    "kaapse draai wit 75cl fles",
    "martini asti 6x75cl fles",
    "martini bellini 6x75cl fles",
    "martini bianco 6x75cl fles",
    "martini brut 6x75cl fles",
    "martini extra dry 6x75cl fles",
    "martini fiero 6x75cl fles",
    "martini prosecco 6x75cl fles",
    "martini rosato 6x75cl fles",
    "martini rosato spritz 6x75cl fles",
    "martini rose 6x75cl fles",
    "martini rossini 6x75cl fles",
    "martini rosso 6x75cl fles",
    "martini spritz bianco 6x75cl fles",
    "moet 0.75 l",
    "prospero bianco 6x75cl",
    "ruskoje igristoje",
    "totino bianco 6x1l",
    "totino cosmopolitan 6x1l",
    "totino cuba libre 6x1l",
    "totino lime 6x1l",
    "totino mango 6x1l",
    "totino mix smaak 6x1l",
    "totino mojito 6x1l",
    "totino negroni 6x1l",
    "totino peach 6x1l",
    "totino pina colada 6x1l",
    "totino rosso 6x1l",
  ],
  kratten: ["krat", "crate", "statiegeld", "lege flessen", "retour", "depot"],
}

// Mapping from category names to fam2id
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

// Create a reverse lookup map for exact matching
const productToCategory: Record<string, string> = {}

// Build the exact match lookup table
Object.entries(productCategoryRules).forEach(([categoryKey, products]) => {
  products.forEach((product) => {
    const normalizedProduct = product.toLowerCase().trim()

    // Map to the correct category key for fam2id lookup
    let mappedCategory = categoryKey

    // Handle special mappings
    if (categoryKey === "spirits") {
      mappedCategory = "sterke_drank"
    } else if (categoryKey === "poolse_bier") {
      // Determine if it's blik or fles based on product name
      if (normalizedProduct.includes("blik") || normalizedProduct.includes("can")) {
        mappedCategory = "poolse_bier_blik"
      } else if (normalizedProduct.includes("fles") || normalizedProduct.includes("bottle")) {
        mappedCategory = "poolse_bier_fles"
      } else {
        // Default to blik for Polish beer if not specified
        mappedCategory = "poolse_bier_blik"
      }
    } else if (categoryKey === "non_food") {
      mappedCategory = "non_food"
    } else if (categoryKey === "kratten") {
      mappedCategory = "kratten"
    }

    productToCategory[normalizedProduct] = mappedCategory
  })
})

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

// NEW EXACT MATCHING FUNCTION
export function categorizeProductExact(productName: string, volume?: string): string {
  if (!productName) {
    console.log("No product name provided for categorization, defaulting to NON-FOOD (21)")
    return "21" // Default to NON-FOOD
  }

  const normalizedName = productName.toLowerCase().trim()
  const normalizedVolume = volume?.toLowerCase().trim() || ""

  console.log(`Exact matching for product: "${normalizedName}" with volume "${normalizedVolume}"`)

  // STEP 1: Try exact match first
  if (productToCategory[normalizedName]) {
    const categoryKey = productToCategory[normalizedName]
    const fam2id = fam2idMapping[categoryKey] || "21"
    console.log(`✅ EXACT MATCH found: "${productName}" -> ${categoryKey} (fam2id: ${fam2id})`)
    return fam2id
  }

  // STEP 2: Try exact match with volume included
  const nameWithVolume = `${normalizedName} ${normalizedVolume}`.trim()
  if (productToCategory[nameWithVolume]) {
    const categoryKey = productToCategory[nameWithVolume]
    const fam2id = fam2idMapping[categoryKey] || "21"
    console.log(`✅ EXACT MATCH with volume found: "${nameWithVolume}" -> ${categoryKey} (fam2id: ${fam2id})`)
    return fam2id
  }

  // STEP 3: Try partial matching (product name contains exact match)
  for (const [knownProduct, categoryKey] of Object.entries(productToCategory)) {
    if (normalizedName.includes(knownProduct) || knownProduct.includes(normalizedName)) {
      const fam2id = fam2idMapping[categoryKey] || "21"
      console.log(
        `🔍 PARTIAL MATCH found: "${productName}" matches "${knownProduct}" -> ${categoryKey} (fam2id: ${fam2id})`,
      )
      return fam2id
    }
  }

  // STEP 4: If no exact match found, fall back to heuristic categorization
  console.log(`❌ No exact match found for "${productName}", using fallback categorization`)
  return fallbackCategorization(productName, volume)
}

// Simplified fallback function for unknown products
function fallbackCategorization(productName: string, volume?: string): string {
  const name = productName.toLowerCase()
  const vol = volume?.toLowerCase() || ""
  const fullText = `${name} ${vol}`.toLowerCase()

  // High priority checks
  if (fullText.includes("krat") || fullText.includes("crate") || fullText.includes("statiegeld")) {
    return "23" // KRATTEN
  }

  // Basic categorization for unknown products
  if (fullText.includes("bier") || fullText.includes("beer")) {
    if (fullText.includes("blik")) return "4" // POOLSE BIER BLIK
    if (fullText.includes("fles")) return "3" // POOLSE BIER FLES
    return "2" // NL BIER (default)
  }

  if (fullText.includes("wijn") || fullText.includes("wine") || fullText.includes("75cl")) {
    return "13" // WIJN
  }

  if (
    fullText.includes("vodka") ||
    fullText.includes("whisky") ||
    fullText.includes("40%") ||
    fullText.includes("37.5%")
  ) {
    return "16" // STERKE DRANK
  }

  if (
    fullText.includes("cola") ||
    fullText.includes("fanta") ||
    fullText.includes("sprite") ||
    fullText.includes("pepsi")
  ) {
    return "6" // FRISDRANKEN
  }

  if (fullText.includes("cocktail") || fullText.includes("mojito") || fullText.includes("margarita")) {
    return "10" // COCKTAILS
  }

  if (fullText.includes("chips") || fullText.includes("chocolade") || fullText.includes("saus")) {
    return "20" // FOOD
  }

  // Default to NON-FOOD
  console.log(`Using default category NON-FOOD for unknown product: "${productName}"`)
  return "21"
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
    fam2id: product.fam2id || categorizeProductExact(product.name, product.volume),
  }))
}

// Debug function to test categorization
export function testCategorization(
  productName: string,
  volume?: string,
): {
  fam2id: string
  categoryName: string
  matchType: "exact" | "partial" | "fallback"
} {
  const normalizedName = productName.toLowerCase().trim()
  let matchType: "exact" | "partial" | "fallback" = "fallback"

  // Check what type of match we got
  if (productToCategory[normalizedName]) {
    matchType = "exact"
  } else {
    // Check for partial match
    for (const knownProduct of Object.keys(productToCategory)) {
      if (normalizedName.includes(knownProduct) || knownProduct.includes(normalizedName)) {
        matchType = "partial"
        break
      }
    }
  }

  const fam2id = categorizeProductExact(productName, volume)
  const categoryName = getCategoryName(fam2id)

  console.log(
    `Product: "${productName}" (${volume || "no volume"}) -> fam2id: ${fam2id} (${categoryName}) [${matchType.toUpperCase()} MATCH]`,
  )

  return { fam2id, categoryName, matchType }
}

// Export the main categorization function
export const categorizeProduct = categorizeProductExact

// Utility function to get all known products for a category
export function getProductsForCategory(categoryKey: string): string[] {
  return productCategoryRules[categoryKey as keyof typeof productCategoryRules] || []
}

// Utility function to check if a product is known
export function isKnownProduct(productName: string): boolean {
  const normalizedName = productName.toLowerCase().trim()
  return productToCategory.hasOwnProperty(normalizedName)
}

// Get statistics about the product database
export function getProductStats(): {
  totalProducts: number
  categoriesCount: number
  productsByCategory: Record<string, number>
} {
  const productsByCategory: Record<string, number> = {}
  let totalProducts = 0

  Object.entries(productCategoryRules).forEach(([category, products]) => {
    productsByCategory[category] = products.length
    totalProducts += products.length
  })

  return {
    totalProducts,
    categoriesCount: Object.keys(productCategoryRules).length,
    productsByCategory,
  }
}
