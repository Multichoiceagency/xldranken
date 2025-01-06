import { CategoryPage } from "@/components/category-page"

export default function Category({ params }: { params: { slug: string } }) {
  return <CategoryPage slug={params.slug} />
}

