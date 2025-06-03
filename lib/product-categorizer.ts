import { categoryMapping } from "./email-templates"

// Product interface based on the JSON structure
interface Product {
  id: string
  name: string
  price: number
  fam2id: string
  volume?: string
}

// --- NEW ---
// Direct mapping from arcleunik (productId) to fam2id
// IMPORTANT: This map needs to be populated with your actual arcleunik-to-fam2id data.
// Example:
// const arcleunikToFam2idMap: Record<string, string> = {
//   "ARTICLE001": "1", // Example: arcleunik "ARTICLE001" maps to fam2id "1" (BIER)
//   "ARTICLE002": "6", // Example: arcleunik "ARTICLE002" maps to fam2id "6" (FRISDRANKEN)
//   // ... add all your known arcleunik to fam2id mappings here
// };
// For now, it's an empty object. You MUST populate this for ID-based categorization to work.
const arcleunikToFam2idMap: Record<string, string> = {
  // === POPULATE THIS SECTION WITH YOUR DATA ===
  // "unique_product_id_1": "fam2id_for_product_1",
  // "unique_product_id_2": "fam2id_for_product_2",
  // e.g. "102030": "4", // Assuming '102030' is an arcleunik for a POOLSE BIER BLIK
  // "COKEBLIK330": "6", // Coca Cola 330ml can -> FRISDRANKEN
  // ============================================
}
console.log(`ℹ️ Loaded ${Object.keys(arcleunikToFam2idMap).length} arcleunik to fam2id mappings.`)

// Define the products data directly with proper fam2id mapping
const productData = {
  "1": [
    // BIER
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
    "palm 24x30cl nl fles",
    "stads bier 20l",
    "stads bier 50l",
  ],
  "2": [
    // NL BIER
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
  "3": [
    // POOLSE BIER FLES
    "buh 15x50cl fles",
    "buh myjebonga 15x33cl fles",
    "captain jack blue lagoon 12x40cl f",
    "captain jack cuba 12x40cl fles",
    "captain jack exotic 12x40cl fles",
    "captain jack orange 12x40cl fles",
    "captain jack rum 12x40cl fles",
    "captain jack smaken 12x40cl fles",
    "carlsberg 0% fles",
    "carlsberg 20x50cl fles",
    "corona extra 24x355cl fles",
    "corona extra new 24x33cl fles",
    "cortes extra 24x33cl fles",
    "cortes tequilla 24x33cl fles",
    "debowe mocne 20x50cl fles",
    "desperados cuba 20x40cl fles",
    "desperados exotic 20x40cl fles",
    "desperados jung 20x40cl fles",
    "desperados lime 20x40cl fles",
    "desperados melon fles",
    "desperados mojito 20x40cl fles",
    "desperados nocturno fles",
    "desperados red 20x40cl fles",
    "desperados strawberry 20x40cl fl",
    "desperados tequilla 20x40cl fles",
    "desperados tropical 20x40cl fles",
    "desperados virgin 20x40cl fles",
    "desperados wisky sour 20x40cl fle",
    "garage energy new 20x40cl",
    "garage hardcore %6 20x40cl fles",
    "garage kamikaze 20x50cl fles",
    "garage lemon %0 20x50cl fles",
    "garage lemon 20x50cl fles",
    "garage mango 20x40cl fles",
    "garage melon 20x40cl fles",
    "garage orange 20x40cl fles",
    "garage pomegranate 20x40cl fles",
    "garage sex ontbeach 20x40cl fles",
    "garage stra-marg 20x40cl fles",
    "garaje gin grejfut 20x40cl fles",
    "garaje posion fruit 0%20x40cl fles",
    "garaje tropical elixir 6% 20x40cl f",
    "grolsch 20x45cl fles",
    "hardmade greyfrut 18x40cl fles",
    "hardmade mix 12x40cl fles",
    "hardmade peach 18x40cl fles",
    "hardmade raspberry 18x40cl fles",
    "harnas 20x50cl fles",
    "heineken 12x33cl fles pl",
    "heineken silver 15x50cl fles pl",
    "karmi classic 24x40cl fles",
    "karmi coffee 24x40cl fles",
    "karmi granat-grejp. 24x40cl fles",
    "karmi zurawina 24x40cl fles",
    "kasztelan jasna 20x50cl fles",
    "kasztelan miodawa 20x50cl fles",
    "kasztelan nip 20x50cl fles",
    "kozel cerny 20x50cl fles",
    "kozel lezak 20x50cl fles",
    "krolewski 20x50cl fles",
    "ksiazece alle sorten 12x50cl fles",
    "ksiazece weizen 20x50cl fles",
    "ksiazece zlote 20x50cl fles",
    "lech 20x50cl fles",
    "lech app lemongr 20x50cl fles",
    "lech cher 20x50cl fles",
    "lech mint 20x50cl fles",
    "lech pils 20x50cl fles",
    "lech shandy easy 18x50cl fles",
    "lomza cyt-limonka 0% 20x50cl fles",
    "lomza grefut 0% 20x50cl fles",
    "lomza gruszka 4,5% 20x50cl fles",
    "lomza jabl-trawa 4,5% 20x50cl fles",
    "lomza jablko-mieta 0% 20x50cl fles",
    "lomza jablko-wisnia 0% 20x50cl fle",
    "lomza jasna 20x50cl 5.7% fles",
    "lomza miodowa 5,7% 20x50cl fles",
    "lomza miodowa malina 5,7% 20x50cl",
    "lomza mirabelka 4,5% 20x50cl fles",
    "lomza pils 6% 20x50cl fles",
    "lomza radler 2% 20x50cl fles",
    "lomza sliwka 4,5% 20x50cl fles",
    "lomza wyberowa 20x50cl fles",
    "lomza zero 20x50cl 0% fles",
    "namyslow 20x50cl fles",
    "okocim grana-mali 0% 20x50cl fles",
    "okocim jasna 20x50cl fles",
    "okocim lim-mie 0% 20x50cl fles",
    "okocim mango 0% 20x50cl fles",
    "okocim mocna 20x50cl fles",
    "okocim mocna-poma 4.5% 20x50cl fl",
    "okocim pom-lime 0% 20x50cl fles",
    "okocim smaak mix 4.5% 20x50cl fles",
    "perla chimielowa 20x50cl fles",
    "perla export 20x50cl fles",
    "perla miodowa 20x50cl fles",
    "piast 20x50cl fles",
    "pilsner 15x50cl fles",
    "solveza smaak 33x24 cl fles",
    "sommersby apple 24x40cl fles",
    "sommersby blackberry 24x40cl fle",
    "sommersby blackcurrant 0% 24x50",
    "sommersby blue-lemon apple 24x40",
    "sommersby cherry apple 24x40cl f",
    "sommersby kiwi 24x40cl fles",
    "sommersby mandarina %024x40cl fl",
    "sommersby mandarina 24x40cl fles",
    "sommersby mango 24x40cl fles",
    "sommersby pear 0% 24x50cl fles",
    "sommersby pina colada 24x40cl fle",
    "sommersby pink 24x40cl fles",
    "sommersby strawberry 24x50cl fl",
    "sommersby watermeloen 24x40cl f",
    "sommersby wildberry 0% 24x50cl f",
    "specjal 20x50cl fles",
    "tatra jasna 20x50cl fles",
    "tatra mocna 20x50cl fles",
    "tyskie 20x50cl fles",
    "warka lemon 3.5% 20x50cl fles",
    "warka rood 20x50cl fles",
    "warka strong 20x50cl fles",
    "zatecky 20x50cl fles",
    "zatecky cerny 20x50cl fles",
    "zlaty bazant 20x50cl fles",
    "zubr 20x50cl fles",
    "zywiec 20x50cl fles",
    "zywiec apa 20x50cl fles",
    "zywiec biala 20x50cl fles",
    "zywiec ciemne 3.8% 20x40cl fles",
    "zywiec ipa 20x50cl fles",
    "zywiec jabloka 0% 20x40cl fles",
    "zywiec lekki 4.5% 20x40cl fles",
    "zywiec lekki lemon 4.5% 20x40cl fle",
    "zywiec lekki oranz 4.5% 20x40cl fle",
    "zywiec lipa-pigwa 0% 20x40cl fles",
    "zywiec psz 20x50cl fles",
  ],
  "4": [
    // POOLSE BIER BLIK
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
    "janosik jasne 24x50cl blik+st",
    "janosik mocne 7% 24x50cl blik+st",
    "karpackie mocne 24x50cl blik+stati",
    "kasztelan jasne 24x50cl blik+statie",
    "kasztelan mioda 24x50cl blik + stat",
    "kasztelan nip 24x50cl blik + statie",
    "keizerkroon 24x50cl blik+statie",
    "kozel cerny 24x50cl blik+statie",
    "kozel lezak 24x50cl blik+statie",
    "krolewski 24x50cl blik+statie",
    "kuflowe 24x50cl blik + statie",
    "lech 24x50cl blik + statie",
    "lech app lemongr 24x50cl blik",
    "lech cher 24x50cl blik",
    "lech chmiele 0% 24x50cl blik",
    "lech chmiele 24x50cl blik",
    "lech easy 24x50cl blik+statie",
    "lech free 24x50cl blik+statie",
    "lech mint 24x50cl blik",
    "lech pils 24x50cl blik+statie",
    "lech shandy lemon 24x50cl blik",
    "lech shandy mojito 24x50cl blik",
    "lech shandy spiritz 24x50cl blik",
    "lech shandy strawbery 24x50cl bli",
    "lech smaak mix 0% 24x50cl blik+stat",
    "lezajsk 24x50cl blik+statie",
    "lomza 0% 24x400ml blik",
    "lomza blue radler 2% 24x50cl blik",
    "lomza graf 0% 24x400ml blik+statie",
    "lomza jasna 24x400ml blik",
    "lomza jasna 24x50cl blik + statie",
    "lomza mocne 24x50cl blik",
    "lomza pils 24x50cl blik + statie",
    "lomza radler 24x50cl blik",
    "lomza wyberowa 24x50 blik + statie",
    "namyslow 24x50cl blik + statie",
    "okocim ctro wisne 24x50 cl blik",
    "okocim granat-malina 0% 24x50cl bl",
    "okocim jasne 24x50cl blik+statie",
    "okocim lim-mie 0% 24x50cl blik",
    "okocim malina 4.5%24x50cl blik+stat",
    "okocim mango mara 0% 24x50cl blik",
    "okocim mocna-poma 4.5%24x50cl bli",
    "okocim mocne 24x50cl blik+statie",
    "okocim pom-lim 0% 24x50cl blik",
    "okocim rad-grejfrut 24x50cl blik",
    "okocim rad-lemon 24x50cl blik",
    "okocim rad-malina 24x50cl blik",
    "okocim rad-owoce les 24x50cl blik",
    "okocim rad-truskawka 24x50cl blik",
    "okocim rad-watermelon 24x50cl bli",
    "okocim smaak mix 4.5% 24x50cl blik",
    "perla chimielowa 24x50cl blik + sta",
    "perla export 24x50cl blik+statie",
    "perla miodowa 24x50cl blik+ statie",
    "perla mocna 24x50cl blik+statie",
    "perla zwierzyniecka 24x50cl blik",
    "piast 24x50cl blik+statie",
    "pilsner 24x50cl blik+statie",
    "redd's jablko 24x50cl blik+statie",
    "redd's mango 24x50cl blik+statie",
    "redd's papaja 24x50cl blik",
    "redd's peach 24x50cl blik",
    "redd's zurawina 24x50cl blik+statie",
    "sommersby apple 24x50cl blik+stati",
    "sommersby blackberry 24x50cl bli",
    "sommersby blue-lemon 24x50cl blik",
    "sommersby cherry apple 24x50cl b",
    "sommersby kiwi 24x40cl blik",
    "sommersby mandarina 24x50cl blik",
    "sommersby mango 24x50cl blik+sta",
    "sommersby pear 0% 24x50cl blik",
    "sommersby pina colada 24x50cl blik",
    "sommersby pink grapefruit 24x50c",
    "sommersby strawberry 24x50cl bli",
    "sommersby watermeloen 24x50cl b",
    "sommersby wildberry 0% 24x50cl b",
    "specjal 24x50cl blik+statie",
    "tatra jasna 24x50cl blik + statie",
    "tatra mocna 24x50cl blik + statie",
    "tuborg 24x50cl blik",
    "tyskie 24x50cl blik + statie",
    "van pur 10% 24x50cl blik+statie",
    "van pur 12% 24x50cl blik+statie",
    "warka energy smaak mix 0% 24x50c",
    "warka ow-les 0% 24x50cl blik",
    "warka rad-apple 3,5% 24x50cl blik",
    "warka rad-apple mint 2% 24x50cl bli",
    "warka rad-granat 3,5% 24x50cl blik",
    "warka rad-gruska 3,5% 24x50cl blik",
    "warka rad-kiwi 3,5% 24x50cl blik",
    "warka rad-lem raspberry 24x50cl b",
    "warka rad-lemon 2% 24x50cl blik",
    "warka rad-lemon 3,5% 24x50cl blik+",
    "warka rad-malina lemon 3,5% 24x50",
    "warka rad-turskawka 3,5% 24x50cl",
    "warka rood 24x50cl blik+statie",
    "warka strong 24x50cl blik+statie",
    "warka wis-ctroen 0% 24x50cl blik",
    "zamkowe jasna 24x50cl blik",
    "zatecky 24x50cl blik + statie",
    "zatecky cerny 24x50 blik + statie",
    "zlaty bazant 24x50cl blik+statie",
    "zubr 24x50cl blik + statie",
    "zywiec 24x50cl blik + statie",
    "zywiec biala 24x50cl blik+statie",
    "zywiec ciemne 24x50cl blik+statie",
  ],
  "5": [
    // MIX DRANK
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
  "6": [
    // FRISDRANKEN
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
  ],
  "7": [
    // WATER
    "alps water12x500 ml",
    "aquarius 24x33cl pet + statie",
    "chaudfontaine blauw 24x50cl petf",
    "chaudfontaine blauw 6x1.5l",
    "chaudfontaine lemon 6x0.50l pet",
    "chaudfontaine rood 24x50cl petfl",
    "chaudfontaine rood 6x1.5l",
    "erikli 12x50cl",
    "erikli 6x1,5l",
    "hamidiye water 0.50",
    "kardag water 12x0.5",
    "sourcy rood 24x33cl blik",
    "sourcy rood 28x0.2cl krat",
    "spa blauw 24x33cl pet + statie",
    "spa blauw 24x50cl pet+statie",
    "spa blauw 28x25cl krat",
    "spa blauw 6x1.5l pet + statie",
    "spa rood 24x50cl pet + statie",
    "spa rood 6x1.5l pet+statie",
  ],
  "10": [
    // COCKTAILS
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
  "13": [
    // WIJN
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
  "16": [
    // STERKE DRANK
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
    "bacardi carta negra 40% 1l",
    "bacardi carta oro 40% 1l",
    "bacardi lemon 40% 0.7l",
    "bacardi lemon 40% 1l",
    "bacardi razz 40% 0.7l",
    "bacardi razz 40% 1l",
    "bacardi special 40% 0.7l",
    "bacardi spiced 1l",
    "baileys %17 1l",
    "baileys 40% 0.7l",
    "ballantines 40% 0.7l",
    "ballantines 40% 1l",
    "belvedere 40% 1l",
    "belvedere 40% 70cl",
    "beylerbeyi gobek raki 0.35cl",
    "beylerbeyi gobek raki 0.70cl",
    "bokma jong 1l",
    "bokma oud jenever 1l",
    "bols blue curacao 21% 0.7l",
    "bombay gin 1l",
    "bombay gin 70cl",
    "bushmills 0,7l",
    "camino %35 0.70cl",
    "camino tequillla 40% 0.7l",
    "campari 0.70l",
    "campari 1l",
    "captain mor spiced %35 0.70ml",
    "captain mor spiced gold %35 1l",
    "captain morgan %35 1l",
    "captain morgan 35% 0.70l",
    "champagne 1x6",
    "champagne breton fils 12.5%",
    "chivas regal 12y 40% 0.7l",
    "chivas regal 12y 40% 12x0.05cl",
    "chivas regal 12y 40% 1l",
    "chivas regal 18y 40% 0.7l",
    "chivas regal 18y 40% 1l",
    "chivas royal salute 21y 40% 0.7l",
    "ciroc apple 37.5% 0.70ml",
    "ciroc black raspberry 37.5% 0.70 ml",
    "ciroc coconut 37.5% 0.70ml",
    "ciroc mango 37.5% 0.70ml",
    "ciroc peach 37.5% 0.70ml",
    "ciroc pineapple 37.5% 0.70ml",
    "ciroc pomegranate 37.5% 0.70ml",
    "ciroc red berry 37.5% 0.70ml",
    "ciroc vodka 1l",
    "cointreau 40% 1l",
    "cointreau 40% 70cl",
    "czarny bocian 40% - 12x50cl",
    "de kuyper vieux special 35% 1l",
    "dimple 15y 1l",
    "dimple 40% 0.7l",
    "disaronno orginale 1l",
    "dropshot 24% 0.7l",
    "dropshot 24% 1l",
    "dropshot double black 0.7l",
    "eristoff 0.2l mini",
    "esbjaerg 0.5l",
    "esbjaerg 1l",
    "esbjaerg 1x12 0.2cl doos",
    "extra zytnia 40% - 12x1l",
    "extra zytnia 40% - 12x50cl",
    "extra zytnia 40% - 12x70cl",
    "extra zytnia 40% - 20x20cl",
    "extra zytnia 40% - 60x10cl",
    "famous grouse 1l",
    "famous grouse 70cl",
    "finlandia 1l",
    "finlandia 70cl",
    "finlandia mango 1x6 0.70cl",
    "finlandia smaak mix 1x12 0.50cl",
    "flugel 40st",
    "four roses 40% 1l",
    "gin gordon 0.7l",
    "gin gordon 1l",
    "gin gordon pink 0.7l",
    "glen scanlan 0,35l",
    "glen talloch 0,20l",
    "glen talloch 0,35l",
    "glen talloch 0,7l",
    "glen talloch 40% 1l",
    "glenfiddich 12y 40% 1l",
    "glenfiddich 12y 40% 70cl",
    "gold label 40% 0.7l",
    "gordons gin 37.5% 1l",
    "gordons gin 37.5%0.70",
    "grants 0.7l",
    "grants 40% 0.35ml",
    "grants 40% 1l",
    "grey groose 0.2l",
    "grey groose 0.7l",
    "grey groose 1l",
    "hennessy 40% 0.7l",
    "hennessy 40% 1l",
    "hennessy 40% 35cl",
    "henryk sienkiewicz 1x12 0.50 cl",
    "hoppe jong jenever %35 1l",
    "hoppe vieux %35 1l",
    "hot,n sweet 0.70ml",
    "j&b 40% 1l",
    "jack dani gentleman %40 0.70 cl",
    "jack daniels 40% 0.2l",
    "jack daniels 40% 0.7l",
    "jack daniels 40% 1l",
    "jack daniels honey 0.7l",
    "jack daniels honey 1l",
    "jack daniels single barrel 45% 0.7l",
    "jack daniels single barrel 64% 0.7l",
    "jagemeister 35% 1l",
    "jagemeister 35% 70cl",
    "jagermeister 35% 35cl",
    "jameson 40% 0.7l",
    "jameson 40% 1l",
    "jb 0,2l mini",
    "jb 0,7l",
    "jb 1l",
    "jim appel 0.7l",
    "jim beam 0.7l",
    "jim beam 1l",
    "jim beam double oak 0.7l",
    "johnnie walker gold 40%1l",
    "johnniewalker gold 40%0.70",
    "johnny wa double black label 40%",
    "johnny wal black label 40% 0.7l",
    "johnny walker black label 40% 0.2l",
    "johnny walker black label 40% 1l",
    "johnny walker blue label 40% 0.7l",
    "johnny walker red label 40% 0.7l",
    "johnny walker red label 40% 1l",
    "johnny walker red label 40% 35cl",
    "jose cuervo 38% 0.70l",
    "jose cuervo 38% 1l",
    "joseph guy 0.70l",
    "kah lua 1l",
    "ketel 1l",
    "ketel 70cl",
    "krupnik vodka 40% - 12x50cl",
    "krupnik vodka 40% - 12x70cl",
    "krupnik vodka 40% - 20x20cl",
    "krupnik vodka 40% - 30x20cl",
    "krupnik vodka 40% - 60x10cl",
    "label 5 - 1l",
    "legner 1l",
    "licor 43 1l",
    "licor 43 70cl",
    "licor fhorchata43 1l",
    "licor fhorchata43 70cl",
    "lubelska - 12x50cl",
    "lubelska - 20x20cl",
    "malibu 21% 0.7l",
    "malibu 21% 1l",
    "paddy 40% 1l",
    "pasoa 1l",
    "pasoa 70cl",
    "pushkin 0.7l",
    "pushkin 1l",
    "roberto cavalli 0.7l",
    "safari 1l",
    "safari 70cl",
    "sambuca molinari 1l",
    "sambuca molinari 70cl",
    "saska czysta 1x12 0.70 cl",
    "saska mix 1x12 0.50 cl",
    "smirnoff 37.5% 0.5ml",
    "smirnoff 40% 1l",
    "smirnoff 40% 70cl",
    "soplica cytrynowka 26% - 24x20cl",
    "soplica aardbei 30% - 15x50cl",
    "soplica aardbei 30% - 24x10cl",
    "soplica aardbei 40% - 24x20cl",
    "soplica abrikoos 30% - 15x50cl",
    "soplica abrikoos 30% - 24x20cl",
    "soplica almond - caramel 25% - 15x5",
    "soplica almond - caramel 25% - 24x2",
    "soplica appel 30% - 15x50cl",
    "soplica appel 30% - 24x10cl",
    "soplica appel 30% - 96x10cl",
    "soplica bosbes 30% - 15x50cl",
    "soplica bosbes 30% - 96x10cl",
    "soplica clear 40% - 12x70cl",
    "soplica clear 40% - 15x50cl",
    "soplica clear 40% - 24x20cl",
    "soplica clear 40% - 8x1l",
    "soplica clear 40% - 96x10cl",
    "soplica cranberry 30% - 15x50cl",
    "soplica cranberry 30% - 24x10cl",
    "soplica cranbery 30% - 24x20cl",
    "soplica cytryna malina 28% 15x50cl",
    "soplica cytryna mieta 25% 15x50cl",
    "soplica cytryna-malina 25% - 24x20c",
    "soplica cytryna-malina 28% - 96x10c",
    "soplica cytryna-mieta 28% - 96x10c",
    "soplica cytryna-mieta 25% - 24x20cl",
    "soplica cytrynowka 26% 15x50cl",
    "soplica framboos 30% - 24x10cl",
    "soplica gorzka 28% 24x20cl",
    "soplica gorzka 32% - 96x9cl",
    "soplica gorzka 32% 15x50cl",
    "soplica gorzka mieta 28% - 96x9cl",
    "soplica gorzka mieta 28% 24x20cl",
    "soplica gorzka mieta 32% 15x50cl",
    "soplica hazelnoot 30% - 24x10cl",
    "soplica kawowa 25% - 24x20cl",
    "soplica kawowa 28% 15x50cl",
    "soplica kersen 30% - 15x50cl",
    "soplica kersen 30% - 24x10cl",
    "soplica kweepeer 30% - 15x50cl",
    "soplica kweepeer 30% - 24x10cl",
    "soplica lemon-honing 30% - 15x50cl",
    "soplica lemon-honing 30% - 24x20cl",
    "soplica lemon-honing 30% - 96x10cl",
    "soplica lemon-kweepeer 30% - 15x5",
    "soplica lemon-malina 30% - 15x50cl",
    "soplica lemon-vlierbloesem 30% - 1",
    "soplica malina 26% - 15x50cl",
    "soplica malina 26% - 24x20cl",
    "soplica malina 28% - 96x10cl",
    "soplica mirabel 30% - 15x50cl",
    "soplica morelowa 26% 15x50cl",
    "soplica morelowa 28% - 24x20cl",
    "soplica morelowa 28% - 96x10cl",
    "soplica orzech laskowy - choco 25",
    "soplica orzech laskowy 28% - 24x20",
    "soplica orzech laskowy 28% - 96x10",
    "soplica orzech laskowy 28% 15x50",
    "soplica pigwa 26% 15x50cl",
    "soplica pigwa 28% - 24x20cl",
    "soplica pigwa 28% - 96x10cl",
    "soplica pruim 30% - 15x50cl",
    "soplica sliwka 26% - 24x20cl",
    "soplica sliwka 28 % - 96x10cl",
    "soplica truskawka 26% - 24x20cl",
    "soplica truskawka 26% - 96x9cl",
    "soplica truskawka 26% 15x50cl",
    "soplica veen bes 30%96x10cl",
    "soplica walnoot 30% - 15x50cl",
    "soplica walnot 28% - 96x10cl",
    "soplica wisnia - choco 25% - 15x50c",
    "soplica wisnia - choco 25% - 24x20c",
    "soplica wisnia 26% - 24x20cl",
    "soplica wisnia 28% - 96x10cl",
    "soplica zwarte bes 28% - 24x20cl",
    "soplica zwarte bes 30% - 15x50cl",
    "soplica zwarte bes 30% - 24x10cl",
    "soplica zwarte bes 30% - 96x10cl",
    "sourz apple 15% 0.7l",
    "sourz rood 15% 0.7l",
    "southern comfort 1l",
    "stumbras vodka 12x50cl 40%",
    "stumbras vodka 20x20cl 40%",
    "stumbras vodka 6x1l 40%",
    "stumbras vodka 6x70cl 40%",
    "tekirdag 0.35",
    "tekirdag 45% 0.7l",
    "tekirdag gold 45% 0.35l",
    "tekirdag gold 45% 0.7l",
    "tequilla sierra silver 40% 0.7l",
    "tequilla silver 40% 1l",
    "tia maria 1l",
    "tia maria 70cl",
    "trojka pink %17 0.7l",
    "tullamore 0,7l",
    "ursus rood 40% 0.7l",
    "ursus rood 40% 1l",
    "vodka debowa military 0.70cl %40",
    "vodka debowa pocisk 0.70cl %40",
    "vodka debowa puchar 0.70cl %40",
    "vodka debowa schroef 0.70cl %40",
    "vodka debowa stolik + 4 kilieski 0.",
    "william lawson 0.2l",
    "william lawson 1l",
    "william lawson 70cl",
    "wybrowa vodka 1l",
    "wybrowa vodka 70cl",
    "wybuchowa 43% 6x700ml fles",
    "wyjebongo granat 38% 8x500ml fle",
    "wyjebongo marakuja 40% 8x500ml f",
    "yeni raki 45% 0.35l",
    "yeni raki 45% 0.7l",
    "yeni raki ala 35cl",
    "yeni raki ala 45% 0.7l",
    "zoladkowa czarna wisnia 12x50cl",
    "zoladkowa limonka mieta 12x50cl",
    "zoladkowa limonka mieta 20x20cl",
    "zoladkowa limonka mieta 24x9cl",
    "zoladkowa orient malina 12x50cl",
    "zoladkowa pigwa mieta 12x50cl",
    "zoladkowa pigwa mieta 20x20cl",
    "zoladkowa pigwa mieta 24x9cl",
    "zoladkowa tradycyjna 12x50cl",
    "zoladkowa tradycyjna 12x70cl",
    "zoladkowa tradycyjna 20x20cl",
    "zoladkowa tradycyjna 24x9cl",
    "zubrowka biala 40% - 96x10cl",
    "zubrowka biala 40% 12x1l",
    "zubrowka biala 40% 12x50cl",
    "zubrowka biala 40% 12x70cl",
    "zubrowka biala 40% 24x20cl",
    "zubrowka biala jalowca 37,5% - 15x",
    "zubrowka biala miety 37,5% - 15x50c",
    "zubrowka bison grass 37,5% - 15x50",
    "zubrowka bison grass 37,5% - 24x20",
    "zubrowka dzika czeresnia 32% - 15x",
    "zubrowka korzenna moc 37,5% - 15x",
    "zubrowka lesna poziomka 32% - 15x",
    "zubrowka rajskie jablko 32% - 15x5",
    "zubrowka rokitnik 37,5% - 15x50cl",
    "zubrowka rose 32% - 15x50cl",
  ],
  "18": [
    // KOFFIE THEE
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
  ],
  "19": [
    // HOUTSKOOL
    "houtskool 10 kg",
  ],
  "20": [
    // FOOD
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
  "21": [
    // NON-FOOD
    "a16 frikandel bak",
    "a22 1000st",
    "a23 doos 1000st",
    "a5 doos",
    "a7 bami bak",
    "aanmaak blok",
    "aanstekers 50st",
    "ajax 5l",
    "alu bak 1 vaks hoog 1000 st.",
    "alu bak kapsalon + deksel 250cc",
    "alu bak kapsalon klien deksel 250c",
    "alu bak kapsolan + deksel 450cc",
    "alu bak ml450/470ml",
    "alu deksel diep 1000 st.",
    "alu deksel menubak",
    "alu folie 50cm",
    "alu folie 6x30cm",
    "alu menubak 3 vaks laag",
    "aluminium bakjes 250cc 100 stk",
    "amsterdam glazen 12st",
    "amsterdam glazen 6st",
    "bierbekers 1000st doos",
    "bierbekers 50st los",
    "bierbekers heineken 1250 st",
    "bierfluit 12st",
    "catering folie 30cm 4st",
    "catering folie 45cm 4st",
    "depa snackbakwit a7 250st",
    "deuk wisky glazen 12st",
    "deuk wisky glazen 6st",
    "dranken blok x10",
    "dreft 1x8.1l",
    "dweilmop 400g",
    "easy spray xl",
    "glassex 12x750ml",
    "glorix 15x750ml",
    "glorix 1l",
    "grillreiniger 1l",
    "hamburgerbak groot 500st",
    "hamburgerbox hp 4*125",
    "handzeep 1x6st",
    "hemdraag tas 45cm",
    "hemdraag tas 60cm",
    "inpakzak 0.5/1/1.5/2",
    "kapsalonbak 450ml klein",
    "kapsalonbak 850ml groot",
    "klad blok x5",
    "kofiee bekers 100 stk",
    "kofiie bekers 1000 stk",
    "kofiie bekers 2500 stk",
    "komo vuilniszakken 15 rl",
    "komo vuilniszakken 20 rl",
    "latex handschoenen",
    "lolly mr bubble",
    "magretron deksel 650cc",
    "magretronbak 500cc",
    "magretronbak 650cc",
    "magretronbak deksel 500cc",
    "melk cupjes 200 st",
    "menu bak 100st",
    "mop 350g",
    "mop 50cm",
    "plastic bord 100st",
    "plastic lepel 10x100 doos",
    "plastic vork 10x100 doos",
    "poetsrol 1x6",
    "rietjes",
    "roer staafjes karton 1000st",
    "roze doek",
    "salade bak 375cc + vast deksel 600s",
    "saus bak 28cc 1000stk",
    "sauscup 10cc",
    "sauscup 30cc",
    "sauscup 80cc + deksel 1000st combi",
    "schuurspons xl 10 st",
    "servetten 8x8 pak",
    "shot glazen 12st",
    "shot glazen 6st",
    "soepkom + deksel 460cc",
    "speel kaarten katja 52",
    "speel kaarten katja hoskin",
    "spons 20x25gr",
    "staal borstel 1x2st",
    "sun bierglas reiniger",
    "tanden stokers",
    "thee doek 6st",
    "toiletpapier perfex 24x6",
    "wc papier 24x8st",
  ],
  "22": [
    // SCHOONMAAK
    "ajax 5l",
    "dreft 1x8.1l",
    "dweilmop 400g",
    "easy spray xl",
    "glassex 12x750ml",
    "glorix 15x750ml",
    "glorix 1l",
    "grillreiniger 1l",
    "handzeep 1x6st",
    "komo vuilniszakken 15 rl",
    "komo vuilniszakken 20 rl",
    "latex handschoenen",
    "mop 350g",
    "mop 50cm",
    "poetsrol 1x6",
    "roze doek",
    "schuurspons xl 10 st",
    "spons 20x25gr",
    "staal borstel 1x2st",
    "sun bierglas reiniger",
    "thee doek 6st",
    "toiletpapier perfex 24x6",
    "wc papier 24x8st",
  ],
  "23": [
    // KRATTEN
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
}

// String similarity calculation
function calculateSimilarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0
  const longer = str1.length > str2.length ? str1 : str2
  const shorter = str1.length > str2.length ? str2 : str1
  const longerLength = longer.length
  if (longerLength === 0) return 1.0
  const distance = editDistance(longer, shorter)
  return (longerLength - distance) / longerLength
}

function editDistance(str1: string, str2: string): number {
  str1 = str1.toLowerCase()
  str2 = str2.toLowerCase()
  const costs = new Array()
  for (let i = 0; i <= str1.length; i++) {
    let lastValue = i
    for (let j = 0; j <= str2.length; j++) {
      if (i === 0) costs[j] = j
      else {
        if (j > 0) {
          let newValue = costs[j - 1]
          if (str1.charAt(i - 1) !== str2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1
          costs[j - 1] = lastValue
          lastValue = newValue
        }
      }
    }
    if (i > 0) costs[str2.length] = lastValue
  }
  return costs[str2.length]
}

const products: Product[] = Object.entries(productData).flatMap(([fam2id, productNames]) =>
  productNames.map((name) => ({
    id: name, // This 'id' is the product name, not a unique productId
    name,
    price: 0,
    fam2id,
  })),
)

const productNameToProduct: Map<string, Product> = new Map()
const normalizedNameToProduct: Map<string, Product> = new Map()

function normalizeProductName(productName: string): string {
  return productName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\+\s*statie/g, "+statie")
    .replace(/\+ statie/g, "+statie")
    .replace(/\s*%\s*/g, "%")
    .replace(/\s*x\s*/g, "x")
    .replace(/,(\d)/g, ".$1")
    .replace(/\s*cl\s*/g, "cl")
    .replace(/\s*ml\s*/g, "ml")
    .replace(/\s*l\s*/g, "l")
    .replace(/\s*kg\s*/g, "kg")
    .replace(/\s*gr\s*/g, "gr")
}

console.log(`🔄 Building product lookup maps from ${products.length} products...`)
products.forEach((product) => {
  productNameToProduct.set(product.name.toLowerCase(), product)
  const normalizedName = normalizeProductName(product.name)
  normalizedNameToProduct.set(normalizedName, product)
  if (normalizedName.includes("+statie")) {
    const withoutStatie = normalizedName.replace(/\+statie/g, "").trim()
    if (!normalizedNameToProduct.has(withoutStatie)) {
      normalizedNameToProduct.set(withoutStatie, product)
    }
  }
})
console.log(
  `✅ Built lookup maps: ${productNameToProduct.size} original names, ${normalizedNameToProduct.size} normalized names`,
)

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

// --- MODIFIED categorizeProductExact function ---
export function categorizeProductExact(
  productName: string,
  volume?: string,
  arcleunik?: string, // Added arcleunik as an optional parameter
): {
  fam2id: string
  categoryName: string
  matchType: "exact" | "partial" | "fallback" | "id_match" // Added "id_match"
  matchedProduct?: Product
  confidence: number
} {
  // STEP 0: Try direct match with arcleunik (productId)
  if (arcleunik && arcleunikToFam2idMap[arcleunik]) {
    const fam2id = arcleunikToFam2idMap[arcleunik]
    const categoryName = getCategoryName(fam2id)
    console.log(`✅ ARCLEUNIK MATCH (ID_MATCH): arcleunik="${arcleunik}" -> fam2id=${fam2id}, category=${categoryName}`)
    return {
      fam2id,
      categoryName,
      matchType: "id_match", // New matchType for ID-based categorization
      confidence: 1.0, // Highest confidence for direct ID match
    }
  }
  if (arcleunik) {
    console.log(
      `ℹ️ Arcleunik "${arcleunik}" provided but not found in arcleunikToFam2idMap. Proceeding with name/volume matching.`,
    )
  }

  if (!productName) {
    return {
      fam2id: "21",
      categoryName: "NON-FOOD",
      matchType: "fallback",
      confidence: 0,
    }
  }

  console.log(`🔍 Categorizing by name/volume: "${productName}" (volume: "${volume || "N/A"}")`)
  const originalName = productName.trim()
  const normalizedName = normalizeProductName(productName)
  console.log(`   Original: "${originalName}"`)
  console.log(`   Normalized: "${normalizedName}"`)

  const exactOriginalMatch = productNameToProduct.get(originalName.toLowerCase())
  if (exactOriginalMatch) {
    const categoryName = getCategoryName(exactOriginalMatch.fam2id)
    console.log(`✅ EXACT ORIGINAL MATCH: fam2id=${exactOriginalMatch.fam2id}, category=${categoryName}`)
    return {
      fam2id: exactOriginalMatch.fam2id,
      categoryName,
      matchType: "exact",
      matchedProduct: exactOriginalMatch,
      confidence: 0.99, // Slightly less than ID match
    }
  }

  const exactNormalizedMatch = normalizedNameToProduct.get(normalizedName)
  if (exactNormalizedMatch) {
    const categoryName = getCategoryName(exactNormalizedMatch.fam2id)
    console.log(`✅ EXACT NORMALIZED MATCH: fam2id=${exactNormalizedMatch.fam2id}, category=${categoryName}`)
    return {
      fam2id: exactNormalizedMatch.fam2id,
      categoryName,
      matchType: "exact",
      matchedProduct: exactNormalizedMatch,
      confidence: 0.95,
    }
  }

  if (volume) {
    const nameWithVolume = `${normalizedName} ${normalizeProductName(volume)}`.trim()
    const volumeMatch = normalizedNameToProduct.get(nameWithVolume)
    if (volumeMatch) {
      const categoryName = getCategoryName(volumeMatch.fam2id)
      console.log(`✅ VOLUME MATCH: fam2id=${volumeMatch.fam2id}, category=${categoryName}`)
      return {
        fam2id: volumeMatch.fam2id,
        categoryName,
        matchType: "exact",
        matchedProduct: volumeMatch,
        confidence: 0.92,
      }
    }
  }

  if (normalizedName.includes("blik")) {
    if (
      normalizedName.includes("non-food") ||
      normalizedName.includes("schoonmaak") ||
      normalizedName.includes("verf")
    ) {
      // Let it fall through
    } else if (normalizedName.includes("bier") || normalizedName.includes("beer")) {
      console.log(`✅ AGGRESSIVE BLIK MATCH (BIER): POOLSE BIER BLIK (fam2id: 4)`)
      return { fam2id: "4", categoryName: "POOLSE BIER BLIK", matchType: "partial", confidence: 0.9 }
    } else if (
      normalizedName.includes("cola") ||
      normalizedName.includes("fanta") ||
      normalizedName.includes("sprite") ||
      normalizedName.includes("pepsi") ||
      normalizedName.includes("energy") ||
      normalizedName.includes("red bull") ||
      normalizedName.includes("frisdrank") ||
      normalizedName.includes("soda") ||
      normalizedName.includes("ice tea") ||
      normalizedName.includes("chocomel")
    ) {
      console.log(`✅ AGGRESSIVE BLIK MATCH (FRISDRANK): FRISDRANKEN (fam2id: 6)`)
      return { fam2id: "6", categoryName: "FRISDRANKEN", matchType: "partial", confidence: 0.9 }
    } else if (
      normalizedName.includes("mix") ||
      normalizedName.includes("bacardi") ||
      normalizedName.includes("smirnoff") ||
      normalizedName.includes("gordon") ||
      normalizedName.includes("jack")
    ) {
      console.log(`✅ AGGRESSIVE BLIK MATCH (MIX DRANK): MIX DRANK (fam2id: 5)`)
      return { fam2id: "5", categoryName: "MIX DRANK", matchType: "partial", confidence: 0.9 }
    } else if (!normalizedName.includes("food") || normalizedName.includes("chocomel blik")) {
      console.log(`✅ AGGRESSIVE GENERAL BLIK MATCH: FRISDRANKEN (fam2id: 6) - Defaulting to drink for generic blik`)
      return { fam2id: "6", categoryName: "FRISDRANKEN", matchType: "partial", confidence: 0.8 }
    }
  }

  let bestMatch: Product | null = null
  let bestScore = 0
  let iterations = 0
  const maxIterationsPartial = 500
  for (const product of products) {
    if (iterations++ > maxIterationsPartial) break
    const similarity = calculateSimilarity(normalizedName, normalizeProductName(product.name))
    if (similarity > bestScore && similarity > 0.88) {
      bestScore = similarity
      bestMatch = product
    }
  }
  if (bestMatch && bestScore > 0.88) {
    const categoryName = getCategoryName(bestMatch.fam2id)
    console.log(
      `✅ PARTIAL MATCH: "${bestMatch.name}" fam2id=${bestMatch.fam2id}, category=${categoryName}, confidence=${bestScore.toFixed(2)}`,
    )
    return {
      fam2id: bestMatch.fam2id,
      categoryName,
      matchType: "partial",
      matchedProduct: bestMatch,
      confidence: bestScore,
    }
  }

  iterations = 0
  const maxIterationsSubstring = 200
  for (const product of products) {
    if (iterations++ > maxIterationsSubstring) break
    const productNormalized = normalizeProductName(product.name)
    if (productNormalized.includes(normalizedName) || normalizedName.includes(productNormalized)) {
      if (Math.abs(productNormalized.length - normalizedName.length) <= 7) {
        const categoryName = getCategoryName(product.fam2id)
        console.log(`✅ SUBSTRING MATCH: "${product.name}" fam2id=${product.fam2id}, category=${categoryName}`)
        return {
          fam2id: product.fam2id,
          categoryName,
          matchType: "partial",
          matchedProduct: product,
          confidence: 0.75,
        }
      }
    }
  }

  const fallbackResult = fallbackCategorization(productName, volume)
  const categoryName = getCategoryName(fallbackResult)
  console.log(`⚠️ FALLBACK: fam2id=${fallbackResult}, category=${categoryName}`)
  return {
    fam2id: fallbackResult,
    categoryName,
    matchType: "fallback",
    confidence: 0.1,
  }
}

function fallbackCategorization(productName: string, volume?: string): string {
  const name = productName.toLowerCase()
  const vol = volume?.toLowerCase() || ""
  const fullText = `${name} ${vol}`.trim()
  console.log(`🔄 AGGRESSIVE Fallback categorization for: "${fullText}"`)

  if (fullText.includes("krat") || fullText.includes("crate") || fullText.includes("statiegeld")) {
    console.log(`   → KRATTEN (fam2id: 23)`)
    return "23"
  }

  if (fullText.includes("blik")) {
    if (
      fullText.includes("non-food") ||
      fullText.includes("schoonmaak") ||
      fullText.includes("verf") ||
      (fullText.includes("food") && !fullText.includes("chocomel"))
    ) {
      console.log(`   → Blik identified as non-drink, deferring...`)
    } else if (fullText.includes("bier") || fullText.includes("beer")) {
      console.log(`   → POOLSE BIER BLIK (fam2id: 4) - Fallback Blik Rule`)
      return "4"
    } else if (
      fullText.includes("cola") ||
      fullText.includes("fanta") ||
      fullText.includes("sprite") ||
      fullText.includes("pepsi") ||
      fullText.includes("red bull") ||
      fullText.includes("energy") ||
      fullText.includes("frisdrank") ||
      fullText.includes("soda") ||
      fullText.includes("ice tea") ||
      fullText.includes("chocomel")
    ) {
      console.log(`   → FRISDRANKEN (fam2id: 6) - Fallback Blik Rule`)
      return "6"
    } else if (
      fullText.includes("mix") ||
      fullText.includes("bacardi") ||
      fullText.includes("smirnoff") ||
      fullText.includes("gordon") ||
      fullText.includes("jack")
    ) {
      console.log(`   → MIX DRANK (fam2id: 5) - Fallback Blik Rule`)
      return "5"
    } else {
      console.log(`   → FRISDRANKEN (fam2id: 6) - AGGRESSIVE DEFAULT FOR GENERIC BLIK`)
      return "6"
    }
  }

  if (fullText.includes("bier") || fullText.includes("beer")) {
    if (fullText.includes("fles")) {
      console.log(`   → POOLSE BIER FLES (fam2id: 3)`)
      return "3"
    }
    console.log(`   → NL BIER (fam2id: 2)`)
    return "2"
  }
  if (
    fullText.includes("wijn") ||
    fullText.includes("wine") ||
    fullText.includes("75cl") ||
    fullText.includes("martini") ||
    fullText.includes("prosecco") ||
    fullText.includes("carlo rossi")
  ) {
    console.log(`   → WIJN (fam2id: 13)`)
    return "13"
  }
  if (
    fullText.includes("vodka") ||
    fullText.includes("whisky") ||
    fullText.includes("rum") ||
    fullText.includes("gin") ||
    fullText.includes("jenever") ||
    fullText.includes("likeur") ||
    fullText.includes("licor") ||
    fullText.includes("jagermeister") ||
    fullText.includes("baileys") ||
    fullText.includes("cognac") ||
    fullText.includes("soplica") ||
    fullText.includes("absolut") ||
    fullText.includes("smirnoff") ||
    fullText.includes("jack daniels") ||
    fullText.includes("johnnie walker") ||
    fullText.includes("sterke") ||
    (fullText.includes("drank") && (fullText.includes("40%") || fullText.includes("37.5%")))
  ) {
    console.log(`   → STERKE DRANK (fam2id: 16)`)
    return "16"
  }
  if (
    fullText.includes("cola") ||
    fullText.includes("fanta") ||
    fullText.includes("sprite") ||
    fullText.includes("pepsi") ||
    fullText.includes("frisdrank") ||
    fullText.includes("soda") ||
    fullText.includes("energy") ||
    fullText.includes("red bull") ||
    fullText.includes("ice tea") ||
    fullText.includes("minute maid") ||
    fullText.includes("appelsap") ||
    fullText.includes("sinas") ||
    fullText.includes("cassis") ||
    fullText.includes("chocomel")
  ) {
    console.log(`   → FRISDRANKEN (fam2id: 6)`)
    return "6"
  }
  if (
    fullText.includes("water") ||
    fullText.includes("spa") ||
    fullText.includes("chaudfontaine") ||
    fullText.includes("sourcy") ||
    fullText.includes("erikli") ||
    fullText.includes("bar le duc")
  ) {
    console.log(`   → WATER (fam2id: 7)`)
    return "7"
  }
  if (
    fullText.includes("cocktail") ||
    fullText.includes("mojito") ||
    fullText.includes("margarita") ||
    fullText.includes("pina colada") ||
    fullText.includes("breezer") ||
    (fullText.includes("mix") &&
      (fullText.includes("fruit") || fullText.includes("berry") || fullText.includes("le coq")))
  ) {
    console.log(`   → COCKTAILS (fam2id: 10)`)
    return "10"
  }
  if (
    fullText.includes("koffie") ||
    fullText.includes("thee") ||
    fullText.includes("cacao") ||
    fullText.includes("cappuccino") ||
    fullText.includes("nescafe") ||
    fullText.includes("pickwick")
  ) {
    console.log(`   → KOFFIE THEE (fam2id: 18)`)
    return "18"
  }
  if (fullText.includes("houtskool")) {
    console.log(`   → HOUTSKOOL (fam2id: 19)`)
    return "19"
  }
  if (
    fullText.includes("chips") ||
    fullText.includes("chocolade") ||
    fullText.includes("saus") ||
    fullText.includes("snack") ||
    fullText.includes("frikandel") ||
    fullText.includes("kroket") ||
    fullText.includes("hamburger") ||
    fullText.includes("brood") ||
    fullText.includes("ijs") ||
    fullText.includes("yoghurt") ||
    fullText.includes("melk") ||
    fullText.includes("olie") ||
    fullText.includes("zout") ||
    fullText.includes("suiker") ||
    fullText.includes("mayo") ||
    fullText.includes("ketchup") ||
    fullText.includes("mosterd") ||
    fullText.includes("frites") ||
    (fullText.includes("food") && !fullText.includes("non-food"))
  ) {
    console.log(`   → FOOD (fam2id: 20)`)
    return "20"
  }
  if (
    fullText.includes("schoonmaak") ||
    fullText.includes("ajax") ||
    fullText.includes("dreft") ||
    fullText.includes("glorix") ||
    fullText.includes("wc papier") ||
    fullText.includes("handzeep") ||
    fullText.includes("glassex") ||
    fullText.includes("grillreiniger") ||
    fullText.includes("poetsrol") ||
    fullText.includes("dweil") ||
    fullText.includes("spons")
  ) {
    console.log(`   → SCHOONMAAK (fam2id: 22)`)
    return "22"
  }

  console.log(`   → NON-FOOD (default fallback, fam2id: 21)`)
  return "21"
}

export function getCategoryName(fam2id: string): string {
  return fam2idMapping[fam2id] || categoryMapping[fam2id] || "OVERIGE PRODUCTEN"
}

export const categorizeProduct = categorizeProductExact
export default categorizeProductExact
