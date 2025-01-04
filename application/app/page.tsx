import { PromoCarousel } from "@/components/promo-carousel"
import { FeaturedProducts } from "@/components/featured-products"
import { BrandsSection } from "@/components/brands-section"
import { NewsletterSocial } from "@/components/newsletter-social"
import { SiteFooter } from "@/components/site-footer"
import { PromotionalGrid } from "@/components/promotional-grid"
import { FeaturedDeals } from "@/components/featured-deals"
import { Testimonials } from "@/components/testimonials"
import { PopularCategories } from "@/components/popular-categories"
import { LatestBlogPosts } from "@/components/latest-blog-posts"

export default function Home() {
  return (
    <div className="flex flex-col">
      <div className="w-full">
        <PromoCarousel />
      </div>
      <div className="container px-4 py-8 space-y-12">
        <PopularCategories />
        <FeaturedProducts />
        <PromotionalGrid />
      </div>
      <FeaturedDeals />
      <div className="container px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Populaire Merken</h2>
        <BrandsSection />
      </div>
      <LatestBlogPosts />
      <Testimonials />
      <NewsletterSocial />
      <SiteFooter />
    </div>
  )
}

