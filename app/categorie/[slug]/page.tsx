import { CategoryPage } from "@/components/category-page"

export default async function Category(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  return <CategoryPage slug={params.slug} />
}

