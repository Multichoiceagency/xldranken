import { ProductPage } from "@/components/product-page"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  // Await the params before accessing its properties
  const resolvedParams = await params
  const productId = resolvedParams.id

  console.log("Page rendering with product ID:", productId)

  return <ProductPage productId={productId} />
}

