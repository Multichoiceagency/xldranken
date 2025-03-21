import { AboutUsSection } from "@/components/about-us-section";
import { AppDownload } from "@/components/app-download";
import { ShopByCategory } from "@/components/shop-by-category";
import { PromoGrid } from "@/components/promo-carousel";
import { FeaturedProductsCarousel } from "@/components/featured-products-carousel";
import { getProductsByFam2ID } from "@/lib/api";

export default async function Home() {
  const alcoholProducts = await getProductsByFam2ID("10").catch(() => []);
  const wineProducts = await getProductsByFam2ID("4").catch(() => []);
  const softDrinkProducts = await getProductsByFam2ID("7").catch(() => []);
  const LovkaProducts = await getProductsByFam2ID("5").catch(() => []);
  const NonFood = await getProductsByFam2ID("6").catch(() => []);
  
  return (
    <div className="overflow-x-hidden">
      <PromoGrid />
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
      <ShopByCategory />  
      <AboutUsSection />
      <AppDownload />
    </div>
  );
}
