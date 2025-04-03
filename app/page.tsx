import { Suspense } from "react"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"
import { getProductsByFam2ID } from "@/lib/api"

// Dynamically import components with lazy loading
const PromoGrid = dynamic(() => import("@/components/promo-carousel").then((mod) => mod.PromoGrid), {
  loading: () => <PromoGridSkeleton />,
})

const FeaturedProductsCarousel = dynamic(
  () => import("@/components/featured-products-carousel").then((mod) => mod.FeaturedProductsCarousel),
  { loading: () => <FeaturedProductsCarouselSkeleton /> },
)

const LovkaProductsection = dynamic(() => import("@/components/LovkaProductsection").then((mod) => mod), {
  loading: () => <LovkaProductsectionSkeleton />,
})

const AboutUsSection = dynamic(() => import("@/components/about-us-section").then((mod) => mod.AboutUsSection), {
  loading: () => <AboutUsSectionSkeleton />,
})

const AppDownload = dynamic(() => import("@/components/app-download").then((mod) => mod.AppDownload), {
  loading: () => <AppDownloadSkeleton />,
})

// Skeleton components
function PromoGridSkeleton() {
  return (
    <div className="w-full mb-8">
      <Skeleton className="w-full h-[300px] md:h-[400px] rounded-md" />
    </div>
  )
}

function FeaturedProductsCarouselSkeleton({ backgroundColor = "white" }) {
  return (
    <div className={`w-full py-10 px-4 ${backgroundColor === "white" ? "bg-white" : "bg-[#0F3059]"}`}>
      <div className="container mx-auto">
        <Skeleton className={`h-8 w-64 mb-2 ${backgroundColor === "white" ? "bg-gray-200" : "bg-gray-700"}`} />
        <Skeleton className={`h-6 w-96 mb-6 ${backgroundColor === "white" ? "bg-gray-200" : "bg-gray-700"}`} />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex flex-col">
                <Skeleton
                  className={`aspect-square rounded-md ${backgroundColor === "white" ? "bg-gray-200" : "bg-gray-700"}`}
                />
                <Skeleton
                  className={`h-5 w-full mt-2 ${backgroundColor === "white" ? "bg-gray-200" : "bg-gray-700"}`}
                />
                <Skeleton className={`h-5 w-2/3 mt-1 ${backgroundColor === "white" ? "bg-gray-200" : "bg-gray-700"}`} />
                <Skeleton
                  className={`h-8 w-full mt-2 ${backgroundColor === "white" ? "bg-gray-200" : "bg-gray-700"}`}
                />
              </div>
            ))}
        </div>

        <div className="flex justify-center mt-6">
          <Skeleton className={`h-10 w-32 ${backgroundColor === "white" ? "bg-gray-200" : "bg-gray-700"}`} />
        </div>
      </div>
    </div>
  )
}

function LovkaProductsectionSkeleton() {
  return (
    <div className="w-full py-10 px-4 bg-[#0F3059]">
      <div className="container mx-auto">
        <Skeleton className="h-8 w-64 mb-4 bg-gray-700" />
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Skeleton className="h-4 w-full mb-2 bg-gray-700" />
            <Skeleton className="h-4 w-full mb-2 bg-gray-700" />
            <Skeleton className="h-4 w-full mb-2 bg-gray-700" />
            <Skeleton className="h-4 w-3/4 mb-2 bg-gray-700" />
          </div>
          <Skeleton className="aspect-video rounded-md bg-gray-700" />
        </div>
      </div>
    </div>
  )
}


function AboutUsSectionSkeleton() {
  return (
    <div className="w-full py-10 px-4 bg-[#0F3059]">
      <div className="container mx-auto">
        <Skeleton className="h-8 w-64 mb-4 bg-gray-700" />
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Skeleton className="h-4 w-full mb-2 bg-gray-700" />
            <Skeleton className="h-4 w-full mb-2 bg-gray-700" />
            <Skeleton className="h-4 w-full mb-2 bg-gray-700" />
            <Skeleton className="h-4 w-3/4 mb-2 bg-gray-700" />
          </div>
          <Skeleton className="aspect-video rounded-md bg-gray-700" />
        </div>
      </div>
    </div>
  )
}

function AppDownloadSkeleton() {
  return (
    <div className="w-full py-10 px-4 bg-white">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Skeleton className="h-8 w-64 mb-4 bg-gray-200" />
            <Skeleton className="h-4 w-full mb-2 bg-gray-200" />
            <Skeleton className="h-4 w-full mb-2 bg-gray-200" />
            <Skeleton className="h-4 w-3/4 mb-4 bg-gray-200" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-32 bg-gray-200" />
              <Skeleton className="h-12 w-32 bg-gray-200" />
            </div>
          </div>
          <Skeleton className="aspect-square rounded-md bg-gray-200" />
        </div>
      </div>
    </div>
  )
}

export default async function Home() {
  // Fetch data with suspense boundaries
  return (
    <div className="overflow-x-hidden">
      <Suspense fallback={<PromoGridSkeleton />}>
        <PromoGrid />
      </Suspense>

      {/* New sections */}
      <Suspense fallback={<FeaturedProductsCarouselSkeleton backgroundColor="white" />}>
        <IkratBlikSection />
      </Suspense>

      <Suspense fallback={<FeaturedProductsCarouselSkeleton backgroundColor="#0F3059" />}>
        <FrisdrankenSection />
      </Suspense>

      <Suspense fallback={<FeaturedProductsCarouselSkeleton backgroundColor="white" />}>
        <LimonadenSection />
      </Suspense>

      <Suspense fallback={<FeaturedProductsCarouselSkeleton backgroundColor="#0F3059" />}>
        <PoolsDrankenSection />
      </Suspense>

      <Suspense fallback={<FeaturedProductsCarouselSkeleton backgroundColor="white" />}>
        <WaterNLSection />
      </Suspense>

      <Suspense fallback={<FeaturedProductsCarouselSkeleton backgroundColor="#0F3059" />}>
        <WaterPLSection />
      </Suspense>

      <Suspense fallback={<FeaturedProductsCarouselSkeleton backgroundColor="white" />}>
        <KoffieTheeSection />
      </Suspense>

      <Suspense fallback={<FeaturedProductsCarouselSkeleton backgroundColor="#0F3059" />}>
        <NonFoodSection />
      </Suspense>

      <Suspense fallback={<FeaturedProductsCarouselSkeleton backgroundColor="white" />}>
        <SchoonmaakSection />
      </Suspense>

      <Suspense fallback={<FeaturedProductsCarouselSkeleton backgroundColor="#0F3059" />}>
        <HoutskoolSection />
      </Suspense>

      <Suspense fallback={<FeaturedProductsCarouselSkeleton backgroundColor="white" />}>
        <BierenNLSection />
      </Suspense>

      <Suspense fallback={<FeaturedProductsCarouselSkeleton backgroundColor="#0F3059" />}>
        <PoolseBierenFlexSection />
      </Suspense>

      <Suspense fallback={<FeaturedProductsCarouselSkeleton backgroundColor="white" />}>
        <PoolseBierenBlikSection />
      </Suspense>

      <Suspense fallback={<FeaturedProductsCarouselSkeleton backgroundColor="#0F3059" />}>
        <SterkeDrankSection />
      </Suspense>

      <Suspense fallback={<FeaturedProductsCarouselSkeleton backgroundColor="white" />}>
        <MixDrankSection />
      </Suspense>

      <Suspense fallback={<FeaturedProductsCarouselSkeleton backgroundColor="#0F3059" />}>
        <CocktailsSection />
      </Suspense>

      <Suspense fallback={<FeaturedProductsCarouselSkeleton backgroundColor="white" />}>
        <WijnenSection />
      </Suspense>

      <Suspense fallback={<FeaturedProductsCarouselSkeleton backgroundColor="#0F3059" />}>
        <VoedingSection />
      </Suspense>

      <Suspense fallback={<LovkaProductsection />}>
        <LovkaProductsection />
      </Suspense>

      <Suspense fallback={<AboutUsSectionSkeleton />}>
        <AboutUsSection />
      </Suspense>

      <Suspense fallback={<AppDownloadSkeleton />}>
        <AppDownload />
      </Suspense>
    </div>
  )
}

// DRANKEN - IKRAT / BLIK (ID: 23)
async function IkratBlikSection() {
  const ikratBlikProducts = await getProductsByFam2ID("23").catch(() => [])

  return (
    <FeaturedProductsCarousel
      title="DRANKEN - IKRAT / BLIK"
      subtitle="Dranken in kratten en blikken"
      products={ikratBlikProducts.slice(0, 10)}
      viewAllLink="/dranken/ikrat-blik"
      backgroundColor="#0F3059"
      titleColor="#D0C298"
      subtitleColor="white"
      linkColor="#D0C298"
    />
  )
}



// DRANKEN - FRISDRANKEN (ID: 6)
async function FrisdrankenSection() {
  const frisdrankenProducts = await getProductsByFam2ID("6").catch(() => [])

  return (
    <FeaturedProductsCarousel
      title="DRANKEN - FRISDRANKEN"
      subtitle="Verfrissende frisdranken voor elk moment"
      products={frisdrankenProducts.slice(0, 10)}
      viewAllLink="/dranken/frisdranken"
      backgroundColor="white"
      titleColor="#D0C298"
      subtitleColor="black"
      linkColor="black"
    />
  )
}

// DRANKEN - LIMONADEN (ID: 1)
async function LimonadenSection() {
  const limonadenProducts = await getProductsByFam2ID("1").catch(() => [])

  return (
    <FeaturedProductsCarousel
      title="DRANKEN - LIMONADEN"
      subtitle="Verfrissende limonades voor elke gelegenheid"
      products={limonadenProducts.slice(0, 10)}
      viewAllLink="/dranken/limonaden"
      backgroundColor="#0F3059"
      titleColor="#D0C298"
      subtitleColor="white"
      linkColor="#D0C298"
    />
  )
}

// DRANKEN - POOLS (ID: 2)
async function PoolsDrankenSection() {
  const poolsDrankenProducts = await getProductsByFam2ID("2").catch(() => [])

  return (
    <FeaturedProductsCarousel
      title="DRANKEN - POOLS"
      subtitle="Poolse dranken en specialiteiten"
      products={poolsDrankenProducts.slice(0, 10)}
      viewAllLink="/dranken/pools"
      backgroundColor="white"
      titleColor="#D0C298"
      subtitleColor="black"
      linkColor="black"
    />
  )
}

// DRANKEN - WATER NL (ID: 7)
async function WaterNLSection() {
  const waterNLProducts = await getProductsByFam2ID("7").catch(() => [])

  return (
    <FeaturedProductsCarousel
      title="DRANKEN - WATER NL"
      subtitle="Nederlandse water producten"
      products={waterNLProducts.slice(0, 10)}
      viewAllLink="/dranken/water-nl"
      backgroundColor="#0F3059"
      titleColor="#D0C298"
      subtitleColor="white"
      linkColor="#D0C298"
    />
  )
}

// DRANKEN - WATER PL (ID: 12)
async function WaterPLSection() {
  const waterPLProducts = await getProductsByFam2ID("12").catch(() => [])

  return (
    <FeaturedProductsCarousel
      title="DRANKEN - WATER PL"
      subtitle="Poolse water producten"
      products={waterPLProducts.slice(0, 10)}
      viewAllLink="/dranken/water-pl"
      backgroundColor="white"
      titleColor="#D0C298"
      subtitleColor="black"
      linkColor="black"
    />
  )
}

// DRANKEN - KOFFIE THEE (ID: 18)
async function KoffieTheeSection() {
  const koffieTheeProducts = await getProductsByFam2ID("18").catch(() => [])

  return (
    <FeaturedProductsCarousel
      title="DRANKEN - KOFFIE THEE"
      subtitle="Kwaliteitskoffie en thee voor de echte liefhebber"
      products={koffieTheeProducts.slice(0, 10)}
      viewAllLink="/dranken/koffie-thee"
      backgroundColor="#0F3059"
      titleColor="#D0C298"
      subtitleColor="white"
      linkColor="#D0C298"
    />
  )
}

// NON FOOD (ID: 21)
async function NonFoodSection() {
  const nonFoodProducts = await getProductsByFam2ID("21").catch(() => [])

  return (
    <FeaturedProductsCarousel
      title="NON FOOD"
      subtitle="Non-Food producten voor restaurants en Cafe Bar's"
      products={nonFoodProducts.slice(0, 10)}
      viewAllLink="/non-food"
      backgroundColor="white"
      titleColor="#D0C298"
      subtitleColor="black"
      linkColor="black"
    />
  )
}

// NON FOOD - SCHOONMAAK (ID: 22)
async function SchoonmaakSection() {
  const schoonmaakProducts = await getProductsByFam2ID("22").catch(() => [])

  return (
    <FeaturedProductsCarousel
      title="NON FOOD - SCHOONMAAK"
      subtitle="Schoonmaakproducten voor professioneel gebruik"
      products={schoonmaakProducts.slice(0, 10)}
      viewAllLink="/non-food/schoonmaak"
      backgroundColor="#0F3059"
      titleColor="#D0C298"
      subtitleColor="white"
      linkColor="#D0C298"
    />
  )
}

// NON FOOD - HOUTSKOOL (ID: 19)
async function HoutskoolSection() {
  const houtskoolProducts = await getProductsByFam2ID("19").catch(() => [])

  return (
    <FeaturedProductsCarousel
      title="NON FOOD - HOUTSKOOL"
      subtitle="Houtskool voor barbecue en grill"
      products={houtskoolProducts.slice(0, 10)}
      viewAllLink="/non-food/houtskool"
      backgroundColor="white"
      titleColor="#D0C298"
      subtitleColor="black"
      linkColor="black"
    />
  )
}

// SPIRITS - BIEREN NL (ID: 9)
async function BierenNLSection() {
  const bierenNLProducts = await getProductsByFam2ID("9").catch(() => [])

  return (
    <FeaturedProductsCarousel
      title="SPIRITS - BIEREN NL"
      subtitle="Uitgebreid assortiment aan Nederlandse bieren"
      products={bierenNLProducts.slice(0, 10)}
      viewAllLink="/spirits/bieren-nl"
      backgroundColor="#0F3059"
      titleColor="#D0C298"
      subtitleColor="white"
      linkColor="#D0C298"
    />
  )
}

// SPIRITS - POOLSE BIEREN FLEX (ID: 3)
async function PoolseBierenFlexSection() {
  const poolseBierenFlexProducts = await getProductsByFam2ID("3").catch(() => [])

  return (
    <FeaturedProductsCarousel
      title="SPIRITS - POOLSE BIEREN FLEX"
      subtitle="Flexibele verpakkingen van Poolse bieren"
      products={poolseBierenFlexProducts.slice(0, 10)}
      viewAllLink="/spirits/poolse-bieren-flex"
      backgroundColor="white"
      titleColor="#D0C298"
      subtitleColor="black"
      linkColor="black"
    />
  )
}

// SPIRITS - POOLSE BIEREN BLIK (ID: 4)
async function PoolseBierenBlikSection() {
  const poolseBierenBlikProducts = await getProductsByFam2ID("4").catch(() => [])

  return (
    <FeaturedProductsCarousel
      title="SPIRITS - POOLSE BIEREN BLIK"
      subtitle="Poolse bieren in blik"
      products={poolseBierenBlikProducts.slice(0, 10)}
      viewAllLink="/spirits/poolse-bieren-blik"
      backgroundColor="#0F3059"
      titleColor="#D0C298"
      subtitleColor="white"
      linkColor="#D0C298"
    />
  )
}

// SPIRITS - STERKE DRANK (ID: 16)
async function SterkeDrankSection() {
  const sterkeDrankProducts = await getProductsByFam2ID("16").catch(() => [])

  return (
    <FeaturedProductsCarousel
      title="SPIRITS - STERKE DRANK"
      subtitle="Premium sterke dranken en spirits"
      products={sterkeDrankProducts.slice(0, 10)}
      viewAllLink="/spirits/sterke-drank"
      backgroundColor="white"
      titleColor="#D0C298"
      subtitleColor="black"
      linkColor="black"
    />
  )
}

// SPIRITS - MIX DRANK (ID: 5)
async function MixDrankSection() {
  const mixDrankProducts = await getProductsByFam2ID("5").catch(() => [])

  return (
    <FeaturedProductsCarousel
      title="SPIRITS - MIX DRANK"
      subtitle="Mix dranken en cocktail ingrediënten"
      products={mixDrankProducts.slice(0, 10)}
      viewAllLink="/spirits/mix-drank"
      backgroundColor="#0F3059"
      titleColor="#D0C298"
      subtitleColor="white"
      linkColor="#D0C298"
    />
  )
}

// SPIRITS - COCKTAILS (ID: 10)
async function CocktailsSection() {
  const cocktailsProducts = await getProductsByFam2ID("10").catch(() => [])

  return (
    <FeaturedProductsCarousel
      title="SPIRITS - COCKTAILS"
      subtitle="Heerlijke cocktails voor elke gelegenheid"
      products={cocktailsProducts.slice(0, 10)}
      viewAllLink="/spirits/cocktails"
      backgroundColor="white"
      titleColor="#D0C298"
      subtitleColor="black"
      linkColor="black"
    />
  )
}

// SPIRITS - WIJNEN (ID: 13)
async function WijnenSection() {
  const wijnenProducts = await getProductsByFam2ID("13").catch(() => [])

  return (
    <FeaturedProductsCarousel
      title="SPIRITS - WIJNEN"
      subtitle="Uitgebreid assortiment aan wijnen"
      products={wijnenProducts.slice(0, 10)}
      viewAllLink="/spirits/wijnen"
      backgroundColor="#0F3059"
      titleColor="#D0C298"
      subtitleColor="white"
      linkColor="#D0C298"
    />
  )
}

// FOOD - VOEDING (ID: 14)
async function VoedingSection() {
  const voedingProducts = await getProductsByFam2ID("14").catch(() => [])

  return (
    <FeaturedProductsCarousel
      title="FOOD - VOEDING"
      subtitle="Voedingsproducten voor restaurants en cafés"
      products={voedingProducts.slice(0, 10)}
      viewAllLink="/food/voeding"
      backgroundColor="white"
      titleColor="#D0C298"
      subtitleColor="black"
      linkColor="black"
    />
  )
}

