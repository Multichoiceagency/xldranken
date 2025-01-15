import Head from "next/head";
import ProductList from "@/components/ProductList";
import { PromoCarousel } from "@/components/promo-carousel";
import { FeaturedProducts } from "@/components/featured-products";
import { PromotionalGrid } from "@/components/promotional-grid";
import { AboutUsSection } from "@/components/about-us-section";
import { WeeklyOffersBanner } from "@/components/weekly-offers-banner";
import { AppDownload } from "@/components/app-download";
import { ShopByCategory } from "@/components/shop-by-category";

export default function Home() {
  return (
    <>
      <Head>
        <title>Home - Your Store</title>
        <meta name="description" content="Discover the best deals and products on our store." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="flex flex-col">
        <div className="container mx-auto px-4 py-4 space-y-8">
          <PromoCarousel />
          <PromotionalGrid />
          <ShopByCategory />
          <WeeklyOffersBanner />
          <FeaturedProducts />
          <div className="container mx-auto px-4 py-4">
          <ProductList />
          </div>
          <AboutUsSection />
          <AppDownload />
        </div>
      </div>
    </>
  );
}
