import { menuItemsList } from "@/lib/api";
import { getProductsByFam2ID } from "@/lib/api";
import ProductsGridClient from "@/components/product-grid-client";
import Hero from "@/components/Hero";

export default async function CategoryPage(props: { params: { slug: string } }) {
  // Universeel: params altijd awaiten in body
  const params = await props.params;
  const slug = decodeURIComponent(params.slug);

  // Flatten menu/submenu
  const flatMenuItems = menuItemsList.flatMap((item) => {
    if (item.submenu?.length) return item.submenu;
    return item.id ? [item] : [];
  }) as { name: string; href: string; id: string }[];

  const matched = flatMenuItems.find((item) => {
    const slugFromHref = item.href.split("/categorie/")[1];
    return slugFromHref === slug;
  });

  if (!matched) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">404 - Categorie niet gevonden</h1>
        <p className="text-lg text-gray-500">De door jou opgegeven categorie bestaat niet.</p>
      </div>
    );
  }

  const products = await getProductsByFam2ID(matched.id, 350, 1);

  return (
    <div>
      <Hero
        title={matched.name}
        description={`Bekijk meer dan 100 diverse ${matched.name}`}
      />

      <div className="container mx-auto px-8 py-8">
        <ProductsGridClient
          initialProducts={products}
          basePath={`/categorie/${slug}`}
        />
      </div>
    </div>
  );
}