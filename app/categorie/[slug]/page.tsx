import { menuItemsList, getProductsByFam2ID, getProductsCount } from "@/lib/api_gisteren"
import ProductsGridClient from "@/components/product-grid-client"
import Hero from "@/components/Hero"

const PRODUCTS_PER_PAGE_INITIAL = 900 // Define initial products to load

export default async function CategoryPage(props: { params: { slug: string } }) {
  const params = await props.params
  const slug = decodeURIComponent(params.slug)

  const flatMenuItems = menuItemsList.flatMap((item) => {
    if (item.submenu?.length) return item.submenu
    return item.id ? [item] : []
  }) as { name: string; href: string; id: string }[]

  const matched = flatMenuItems.find((item) => {
    if (!item.href) return false
    const slugFromHref = item.href.split("/categorie/")[1]
    return slugFromHref === slug
  })

  if (!matched || !matched.id) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">404 - Categorie niet gevonden</h1>
        <p className="text-lg text-gray-500">De door jou opgegeven categorie ({slug}) bestaat niet.</p>
      </div>
    )
  }

  // Fetch only the first page of products
  const initialProducts = await getProductsByFam2ID(matched.id, PRODUCTS_PER_PAGE_INITIAL, 1)
  // Fetch the total count of products for this category
  const totalProductsCount = await getProductsCount(matched.id)

  return (
    <div>
      <Hero
        title={matched.name}
        description={`Ontdek ons assortiment van ${matched.name.toLowerCase()}. Kwaliteit en variatie gegarandeerd.`}
      />

      <div className="container mx-auto px-4 sm:px-8 py-8">
        <ProductsGridClient
          initialProducts={initialProducts}
          fam2id={matched.id}
          totalProductsCount={totalProductsCount}
          basePath={`/categorie/${slug}`}
          initialLimit={PRODUCTS_PER_PAGE_INITIAL}
        />
      </div>
    </div>
  )
}
