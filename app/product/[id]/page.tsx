import { ProductPage } from "@/components/product-page"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return <ProductPage productId={params.id} />
}
