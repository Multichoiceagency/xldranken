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

      <Suspense fallback={<LovkaProductsection />}>
        <LovkaProductsection />
      </Suspense>

      <Suspense fallback={<AboutUsSectionSkeleton />}>
        <AboutUsSection />
      </Suspense>
    </div>
  )
}

// DRANKEN - IKRAT / BLIK (ID: 23)
async function IkratBlikSection() {
  const ikratBlikProducts = await getProductsByFam2ID("4").catch(() => [])

  return (
    <FeaturedProductsCarousel
      title="POOLS BIER BLIK"
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
  const frisdrankenProducts = await getProductsByFam2ID("16").catch(() => [])

  return (
    <FeaturedProductsCarousel
      title="STERKE DRANKEN"
      subtitle="Uitgebreid assortiment aan sterke dranken"
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
      title="LIMONADEN"
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
  const poolsDrankenProducts = await getProductsByFam2ID("1").catch(() => [])

  return (
    <FeaturedProductsCarousel
      title="NON FOOD"
      subtitle="Non food producten voor horeca"
      products={poolsDrankenProducts.slice(0, 10)}
      viewAllLink="/dranken/pools"
      backgroundColor="white"
      titleColor="#D0C298"
      subtitleColor="black"
      linkColor="black"
    />
  )
}
