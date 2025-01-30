import { ProductPage } from "@/components/product-page"
import { getProductById } from "@/lib/api"
import { notFound } from "next/navigation"

export default async function Page({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  return <ProductPage product={product} />
}

