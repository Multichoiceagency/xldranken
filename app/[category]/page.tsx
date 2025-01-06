import { ShopPage } from "@/components/shop-page"

export default function CategoryPage({ params }: { params: { category: string } }) {
  return <ShopPage category={params.category} />
}

