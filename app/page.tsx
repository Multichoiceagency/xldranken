import { PromoCarousel } from "@/components/promo-carousel"
import { FeaturedProducts } from "@/components/featured-products"
import { PromotionalGrid } from "@/components/promotional-grid"
import { AboutUsSection } from "@/components/about-us-section"
import { WeeklyOffersBanner } from "@/components/weekly-offers-banner"
import { AppDownload } from "@/components/app-download"
import { ShopByCategory } from "@/components/shop-by-category"

export default function Home() {
  return (
    <div className="flex flex-col">
      <PromoCarousel />
      <div className="container mx-auto px-4 py-4 space-y-8">
        <PromotionalGrid />
        <ShopByCategory />
        <WeeklyOffersBanner />
        <FeaturedProducts />
        <AboutUsSection />
      </div>
      <AppDownload />
    </div>
  )
}

