export interface ProductProps {
  id_product_mysql: string
  title: string
  prix_vente_groupe: number // 🔹 Prijs als `number`
  photo1_base64: string
  arcleunik: string
  productCode: string
  prix_en_promo?: number | null // 🔹 Prijs als `number`
}
