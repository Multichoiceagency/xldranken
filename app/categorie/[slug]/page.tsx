import { CategoryPage } from "@/components/category-page";
import type { ProductProps } from "@/types/product";
import { getProductsByFam2ID } from "@/lib/api";
import ProductsGridClient from "@/components/product-grid-client";
import Hero from "@/components/Hero";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { menuItemsList } from "@/lib/api"; // Adjust if path differs

export default async function Category({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  // Get submenu items and match slug to get the right ID
  const allSubmenuItems = menuItemsList.flatMap((item) => item.submenu || []);
  const matchedItem = allSubmenuItems.find((item) =>
    item.href.replace(/^\/?categorie\//, "") === slug
  );

  if (!matchedItem) {
    return <div className="p-8 text-red-600">Categorie niet gevonden: {slug}</div>;
  }

  const ProductGrid = async () => {
    const allProducts: ProductProps[] = await getProductsByFam2ID(matchedItem.id, 700, 1);
    return <ProductsGridClient initialProducts={allProducts} basePath={`/categorie/${slug}`} />;
  };

  return (
    <div>
      <Hero title={matchedItem.name} description={`Bekijk meer dan 100 diverse ${matchedItem.name}`} />
      <div className="container mx-auto px-8 py-8">
        <Suspense
          fallback={
            <div className="min-h-screen flex flex-col items-center justify-center">
              <div className="text-center">
                <Spinner size="large" className="text-[#E2B505] mb-4" />
                <h2 className="text-xl font-semibold mt-4">Producten worden geladen...</h2>
                <p className="text-gray-500 mt-2">Even geduld alstublieft</p>
              </div>
            </div>
          }
        >
          <ProductGrid />
        </Suspense>
      </div>
    </div>
  );
}
