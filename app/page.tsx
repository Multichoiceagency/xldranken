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

const ShopByCategory = dynamic(() => import("@/components/shop-by-category").then((mod) => mod.ShopByCategory), {
  loading: () => <ShopByCategorySkeleton />,
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

function ShopByCategorySkeleton() {
  return (
    <div className="w-full py-10 px-4 bg-white">
      <div className="container mx-auto">
        <Skeleton className="h-8 w-64 mb-6 bg-gray-200" />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-md bg-gray-200" />
            ))}
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

      <Suspense fallback={<FeaturedProductsCarouselSkeleton backgroundColor="#0F3059" />}>
        <AlcoholProductsSection />
      </Suspense>

      <Suspense fallback={<FeaturedProductsCarouselSkeleton backgroundColor="white" />}>
        <LovkaProductsSection />
      </Suspense>

      <Suspense fallback={<FeaturedProductsCarouselSkeleton backgroundColor="#0F3059" />}>
        <SoftDrinkProductsSection />
      </Suspense>

      <Suspense fallback={<FeaturedProductsCarouselSkeleton backgroundColor="white" />}>
        <WineProductsSection />
      </Suspense>

      <Suspense fallback={<FeaturedProductsCarouselSkeleton backgroundColor="#0F3059" />}>
        <NonFoodProductsSection />
      </Suspense>

      <Suspense fallback={<ShopByCategorySkeleton />}>
        <ShopByCategory />
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

// Separate components for each product section to enable independent loading
async function AlcoholProductsSection() {
  const alcoholProducts = await getProductsByFam2ID("1").catch(() => [])

  return (
    <FeaturedProductsCarousel
      title="MEEST VERKOCHTE BIER SOORTEN"
      subtitle="Ontdek onze selectie van populaire dranken"
      products={alcoholProducts.slice(0, 10)}
      viewAllLink="/alcohol"
      backgroundColor="#0F3059"
      titleColor="#D0C298"
      subtitleColor="white"
      linkColor="#D0C298"
    />
  )
}

async function LovkaProductsSection() {
  const LovkaProducts = await getProductsByFam2ID("5").catch(() => [])

  return (
    <FeaturedProductsCarousel
      title="LOVKA DRINKS"
      subtitle="Premium vodka met een flamboyante smaak"
      products={LovkaProducts.slice(0, 10)}
      viewAllLink="/cocktails"
      backgroundColor="white"
      titleColor="#D0C298"
      subtitleColor="black"
      linkColor="black"
    />
  )
}

async function SoftDrinkProductsSection() {
  const softDrinkProducts = await getProductsByFam2ID("7").catch(() => [])

  return (
    <FeaturedProductsCarousel
      title="FRISDRANKEN"
      subtitle="Verfrissende dranken voor elk moment"
      products={softDrinkProducts.slice(0, 10)}
      viewAllLink="/frisdranken"
      backgroundColor="#0F3059"
      titleColor="#D0C298"
      subtitleColor="white"
      linkColor="#D0C298"
    />
  )
}

async function WineProductsSection() {
  const wineProducts = await getProductsByFam2ID("4").catch(() => [])

  return (
    <FeaturedProductsCarousel
      title="MEEST VERKOCHTE BIER SOORTEN"
      subtitle="Uitgebreid assortiment aan pools bier en andere bier soorten"
      products={wineProducts.slice(0, 10)}
      viewAllLink="/bier"
      backgroundColor="white"
      titleColor="#D0C298"
      subtitleColor="black"
      linkColor="black"
    />
  )
}

async function NonFoodProductsSection() {
  const NonFood = await getProductsByFam2ID("22").catch(() => [])

  return (
    <FeaturedProductsCarousel
      title="Food & Non Food"
      subtitle="Food en Non-Food producten voor restaurants en Cafe Bar's"
      products={NonFood.slice(0, 10)}
      viewAllLink="/shop"
      backgroundColor="#0F3059"
      titleColor="#D0C298"
      subtitleColor="white"
      linkColor="#D0C298"
    />
  )
}

