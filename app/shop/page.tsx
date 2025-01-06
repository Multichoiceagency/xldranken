import { ShopPage } from "@/components/shop-page"

export default function Shop({ searchParams }: { searchParams: { assortiment?: string } }) {
  return <ShopPage initialCategory={searchParams.assortiment} />
}

