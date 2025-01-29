import { ProductPage } from "@/components/product-page"
import product from "@/data/product.json" // ✅ Importeer het object direct

export default function Product({ params }: { params: { id: string } }) {
  console.log("DEBUG - Product Data:", product) // 🔥 Debugging

  // ✅ Controleer of het ID overeenkomt met het enige product in de JSON
  if (String(product.id_product_mysql) !== String(params.id)) {
    return <div>Product not found</div>
  }

  return <ProductPage product={product} relatedProducts={[]} />
}
