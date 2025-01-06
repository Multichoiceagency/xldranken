import { ProductPage } from "@/components/product-page"
import { sampleProducts } from "@/data/sample-products"

export default function Product({ params }: { params: { slug: string } }) {
  const product = sampleProducts.find(p => p.slug === params.slug)
  
  if (!product) {
    return <div>Product not found</div>
  }

  return <ProductPage product={product} />
}

