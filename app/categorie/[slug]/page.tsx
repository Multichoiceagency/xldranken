import { menuItemsList } from "@/lib/api";
import { getProductsByFam2ID } from "@/lib/api";
import ProductsGridClient from "@/components/product-grid-client";
import Hero from "@/components/Hero";
import { Suspense } from "react";
import { Spinner } from "@/components/Spinner";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);

  // Indien menuItemsList async is:
  // const menuItems = await menuItemsList();
  const flatMenuItems = menuItemsList.flatMap((item) => {
    if (item.submenu?.length) return item.submenu;
    return item.id ? [item] : [];
  }) as { name: string; href: string; id: string }[];

  const matched = flatMenuItems.find((item) => {
    const slugFromHref = item.href.split("/categorie/")[1];
    return slugFromHref === slug;
  });

  if (!matched) {
    return <div>404 - Categorie niet gevonden</div>;
  }

  const products = await getProductsByFam2ID(matched.id, 350, 1);

  return (
    <div>
      <Hero
        title={matched.name}
        description={`Bekijk meer dan 100 diverse ${matched.name}`}
      />

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
          <ProductsGridClient
            initialProducts={products}
            basePath={`/categorie/${params.slug}`}
            fam2id={matched.id}
          />
        </Suspense>
      </div>
    </div>
  );
}
