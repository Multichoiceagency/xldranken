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
    <div>
      <Head>
        <title>Home - Your Store</title>
        <meta name="description" content="Discover the best deals and products on our store." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
          <PromoCarousel />
          <PromotionalGrid />
          <ShopByCategory />
          <WeeklyOffersBanner />
          <FeaturedProducts />
          <ProductList />
          <AboutUsSection />
          <AppDownload />
        </div>
  );
}
