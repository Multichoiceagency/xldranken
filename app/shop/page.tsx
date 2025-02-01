import { ShopPage } from "@/components/shop-page"

export default async function Shop(props: { searchParams: Promise<{ assortiment?: string }> }) {
  const searchParams = await props.searchParams;
  return <ShopPage initialCategory={searchParams.assortiment} />
}

