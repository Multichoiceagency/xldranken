import Head from "next/head";
import ProductList from "@/components/ProductList";
import { FeaturedProducts } from "@/components/featured-products";
import { PromotionalGrid } from "@/components/promotional-grid";
import { AboutUsSection } from "@/components/about-us-section";
import { WeeklyOffersBanner } from "@/components/weekly-offers-banner";
import { AppDownload } from "@/components/app-download";
import { ShopByCategory } from "@/components/shop-by-category";
import { ProductGrid } from "@/components/ProductGrid";
import { PromoGrid } from "@/components/promo-carousel";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
          <PromoGrid />
          <PromotionalGrid />
          <ShopByCategory />
          <WeeklyOffersBanner />
          <FeaturedProducts fam2ID="23" />
          <ProductList />
          <AboutUsSection />
          <AppDownload />
        </div>
  );
}
