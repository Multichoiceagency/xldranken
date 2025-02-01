import { ProductPage } from "@/components/product-page"

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  if (!params?.id) {
    return <div className="text-center py-8 text-red-500">❌ Geen product-ID opgegeven.</div>
  }

  return <ProductPage productId={params.id} />
}
