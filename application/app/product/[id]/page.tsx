import { ProductPage } from "@/components/product-page"

export default function Product({ params }: { params: { id: string } }) {
  return <ProductPage id={params.id} />
}

